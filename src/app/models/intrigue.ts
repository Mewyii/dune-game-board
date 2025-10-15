import { EffectChoiceConversionMultiplierOrReward, StructuredEffect } from './effect';
import { LanguageString } from './language';

export const intriguesTypes = ['complot', 'combat', 'combined'] as const;
export type IntrigueType = (typeof intriguesTypes)[number];

export interface IntrigueCardBase {
  name: LanguageString;
  plotEffects: EffectChoiceConversionMultiplierOrReward[];
  combatEffects: EffectChoiceConversionMultiplierOrReward[];
  type: IntrigueType;
  amount: number;
}

export interface IntrigueCombatCard extends IntrigueCardBase {
  type: 'combat';
}

export interface IntriguePlotCard extends IntrigueCardBase {
  type: 'complot';
}

export interface IntrigueCombinedCard extends IntrigueCardBase {
  type: 'combined';
}

export type IntrigueCard = IntrigueCombatCard | IntriguePlotCard | IntrigueCombinedCard;

export type IntrigueDeckCard = Omit<IntrigueCard, 'amount'> & {
  id: string;
  structuredPlotEffects: StructuredEffect[];
  structuredCombatEffects: StructuredEffect[];
};

export interface PlayerIntrigueStack {
  playerId: number;
  intrigues: IntrigueDeckCard[];
}
