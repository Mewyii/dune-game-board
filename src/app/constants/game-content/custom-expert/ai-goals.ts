import { clamp } from 'lodash';
import {
  enemyIsCloseToPlayerFactionScore,
  getAccumulatedSpice,
  getCostAdjustedDesire,
  getDesire,
  getParticipateInCombatDesireModifier,
  getPlayerGarrisonStrength,
  getPlayerdreadnoughtCount,
  getResourceAmount,
  getResourceDesire,
  getWinCombatDesireModifier,
  noOneHasMoreInfluence,
  playerCanDrawCards,
  playerCanGetAllianceThisTurn,
  playerLikelyWinsCombat,
} from 'src/app/services/ai/shared';
import { FieldsForGoals } from 'src/app/services/ai/models';

export const aiGoalsCustomExpert: FieldsForGoals = {
  'high-council': {
    baseDesire: 0.65,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.0125 * getResourceAmount(player, 'solari', virtualResources) - 0.02 * (gameState.currentTurn - 1),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 6,
    reachedGoal: (player, gameState) => player.hasCouncilSeat === true || gameState.isFinale,
    desiredFields: {
      'high council': () => 1,
    },
    viableFields: {},
  },
  swordmaster: {
    baseDesire: 0.8,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.0125 * getResourceAmount(player, 'solari', virtualResources) - 0.033 * (gameState.currentTurn - 1),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 9,
    reachedGoal: (player, gameState) => player.hasSwordmaster === true || gameState.isFinale,
    desiredFields: {
      swordmaster: () => 1,
    },
    viableFields: {},
  },
  mentat: {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.025 * getResourceAmount(player, 'solari', virtualResources) +
      0.025 * (gameState.currentTurn - 1) +
      0.0125 * player.cardsBought,
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 2,
    reachedGoal: (player, gameState) => gameState.accumulatedSpiceOnFields.some((x) => x.fieldId === 'mentat'),
    desiredFields: {
      mentat: () => 1,
    },
    viableFields: {},
  },
  tech: {
    baseDesire: 0.4,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.01 * getResourceAmount(player, 'spice', virtualResources) + 0.02 * player.techAgents,
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 3,
    reachedGoal: () => false,
    desiredFields: {},
    viableFields: {
      'Space Port': (player, gameState, goals, virtualResources) =>
        getResourceDesire(player, virtualResources, 0.2, [
          { resource: 'spice', amount: 0.025 },
          { resource: 'tech-agents', amount: 0.025 },
          { resource: 'solari', amount: 0.0125, negative: true },
        ]),
      expedition: (player, gameState, goals, virtualResources) =>
        getResourceDesire(player, virtualResources, 0.5, [
          { resource: 'spice', amount: 0.025 },
          { resource: 'tech-agents', amount: 0.025 },
        ]),
      'upgrade (tech)': (player, gameState, goals, virtualResources) =>
        getResourceAmount(player, 'solari', virtualResources) > 3 ? 1 : 0,
    },
  },
  dreadnought: {
    baseDesire: 0.35,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.0075 * getResourceAmount(player, 'solari', virtualResources) -
      0.0125 * (gameState.currentTurn - 1) -
      0.1 * getPlayerdreadnoughtCount(gameState),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 3,
    reachedGoal: (player, gameState) => getPlayerdreadnoughtCount(gameState) > 1,
    desiredFields: {
      'upgrade (dreadnought)': (player, gameState, goals, virtualResources) => 1,
    },
    viableFields: {},
  },
  'fremen-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.033 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'fremen') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'fremen') ? 0.0125 * gameState.currentTurn : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.fremen > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'fremen'),
    viableFields: {
      'fremen warriors': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.5, virtualResources),
      'desert equipment': () => 0.5,
    },
  },
  'bg-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.033 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'bene') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'bene') ? 0.0125 * gameState.currentTurn : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.bene > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'bene'),
    viableFields: {
      'hidden knowledge': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 2, 0.5, virtualResources),
      'mind training': () => 0.5,
    },
  },
  'guild-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.033 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'guild') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'guild') ? 0.0125 * gameState.currentTurn : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.guild > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'guild'),
    viableFields: {
      heighliner: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 0.5, virtualResources),
      expedition: () => 0.5,
    },
  },
  'emperor-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.033 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'emperor') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'emperor') ? 0.0125 * gameState.currentTurn : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.emperor > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'emperor'),
    viableFields: {
      conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 0.5, virtualResources),
      'imperial favor': () => 0.5,
    },
  },
  'enter-combat': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      const alwaysTryToWinCombat = gameState.isFinale || getPlayerGarrisonStrength(gameState.playerCombatUnits) > 10;
      const winCombatDesire = 0.33 * getWinCombatDesireModifier(gameState);
      const participateInCombatDesire = !alwaysTryToWinCombat ? getParticipateInCombatDesireModifier(gameState) : 0;

      const modifier = winCombatDesire > participateInCombatDesire ? winCombatDesire : participateInCombatDesire;
      const name = winCombatDesire * 3 > participateInCombatDesire ? 'combat: win' : 'combat: participate';

      console.log('combat: win ' + winCombatDesire * 3);
      console.log('combat: partipicate ' + participateInCombatDesire);

      return {
        name,
        modifier,
      };
    },
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => playerLikelyWinsCombat(gameState),
    viableFields: {
      Arrakeen: () => 0.6,
      Carthag: () => 0.6,
      'Sietch Tabr': (player, gameState) => 0.6,
      'fremen warriors': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.7, virtualResources),
      'imperial favor': (player, gameState) => (gameState.playerScore.emperor === 1 ? 0.5 : 0),
      conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, gameState.playerScore.emperor === 1 ? 0.7 : 0, virtualResources),
      'Imperial Basin': () => 0.5,
      'Hagga Basin': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.5, virtualResources),
      'The Great Flat': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 2, 0.5, virtualResources),
      'Research Station (draw)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 2, 0.5, virtualResources),
      'Research Station (trim)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 2, 0.5, virtualResources),
      'upgrade (tech)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'solari', 4, 0.5, virtualResources),
      'upgrade (dreadnought)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'solari', 4, 0.7, virtualResources),
      heighliner: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 0.9, virtualResources),
    },
  },
  troops: {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => 0.2 * (4 - gameState.playerCombatUnits.troopsInGarrison),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 0 || getResourceAmount(player, 'spice', virtualResources) > 3,
    reachedGoal: () => false,
    viableFields: {
      Arrakeen: () => 0.3,
      Carthag: () => 0.3,
      'Sietch Tabr': (player, gameState) => 0.3,
      'fremen warriors': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, gameState.playerScore.fremen === 1 ? 0.9 : 0.6, virtualResources),
      'desert equipment': (player, gameState) => (gameState.playerScore.fremen === 1 ? 0.3 : 0.0),
      heighliner: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 1.0, virtualResources),
      conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, gameState.playerScore.emperor === 1 ? 0.8 : 0.6, virtualResources),
    },
  },
  intrigues: {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) => -0.05 * player.intrigueCount,
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: {
      relations: () => 0.5,
      Carthag: () => 0.5,
      conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 1.0, virtualResources),
      'mind training': (player, gameState) => (gameState.playerScore.bene === 1 ? 0.5 : 0.0),
      'hidden knowledge': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 2, gameState.playerScore.bene === 1 ? 0.5 : 0.0, virtualResources),
    },
  },
  'intrigue-steal': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) =>
      gameState.enemyPlayers.some((x) => x.intrigueCount > 3) ? 0.15 : 0,
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'spice', virtualResources) > 1,
    reachedGoal: () => false,
    viableFields: {
      'imperial favor': () => 1.0,
    },
  },
  'fold-space': {
    baseDesire: 0.3,
    desireModifier: (player, gameState, goals, virtualResources) =>
      -0.0125 * player.cardsBought - 0.0125 * (player.cardsTrimmed + player.focusTokens),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.isFinale,
    viableFields: {
      'Space Port': () => 0.5,
    },
  },
  'get-board-persuasion': {
    baseDesire: 0.35,
    desireModifier: (player, gameState, goals, virtualResources) =>
      -0.025 * player.cardsBought - 0.0125 * (player.cardsTrimmed + player.focusTokens),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.isFinale,
    viableFields: {
      relations: () => 1.0,
    },
  },
  'draw-cards': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      const deckBuildingDesire = !gameState.isFinale
        ? clamp(
            0.4 +
              (player.hasCouncilSeat ? 0.1 : 0) -
              0.0066 * (gameState.currentTurn - 1) * gameState.currentTurn +
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
      const name = deckBuildingDesire > getSpiceMustFlowsDesire ? 'card-draw: build deck' : 'card-draw: spice must flows';

      return {
        name,
        modifier,
      };
    },
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 1 || getResourceAmount(player, 'spice', virtualResources) > 1,
    reachedGoal: (player, gameState, goals, virtualResources) => !playerCanDrawCards(player, 1),
    viableFields: {
      mentat: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'solari', 3, 0.3, virtualResources),
      Arrakeen: () => 0.3,
      'Research Station (draw)': (player, gameState, goals, virtualResources) =>
        // if we cant buy 3 cards, we always trim
        playerCanDrawCards(player, 3)
          ? getCostAdjustedDesire(player, 'water', 2, clamp(0.6 + 0.075 * player.cardsBought, 0, 0.9), virtualResources)
          : 0,
      'Research Station (trim)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 2, clamp(0.5 + 0.075 * player.cardsBought, 0, 0.7), virtualResources),
      'mind training': (player, gameState) => 0.3,
      'hidden knowledge': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 2, clamp(0.6 + 0.075 * player.cardsBought, 0, 0.5), virtualResources),
      heighliner: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 0.3, virtualResources),
    },
  },
  'trim-cards': {
    baseDesire: 0.4,
    desireModifier: (player, gameState, goals, virtualResources) =>
      clamp(
        -(0.0066 * (gameState.currentTurn - 1) * gameState.currentTurn) +
          0.1 * player.cardsBought -
          0.15 * (player.cardsTrimmed + player.focusTokens),
        -0.4,
        0.4
      ),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => player.cardsInDeck < 7 || gameState.isFinale,
    viableFields: {
      'mind training': (player, gameState) => 0.5,
      'Research Station (trim)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 2, 0.5, virtualResources),
      'fremen warriors': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, gameState.playerScore.fremen === 1 ? 0.5 : 0.0, virtualResources),
      'desert equipment': (player, gameState) => (gameState.playerScore.fremen === 1 ? 0.5 : 0.0),
    },
  },
  'collect-water': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      let maxDesire = 0.0;
      if (
        !goals['collect-spice'].reachedGoal(player, gameState, goals, virtualResources) &&
        !goals['collect-spice'].goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals['collect-spice'], player, gameState, virtualResources, aiGoalsCustomExpert);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (
        !goals['draw-cards'].reachedGoal(player, gameState, goals, virtualResources) &&
        !goals['draw-cards'].goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals['draw-cards'], player, gameState, virtualResources, aiGoalsCustomExpert);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!goals['troops'].goalIsReachable(player, gameState, goals, virtualResources)) {
        const goalDesire = getDesire(goals['troops'], player, gameState, virtualResources, aiGoalsCustomExpert);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!goals['harvest-accumulated-spice-basin'].goalIsReachable(player, gameState, goals, virtualResources)) {
        const goalDesire = getDesire(
          goals['harvest-accumulated-spice-basin'],
          player,
          gameState,
          virtualResources,
          aiGoalsCustomExpert
        );

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!goals['harvest-accumulated-spice-flat'].goalIsReachable(player, gameState, goals, virtualResources)) {
        const goalDesire = getDesire(
          goals['harvest-accumulated-spice-flat'],
          player,
          gameState,
          virtualResources,
          aiGoalsCustomExpert
        );

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      return maxDesire;
    },
    goalIsReachable: () => false,
    reachedGoal: (player, gameState, goals, virtualResources) => getResourceAmount(player, 'water', virtualResources) > 3,
    viableFields: {
      'desert equipment': () => 0.5,
      'Sietch Tabr': (player, gameState) => 0.5,
    },
  },
  'collect-spice': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      let maxDesire = 0.0;
      const spice = getResourceAmount(player, 'spice', virtualResources);
      if (
        !goals['collect-solari'].reachedGoal(player, gameState, goals, virtualResources) &&
        !goals['collect-solari'].goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals['collect-solari'], player, gameState, virtualResources, aiGoalsCustomExpert);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (
        !goals['draw-cards'].reachedGoal(player, gameState, goals, virtualResources) &&
        !goals['draw-cards'].goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals['draw-cards'], player, gameState, virtualResources, aiGoalsCustomExpert);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!goals['troops'].goalIsReachable(player, gameState, goals, virtualResources)) {
        const goalDesire = getDesire(goals['troops'], player, gameState, virtualResources, aiGoalsCustomExpert);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (spice < 4) {
        const goalDesire = getDesire(goals.intrigues, player, gameState, virtualResources, aiGoalsCustomExpert);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      return maxDesire;
    },
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 1,
    reachedGoal: (player, gameState, goals, virtualResources) => getResourceAmount(player, 'spice', virtualResources) > 7,
    viableFields: {
      'Imperial Basin': (player, gameState) => 0.25 + 0.4 * getAccumulatedSpice(gameState, 'Imperial Basin'),
      'Hagga Basin': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(
          player,
          'water',
          1,
          0.5 + 0.2 * getAccumulatedSpice(gameState, 'Hagga Basin'),
          virtualResources
        ),
      'The Great Flat': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(
          player,
          'water',
          2,
          0.75 + 0.1 * getAccumulatedSpice(gameState, 'Hagga Basin'),
          virtualResources
        ),
    },
  },
  'collect-solari': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      let maxDesire = 0.0;
      if (
        !goals.swordmaster.reachedGoal(player, gameState, goals, virtualResources) &&
        !goals.swordmaster.goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals.swordmaster, player, gameState, virtualResources, aiGoalsCustomExpert);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (
        !goals['high-council'].reachedGoal(player, gameState, goals, virtualResources) &&
        !goals['high-council'].goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals['high-council'], player, gameState, virtualResources, aiGoalsCustomExpert);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (
        !gameState.isFinale &&
        !goals.dreadnought.reachedGoal(player, gameState, goals, virtualResources) &&
        !goals.dreadnought.goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals.dreadnought, player, gameState, virtualResources, aiGoalsCustomExpert);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!gameState.isFinale && !goals.tech.goalIsReachable(player, gameState, goals, virtualResources)) {
        const goalDesire = getDesire(goals.tech, player, gameState, virtualResources, aiGoalsCustomExpert);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }

      return maxDesire;
    },
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'spice', virtualResources) > 3,
    reachedGoal: (player, gameState, goals, virtualResources) => getResourceAmount(player, 'solari', virtualResources) > 11,
    viableFields: {
      'imperial favor': () => 0.5,
      'Space Port': () => 0.33,
      'Spice Trade': (player, gameState, goals, virtualResources) =>
        getResourceAmount(player, 'spice', virtualResources) > 0
          ? 1.0 - 0.05 * getResourceAmount(player, 'solari', virtualResources)
          : 0,
      expedition: (player, gameState) => (gameState.playerScore.guild === 1 ? 0.66 : 0.16),
      conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 0.5, virtualResources),
    },
  },
  'harvest-accumulated-spice-basin': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => 0.2 * getAccumulatedSpice(gameState, 'Hagga Basin'),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 0,
    reachedGoal: (player, gameState) => getAccumulatedSpice(gameState, 'Imperial Basin') === 0,
    viableFields: {
      'Hagga Basin': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.5, virtualResources),
    },
  },
  'harvest-accumulated-spice-flat': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => 0.2 * getAccumulatedSpice(gameState, 'The Great Flat'),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 1,
    reachedGoal: (player, gameState) => getAccumulatedSpice(gameState, 'The Great Flat') === 0,
    viableFields: {
      'The Great Flat': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 2, 0.5, virtualResources),
    },
  },
  'swordmaster-helper': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 6 && !player.hasSwordmaster
        ? 0.35 - 0.05 * (getResourceAmount(player, 'solari', virtualResources) - 7) - 0.025 * (gameState.currentTurn - 1)
        : 0,
    goalIsReachable: (player, gameState) => gameState.isFinale,
    reachedGoal: (player, gameState, goals, virtualResources) => player.hasSwordmaster === true,
    viableFields: {
      'imperial favor': () => 1,
      'Space Port': () => 0.75,
      'Spice Trade': (player, gameState, goals, virtualResources) =>
        getResourceAmount(player, 'spice', virtualResources) > 0 ? 0.25 : 0,
      expedition: (player, gameState) => (gameState.playerScore.guild === 1 ? 1 : 0),
      conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 1.0, virtualResources),
    },
  },
};
