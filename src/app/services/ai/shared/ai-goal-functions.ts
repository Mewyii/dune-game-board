import { clamp } from 'lodash';
import { Resource, ResourceType } from 'src/app/models';
import { AIGoal, AIGoals, FieldsForGoals, GameState } from 'src/app/services/ai/models';
import { PlayerCombatUnits } from 'src/app/services/combat-manager.service';
import { Player } from 'src/app/services/player-manager.service';
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
  virtualResources: Resource[],
  baseDesire: number,
  influences: {
    resource: ResourceType | 'tech-agents' | 'intrigues' | 'cards-in-deck';
    amount: number;
    maxAmount?: number;
    negative?: boolean;
  }[]
) {
  let desire = baseDesire;
  for (const influence of influences) {
    const resourceAmount = getResourceAmount(player, influence.resource, virtualResources);
    if (!influence.negative) {
      desire = desire + clamp(resourceAmount * influence.amount, 0, influence.maxAmount ?? 1);
    } else {
      desire = desire - clamp(resourceAmount * influence.amount, 0, influence.maxAmount ?? 1);
    }
  }
  return clamp(desire, 0, 1);
}

export function getResourceAmount(
  player: Player,
  resourceType: ResourceType | 'tech-agents' | 'intrigues' | 'cards-in-deck',
  virtualResources: Resource[]
) {
  switch (resourceType) {
    case 'tech-agents':
      return player.techAgents;
    case 'intrigues':
      return player.intrigueCount;
    case 'cards-in-deck':
      return player.cardsInDeck;
    default:
      const resource = player.resources.find((x) => x.type === resourceType);
      const virtualResource = virtualResources.find((x) => x.type === resourceType);

      return (resource?.amount ?? 0) + (virtualResource?.amount ?? 0);
  }
}

export function getPlayerdreadnoughtCount(gameState: GameState) {
  return (
    gameState.playerCombatUnits.shipsInGarrison +
    gameState.playerCombatUnits.shipsInCombat +
    gameState.playerCombatUnits.shipsInTimeout
  );
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
  const combatPowerTreshold = 3 + Math.random() * 2 + (gameState.currentRound - 1) * 0.5;

  const playerCombatPower = getPlayerCombatStrength(player);

  const enemyCombatPower = getPlayerCombatStrength(enemy);
  const enemyAgentCount = gameState.enemyAgentCount.find((x) => x.playerId === enemy.playerId)?.agentAmount;

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
  let desire = 0.4 + 0.1 * gameState.playerAgentCount;

  const playerStrength =
    getPlayerCombatStrength(gameState.playerCombatUnits) + getPlayerGarrisonStrength(gameState.playerCombatUnits);

  desire = desire + 0.075 * playerStrength;

  let strengthOfStrongestEnemy = 0;
  let garrisonStrengthOfEnemiesNotInCombat = 0;
  for (const enemy of gameState.enemyCombatUnits) {
    const enemyCombatPower = getPlayerCombatStrength(enemy);

    if (enemyCombatPower > 0) {
      if (enemyCanContestPlayer(gameState.playerCombatUnits, enemy, gameState)) {
        desire = desire - 0.1;
      }

      if (!playerCanContestEnemy(gameState.playerCombatUnits, enemy, gameState)) {
        desire = desire - 0.4;
      }

      const enemyStrength = enemyCombatPower + 0.2 * getPlayerGarrisonStrength(enemy);

      if (enemyStrength > strengthOfStrongestEnemy) {
        strengthOfStrongestEnemy = enemyStrength;
      }
    } else {
      if (enemyCanContestPlayer(gameState.playerCombatUnits, enemy, gameState, true)) {
        desire = desire - 0.075;
      }

      garrisonStrengthOfEnemiesNotInCombat += getPlayerGarrisonStrength(enemy);
    }
  }

  desire = desire - 0.025 * strengthOfStrongestEnemy;
  desire = desire - 0.0025 * garrisonStrengthOfEnemiesNotInCombat;

  if (playerLikelyWinsCombat(gameState)) {
    desire = desire * 0.1;
  }

  return clamp(desire, 0.0, 1.0);
}

