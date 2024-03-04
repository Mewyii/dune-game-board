import { clamp } from 'lodash';
import { AIGoal, FieldsForGoals, GameState } from '../models';
import { Player } from '../../player-manager.service';
import { Resource, ResourceType } from 'src/app/models';
import { PlayerCombatUnits } from '../../combat-manager.service';
import { PlayerScore } from '../../player-score-manager.service';

export const aiGoals: FieldsForGoals = {
  'high-council': {
    baseDesire: 0.55,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.0125 * getResourceAmount(player, 'currency', virtualResources) - 0.025 * (gameState.currentTurn - 1),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'currency', virtualResources) > 4,
    reachedGoal: (player, gameState) => player.hasCouncilSeat === true || gameState.isFinale,
    desiredFields: {
      'high council': () => 1,
    },
    viableFields: {},
  },
  swordmaster: {
    baseDesire: 0.8,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.0125 * getResourceAmount(player, 'currency', virtualResources) - 0.033 * (gameState.currentTurn - 1),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'currency', virtualResources) > 9,
    reachedGoal: (player, gameState) => player.hasSwordmaster === true || gameState.isFinale,
    desiredFields: {
      swordmaster: () => 1,
    },
    viableFields: {},
  },
  mentat: {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.025 * getResourceAmount(player, 'currency', virtualResources) +
      0.025 * (gameState.currentTurn - 1) +
      0.0125 * player.cardsBought,
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'currency', virtualResources) > 2,
    reachedGoal: (player, gameState) => gameState.accumulatedSpiceOnFields.some((x) => x.fieldId === 'mentat'),
    desiredFields: {
      mentat: () => 1,
    },
    viableFields: {},
  },
  tech: {
    baseDesire: 0.4,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.0125 * getResourceAmount(player, 'spice', virtualResources) + 0.025 * player.techAgents,
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'currency', virtualResources) > 3,
    reachedGoal: () => false,
    desiredFields: {},
    viableFields: {
      'trade rights': (player, gameState, goals, virtualResources) =>
        getResourceDesire(player, virtualResources, 0.2, [
          { resource: 'spice', amount: 0.025 },
          { resource: 'tech-agents', amount: 0.05 },
          { resource: 'currency', amount: 0.0125, negative: true },
        ]),
      expedition: (player, gameState, goals, virtualResources) =>
        getResourceDesire(player, virtualResources, 0.5, [
          { resource: 'spice', amount: 0.025 },
          { resource: 'tech-agents', amount: 0.05 },
        ]),
      'upgrade (tech)': (player, gameState, goals, virtualResources) =>
        getResourceAmount(player, 'currency', virtualResources) > 3 ? 1 : 0,
    },
  },
  warship: {
    baseDesire: 0.4,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.01 * getResourceAmount(player, 'currency', virtualResources) -
      0.01 * (gameState.currentTurn - 1) -
      0.1 * getPlayerWarshipCount(gameState),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'currency', virtualResources) > 3,
    reachedGoal: (player, gameState) => getPlayerWarshipCount(gameState) > 1,
    desiredFields: {
      'upgrade (warship)': (player, gameState, goals, virtualResources) => 1,
    },
    viableFields: {},
  },
  'fremen-alliance': {
    baseDesire: 0.2,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.05 * gameState.playerScore.fremen +
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
    baseDesire: 0.2,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.05 * gameState.playerScore.fremen +
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
    baseDesire: 0.2,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.05 * gameState.playerScore.fremen +
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
    baseDesire: 0.2,
    desireModifier: (player, gameState, goals, virtualResources) =>
      0.05 * gameState.playerScore.fremen +
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
      arrakeen: () => 0.6,
      carthag: () => 0.6,
      'sietch tabr': (player, gameState) => 0.6,
      'fremen warriors': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.7, virtualResources),
      'imperial favor': (player, gameState) => (gameState.playerScore.emperor === 1 ? 0.5 : 0),
      conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, gameState.playerScore.emperor === 1 ? 0.7 : 0, virtualResources),
      'imperial basin': () => 0.5,
      'hagga basin': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.5, virtualResources),
      'the great flat': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 2, 0.5, virtualResources),
      'research station (draw)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 2, 0.5, virtualResources),
      'research station (trim)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 2, 0.5, virtualResources),
      'upgrade (tech)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'currency', 4, 0.5, virtualResources),
      'upgrade (warship)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'currency', 4, 0.6, virtualResources),
      heighliner: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 0.8, virtualResources),
    },
  },
  'get-troops': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => 0.2 * (4 - gameState.playerCombatUnits.troopsInGarrison),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 0 || getResourceAmount(player, 'spice', virtualResources) > 3,
    reachedGoal: () => false,
    viableFields: {
      arrakeen: () => 0.3,
      carthag: () => 0.3,
      'sietch tabr': (player, gameState) => 0.3,
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
      gameState.enemyPlayers.some((x) => x.intrigueCount > 3) ? 0.1 : 0,
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'spice', virtualResources) > 1,
    reachedGoal: () => false,
    viableFields: {
      'imperial favor': () => 1.0,
    },
  },
  'fold-space': {
    baseDesire: 0.25,
    desireModifier: () => 0,
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.isFinale,
    viableFields: {
      carthag: () => 0.5,
    },
  },
  'get-persuasion': {
    baseDesire: 0.3,
    desireModifier: (player, gameState, goals, virtualResources) =>
      -0.025 * player.cardsBought - 0.0125 * (player.cardsTrimmed + player.focusTokens),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.isFinale,
    viableFields: {
      relations: () => 1.0,
      'trade rights': () => 0.5,
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
        getCostAdjustedDesire(player, 'currency', 3, 0.3, virtualResources),
      arrakeen: () => 0.3,
      'research station (draw)': (player, gameState, goals, virtualResources) =>
        // if we cant buy 3 cards, we always trim
        playerCanDrawCards(player, 3)
          ? getCostAdjustedDesire(player, 'water', 2, clamp(0.6 + 0.075 * player.cardsBought, 0, 0.9), virtualResources)
          : 0,
      'research station (trim)': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 2, clamp(0.5 + 0.075 * player.cardsBought, 0, 0.7), virtualResources),
      'mind training': (player, gameState) => 0.3,
      'hidden knowledge': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 2, clamp(0.6 + 0.075 * player.cardsBought, 0, 0.5), virtualResources),
      heighliner: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 0.3, virtualResources),
    },
  },
  'trim-deck': {
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
      'research station (trim)': (player, gameState, goals, virtualResources) =>
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
        const goalDesire = getDesire(goals['collect-spice'], player, gameState, virtualResources);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (
        !goals['draw-cards'].reachedGoal(player, gameState, goals, virtualResources) &&
        !goals['draw-cards'].goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals['draw-cards'], player, gameState, virtualResources);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!goals['get-troops'].goalIsReachable(player, gameState, goals, virtualResources)) {
        const goalDesire = getDesire(goals['get-troops'], player, gameState, virtualResources);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!goals['harvest-accumulated-spice-basin'].goalIsReachable(player, gameState, goals, virtualResources)) {
        const goalDesire = getDesire(goals['harvest-accumulated-spice-basin'], player, gameState, virtualResources);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!goals['harvest-accumulated-spice-flat'].goalIsReachable(player, gameState, goals, virtualResources)) {
        const goalDesire = getDesire(goals['harvest-accumulated-spice-flat'], player, gameState, virtualResources);

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
      'sietch tabr': (player, gameState) => 0.5,
    },
  },
  'collect-spice': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      let maxDesire = 0.0;
      const spice = getResourceAmount(player, 'spice', virtualResources);
      if (
        !goals['collect-currency'].reachedGoal(player, gameState, goals, virtualResources) &&
        !goals['collect-currency'].goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals['collect-currency'], player, gameState, virtualResources);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (
        !goals['draw-cards'].reachedGoal(player, gameState, goals, virtualResources) &&
        !goals['draw-cards'].goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals['draw-cards'], player, gameState, virtualResources);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!goals['get-troops'].goalIsReachable(player, gameState, goals, virtualResources)) {
        const goalDesire = getDesire(goals['get-troops'], player, gameState, virtualResources);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (spice < 4) {
        const goalDesire = getDesire(goals.intrigues, player, gameState, virtualResources);

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
      'imperial basin': (player, gameState) => 0.25 + 0.4 * getAccumulatedSpice(gameState, 'imperial basin'),
      'hagga basin': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(
          player,
          'water',
          1,
          0.5 + 0.2 * getAccumulatedSpice(gameState, 'hagga basin'),
          virtualResources
        ),
      'the great flat': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(
          player,
          'water',
          2,
          0.75 + 0.1 * getAccumulatedSpice(gameState, 'hagga basin'),
          virtualResources
        ),
    },
  },
  'collect-currency': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => {
      let maxDesire = 0.0;
      if (
        !goals.swordmaster.reachedGoal(player, gameState, goals, virtualResources) &&
        !goals.swordmaster.goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals.swordmaster, player, gameState, virtualResources);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (
        !goals['high-council'].reachedGoal(player, gameState, goals, virtualResources) &&
        !goals['high-council'].goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals['high-council'], player, gameState, virtualResources);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (
        !gameState.isFinale &&
        !goals.warship.reachedGoal(player, gameState, goals, virtualResources) &&
        !goals.warship.goalIsReachable(player, gameState, goals, virtualResources)
      ) {
        const goalDesire = getDesire(goals.warship, player, gameState, virtualResources);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!gameState.isFinale && !goals.tech.goalIsReachable(player, gameState, goals, virtualResources)) {
        const goalDesire = getDesire(goals.tech, player, gameState, virtualResources);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }

      return maxDesire;
    },
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'spice', virtualResources) > 3,
    reachedGoal: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'currency', virtualResources) > 11,
    viableFields: {
      'imperial favor': () => 0.5,
      'trade rights': () => 0.33,
      'spice sale': (player, gameState, goals, virtualResources) =>
        getResourceAmount(player, 'spice', virtualResources) > 0
          ? 1.0 - 0.05 * getResourceAmount(player, 'currency', virtualResources)
          : 0,
      expedition: (player, gameState) => (gameState.playerScore.guild === 1 ? 0.66 : 0.16),
      conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 0.5, virtualResources),
    },
  },
  'harvest-accumulated-spice-basin': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => 0.2 * getAccumulatedSpice(gameState, 'hagga basin'),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 0,
    reachedGoal: (player, gameState) => getAccumulatedSpice(gameState, 'imperial basin') === 0,
    viableFields: {
      'hagga basin': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 1, 0.5, virtualResources),
    },
  },
  'harvest-accumulated-spice-flat': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) => 0.2 * getAccumulatedSpice(gameState, 'the great flat'),
    goalIsReachable: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'water', virtualResources) > 1,
    reachedGoal: (player, gameState) => getAccumulatedSpice(gameState, 'the great flat') === 0,
    viableFields: {
      'the great flat': (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'water', 2, 0.5, virtualResources),
    },
  },
  'swordmaster-helper': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals, virtualResources) =>
      getResourceAmount(player, 'currency', virtualResources) > 6 && !player.hasSwordmaster
        ? 0.35 - 0.05 * (getResourceAmount(player, 'currency', virtualResources) - 7) - 0.025 * (gameState.currentTurn - 1)
        : 0,
    goalIsReachable: (player, gameState) => gameState.isFinale,
    reachedGoal: (player, gameState, goals, virtualResources) => player.hasSwordmaster === true,
    viableFields: {
      'imperial favor': () => 1,
      'trade rights': () => 0.75,
      'spice sale': (player, gameState, goals, virtualResources) =>
        getResourceAmount(player, 'spice', virtualResources) > 0 ? 0.25 : 0,
      expedition: (player, gameState) => (gameState.playerScore.guild === 1 ? 1 : 0),
      conspiracy: (player, gameState, goals, virtualResources) =>
        getCostAdjustedDesire(player, 'spice', 4, 1.0, virtualResources),
    },
  },
};

