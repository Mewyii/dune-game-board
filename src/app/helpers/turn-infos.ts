import { TurnInfo } from '../models/turn-info';

export function playerCanEnterCombat(turnInfo?: TurnInfo) {
  if (!turnInfo) {
    return false;
  } else {
    return (
      turnInfo.canEnterCombat ||
      turnInfo.deployableUnits > turnInfo.deployedUnits ||
      turnInfo.deployableTroops > turnInfo.deployedTroops ||
      turnInfo.deployableDreadnoughts > turnInfo.deployedDreadnoughts
    );
  }
}
