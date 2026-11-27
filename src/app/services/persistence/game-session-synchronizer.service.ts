import { inject, Injectable } from '@angular/core';
import { isEqual } from 'lodash';
import { BehaviorSubject, filter, Subscription } from 'rxjs';
import { GameStatePersistenceService, GameStateSnapshot } from './game-state-persistence.service';
import { SessionApiClient, SessionApiError, SessionChanges, SessionSeat } from './session-api.client';
import { mergeConcurrentChanges } from './session-state-merge';
import { toJsonCompatibleValue } from './snapshot-json-conversion';

export type SessionSyncStatus = 'inactive' | 'synchronized' | 'connection-error' | 'session-not-found';

export interface SessionSyncStartOptions {
  sessionCode: string;
  revision: number;
  /** The game values of the session at `revision`. They are the base for merging concurrent changes. */
  syncedGameValues: GameStateSnapshot;
  seats: SessionSeat[];
}

const pollIntervalInMs = 1500;
const delayBeforeSendingChangesInMs = 250;
const maxSendAttemptsPerSynchronization = 5;

/**
 * Keeps the `game` values of the local persistence in sync with a session of the backend.
 * Local changes are sent with the revision they are based on. If another device changed the session in the meantime,
 * the remote changes are merged into the local values (see `mergeConcurrentChanges`) and the changes are sent again.
 */
@Injectable({
  providedIn: 'root',
})
export class GameSessionSynchronizer {
  private persistenceService = inject(GameStatePersistenceService);
  private sessionApiClient = inject(SessionApiClient);

  private sessionCode: string | undefined;
  private revision = 0;
  private syncedGameValues: GameStateSnapshot = {};
  private readonly keysWithUnsentChanges = new Set<string>();
  private isSynchronizing = false;
  /** Increased on every start and stop, so responses of a previous session are ignored. */
  private sessionGeneration = 0;

  private localChangesSubscription: Subscription | undefined;
  private pollIntervalId: ReturnType<typeof setInterval> | undefined;
  private sendChangesTimeoutId: ReturnType<typeof setTimeout> | undefined;

  private statusSubject = new BehaviorSubject<SessionSyncStatus>('inactive');
  status$ = this.statusSubject.asObservable();

  private seatsSubject = new BehaviorSubject<SessionSeat[]>([]);
  seats$ = this.seatsSubject.asObservable();

  get seats() {
    return this.seatsSubject.value;
  }

  start(options: SessionSyncStartOptions) {
    this.stop();
    this.sessionCode = options.sessionCode;
    this.revision = options.revision;
    this.syncedGameValues = { ...options.syncedGameValues };
    this.seatsSubject.next(options.seats);
    this.statusSubject.next('synchronized');

    this.localChangesSubscription = this.persistenceService.localChanges$
      .pipe(filter((change) => change.scope === 'game'))
      .subscribe((change) => {
        this.keysWithUnsentChanges.add(change.key);
        this.scheduleSendingChanges();
      });
    this.pollIntervalId = setInterval(() => void this.synchronize(), pollIntervalInMs);
  }

  stop() {
    this.sessionGeneration++;
    this.localChangesSubscription?.unsubscribe();
    this.localChangesSubscription = undefined;
    clearInterval(this.pollIntervalId);
    clearTimeout(this.sendChangesTimeoutId);
    this.sessionCode = undefined;
    this.keysWithUnsentChanges.clear();
    this.seatsSubject.next([]);
    this.statusSubject.next('inactive');
  }

  updateSeats(seats: SessionSeat[]) {
    if (!isEqual(seats, this.seatsSubject.value)) {
      this.seatsSubject.next(seats);
    }
  }

  /** Sends unsent local changes or, if there are none, receives the changes of other devices. */
  async synchronize() {
    const sessionCode = this.sessionCode;
    if (!sessionCode || this.isSynchronizing) {
      return;
    }

    this.isSynchronizing = true;
    const sessionGeneration = this.sessionGeneration;
    try {
      if (this.keysWithUnsentChanges.size > 0) {
        await this.sendUnsentChanges(sessionCode, sessionGeneration);
      } else {
        await this.receiveRemoteChanges(sessionCode, sessionGeneration);
      }
      this.setStatusIfSessionIsCurrent(sessionGeneration, 'synchronized');
    } catch (error) {
      this.handleSynchronizationError(error, sessionGeneration);
    } finally {
      this.isSynchronizing = false;
    }

    if (this.isCurrentSession(sessionGeneration) && this.keysWithUnsentChanges.size > 0) {
      this.scheduleSendingChanges();
    }
  }

