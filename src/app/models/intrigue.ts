import { LanguageString } from './language';
import { EffectWithoutSeparatorAndCondition, StructuredEffects } from './reward';

export const intriguesTypes = ['complot', 'combat'] as const;
export type IntrigueType = (typeof intriguesTypes)[number];

export interface IntrigueCardBase {
  name: LanguageString;
  effects: EffectWithoutSeparatorAndCondition[];
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
