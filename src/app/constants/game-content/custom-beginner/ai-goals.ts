import { clamp } from 'lodash';
import { normalizeNumber } from 'src/app/helpers/common';
import { isResourceArray } from 'src/app/helpers/resources';
import { ActionField } from 'src/app/models/location';
import { Player } from 'src/app/models/player';
import { AIGoals, FieldsForGoals, GameState } from 'src/app/services/ai/models';
import {
  enemyIsCloseToPlayerFactionScore,
  getCostAdjustedDesire,
  getMaxDesireOfUnreachableGoals,
  getParticipateInCombatDesire,
  getPlayerGarrisonStrength,
  getResourceAmount,
  getRewardAmountFromArray,
  getWinCombatDesire,
  noOneHasMoreInfluence,
  playerCanDrawCards,
  playerCanGetAllianceThisTurn,
  playerCanGetVictoryPointThisTurn,
} from 'src/app/services/ai/shared';
import { EffectRewardType, FactionType, Resource } from '../../../models';

export const aiGoalsCustomBeginner: FieldsForGoals = {
  'get-victory-points': {
    baseDesire: 0.5,
    desireModifier: (player, gameState, goals) => 0.033 * (gameState.currentRound - 1),
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'victory-point', 0, 1),
    }),
  },
  'high-council': {
    baseDesire: 0.65,
    desireModifier: (player, gameState, goals) =>
      0.01 * getResourceAmount(player, 'solari') - 0.015 * (gameState.currentRound - 1),
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'solari') > 6,
    reachedGoal: (player, gameState) => player.hasCouncilSeat || gameState.isFinale,
    desiredFields: (fields) => ({
      // Three because "amount" is used for the persuasion indicator
      ...getViableBoardFields(fields, 'council-seat-small', 0, 3),
    }),
    viableFields: () => ({}),
  },
  swordmaster: {
    baseDesire: 0.8,
    desireModifier: (player, gameState, goals) =>
      0.01 * getResourceAmount(player, 'solari') - 0.035 * (gameState.currentRound - 1),
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'solari') > 8,
    reachedGoal: (player, gameState) => player.hasSwordmaster || gameState.isFinale,
    desiredFields: (fields) => ({
      ...getViableBoardFields(fields, 'sword-master', 0, 1),
    }),
    viableFields: () => ({}),
  },
  mentat: {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) =>
      (gameState.playerAgentsOnFields.length > 0 ? 1.0 : 0) *
      (0.1 +
        0.01 * getResourceAmount(player, 'spice') +
        0.025 * (gameState.currentRound - 1) +
        0.02 * gameState.playerCardsBought),
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'spice') > 1,
    reachedGoal: () => false,
    desiredFields: (fields) => ({
      ...getViableBoardFields(fields, 'agent-lift', 0, 1),
    }),
    viableFields: () => ({}),
  },
  dreadnought: {
    baseDesire: 0.4,
    desireModifier: (player, gameState, goals) =>
      0.01 * getResourceAmount(player, 'solari') +
      0.01 * gameState.playerDreadnoughtCount +
      0.005 * (gameState.currentRound - 1) -
      0.01 * gameState.playerCombatUnits.troopsInGarrison,
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'solari') > 4,
    reachedGoal: (player, gameState) => gameState.playerDreadnoughtCount > 1,
    desiredFields: (fields) => ({
      ...getViableBoardFields(fields, 'dreadnought', 0, 1),
    }),
    viableFields: () => ({}),
  },
  'fremen-friendship': {
    baseDesire: 0.1,
    desireModifier: (player, gameState, goals) => 0.025 * gameState.playerScore.fremen + 0.02 * (gameState.currentRound - 1),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.playerScore.fremen > 1 || gameState.isFinale,
    viableFields: (fields) => ({
      ...getViableBoardFieldsForFaction(fields, 'fremen'),
    }),
  },
  'fremen-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals) =>
      0.025 * gameState.playerScore.fremen +
      (playerCanGetVictoryPointThisTurn(player, gameState, 'fremen') ? 0.1 : 0) +
      (playerCanGetAllianceThisTurn(player, gameState, 'fremen') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'fremen') ? 0.01 * gameState.currentRound : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.fremen > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'fremen'),
    viableFields: (fields) => ({
      ...getViableBoardFieldsForFaction(fields, 'fremen'),
    }),
  },
  'bg-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals) =>
      0.025 * gameState.playerScore.fremen +
      (playerCanGetVictoryPointThisTurn(player, gameState, 'bene') ? 0.1 : 0) +
      (playerCanGetAllianceThisTurn(player, gameState, 'bene') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'bene') ? 0.01 * gameState.currentRound : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.bene > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'bene'),
    viableFields: (fields) => ({
      ...getViableBoardFieldsForFaction(fields, 'bene'),
    }),
  },
  'guild-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals) =>
      0.025 * gameState.playerScore.fremen +
      (playerCanGetVictoryPointThisTurn(player, gameState, 'guild') ? 0.1 : 0) +
      (playerCanGetAllianceThisTurn(player, gameState, 'guild') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'guild') ? 0.01 * gameState.currentRound : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.guild > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'guild'),
    viableFields: (fields) => ({
      ...getViableBoardFieldsForFaction(fields, 'guild'),
    }),
  },
  'emperor-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals) =>
      0.025 * gameState.playerScore.fremen +
      (playerCanGetVictoryPointThisTurn(player, gameState, 'emperor') ? 0.1 : 0) +
      (playerCanGetAllianceThisTurn(player, gameState, 'emperor') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'emperor') ? 0.01 * gameState.currentRound : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.emperor > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'emperor'),
    viableFields: (fields) => ({
      ...getViableBoardFieldsForFaction(fields, 'emperor'),
    }),
  },
  'enter-combat': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      const alwaysTryToWinCombat = gameState.isFinale || getPlayerGarrisonStrength(gameState.playerCombatUnits) > 10;
      const winCombatDesire = 0.33 * getWinCombatDesire(gameState);
      const participateInCombatDesire = !alwaysTryToWinCombat ? getParticipateInCombatDesire(gameState) : 0;

      const modifier = winCombatDesire > participateInCombatDesire ? winCombatDesire : participateInCombatDesire;

      return modifier;
    },
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      // Influenced by troops, intrigues and dreadnoughts
      // Custom amounts generated by ai manager
      ...getViableBoardFields(fields, 'combat', 0, 1),
    }),
  },
  troops: {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => 0.15 * (4 - gameState.playerCombatUnits.troopsInGarrison),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.playerCombatUnits.troopsInGarrison > 5,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'troop', 0, 4),
    }),
  },
  intrigues: {
    baseDesire: 0.3,
    desireModifier: (player, gameState, goals) =>
      0.01 * (gameState.currentRound - 1) - 0.033 * gameState.playerIntrigueCount,
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.playerIntrigueCount > 2,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'intrigue', 0, 2),
    }),
  },
  'intrigue-steal': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => gameState.playerIntrigueStealAmount * 0.25,
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'intrigue-draw', 0, 1),
    }),
  },
  'fold-space': {
    baseDesire: 0.15,
    desireModifier: (player, gameState, goals) =>
      (gameState.playerAgentsOnFields.length + 1 < player.agents ? 0.2 : 0) -
      0.01 * gameState.playerCardsBought -
      0.01 * (gameState.playerCardsTrashed + player.focusTokens),
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'foldspace', 0, 2),
    }),
  },
  'get-board-persuasion': {
    baseDesire: 0.5,
    desireModifier: (player, gameState, goals) =>
      -0.01 * gameState.playerCardsBought -
      0.01 * (gameState.playerCardsTrashed + player.focusTokens) -
      (player.hasCouncilSeat ? 0.05 : 0.0),
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'persuasion', 0, 2),
    }),
  },
  'draw-cards': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      const deckBuildingDesire = !gameState.isFinale
        ? clamp(
            0.4 +
              (player.hasCouncilSeat ? 0.1 : 0) -
              0.0066 * (gameState.currentRound - 1) * gameState.currentRound +
              0.033 * gameState.playerCardsBought +
              0.025 * (gameState.playerCardsTrashed + player.focusTokens),
            0,
            0.6
          )
        : 0;

      const getSpiceMustFlowsDesire =
        gameState.playerDeckSizeTotal > 7
          ? clamp(
              0.1 +
                (player.hasCouncilSeat ? 0.1 : 0) +
                0.05 * gameState.playerCardsBought +
                0.05 * (gameState.playerCardsTrashed + player.focusTokens),
              0,
              0.6
            )
          : 0;

      const modifier = deckBuildingDesire > getSpiceMustFlowsDesire ? deckBuildingDesire : getSpiceMustFlowsDesire;

      return modifier;
    },
    goalIsReachable: () => false,
    reachedGoal: (player, gameState, goals) => !playerCanDrawCards(gameState, 1),
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'card-draw', 0, 3),
      Truthsay: (player, gameState, goals) =>
        getCostAdjustedDesire(
          player,
          [{ type: 'spice', amount: 2 }],
          clamp(0.5 + 0.025 * gameState.playerCardsBought, 0, 0.7)
        ),
    }),
  },
  'trim-cards': {
    baseDesire: 0.45,
    desireModifier: (player, gameState, goals) =>
      clamp(
        -(0.0066 * (gameState.currentRound - 1) * gameState.currentRound) +
          0.1 * gameState.playerCardsBought -
          0.15 * (gameState.playerCardsTrashed + player.focusTokens),
        -0.4,
        0.4
      ),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.playerDeckSizeTotal < 8 || gameState.isFinale,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'focus', 0, 2),
      ...getViableBoardFields(fields, 'card-destroy', 0, 2),
    }),
  },
  'collect-water': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      let maxDesire = 0.0;

      const waterDependentGoalTypes: { type: AIGoals; modifier: number }[] = [
        { type: 'collect-spice', modifier: 0.9 },
        { type: 'enter-combat', modifier: 0.9 },
        { type: 'troops', modifier: 0.7 },
      ];

      return getMaxDesireOfUnreachableGoals(player, gameState, goals, waterDependentGoalTypes, maxDesire);
    },
    goalIsReachable: () => false,
    reachedGoal: (player, gameState, goals) => getResourceAmount(player, 'water') > 1,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'water', 0, 2),
    }),
  },
  'collect-spice': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      let maxDesire = 0.0;

      const spiceDependentGoalTypes: { type: AIGoals; modifier: number }[] = [
        { type: 'collect-solari', modifier: 0.9 },
        { type: 'draw-cards', modifier: 0.9 },
        { type: 'troops', modifier: 0.8 },
        { type: 'intrigues', modifier: 0.7 },
      ];

      return getMaxDesireOfUnreachableGoals(player, gameState, goals, spiceDependentGoalTypes, maxDesire);
    },
    goalIsReachable: () => false,
    reachedGoal: (player, gameState, goals) => getResourceAmount(player, 'spice') > 3,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'spice', 0, 3),
    }),
  },
  'collect-solari': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      let maxDesire = 0.0;

      const solariDependentGoalTypes: { type: AIGoals; modifier: number }[] = [
        { type: 'swordmaster', modifier: 0.9 },
        { type: 'high-council', modifier: 0.9 },
        { type: 'dreadnought', modifier: 0.9 },
        { type: 'tech', modifier: 0.8 },
      ];

      return getMaxDesireOfUnreachableGoals(player, gameState, goals, solariDependentGoalTypes, maxDesire);
    },
    goalIsReachable: () => false,
    reachedGoal: (player, gameState, goals) => getResourceAmount(player, 'solari') > (!player.hasSwordmaster ? 8 : 6),
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'solari', 0, 6),
    }),
  },
  'swordmaster-helper': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) =>
      getResourceAmount(player, 'solari') > 5 && !player.hasSwordmaster ? 0.2 - 0.02 * (gameState.currentRound - 1) : 0,
    goalIsReachable: () => false,
    reachedGoal: (player, gameState, goals) => player.hasSwordmaster || gameState.isFinale,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'solari', 0, 6),
    }),
  },
};