  private async sendUnsentChanges(sessionCode: string, sessionGeneration: number) {
    for (let attempt = 1; attempt <= maxSendAttemptsPerSynchronization; attempt++) {
      const sentKeys = [...this.keysWithUnsentChanges];
      if (sentKeys.length === 0) {
        return;
      }

      const sentValues = this.exportJsonCompatibleValues(sentKeys);
      this.keysWithUnsentChanges.clear();

      const result = await this.sessionApiClient
        .updateSessionState(sessionCode, this.revision, sentValues)
        .catch((error: unknown) => {
          this.markKeysAsUnsent(sentKeys);
          throw error;
        });
      if (!this.isCurrentSession(sessionGeneration)) {
        return;
      }

      if (result.isAccepted) {
        this.revision = result.revision;
        Object.assign(this.syncedGameValues, sentValues);
        return;
      }

      this.markKeysAsUnsent(sentKeys);
      this.integrateRemoteChanges(result.remoteChanges);
    }
  }

  private async receiveRemoteChanges(sessionCode: string, sessionGeneration: number) {
    const remoteChanges = await this.sessionApiClient.getSessionChanges(sessionCode, this.revision);
    if (!this.isCurrentSession(sessionGeneration)) {
      return;
    }

    if (remoteChanges.revision > this.revision) {
      this.integrateRemoteChanges(remoteChanges);
    } else {
      this.updateSeats(remoteChanges.seats);
    }
  }

  /**
   * Applies the remote changes. Values with unsent local changes are merged, and stay marked as unsent
   * unless the merge result equals the remote value.
   */
  private integrateRemoteChanges(remoteChanges: SessionChanges) {
    const valuesToApply: GameStateSnapshot = {};

    for (const [key, remoteValue] of Object.entries(remoteChanges.changedValues)) {
      if (this.keysWithUnsentChanges.has(key)) {
        const localValue = this.exportJsonCompatibleValues([key])[key];
        const mergedValue = mergeConcurrentChanges(this.syncedGameValues[key], localValue, remoteValue);
        if (isEqual(mergedValue, remoteValue)) {
          this.keysWithUnsentChanges.delete(key);
        }
        if (!isEqual(mergedValue, localValue)) {
          valuesToApply[key] = mergedValue;
        }
      } else {
        valuesToApply[key] = remoteValue;
      }
      this.syncedGameValues[key] = remoteValue;
    }

    // Set before applying, so changes the game logic makes in reaction to the applied values are based on the new revision.
    this.revision = remoteChanges.revision;
    this.updateSeats(remoteChanges.seats);
    this.persistenceService.applySnapshot(valuesToApply);
  }

  private exportJsonCompatibleValues(keys: string[]) {
    const values = this.persistenceService.exportValues(keys);
    for (const key of Object.keys(values)) {
      values[key] = toJsonCompatibleValue(values[key]);
    }
    return values;
  }

  private markKeysAsUnsent(keys: string[]) {
    for (const key of keys) {
      this.keysWithUnsentChanges.add(key);
    }
  }

  private scheduleSendingChanges() {
    clearTimeout(this.sendChangesTimeoutId);
    this.sendChangesTimeoutId = setTimeout(() => void this.synchronize(), delayBeforeSendingChangesInMs);
  }

  private handleSynchronizationError(error: unknown, sessionGeneration: number) {
    if (!this.isCurrentSession(sessionGeneration)) {
      return;
    }

    if (error instanceof SessionApiError && error.errorCode === 'session-not-found') {
      clearInterval(this.pollIntervalId);
      this.sessionCode = undefined;
      this.statusSubject.next('session-not-found');
      return;
    }

    console.error('Game session synchronization failed.', error);
    this.statusSubject.next('connection-error');
  }

  private setStatusIfSessionIsCurrent(sessionGeneration: number, status: SessionSyncStatus) {
    if (this.isCurrentSession(sessionGeneration) && this.statusSubject.value !== status) {
      this.statusSubject.next(status);
    }
  }

  private isCurrentSession(sessionGeneration: number) {
    return this.sessionGeneration === sessionGeneration;
  }
}
