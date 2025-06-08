import { clamp } from 'lodash';
import {
  enemyIsCloseToPlayerFactionScore,
  getAvoidCombatTiesModifier,
  getMaxDesireOfUnreachedOrUnreachableGoals,
  getParticipateInCombatDesire,
  getPlayerCombatStrength,
  getResourceAmount,
  getWinCombatDesire,
  noOneHasMoreInfluence,
  playerCanDrawCards,
  playerCanGetAllianceThisTurn,
} from 'src/app/helpers/ai';
import { getViableBoardFields, getViableBoardFieldsForFaction } from 'src/app/helpers/ai/ai-fields';
import { AIGoals, FieldsForGoals, GameState } from 'src/app/models/ai';
import { Player } from 'src/app/models/player';

export const aiGoalsCustomExpert: FieldsForGoals = {
  'get-victory-points': {
    baseDesire: 0.5,
    desireModifier: (player, gameState, goals) => 0.033 * (gameState.currentRound - 1),
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'victory-point'),
    }),
  },
  'high-council': {
    baseDesire: 0.7,
    desireModifier: (player, gameState, goals) =>
      0.01 * getResourceAmount(player, 'solari') -
      0.0175 * (gameState.currentRound - 1) +
      (getResourceAmount(player, 'solari') > 9 ? 0.2 : 0),
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'solari') > 9,
    reachedGoal: (player, gameState) => !!player.hasCouncilSeat,
    desiredFields: (fields) => ({
      // Three because "amount" is used for the persuasion indicator
      ...getViableBoardFields(fields, 'council-seat-small', false),
    }),
    viableFields: () => ({}),
  },
  swordmaster: {
    baseDesire: 0.8,
    desireModifier: (player, gameState, goals) =>
      0.01 * getResourceAmount(player, 'solari') -
      0.025 * (gameState.currentRound - 1) +
      (getResourceAmount(player, 'solari') > 9 ? 0.2 : 0),
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'solari') > 9,
    reachedGoal: (player, gameState) => player.hasSwordmaster || gameState.isFinale,
    desiredFields: (fields) => ({
      ...getViableBoardFields(fields, 'sword-master', false),
      ...getViableBoardFields(fields, 'agent', false),
    }),
    viableFields: () => ({}),
  },
  tech: {
    baseDesire: 0.45,
    desireModifier: (player, gameState, goals) =>
      0.01 * getResourceAmount(player, 'spice') +
      0.02 * player.tech -
      0.01 * (gameState.currentRound - 1) +
      0.05 * gameState.playerIntriguesConversionCosts.tech +
      0.025 * gameState.playerTechTilesConversionCosts.tech,
    goalIsReachable: (player) => getResourceAmount(player, 'solari') > 2,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'tech'),
    }),
  },
  dreadnought: {
    baseDesire: 0.4,
    desireModifier: (player, gameState, goals) =>
      0.01 * getResourceAmount(player, 'solari') +
      0.01 * gameState.playerCombatUnits.troopsInGarrison +
      0.0075 * (gameState.currentRound - 1) -
      0.05 * gameState.playerDreadnoughtCount,
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'solari') > 4,
    reachedGoal: (player, gameState) => gameState.playerDreadnoughtCount > 1 || gameState.isFinale,
    desiredFields: (fields) => ({
      ...getViableBoardFields(fields, 'dreadnought', false),
    }),
    viableFields: () => ({}),
  },
  'location-control': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      let modifier = 0;
      let possibleLocationControls = 0;
      if (gameState.playerCombatUnits.shipsInCombat > 0) {
        possibleLocationControls += gameState.playerCombatUnits.shipsInCombat;
        modifier += 0.2 * gameState.playerCombatUnits.shipsInCombat;
      }
      if (gameState.conflict.rewards[0].some((x) => x.type === 'location-control')) {
        const playerCombatStrength = getPlayerCombatStrength(gameState.playerCombatUnits, gameState);
        possibleLocationControls += 1;
        modifier += 0.02 * playerCombatStrength;
      }
      if (gameState.playerHandCardsRewards['location-control'] > 0) {
        possibleLocationControls += gameState.playerHandCardsRewards['location-control'];
        modifier += 0.3 * gameState.playerHandCardsRewards['location-control'];
      }
      if (gameState.playerIntriguesRewards['location-control'] > 0) {
        possibleLocationControls += gameState.playerIntriguesRewards['location-control'];
        modifier += 0.15 * gameState.playerIntriguesRewards['location-control'];
      }
      if (gameState.playerTechTilesRewards['location-control'] > 0) {
        possibleLocationControls += gameState.playerTechTilesRewards['location-control'];
        modifier += 0.15 * gameState.playerTechTilesRewards['location-control'];
      }

      const agentsOnLocations = gameState.playerAgentsOnFields.filter(
        (x) =>
          gameState.freeLocations.some((freeLocation) => freeLocation === x.fieldId) ||
          gameState.enemyLocations.some((enemyLocation) => enemyLocation === x.fieldId)
      ).length;
      if (agentsOnLocations >= possibleLocationControls) {
        return 0;
      }

      return modifier;
    },
    goalIsReachable: (player, gameState, goals) => false,
    reachedGoal: (player, gameState) => false,
    desiredFields: (fields) => {
      const viableFields: {
        [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number;
      } = {};

      const locations = fields.filter((x) => x.ownerReward);
      for (const location of locations) {
        viableFields[location.title.en] = () => 1;
      }

      return viableFields;
    },
    viableFields: () => ({}),
  },
  mentat: {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) =>
      (gameState.playerAgentsOnFields.length > 0 ? 1.0 : 0) *
      (0.15 +
        0.01 * getResourceAmount(player, 'spice') +
        0.025 * (gameState.currentRound - 1) +
        0.02 * gameState.playerCardsBought),
    goalIsReachable: (player) => getResourceAmount(player, 'spice') > 0,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'agent-lift'),
    }),
  },
  'fremen-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals) =>
      0.025 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'fremen') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'fremen') ? 0.015 * gameState.currentRound : 0),
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
      (playerCanGetAllianceThisTurn(player, gameState, 'bene') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'bene') ? 0.015 * gameState.currentRound : 0),
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
      (playerCanGetAllianceThisTurn(player, gameState, 'guild') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'guild') ? 0.015 * gameState.currentRound : 0),
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
      (playerCanGetAllianceThisTurn(player, gameState, 'emperor') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'emperor') ? 0.015 * gameState.currentRound : 0),
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
      if (gameState.playerTurnInfos?.canEnterCombat) {
        return 0;
      }

      const winCombatDesire = clamp(getWinCombatDesire(gameState), 0, 0.9);
      const participateInCombatDesire = clamp(getParticipateInCombatDesire(gameState), 0, 0.6);
      const desire = winCombatDesire > participateInCombatDesire ? winCombatDesire : participateInCombatDesire;
      console.log('Win Combat Desire: ' + winCombatDesire);
      console.log('Participate in Combat Desire: ' + participateInCombatDesire);

      return desire + getAvoidCombatTiesModifier(gameState);
    },
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      // Influenced by troops, intrigues and dreadnoughts
      // Custom amounts generated by ai manager
      ...getViableBoardFields(fields, 'combat', true, 1),
    }),
  },
  troops: {
    baseDesire: 0.1,
    desireModifier: (player, gameState, goals) =>
      0.15 * (5 - gameState.playerCombatUnits.troopsInGarrison) +
      (gameState.playerTurnInfos?.canEnterCombat ? 0.25 : 0) +
      0.2 * gameState.playerIntriguesConversionCosts['loose-troop'] +
      0.1 * gameState.playerTechTilesConversionCosts['loose-troop'],
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.playerCombatUnits.troopsInGarrison > 5,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'troop'),
    }),
  },
  intrigues: {
    baseDesire: 0.35,
    desireModifier: (player, gameState, goals) =>
      0.01 * (gameState.currentRound - 1) - 0.075 * gameState.playerIntrigueCount,
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.playerIntrigueCount > 2,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'intrigue'),
    }),
  },
  'intrigue-steal': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => gameState.playerIntrigueStealAmount * 0.3,
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'intrigue-draw'),
    }),
  },
  'fold-space': {
    baseDesire: 0.1,
    desireModifier: (player, gameState, goals) =>
      (gameState.playerAgentsOnFields.length + 1 < player.agents ? 0.1 : 0) -
      0.01 * gameState.playerCardsBought -
      0.01 * (gameState.playerCardsTrashed + player.focusTokens) +
      0.033 * (7 - gameState.playerHandCardsFieldAccess.length),
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'foldspace'),
    }),
  },
  'get-board-persuasion': {
    baseDesire: 0.4,
    desireModifier: (player, gameState, goals) =>
      -0.0125 * gameState.playerCardsBought -
      0.0125 * (gameState.playerCardsTrashed + player.focusTokens) -
      (player.hasCouncilSeat ? 0.05 : 0.0),
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'persuasion'),
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
              0.025 * (gameState.playerCardsTrashed + player.focusTokens) +
              0.025 * (7 - gameState.playerHandCardsFieldAccess.length),
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
                0.05 * (gameState.playerCardsTrashed + player.focusTokens) +
                0.025 * (7 - gameState.playerHandCardsFieldAccess.length),
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
      ...getViableBoardFields(fields, 'card-draw'),
    }),
  },
  'discard-cards': {
    baseDesire: -0.1,
    desireModifier: (player, gameState, goals) =>
      0.01 * gameState.playerCardsBought -
      0.01 * (gameState.playerCardsTrashed + player.focusTokens) -
      0.01 * (7 - gameState.playerHandCardsFieldAccess.length),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState, goals) => gameState.playerHandCards.length < 1,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'card-discard'),
    }),
  },
  'trim-cards': {
    baseDesire: 0.2,
    desireModifier: (player, gameState, goals) =>
      clamp(
        -(0.0066 * (gameState.currentRound - 1) * gameState.currentRound) +
          0.125 * gameState.playerCardsBought -
          0.15 * (gameState.playerCardsTrashed + player.focusTokens),
        -0.4,
        0.4
      ),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.playerDeckSizeTotal < 9 || gameState.isFinale,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'focus'),
      ...getViableBoardFields(fields, 'card-destroy'),
    }),
  },
  'collect-water': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      let maxDesire = 0.0;

      const waterDependentGoalTypes: { type: AIGoals; modifier: number }[] = [
        { type: 'collect-spice', modifier: 0.9 },
        { type: 'enter-combat', modifier: 0.8 },
        { type: 'troops', modifier: 0.7 },
      ];

      return (
        getMaxDesireOfUnreachedOrUnreachableGoals(player, gameState, goals, waterDependentGoalTypes, maxDesire) +
        0.05 * gameState.playerIntriguesConversionCosts.water +
        0.025 * gameState.playerTechTilesConversionCosts.water
      );
    },
    goalIsReachable: () => false,
    reachedGoal: (player, gameState, goals) => getResourceAmount(player, 'water') > 1,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'water'),
    }),
  },
  'collect-spice': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      let maxDesire = 0.0;

      const spiceDependentGoalTypes: { type: AIGoals; modifier: number }[] = [
        { type: 'collect-solari', modifier: 0.9 },
        { type: 'draw-cards', modifier: 0.8 },
        { type: 'troops', modifier: 0.7 },
        { type: 'intrigues', modifier: 0.6 },
        { type: 'tech', modifier: 0.5 },
      ];

      return (
        getMaxDesireOfUnreachedOrUnreachableGoals(player, gameState, goals, spiceDependentGoalTypes, maxDesire) +
        0.05 * gameState.playerIntriguesConversionCosts.spice +
        0.025 * gameState.playerTechTilesConversionCosts.spice
      );
    },
    goalIsReachable: (player) => getResourceAmount(player, 'water') > 1,
    reachedGoal: (player, gameState, goals) => getResourceAmount(player, 'spice') > 3,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'spice'),
    }),
  },
  'collect-solari': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      let maxDesire = 0.0;

      const solariDependentGoalTypes: { type: AIGoals; modifier: number }[] = [
        { type: 'swordmaster', modifier: 1.0 },
        { type: 'high-council', modifier: 1.0 },
        { type: 'dreadnought', modifier: 1.0 },
        { type: 'tech', modifier: 0.8 },
      ];

      return (
        getMaxDesireOfUnreachedOrUnreachableGoals(player, gameState, goals, solariDependentGoalTypes, maxDesire) +
        0.05 * gameState.playerIntriguesConversionCosts.solari +
        0.025 * gameState.playerTechTilesConversionCosts.solari
      );
    },
    goalIsReachable: (player) => getResourceAmount(player, 'spice') > 2,
    reachedGoal: (player, gameState, goals) =>
      getResourceAmount(player, 'solari') > (!player.hasSwordmaster || !player.hasCouncilSeat ? 7 : 3),
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'solari'),
    }),
  },
  'swordmaster-helper': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) =>
      getResourceAmount(player, 'solari') > 6 && !player.hasSwordmaster ? 0.5 - 0.025 * (gameState.currentRound - 1) : 0,
    goalIsReachable: (player) => getResourceAmount(player, 'solari') > 9,
    reachedGoal: (player, gameState, goals) => player.hasSwordmaster || gameState.isFinale,
    viableFields: (fields) => ({
      ...getViableBoardFields(fields, 'solari'),
    }),
  },
};
