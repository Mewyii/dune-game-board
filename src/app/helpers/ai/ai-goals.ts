import { clamp } from 'lodash';
import { Effect, EffectRewardType, Resource, ResourceType } from 'src/app/models';
import { AIGoal, AIGoals, FieldsForGoals, GameState } from 'src/app/models/ai';
import { Player } from 'src/app/models/player';
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
    resource: ResourceType | 'tech';
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

export function getResourceAmount(player: Player, resourceType: ResourceType | 'tech') {
  switch (resourceType) {
    case 'tech':
      return player.tech;
    default:
      const resource = player.resources.find((x) => x.type === resourceType);

      return resource?.amount ?? 0;
  }
}

export function getPlayerCombatStrength(player: PlayerCombatUnits, gamestate: GameState) {
  return (
    player.troopsInCombat * gamestate.gameSettings.troopCombatStrength +
    player.shipsInCombat * gamestate.gameSettings.dreadnoughtCombatStrength +
    player.additionalCombatPower
  );
}

export function getPlayerGarrisonStrength(player: PlayerCombatUnits, gamestate: GameState) {
  return player.troopsInGarrison * gamestate.gameSettings.troopCombatStrength + player.shipsInGarrison * 4;
}

export function getDesire(goal: AIGoal, player: Player, gameState: GameState, goals: FieldsForGoals) {
  const goalDesire = goal.desireModifier(player, gameState, goals);
  return clamp(goal.baseDesire + goalDesire, -1, goal.maxDesire ?? 1);
}

export function getMaxDesireOfUnreachedOrUnreachableGoal(
  player: Player,
  gameState: GameState,
  goals: FieldsForGoals,
  goalType: { type: AIGoals; modifier: number }
) {
  const goal = goals[goalType.type];
  if (!goal) {
    return 0.0;
  }
  if (!goal.goalIsReachable(player, gameState, goals) && !goal.reachedGoal(player, gameState, goals)) {
    const goalDesire = getDesire(goal, player, gameState, goals);

    return goalDesire * goalType.modifier;
  } else {
    return 0.0;
  }
}

export function getMaxDesireOfUnreachedOrUnreachableGoals(
  player: Player,
  gameState: GameState,
  goals: FieldsForGoals,
  goalTypes: { type: AIGoals; modifier: number }[],
  currentDesire: number
) {
  for (const goalType of goalTypes) {
    const goalDesire = getMaxDesireOfUnreachedOrUnreachableGoal(player, gameState, goals, goalType);
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
  for (const resource of resources) {
    const costs = resource.amount ?? 1;
    const playerResourceAmount = getResourceAmount(player, resource.type);

    let resourceTypeModifier = 0.015 / desire;
    if (resource.type === 'spice') {
      resourceTypeModifier = 0.0225 / desire;
    } else if (resource.type === 'water') {
      resourceTypeModifier = 0.03 / desire;
    }

    desireAdjustment -= resourceTypeModifier * costs - (resourceTypeModifier / 2) * (playerResourceAmount - costs);
  }
  const minDesireAdjustment = desire * 0.5;
  const maxDesireAdjustment = desire * 1.5 <= 1.0 ? desire * 1.5 : 1.0;

  return desire * clamp(desireAdjustment, minDesireAdjustment, maxDesireAdjustment);
}

export function playerCanDrawCards(gameState: GameState, amount: number) {
  return gameState.playerDeckCards && gameState.playerDeckCards.length > amount;
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
