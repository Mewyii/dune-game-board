import { CombatUnitType, ResourceType } from '.';

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
  'helper-or',
  'helper-or-horizontal',
  'helper-trade',
  'helper-trade-horizontal',
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
  'tech-reduced',
  'tech-reduced-three',
  'tech-reduced-two',
  'tech-tile-flip',
  'victory-point',
  'trash-self',
] as const;

export type RewardType = ResourceType | CombatUnitType | (typeof rewardTypes)[number];

export interface Reward {
  type: RewardType;
  amount?: number;
  iconHeight?: number;
  width?: number;
}
