export const combatUnitTypes = ['troop', 'dreadnought'] as const;

export type CombatUnitType = (typeof combatUnitTypes)[number];

export interface CombatUnit {
  type: CombatUnitType;
  amount?: number;
}
