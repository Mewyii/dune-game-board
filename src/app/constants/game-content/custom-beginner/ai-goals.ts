import { clamp } from 'lodash';
import {
  enemyIsCloseToPlayerFactionScore,
  getAccumulatedSpice,
  getCostAdjustedDesire,
  getMaxDesireOfUnreachableGoals,
  getParticipateInCombatDesireModifier,
  getPlayerGarrisonStrength,
  getPlayerdreadnoughtCount,
  getResourceAmount,
  getWinCombatDesireModifier,
  noOneHasMoreInfluence,
  playerCanDrawCards,
  playerCanGetAllianceThisTurn,
  playerLikelyWinsCombat,
} from 'src/app/services/ai/shared';
import { AIGoals, FieldsForGoals } from 'src/app/services/ai/models';

export const aiGoalsCustomBeginner: FieldsForGoals = {
  'high-council': {
    baseDesire: 0.7,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.01 * getResourceAmount(player, 'solari', virtualResources) - 0.015 * (gameState.currentRound - 1),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 6,
    reachedGoal: (player, gameState) => player.hasCouncilSeat === true || gameState.isFinale,
    desiredFields: (fields) => ({
      'High Council Seat': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'solari', amount: 7 }], 1.0, virtualResources),
    }),
    viableFields: () => ({}),
  },
  swordmaster: {
    baseDesire: 0.8,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.01 * getResourceAmount(player, 'solari', virtualResources) - 0.033 * (gameState.currentRound - 1),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 8,
    reachedGoal: (player, gameState) => player.hasSwordmaster === true || gameState.isFinale,
    desiredFields: (fields) => ({
      Swordmaster: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'solari', amount: 9 }], 1.0, virtualResources),
    }),
    viableFields: () => ({}),
  },
  mentat: {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.01 * getResourceAmount(player, 'spice', virtualResources) +
      0.015 * (gameState.currentRound - 1) +
      0.02 * player.cardsBought,
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'spice', virtualResources) > 1,
    reachedGoal: (player, gameState) => gameState.agentsOnFields.some((x) => x.fieldId === 'Truthsay'),
    desiredFields: (fields) => ({
      Truthsay: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'spice', amount: 2 }], 1.0, virtualResources),
    }),
    viableFields: () => ({}),
  },
  dreadnought: {
    baseDesire: 0.4,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.01 * getResourceAmount(player, 'solari', virtualResources) -
      0.025 * (gameState.currentRound - 1) -
      0.05 * getPlayerdreadnoughtCount(gameState) +
      0.0175 * (5 - gameState.playerCombatUnits.troopsInGarrison),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 4,
    reachedGoal: (player, gameState) => getPlayerdreadnoughtCount(gameState) > 1,
    desiredFields: (fields) => ({
      Upgrade: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'solari', amount: 5 }], 1.0, virtualResources),
    }),
    viableFields: () => ({}),
  },
  'fremen-friendship': {
    baseDesire: 0.125,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.025 * gameState.playerScore.fremen + 0.02 * (gameState.currentRound - 1),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.playerScore.fremen > 1,
    viableFields: (fields) => ({
      'Desert Equipment': () => 0.5,
      'Desert Knowledge (card-draw)': () => 0.5,
      'Desert Knowledge (card-destroy)': () => 0.5,
    }),
  },
  'fremen-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.025 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'fremen') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'fremen') ? 0.0125 * gameState.currentRound : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.fremen > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'fremen'),
    viableFields: (fields) => ({
      'Desert Equipment': () => 0.5,
      'Desert Knowledge (card-draw)': () => 0.5,
      'Desert Knowledge (card-destroy)': () => 0.5,
    }),
  },
  'bg-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.025 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'bene') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'bene') ? 0.0125 * gameState.currentRound : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.bene > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'bene'),
    viableFields: (fields) => ({
      Truthsay: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'spice', amount: 2 }], 0.5, virtualResources),
      'Mind Training': () => 0.5,
    }),
  },
  'guild-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.025 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'guild') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'guild') ? 0.0125 * gameState.currentRound : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.guild > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'guild'),
    viableFields: (fields) => ({
      Heighliner: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 0.5, virtualResources),
      'Guild Contract': () => 0.5,
    }),
  },
  'emperor-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.025 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'emperor') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'emperor') ? 0.0125 * gameState.currentRound : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.emperor > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'emperor'),
    viableFields: (fields) => ({
      Conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 0.5, virtualResources),
      'Imperial Favor': () => 0.5,
    }),
  },
  'enter-combat': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      const alwaysTryToWinCombat = gameState.isFinale || getPlayerGarrisonStrength(gameState.playerCombatUnits) > 10;
      const winCombatDesire = 0.33 * getWinCombatDesireModifier(gameState);
      const participateInCombatDesire = !alwaysTryToWinCombat ? getParticipateInCombatDesireModifier(gameState) : 0;

      const modifier = winCombatDesire > participateInCombatDesire ? winCombatDesire : participateInCombatDesire;
      const name = winCombatDesire * 3 > participateInCombatDesire ? 'conflict: win' : 'conflict: participate';

      console.log('conflict: win ' + winCombatDesire * 3);
      console.log('conflict: participate ' + participateInCombatDesire);

      return {
        name,
        modifier,
      };
    },
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => playerLikelyWinsCombat(gameState),
    viableFields: (fields) => ({
      Arrakeen: () => 0.6,
      Carthag: () => 0.6,
      'Sietch Tabr': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 2 }], 0.9, virtualResources),
      Conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 0.9, virtualResources),
      'Desert Knowledge (card-draw)': (player, gameState) => (gameState.playerScore.fremen === 1 ? 0.6 : 0),
      'Desert Knowledge (card-destroy)': (player, gameState) => (gameState.playerScore.fremen === 1 ? 0.6 : 0),
      'Imperial Basin': () => 0.5,
      "Tuek's Sietch": (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 1 }], 0.5, virtualResources),
      'Hagga Basin': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 1 }], 0.5, virtualResources),
      'The Great Flat': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 2 }], 0.5, virtualResources),
      'Upgrade (tech)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'solari', amount: 6 }], 0.5, virtualResources),
      Upgrade: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'solari', amount: 6 }], 0.8, virtualResources),
    }),
  },
  troops: {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.125 * (5 - gameState.playerCombatUnits.troopsInGarrison),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 1 || getResourceAmount(player, 'spice', virtualResources) > 3,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      Arrakeen: () => 0.3,
      Carthag: () => 0.3,
      'Sietch Tabr': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 2 }], 0.75, virtualResources),
      Alliances: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'solari', amount: 3 }], 0.6, virtualResources),
      'Desert Equipment': (player, gameState, goals, virtualResources) => (gameState.playerScore.fremen === 1 ? 0.3 : 0.0),
      'Desert Knowledge (card-draw)': (player, gameState) => (gameState.playerScore.fremen === 1 ? 0.3 : 0.0),
      'Desert Knowledge (card-destroy)': (player, gameState) => (gameState.playerScore.fremen === 1 ? 0.3 : 0.0),
      Heighliner: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 1, virtualResources),
      Conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 0.75, virtualResources),
      'Supply Shipment': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'solari', amount: 2 }], 0.3, virtualResources),
    }),
  },
  intrigues: {
    baseDesire: 0.3,
    desireModifier: (player, gameState, goals, virtualResources) => -0.033 * player.intrigueCount,
    goalIsReachable: () => false,
    reachedGoal: (player) => player.intrigueCount > 2,
    viableFields: (fields) => ({
      Carthag: () => 0.5,
      'Imperial Favor': () => 0.5,
      Conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 1.0, virtualResources),
      'Mind Training': (player, gameState) => (gameState.playerScore.bene === 1 ? 0.5 : 0.0),
      Truthsay: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(
          player,
          [{ type: 'spice', amount: 2 }],
          gameState.playerScore.bene === 1 ? 0.5 : 0.0,
          virtualResources
        ),
    }),
  },
  'intrigue-steal': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) =>
      gameState.enemyPlayers.filter((x) => x.intrigueCount > 3).length * 0.2,
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      'Mind Training': (player, gameState) => (gameState.playerScore.bene === 1 ? 1.0 : 0.0),
      Truthsay: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(
          player,
          [{ type: 'spice', amount: 2 }],
          gameState.playerScore.bene === 1 ? 1.0 : 0.0,
          virtualResources
        ),
    }),
  },
  'fold-space': {
    baseDesire: 0.3,
    desireModifier: (player, gameState, goals, virtualResources) =>
      -0.0125 * player.cardsBought - 0.0125 * (player.cardsTrimmed + player.focusTokens),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.isFinale,
    viableFields: (fields) => ({
      Heighliner: (player, gameState, goals, virtualResources) =>
        gameState.playerScore.guild === 1
          ? getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 0.5, virtualResources)
          : 0,
      'Guild Contract': (player, gameState) => (gameState.playerScore.guild === 1 ? 0.5 : 0),
      "Tuek's Sietch": (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 1 }], 0.5, virtualResources),
    }),
  },
  'get-board-persuasion': {
    baseDesire: 0.5,
    desireModifier: (player, gameState, goals, virtualResources) =>
      -0.025 * player.cardsBought - 0.0125 * (player.cardsTrimmed + player.focusTokens),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.isFinale,
    viableFields: (fields) => ({
      Propaganda: (player, gameState, goals, virtualResources) => 1.0,
      Alliances: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'solari', amount: 3 }], 0.5, virtualResources),
    }),
  },
  'draw-cards': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      const deckBuildingDesire = !gameState.isFinale
        ? clamp(
            0.4 +
              (player.hasCouncilSeat ? 0.1 : 0) -
              0.0066 * (gameState.currentRound - 1) * gameState.currentRound +
              0.033 * player.cardsBought +
              0.025 * (player.cardsTrimmed + player.focusTokens),
            0,
            0.6
          )
        : 0;

      const getSpiceMustFlowsDesire =
        player.cardsInDeck > 7
          ? clamp(
              0.1 +
                (player.hasCouncilSeat ? 0.1 : 0) +
                0.05 * player.cardsBought +
                0.05 * (player.cardsTrimmed + player.focusTokens),
              0,
              0.6
            )
          : 0;

      // console.log('deckbuilding: ' + deckBuildingDesire);
      // console.log('spice must flows: ' + getSpiceMustFlowsDesire);

      const modifier = deckBuildingDesire > getSpiceMustFlowsDesire ? deckBuildingDesire : getSpiceMustFlowsDesire;
      const name = deckBuildingDesire > getSpiceMustFlowsDesire ? 'persuasion: build deck' : 'persuasion: spice must flows';

      return {
        name,
        modifier,
      };
    },
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'spice', virtualResources) > 1,
    reachedGoal: (player, gameState, goals, virtualResources) => !playerCanDrawCards(player, 1),
    viableFields: (fields) => ({
      Alliances: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'solari', amount: 3 }], 0.3, virtualResources),
      'Imperial Test Station (card-draw)': (player) => clamp(0.6 + 0.025 * player.cardsBought, 0, 0.7),
      'Imperial Test Station (card-destroy)': (player) => clamp(0.3, 0, 0.7),
      Heighliner: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(
          player,
          [{ type: 'spice', amount: 4 }],
          clamp(0.6 + 0.025 * player.cardsBought, 0, 0.7),
          virtualResources
        ),
      'Mind Training': (player, gameState) => 0.3,
      Truthsay: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(
          player,
          [{ type: 'spice', amount: 2 }],
          clamp(0.5 + 0.025 * player.cardsBought, 0, 0.7),
          virtualResources
        ),
      'Desert Knowledge (card-draw)': (player, gameState) => 0.3,
      'Supply Shipment': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'solari', amount: 2 }], 0.3, virtualResources),
    }),
  },
  'trim-cards': {
    baseDesire: 0.4,
    desireModifier: (player, gameState, goals, virtualResources) =>
      clamp(
        -(0.0066 * (gameState.currentRound - 1) * gameState.currentRound) +
          0.1 * player.cardsBought -
          0.15 * (player.cardsTrimmed + player.focusTokens),
        -0.4,
        0.4
      ),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => player.cardsInDeck < 7 || gameState.isFinale,
    viableFields: (fields) => ({
      'Mind Training': (player, gameState) => 0.5,
      'Desert Knowledge (card-destroy)': (player, gameState) => 0.5,
      'Imperial Test Station (card-destroy)': (player) => 0.5,
    }),
  },
  'collect-water': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      let maxDesire = 0.0;

      const waterDependentGoalTypes: { type: AIGoals; modifier: number }[] = [
        { type: 'collect-spice', modifier: 1.0 },
        { type: 'troops', modifier: 1.0 },
        { type: 'harvest-accumulated-spice-basin', modifier: 1.0 },
        { type: 'harvest-accumulated-spice-flat', modifier: 1.0 },
        { type: 'tech', modifier: 0.75 },
      ];

      return getMaxDesireOfUnreachableGoals(player, gameState, goals, virtualResources, waterDependentGoalTypes, maxDesire);
    },
    goalIsReachable: () => false,
    reachedGoal: (player, gameState, goals, virtualResources) => getResourceAmount(player, 'water', virtualResources) > 1,
    viableFields: (fields) => ({
      'Supply Shipment': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'solari', amount: 2 }], 0.5, virtualResources),
      'Desert Equipment': (player, gameState) => 0.5,
    }),
  },
  'collect-spice': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      let maxDesire = 0.0;

      const spiceDependentGoalTypes: { type: AIGoals; modifier: number }[] = [
        { type: 'collect-solari', modifier: 1.0 },
        { type: 'troops', modifier: 0.9 },
        { type: 'draw-cards', modifier: 0.9 },
        { type: 'intrigues', modifier: 0.9 },
      ];

      return getMaxDesireOfUnreachableGoals(player, gameState, goals, virtualResources, spiceDependentGoalTypes, maxDesire);
    },
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 0,
    reachedGoal: (player, gameState, goals, virtualResources) => getResourceAmount(player, 'spice', virtualResources) > 3,
    viableFields: (fields) => ({
      "Tuek's Sietch": (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(
          player,
          [{ type: 'water', amount: 1 }],
          0.0 + 0.4 * getAccumulatedSpice(gameState, "Tuek's Sietch"),
          virtualResources
        ),
      'Imperial Basin': (player, gameState) => 0.35 + 0.4 * getAccumulatedSpice(gameState, 'Imperial Basin'),
      'Hagga Basin': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(
          player,
          [{ type: 'water', amount: 1 }],
          0.6 + 0.3 * getAccumulatedSpice(gameState, 'Hagga Basin'),
          virtualResources
        ),
      'The Great Flat': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(
          player,
          [{ type: 'water', amount: 2 }],
          0.8 + 0.2 * getAccumulatedSpice(gameState, 'Hagga Basin'),
          virtualResources
        ),
    }),
  },
  'collect-solari': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      let maxDesire = 0.0;

      const solariDependentGoalTypes: { type: AIGoals; modifier: number }[] = [
        { type: 'swordmaster', modifier: 1.0 },
        { type: 'high-council', modifier: 1.0 },
        { type: 'dreadnought', modifier: 1.0 },
        { type: 'tech', modifier: 1.0 },
      ];

      return getMaxDesireOfUnreachableGoals(player, gameState, goals, virtualResources, solariDependentGoalTypes, maxDesire);
    },
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'spice', virtualResources) > 0,
    reachedGoal: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > (!player.hasSwordmaster ? 8 : 6),
    viableFields: (fields) => ({
      Arrakeen: () => 0.35,
      'Imperial Favor': (player, gameState) => (gameState.playerScore.emperor === 1 ? 0.5 : 0.2),
      Conspiracy: (player, gameState, goals, virtualResources) =>
        gameState.playerScore.emperor === 1
          ? getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 0.35, virtualResources)
          : 0,
      'Guild Contract': () => 0.5,
      'Spice Trade': (player, gameState, goals, virtualResources) =>
        getResourceAmount(player, 'spice', virtualResources) > 0
          ? 1.0 - 0.033 * getResourceAmount(player, 'solari', virtualResources)
          : 0,
    }),
  },
  'harvest-accumulated-spice-basin': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => 0.25 * getAccumulatedSpice(gameState, 'Hagga Basin'),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 0,
    reachedGoal: (player, gameState) => getAccumulatedSpice(gameState, 'Imperial Basin') === 0,
    viableFields: (fields) => ({
      'Hagga Basin': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 1 }], 1.0, virtualResources),
    }),
  },
  'harvest-accumulated-spice-flat': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => 0.25 * getAccumulatedSpice(gameState, 'The Great Flat'),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 1,
    reachedGoal: (player, gameState) => getAccumulatedSpice(gameState, 'The Great Flat') === 0,
    viableFields: (fields) => ({
      'The Great Flat': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 2 }], 1.0, virtualResources),
    }),
  },
  'swordmaster-helper': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 6 && !player.hasSwordmaster
        ? 0.35 - 0.05 * (getResourceAmount(player, 'solari', virtualResources) - 7) - 0.025 * (gameState.currentRound - 1)
        : 0,
    goalIsReachable: (player, gameState) => gameState.isFinale,
    reachedGoal: (player, gameState, goals, virtualResources) => player.hasSwordmaster === true,
    viableFields: (fields) => ({
      'Imperial Favor': (player, gameState) => (gameState.playerScore.emperor === 1 ? 0.75 : 0.5),
      'Guild Contract': () => 1.0,
      Arrakeen: () => 0.75,
      'Spice Trade': (player, gameState, goals, virtualResources) =>
        getResourceAmount(player, 'spice', virtualResources) > 0 ? 0.25 : 0,
      Conspiracy: (player, gameState, goals, virtualResources) =>
        gameState.playerScore.emperor === 1
          ? getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 0.75, virtualResources)
          : 0,
    }),
  },
};
