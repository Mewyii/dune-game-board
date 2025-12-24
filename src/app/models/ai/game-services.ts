import { AIManager } from 'src/app/services/ai/ai.manager';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService } from 'src/app/services/game-modifier.service';
import { LocationManager } from 'src/app/services/location-manager.service';
import { LoggingService } from 'src/app/services/log.service';
import { PlayersService } from 'src/app/services/players.service';
import { TurnInfoService } from 'src/app/services/turn-info.service';

export interface GameServices {
  gameManager: Pick<
    GameManager,
    'addRewardToPlayer' | 'payCostForPlayer' | 'resolveRewardChoices' | 'resolveStructuredEffects' | 'getAllBuyableCards'
  >;
  playersService: PlayersService;
  gameModifierService: GameModifiersService;
  locationManager: LocationManager;
  loggingService: LoggingService;
  audioManager: AudioManager;
  turnInfoService: TurnInfoService;
  aiManager: AIManager;
}
