import { mergeConcurrentChanges } from './session-state-merge';

describe('mergeConcurrentChanges', () => {
  it('keeps the changes of both devices when they changed different players', () => {
    const baseResources = [createPlayerResources(1, 2), createPlayerResources(2, 5)];
    const localResources = [createPlayerResources(1, 4), createPlayerResources(2, 5)];
    const remoteResources = [createPlayerResources(1, 2), createPlayerResources(2, 3)];

    const mergedResources = mergeConcurrentChanges(baseResources, localResources, remoteResources);

    expect(mergedResources).toEqual([createPlayerResources(1, 4), createPlayerResources(2, 3)]);
  });

  it('merges cards removed from the same hand on both devices', () => {
    const baseHands = [{ playerId: 1, cards: [{ id: 'dagger' }, { id: 'signet-ring' }, { id: 'diplomacy' }] }];
    const localHands = [{ playerId: 1, cards: [{ id: 'signet-ring' }, { id: 'diplomacy' }] }];
    const remoteHands = [{ playerId: 1, cards: [{ id: 'dagger' }, { id: 'signet-ring' }] }];

    const mergedHands = mergeConcurrentChanges(baseHands, localHands, remoteHands);

    expect(mergedHands).toEqual([{ playerId: 1, cards: [{ id: 'signet-ring' }] }]);
  });

  it('keeps the entries both devices appended to a log', () => {
    const baseLog = [
      { playerId: 1, type: 'card-play', cardName: 'Dagger' },
      { playerId: 1, type: 'card-buy', cardName: 'Spice Hunt' },
    ];
    const localLog = [...baseLog, { playerId: 2, type: 'card-discard', cardName: 'Diplomacy' }];
    const remoteLog = [...baseLog, { playerId: 3, type: 'intrigue-trash', cardName: 'Bribery' }];

    const mergedLog = mergeConcurrentChanges(baseLog, localLog, remoteLog);

    expect(mergedLog).toEqual([...remoteLog, localLog[2]]);
  });

  it('merges entries of persisted maps by their key', () => {
    const baseEntries = [[1, ['reward-choice-1']]];
    const localEntries = [
      [1, ['reward-choice-1']],
      [2, ['reward-choice-4']],
    ];
    const remoteEntries: unknown[] = [];

    const mergedEntries = mergeConcurrentChanges(baseEntries, localEntries, remoteEntries);

    expect(mergedEntries).toEqual([[2, ['reward-choice-4']]]);
  });

  it('keeps the order of a deck that was shuffled remotely', () => {
    const baseDeck = [{ id: 'card-a' }, { id: 'card-b' }, { id: 'card-c' }, { id: 'card-d' }];
    const localDeck = [{ id: 'card-a' }, { id: 'card-b' }, { id: 'card-c' }];
    const remoteDeck = [{ id: 'card-c' }, { id: 'card-a' }, { id: 'card-d' }, { id: 'card-b' }];

    const mergedDeck = mergeConcurrentChanges(baseDeck, localDeck, remoteDeck);

    expect(mergedDeck).toEqual([{ id: 'card-c' }, { id: 'card-a' }, { id: 'card-b' }]);
  });

  it('prefers the local value when both devices changed the same value', () => {
    expect(mergeConcurrentChanges(3, 4, 5)).toBe(4);
  });
});

function createPlayerResources(playerId: number, spice: number) {
  return { playerId, resources: [{ type: 'spice', amount: spice }] };
}
