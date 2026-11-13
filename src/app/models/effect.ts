import { CombatUnitType } from './combat-unit';
import { ActiveFactionType } from './faction';
import { ActionType } from './location';
import { ResourceType } from './resource';

export const effectRewards = [
  'agent',
  'agent-lift',
  'beetle',
  'card-trash',
  'card-trash-from-hand',
  'card-trash-in-play',
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
  'leader-wound',
  'contract',
  'maker-hook',
  'spy',
  'wall-break',
  'sandworm',
] as const;

export const effectSeparators = ['helper-separator'] as const;

export const effectTimings = [
  'timing-game-start',
  'timing-reveal-turn',
  'timing-round-start',
  'timing-turn-start',
  'timing-combat',
  'timing-agent-placed',
  'timing-resource-gained',
] as const;

export const effectConditions = ['condition-high-council-seat', 'condition-no-high-council-seat'] as const;

export const effectFactionConditions = ['condition-connection', 'condition-influence'] as const;

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

export const effectActionMultipliers = ['multiplier-own-agents-on-field-type'] as const;

export const effectTargets = [
  'target-enemies',
  'target-enemies-on-this-field',
  'target-enemies-on-field-type',
  'target-enemy-controlling-this-field',
] as const;

export type EffectRewardType = ResourceType | CombatUnitType | (typeof effectRewards)[number];

export type EffectSeparatorType = (typeof effectSeparators)[number];
export type EffectTimingType = (typeof effectTimings)[number];
export type EffectChoiceType = (typeof effectChoices)[number];
export type EffectConditionType = (typeof effectConditions)[number];
export type EffectFactionConditionType = (typeof effectFactionConditions)[number];
export type EffectConversionType = (typeof effectConversions)[number];
export type EffectMultiplierType = (typeof effectMultipliers)[number];
export type EffectFactionMultiplierType = (typeof effectFactionMultipliers)[number];
export type EffectActionMultiplierType = (typeof effectActionMultipliers)[number];
export type EffectTargetType = (typeof effectTargets)[number];

export type EffectType =
  | EffectSeparatorType
  | EffectTimingType
  | EffectConditionType
  | EffectFactionConditionType
  | EffectChoiceType
  | EffectConversionType
  | EffectMultiplierType
  | EffectFactionMultiplierType
  | EffectActionMultiplierType
  | EffectTargetType
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

export interface EffectConditionAndTarget extends EffectBase {
  type: EffectConditionType | EffectFactionConditionType;
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
  type: EffectMultiplierType | EffectFactionMultiplierType | EffectActionMultiplierType;
  faction?: ActiveFactionType;
  action?: ActionType;
}

export interface EffectTarget extends EffectBase {
  type: EffectTargetType;
  action?: ActionType;
}
export interface EffectReward extends EffectBase {
  type: EffectRewardType;
}

export type Effect =
  | EffectSeparator
  | EffectTiming
  | EffectConditionAndTarget
  | EffectChoice
  | EffectConversion
  | EffectMultiplier
  | EffectTarget
  | EffectReward;
export type EffectTimingConditionChoiceConversionMultiplierTargetOrReward =
  | EffectTiming
  | EffectConditionAndTarget
  | EffectChoice
  | EffectConversion
  | EffectMultiplier
  | EffectTarget
  | EffectReward;
export type EffectConditionChoiceConversionMultiplierTargetOrReward =
  | EffectConditionAndTarget
  | EffectChoice
  | EffectConversion
  | EffectMultiplier
  | EffectTarget
  | EffectReward;
export type EffectChoiceConversionMultiplierTargetOrReward =
  | EffectChoice
  | EffectConversion
  | EffectMultiplier
  | EffectTarget
  | EffectReward;
export type EffectConversionMultiplierOrReward = EffectConversion | EffectMultiplier | EffectTarget | EffectReward;
export type EffectMultiplierTargetOrReward = EffectMultiplier | EffectTarget | EffectReward;

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
  effectConversionRewards: StructuredRewardEffect;
}

export interface StructuredRewardEffect extends StructuredEffectBase {
  type: 'reward';
  multiplier?: EffectMultiplier;
  target?: EffectTarget;
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

export type StructuredEffectTarget =
  | EffectTargetEnemies
  | EffectTargetEnemiesOnFieldType
  | EffectTargetEnemiesOnThisField
  | EffectTargetEnemyControllingThisField;

export interface EffectTargetEnemies {
  type: 'target-enemies';
  target: 'enemies';
}

export interface EffectTargetEnemiesOnFieldType {
  type: 'target-enemies-on-field-type';
  action: ActionType;
  target: 'enemies';
}

export interface EffectTargetEnemiesOnThisField {
  type: 'target-enemies-on-this-field';
  target: 'enemies';
}

export interface EffectTargetEnemyControllingThisField {
  type: 'target-enemy-controlling-this-field';
  target: 'enemies';
}
