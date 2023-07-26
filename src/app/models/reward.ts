import { ArmyType, ResourceType } from '.';

export type RewardType =
  | ResourceType
  | ArmyType
  | 'card-draw'
  | 'card-discard'
  | 'card-destroy'
  | 'card-draw-or-destroy'
  | 'intrigue'
  | 'conviction'
  | 'foldspace'
  | 'council-seat-small'
  | 'council-seat-large'
  | 'sword-master'
  | 'mentat'
  | 'extra-spice'
  | 'victory-point'
  | 'attack-value'
  | 'troop-insert'
  | 'intrigue-draw'
  | 'helper-arrow-down'
  | 'placeholder'
  | 'separator'
  | 'separator-horizontal'
  | 'tech'
  | 'tech-reduced'
  | 'tech-reduced-two'
  | 'tech-reduced-three'
  | 'control-spice'
  | 'card-round-start'
  | 'shipping'
  | 'buildup';

export interface Reward {
  type: RewardType;
  amount?: number;
  iconHeight?: number;
  width?: number;
}
