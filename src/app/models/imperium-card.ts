import { ActiveFactionType } from './faction';
import { LanguageString } from './language';
import { ActionType } from './location';
import { Reward } from './reward';

export interface LanguageStringAndFontSize extends LanguageString {
  fontSize?: 'medium' | 'small';
}

export interface ImperiumCard {
  name: LanguageString;
  faction?: ActiveFactionType;
  persuasionCosts?: number;
  fieldAccess?: ActionType[];
  agentEffects?: Reward[];
  customAgentEffect?: LanguageStringAndFontSize;
  revealEffects?: Reward[];
  customRevealEffect?: LanguageStringAndFontSize;
  buyEffects?: Reward[];
  imageUrl?: string;
  cardAmount?: number;
}

export type CustomCardType = 'other' | 'unlimited' | 'limited';

export interface CustomCard extends ImperiumCard {
  type: CustomCardType;
}
