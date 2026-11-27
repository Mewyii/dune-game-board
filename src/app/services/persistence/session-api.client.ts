import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GameStateSnapshot } from './game-state-persistence.service';
import { convertNullValuesToUndefined, convertUndefinedValuesToNull } from './snapshot-json-conversion';

export interface SessionSeat {
  playerId: number;
  deviceId: string;
  isReady: boolean;
}

export interface CreatedSession {
  sessionCode: string;
  revision: number;
}

export interface JoinedSession {
  sessionCode: string;
  hostDeviceId: string;
  revision: number;
  seats: SessionSeat[];
  hostSetupValues: GameStateSnapshot;
  gameValues: GameStateSnapshot;
}

export interface SessionChanges {
  revision: number;
  seats: SessionSeat[];
  changedValues: GameStateSnapshot;
}

export interface SeatUpdate {
  revision: number;
  seats: SessionSeat[];
}

export type StateUpdateResult =
  | { isAccepted: true; revision: number }
  | { isAccepted: false; remoteChanges: SessionChanges };

export class SessionApiError extends Error {
  constructor(
    readonly status: number,
    readonly errorCode: string,
    readonly responseBody: unknown,
  ) {
    super(`Session API error ${status}: ${errorCode}`);
  }
}

/**
 * HTTP client for the PHP session backend.
 * `undefined` values can't be represented in JSON, so they are transported as `null` and converted back on arrival.
 */
@Injectable({
  providedIn: 'root',
})
export class SessionApiClient {
  private readonly apiUrl = environment.multiplayerApiUrl;

  async createSession(
    appVersion: string,
    deviceId: string,
    hostSetupValues: GameStateSnapshot,
    gameValues: GameStateSnapshot,
  ) {
    return this.post<CreatedSession>('create-session.php', {
      appVersion,
      deviceId,
      hostSetupValues: convertUndefinedValuesToNull(hostSetupValues),
      gameValues: convertUndefinedValuesToNull(gameValues),
    });
  }

  async joinSession(sessionCode: string, appVersion: string) {
    const joinedSession = await this.post<JoinedSession>('join-session.php', { sessionCode, appVersion });
    return {
      ...joinedSession,
      hostSetupValues: convertNullValuesToUndefined(joinedSession.hostSetupValues),
      gameValues: convertNullValuesToUndefined(joinedSession.gameValues),
    };
  }

  async getSessionChanges(sessionCode: string, sinceRevision: number) {
    const query = new URLSearchParams({ sessionCode, sinceRevision: String(sinceRevision) });
    const sessionChanges = await this.request<SessionChanges>(`get-session-changes.php?${query}`, { method: 'GET' });
    return convertSessionChangesFromTransport(sessionChanges);
  }

  async updateSessionState(
    sessionCode: string,
    baseRevision: number,
    changedValues: GameStateSnapshot,
  ): Promise<StateUpdateResult> {
    try {
      const { revision } = await this.post<{ revision: number }>('update-session-state.php', {
        sessionCode,
        baseRevision,
        changedValues: convertUndefinedValuesToNull(changedValues),
      });
      return { isAccepted: true, revision };
    } catch (error) {
      if (error instanceof SessionApiError && error.errorCode === 'revision-conflict') {
        const remoteChanges = convertSessionChangesFromTransport(error.responseBody as SessionChanges);
        return { isAccepted: false, remoteChanges };
      }
      throw error;
    }
  }

  async claimSeat(sessionCode: string, deviceId: string, playerId: number) {
    return this.post<SeatUpdate>('claim-seat.php', { sessionCode, deviceId, playerId });
  }

  async releaseSeat(sessionCode: string, deviceId: string, playerId: number) {
    return this.post<SeatUpdate>('release-seat.php', { sessionCode, deviceId, playerId });
  }

  async setSeatReady(sessionCode: string, deviceId: string, playerId: number, isReady: boolean) {
    return this.post<SeatUpdate>('set-seat-ready.php', { sessionCode, deviceId, playerId, isReady });
  }

  private post<TResponse>(endpoint: string, body: object) {
    return this.request<TResponse>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  private async request<TResponse>(endpoint: string, init: RequestInit) {
    const response = await fetch(`${this.apiUrl}/${endpoint}`, { ...init, cache: 'no-store' });
    const responseBody: unknown = await response.json().catch(() => undefined);

    if (!response.ok) {
      throw new SessionApiError(response.status, readErrorCode(responseBody), responseBody);
    }
    // The backend is part of this project, so its responses are trusted to match the expected type.
    return responseBody as TResponse;
  }
}

function readErrorCode(responseBody: unknown) {
  if (typeof responseBody === 'object' && responseBody !== null && 'error' in responseBody) {
    return String(responseBody.error);
  }
  return 'unknown-error';
}

function convertSessionChangesFromTransport(sessionChanges: SessionChanges): SessionChanges {
  return { ...sessionChanges, changedValues: convertNullValuesToUndefined(sessionChanges.changedValues) };
}
