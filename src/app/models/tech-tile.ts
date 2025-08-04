import { Effect, EffectReward } from './effect';
import { ActiveFactionType } from './faction';
import { EffectSizeType, LanguageStringAndFontSize } from './imperium-card';
import { LanguageString } from './language';

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
}
