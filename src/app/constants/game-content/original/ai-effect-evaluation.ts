import {
  getParticipateInCombatDesire,
  getWinCombatDesire,
  noOneHasMoreInfluence,
  playerAllianceIsContested,
  playerCanGetAllianceThisTurn,
  playerHasUncontestedAlliance,
} from 'src/app/helpers/ai';
import { getPlayerCombatStrength, getPlayerdreadnoughtCount } from 'src/app/helpers/combat';
import { getModifiedLocationTakeoverTroopCosts } from 'src/app/helpers/game-modifiers';
import { ActionField, EffectRewardType } from 'src/app/models';
import { GameState } from 'src/app/models/ai';
import { Player } from 'src/app/models/player';
import { AIRewardEffectGameInterface } from '../../board-settings';

export function getRewardEffectEvaluation(
  rewardType: EffectRewardType,
  player: Player,
  gameState: GameState,
  game: AIRewardEffectGameInterface,
) {
  switch (rewardType) {
    case 'water':
      return (
        2.7 +
        0.02 * gameState.playerTechTilesConversionCosts.water -
        (player.hasSwordmaster ? 0.05 : 0) -
        (player.hasCouncilSeat ? 0.05 : 0) -
        0.025 * getPlayerdreadnoughtCount(gameState.playerCombatUnits) -
        0.015 * (gameState.currentRound - 1) -
        0.02 * gameState.playerCardsRewards.water -
        0.02 * gameState.playerTechTilesRewards.water
      );
    case 'spice':
      return (
        2.3 +
        0.015 * gameState.playerTechTilesConversionCosts.spice -
        (player.hasSwordmaster ? 0.1 : 0) -
        (player.hasCouncilSeat ? 0.1 : 0) -
        0.05 * getPlayerdreadnoughtCount(gameState.playerCombatUnits) -
        0.02 * (gameState.currentRound - 1) -
        0.015 * gameState.playerCardsRewards.spice -
        0.015 * gameState.playerTechTilesRewards.spice
      );
    case 'solari':
      return (
        1.3 +
        0.01 * gameState.playerTechTilesConversionCosts.solari -
        (player.hasSwordmaster ? 0.2 : 0) -
        (player.hasCouncilSeat ? 0.2 : 0) -
        0.1 * getPlayerdreadnoughtCount(gameState.playerCombatUnits) -
        0.04 * (gameState.currentRound - 1) -
        0.01 * gameState.playerCardsRewards.solari -
        0.01 * gameState.playerTechTilesRewards.solari
      );
    case 'tech':
      return (
        1.9 +
        0.01 * gameState.playerTechTilesConversionCosts.tech -
        0.025 * (gameState.currentRound - 1) -
        0.01 * gameState.playerCardsRewards.tech -
        0.01 * gameState.playerTechTilesRewards.tech
      );
    case 'troop':
      return (
        1.6 + 0.015 * gameState.playerTechTilesConversionCosts['loose-troop'] - 0.015 * gameState.playerCardsRewards.troop
      );
    case 'dreadnought':
      const maxDreadnoughts = game.settings.maxPlayerDreadnoughtCount;
      return getPlayerdreadnoughtCount(gameState.playerCombatUnits) < maxDreadnoughts
        ? 8 + 0.2 * (gameState.currentRound - 1)
        : 0;
    case 'card-draw':
      return (
        1.6 +
        0.1 * gameState.playerAgentsAvailable -
        0.075 * gameState.playerCardsBought +
        0.05 * gameState.playerCardsTrashed +
        0.033 * (7 - gameState.playerCardsFieldAccess.length) -
        0.01 * gameState.playerCardsRewards['card-draw']
      );
    case 'card-discard':
      return -1.5 - 0.05 * gameState.playerCardsBought - 0.075 * gameState.playerCardsTrashed;
    case 'card-trash':
    case 'card-trash-from-hand':
    case 'card-trash-in-play':
    case 'focus':
      return (
        1.9 +
        0.125 * gameState.playerCardsBought -
        0.25 * gameState.playerCardsTrashed -
        0.02 * gameState.playerCardsRewards.focus
      );
    case 'card-draw-or-destroy':
      return 2 + 0.05 * gameState.playerCardsBought + 0.05 * gameState.playerCardsTrashed;
    case 'intrigue':
      return 2 + 0.05 * (gameState.currentRound - 1) - 0.01 * gameState.playerCardsRewards.intrigue;
    case 'persuasion':
      return 2.5 - 0.1 * (gameState.currentRound - 1);
    case 'foldspace':
      return (
        2.1 +
        0.125 * (7 - gameState.playerCardsFieldAccess.length) -
        0.075 * gameState.playerCardsBought -
        0.05 * gameState.playerCardsTrashed
      );
    case 'council-seat-small':
    case 'council-seat-large':
      return !player.hasCouncilSeat ? 12 - 0.05 * (gameState.currentRound - 1) : 0;
    case 'sword-master':
    case 'agent':
      return !player.hasSwordmaster ? 15 - 1 * (gameState.currentRound - 1) : 0;
    case 'spice-accumulation':
      return 0;
    case 'victory-point':
      return 7.5 + 1.75 * (gameState.currentRound - 1);
    case 'sword':
      return 1 + 0.05 * (gameState.currentRound - 1);
    case 'combat':
      return 1.4 + 0.125 * (gameState.currentRound - 1);
    case 'intrigue-trash':
      return -1.2;
    case 'intrigue-draw':
      return 0.25;
    case 'shipping':
      return 2.7 - 0.1 * gameState.playerResources.water - 0.1 * gameState.playerResources.spice;
    case 'faction-influence-up-choice':
      return 4 + 0.1 * (gameState.currentRound - 1);
    case 'faction-influence-up-emperor':
      return gameState.playerScore.emperor < gameState.gameSettings.factionInfluenceMaxScore
        ? 3 - 0.1 * gameState.playerScore.emperor - (playerHasUncontestedAlliance(gameState, 'emperor') ? 1.5 : 0)
        : 0;
    case 'faction-influence-up-guild':
      return gameState.playerScore.guild < gameState.gameSettings.factionInfluenceMaxScore
        ? 3 - 0.1 * gameState.playerScore.guild - (playerHasUncontestedAlliance(gameState, 'guild') ? 1.5 : 0)
        : 0;
    case 'faction-influence-up-bene':
      return gameState.playerScore.bene < gameState.gameSettings.factionInfluenceMaxScore
        ? 3 - 0.1 * gameState.playerScore.bene - (playerHasUncontestedAlliance(gameState, 'bene') ? 1.5 : 0)
        : 0;
    case 'faction-influence-up-fremen':
      return gameState.playerScore.fremen < gameState.gameSettings.factionInfluenceMaxScore
        ? 3 - 0.1 * gameState.playerScore.fremen - (playerHasUncontestedAlliance(gameState, 'fremen') ? 1.5 : 0)
        : 0;
    case 'faction-influence-up-twice-choice':
      return 7 + 0.2 * (gameState.currentRound - 1);
    case 'faction-influence-down-choice':
      return -2.5;
    case 'faction-influence-down-emperor':
    case 'faction-influence-down-guild':
    case 'faction-influence-down-bene':
    case 'faction-influence-down-fremen':
      return -3;
    case 'agent-lift':
    case 'mentat':
      return 2.5 + 0.25 * (gameState.currentRound - 1);
    case 'signet':
      return gameState.playerLeader.signetTokenOrFieldMarkerValue
        ? gameState.playerLeader.signetTokenOrFieldMarkerValue(player, gameState)
        : 0.75;
    case 'signet-ring':
      return gameState.playerLeader.signetRingValue
        ? gameState.playerLeader.signetRingValue(player, gameState)
        : gameState.playerLeader.structuredSignetEffects
          ? game.getStructuredEffectsEvaluation(gameState.playerLeader.structuredSignetEffects, player, gameState)
          : 3;
    case 'location-control':
      return 9 + 0.25 * (gameState.currentRound - 1);
    case 'location-control-choice':
      return 9 + 0.25 * (gameState.currentRound - 1);
    case 'loose-troop':
      return -1.6 + 0.1 * (gameState.currentRound - 1);
    case 'trash-self':
      return -1.25;
    case 'troop-insert':
    case 'troop-insert-or-retreat':
    case 'troop-retreat':
      return 1.0 + 0.125 * (gameState.currentRound - 1);
    case 'dreadnought-insert':
    case 'dreadnought-insert-or-retreat':
      return getPlayerdreadnoughtCount(gameState.playerCombatUnits) > 0 ? 2 : 1;
    case 'dreadnought-retreat':
      return getPlayerdreadnoughtCount(gameState.playerCombatUnits) > 0 ? -1 : -3;
    case 'enemies-card-discard':
      return 2.25 + 0.2 * (gameState.currentRound - 1);
    case 'enemies-troop-destroy':
      return 2.75 - 0.1 * (gameState.currentRound - 1);
    case 'enemies-intrigue-trash':
      return 3;
    case 'enemies-leader-assassinate':
      return 3.5;
    case 'card-return-to-hand':
      return (
        2 +
        0.075 * gameState.playerCardsBought +
        0.05 * gameState.playerCardsTrashed +
        0.025 * (7 - gameState.playerCardsFieldAccess.length)
      );
    case 'tech-tile-trash':
      return -5;
    case 'leader-heal':
      return 2 - 0.1 * (gameState.currentRound - 1);
    case 'leader-wound':
      return -2 + 0.1 * (gameState.currentRound - 1);
    default:
      return 0;
  }
}

