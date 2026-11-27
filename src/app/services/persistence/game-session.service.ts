import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { appVersion } from 'src/app/constants/version';
import { GameSessionSynchronizer, SessionSyncStatus } from './game-session-synchronizer.service';
import { GameStatePersistenceService, GameStateSnapshot } from './game-state-persistence.service';
import { GAME_STATE_STORAGE } from './game-state-storage';
import { SessionApiClient, SessionApiError, SessionSeat } from './session-api.client';
import {
  convertNullValuesToUndefined,
  convertUndefinedValuesToNull,
  toJsonCompatibleValue,
} from './snapshot-json-conversion';

export interface ActiveGameSession {
  sessionCode: string;
  hostDeviceId: string;
}

interface LocalValuesBackup {
  hostSetupValues: GameStateSnapshot;
  gameValues: GameStateSnapshot;
}

const deviceIdStorageKey = 'multiplayerDeviceId';
const activeSessionStorageKey = 'multiplayerActiveSession';
const localValuesBackupStorageKey = 'multiplayerLocalValuesBackup';

/**
 * Creates, joins and leaves multiplayer sessions.
 * - The host uploads its `host-setup` values (game content, configured cards) once. They are fixed for the session.
 * - Joining players back up their own local values and get them back when they leave the session.
 * - Without a session, this device counts as host and controls all players (offline play).
 */
@Injectable({
  providedIn: 'root',
})
export class GameSessionService {
  private persistenceService = inject(GameStatePersistenceService);
  private sessionApiClient = inject(SessionApiClient);
  private synchronizer = inject(GameSessionSynchronizer);
  private storage = inject(GAME_STATE_STORAGE);

  readonly deviceId = this.loadOrCreateDeviceId();

  private activeSessionSubject = new BehaviorSubject<ActiveGameSession | undefined>(undefined);
  activeSession$ = this.activeSessionSubject.asObservable();
  isHost$ = this.activeSession$.pipe(map((session) => this.isHostOfSession(session)));
  seats$ = this.synchronizer.seats$;
  syncStatus$ = this.synchronizer.status$;
  playerIdsControlledByThisDevice$ = combineLatest([this.activeSession$, this.seats$]).pipe(
    map(([session, seats]) => (session ? this.getPlayerIdsSeatedOnThisDevice(seats) : undefined)),
  );

  constructor() {
    this.resumeStoredSession();
  }

  get activeSession() {
    return this.activeSessionSubject.value;
  }

  get seats() {
    return this.synchronizer.seats;
  }

  /** Only the host runs the AI players. */
  get isHost() {
    return this.isHostOfSession(this.activeSession);
  }

  isPlayerControlledByThisDevice(playerId: number) {
    if (!this.activeSession) {
      return true;
    }
    return this.getPlayerIdsSeatedOnThisDevice(this.synchronizer.seats).includes(playerId);
  }

  createInviteLink(sessionCode: string) {
    const inviteUrl = new URL('game-board', document.baseURI);
    inviteUrl.searchParams.set('session', sessionCode);
    return inviteUrl.href;
  }

  async createSession() {
    this.throwIfSessionIsActive();

    const hostSetupValues = this.persistenceService.exportSnapshot('host-setup');
    const gameValues = this.persistenceService.exportSnapshot('game');
    const createdSession = await this.sessionApiClient.createSession(
      String(appVersion),
      this.deviceId,
      hostSetupValues,
      gameValues,
    );

    this.activateSession({ sessionCode: createdSession.sessionCode, hostDeviceId: this.deviceId });
    this.synchronizer.start({
      sessionCode: createdSession.sessionCode,
      revision: createdSession.revision,
      syncedGameValues: convertToJsonCompatibleValues(gameValues),
      seats: [],
    });
    return createdSession.sessionCode;
  }

  /** Throws a `SessionApiError` with the code 'session-not-found' or 'app-version-mismatch' if joining isn't possible. */
  async joinSession(sessionCode: string) {
    this.throwIfSessionIsActive();

    const joinedSession = await this.sessionApiClient.joinSession(sessionCode.trim().toUpperCase(), String(appVersion));
    const session: ActiveGameSession = {
      sessionCode: joinedSession.sessionCode,
      hostDeviceId: joinedSession.hostDeviceId,
    };
    if (!this.isHostOfSession(session)) {
      this.backUpLocalValues();
    }

    this.activateSession(session);
    // Started before applying the session values, so changes the game logic makes in reaction to them are synchronized.
    this.synchronizer.start({
      sessionCode: session.sessionCode,
      revision: joinedSession.revision,
      syncedGameValues: joinedSession.gameValues,
      seats: joinedSession.seats,
    });
    this.persistenceService.applySnapshot({ ...joinedSession.hostSetupValues, ...joinedSession.gameValues });
  }