function getAccumulatedSpice(gameState: GameState, fieldId: string) {
  const spice = gameState.accumulatedSpiceOnFields.find((x) => x.fieldId === fieldId);
  if (spice) {
    return spice.amount;
  }
  return 0;
}

function getResourceDesire(
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

function getResourceAmount(
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

function getPlayerWarshipCount(gameState: GameState) {
  return (
    gameState.playerCombatUnits.shipsInGarrison +
    gameState.playerCombatUnits.shipsInCombat +
    gameState.playerCombatUnits.shipsInTimeout
  );
}

function playerHasUnitsInGarrison(gameState: GameState) {
  return gameState.playerCombatUnits.troopsInGarrison + gameState.playerCombatUnits.troopsInGarrison > 0;
}

function playerHasUnitsInCombat(gameState: GameState) {
  return gameState.playerCombatUnits.troopsInCombat + gameState.playerCombatUnits.shipsInCombat > 0;
}

function getPlayerCombatPower(player: PlayerCombatUnits) {
  return player.troopsInCombat * 2 + player.shipsInCombat * 3 + player.additionalCombatPower;
}

function getPlayerGarrisonStrength(player: PlayerCombatUnits) {
  return player.troopsInGarrison * 2 + player.shipsInGarrison * 3;
}

function enemyCanContestPlayer(
  player: PlayerCombatUnits,
  enemy: PlayerCombatUnits,
  gameState: GameState,
  countEnemiesNotInCombat?: boolean
) {
  const combatPowerTreshold = 3 + Math.random() * 2 + (gameState.currentTurn - 1) * 0.5;

  const playerCombatPower = getPlayerCombatPower(player);

  const enemyCombatPower = getPlayerCombatPower(enemy);
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

function playerCanContestEnemy(
  player: PlayerCombatUnits,
  enemy: PlayerCombatUnits,
  gameState: GameState,
  countEnemiesNotInCombat?: boolean
) {
  return enemyCanContestPlayer(enemy, player, gameState, countEnemiesNotInCombat);
}

function playerLikelyWinsCombat(gameState: GameState) {
  let result = true;

  for (const enemy of gameState.enemyCombatUnits) {
    if (enemyCanContestPlayer(gameState.playerCombatUnits, enemy, gameState)) {
      result = false;
    }
  }
  return result;
}

function getWinCombatDesireModifier(gameState: GameState) {
  let desire = 0.4 + 0.025 * (gameState.currentTurn - 1) + 0.1 * gameState.playerAgentCount;

  const playerStrength =
    getPlayerCombatPower(gameState.playerCombatUnits) + getPlayerGarrisonStrength(gameState.playerCombatUnits);

  desire = desire + 0.075 * playerStrength;

  let strengthOfStrongestEnemy = 0;
  let garrisonStrengthOfEnemiesNotInCombat = 0;
  for (const enemy of gameState.enemyCombatUnits) {
    const enemyCombatPower = getPlayerCombatPower(enemy);

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

function getParticipateInCombatDesireModifier(gameState: GameState) {
  let desire = 0.1 + 0.0125 * (gameState.currentTurn - 1);

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

export function getDesire(goal: AIGoal, player: Player, gameState: GameState, virtualResources: Resource[]) {
  const goalDesire = goal.desireModifier(player, gameState, aiGoals, virtualResources);
  if (typeof goalDesire === 'number') {
    return clamp(goal.baseDesire + goalDesire, 0, goal.maxDesire ?? 1);
  } else {
    return clamp(goal.baseDesire + goalDesire.modifier, 0, goal.maxDesire ?? 1);
  }
}

function getInactiveEnemyCount(gamestate: GameState) {
  return gamestate.enemyAgentCount.filter((x) => x.agentAmount < 1).length;
}

function enemyIsCloseToPlayerFactionScore(gameState: GameState, faction: keyof PlayerScore) {
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

function playerCanGetAllianceThisTurn(player: Player, gameState: GameState, faction: keyof PlayerScore) {
  const playerScore = gameState.playerScore[faction];

  if (playerScore === 3) {
    return !gameState.enemyScore.some((x) => x[faction] > 3);
  }
  return false;
}

function noOneHasMoreInfluence(player: Player, gameState: GameState, faction: keyof PlayerScore) {
  const playerScore = gameState.playerScore[faction];

  return !gameState.enemyScore.some((x) => x[faction] > playerScore);
}

function getCostAdjustedDesire(
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

  const desireAdjustment = 1.0 - 0.1 * costs + 0.1 * (playerResourceAmount - costs);

  return clamp(desire * desireAdjustment, 0, 1);
}

function playerCanDrawCards(player: Player, amount: number) {
  return player.cardsInDeck >= player.cardsDrawnThisRound + amount;
}
