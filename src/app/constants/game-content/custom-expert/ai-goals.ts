import { clamp } from 'lodash';
import {
  enemyIsCloseToPlayerFactionScore,
  getAccumulatedSpice,
  getCostAdjustedDesire,
  getDesire,
  getMaxDesireOfUnreachableGoals,
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
import { AIGoals, FieldsForGoals } from 'src/app/services/ai/models';

export const aiGoalsCustomExpert: FieldsForGoals = {
  'high-council': {
    baseDesire: 0.65,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.0125 * getResourceAmount(player, 'solari', virtualResources) - 0.02 * (gameState.currentTurn - 1),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 6,
    reachedGoal: (player, gameState) => player.hasCouncilSeat === true || gameState.isFinale,
    desiredFields: {
      'High Council Seat': () => 1,
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
      Swordmaster: () => 1,
    },
    viableFields: {},
  },
  mentat: {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.025 * getResourceAmount(player, 'spice', virtualResources) +
      0.025 * (gameState.currentTurn - 1) +
      0.0125 * player.cardsBought,
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'spice', virtualResources) > 1,
    reachedGoal: (player, gameState) => gameState.agentsOnFields.some((x) => x.fieldId === 'Truthsay'),
    desiredFields: {
      Truthsay: () => 1,
    },
    viableFields: {},
  },
  tech: {
    baseDesire: 0.4,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.01 * getResourceAmount(player, 'spice', virtualResources) + 0.02 * player.techAgents,
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 4,
    reachedGoal: () => false,
    desiredFields: {},
    viableFields: {
      Relations: (player, gameState, goals, virtualResources) =>
        getResourceDesire(player, virtualResources, 0.2, [
          { resource: 'spice', amount: 0.025 },
          { resource: 'tech-agents', amount: 0.025 },
          { resource: 'solari', amount: 0.0125, negative: true },
        ]),
      "Tuek's Sietch": (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(
          player,
          'water',
          1,
          getResourceDesire(player, virtualResources, 0.5, [
            { resource: 'spice', amount: 0.025 },
            { resource: 'tech-agents', amount: 0.025 },
          ]),
          virtualResources
        ),
      'Upgrade (tech)': (player, gameState, goals, virtualResources) =>
        getResourceAmount(player, 'solari', virtualResources) > 4 ? 1 : 0,
    },
  },
  dreadnought: {
    baseDesire: 0.35,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.0075 * getResourceAmount(player, 'solari', virtualResources) -
      0.0125 * (gameState.currentTurn - 1) -
      0.1 * getPlayerdreadnoughtCount(gameState),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > 4,
    reachedGoal: (player, gameState) => getPlayerdreadnoughtCount(gameState) > 1,
    desiredFields: {
      'Upgrade (dreadnought)': (player, gameState, goals, virtualResources) => 1,
    },
    viableFields: {},
  },
  'fremen-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.05 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'fremen') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'fremen') ? 0.0125 * gameState.currentTurn : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.fremen > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'fremen'),
    viableFields: {
      'Desert Equipment': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'solari', 2, 0.5, virtualResources),
      'Desert Knowledge (card-draw)': () => 0.5,
      'Desert Knowledge (card-destroy)': () => 0.5,
      'Favoritism (Fremen)': () => 0.5,
    },
  },
  'bg-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.05 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'bene') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'bene') ? 0.0125 * gameState.currentTurn : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.bene > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'bene'),
    viableFields: {
      Truthsay: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 2, 0.5, virtualResources),
      'Mind Training': () => 0.5,
      'Favoritism (Bene Gesserit)': () => 0.5,
    },
  },
  'guild-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.05 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'guild') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'guild') ? 0.0125 * gameState.currentTurn : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.guild > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'guild'),
    viableFields: {
      Heighliner: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 0.5, virtualResources),
      'Guild Contract': () => 0.5,
      'Favoritism (Guild)': () => 0.5,
    },
  },
  'emperor-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.05 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'emperor') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'emperor') ? 0.0125 * gameState.currentTurn : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.emperor > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'emperor'),
    viableFields: {
      Conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 0.5, virtualResources),
      'Imperial Favor': () => 0.5,
      'Favoritism (Emperor)': () => 0.5,
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
      'Sietch Tabr (card-draw)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.7, virtualResources),
      'Sietch Tabr (card-destroy)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.7, virtualResources),
      'Imperial Test Station': (player, gameState) => 0.5,
      'Imperial Favor': (player, gameState) => (gameState.playerScore.emperor === 1 ? 0.5 : 0),
      Conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, gameState.playerScore.emperor === 1 ? 0.7 : 0, virtualResources),
      'Desert Knowledge (card-draw)': (player, gameState) => (gameState.playerScore.fremen === 1 ? 0.6 : 0),
      'Desert Knowledge (card-destroy)': (player, gameState) => (gameState.playerScore.fremen === 1 ? 0.6 : 0),
      'Imperial Basin': () => 0.5,
      'Hagga Basin': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.5, virtualResources),
      'The Great Flat': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 2, 0.5, virtualResources),
      'Upgrade (tech)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'solari', 6, 0.5, virtualResources),
      'Upgrade (dreadnought)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'solari', 6, 0.7, virtualResources),
    },
  },
  troops: {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.125 * (5 - gameState.playerCombatUnits.troopsInGarrison),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 1 ||
      getResourceAmount(player, 'solari', virtualResources) > 1 ||
      getResourceAmount(player, 'spice', virtualResources) > 3,
    reachedGoal: () => false,
    viableFields: {
      Arrakeen: () => 0.3,
      Carthag: () => 0.3,
      'Sietch Tabr (card-draw)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.6, virtualResources),
      'Sietch Tabr (card-destroy)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.6, virtualResources),
      Relations: (player, gameState) => 0.3,
      'Propaganda (troop)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'solari', 2, 0.6, virtualResources),
      'Desert Equipment': (player, gameState, goals, virtualResources) =>
        gameState.playerScore.fremen === 1 ? getCostAdjustedDesire(player, 'water', 1, 0.3, virtualResources) : 0.0,
      'Desert Knowledge (card-draw)': (player, gameState) => (gameState.playerScore.fremen === 1 ? 0.3 : 0.0),
      'Desert Knowledge (card-destroy)': (player, gameState) => (gameState.playerScore.fremen === 1 ? 0.3 : 0.0),
      Heighliner: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 1.0, virtualResources),
      Conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, gameState.playerScore.emperor === 1 ? 0.8 : 0.6, virtualResources),
    },
  },
  intrigues: {
    baseDesire: 0.3,
    desireModifier: (player, gameState, goals, virtualResources) => -0.033 * player.intrigueCount,
    goalIsReachable: () => false,
    reachedGoal: (player) => player.intrigueCount > 3,
    viableFields: {
      Carthag: () => 0.5,
      'Imperial Favor': () => 0.5,
      Conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 1.0, virtualResources),
      'Mind Training': (player, gameState) => (gameState.playerScore.bene === 1 ? 0.5 : 0.0),
      Truthsay: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 2, gameState.playerScore.bene === 1 ? 0.5 : 0.0, virtualResources),
    },
  },
  'intrigue-steal': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) =>
      gameState.enemyPlayers.filter((x) => x.intrigueCount > 3).length * 0.2,
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: {
      'Mind Training': (player, gameState) => (gameState.playerScore.bene === 1 ? 1.0 : 0.0),
      Truthsay: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 2, gameState.playerScore.bene === 1 ? 1.0 : 0.0, virtualResources),
    },
  },
  'fold-space': {
    baseDesire: 0.3,
    desireModifier: (player, gameState, goals, virtualResources) =>
      -0.0125 * player.cardsBought - 0.0125 * (player.cardsTrimmed + player.focusTokens),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.isFinale,
    viableFields: {
      Heighliner: (player, gameState, goals, virtualResources) =>
        gameState.playerScore.guild === 1 ? getCostAdjustedDesire(player, 'spice', 4, 0.5, virtualResources) : 0,
      'Guild Contract': (player, gameState) => (gameState.playerScore.guild === 1 ? 0.5 : 0),
      "Tuek's Sietch": (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.5, virtualResources),
    },
  },
  'get-board-persuasion': {
    baseDesire: 0.6,
    desireModifier: (player, gameState, goals, virtualResources) =>
      -0.025 * player.cardsBought - 0.0125 * (player.cardsTrimmed + player.focusTokens),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.isFinale,
    viableFields: {
      Relations: () => 0.5,
      'Propaganda (persuasion)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'solari', 2, 1.0, virtualResources),
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
      getResourceAmount(player, 'solari', virtualResources) > 1 || getResourceAmount(player, 'spice', virtualResources) > 1,
    reachedGoal: (player, gameState, goals, virtualResources) => !playerCanDrawCards(player, 1),
    viableFields: {
      'Propaganda (persuasion)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'solari', 2, 0.3, virtualResources),
      'Propaganda (troop)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'solari', 2, 0.3, virtualResources),
      'Imperial Test Station': () => 0.3,
      'Sietch Tabr (card-draw)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.3, virtualResources),
      'Mind Training': (player, gameState) => 0.3,
      Truthsay: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 2, clamp(0.6 + 0.075 * player.cardsBought, 0, 0.5), virtualResources),
      'Desert Knowledge (card-draw)': (player, gameState) => 0.3,
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
      'Mind Training': (player, gameState) => 0.5,
      'Sietch Tabr (card-destroy)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.5, virtualResources),
      'Desert Knowledge (card-destroy)': (player, gameState) => 0.5,
    },
  },
  'collect-water': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      let maxDesire = 0.0;

      const waterDependentGoalTypes: AIGoals[] = [
        'collect-spice',
        'troops',
        'harvest-accumulated-spice-basin',
        'harvest-accumulated-spice-flat',
      ];
      maxDesire = getMaxDesireOfUnreachableGoals(
        player,
        gameState,
        goals,
        virtualResources,
        waterDependentGoalTypes,
        maxDesire
      );

      return maxDesire;
    },
    goalIsReachable: () => false,
    reachedGoal: (player, gameState, goals, virtualResources) => getResourceAmount(player, 'water', virtualResources) > 1,
    viableFields: {
      'Desert Equipment': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'solari', 2, 1.0, virtualResources),
      Heighliner: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 1.0, virtualResources),
      'Imperial Test Station': (player, gameState) => 0.5,
    },
  },
  'collect-spice': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      let maxDesire = 0.0;
      const spice = getResourceAmount(player, 'spice', virtualResources);

      const spiceDependentGoalTypes: AIGoals[] = ['collect-solari', 'draw-cards', 'troops', 'intrigues'];
      maxDesire = getMaxDesireOfUnreachableGoals(
        player,
        gameState,
        goals,
        virtualResources,
        spiceDependentGoalTypes,
        maxDesire
      );

      if (spice < 4) {
        const goalDesire = getDesire(goals.intrigues, player, gameState, virtualResources, goals);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      return maxDesire;
    },
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 1,
    reachedGoal: (player, gameState, goals, virtualResources) => getResourceAmount(player, 'spice', virtualResources) > 3,
    viableFields: {
      "Tuek's Sietch": (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.25, virtualResources),
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

      const solariDependentGoalTypes: AIGoals[] = ['swordmaster', 'high-council', 'dreadnought', 'tech', 'troops'];
      maxDesire = getMaxDesireOfUnreachableGoals(
        player,
        gameState,
        goals,
        virtualResources,
        solariDependentGoalTypes,
        maxDesire
      );

      return maxDesire;
    },
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'spice', virtualResources) > 2,
    reachedGoal: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'solari', virtualResources) > (!player.hasSwordmaster ? 9 : 6),
    viableFields: {
      Arrakeen: () => 0.33,
      'Imperial Favor': () => 0.16,
      Conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 0.66, virtualResources),
      'Guild Contract': () => 0.5,
      'Spice Trade': (player, gameState, goals, virtualResources) =>
        getResourceAmount(player, 'spice', virtualResources) > 0
          ? 1.0 - 0.05 * getResourceAmount(player, 'solari', virtualResources)
          : 0,
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
      'Imperial Favor': () => 0.5,
      'Guild Contract': () => 1.0,
      Arrakeen: () => 0.75,
      'Spice Trade': (player, gameState, goals, virtualResources) =>
        getResourceAmount(player, 'spice', virtualResources) > 0 ? 0.25 : 0,
      Conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 1.0, virtualResources),
    },
  },
};
