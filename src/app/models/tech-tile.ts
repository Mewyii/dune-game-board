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
}
