import {
  EffectChoiceConversionMultiplierOrReward,
  EffectConversionMultiplierOrReward,
  EffectReward,
  FactionInfluence,
  FactionType,
  LanguageString,
} from '.';

export interface DuneLocation {
  color: string;
  position: {
    marginTop: number;
    marginLeft: number;
  };
  actionField: ActionField;
}

export interface ActionField {
  title: LanguageString;
  actionType: ActionType;
  rewards: EffectChoiceConversionMultiplierOrReward[];
  costs?: EffectReward[];
  activeForPlayerCount?: number;
  conversionOptions?: EffectConversionMultiplierOrReward[][];
  ownerReward?: EffectReward;
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