function getViableBoardFieldsForFaction(
  fields: ActionField[],
  factionType: FactionType
): { [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number } {
  const factionFields = fields.filter((x) => x.actionType === factionType);
  const viableFields: {
    [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number;
  } = {};

  for (const field of factionFields) {
    const baseFieldDesire = 0.5;

    if (field.costs && isResourceArray(field.costs)) {
      viableFields[field.title.en] = (player, gameState, goals) =>
        getCostAdjustedDesire(player, field.costs as Resource[], baseFieldDesire);
    } else {
      viableFields[field.title.en] = () => baseFieldDesire;
    }
  }

  return viableFields;
}

function getViableBoardFields(
  fields: ActionField[],
  rewardType: EffectRewardType,
  minReward: number,
  maxReward: number
): { [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number } {
  const fieldsWithReward = fields.filter((x) => x.rewards.some((y) => y.type === rewardType));
  const viableFields: {
    [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number;
  } = {};

  for (const field of fieldsWithReward) {
    const baseFieldDesire = normalizeNumber(getRewardAmountFromArray(field.rewards, rewardType), maxReward, minReward);

    if (field.costs && isResourceArray(field.costs)) {
      viableFields[field.title.en] = (player, gameState, goals) =>
        getCostAdjustedDesire(player, field.costs as Resource[], baseFieldDesire);
    } else {
      viableFields[field.title.en] = () => baseFieldDesire;
    }
  }

  return viableFields;
}
