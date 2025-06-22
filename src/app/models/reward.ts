import { ActiveFactionType, CombatUnitType, ResourceType } from '.';

export const effectRewards = [
  'agent',
  'agent-lift',
  'buildup',
  'card-destroy',
  'card-discard',
  'card-draw',
  'card-draw-or-destroy',
  'card-round-start',
  'combat',
  'council-seat-large',
  'council-seat-small',
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
  'shipping',
  'signet-ring',
  'signet-token',
  'spice-accumulation',
  'sword',
  'sword-master',
  'tech',
  'tech-tile',
  'tech-tile-flip',
  'victory-point',
  'trash-self',
  'recruitment-emperor',
  'recruitment-fremen',
  'recruitment-bene',
  'recruitment-guild',
  'research',
  'specimen',
  'beetle',
  'troop-insert',
  'troop-insert-or-retreat',
  'troop-retreat',
  'dreadnought-insert',
  'dreadnought-insert-or-retreat',
  'dreadnought-retreat',
  'enemies-card-discard',
  'enemies-troop-destroy',
  'enemies-intrigue-trash',
  'card-return-to-hand',
  'turn-pass',
] as const;

export const effectSeparators = ['helper-separator'] as const;
export const effectTimings = ['timing-game-start', 'timing-round-start', 'timing-turn-start', 'timing-reveal-turn'] as const;
export const effectConditions = [
  'condition-influence',
  'condition-connection',
  'condition-high-council-seat',
  'condition-agents-on-board-spaces',
  'condition-dreadnought-amount',
] as const;
export const effectChoices = ['helper-or', 'helper-or-horizontal'] as const;
export const effectConversions = ['helper-trade', 'helper-trade-horizontal'] as const;

export type EffectRewardType = ResourceType | CombatUnitType | (typeof effectRewards)[number];

export type EffectSeparatorType = (typeof effectSeparators)[number];
export type EffectTimingType = (typeof effectTimings)[number];
export type EffectChoiceType = (typeof effectChoices)[number];
export type EffectConditionType = (typeof effectConditions)[number];
export type EffectConversionType = (typeof effectConversions)[number];

export type EffectType =
  | EffectTimingType
  | EffectRewardType
  | EffectSeparatorType
  | EffectChoiceType
  | EffectConversionType
  | EffectConditionType;

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

export interface EffectReward extends EffectBase {
  type: EffectRewardType;
}

export type Effect = EffectSeparator | EffectTiming | EffectCondition | EffectChoice | EffectConversion | EffectReward;
export type EffectTimingConditionChoiceConversionOrReward =
  | EffectTiming
  | EffectCondition
  | EffectChoice
  | EffectConversion
  | EffectReward;
export type EffectConditionChoiceConversionOrReward = EffectCondition | EffectChoice | EffectConversion | EffectReward;
export type EffectChoiceConversionOrReward = EffectChoice | EffectConversion | EffectReward;
export type EffectConversionOrReward = EffectConversion | EffectReward;

export interface StructuredEffects {
  rewards: EffectReward[];
  conversionEffects: StructuredConversionEffect[];
  choiceEffects: StructuredChoiceEffect[];
  conditionalEffects: StructuredConditionalEffect[];
  timingEffects: StructuredTimingEffect[];
}

export interface StructuredTimingEffect {
  type: EffectTimingType;
  effect: StructuredConditionalEffect | StructuredChoiceEffect | StructuredConversionEffect | EffectReward[];
}

export interface StructuredConditionalEffectConnection {
  condition: 'condition-connection';
  faction: ActiveFactionType;
  effect: StructuredChoiceEffect | StructuredConversionEffect | EffectReward[];
}

export interface StructuredConditionalEffectInfluence {
  condition: 'condition-influence';
  amount: number;
  faction: ActiveFactionType;
  effect: StructuredChoiceEffect | StructuredConversionEffect | EffectReward[];
}

export interface StructuredConditionalEffectHighCouncilSeat {
  condition: 'condition-high-council-seat';
  effect: StructuredChoiceEffect | StructuredConversionEffect | EffectReward[];
}

export interface StructuredConditionalEffectAgentsOnBoardSpaces {
  condition: 'condition-agents-on-board-spaces';
  effect: StructuredChoiceEffect | StructuredConversionEffect | EffectReward[];
}

export interface StructuredConditionalEffectDreadnoughtAmount {
  condition: 'condition-dreadnought-amount';
  effect: StructuredChoiceEffect | StructuredConversionEffect | EffectReward[];
}

export type StructuredConditionalEffect =
  | StructuredConditionalEffectConnection
  | StructuredConditionalEffectInfluence
  | StructuredConditionalEffectHighCouncilSeat
  | StructuredConditionalEffectAgentsOnBoardSpaces
  | StructuredConditionalEffectDreadnoughtAmount;

export interface StructuredChoiceEffect {
  choiceType: EffectChoiceType;
  left: EffectReward[] | StructuredConversionEffect;
  right: EffectReward[] | StructuredConversionEffect;
}

export interface StructuredConversionEffect {
  conversionType: EffectConversionType;
  costs: EffectReward[];
  rewards: EffectReward[];
}

export interface RewardArrayInfo {
  hasRewardChoice: boolean;
  hasRewardConversion: boolean;
  rewardConversionIndex: number;
  rewardOptionIndex: number;
}
