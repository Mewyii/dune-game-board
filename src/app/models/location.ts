import { FactionInfluence, FactionType, LanguageString, Reward, RewardType } from '.';

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
  conversionOptions?: Reward[][];
  pathToImage: string;
  isBattlefield?: boolean;
  isNonBlockingField?: boolean;
  requiresInfluence?: FactionInfluence;
  customWidth?: string;
  noRowGap?: boolean;
  noColumnGap?: boolean;
}

export const nonFactionActionTypes = ['town', 'spice'] as const;

export type ActionType = FactionType | (typeof nonFactionActionTypes)[number];
