import { AICardsService } from 'src/app/services/ai/ai-cards.service';
import { AIEffectEvaluationService } from 'src/app/services/ai/ai.effect-evaluation.service';
import { AIManager } from 'src/app/services/ai/ai.manager';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { BoardSpaceService } from 'src/app/services/board-space.service';
import { CardsService } from 'src/app/services/cards.service';
import { CombatManager } from 'src/app/services/combat-manager.service';
import { EffectsService } from 'src/app/services/game-effects.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService } from 'src/app/services/game-modifier.service';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { LocationManager } from 'src/app/services/location-manager.service';
import { LoggingService } from 'src/app/services/log.service';
import { PlayerAgentsService } from 'src/app/services/player-agents.service';
import { PlayerResourcesService } from 'src/app/services/player-resources.service';
import { PlayersService } from 'src/app/services/players.service';
import { TurnInfoService } from 'src/app/services/turn-info.service';

export interface GameServices {
  gameManager: Pick<GameManager, 'resolveRewardChoices' | 'acquireImperiumCard'>;
  playersService: PlayersService;
  playerResourcesService: PlayerResourcesService;
  gameModifierService: GameModifiersService;
  locationManager: LocationManager;
  loggingService: LoggingService;
  audioManager: AudioManager;
  turnInfoService: TurnInfoService;
  combatManager: CombatManager;
  playerAgentsService: PlayerAgentsService;
  intriguesService: IntriguesService;
  boardSpaceService: BoardSpaceService;
  effectsService: EffectsService;
  cardsService: CardsService;
  aiManager: AIManager;
  aiCardsService: AICardsService;
  aiEffectEvaluationService: AIEffectEvaluationService;
}
