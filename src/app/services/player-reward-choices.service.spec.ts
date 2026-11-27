import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { GAME_STATE_STORAGE, GameStateStorage } from './persistence/game-state-storage';
import { PlayerRewardChoicesService } from './player-reward-choices.service';

describe('PlayerRewardChoicesService', () => {
  let rewardChoicesService: PlayerRewardChoicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: GAME_STATE_STORAGE, useValue: createInMemoryStorage() }],
    });
    rewardChoicesService = TestBed.inject(PlayerRewardChoicesService);
  });

  it('clears the choices needing processing on reset, so a re-added player starts without open choices', async () => {
    const playerId = 3;
    rewardChoicesService.addPlayerCustomChoice(playerId, 'Trash a card');

    rewardChoicesService.resetPlayerRewardChoices();

    const choicesNeedingProcessing = await firstValueFrom(
      rewardChoicesService.playerRewardChoicesNeedingProcessing$(playerId),
    );
    expect(choicesNeedingProcessing).toBeUndefined();
  });
});

function createInMemoryStorage(): GameStateStorage {
  const storedItems = new Map<string, string>();
  return {
    readItem: (key) => storedItems.get(key) ?? null,
    writeItem: (key, serializedValue) => {
      storedItems.set(key, serializedValue);
    },
    removeItem: (key) => {
      storedItems.delete(key);
    },
  };
}
