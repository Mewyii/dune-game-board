import { GameState } from '../services/ai/models';
import { GameModifiers } from '../services/game-modifier.service';
import { ActiveFactionType } from './faction';
import { EffectSizeType, LanguageStringAndFontSize } from './imperium-card';
import { LanguageString } from './language';
import { Player } from './player';
import { EffectReward, EffectTimingRewardChoiceOrCondition } from './reward';

export interface TechTileCard {
  name: LanguageString;
  faction?: ActiveFactionType;
  costs: number;
  effects?: EffectTimingRewardChoiceOrCondition[];
  effectSize?: EffectSizeType;
  customEffect?: LanguageStringAndFontSize;
  buyEffects?: EffectReward[];
  imageUrl?: string;
  imagePosition?: 'top' | 'center' | 'bottom';
  aiEvaluation: (player: Player, gameState: GameState) => number;
  gameModifiers?: GameModifiers;
}
