import { LanguageString } from './language';
import { EffectRewardOrChoice, StructuredEffects } from './reward';

export const intriguesTypes = ['complot', 'combat'] as const;
export type IntrigueType = (typeof intriguesTypes)[number];

export interface IntrigueCardBase {
  name: LanguageString;
  effects: EffectRewardOrChoice[];
  type: IntrigueType;
}

export interface IntrigueCard extends IntrigueCardBase {
  amount: number;
}

export interface IntrigueDeckCard extends IntrigueCardBase {
  id: string;
  structuredEffects?: StructuredEffects;
}

export interface PlayerIntrigueStack {
  playerId: number;
  intrigues: IntrigueDeckCard[];
}
