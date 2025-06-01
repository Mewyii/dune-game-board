import { LanguageString } from './language';
import { EffectChoiceConversionOrReward, StructuredEffects } from './reward';

export const intriguesTypes = ['complot', 'combat'] as const;
export type IntrigueType = (typeof intriguesTypes)[number];

export interface IntrigueCardBase {
  name: LanguageString;
  effects: EffectChoiceConversionOrReward[];
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
