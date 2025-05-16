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

export function turnInfosNeedToBeResolved(turnInfo: TurnInfo) {
  return (
    turnInfo.cardDrawOrDestroyAmount > 0 ||
    turnInfo.cardDiscardAmount > 0 ||
    turnInfo.shippingAmount > 0 ||
    turnInfo.locationControlAmount > 0 ||
    turnInfo.factionInfluenceUpChoiceAmount > 0 ||
    turnInfo.factionInfluenceUpChoiceTwiceAmount > 0 ||
    turnInfo.factionInfluenceDownChoiceAmount > 0 ||
    turnInfo.intrigueTrashAmount > 0 ||
    turnInfo.effectOptions.length > 0 ||
    turnInfo.effectConversions.length > 0 ||
    turnInfo.canLiftAgent ||
    turnInfo.signetRingAmount > 0
  );
}
