import { FactionInfluence, FactionType, LanguageString, Reward } from '.';

export interface DuneLocation {
  color: string;
  position: {
    marginTop: number;
    marginLeft: number;
  };
  actionField: ActionField;
  ownerReward?: Reward;
}

export interface ActionField {
  title: LanguageString;
  actionType: ActionType;
  costs?: Reward[];
  rewards: Reward[];
  pathToImage: string;
  isBattlefield?: boolean;
  hasRewardOptions?: boolean;
  requiresInfluence?: FactionInfluence;
  customWidth?: string;
}

export type ActionType = FactionType | 'town' | 'spice' | 'diplomacy';
