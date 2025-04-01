import { clamp } from 'lodash';
import { Resource, ResourceType, Effect, EffectRewardType } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { AIGoal, AIGoals, FieldsForGoals, GameState } from 'src/app/services/ai/models';
import { PlayerCombatUnits } from 'src/app/services/combat-manager.service';
import { PlayerScore } from 'src/app/services/player-score-manager.service';

export function getAccumulatedSpice(gameState: GameState, fieldId: string) {
  const spice = gameState.accumulatedSpiceOnFields.find((x) => x.fieldId === fieldId);
  if (spice) {
    return spice.amount;
  }
  return 0;
}

export function getResourceDesire(
  player: Player,
  baseDesire: number,
  influences: {
    resource: ResourceType | 'tech-agents';
    amount: number;
    maxAmount?: number;
    negative?: boolean;
  }[]
) {
  let desire = baseDesire;
  for (const influence of influences) {
    const resourceAmount = getResourceAmount(player, influence.resource);
    if (!influence.negative) {
      desire = desire + clamp(resourceAmount * influence.amount, 0, influence.maxAmount ?? 1);
    } else {
      desire = desire - clamp(resourceAmount * influence.amount, 0, influence.maxAmount ?? 1);
    }
  }
  return clamp(desire, 0, 1);
}

export function getResourceAmount(player: Player, resourceType: ResourceType | 'tech-agents') {
  switch (resourceType) {
    case 'tech-agents':
      return player.tech;
    default:
      const resource = player.resources.find((x) => x.type === resourceType);

      return resource?.amount ?? 0;
  }
}

export function getPlayerCombatStrength(player: PlayerCombatUnits) {
  return player.troopsInCombat * 2 + player.shipsInCombat * 4 + player.additionalCombatPower;
}

export function getPlayerGarrisonStrength(player: PlayerCombatUnits) {
  return player.troopsInGarrison * 2 + player.shipsInGarrison * 4;
}

export function enemyCanContestPlayer(
  player: PlayerCombatUnits,
  enemy: PlayerCombatUnits,
  gameState: GameState,
  countEnemiesNotInCombat?: boolean
) {
  const playerAgentCount = gameState.playerAgentsAvailable;
  const combatPowerTreshold = 3 * (playerAgentCount + Math.random()) + 0.5 * (gameState.currentRound - 1);

  const playerCombatPower = getPlayerCombatStrength(player);

  const enemyCombatPower = getPlayerCombatStrength(enemy);
  const enemyAgentCount = gameState.enemyAgentsAvailable.find((x) => x.playerId === enemy.playerId)?.agentAmount;

  if (enemyAgentCount !== undefined && enemyAgentCount < 1 && playerCombatPower > enemyCombatPower) {
    if (countEnemiesNotInCombat) {
      if (enemyCombatPower === 0) {
        return false;
      }
    } else {
      return false;
    }
  }

  if (enemyCombatPower + combatPowerTreshold < playerCombatPower) {
    return false;
  }

  return true;
}

export function playerCanContestEnemy(
  player: PlayerCombatUnits,
  enemy: PlayerCombatUnits,
  gameState: GameState,
  countEnemiesNotInCombat?: boolean
) {
  return enemyCanContestPlayer(enemy, player, gameState, countEnemiesNotInCombat);
}

export function playerLikelyWinsCombat(gameState: GameState) {
  let result = true;

  for (const enemy of gameState.enemyCombatUnits) {
    if (enemyCanContestPlayer(gameState.playerCombatUnits, enemy, gameState)) {
      result = false;
    }
  }
  return result;
}

export function getWinCombatDesireModifier(gameState: GameState) {
  let desire =
    0.0 +
    0.2 * gameState.playerAgentsAvailable +
    0.125 * gameState.playerCombatIntrigueCount +
    0.05 * getPlayerGarrisonStrength(gameState.playerCombatUnits) +
    0.075 * getPlayerCombatStrength(gameState.playerCombatUnits);

  let strengthOfStrongestEnemy = 0;
  for (const enemy of gameState.enemyCombatUnits) {
    const enemyCombatPower = getPlayerCombatStrength(enemy);

    if (enemyCombatPower > 0) {
      desire -= 0.05;

      if (!playerCanContestEnemy(gameState.playerCombatUnits, enemy, gameState)) {
        desire = desire - 0.33;
      }

      const enemyStrength = enemyCombatPower + 0.2 * getPlayerGarrisonStrength(enemy);

      desire -= 0.005 * enemyStrength;

      if (enemyStrength > strengthOfStrongestEnemy) {
        strengthOfStrongestEnemy = enemyStrength;
      }
    } else {
      const enemyAgentCount = gameState.enemyAgentsAvailable.find((x) => x.playerId === enemy.playerId)?.agentAmount ?? 0;
      if (enemyAgentCount < 1) {
        desire += 0.1;
      }
      if (enemyCanContestPlayer(gameState.playerCombatUnits, enemy, gameState, true)) {
        desire -= 0.025;
      }
    }
  }

  desire -= 0.02 * strengthOfStrongestEnemy;

  if (playerLikelyWinsCombat(gameState)) {
    desire = desire * 0.1;
  }

  return clamp(desire, 0.1, 0.9);
}

