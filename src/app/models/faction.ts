import { ActionField, LanguageString, Reward } from '.';

export const factionTypes = ['imperium', 'landsraad', 'guild', 'bene', 'fremen', 'choam'] as const;

export type FactionType = (typeof factionTypes)[number];

export interface Faction {
  title: LanguageString;
  type: FactionType;
  position: {
    marginBottom: number;
    marginLeft: number;
    width?: number;
    height?: number;
  };
  actionFields: ActionField[];
  primaryColor: string;
  secondaryColor: string;
  pathToSymbol: string;
  hasScoreBoard?: boolean;
  levelTwoReward?: Reward[];
  levelFourReward?: Reward[];
}

export interface FactionInfluence {
  type: FactionType;
  amount?: number;
}