export function getRewardEffectEvaluationForTurnState(
  rewardType: EffectRewardType,
  rewardAmount: number,
  player: Player,
  gameState: GameState,
  game: AIRewardEffectGameInterface,
  targetBoardSpace?: ActionField,
) {
  const hasPlacedAgents = gameState.playerAgentsOnFields.length > 0;
  const hasAgentsLeftToPlace = gameState.playerAgentsAvailable > 0;

  const value = getRewardEffectEvaluation(rewardType, player, gameState, game);

  switch (rewardType) {
    case 'water':
      if (gameState.playerResources.water >= 4) {
        return value * 0.1;
      }

      return (
        value -
        0.2 * gameState.playerResources.water +
        0.25 * gameState.playerIntriguesConversionCosts.water +
        0.25 * gameState.playerTechTilesConversionCosts.water
      );
    case 'spice':
      if (gameState.playerResources.spice >= 8) {
        return value * 0.1;
      }

      return (
        value -
        0.1 * gameState.playerResources.spice +
        0.25 * gameState.playerIntriguesConversionCosts.spice +
        0.25 * gameState.playerTechTilesConversionCosts.spice
      );
    case 'solari':
      if (gameState.playerResources.solari >= 12) {
        return value * 0.1;
      }

      return (
        value -
        0.05 * gameState.playerResources.solari +
        0.25 * gameState.playerIntriguesConversionCosts.solari +
        0.25 * gameState.playerTechTilesConversionCosts.solari
      );
    case 'tech':
      if (gameState.playerResources.solari >= 10) {
        return value * 0.1;
      }

      return (
        value +
        0.2 * gameState.playerResources.tech +
        0.25 * gameState.playerIntriguesConversionCosts.tech +
        0.25 * gameState.playerTechTilesConversionCosts.tech
      );
    case 'troop':
      const combatBoardSpace = targetBoardSpace?.rewards.some((x) => x.type === 'combat');
      return (
        (combatBoardSpace ? 1.125 : 1.0) * value +
        0.2 * (3 - gameState.playerCombatUnits.troopsInGarrison) +
        0.25 * gameState.playerIntriguesConversionCosts['loose-troop'] +
        0.25 * gameState.playerTechTilesConversionCosts['loose-troop']
      );
    case 'dreadnought':
      const combatField = targetBoardSpace?.rewards.some((x) => x.type === 'combat');
      const maxDreadnoughts = game.settings.maxPlayerDreadnoughtCount;

      return getPlayerdreadnoughtCount(gameState.playerCombatUnits) < maxDreadnoughts
        ? (combatField ? 1.25 : 1.0) * value + 0.1 * gameState.playerCombatUnits.troopsInGarrison
        : 0;
    case 'card-draw':
      if (player.turnState === 'reveal') {
        return -3;
      } else {
        const drawableCards =
          rewardAmount <= gameState.playerDeckCards.length ? rewardAmount : gameState.playerDeckCards.length;
        const efficiency = drawableCards / rewardAmount;

        return value * efficiency;
      }
    case 'card-discard':
      return value + 0.033 * gameState.playerHandCards.length;
    case 'card-trash':
    case 'card-trash-from-hand':
    case 'card-trash-in-play':
    case 'focus':
      return gameState.playerDeckSizeTotal > 7 ? value : 0;
    case 'card-draw-or-destroy':
      return gameState.playerDeckCards.length > 0 || gameState.playerDeckSizeTotal > 7 ? value : 0;
    case 'intrigue':
      const maxIntrigues = game.settings.maxPlayerIntrigueCount;
      if (maxIntrigues && gameState.playerIntrigueCount >= maxIntrigues) {
        return 0.5;
      }

      return value - 0.33 * gameState.playerIntrigueCount;
    case 'persuasion':
      return value;
    case 'foldspace':
      return (hasAgentsLeftToPlace ? value : 0.25 * value) + 0.1 * (7 - gameState.playerCardsFieldAccess.length);
    case 'council-seat-small':
    case 'council-seat-large':
      return value;
    case 'sword-master':
    case 'agent':
      return value;
    case 'mentat':
      return value;
    case 'spice-accumulation':
      return value;
    case 'victory-point':
      return value;
    case 'sword':
      const playerCombatStrength = getPlayerCombatStrength(gameState.playerCombatUnits, gameState);
      const playerCanSurpassEnemy = gameState.enemyCombatUnits
        .map((x) => getPlayerCombatStrength(x, gameState))
        .some(
          (enemyCombatStrength) =>
            enemyCombatStrength >= playerCombatStrength && enemyCombatStrength < playerCombatStrength + rewardAmount,
        );
      const playerIsInCombat =
        gameState.playerCombatUnits.troopsInCombat > 0 || gameState.playerCombatUnits.shipsInCombat > 0;

      if (gameState.currentRoundPhase !== 'agent-placement') {
        return playerIsInCombat
          ? playerCanSurpassEnemy
            ? 1.25 * value
            : value
          : gameState.playerAgentsAvailable * 0.33 * value;
      } else {
        return playerIsInCombat ? (playerCanSurpassEnemy ? 1.25 * value : value) : 0;
      }
    case 'combat':
      let canUseCombat = !!gameState.conflict?.boardSpaceId;
      if (!canUseCombat) {
        const agentsOnFields = gameState.playerAgentsOnFields;

        if (targetBoardSpace?.ownerReward) {
          agentsOnFields.push({ playerId: player.id, fieldId: targetBoardSpace.title.en, state: 'placed' });
        }

        const pickableLocations = agentsOnFields.filter((x) =>
          gameState.locations.some((y) => x.fieldId === y.actionField.title.en),
        );

        if (pickableLocations.length > 0) {
          canUseCombat = true;
        }
      }

      if (!canUseCombat) {
        return -3;
      }

      const participateDesire = getParticipateInCombatDesire(gameState);
      const winDesire = getWinCombatDesire(gameState);
      return (winDesire > participateDesire ? winDesire : participateDesire) * 2.5;
    case 'intrigue-trash':
      return value;
    case 'intrigue-draw':
      return value + 2 * gameState.playerIntrigueStealAmount;
    case 'shipping':
      return value;
    case 'faction-influence-up-choice':
      return value;
    case 'faction-influence-up-emperor':
      return (
        value +
        0.15 * gameState.playerScore.emperor +
        (noOneHasMoreInfluence(player, gameState, 'emperor') ? 0.05 * gameState.currentRound : 0) +
        (playerCanGetAllianceThisTurn(player, gameState, 'emperor') ? 1 : 0) +
        (playerAllianceIsContested(gameState, 'emperor') ? 1 : 0) -
        (gameState.enemyScore.some((x) => x.emperor >= gameState.gameSettings.factionInfluenceMaxScore) ? 2 : 0)
      );
    case 'faction-influence-up-guild':
      return (
        value +
        0.15 * gameState.playerScore.guild +
        (noOneHasMoreInfluence(player, gameState, 'guild') ? 0.05 * gameState.currentRound : 0) +
        (playerCanGetAllianceThisTurn(player, gameState, 'guild') ? 1 : 0) +
        (playerAllianceIsContested(gameState, 'guild') ? 1 : 0) -
        (gameState.enemyScore.some((x) => x.guild >= gameState.gameSettings.factionInfluenceMaxScore) ? 2 : 0)
      );
    case 'faction-influence-up-bene':
      return (
        value +
        0.15 * gameState.playerScore.bene +
        (noOneHasMoreInfluence(player, gameState, 'bene') ? 0.05 * gameState.currentRound : 0) +
        (playerCanGetAllianceThisTurn(player, gameState, 'bene') ? 1 : 0) +
        (playerAllianceIsContested(gameState, 'bene') ? 1 : 0) -
        (gameState.enemyScore.some((x) => x.bene >= gameState.gameSettings.factionInfluenceMaxScore) ? 2 : 0)
      );
    case 'faction-influence-up-fremen':
      return (
        value +
        0.15 * gameState.playerScore.fremen +
        (noOneHasMoreInfluence(player, gameState, 'fremen') ? 0.05 * gameState.currentRound : 0) +
        (playerCanGetAllianceThisTurn(player, gameState, 'fremen') ? 1 : 0) +
        (playerAllianceIsContested(gameState, 'fremen') ? 1 : 0) -
        (gameState.enemyScore.some((x) => x.fremen >= gameState.gameSettings.factionInfluenceMaxScore) ? 2 : 0)
      );
    case 'faction-influence-up-twice-choice':
      return value;
    case 'faction-influence-down-choice':
      return value;
    case 'faction-influence-down-emperor':
    case 'faction-influence-down-guild':
    case 'faction-influence-down-bene':
    case 'faction-influence-down-fremen':
      return value;
    case 'agent-lift':
      if (player.turnState !== 'agent-placement' || !hasPlacedAgents) {
        return -3;
      } else {
        if (!gameState.conflict || getPlayerCombatStrength(gameState.playerCombatUnits, gameState) <= 0) {
          return value;
        }

        const possibleLocationControlViaConflict = gameState.conflict?.rewards[0].some(
          (x) => x.type === 'location-control-choice',
        );
        const possibleLocationControlViaDreadnought = gameState.playerCombatUnits.shipsInCombat > 0;
        const allPlayerAgentsAreOnControllableLocations = gameState.playerAgentsOnFields.every(
          (x) =>
            gameState.freeLocations.includes(x.fieldId) || gameState.enemyLocations.some((y) => x.fieldId === y.locationId),
        );

        return (possibleLocationControlViaConflict || possibleLocationControlViaDreadnought) &&
          allPlayerAgentsAreOnControllableLocations
          ? -3
          : value;
      }
    case 'signet':
      return gameState.playerLeader.signetTokenOrFieldMarkerValue
        ? gameState.playerLeader.signetTokenOrFieldMarkerValue(player, gameState, targetBoardSpace)
        : 0.75;
    case 'signet-ring':
      return gameState.playerLeader.signetRingValue
        ? gameState.playerLeader.signetRingValue(player, gameState, targetBoardSpace)
        : gameState.playerLeader.structuredSignetEffects
          ? game.getStructuredEffectsEvaluationForTurnState(
              gameState.playerLeader.structuredSignetEffects,
              player,
              gameState,
              'agent-placement',
              false,
              targetBoardSpace,
            )
          : value;
    case 'location-control':
      let canTakeOverLocation = true;

      const conflictBoardSpaceId = gameState.conflict?.boardSpaceId;
      if (conflictBoardSpaceId) {
        const enemyLocation = gameState.enemyLocations.find((x) => x.locationId === conflictBoardSpaceId);
        const effectiveTakeOverTroopCosts = getModifiedLocationTakeoverTroopCosts(
          game.settings.locationTakeoverTroopCosts,
          game.settings.getBoardField(conflictBoardSpaceId),
          gameState.playerGameModifiers?.locationTakeoverTroopCosts,
        );

        if (enemyLocation && gameState.playerCombatUnits.troopsInGarrison < effectiveTakeOverTroopCosts) {
          canTakeOverLocation = false;
        }
      }

      return canTakeOverLocation ? value : value * 0.5;
    case 'location-control-choice':
      const playerAgentsOnFields = gameState.playerAgentsOnFields;
      if (targetBoardSpace?.ownerReward) {
        playerAgentsOnFields.push({ playerId: player.id, fieldId: targetBoardSpace.title.en, state: 'placed' });
      }

      const controllableFreeLocations = playerAgentsOnFields.filter((x) =>
        gameState.freeLocations.some((y) => x.fieldId === y),
      );
      const controllableEnemyLocations = playerAgentsOnFields.filter(
        (x) =>
          gameState.enemyLocations.some((y) => x.fieldId === y.locationId) &&
          gameState.playerCombatUnits.troopsInGarrison >=
            getModifiedLocationTakeoverTroopCosts(
              game.settings.locationTakeoverTroopCosts,
              game.settings.getBoardField(x.fieldId),
              gameState.playerGameModifiers?.locationTakeoverTroopCosts,
            ),
      );

      const canOnlyControlConflictLocation = [...controllableFreeLocations, ...controllableEnemyLocations].every(
        (x) => x.fieldId === gameState.conflict?.boardSpaceId,
      );

      if (canOnlyControlConflictLocation) {
        return -3;
      }

      return controllableFreeLocations.length > 0 ? value : controllableEnemyLocations.length > 0 ? value * 0.9 : -3;
    case 'loose-troop':
      return value + 0.33 * gameState.playerCombatUnits.troopsInGarrison;
    case 'trash-self':
      return value;
    case 'troop-insert':
    case 'troop-insert-or-retreat':
      const combatBoardSpaces = gameState.boardSpaces.filter((x) => x.rewards.some((y) => y.type === 'combat'));
      const playerAgentsOnCombatBoardSpaces = gameState.playerAgentsOnFields.filter((x) =>
        combatBoardSpaces.some((y) => x.fieldId === y.title.en),
      );
      return playerAgentsOnCombatBoardSpaces.length > 0 && gameState.playerCombatUnits.troopsInGarrison > 0 ? value : 0;
    case 'troop-retreat':
      return gameState.playerCombatUnits.troopsInGarrison > 0 ? value : 0;
    case 'dreadnought-insert':
    case 'dreadnought-insert-or-retreat':
      return gameState.playerCombatUnits.shipsInGarrison > 0 ? value : 0;
    case 'dreadnought-retreat':
      const unitsInCombat = gameState.playerCombatUnits.shipsInCombat + gameState.playerCombatUnits.troopsInCombat;
      return value * (4 - gameState.playerAgentsAvailable / 2) - (unitsInCombat < 2 ? 2 : 0);
    case 'enemies-card-discard':
      return (value * 0.5 * gameState.enemyAgentsAvailable.length) / (gameState.playersCount - 1);
    case 'enemies-troop-destroy':
      return (
        (value * gameState.enemyCombatUnits.filter((x) => x.troopsInCombat > 0 || x.troopsInGarrison > 0).length) /
        (gameState.playersCount - 1)
      );
    case 'enemies-intrigue-trash':
      return (
        (value * gameState.enemyIntrigueCounts.filter((x) => x.intrigueCount > 0).length) / (gameState.playersCount - 1)
      );
    case 'enemies-leader-assassinate':
      const woundedEnemyLeaders = gameState.enemyLeaders.filter((leader) => leader.isFlipped);
      return value - woundedEnemyLeaders.length - 0.1 * gameState.enemyAgentsOnFields.length;
    case 'card-return-to-hand':
      const playerDiscardPileCount = gameState.playerDiscardPileCards?.length ?? 0;
      return playerDiscardPileCount > 0 ? value : -3;
    case 'tech-tile-trash':
      if (gameState.playerTechTiles.length > 0) {
        const techValue = getRewardEffectEvaluation('tech', player, gameState, game);
        const sortedTechTiles = gameState.playerTechTiles.sort((a, b) => a.costs - b.costs);
        return -(sortedTechTiles[0].costs * techValue * (1.25 - 0.075 * gameState.currentRound));
      } else {
        return 0;
      }
    case 'leader-heal':
      return value * 0.35 * (4 - gameState.playerResources['leader-heal']);
    case 'leader-wound':
      return value;
    default:
      return value;
  }
}
