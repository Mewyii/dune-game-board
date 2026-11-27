import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { GameSessionSynchronizer } from './game-session-synchronizer.service';
import { GameStatePersistenceService, GameStateSnapshot } from './game-state-persistence.service';
import { GAME_STATE_STORAGE, GameStateStorage } from './game-state-storage';
import { SessionApiClient, SessionChanges, StateUpdateResult } from './session-api.client';

interface PlayerResourcesExample {
  playerId: number;
  spice: number;
}

describe('GameSessionSynchronizer', () => {
  let sessionApiClient: FakeSessionApiClient;
  let synchronizer: GameSessionSynchronizer;
  let playerResourcesSubject: BehaviorSubject<PlayerResourcesExample[]>;

  beforeEach(() => {
    vi.useFakeTimers();
    sessionApiClient = new FakeSessionApiClient();
    TestBed.configureTestingModule({
      providers: [
        { provide: GAME_STATE_STORAGE, useValue: createInMemoryStorage() },
        { provide: SessionApiClient, useValue: sessionApiClient },
      ],
    });

    playerResourcesSubject = new BehaviorSubject(createPlayerResources(2, 5));
    TestBed.inject(GameStatePersistenceService).bindSubjectToStorage('playerResources', playerResourcesSubject, {
      scope: 'game',
    });

    synchronizer = TestBed.inject(GameSessionSynchronizer);
    synchronizer.start({
      sessionCode: 'K7MXQ2',
      revision: 4,
      syncedGameValues: { playerResources: createPlayerResources(2, 5) },
      seats: [],
    });
  });

  afterEach(() => {
    synchronizer.stop();
    vi.useRealTimers();
  });

  it('sends local changes based on the last known revision', async () => {
    playerResourcesSubject.next(createPlayerResources(3, 5));

    await synchronizer.synchronize();

    expect(sessionApiClient.sentUpdates).toEqual([
      { baseRevision: 4, changedValues: { playerResources: createPlayerResources(3, 5) } },
    ]);
  });

  it('merges remote changes into conflicting local changes and sends the merged value again', async () => {
    sessionApiClient.queuedUpdateResults.push({
      isAccepted: false,
      remoteChanges: createSessionChanges(5, { playerResources: createPlayerResources(2, 1) }),
    });
    playerResourcesSubject.next(createPlayerResources(3, 5));

    await synchronizer.synchronize();

    const mergedPlayerResources = createPlayerResources(3, 1);
    expect(playerResourcesSubject.value).toEqual(mergedPlayerResources);
    expect(sessionApiClient.sentUpdates[1]).toEqual({
      baseRevision: 5,
      changedValues: { playerResources: mergedPlayerResources },
    });
  });

  it('applies received remote changes when there are no local changes', async () => {
    sessionApiClient.queuedSessionChanges.push(createSessionChanges(6, { playerResources: createPlayerResources(2, 0) }));

    await synchronizer.synchronize();

    expect(playerResourcesSubject.value).toEqual(createPlayerResources(2, 0));
    expect(sessionApiClient.sentUpdates).toEqual([]);
  });
});

/** Player 1 and player 2 with the given amounts of spice. */
function createPlayerResources(spiceOfPlayerOne: number, spiceOfPlayerTwo: number): PlayerResourcesExample[] {
  return [
    { playerId: 1, spice: spiceOfPlayerOne },
    { playerId: 2, spice: spiceOfPlayerTwo },
  ];
}

function createSessionChanges(revision: number, changedValues: GameStateSnapshot): SessionChanges {
  return { revision, seats: [], changedValues };
}

class FakeSessionApiClient {
  sentUpdates: { baseRevision: number; changedValues: GameStateSnapshot }[] = [];
  queuedUpdateResults: StateUpdateResult[] = [];
  queuedSessionChanges: SessionChanges[] = [];

  async updateSessionState(_sessionCode: string, baseRevision: number, changedValues: GameStateSnapshot) {
    this.sentUpdates.push({ baseRevision, changedValues });
    return this.queuedUpdateResults.shift() ?? { isAccepted: true, revision: baseRevision + 1 };
  }

  async getSessionChanges(_sessionCode: string, sinceRevision: number) {
    return this.queuedSessionChanges.shift() ?? createSessionChanges(sinceRevision, {});
  }
}

function createInMemoryStorage(): GameStateStorage {
  const storedItems = new Map<string, string>();
  return {
    readItem: (key) => storedItems.get(key) ?? null,
    writeItem: (key, serializedValue) => storedItems.set(key, serializedValue),
    removeItem: (key) => storedItems.delete(key),
  };
}
