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
] as const;

export const effectTimings = ['timing-game-start', 'timing-round-start', 'timing-reveal-turn'] as const;

export const effectSeparators = ['helper-separator'] as const;

export const effectChoices = ['helper-or', 'helper-or-horizontal', 'helper-trade', 'helper-trade-horizontal'] as const;

export const effectConditions = ['condition-influence', 'condition-connection', 'condition-high-council-seat'] as const;

export type EffectRewardType = ResourceType | CombatUnitType | (typeof effectRewards)[number];

export type EffectTimingType = (typeof effectTimings)[number];
export type EffectSeparatorType = (typeof effectSeparators)[number];
export type EffectChoiceType = (typeof effectChoices)[number];
export type EffectConditionType = (typeof effectConditions)[number];

export type EffectType = EffectTimingType | EffectRewardType | EffectSeparatorType | EffectChoiceType | EffectConditionType;

interface EffectBase {
  type: EffectType;
  amount?: number;
  iconHeight?: number;
  width?: number;
}

export interface EffectTiming extends EffectBase {
  type: EffectTimingType;
}

export interface EffectReward extends EffectBase {
  type: EffectRewardType;
}

export interface EffectSeparator extends EffectBase {
  type: EffectSeparatorType;
}

export interface EffectChoice extends EffectBase {
  type: EffectChoiceType;
}

export interface EffectCondition extends EffectBase {
  type: EffectConditionType;
  faction: ActiveFactionType;
}

export type Effect = EffectTiming | EffectReward | EffectSeparator | EffectChoice | EffectCondition;
export type EffectTimingRewardChoiceOrCondition = EffectTiming | EffectReward | EffectChoice | EffectCondition;
export type EffectRewardChoiceOrCondition = EffectReward | EffectChoice | EffectCondition;
export type EffectRewardOrChoice = EffectReward | EffectChoice;

export interface StructuredEffects {
  rewards: EffectReward[];
  choiceEffects: StructuredChoiceEffect[];
  conditionalEffects: StructuredConditionalEffect[];
  timingEffects: StructuredTimingEffect[];
}

export interface StructuredTimingEffect {
  type: EffectTimingType;
  effect: StructuredConditionalEffect | StructuredChoiceEffect | EffectReward[];
}

export interface StructuredConditionalEffect {
  condition: EffectConditionType;
  amount?: number;
  faction: ActiveFactionType;
  effect: EffectReward[] | StructuredChoiceEffect;
}

export interface StructuredChoiceEffect {
  choiceType: EffectChoiceType;
  left: EffectReward[];
  right: EffectReward[];
}

export interface RewardArrayInfo {
  hasRewardOptions: boolean;
  hasRewardConversion: boolean;
  rewardConversionIndex: number;
  rewardOptionIndex: number;
}
