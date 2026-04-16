import { CombatUnitType } from './combat-unit';
import { ActiveFactionType } from './faction';
import { ActionType } from './location';
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
  'enemies-leader-assassinate',
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
  'foldspace',
  'intrigue',
  'intrigue-draw',
  'intrigue-trash',
  'location-control',
  'location-control-choice',
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
  'specimen',
  'spice-accumulation',
  'sword',
  'sword-master',
  'tech-tile',
  'tech-tile-flip',
  'tech-tile-trash',
  'trash-self',
  'troop-insert',
  'troop-insert-or-retreat',
  'troop-retreat',
  'turn-pass',
  'victory-point',
  'leader-wound',
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
  'condition-high-council-seat',
  'condition-no-high-council-seat',
  'condition-enemies-on-this-field',
  'condition-enemy-controlling-this-field',
] as const;

export const effectFactionConditions = ['condition-connection', 'condition-influence'] as const;

export const effectActionConditions = ['condition-enemies-on-field-type'] as const;

export const effectChoices = ['helper-or', 'helper-or-horizontal'] as const;

export const effectConversions = ['helper-trade', 'helper-trade-horizontal'] as const;

export const effectMultipliers = [
  'multiplier-agents-on-board-spaces',
  'multiplier-cards-with-sword',
  'multiplier-dreadnought-amount',
  'multiplier-dreadnought-in-conflict-amount',
  'multiplier-dreadnought-in-garrison-amount',
  'multiplier-troops-in-conflict',
  'multiplier-enemies-on-this-field',
] as const;

export const effectFactionMultipliers = ['multiplier-connections'] as const;

export type EffectRewardType = ResourceType | CombatUnitType | (typeof effectRewards)[number];

export type EffectSeparatorType = (typeof effectSeparators)[number];
export type EffectTimingType = (typeof effectTimings)[number];
export type EffectChoiceType = (typeof effectChoices)[number];
export type EffectConditionType = (typeof effectConditions)[number];
export type EffectFactionConditionType = (typeof effectFactionConditions)[number];
export type EffectActionConditionType = (typeof effectActionConditions)[number];
export type EffectConversionType = (typeof effectConversions)[number];
export type EffectMultiplierType = (typeof effectMultipliers)[number];
export type EffectFactionMultiplierType = (typeof effectFactionMultipliers)[number];

export type EffectType =
  | EffectSeparatorType
  | EffectTimingType
  | EffectConditionType
  | EffectFactionConditionType
  | EffectActionConditionType
  | EffectChoiceType
  | EffectConversionType
  | EffectMultiplierType
  | EffectFactionMultiplierType
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
  type: EffectConditionType | EffectFactionConditionType | EffectActionConditionType;
  faction?: ActiveFactionType;
  action?: ActionType;
}

export interface EffectChoice extends EffectBase {
  type: EffectChoiceType;
}

export interface EffectConversion extends EffectBase {
  type: EffectConversionType;
}

export interface EffectMultiplier extends EffectBase {
  type: EffectMultiplierType | EffectFactionMultiplierType;
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
  | EffectConditionNoHighCouncilSeat
  | EffectConditionEnemiesOnThisField
  | EffectConditionEnemyControllingThisField
  | EffectConditionEnemiesOnFieldType;

export interface EffectConditionConnection {
  type: 'condition-connection';
  faction: ActiveFactionType;
  affects: 'player';
}

export interface EffectConditionInfluence {
  type: 'condition-influence';
  amount: number;
  faction: ActiveFactionType;
  affects: 'player';
}

export interface EffectConditionEnemiesOnFieldType {
  type: 'condition-enemies-on-field-type';
  action: ActionType;
  affects: 'enemies';
}

export interface EffectConditionHighCouncilSeat {
  type: 'condition-high-council-seat';
  affects: 'player';
}

export interface EffectConditionNoHighCouncilSeat {
  type: 'condition-no-high-council-seat';
  affects: 'player';
}

export interface EffectConditionEnemiesOnThisField {
  type: 'condition-enemies-on-this-field';
  affects: 'enemies';
}

export interface EffectConditionEnemyControllingThisField {
  type: 'condition-enemy-controlling-this-field';
  affects: 'enemies';
}
