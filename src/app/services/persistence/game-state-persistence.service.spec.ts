import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { GameStatePersistenceService, PersistedValueChange } from './game-state-persistence.service';
import { GAME_STATE_STORAGE, GameStateStorage } from './game-state-storage';

describe('GameStatePersistenceService', () => {
  let storedItems: Map<string, string>;
  let persistenceService: GameStatePersistenceService;

  beforeEach(() => {
    storedItems = new Map<string, string>();
    TestBed.configureTestingModule({
      providers: [{ provide: GAME_STATE_STORAGE, useValue: createInMemoryStorage(storedItems) }],
    });
    persistenceService = TestBed.inject(GameStatePersistenceService);
  });

  it('restores a stored value into the bound subject', () => {
    storedItems.set('currentRound', '4');
    const currentRoundSubject = new BehaviorSubject<number>(0);

    const hasRestoredValue = persistenceService.bindSubjectToStorage('currentRound', currentRoundSubject, { scope: 'game' });

    expect(hasRestoredValue).toBe(true);
    expect(currentRoundSubject.value).toBe(4);
  });

  it('persists changes and removes the item when the value becomes undefined', () => {
    const currentConflictSubject = new BehaviorSubject<{ name: string } | undefined>(undefined);
    persistenceService.bindSubjectToStorage('currentConflict', currentConflictSubject, { scope: 'game' });

    currentConflictSubject.next({ name: 'Skirmish' });
    expect(storedItems.get('currentConflict')).toBe('{"name":"Skirmish"}');

    currentConflictSubject.next(undefined);
    expect(storedItems.has('currentConflict')).toBe(false);
  });

  it('converts values that are not JSON compatible', () => {
    const choicesNeedingProcessingSubject = new BehaviorSubject(new Map<number, string[]>());
    persistenceService.bindSubjectToStorage('playerRewardChoicesNeedingProcessing', choicesNeedingProcessingSubject, {
      scope: 'game',
      toStorable: (choices) => Array.from(choices.entries()),
      fromStorable: (storedEntries: [number, string[]][]) => new Map(storedEntries),
    });

    choicesNeedingProcessingSubject.next(new Map([[2, ['reward-choice-1']]]));
    persistenceService.applySnapshot({ playerRewardChoicesNeedingProcessing: [[3, ['reward-choice-7']]] });

    expect(choicesNeedingProcessingSubject.value.get(3)).toEqual(['reward-choice-7']);
    expect(persistenceService.exportSnapshot('game')).toEqual({
      playerRewardChoicesNeedingProcessing: [[3, ['reward-choice-7']]],
    });
  });

  it('exports only the values of the requested scope', () => {
    persistenceService.bindSubjectToStorage('currentRound', new BehaviorSubject(2), { scope: 'game' });
    persistenceService.bindSubjectToStorage('settings', new BehaviorSubject({ language: 'de' }), { scope: 'host-setup' });

    expect(persistenceService.exportSnapshot('game')).toEqual({ currentRound: 2 });
    expect(persistenceService.exportSnapshot('host-setup')).toEqual({ settings: { language: 'de' } });
  });

  it('reports local changes but not changes caused by applying a snapshot', () => {
    const currentRoundSubject = new BehaviorSubject<number>(1);
    persistenceService.bindSubjectToStorage('currentRound', currentRoundSubject, { scope: 'game' });
    const reportedChanges: PersistedValueChange[] = [];
    persistenceService.localChanges$.subscribe((change) => reportedChanges.push(change));

    persistenceService.applySnapshot({ currentRound: 5 });
    currentRoundSubject.next(6);

    expect(reportedChanges).toEqual([{ key: 'currentRound', scope: 'game' }]);
    expect(storedItems.get('currentRound')).toBe('6');
  });
});

function createInMemoryStorage(storedItems: Map<string, string>): GameStateStorage {
  return {
    readItem: (key) => storedItems.get(key) ?? null,
    writeItem: (key, serializedValue) => storedItems.set(key, serializedValue),
    removeItem: (key) => storedItems.delete(key),
  };
}
