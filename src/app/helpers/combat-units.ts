import { PlayerCombatUnits } from '../services/combat-manager.service';

export function getPlayerdreadnoughtCount(combatUnits: PlayerCombatUnits) {
  return combatUnits.shipsInGarrison + combatUnits.shipsInCombat + combatUnits.shipsInTimeout;
}
