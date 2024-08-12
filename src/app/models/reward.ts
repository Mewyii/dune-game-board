import { CombatUnitType, ResourceType } from '.';

export const rewardTypes = [
  'card-draw',
  'card-discard',
  'card-destroy',
  'card-draw-or-destroy',
  'intrigue',
  'persuasion',
  'foldspace',
  'council-seat-small',
  'council-seat-large',
  'sword-master',
  'mentat',
  'spice-accumulation',
  'victory-point',
  'sword',
  'combat',
  'intrigue-trash',
  'intrigue-draw',
  'helper-arrow-down',
  'helper-arrow-right',
  'placeholder',
  'separator',
  'separator-horizontal',
  'tech',
  'tech-reduced',
  'tech-reduced-two',
  'tech-reduced-three',
  'control-spice',
  'card-round-start',
  'shipping',
  'faction-influence-up-choice',
  'faction-influence-up-emperor',
  'faction-influence-up-guild',
  'faction-influence-up-bene',
  'faction-influence-up-fremen',
  'faction-influence-up-twice-choice',
  'faction-influence-down-choice',
  'faction-influence-down-emperor',
  'faction-influence-down-guild',
  'faction-influence-down-bene',
  'faction-influence-down-fremen',
  'agent',
  'agent-lift',
  'buildup',
  'signet-token',
  'signet-ring',
  'loose-troop',
  'location-control',
  'tech-tile-flip',
] as const;

export type RewardType = ResourceType | CombatUnitType | (typeof rewardTypes)[number];

export interface Reward {
  type: RewardType;
  amount?: number;
  iconHeight?: number;
  width?: number;
}
