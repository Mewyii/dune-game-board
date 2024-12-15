import { clamp } from 'lodash';
import {
  enemyIsCloseToPlayerFactionScore,
  getAccumulatedSpice,
  getCostAdjustedDesire,
  getMaxDesireOfUnreachableGoals,
  getParticipateInCombatDesireModifier,
  getPlayerGarrisonStrength,
  getResourceAmount,
  getResourceDesire,
  getWinCombatDesireModifier,
  noOneHasMoreInfluence,
  playerCanDrawCards,
  playerCanGetAllianceThisTurn,
  playerLikelyWinsCombat,
} from 'src/app/services/ai/shared';
import { AIGoals, FieldsForGoals } from 'src/app/services/ai/models';

export const aiGoalsCustomAdvanced: FieldsForGoals = {
  'high-council': {
    baseDesire: 0.65,
    desireModifier: (player, gameState, goals) =>
      0.0125 * getResourceAmount(player, 'solari') - 0.02 * (gameState.currentRound - 1),
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'solari') > 6,
    reachedGoal: (player, gameState) => player.hasCouncilSeat === true || gameState.isFinale,
    desiredFields: (fields) => ({
      'high council': () => 1,
    }),
    viableFields: () => ({}),
  },
  swordmaster: {
    baseDesire: 0.8,
    desireModifier: (player, gameState, goals) =>
      0.0125 * getResourceAmount(player, 'solari') - 0.033 * (gameState.currentRound - 1),
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'solari') > 9,
    reachedGoal: (player, gameState) => player.hasSwordmaster === true || gameState.isFinale,
    desiredFields: (fields) => ({
      swordmaster: () => 1,
    }),
    viableFields: () => ({}),
  },
  mentat: {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) =>
      0.025 * getResourceAmount(player, 'solari') +
      0.025 * (gameState.currentRound - 1) +
      0.0125 * gameState.playerCardsBought,
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'solari') > 2,
    reachedGoal: (player, gameState) => gameState.agentsOnFields.some((x) => x.fieldId === 'mentat'),
    desiredFields: (fields) => ({
      mentat: () => 1,
    }),
    viableFields: () => ({}),
  },
  tech: {
    baseDesire: 0.4,
    desireModifier: (player, gameState, goals) => 0.01 * getResourceAmount(player, 'spice') + 0.02 * player.techAgents,
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'solari') > 3,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      'Space Port': (player, gameState, goals) =>
        getResourceDesire(player, 0.2, [
          { resource: 'spice', amount: 0.025 },
          { resource: 'tech-agents', amount: 0.025 },
          { resource: 'solari', amount: 0.0125, negative: true },
        ]),
      expedition: (player, gameState, goals) =>
        getResourceDesire(player, 0.5, [
          { resource: 'spice', amount: 0.025 },
          { resource: 'tech-agents', amount: 0.025 },
        ]),
      'upgrade (tech)': (player, gameState, goals) => (getResourceAmount(player, 'solari') > 3 ? 1 : 0),
    }),
  },
  dreadnought: {
    baseDesire: 0.35,
    desireModifier: (player, gameState, goals) =>
      0.0075 * getResourceAmount(player, 'solari') -
      0.0125 * (gameState.currentRound - 1) -
      0.1 * gameState.playerDreadnoughtCount,
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'solari') > 3,
    reachedGoal: (player, gameState) => gameState.playerDreadnoughtCount > 1,
    desiredFields: (fields) => ({
      'upgrade (dreadnought)': (player, gameState, goals) => 1,
    }),
    viableFields: () => ({}),
  },
  'fremen-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals) =>
      0.033 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'fremen') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'fremen') ? 0.0125 * gameState.currentRound : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.fremen > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'fremen'),
    viableFields: (fields) => ({
      'fremen warriors': (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'water', amount: 1 }], 0.5),
      'desert equipment': () => 0.5,
    }),
  },
  'bg-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals) =>
      0.033 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'bene') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'bene') ? 0.0125 * gameState.currentRound : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.bene > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'bene'),
    viableFields: (fields) => ({
      'hidden knowledge': (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'spice', amount: 2 }], 0.5),
      'mind training': () => 0.5,
    }),
  },
  'guild-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals) =>
      0.033 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'guild') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'guild') ? 0.0125 * gameState.currentRound : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.guild > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'guild'),
    viableFields: (fields) => ({
      heighliner: (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 0.5),
      expedition: () => 0.5,
    }),
  },
  'emperor-alliance': {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals) =>
      0.033 * gameState.playerScore.fremen +
      (playerCanGetAllianceThisTurn(player, gameState, 'emperor') ? 0.2 : 0) +
      (noOneHasMoreInfluence(player, gameState, 'emperor') ? 0.0125 * gameState.currentRound : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.emperor > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'emperor'),
    viableFields: (fields) => ({
      conspiracy: (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 0.5),
      'imperial favor': () => 0.5,
    }),
  },
  'enter-combat': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
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
      'Sietch Tabr': (player, gameState) => 0.6,
      'fremen warriors': (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'water', amount: 1 }], 0.7),
      'imperial favor': (player, gameState) => (gameState.playerScore.emperor === 1 ? 0.5 : 0),
      conspiracy: (player, gameState, goals) =>
        getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], gameState.playerScore.emperor === 1 ? 0.7 : 0),
      'Imperial Basin': () => 0.5,
      'Hagga Basin': (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'water', amount: 1 }], 0.5),
      'The Great Flat': (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'water', amount: 2 }], 0.5),
      'Research Station (draw)': (player, gameState, goals) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 2 }], 0.5),
      'Research Station (trim)': (player, gameState, goals) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 2 }], 0.5),
      'upgrade (tech)': (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'solari', amount: 4 }], 0.5),
      'upgrade (dreadnought)': (player, gameState, goals) =>
        getCostAdjustedDesire(player, [{ type: 'solari', amount: 4 }], 0.7),
      heighliner: (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 0.9),
    }),
  },
  troops: {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => 0.2 * (4 - gameState.playerCombatUnits.troopsInGarrison),
    goalIsReachable: (player, gameState, goals) =>
      getResourceAmount(player, 'water') > 0 || getResourceAmount(player, 'spice') > 3,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      Arrakeen: () => 0.3,
      Carthag: () => 0.3,
      'Sietch Tabr': (player, gameState) => 0.3,
      'fremen warriors': (player, gameState, goals) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 1 }], gameState.playerScore.fremen === 1 ? 0.9 : 0.6),
      'desert equipment': (player, gameState) => (gameState.playerScore.fremen === 1 ? 0.3 : 0.0),
      heighliner: (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 1.0),
      conspiracy: (player, gameState, goals) =>
        getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], gameState.playerScore.emperor === 1 ? 0.8 : 0.6),
    }),
  },
  intrigues: {
    baseDesire: 0.25,
    desireModifier: (player, gameState, goals) => -0.05 * gameState.playerIntrigueCount,
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      relations: () => 0.5,
      Carthag: () => 0.5,
      conspiracy: (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 1.0),
      'mind training': (player, gameState) => (gameState.playerScore.bene === 1 ? 0.5 : 0.0),
      'hidden knowledge': (player, gameState, goals) =>
        getCostAdjustedDesire(player, [{ type: 'spice', amount: 2 }], gameState.playerScore.bene === 1 ? 0.5 : 0.0),
    }),
  },
  'intrigue-steal': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => gameState.playerIntrigueStealAmount * 0.25,
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'spice') > 1,
    reachedGoal: () => false,
    viableFields: (fields) => ({
      'imperial favor': () => 1.0,
    }),
  },
  'fold-space': {
    baseDesire: 0.3,
    desireModifier: (player, gameState, goals) =>
      -0.0125 * gameState.playerCardsBought - 0.0125 * (gameState.playerCardsTrashed + player.focusTokens),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.isFinale,
    viableFields: (fields) => ({
      'Space Port': () => 0.5,
    }),
  },
  'get-board-persuasion': {
    baseDesire: 0.35,
    desireModifier: (player, gameState, goals) =>
      -0.025 * gameState.playerCardsBought - 0.0125 * (gameState.playerCardsTrashed + player.focusTokens),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.isFinale,
    viableFields: (fields) => ({
      relations: () => 1.0,
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

      // console.log('deckbuilding: ' + deckBuildingDesire);
      // console.log('spice must flows: ' + getSpiceMustFlowsDesire);

      const modifier = deckBuildingDesire > getSpiceMustFlowsDesire ? deckBuildingDesire : getSpiceMustFlowsDesire;
      const name = deckBuildingDesire > getSpiceMustFlowsDesire ? 'persuasion: build deck' : 'persuasion: spice must flows';

      return {
        name,
        modifier,
      };
    },
    goalIsReachable: (player, gameState, goals) =>
      getResourceAmount(player, 'water') > 1 || getResourceAmount(player, 'spice') > 1,
    reachedGoal: (player, gameState, goals) => !playerCanDrawCards(gameState, 1),
    viableFields: (fields) => ({
      mentat: (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'solari', amount: 3 }], 0.3),
      Arrakeen: () => 0.3,
      'Research Station (draw)': (player, gameState, goals) =>
        // if we cant buy 3 cards, we always trim
        playerCanDrawCards(gameState, 3)
          ? getCostAdjustedDesire(
              player,
              [{ type: 'water', amount: 2 }],
              clamp(0.6 + 0.075 * gameState.playerCardsBought, 0, 0.9)
            )
          : 0,
      'Research Station (trim)': (player, gameState, goals) =>
        getCostAdjustedDesire(
          player,
          [{ type: 'water', amount: 2 }],
          clamp(0.5 + 0.075 * gameState.playerCardsBought, 0, 0.7)
        ),
      'mind training': (player, gameState) => 0.3,
      'hidden knowledge': (player, gameState, goals) =>
        getCostAdjustedDesire(
          player,
          [{ type: 'spice', amount: 2 }],
          clamp(0.6 + 0.075 * gameState.playerCardsBought, 0, 0.5)
        ),
      heighliner: (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 0.3),
    }),
  },
  'trim-cards': {
    baseDesire: 0.4,
    desireModifier: (player, gameState, goals) =>
      clamp(
        -(0.0066 * (gameState.currentRound - 1) * gameState.currentRound) +
          0.1 * gameState.playerCardsBought -
          0.15 * (gameState.playerCardsTrashed + player.focusTokens),
        -0.4,
        0.4
      ),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.playerDeckSizeTotal < 7 || gameState.isFinale,
    viableFields: (fields) => ({
      'mind training': (player, gameState) => 0.5,
      'Research Station (trim)': (player, gameState, goals) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 2 }], 0.5),
      'fremen warriors': (player, gameState, goals) =>
        getCostAdjustedDesire(player, [{ type: 'water', amount: 1 }], gameState.playerScore.fremen === 1 ? 0.5 : 0.0),
      'desert equipment': (player, gameState) => (gameState.playerScore.fremen === 1 ? 0.5 : 0.0),
    }),
  },
  'collect-water': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      let maxDesire = 0.0;

      const waterDependentGoalTypes: { type: AIGoals; modifier: number }[] = [
        { type: 'collect-spice', modifier: 0.9 },
        { type: 'draw-cards', modifier: 0.9 },
        { type: 'troops', modifier: 0.9 },
        { type: 'harvest-accumulated-spice-basin', modifier: 0.9 },
        { type: 'harvest-accumulated-spice-flat', modifier: 0.9 },
      ];

      return getMaxDesireOfUnreachableGoals(player, gameState, goals, waterDependentGoalTypes, maxDesire);
    },
    goalIsReachable: () => false,
    reachedGoal: (player, gameState, goals) => getResourceAmount(player, 'water') > 3,
    viableFields: (fields) => ({
      'desert equipment': () => 0.5,
      'Sietch Tabr': (player, gameState) => 0.5,
    }),
  },
  'collect-spice': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      let maxDesire = 0.0;

      const spiceDependentGoalTypes: { type: AIGoals; modifier: number }[] = [
        { type: 'collect-solari', modifier: 0.9 },
        { type: 'draw-cards', modifier: 0.9 },
        { type: 'troops', modifier: 0.9 },
        { type: 'intrigues', modifier: 0.9 },
      ];

      return getMaxDesireOfUnreachableGoals(player, gameState, goals, spiceDependentGoalTypes, maxDesire);
    },
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'water') > 1,
    reachedGoal: (player, gameState, goals) => getResourceAmount(player, 'spice') > 7,
    viableFields: (fields) => ({
      'Imperial Basin': (player, gameState) => 0.25 + 0.4 * getAccumulatedSpice(gameState, 'Imperial Basin'),
      'Hagga Basin': (player, gameState, goals) =>
        getCostAdjustedDesire(
          player,
          [{ type: 'water', amount: 1 }],
          0.5 + 0.2 * getAccumulatedSpice(gameState, 'Hagga Basin')
        ),
      'The Great Flat': (player, gameState, goals) =>
        getCostAdjustedDesire(
          player,
          [{ type: 'water', amount: 2 }],
          0.75 + 0.1 * getAccumulatedSpice(gameState, 'Hagga Basin')
        ),
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
        { type: 'tech', modifier: 0.9 },
      ];

      return getMaxDesireOfUnreachableGoals(player, gameState, goals, solariDependentGoalTypes, maxDesire);
    },
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'spice') > 3,
    reachedGoal: (player, gameState, goals) => getResourceAmount(player, 'solari') > 11,
    viableFields: (fields) => ({
      'imperial favor': () => 0.5,
      'Space Port': () => 0.33,
      'Spice Trade': (player, gameState, goals) =>
        getResourceAmount(player, 'spice') > 0 ? 1.0 - 0.05 * getResourceAmount(player, 'solari') : 0,
      expedition: (player, gameState) => (gameState.playerScore.guild === 1 ? 0.66 : 0.16),
      conspiracy: (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 0.5),
    }),
  },
  'harvest-accumulated-spice-basin': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => 0.2 * getAccumulatedSpice(gameState, 'Hagga Basin'),
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'water') > 0,
    reachedGoal: (player, gameState) => getAccumulatedSpice(gameState, 'Imperial Basin') === 0,
    viableFields: (fields) => ({
      'Hagga Basin': (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'water', amount: 1 }], 0.5),
    }),
  },
  'harvest-accumulated-spice-flat': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => 0.2 * getAccumulatedSpice(gameState, 'The Great Flat'),
    goalIsReachable: (player, gameState, goals) => getResourceAmount(player, 'water') > 1,
    reachedGoal: (player, gameState) => getAccumulatedSpice(gameState, 'The Great Flat') === 0,
    viableFields: (fields) => ({
      'The Great Flat': (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'water', amount: 2 }], 0.5),
    }),
  },
  'swordmaster-helper': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) =>
      getResourceAmount(player, 'solari') > 6 && !player.hasSwordmaster
        ? 0.35 - 0.05 * (getResourceAmount(player, 'solari') - 7) - 0.025 * (gameState.currentRound - 1)
        : 0,
    goalIsReachable: (player, gameState) => gameState.isFinale,
    reachedGoal: (player, gameState, goals) => player.hasSwordmaster === true,
    viableFields: (fields) => ({
      'imperial favor': () => 1,
      'Space Port': () => 0.75,
      'Spice Trade': (player, gameState, goals) => (getResourceAmount(player, 'spice') > 0 ? 0.25 : 0),
      expedition: (player, gameState) => (gameState.playerScore.guild === 1 ? 1 : 0),
      conspiracy: (player, gameState, goals) => getCostAdjustedDesire(player, [{ type: 'spice', amount: 4 }], 1.0),
    }),
  },
};
