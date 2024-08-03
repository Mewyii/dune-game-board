export const combatUnitTypes = ['troop', 'troop-sardaukar', 'troop-fremen', 'dreadnought'] as const;

export type CombatUnitType = (typeof combatUnitTypes)[number];

export interface CombatUnit {
  type: CombatUnitType;
  amount?: number;
}
