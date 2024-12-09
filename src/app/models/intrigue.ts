import { LanguageString } from './language';
import { Reward } from './reward';

export const intriguesTypes = ['complot', 'combat'] as const;
export type IntrigueType = (typeof intriguesTypes)[number];

export interface IntrigueCardBase {
  name: LanguageString;
  effects: Reward[];
  type: IntrigueType;
}

export interface IntrigueCard extends IntrigueCardBase {
  amount: number;
}

export interface IntrigueDeckCard extends IntrigueCardBase {
  id: string;
}

export interface PlayerIntrigueStack {
  playerId: number;
  intrigues: IntrigueDeckCard[];
}
