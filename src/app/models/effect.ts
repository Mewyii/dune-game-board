import { CombatUnitType } from './combat-unit';
import { ActiveFactionType } from './faction';
import { ResourceType } from './resource';

export const effectRewards = [
  'agent',
  'agent-lift',
  'beetle',
  'card-destroy',
  'card-discard',
  'card-draw',
  'card-draw-or-destroy',
  'card-return-to-hand',
  'combat',
  'council-seat-large',
  'council-seat-small',
  'dreadnought-insert',
  'dreadnought-insert-or-retreat',
  'dreadnought-retreat',
  'enemies-card-discard',
  'enemies-intrigue-trash',
  'enemies-troop-destroy',
  'faction-influence-down-bene',
  'faction-influence-down-choice',
  'faction-influence-down-emperor',
  'faction-influence-down-fremen',
  'faction-influence-down-guild',
  'faction-influence-up-bene',
  'faction-influence-up-choice',
  'faction-influence-up-emperor',
  'faction-influence-up-fremen',
  'faction-influence-up-guild',
  'faction-influence-up-twice-choice',
  'focus',
  'foldspace',
  'intrigue',
  'intrigue-draw',
  'intrigue-trash',
  'location-control',
  'loose-troop',
  'mentat',
  'persuasion',
  'placeholder',
  'recruitment-bene',
  'recruitment-emperor',
  'recruitment-fremen',
  'recruitment-guild',
  'research',
  'shipping',
  'signet-ring',
  'signet-token',
  'specimen',
  'spice-accumulation',
  'sword',
  'sword-master',
  'tech',
  'tech-tile',
  'tech-tile-flip',
  'tech-tile-trash',
  'trash-self',
  'troop-insert',
  'troop-insert-or-retreat',
  'troop-retreat',
  'turn-pass',
  'victory-point',
] as const;

export const effectSeparators = ['helper-separator'] as const;

export const effectTimings = [
  'timing-game-start',
  'timing-reveal-turn',
  'timing-round-start',
  'timing-turn-start',
  'timing-agent-placement',
  'timing-combat',
] as const;

export const effectConditions = [
  'condition-connection',
  'condition-high-council-seat',
  'condition-no-high-council-seat',
  'condition-influence',
] as const;

export const effectChoices = ['helper-or', 'helper-or-horizontal'] as const;

export const effectConversions = ['helper-trade', 'helper-trade-horizontal'] as const;

export const effectMultipliers = [
  'multiplier-agents-on-board-spaces',
  'multiplier-cards-with-sword',
  'multiplier-connections',
  'multiplier-dreadnought-amount',
  'multiplier-dreadnought-in-conflict-amount',
  'multiplier-dreadnought-in-garrison-amount',
  'multiplier-troops-in-conflict',
] as const;

export type EffectRewardType = ResourceType | CombatUnitType | (typeof effectRewards)[number];

export type EffectSeparatorType = (typeof effectSeparators)[number];
export type EffectTimingType = (typeof effectTimings)[number];
export type EffectChoiceType = (typeof effectChoices)[number];
export type EffectConditionType = (typeof effectConditions)[number];
export type EffectConversionType = (typeof effectConversions)[number];
export type EffectMultiplierType = (typeof effectMultipliers)[number];

export type EffectType =
  | EffectSeparatorType
  | EffectTimingType
  | EffectConditionType
  | EffectChoiceType
  | EffectConversionType
  | EffectMultiplierType
  | EffectRewardType;

interface EffectBase {
  type: EffectType;
  amount?: number;
  iconHeight?: number;
  width?: number;
}

export interface EffectSeparator extends EffectBase {
  type: EffectSeparatorType;
}

export interface EffectTiming extends EffectBase {
  type: EffectTimingType;
}

export interface EffectCondition extends EffectBase {
  type: EffectConditionType;
  faction?: ActiveFactionType;
}

export interface EffectChoice extends EffectBase {
  type: EffectChoiceType;
}

export interface EffectConversion extends EffectBase {
  type: EffectConversionType;
}

export interface EffectMultiplier extends EffectBase {
  type: EffectMultiplierType;
  faction?: ActiveFactionType;
}

export interface EffectReward extends EffectBase {
  type: EffectRewardType;
}

export type Effect =
  | EffectSeparator
  | EffectTiming
  | EffectCondition
  | EffectChoice
  | EffectConversion
  | EffectMultiplier
  | EffectReward;
export type EffectTimingConditionChoiceConversionMultiplierOrReward =
  | EffectTiming
  | EffectCondition
  | EffectChoice
  | EffectConversion
  | EffectMultiplier
  | EffectReward;
export type EffectConditionChoiceConversionMultiplierOrReward =
  | EffectCondition
  | EffectChoice
  | EffectConversion
  | EffectMultiplier
  | EffectReward;
export type EffectChoiceConversionMultiplierOrReward = EffectChoice | EffectConversion | EffectMultiplier | EffectReward;
export type EffectConversionMultiplierOrReward = EffectConversion | EffectMultiplier | EffectReward;
export type EffectMultiplierOrReward = EffectMultiplier | EffectReward;

export interface StructuredEffectBase {
  timing?: StructuredEffectTiming;
  condition?: StructuredEffectCondition;
}

export interface StructuredChoiceEffect extends StructuredEffectBase {
  type: EffectChoiceType;
  effectLeft: StructuredConversionOrRewardEffect;
  effectRight: StructuredConversionOrRewardEffect;
}

export interface StructuredConversionEffect extends StructuredEffectBase {
  type: EffectConversionType;
  effectCosts: StructuredRewardEffect;
  effectConversions: StructuredRewardEffect;
}

export interface StructuredRewardEffect extends StructuredEffectBase {
  type: 'reward';
  multiplier?: EffectMultiplier;
  effectRewards: EffectReward[];
}

export type StructuredConversionOrRewardEffect = StructuredConversionEffect | StructuredRewardEffect;
export type StructuredEffect = StructuredChoiceEffect | StructuredConversionEffect | StructuredRewardEffect;

export interface StructuredEffectTiming {
  type: EffectTimingType;
}

export type StructuredEffectCondition =
  | EffectConditionConnection
  | EffectConditionInfluence
  | EffectConditionHighCouncilSeat
  | EffectConditionNoHighCouncilSeat;

export interface EffectConditionConnection {
  type: 'condition-connection';
  faction: ActiveFactionType;
}

export interface EffectConditionInfluence {
  type: 'condition-influence';
  amount: number;
  faction: ActiveFactionType;
}

export interface EffectConditionHighCouncilSeat {
  type: 'condition-high-council-seat';
}

export interface EffectConditionNoHighCouncilSeat {
  type: 'condition-no-high-council-seat';
}