export function getParticipateInCombatDesireModifier(gameState: GameState) {
  let desire = 0.1 + 0.01 * (gameState.currentRound - 1);

  let enemiesInCombat = 0;
  let garrisonStrengthOfEnemiesNotInCombat = 0;
  for (const enemy of gameState.enemyCombatUnits) {
    if (enemy.troopsInCombat > 0) {
      enemiesInCombat++;

      desire = desire - 0.05;
    } else {
      garrisonStrengthOfEnemiesNotInCombat += getPlayerGarrisonStrength(enemy);
    }
  }

  const garrisonStrength = getPlayerGarrisonStrength(gameState.playerCombatUnits);

  if (garrisonStrength > 0 && enemiesInCombat < 3) {
    desire = desire + 0.05 * getInactiveEnemyCount(gameState);
    desire = desire + 0.05 * garrisonStrength;
    desire = desire - 0.0025 * garrisonStrengthOfEnemiesNotInCombat;

    return clamp(desire, 0.0, 0.75);
  }

  return 0;
}

export function getDesire(
  goal: AIGoal,
  player: Player,
  gameState: GameState,
  virtualResources: Resource[],
  goals: FieldsForGoals
) {
  const goalDesire = goal.desireModifier(player, gameState, goals, virtualResources);
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
  virtualResources: Resource[],
  goalType: { type: AIGoals; modifier: number },
  currentDesire: number
) {
  const goal = goals[goalType.type];
  if (!goal) {
    return currentDesire;
  }
  if (
    !goal.reachedGoal(player, gameState, goals, virtualResources) &&
    !goal.goalIsReachable(player, gameState, goals, virtualResources)
  ) {
    const goalDesire = getDesire(goal, player, gameState, virtualResources, goals);

    if (goalDesire > currentDesire) {
      return goalDesire;
    }
  }
  return currentDesire * goalType.modifier;
}

export function getMaxDesireOfUnreachableGoals(
  player: Player,
  gameState: GameState,
  goals: FieldsForGoals,
  virtualResources: Resource[],
  goalTypes: { type: AIGoals; modifier: number }[],
  currentDesire: number
) {
  for (const goalType of goalTypes) {
    currentDesire = getMaxDesireOfUnreachableGoal(player, gameState, goals, virtualResources, goalType, currentDesire);
  }
  return currentDesire;
}

export function getInactiveEnemyCount(gamestate: GameState) {
  return gamestate.enemyAgentCount.filter((x) => x.agentAmount < 1).length;
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

export function noOneHasMoreInfluence(player: Player, gameState: GameState, faction: keyof PlayerScore) {
  const playerScore = gameState.playerScore[faction];

  return !gameState.enemyScore.some((x) => x[faction] > playerScore);
}

export function getCostAdjustedDesire(
  player: Player,
  resourceType: ResourceType,
  costs: number,
  desire: number,
  virtualResources: Resource[]
) {
  const playerResourceAmount = getResourceAmount(player, resourceType, virtualResources);
  if (costs > playerResourceAmount) {
    return 0;
  }

  let resourceTypeModifier = 0.02 / desire;
  if (resourceType === 'spice') {
    resourceTypeModifier = 0.03 / desire;
  } else if (resourceType === 'water') {
    resourceTypeModifier = 0.035 / desire;
  }

  const minDesireAdjustment = desire * 0.5;
  const maxDesireAdjustment = desire * 1.5 <= 1.0 ? desire * 1.5 : 1.0;

  const desireAdjustment = clamp(
    1.0 - resourceTypeModifier * costs + (resourceTypeModifier / 2) * (playerResourceAmount - costs),
    minDesireAdjustment,
    maxDesireAdjustment
  );

  return desire * desireAdjustment;
}

export function playerCanDrawCards(player: Player, amount: number) {
  return player.cardsInDeck >= player.cardsDrawnThisRound + amount;
}