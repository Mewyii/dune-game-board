import { ActiveFactionType } from './faction';
import { LanguageString } from './language';
import { ActionType } from './location';
import { Effect, EffectReward } from './reward';

export type EffectSizeType = 'large' | 'medium' | 'small';

export interface LanguageStringAndFontSize extends LanguageString {
  fontSize?: EffectSizeType;
}

export interface ImperiumCard {
  name: LanguageString;
  faction?: ActiveFactionType;
  persuasionCosts?: number;
  fieldAccess?: ActionType[];
  agentEffects?: Effect[];
  agentEffectSize?: EffectSizeType;
  customAgentEffect?: LanguageStringAndFontSize;
  revealEffects?: Effect[];
  revealEffectSize?: EffectSizeType;
  customRevealEffect?: LanguageStringAndFontSize;
  buyEffects?: EffectReward[];
  canInfiltrate?: boolean;
  imageUrl?: string;
  cardAmount?: number;
}

export type CustomCardType = 'other' | 'unlimited' | 'limited';

export interface CustomCard extends ImperiumCard {
  type: CustomCardType;
}
