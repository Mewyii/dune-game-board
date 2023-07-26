export type ResourceType = 'water' | 'spice' | 'currency';
export type ArmyType = 'troops' | 'ship';

export interface Resource {
  type: ResourceType;
  amount?: number;
}

export interface Army {
  type: ArmyType;
  amount?: number;
}
