import { TechTileAIEvaluationType } from '../constants/tech-tiles-ai-evaluations';
import { GameModifiers } from '../services/game-modifier.service';
import { ActiveFactionType } from './faction';
import { EffectSizeType, LanguageStringAndFontSize } from './imperium-card';
import { LanguageString } from './language';
import { Effect, EffectReward } from './reward';

export interface TechTileCard {
  name: LanguageString;
  faction?: ActiveFactionType;
  costs: number;
  effects?: Effect[];
  effectSize?: EffectSizeType;
  customEffect?: LanguageStringAndFontSize;
  buyEffects?: EffectReward[];
  imageUrl?: string;
  imagePosition?: 'top' | 'center' | 'bottom';
  aiEvaluation?: TechTileAIEvaluationType;
  gameModifiers?: GameModifiers;
}
