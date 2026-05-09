import { GameState } from '../models/ai';
import { PlayerCombatUnits } from '../services/combat-manager.service';

export function getPlayerCombatStrength(player: PlayerCombatUnits, gamestate: Pick<GameState, 'gameSettings'>) {
  return (
    player.troopsInCombat * gamestate.gameSettings.troopCombatStrength +
    player.shipsInCombat * gamestate.gameSettings.dreadnoughtCombatStrength +
    player.additionalCombatPower
  );
}

export function getPlayerGarrisonStrength(player: PlayerCombatUnits, gamestate: GameState) {
  return player.troopsInGarrison * gamestate.gameSettings.troopCombatStrength + player.shipsInGarrison * 4;
}

export function getPlayerCombatRank(player: PlayerCombatUnits, enemies: PlayerCombatUnits[], gameState: GameState) {
  const playerCombatScore = getPlayerCombatStrength(player, gameState);

  const sortedEnemyCombatScores = enemies.map((x) => getPlayerCombatStrength(x, gameState)).sort((a, b) => b - a);

  const currentCombatRank = sortedEnemyCombatScores.filter((x) => x >= playerCombatScore).length + 1;
  const gapToBetterRank = sortedEnemyCombatScores[currentCombatRank - 2] - playerCombatScore || 0;
  const gapToWorseRank = playerCombatScore - sortedEnemyCombatScores[currentCombatRank - 1] || 0;

  return {
    currentCombatRank,
    isFirst: currentCombatRank === 1,
    isLast: currentCombatRank === sortedEnemyCombatScores.length + 1,
    gapToBetterRank,
    gapToWorseRank,
  };
}

export function getPlayerdreadnoughtCount(combatUnits: PlayerCombatUnits) {
  return combatUnits.shipsInGarrison + combatUnits.shipsInCombat + combatUnits.shipsInTimeout;
}
