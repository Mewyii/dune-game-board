import { ActionField, LanguageString, Effect, EffectReward } from '.';

export const passiveFactionTypes = ['landsraad', 'choam'] as const;

export const activeFactionTypes = ['emperor', 'guild', 'bene', 'fremen'] as const;

export type PassiveFactionType = (typeof passiveFactionTypes)[number];
export type ActiveFactionType = (typeof activeFactionTypes)[number];
export type FactionType = PassiveFactionType | ActiveFactionType;

export type FactionInfluenceReward = { [key: number]: EffectReward[] };

export interface Faction {
  title: LanguageString;
  type: FactionType;
  position: {
    marginTop: number;
    marginLeft: number;
    width?: number;
    height?: number;
  };
  actionFields: ActionField[];
  primaryColor: string;
  secondaryColor: string;
  pathToSymbol: string;
  hasScoreBoard?: boolean;
  influenceRewards?: FactionInfluenceReward;
}

export interface FactionInfluence {
  type: FactionType;
  amount?: number;
}
