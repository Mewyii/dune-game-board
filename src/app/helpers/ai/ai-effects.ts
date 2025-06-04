import { clamp } from 'lodash';
import { GameState } from 'src/app/models/ai';
import { PlayerCombatUnits } from '../../services/combat-manager.service';
import { getPlayerCombatStrength, getPlayerGarrisonStrength } from './ai-goals';

export function getParticipateInCombatDesire(gameState: GameState) {
  let desire = 0.1;
  if (getPlayerCombatStrength(gameState.playerCombatUnits, gameState) > 0) {
    desire += 0.033 * gameState.playerCombatUnits.troopsInGarrison;
    return desire;
  } else {
    if (gameState.playerCombatUnits.troopsInGarrison > 0) {
      desire += 0.3;
    }
    desire += 0.1 * gameState.playerCombatUnits.troopsInGarrison;
    desire += 0.1 * (1 - gameState.playerAgentsAvailable);
    desire += 0.02 * gameState.playerCardsRewards.sword;
    desire += 0.04 * gameState.playerTechTilesRewards.sword;
    desire += 0.01 * gameState.playerCombatIntrigueCount;

    for (const enemy of gameState.enemyCombatUnits) {
      const enemyCombatStrength = getPlayerCombatStrength(enemy, gameState);
      if (enemyCombatStrength > 0) {
        desire -= 0.15 + 0.01 * getPlayerCombatStrength(enemy, gameState);
      } else {
        const enemyAgentCount = gameState.enemyAgentsAvailable.find((x) => x.playerId === enemy.playerId)?.agentAmount ?? 0;
        desire += 0.15 * (2 - enemyAgentCount);
      }
    }
  }

  return clamp(desire, 0.0, 1.0);
}

export function getWinCombatDesire(gameState: GameState) {
  let desire = 0.1;

  desire += 0.075 * getPlayerGarrisonStrength(gameState.playerCombatUnits, gameState);
  desire += 0.05 * gameState.playerAgentsAvailable;
  desire += 0.01 * gameState.playerCardsRewards.sword;
  desire += 0.02 * gameState.playerTechTilesRewards.sword;
  desire += 0.03 * gameState.playerCombatIntrigueCount;

  const playerCombatScore = getPlayerCombatStrength(gameState.playerCombatUnits, gameState);
  const enemyCombatScores = gameState.enemyCombatUnits.map((x) => ({
    ...x,
    combatStrength: getPlayerCombatStrength(x, gameState),
  }));
  enemyCombatScores.sort((a, b) => b.combatStrength - a.combatStrength);
  const highestEnemyCombatScore = enemyCombatScores[0];

  if (playerCombatScore > highestEnemyCombatScore.combatStrength) {
    const enemyAgentsAvailable =
      gameState.enemyAgentsAvailable.find((x) => x.playerId === highestEnemyCombatScore.playerId)?.agentAmount ?? 0;
    const enemyIntrigueCount =
      gameState.enemyIntrigueCounts.find((x) => x.playerId === highestEnemyCombatScore.playerId)?.intrigueCount ?? 0;

    if (
      getEnemyCombatStrengthPotentialAgainstPlayer(
        gameState.playerCombatUnits,
        highestEnemyCombatScore,
        enemyAgentsAvailable,
        enemyIntrigueCount,
        gameState
      ) > 1
    ) {
      desire += 0.3;
    } else {
      desire -= 0.3;
    }
  } else {
    for (const enemyCombatScore of enemyCombatScores) {
      desire += 0.02 * playerCombatScore;

      const enemyAgentsAvailable =
        gameState.enemyAgentsAvailable.find((x) => x.playerId === highestEnemyCombatScore.playerId)?.agentAmount ?? 0;

      if (
        getPlayerCombatStrengthPotentialAgainstEnemy(
          gameState.playerCombatUnits,
          gameState.playerAgentsAvailable,
          gameState.playerIntrigueCount,
          enemyCombatScore,
          gameState
        ) < 1
      ) {
        desire = desire - 0.5;
      } else {
        desire += 0.05 * (2 - enemyAgentsAvailable);
        desire -= 0.005 * getPlayerGarrisonStrength(enemyCombatScore, gameState);
      }
    }
  }

  return clamp(desire, 0.0, 1.0);
}

export function getEnemyCombatStrengthPotentialAgainstPlayer(
  playerCombatUnits: PlayerCombatUnits,
  enemyCombatUnits: PlayerCombatUnits,
  enemyAgentsAvailable: number,
  enemyIntrigueCount: number,
  gameState: GameState
) {
  const playerCombatPower = getPlayerCombatStrength(playerCombatUnits, gameState);
  const enemyCombatPower = getPlayerCombatStrength(enemyCombatUnits, gameState);

  const enemyCombatStrengthPotential = getPlayerCombatStrengthPotential(
    enemyCombatUnits,
    enemyAgentsAvailable,
    enemyIntrigueCount,
    gameState
  );

  return enemyCombatPower + enemyCombatStrengthPotential - playerCombatPower;
}

export function getPlayerCombatStrengthPotentialAgainstEnemy(
  player: PlayerCombatUnits,
  playerAgentsAvailable: number,
  playerIntrigueCount: number,
  enemy: PlayerCombatUnits,
  gameState: GameState
) {
  return getEnemyCombatStrengthPotentialAgainstPlayer(enemy, player, playerAgentsAvailable, playerIntrigueCount, gameState);
}

export function getPlayerCombatStrengthPotential(
  playerCombatUnits: PlayerCombatUnits,
  playerAgentsAvailable: number,
  playerIntrigueCount: number,
  gameState: GameState
) {
  const playerGarrisonStrength = getPlayerGarrisonStrength(playerCombatUnits, gameState);
  const maxAddableTroopCombatStrengthPerTurn =
    gameState.gameSettings.combatMaxDeployableUnits * gameState.gameSettings.troopCombatStrength;
  const maxAddableTroopCombatStrengthTotal = maxAddableTroopCombatStrengthPerTurn * playerAgentsAvailable;
  const troopCombatStrengthPotential =
    playerGarrisonStrength > maxAddableTroopCombatStrengthTotal
      ? maxAddableTroopCombatStrengthTotal
      : playerGarrisonStrength;

  return (
    troopCombatStrengthPotential +
    0.5 * playerIntrigueCount +
    0.15 * gameState.playerCardsRewards.sword +
    0.3 * gameState.playerTechTilesRewards.sword +
    1 * (playerAgentsAvailable - 1) * Math.random() +
    0.25 * (gameState.currentRound - 1)
  );
}

export function getAvoidCombatTiesModifier(gameState: GameState) {
  const playerCombatStrength = getPlayerCombatStrength(gameState.playerCombatUnits, gameState);
  if (playerCombatStrength < 1) {
    return 0;
  }

  const playerIsTiedToEnemy = gameState.enemyCombatUnits.some(
    (x) => getPlayerCombatStrength(x, gameState) === playerCombatStrength
  );
  if (playerIsTiedToEnemy) {
    return 0.5 - 0.2 * gameState.playerAgentsAvailable;
  } else {
    return 0;
  }
}
