import { GameState } from '../services/ai/models';
import { GameModifiers } from '../services/game-modifier.service';
import { ActiveFactionType } from './faction';
import { LanguageStringAndFontSize } from './imperium-card';
import { LanguageString } from './language';
import { Player } from './player';
import { Effect, EffectReward } from './reward';

export interface TechTileCard {
  name: LanguageString;
  faction?: ActiveFactionType;
  costs: number;
  effects?: Effect[];
  customEffect?: LanguageStringAndFontSize;
  buyEffects?: EffectReward[];
  imageUrl?: string;
  imagePosition?: 'top' | 'center' | 'bottom';
  aiEvaluation: (player: Player, gameState: GameState) => number;
  gameModifiers?: GameModifiers;
}
