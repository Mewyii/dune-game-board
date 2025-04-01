import {
  FactionInfluence,
  FactionType,
  LanguageString,
  Effect,
  EffectReward,
  EffectRewardType,
  EffectRewardOrChoice,
} from '.';

export interface DuneLocation {
  color: string;
  position: {
    marginTop: number;
    marginLeft: number;
  };
  actionField: ActionField;
  ownerReward?: EffectReward;
}

export interface ActionField {
  title: LanguageString;
  actionType: ActionType;
  costs?: EffectReward[];
  rewards: EffectRewardOrChoice[];
  conversionOptions?: EffectRewardOrChoice[][];
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
