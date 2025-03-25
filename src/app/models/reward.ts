import { ActiveFactionType, CombatUnitType, Faction, ResourceType } from '.';

export const rewardTypes = [
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
] as const;

export const rewardSeparators = ['helper-separator'] as const;

export const rewardChoices = ['helper-or', 'helper-or-horizontal', 'helper-trade', 'helper-trade-horizontal'] as const;

export const rewardConditions = ['condition-influence', 'condition-connection'] as const;

export type RewardType = ResourceType | CombatUnitType | (typeof rewardTypes)[number];
export type RewardSeparatorType = (typeof rewardSeparators)[number];
export type RewardChoiceType = (typeof rewardChoices)[number];
export type RewardConditionType = (typeof rewardConditions)[number];

export type EffectType = RewardType | RewardSeparatorType | RewardChoiceType | RewardConditionType;

interface EffectBase {
  type: EffectType;
  amount?: number;
  iconHeight?: number;
  width?: number;
}

export interface EffectReward extends EffectBase {
  type: RewardType;
}

export interface EffectSeparator extends EffectBase {
  type: RewardSeparatorType;
}

export interface EffectChoice extends EffectBase {
  type: RewardChoiceType;
}

export interface EffectCondition extends EffectBase {
  type: RewardConditionType;
  faction: ActiveFactionType;
}

export type Effect = EffectReward | EffectSeparator | EffectChoice | EffectCondition;
export type EffectWithoutSeparator = EffectReward | EffectChoice | EffectCondition;
export type EffectWithoutSeparatorAndCondition = EffectReward | EffectChoice;

export interface StructuredConditionalEffect {
  condition: RewardConditionType;
  faction: ActiveFactionType;
  effect: EffectReward[] | StructuredChoiceEffect;
}

export interface StructuredChoiceEffect {
  choiceType: RewardChoiceType;
  left: EffectReward[];
  right: EffectReward[];
}

export interface StructuredEffects {
  rewards: EffectReward[];
  choiceEffects: StructuredChoiceEffect[];
  conditionalEffects: StructuredConditionalEffect[];
}
