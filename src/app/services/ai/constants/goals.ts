import { clamp } from 'lodash';
import { AIGoal, FieldsForGoals, GameState } from '../models';
import { Player } from '../../player-manager.service';
import { ResourceType } from 'src/app/models';
import { PlayerCombatUnits } from '../../combat-manager.service';
import { PlayerScore } from '../../player-score-manager.service';

export const aiGoals: FieldsForGoals = {
  'high-council': {
    baseDesire: 0.55,
    desireModifier: (player, gameState) =>
      0.0125 * getResourceAmount(player, 'currency') - 0.025 * (gameState.currentTurn - 1),
    goalIsReachable: (player) => getResourceAmount(player, 'currency') > 4,
    reachedGoal: (player, gameState) => player.hasCouncilSeat === true || gameState.isFinale,
    desiredFields: {
      'high council': () => 1,
    },
    viableFields: {},
  },
  swordmaster: {
    baseDesire: 0.8,
    desireModifier: (player, gameState) =>
      0.0125 * getResourceAmount(player, 'currency') - 0.05 * (gameState.currentTurn - 1),
    goalIsReachable: (player) => getResourceAmount(player, 'currency') > 9,
    reachedGoal: (player, gameState) => player.hasSwordmaster === true || gameState.isFinale,
    desiredFields: {
      swordmaster: () => 1,
    },
    viableFields: {},
  },
  mentat: {
    baseDesire: 0.0,
    desireModifier: (player, gameState) =>
      0.025 * getResourceAmount(player, 'currency') + 0.025 * (gameState.currentTurn - 1) + 0.0125 * player.cardsBought,
    goalIsReachable: (player) => getResourceAmount(player, 'currency') > 2,
    reachedGoal: (player, gameState) => gameState.accumulatedSpiceOnFields.some((x) => x.fieldId === 'mentat'),
    desiredFields: {
      mentat: () => 1,
    },
    viableFields: {},
  },
  tech: {
    baseDesire: 0.4,
    desireModifier: (player) => 0.0125 * getResourceAmount(player, 'spice') + 0.025 * player.techAgents,
    goalIsReachable: (player) => getResourceAmount(player, 'currency') > 3,
    reachedGoal: () => false,
    desiredFields: {},
    viableFields: {
      'trade rights': (player) =>
        getResourceDesire(player, 0.2, [
          { resource: 'spice', amount: 0.025 },
          { resource: 'tech-agents', amount: 0.05 },
          { resource: 'currency', amount: 0.0125, negative: true },
        ]),
      expedition: (player) =>
        getResourceDesire(player, 0.5, [
          { resource: 'spice', amount: 0.025 },
          { resource: 'tech-agents', amount: 0.05 },
        ]),
      'upgrade (tech)': (player) => (getResourceAmount(player, 'currency') > 3 ? 1 : 0),
    },
  },
  warship: {
    baseDesire: 0.5,
    desireModifier: (player, gameState) =>
      0.0125 * getResourceAmount(player, 'currency') -
      0.0125 * (gameState.currentTurn - 1) -
      0.1 * getPlayerWarshipCount(gameState),
    goalIsReachable: (player) => getResourceAmount(player, 'currency') > 3,
    reachedGoal: (player, gameState) => getPlayerWarshipCount(gameState) > 1,
    desiredFields: {
      'upgrade (warship)': (player) => 1,
    },
    viableFields: {},
  },
  'fremen-alliance': {
    baseDesire: 0.15,
    desireModifier: (player, gameState) =>
      0.05 * gameState.playerScore.fremen + (playerCanGetAllianceThisTurn(player, gameState, 'fremen') ? 0.2 : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.fremen > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'fremen'),
    viableFields: {
      'hardy warriors': (player) => getCostAdjustedDesire(player, 'water', 1, 0.5),
      stillsuits: () => 0.5,
    },
  },
  'bg-alliance': {
    baseDesire: 0.15,
    desireModifier: (player, gameState) =>
      0.05 * gameState.playerScore.bene + (playerCanGetAllianceThisTurn(player, gameState, 'bene') ? 0.2 : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.bene > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'bene'),
    viableFields: {
      'hidden knowledge': (player) => getCostAdjustedDesire(player, 'spice', 2, 0.5),
      'secret agreement': () => 0.5,
    },
  },
  'guild-alliance': {
    baseDesire: 0.15,
    desireModifier: (player, gameState) =>
      0.05 * gameState.playerScore.guild + (playerCanGetAllianceThisTurn(player, gameState, 'guild') ? 0.2 : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.guild > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'guild'),
    viableFields: {
      heighliner: (player) => getCostAdjustedDesire(player, 'spice', 6, 0.5),
      expedition: () => 0.5,
    },
  },
  'emperor-alliance': {
    baseDesire: 0.15,
    desireModifier: (player, gameState) =>
      0.05 * gameState.playerScore.imperium + (playerCanGetAllianceThisTurn(player, gameState, 'imperium') ? 0.2 : 0),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) =>
      gameState.playerScore.imperium > 3 && !enemyIsCloseToPlayerFactionScore(gameState, 'imperium'),
    viableFields: {
      conspiracy: (player) => getCostAdjustedDesire(player, 'spice', 4, 0.5),
      'imperial favor': () => 0.5,
    },
  },
  'enter-combat': {
    baseDesire: 0.0,
    desireModifier: (player, gameState) => {
      const alwaysTryToWinCombat = gameState.isFinale || getPlayerGarrisonStrength(gameState.playerCombatUnits) > 12;
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
      arrakeen: () => 0.5,
      carthag: () => 0.5,
      'sietch tabr': (player, gameState) => (gameState.playerScore.fremen > 1 ? 0.5 : 0),
      'hardy warriors': (player) => getCostAdjustedDesire(player, 'water', 1, 0.5),
      heighliner: (player) => getCostAdjustedDesire(player, 'spice', 6, 0.5),
      'imperial favor': (player, gameState) => (gameState.playerScore.imperium === 1 ? 0.5 : 0),
      conspiracy: (player, gameState) =>
        getCostAdjustedDesire(player, 'spice', 4, gameState.playerScore.imperium === 1 ? 0.5 : 0),
      'imperial basin': () => 0.5,
      'hagga basin': (player) => getCostAdjustedDesire(player, 'water', 1, 0.5),
      'the great flat': (player) => getCostAdjustedDesire(player, 'water', 2, 0.5),
      'research station (draw)': (player) => getCostAdjustedDesire(player, 'water', 2, 0.5),
      'research station (trim)': (player) => getCostAdjustedDesire(player, 'water', 2, 0.5),
      'upgrade (tech)': (player) => getCostAdjustedDesire(player, 'currency', 4, 0.5),
      'upgrade (warship)': (player) => getCostAdjustedDesire(player, 'currency', 4, 0.5),
    },
  },
  'get-troops': {
    baseDesire: 0.0,
    desireModifier: (player, gameState) => {
      const winCombatDesire = 0.66 * getWinCombatDesireModifier(gameState);
      const restockTroopsDesire = 0.15 * (4 - gameState.playerCombatUnits.troopsInGarrison);

      return winCombatDesire > restockTroopsDesire ? winCombatDesire : restockTroopsDesire;
    },
    goalIsReachable: (player) => getResourceAmount(player, 'water') > 0 || getResourceAmount(player, 'spice') > 3,
    reachedGoal: () => false,
    viableFields: {
      arrakeen: () => 0.3,
      carthag: () => 0.3,
      'sietch tabr': (player, gameState) => (gameState.playerScore.fremen > 1 ? 0.3 : 0),
      'hardy warriors': (player, gameState) =>
        getCostAdjustedDesire(player, 'water', 1, gameState.playerScore.fremen === 1 ? 1.0 : 0.6),
      heighliner: (player) => getCostAdjustedDesire(player, 'spice', 6, 1.0),
      conspiracy: (player, gameState) =>
        getCostAdjustedDesire(player, 'spice', 4, gameState.playerScore.imperium === 1 ? 0.8 : 0.6),
    },
  },
  intrigues: {
    baseDesire: 0.25,
    desireModifier: (player) => -0.05 * player.intrigueCount,
    goalIsReachable: () => false,
    reachedGoal: () => false,
    viableFields: {
      carthag: () => 0.5,
      conspiracy: (player) => getCostAdjustedDesire(player, 'spice', 4, 1.0),
      'secret agreement': () => 0.5,
    },
  },
  'fold-space': {
    baseDesire: 0.2,
    desireModifier: () => 0,
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.isFinale,
    viableFields: {
      expedition: () => 0.5,
    },
  },
  'get-persuasion': {
    baseDesire: 0.3,
    desireModifier: (player) => -0.025 * player.cardsBought - 0.0125 * player.cardsTrimmed,
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => gameState.isFinale,
    viableFields: {
      'relations (draw)': () => 1.0,
      'relations (trim)': () => 1.0,
    },
  },
  'draw-cards': {
    baseDesire: 0.0,
    desireModifier: (player, gameState) => {
      const deckBuildingDesire = !gameState.isFinale
        ? clamp(
            0.4 +
              (player.hasCouncilSeat ? 0.1 : 0) -
              0.0066 * (gameState.currentTurn - 1) * gameState.currentTurn +
              0.033 * player.cardsBought +
              0.025 * player.cardsTrimmed,
            0,
            0.6
          )
        : 0;

      const getSpiceMustFlowsDesire =
        player.cardsInDeck > 7
          ? clamp(0.1 + (player.hasCouncilSeat ? 0.1 : 0) + 0.05 * player.cardsBought + 0.05 * player.cardsTrimmed, 0, 0.6)
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
    goalIsReachable: (player) => getResourceAmount(player, 'water') > 1 || getResourceAmount(player, 'spice') > 1,
    reachedGoal: (player) => !playerCanDrawCards(player, 1),
    viableFields: {
      'relations (draw)': () => 0.3,
      mentat: (player) => getCostAdjustedDesire(player, 'currency', 3, 0.3),
      arrakeen: () => 0.3,
      'research station (draw)': (player) =>
        // if we cant buy 3 cards, we always trim
        playerCanDrawCards(player, 3)
          ? getCostAdjustedDesire(player, 'water', 2, clamp(0.6 + 0.075 * player.cardsBought, 0, 0.9))
          : 0,
      'research station (trim)': (player) =>
        getCostAdjustedDesire(player, 'water', 2, clamp(0.5 + 0.075 * player.cardsBought, 0, 0.7)),
      'secret agreement': (player, gameState) => (gameState.playerScore.bene === 1 ? 0.15 : 0.0),
      'hidden knowledge': (player, gameState) =>
        getCostAdjustedDesire(
          player,
          'spice',
          2,
          gameState.playerScore.bene === 1
            ? 0.65 + 0.075 * player.cardsBought
            : clamp(0.6 + 0.075 * player.cardsBought, 0, 0.8)
        ),
    },
  },
  'trim-deck': {
    baseDesire: 0.35,
    desireModifier: (player, gameState) =>
      clamp(
        -(0.0066 * (gameState.currentTurn - 1) * gameState.currentTurn) +
          0.1 * player.cardsBought -
          0.15 * player.cardsTrimmed,
        -0.4,
        0.4
      ),
    goalIsReachable: () => false,
    reachedGoal: (player, gameState) => player.cardsInDeck < 7 || gameState.isFinale,
    viableFields: {
      'relations (trim)': () => 0.5,
      'secret agreement': (player, gameState) => (gameState.playerScore.bene === 1 ? 0.75 : 0.5),
      'hidden knowledge': (player, gameState) =>
        getCostAdjustedDesire(player, 'spice', 2, gameState.playerScore.bene === 1 ? 0.25 : 0.0),
      'research station (trim)': (player) => getCostAdjustedDesire(player, 'water', 2, 0.5),
    },
  },
  'collect-water': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      let maxDesire = 0.0;
      if (
        !goals['collect-spice'].reachedGoal(player, gameState, goals) &&
        !goals['collect-spice'].goalIsReachable(player, gameState, goals)
      ) {
        const goalDesire = getDesire(goals['collect-spice'], player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (
        !goals['draw-cards'].reachedGoal(player, gameState, goals) &&
        !goals['draw-cards'].goalIsReachable(player, gameState, goals)
      ) {
        const goalDesire = getDesire(goals['draw-cards'], player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!goals['get-troops'].goalIsReachable(player, gameState, goals)) {
        const goalDesire = getDesire(goals['get-troops'], player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!goals['harvest-accumulated-spice-basin'].goalIsReachable(player, gameState, goals)) {
        const goalDesire = getDesire(goals['harvest-accumulated-spice-basin'], player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!goals['harvest-accumulated-spice-flat'].goalIsReachable(player, gameState, goals)) {
        const goalDesire = getDesire(goals['harvest-accumulated-spice-flat'], player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      return maxDesire;
    },
    goalIsReachable: () => false,
    reachedGoal: (player) => getResourceAmount(player, 'water') > 3,
    viableFields: {
      stillsuits: () => 0.5,
      'sietch tabr': (player, gameState) => (gameState.playerScore.fremen > 1 ? 0.5 : 0),
      heighliner: (player) => getCostAdjustedDesire(player, 'spice', 6, 1.0),
    },
  },
  'collect-spice': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      let maxDesire = 0.0;
      const spice = getResourceAmount(player, 'spice');
      if (
        !goals['collect-currency'].reachedGoal(player, gameState, goals) &&
        !goals['collect-currency'].goalIsReachable(player, gameState, goals)
      ) {
        const goalDesire = getDesire(goals['collect-currency'], player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (
        !goals['draw-cards'].reachedGoal(player, gameState, goals) &&
        !goals['draw-cards'].goalIsReachable(player, gameState, goals)
      ) {
        const goalDesire = getDesire(goals['draw-cards'], player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!goals['get-troops'].goalIsReachable(player, gameState, goals)) {
        const goalDesire = getDesire(goals['get-troops'], player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (spice < 4) {
        const goalDesire = getDesire(goals.intrigues, player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      return maxDesire;
    },
    goalIsReachable: (player) => getResourceAmount(player, 'water') > 1,
    reachedGoal: (player) => getResourceAmount(player, 'spice') > 7,
    viableFields: {
      'imperial basin': (player, gameState) => 0.2 + 0.4 * getAccumulatedSpice(gameState, 'imperial basin'),
      'hagga basin': (player, gameState) =>
        getCostAdjustedDesire(player, 'water', 1, 0.5 + 0.2 * getAccumulatedSpice(gameState, 'hagga basin')),
      'the great flat': (player, gameState) =>
        getCostAdjustedDesire(player, 'water', 2, 0.8 + 0.1 * getAccumulatedSpice(gameState, 'hagga basin')),
    },
  },
  'collect-currency': {
    baseDesire: 0.0,
    desireModifier: (player, gameState, goals) => {
      let maxDesire = 0.0;
      if (
        !goals.swordmaster.reachedGoal(player, gameState, goals) &&
        !goals.swordmaster.goalIsReachable(player, gameState, goals)
      ) {
        const goalDesire = getDesire(goals.swordmaster, player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (
        !goals['high-council'].reachedGoal(player, gameState, goals) &&
        !goals['high-council'].goalIsReachable(player, gameState, goals)
      ) {
        const goalDesire = getDesire(goals['high-council'], player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (
        !gameState.isFinale &&
        !goals.warship.reachedGoal(player, gameState, goals) &&
        !goals.warship.goalIsReachable(player, gameState, goals)
      ) {
        const goalDesire = getDesire(goals.warship, player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }
      if (!gameState.isFinale && !goals.tech.goalIsReachable(player, gameState, goals)) {
        const goalDesire = getDesire(goals.tech, player, gameState);

        if (goalDesire > maxDesire) {
          maxDesire = goalDesire;
        }
      }

      return maxDesire;
    },
    goalIsReachable: (player) => getResourceAmount(player, 'spice') > 3,
    reachedGoal: (player) => getResourceAmount(player, 'currency') > 11,
    viableFields: {
      'imperial favor': () => 0.5,
      'trade rights': () => 0.5,
      'spice sale': (player) =>
        getResourceAmount(player, 'spice') > 1 ? 1.0 - 0.05 * getResourceAmount(player, 'currency') : 0,
      expedition: (player, gameState) => (gameState.playerScore.guild === 1 ? 0.5 : 0),
      conspiracy: (player) => getCostAdjustedDesire(player, 'spice', 4, 0.5),
    },
  },
  'harvest-accumulated-spice-basin': {
    baseDesire: 0.0,
    desireModifier: (player, gameState) => 0.2 * getAccumulatedSpice(gameState, 'hagga basin'),
    goalIsReachable: (player) => getResourceAmount(player, 'water') > 0,
    reachedGoal: (player, gameState) => getAccumulatedSpice(gameState, 'imperial basin') === 0,
    viableFields: {
      'hagga basin': (player) => getCostAdjustedDesire(player, 'water', 1, 0.5),
    },
  },
  'harvest-accumulated-spice-flat': {
    baseDesire: 0.0,
    desireModifier: (player, gameState) => 0.2 * getAccumulatedSpice(gameState, 'the great flat'),
    goalIsReachable: (player) => getResourceAmount(player, 'water') > 1,
    reachedGoal: (player, gameState) => getAccumulatedSpice(gameState, 'the great flat') === 0,
    viableFields: {
      'the great flat': (player) => getCostAdjustedDesire(player, 'water', 2, 0.5),
    },
  },
  'swordmaster-helper': {
    baseDesire: 0.0,
    desireModifier: (player, gameState) =>
      getResourceAmount(player, 'currency') > 6 && !player.hasSwordmaster
        ? 0.3 - 0.05 * (getResourceAmount(player, 'currency') - 7) - 0.025 * (gameState.currentTurn - 1)
        : 0,
    goalIsReachable: (player, gameState) => gameState.isFinale,
    reachedGoal: (player) => player.hasSwordmaster === true,
    viableFields: {
      'imperial favor': () => 1,
      'trade rights': () => 1,
      'spice sale': (player) => (getResourceAmount(player, 'spice') > 1 ? 0.25 : 0),
      expedition: (player, gameState) => (gameState.playerScore.guild === 1 ? 1 : 0),
      conspiracy: (player) => getCostAdjustedDesire(player, 'spice', 4, 1.0),
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
    const resourceAmount = getResourceAmount(player, influence.resource);
    if (!influence.negative) {
      desire = desire + clamp(resourceAmount * influence.amount, 0, influence.maxAmount ?? 1);
    } else {
      desire = desire - clamp(resourceAmount * influence.amount, 0, influence.maxAmount ?? 1);
    }
  }
  return clamp(desire, 0, 1);
}

function getResourceAmount(player: Player, resourceType: ResourceType | 'tech-agents' | 'intrigues' | 'cards-in-deck') {
  switch (resourceType) {
    case 'tech-agents':
      return player.techAgents;
    case 'intrigues':
      return player.intrigueCount;
    case 'cards-in-deck':
      return player.cardsInDeck;
    default:
      const resource = player.resources.find((x) => x.type === resourceType);
      if (resource && resource.amount && resource.amount) {
        return resource.amount;
      } else {
        return 0;
      }
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
  return player.troopsInCombat * 2 + player.shipsInCombat * 3;
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
  const combatPowerTreshold = 3 + Math.random() * 2 + gameState.currentTurn * 0.25;

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
        desire = desire - 0.5;
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

export function getDesire(goal: AIGoal, player: Player, gameState: GameState) {
  const goalDesire = goal.desireModifier(player, gameState, aiGoals);
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

function getCostAdjustedDesire(player: Player, resourceType: ResourceType, costs: number, desire: number) {
  const playerResourceAmount = getResourceAmount(player, resourceType);
  if (costs > playerResourceAmount) {
    return 0;
  }

  const desireAdjustment = 1.0 - 0.125 * costs + 0.1 * (playerResourceAmount - costs);

  return clamp(desire * desireAdjustment, 0, 1);
}

function playerCanDrawCards(player: Player, amount: number) {
  return player.cardsInDeck >= player.cardsDrawnThisRound + amount;
}