export function getParticipateInCombatDesireModifier(gameState: GameState) {
  const garrisonStrength = getPlayerGarrisonStrength(gameState.playerCombatUnits);

  let desire = 0.1 + 0.01 * (gameState.currentRound - 1) + 0.025 * garrisonStrength;
  if (getPlayerCombatStrength(gameState.playerCombatUnits) > 0) {
    return desire;
  }

  let enemiesInCombat = 0;
  let garrisonStrengthOfEnemiesNotInCombat = 0;
  for (const enemy of gameState.enemyCombatUnits) {
    const enemyCombatStrength = getPlayerCombatStrength(enemy);
    if (enemyCombatStrength > 0) {
      enemiesInCombat++;

      desire -= 0.01 * getPlayerCombatStrength(enemy);
    } else {
      const enemyAgentCount = gameState.enemyAgentsAvailable.find((x) => x.playerId === enemy.playerId)?.agentAmount ?? 0;
      if (enemyAgentCount < 1) {
        desire += 0.1;
      } else {
        garrisonStrengthOfEnemiesNotInCombat += getPlayerGarrisonStrength(enemy);
      }
    }
  }

  desire += 0.025 * garrisonStrength;
  desire -= 0.005 * garrisonStrengthOfEnemiesNotInCombat;

  return clamp(desire, 0.1, 0.6);
}

export function getDesire(goal: AIGoal, player: Player, gameState: GameState, goals: FieldsForGoals) {
  const goalDesire = goal.desireModifier(player, gameState, goals);
  if (typeof goalDesire === 'number') {
    return clamp(goal.baseDesire + goalDesire, 0, goal.maxDesire ?? 1);
  } else {
    return clamp(goal.baseDesire + goalDesire.modifier, 0, goal.maxDesire ?? 1);
  }
}

export function getMaxDesireOfUnreachableGoal(
  player: Player,
  gameState: GameState,
  goals: FieldsForGoals,
  goalType: { type: AIGoals; modifier: number }
) {
  const goal = goals[goalType.type];
  if (!goal) {
    return 0.0;
  }
  if (!goal.reachedGoal(player, gameState, goals)) {
    const goalDesire = getDesire(goal, player, gameState, goals);

    return goalDesire * goalType.modifier;
  } else {
    return 0.0;
  }
}

export function getMaxDesireOfUnreachableGoals(
  player: Player,
  gameState: GameState,
  goals: FieldsForGoals,
  goalTypes: { type: AIGoals; modifier: number }[],
  currentDesire: number
) {
  for (const goalType of goalTypes) {
    const goalDesire = getMaxDesireOfUnreachableGoal(player, gameState, goals, goalType);
    if (goalDesire > currentDesire) {
      currentDesire = goalDesire;
    }
  }
  return currentDesire;
}

export function getInactiveEnemyCount(gamestate: GameState) {
  return gamestate.enemyAgentsAvailable.filter((x) => x.agentAmount < 1).length;
}

export function enemyIsCloseToPlayerFactionScore(gameState: GameState, faction: keyof PlayerScore) {
  const playerScore = gameState.playerScore[faction];

  if (playerScore > 5) {
    return false;
  }

  const enemyIsAheadOfPlayer = gameState.enemyScore.some((x) => x[faction] > playerScore);
  const enemyIsCloseToPlayer = gameState.enemyScore.some((x) => x[faction] + 2 > playerScore);
  if (!enemyIsAheadOfPlayer && enemyIsCloseToPlayer) {
    return true;
  } else {
    return false;
  }
}

export function playerCanGetAllianceThisTurn(player: Player, gameState: GameState, faction: keyof PlayerScore) {
  const playerScore = gameState.playerScore[faction];

  if (playerScore === 3) {
    return !gameState.enemyScore.some((x) => x[faction] > 3);
  }
  return false;
}

export function playerCanGetVictoryPointThisTurn(player: Player, gameState: GameState, faction: keyof PlayerScore) {
  const playerScore = gameState.playerScore[faction];

  return playerScore === 3;
}

export function noOneHasMoreInfluence(player: Player, gameState: GameState, faction: keyof PlayerScore) {
  const playerScore = gameState.playerScore[faction];

  return !gameState.enemyScore.some((x) => x[faction] > playerScore);
}

export function getCostAdjustedDesire(player: Player, resources: Resource[], desire: number) {
  let desireAdjustment = 1.0;
  let resourcesUsed: Resource[] = [];
  for (const resource of resources) {
    const costs = resource.amount ?? 1;
    const playerResourceAmount = getResourceAmount(player, resource.type);
    const alreadyUsedResourceAmount = getResourceAmountFromArray(resourcesUsed, resource.type);

    if (costs > playerResourceAmount - alreadyUsedResourceAmount) {
      return 0;
    }

    let resourceTypeModifier = 0.015 / desire;
    if (resource.type === 'spice') {
      resourceTypeModifier = 0.0225 / desire;
    } else if (resource.type === 'water') {
      resourceTypeModifier = 0.03 / desire;
    }

    desireAdjustment -= resourceTypeModifier * costs - (resourceTypeModifier / 2) * (playerResourceAmount - costs);

    resourcesUsed.push(resource);
  }
  const minDesireAdjustment = desire * 0.5;
  const maxDesireAdjustment = desire * 1.5 <= 1.0 ? desire * 1.5 : 1.0;

  return desire * clamp(desireAdjustment, minDesireAdjustment, maxDesireAdjustment);
}

export function playerCanDrawCards(gameState: GameState, amount: number) {
  return gameState.playerDeckCards && gameState.playerDeckCards.length > 0;
}

export function getResourceAmountFromArray(resources: Resource[], type: ResourceType) {
  return resources
    .filter((x) => x.type === type)
    .map((x) => x.amount ?? 1)
    .reduce((a, b) => a + b, 0);
}

export function getRewardAmountFromArray(resources: Effect[], type: EffectRewardType) {
  return resources
    .filter((x) => x.type === type)
    .map((x) => x.amount ?? 1)
    .reduce((a, b) => a + b, 0);
}