  async leaveSession() {
    const session = this.activeSession;
    if (!session) {
      return;
    }

    const seatedPlayerIds = this.getPlayerIdsSeatedOnThisDevice(this.synchronizer.seats);
    this.synchronizer.stop();
    this.activeSessionSubject.next(undefined);
    this.storage.removeItem(activeSessionStorageKey);
    this.restoreLocalValues();

    const seatReleases = seatedPlayerIds.map((playerId) =>
      this.sessionApiClient.releaseSeat(session.sessionCode, this.deviceId, playerId),
    );
    await Promise.allSettled(seatReleases);
  }

  /** Throws a `SessionApiError` with the code 'seat-taken' if another device already controls the player. */
  async claimSeat(playerId: number) {
    const session = this.getActiveSessionOrThrow();
    try {
      const seatUpdate = await this.sessionApiClient.claimSeat(session.sessionCode, this.deviceId, playerId);
      this.synchronizer.updateSeats(seatUpdate.seats);
    } catch (error) {
      this.updateSeatsFromErrorResponse(error);
      throw error;
    }
  }

  /** Players can release their own seats, the host can release every seat. */
  async releaseSeat(playerId: number) {
    const session = this.getActiveSessionOrThrow();
    const seatUpdate = await this.sessionApiClient.releaseSeat(session.sessionCode, this.deviceId, playerId);
    this.synchronizer.updateSeats(seatUpdate.seats);
  }

  async setSeatReady(playerId: number, isReady: boolean) {
    const session = this.getActiveSessionOrThrow();
    const seatUpdate = await this.sessionApiClient.setSeatReady(session.sessionCode, this.deviceId, playerId, isReady);
    this.synchronizer.updateSeats(seatUpdate.seats);
  }

  /** After a reload the session continues from revision 0, so the first synchronization receives all session values. */
  private resumeStoredSession() {
    const serializedSession = this.storage.readItem(activeSessionStorageKey);
    if (!serializedSession) {
      return;
    }

    const session = JSON.parse(serializedSession) as ActiveGameSession;
    this.activeSessionSubject.next(session);
    this.synchronizer.start({ sessionCode: session.sessionCode, revision: 0, syncedGameValues: {}, seats: [] });
    void this.synchronizer.synchronize();
  }

  private activateSession(session: ActiveGameSession) {
    this.storage.writeItem(activeSessionStorageKey, JSON.stringify(session));
    this.activeSessionSubject.next(session);
  }

  /** An existing backup is kept, so the values from before the first session aren't overwritten by session values. */
  private backUpLocalValues() {
    if (this.storage.readItem(localValuesBackupStorageKey) !== null) {
      return;
    }

    const backup: LocalValuesBackup = {
      hostSetupValues: convertUndefinedValuesToNull(this.persistenceService.exportSnapshot('host-setup')),
      gameValues: convertUndefinedValuesToNull(this.persistenceService.exportSnapshot('game')),
    };
    this.storage.writeItem(localValuesBackupStorageKey, JSON.stringify(backup));
  }

  private restoreLocalValues() {
    const serializedBackup = this.storage.readItem(localValuesBackupStorageKey);
    if (serializedBackup === null) {
      return;
    }

    const backup = JSON.parse(serializedBackup) as LocalValuesBackup;
    this.persistenceService.applySnapshot({
      ...convertNullValuesToUndefined(backup.hostSetupValues),
      ...convertNullValuesToUndefined(backup.gameValues),
    });
    this.storage.removeItem(localValuesBackupStorageKey);
  }

  private updateSeatsFromErrorResponse(error: unknown) {
    if (!(error instanceof SessionApiError)) {
      return;
    }
    const responseBody = error.responseBody as { seats?: SessionSeat[] } | undefined;
    if (responseBody?.seats) {
      this.synchronizer.updateSeats(responseBody.seats);
    }
  }

  private getPlayerIdsSeatedOnThisDevice(seats: SessionSeat[]) {
    return seats.filter((seat) => seat.deviceId === this.deviceId).map((seat) => seat.playerId);
  }

  private isHostOfSession(session: ActiveGameSession | undefined) {
    return !session || session.hostDeviceId === this.deviceId;
  }

  private getActiveSessionOrThrow() {
    const session = this.activeSession;
    if (!session) {
      throw new Error('There is no active game session.');
    }
    return session;
  }

  private throwIfSessionIsActive() {
    if (this.activeSession) {
      throw new Error(`Leave the game session ${this.activeSession.sessionCode} first.`);
    }
  }

  private loadOrCreateDeviceId() {
    const storedDeviceId = this.storage.readItem(deviceIdStorageKey);
    if (storedDeviceId) {
      return storedDeviceId;
    }

    const deviceId = crypto.randomUUID();
    this.storage.writeItem(deviceIdStorageKey, deviceId);
    return deviceId;
  }
}

function convertToJsonCompatibleValues(values: GameStateSnapshot) {
  const jsonCompatibleValues: GameStateSnapshot = {};
  for (const [key, value] of Object.entries(values)) {
    jsonCompatibleValues[key] = toJsonCompatibleValue(value);
  }
  return jsonCompatibleValues;
}
