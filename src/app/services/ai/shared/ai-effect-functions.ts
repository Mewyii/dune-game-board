import { clamp } from 'lodash';
import { PlayerCombatUnits } from '../../combat-manager.service';
import { GameState } from '../models';
import { getPlayerCombatStrength, getPlayerGarrisonStrength } from './ai-goal-functions';

export function getParticipateInCombatDesire(gameState: GameState) {
  let desire = 0.1;
  if (getPlayerCombatStrength(gameState.playerCombatUnits) > 0) {
    desire += 0.033 * gameState.playerCombatUnits.troopsInGarrison;
    return desire;
  } else {
    desire += 0.15 * gameState.playerCombatUnits.troopsInGarrison;
    desire += 0.1 * (1 - gameState.playerAgentsAvailable);
    desire += 0.03 * gameState.playerCardsRewards.sword;
    desire += 0.01 * gameState.playerCombatIntrigueCount;

    for (const enemy of gameState.enemyCombatUnits) {
      const enemyCombatStrength = getPlayerCombatStrength(enemy);
      if (enemyCombatStrength > 0) {
        desire -= 0.15 + 0.01 * getPlayerCombatStrength(enemy);
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

  desire += 0.1 * getPlayerGarrisonStrength(gameState.playerCombatUnits);
  desire += 0.05 * gameState.playerAgentsAvailable;
  desire += 0.01 * gameState.playerCardsRewards.sword;
  desire += 0.03 * gameState.playerCombatIntrigueCount;

  const playerCombatScore = getPlayerCombatStrength(gameState.playerCombatUnits);
  const enemyCombatScores = gameState.enemyCombatUnits.map((x) => ({ ...x, combatStrength: getPlayerCombatStrength(x) }));
  enemyCombatScores.sort((a, b) => b.combatStrength - a.combatStrength);
  const highestEnemyCombatScore = enemyCombatScores[0];

  if (playerCombatScore > highestEnemyCombatScore.combatStrength) {
    const enemyAgentsAvailable =
      gameState.enemyAgentsAvailable.find((x) => x.playerId === highestEnemyCombatScore.playerId)?.agentAmount ?? 0;
    if (
      enemyCanContestPlayer(
        gameState.playerCombatUnits,
        gameState.playerAgentsAvailable,
        highestEnemyCombatScore,
        enemyAgentsAvailable,
        gameState
      )
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
        !playerCanContestEnemy(
          gameState.playerCombatUnits,
          gameState.playerAgentsAvailable,
          enemyCombatScore,
          enemyAgentsAvailable,
          gameState
        )
      ) {
        desire = desire - 0.5;
      } else {
        desire += 0.05 * (2 - enemyAgentsAvailable);
        desire -= 0.005 * getPlayerGarrisonStrength(enemyCombatScore);
      }
    }
  }

  return clamp(desire, 0.0, 1.0);
}

export function enemyCanContestPlayer(
  playerCombatUnits: PlayerCombatUnits,
  playerAgentsAvailable: number,
  enemyCombatUnits: PlayerCombatUnits,
  enemyAgentsAvailable: number,
  gameState: GameState
) {
  const playerCombatPower = getPlayerCombatStrength(playerCombatUnits);
  const enemyCombatPower = getPlayerCombatStrength(enemyCombatUnits);

  if (enemyAgentsAvailable < 1 && playerCombatPower > enemyCombatPower) {
    return false;
  }

  const enemyGarrisonStrength = getPlayerGarrisonStrength(enemyCombatUnits);
  const potentialEnemyCombatStrengthNextTurn = enemyGarrisonStrength > 8 ? 8 : enemyGarrisonStrength;
  const combatPowerTreshold =
    potentialEnemyCombatStrengthNextTurn +
    4 * (playerAgentsAvailable - 1 + Math.random()) +
    0.5 * (gameState.currentRound - 1);

  if (enemyCombatPower + combatPowerTreshold < playerCombatPower) {
    return false;
  }

  return true;
}

export function playerCanContestEnemy(
  player: PlayerCombatUnits,
  playerAgentsAvailable: number,
  enemy: PlayerCombatUnits,
  enemyAgentsAvailable: number,
  gameState: GameState,
  countEnemiesNotInCombat?: boolean
) {
  return enemyCanContestPlayer(enemy, enemyAgentsAvailable, player, playerAgentsAvailable, gameState);
}
