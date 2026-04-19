import { Injectable } from '@angular/core';
import { clamp, take } from 'lodash';
import { getLeastDesiredFactionScoreType, getMostDesiredFactionScoreType } from 'src/app/helpers/ai';
import { getNumberAverage, normalizeNumber } from 'src/app/helpers/common';
import { getCardCostModifier, getTechTileCostModifier } from 'src/app/helpers/game-modifiers';
import {
  getMultipliedRewardEffects,
  isNegativeEffect,
  isStructuredConversionEffect,
  playerCanPayCosts,
} from 'src/app/helpers/rewards';
import { StructuredConversionEffect, StructuredConversionOrRewardEffect } from 'src/app/models';
import { GameState } from 'src/app/models/ai';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { Player } from 'src/app/models/player';
import { StructuredConversionEffectWithGameElement } from 'src/app/models/turn-info';
import { AudioManager } from '../audio-manager.service';
import { BoardSpaceService } from '../board-space.service';
import { CardsService, ImperiumDeckCard, ImperiumRowCard, ImperiumRowPlot } from '../cards.service';
import { CombatManager, PlayerCombatScore, PlayerCombatUnits } from '../combat-manager.service';
import { EffectsService } from '../game-effects.service';
import { GameElement } from '../game-manager.service';
import { GameModifiersService, TechTileModifier } from '../game-modifier.service';
import { GameStateService } from '../game-state.service';
import { IntriguesService } from '../intrigues.service';
import { LeadersService } from '../leaders.service';
import { LoggingService } from '../log.service';
import { PlayerAgentsService } from '../player-agents.service';
import { PlayerResourcesService } from '../player-resources.service';
import { PlayerFactionScoreType, PlayerScoreManager } from '../player-score-manager.service';
import { PlayersService } from '../players.service';
import { RoundPhaseType, RoundService } from '../round.service';
import { SettingsService } from '../settings.service';
import { TechTilesService } from '../tech-tiles.service';
import { TranslateService } from '../translate-service';
import { TurnInfoService } from '../turn-info.service';
import { AICardsService } from './ai-cards.service';
import { AIConflictService } from './ai-conflict.service';
import { AIPlayersService } from './ai-players.service';
import { AITechTilesService } from './ai-tech-tiles.service';
import { AIEffectEvaluationService } from './ai.effect-evaluation.service';
import { AIFieldEvaluationService, ViableField } from './ai.field-evaluation.service';

@Injectable({
  providedIn: 'root',
})
export class AIManager {
  constructor(
    private playerScoreManager: PlayerScoreManager,
    private playersService: PlayersService,
    private combatManager: CombatManager,
    private loggingService: LoggingService,
    private leadersService: LeadersService,
    private techTilesService: TechTilesService,
    private audioManager: AudioManager,
    private settingsService: SettingsService,
    private cardsService: CardsService,
    private gameModifiersService: GameModifiersService,
    private t: TranslateService,
    private intriguesService: IntriguesService,
    private turnInfoService: TurnInfoService,
    private playerAgentsService: PlayerAgentsService,
    private playersResourcesService: PlayerResourcesService,
    private gameStateService: GameStateService,
    private boardSpaceService: BoardSpaceService,
    private roundService: RoundService,
    private effectsService: EffectsService,
    private aiCardsService: AICardsService,
    private aiConflictService: AIConflictService,
    private aiTechTilesService: AITechTilesService,
    private aiPlayersService: AIPlayersService,
    private effectEvaluationService: AIEffectEvaluationService,
    private fieldEvaluationService: AIFieldEvaluationService,
  ) {}

  getCardAndFieldToPlay(playerHandCards: ImperiumDeckCard[], player: Player, gameState: GameState) {
    const aiPlayer = this.aiPlayersService.aiPlayers.find((x) => x.playerId === player.id);
    if (!aiPlayer) {
      return undefined;
    }

    const preferredFields = aiPlayer.preferredFields;

    const cardAndFieldEvaluations: { field: ViableField; evaluation: number; card: ImperiumDeckCard }[] = [];
    for (const [fieldIndex, preferredField] of preferredFields.entries()) {
      const boardField = gameState.boardSpaces.find((x) => x.title.en === preferredField.fieldId);

      const cardEvaluations = playerHandCards.map((card) => ({
        card,
        evaluationValue: this.aiCardsService.getImperiumCardPlayEvaluation(card, player, gameState, boardField),
      }));

      const usableCards = cardEvaluations.filter(
        (cardEvaluation) =>
          (preferredField.requiresInfiltration ? cardEvaluation.card.canInfiltrate : true) &&
          cardEvaluation.card.fieldAccess?.some((x) => x === preferredField.actionType),
      );

      if (usableCards.length > 0) {
        const evaluations = usableCards.map((cardEvaluation) => {
          const evaluation = cardEvaluation.evaluationValue - fieldIndex - fieldIndex * (1 - preferredField.value) * 3;
          return { field: preferredField, evaluation, card: cardEvaluation.card };
        });

        cardAndFieldEvaluations.push(...evaluations);
      }
    }

    if (cardAndFieldEvaluations.length > 0) {
      cardAndFieldEvaluations.sort((a, b) => b.evaluation - a.evaluation);

      return { cardToPlay: cardAndFieldEvaluations[0].card, preferredField: cardAndFieldEvaluations[0].field };
    }
    return undefined;
  }

  aiPlayIntrigue(player: Player, intrigue: IntrigueDeckCard, gameState: GameState) {
    const intrigueEffects =
      gameState.currentRoundPhase === 'agent-placement' ? intrigue.structuredPlotEffects : intrigue.structuredCombatEffects;

    this.loggingService.logPlayerPlayedIntrigue(player.id, this.t.translateLS(intrigue.name));
    this.turnInfoService.updatePlayerTurnInfo(player.id, { intriguesPlayedThisTurn: [intrigue] });

    this.intriguesService.trashPlayerIntrigue(player.id, intrigue.id);

    if (intrigueEffects) {
      this.effectsService.resolveStructuredEffects(intrigueEffects, player, gameState, {
        type: 'intrigue',
        object: intrigue,
      });
    }
  }

  aiHealLeadersIfUsefulAndPossible(playerId: number, timing: RoundPhaseType) {
    const playerLeader = this.leadersService.getPlayerLeader(playerId);
    if (playerLeader && playerLeader.isFlipped) {
      const healTokens = this.playersResourcesService.getPlayerResourceAmount(playerId, 'leader-heal');
      const healCosts = timing === 'combat-resolvement' ? 1 : 2;

      if (healTokens < healCosts) {
        return;
      }

      let shouldHealLeader = false;
      if (timing === 'combat-resolvement') {
        shouldHealLeader = true;
      } else {
        if (this.roundService.isFinale || healTokens > 3) {
          shouldHealLeader = true;
        } else if (Math.random() < 0.025 * this.roundService.currentRound) {
          shouldHealLeader = true;
        }
      }

      if (shouldHealLeader) {
        this.effectsService.payCostForPlayer(playerId, { type: 'leader-heal', amount: healCosts });
        this.leadersService.unflipLeader(playerId);
      }
    }
  }

  aiBuyImperiumCard(playerId: number, availablePersuasion: number) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const gameState = this.getGameState(player);
    const imperiumRowModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'imperiumRow');

    const { allCards, imperiumRowCards, recruitableCards } = this.cardsService.getAllBuyableCards(
      this.turnInfoService.getPlayerTurnInfo(playerId, 'factionRecruitment'),
    );

    const cardToBuy = this.aiCardsService.getImperiumCardToBuy(
      availablePersuasion,
      allCards,
      player,
      gameState,
      imperiumRowModifiers,
    );
    if (cardToBuy) {
      const costModifier = getCardCostModifier(cardToBuy, imperiumRowModifiers);
      if (cardToBuy.persuasionCosts) {
        this.playersService.addPersuasionSpentToPlayer(playerId, cardToBuy.persuasionCosts + costModifier);
      }
      if (cardToBuy.buyEffects) {
        for (const effect of cardToBuy.buyEffects) {
          this.effectsService.addRewardToPlayer(player.id, effect, { source: 'Imperium Card Buy Effect' });
        }
      }

      if (this.cardsService.limitedCustomCards.some((x) => x.id === cardToBuy.id)) {
        this.cardsService.aquirePlayerCardFromLimitedCustomCards(playerId, cardToBuy);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [cardToBuy] });
      } else if (recruitableCards.some((x) => x.id === cardToBuy.id)) {
        this.cardsService.aquirePlayerCardFromImperiumDeck(playerId, cardToBuy);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [cardToBuy] });
      } else if (imperiumRowCards.some((x) => x.id === cardToBuy.id)) {
        this.cardsService.aquirePlayerCardFromImperiumRow(playerId, cardToBuy);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [cardToBuy] });
      } else {
        const acquireLocation = this.settingsService.getCardAcquiringRuleImperiumRow();

        if (acquireLocation === 'discard-pile') {
          this.cardsService.addCardToPlayerDiscardPile(playerId, cardToBuy);
        } else if (acquireLocation === 'below-deck') {
          this.cardsService.addCardUnderPlayerDeck(playerId, cardToBuy);
        } else if (acquireLocation === 'above-deck') {
          this.cardsService.addCardOnTopOfPlayerDeck(playerId, cardToBuy);
        } else {
          this.cardsService.addCardToPlayerHand(playerId, cardToBuy);
        }

        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [cardToBuy] });
      }

      this.loggingService.logPlayerBoughtCard(playerId, this.t.translateLS(cardToBuy.name));

      return true;
    }
    return false;
  }

  aiBuyPlotCards(playerId: number, availablePersuasion: number) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const imperiumRowPlots = this.cardsService.imperiumRow.filter((x) => x.type === 'plot') as ImperiumRowPlot[];
    const imperiumRowModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'imperiumRow');

    const plotToBuy = this.aiCardsService.getPlotToBuy(availablePersuasion, imperiumRowPlots, player, imperiumRowModifiers);
    if (plotToBuy) {
      const costModifier = getCardCostModifier(plotToBuy, imperiumRowModifiers);
      if (plotToBuy.persuasionCosts) {
        this.playersService.addPersuasionSpentToPlayer(playerId, plotToBuy.persuasionCosts + costModifier);
      }
      this.cardsService.aquirePlayerPlotFromImperiumRow(playerId, plotToBuy);

      this.loggingService.logPlayerBoughtCard(playerId, this.t.translateLS(plotToBuy.name));
    }
  }

  aiTrashCardInPlay(playerId: number) {
    const cards: ImperiumDeckCard[] = [];
    const playerHandCards = this.cardsService.getPlayerHand(playerId)?.cards;
    if (playerHandCards) {
      cards.push(...playerHandCards);
    }
    const playerDiscardPileCards = this.cardsService.getPlayerDiscardPile(playerId)?.cards;
    if (playerDiscardPileCards) {
      cards.push(...playerDiscardPileCards);
    }

    const playerDeckCards = this.cardsService.getPlayerDeck(playerId)?.cards;
    if ((playerDeckCards?.length ?? 0) + (playerHandCards?.length ?? 0) + (playerDiscardPileCards?.length ?? 0) < 9) {
      return;
    }

    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const gameState = this.getGameState(player);

    const cardToTrash = this.aiCardsService.getCardToTrash(cards, player, gameState);
    if (cardToTrash) {
      this.cardsService.trashDiscardedPlayerCard(playerId, cardToTrash);
      this.cardsService.trashPlayerHandCard(playerId, cardToTrash);

      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsTrashedThisTurn: [cardToTrash] });
      this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(cardToTrash.name));
      return true;
    }
    return false;
  }

  aiDiscardHandCard(playerId: number) {
    const playerHandCards = this.cardsService.getPlayerHand(playerId)?.cards;
    if (playerHandCards) {
      const activeCards = this.cardsService.playedPlayerCards;
      const discardableCards = playerHandCards.filter((x) => !activeCards.some((y) => x.id === y.cardId));

      const player = this.playersService.getPlayer(playerId);
      if (!player) {
        return;
      }

      const gameState = this.getGameState(player);
      const cardToDiscard = this.aiCardsService.getCardToDiscard(discardableCards, player, gameState);
      if (cardToDiscard) {
        this.cardsService.discardPlayerHandCard(playerId, cardToDiscard);

        this.loggingService.logPlayerDiscardedCard(playerId, this.t.translateLS(cardToDiscard.name));
      }
    }
  }

  aiTrashCardFromHand(playerId: number) {
    const playerHandCards = this.cardsService.getPlayerHand(playerId)?.cards;
    if (playerHandCards) {
      const activeCards = this.cardsService.playedPlayerCards;
      const trashableCards = playerHandCards.filter((x) => !activeCards.some((y) => x.id === y.cardId));

      const player = this.playersService.getPlayer(playerId);
      if (!player) {
        return;
      }

      const gameState = this.getGameState(player);
      const cardToTrash = this.aiCardsService.getCardToTrash(trashableCards, player, gameState);
      if (cardToTrash) {
        this.cardsService.trashPlayerHandCard(playerId, cardToTrash);

        this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(cardToTrash.name));
      }
    }
  }

  aiTrashCardFromDiscardPile(playerId: number) {
    const playerDiscardPileCards = this.cardsService.getPlayerDiscardPile(playerId)?.cards;
    if (playerDiscardPileCards) {
      const player = this.playersService.getPlayer(playerId);
      if (!player) {
        return;
      }

      const gameState = this.getGameState(player);
      const cardToTrash = this.aiCardsService.getCardToTrash(playerDiscardPileCards, player, gameState);
      if (cardToTrash) {
        this.cardsService.trashDiscardedPlayerCard(playerId, cardToTrash);

        this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(cardToTrash.name));
      }
    }
  }

  aiAddCardToHandFromDiscardPile(playerId: number) {
    const playerDiscardPileCards = this.cardsService.getPlayerDiscardPile(playerId)?.cards;
    if (!playerDiscardPileCards) {
      return;
    }
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const gameState = this.getGameState(player);
    const cardToAddToHand = this.aiCardsService.getCardToPlay(playerDiscardPileCards, player, gameState);
    if (cardToAddToHand) {
      this.cardsService.returnDiscardedPlayerCardToHand(player.id, cardToAddToHand);
    }
  }

  aiTrashIntrigue(playerId: number) {
    const playerIntrigues = this.intriguesService.getPlayerIntrigues(playerId);
    if (playerIntrigues && playerIntrigues.length > 0) {
      const player = this.playersService.getPlayer(playerId);
      if (!player) {
        return;
      }

      const gameState = this.getGameState(player);

      const intrigueToTrash = this.aiCardsService.getIntrigueToTrash(playerIntrigues, player, gameState);
      if (intrigueToTrash) {
        this.intriguesService.trashPlayerIntrigue(playerId, intrigueToTrash.id);

        this.loggingService.logPlayerTrashedIntrigue(playerId, this.t.translateLS(intrigueToTrash.name));
      }
    }
  }

  aiTrashTechTile(playerId: number) {
    const playerTechTiles = this.techTilesService.getPlayerTechTiles(playerId);
    if (playerTechTiles && playerTechTiles.length > 0) {
      const player = this.playersService.getPlayer(playerId);
      if (!player) {
        return;
      }

      const gameState = this.getGameState(player);

      const techTileToTrash = this.aiTechTilesService.getTechTileToTrash(playerTechTiles, player, gameState);
      if (techTileToTrash) {
        this.techTilesService.trashPlayerTechTile(techTileToTrash.techTile.id);
        this.loggingService.logPlayerTrashedTechTile(playerId, this.t.translateLS(techTileToTrash.techTile.name));
      }
    }
  }

  aiGetTechTileToBuyIfPossible(playerId: number, costModifiers: TechTileModifier[] | undefined) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }
    const buyableTechTiles = this.techTilesService.buyableTechTiles;
    const availablePlayerTech = this.playersResourcesService.getPlayerResourceAmount(playerId, 'tech');
    const affordableTechTiles = buyableTechTiles.filter(
      (x) => x.costs + getTechTileCostModifier(x, costModifiers) <= availablePlayerTech,
    );

    if (affordableTechTiles.length > 0) {
      const gameState = this.getGameState(player);
      const desiredTechTile = buyableTechTiles.sort(
        (a, b) =>
          this.aiTechTilesService.getTechTileBuyEvaluation(b, player, gameState) -
          this.aiTechTilesService.getTechTileBuyEvaluation(a, player, gameState),
      )[0];

      const desire = this.aiTechTilesService.getTechTileBuyEvaluation(desiredTechTile, player, gameState);
      const effectiveCosts = desiredTechTile.costs - availablePlayerTech;

      if (
        affordableTechTiles.some((x) => x.name.en === desiredTechTile.name.en) &&
        (desire > 0.25 || effectiveCosts < 1 || this.roundService.isFinale)
      ) {
        return desiredTechTile;
      }
    }
    return undefined;
  }

  aiAddUnitsToCombat(
    player: Player,
    gameState: GameState,
    deployableUnits: number,
    deployableTroops: number,
    deployableDreadnoughts: number,
  ) {
    let addedUnitsToCombat = false;

    const playerCombatUnits = this.combatManager.getPlayerCombatUnits(player.id);
    const enemyCombatScores = this.combatManager.getEnemyCombatScores(player.id);
    const playerHasAgentsLeft = this.playerAgentsService.getAvailablePlayerAgentCount(player.id) > 1;

    if (playerCombatUnits) {
      let addableTroops =
        playerCombatUnits.troopsInGarrison >= deployableTroops ? deployableTroops : playerCombatUnits.troopsInGarrison;

      let addableDreadnoughts =
        playerCombatUnits.shipsInGarrison >= deployableDreadnoughts
          ? deployableDreadnoughts
          : playerCombatUnits.shipsInGarrison;

      if (deployableUnits > 0) {
        const potentialDreadnoughtsToAdd = playerCombatUnits.shipsInGarrison - addableDreadnoughts;
        if (potentialDreadnoughtsToAdd > 0) {
          const additionalAddableDreadnoughts =
            deployableUnits >= potentialDreadnoughtsToAdd ? potentialDreadnoughtsToAdd : deployableUnits;
          addableDreadnoughts += additionalAddableDreadnoughts;
          deployableUnits -= additionalAddableDreadnoughts;
        }

        const potentialTroopsToAdd = playerCombatUnits.troopsInGarrison - addableTroops;
        if (potentialTroopsToAdd > 0) {
          const additionalAddableTroops = deployableUnits >= potentialTroopsToAdd ? potentialTroopsToAdd : deployableUnits;
          addableTroops += additionalAddableTroops;
          deployableUnits -= additionalAddableTroops;
        }
      }

      const addUnitsDecision = this.aiConflictService.getAddAdditionalUnitsToCombatDecision(playerCombatUnits, gameState);

      if (addUnitsDecision === 'all' || this.roundService.isFinale) {
        const currentConflict = gameState.conflict;
        if (currentConflict && currentConflict.rewards[0]?.some((x) => x.type === 'location-control') && addableTroops > 0) {
          if (gameState.enemyLocations.some((x) => x.locationId === currentConflict.boardSpaceId)) {
            addableTroops -= 1;
          }
        }
        this.effectsService.addUnitsToCombatIfPossible(player.id, 'troop', addableTroops);
        this.effectsService.addUnitsToCombatIfPossible(player.id, 'dreadnought', addableDreadnoughts);
        addedUnitsToCombat = true;
      } else if (addUnitsDecision === 'minimum') {
        this.aiAddMinimumUnitsToCombat(player.id, playerCombatUnits, enemyCombatScores, playerHasAgentsLeft);
        addedUnitsToCombat = true;
      } else if (addUnitsDecision !== 'none') {
        let addedShipCombatStrength = 0;
        if (addableDreadnoughts) {
          this.effectsService.addUnitsToCombatIfPossible(player.id, 'dreadnought', addableDreadnoughts);
          addedShipCombatStrength = this.settingsService.getDreadnoughtStrength() * addableDreadnoughts;
          addedUnitsToCombat = true;
        }

        if (addUnitsDecision > addedShipCombatStrength) {
          const strengthToAdd = addUnitsDecision - addedShipCombatStrength;
          const troopsToAdd = Math.round(strengthToAdd / this.settingsService.getTroopStrength());
          this.effectsService.addUnitsToCombatIfPossible(
            player.id,
            'troop',
            addableTroops > troopsToAdd ? troopsToAdd : addableTroops,
          );
          addedUnitsToCombat = true;
        }
      }
    }
    return addedUnitsToCombat;
  }

  private aiAddMinimumUnitsToCombat(
    playerId: number,
    playerCombatUnits: PlayerCombatUnits,
    enemyCombatScores: PlayerCombatScore[],
    playerHasAgentsLeft: boolean,
  ) {
    if (playerHasAgentsLeft) {
      let troopsAdded = 0;

      if (playerCombatUnits.troopsInGarrison > 0) {
        const maxTroopAddChance = playerCombatUnits.troopsInGarrison * 0.2;
        const troopsToAdd = playerCombatUnits.troopsInGarrison > 1 && Math.random() < maxTroopAddChance ? 2 : 1;

        this.effectsService.addUnitsToCombatIfPossible(playerId, 'troop', troopsToAdd);
        troopsAdded = troopsToAdd;
      }

      if (troopsAdded === 0 && playerCombatUnits.shipsInGarrison > 0) {
        if (playerCombatUnits.shipsInGarrison > 0 || Math.random() > 0.75) {
          this.effectsService.addUnitsToCombatIfPossible(playerId, 'dreadnought', 1);
        }
      }
    } else {
      const maxTroopAddChance = playerCombatUnits.troopsInGarrison * 0.2;
      let troopsToAdd = playerCombatUnits.troopsInGarrison > 1 && Math.random() < maxTroopAddChance ? 2 : 1;

      const projectedCombatStrength =
        this.combatManager.getPlayerCombatScore(playerId) + this.combatManager.getCombatScore(troopsToAdd, 0);

      if (enemyCombatScores.some((x) => projectedCombatStrength === x.score)) {
        if (troopsToAdd === 1 && playerCombatUnits.troopsInGarrison > 1) {
          troopsToAdd++;
        } else {
          troopsToAdd--;
        }
      }
      this.effectsService.addUnitsToCombatIfPossible(playerId, 'troop', troopsToAdd);
    }
  }

  aiIncreaseFactionInfluenceChoice(player: Player, amount: number) {
    const increasedFactionScoreTypes: PlayerFactionScoreType[] = [];
    for (let i = amount; i > 0; i--) {
      const playerScores = this.playerScoreManager.playerScores;
      if (playerScores) {
        const factionAllianceTreshold = this.settingsService.getFactionInfluenceAllianceTreshold();
        const maxFactionInfluence = this.settingsService.getFactionInfluenceMaxScore();
        const desiredScoreType = getMostDesiredFactionScoreType(
          player.id,
          playerScores,
          1,
          factionAllianceTreshold,
          maxFactionInfluence,
          increasedFactionScoreTypes,
        );

        if (desiredScoreType) {
          const factionRewards = this.playerScoreManager.addFactionScore(
            player.id,
            desiredScoreType,
            1,
            this.roundService.currentRound,
          );
          this.audioManager.playSound('influence');
          increasedFactionScoreTypes.push(desiredScoreType);

          for (const reward of factionRewards) {
            this.effectsService.addRewardToPlayer(player.id, reward, { source: 'Influence' });
          }
        }
      }
    }
  }

  aiIncreaseFactionInfluenceChoiceTwice(player: Player, amount: number) {
    const increasedFactionScoreTypes: PlayerFactionScoreType[] = [];
    for (let i = amount; i > 0; i--) {
      const playerScores = this.playerScoreManager.playerScores;
      if (playerScores) {
        const factionAllianceTreshold = this.settingsService.getFactionInfluenceAllianceTreshold();
        const maxFactionInfluence = this.settingsService.getFactionInfluenceMaxScore();
        const desiredScoreType = getMostDesiredFactionScoreType(
          player.id,
          playerScores,
          1,
          factionAllianceTreshold,
          maxFactionInfluence,
          increasedFactionScoreTypes,
        );

        if (desiredScoreType) {
          const factionRewards = this.playerScoreManager.addFactionScore(
            player.id,
            desiredScoreType,
            2,
            this.roundService.currentRound,
          );
          this.audioManager.playSound('influence');
          increasedFactionScoreTypes.push(desiredScoreType);

          for (const reward of factionRewards) {
            this.effectsService.addRewardToPlayer(player.id, reward, { source: 'Influence' });
          }
        }
      }
    }
  }

  aiDecreaseFactionInfluenceChoice(playerId: number, amount: number) {
    for (let i = amount; i > 0; i--) {
      const playerScores = this.playerScoreManager.getPlayerScore(playerId);
      if (playerScores) {
        const leastDesiredScoreType = getLeastDesiredFactionScoreType(playerScores);
        if (leastDesiredScoreType) {
          this.playerScoreManager.removePlayerScore(playerId, leastDesiredScoreType, 1, this.roundService.currentRound);
        }
      }
    }
  }

  aiConvertRewardIfUsefulAndPossible(
    player: Player,
    effect: StructuredConversionEffectWithGameElement,
    gameState: GameState,
    overrideConversionIsUseful?: boolean,
  ) {
    const effectCosts = getMultipliedRewardEffects(effect.effectCosts, gameState);
    const effectRewards = getMultipliedRewardEffects(effect.effectConversions, gameState);
    const conversionIsUseful = overrideConversionIsUseful
      ? overrideConversionIsUseful
      : this.effectEvaluationService.getEffectConversionDecision(player, gameState, effectCosts, effectRewards);

    if (conversionIsUseful && playerCanPayCosts(effectCosts, player, gameState)) {
      for (const cost of effectCosts) {
        this.effectsService.payCostForPlayer(player.id, cost, { gameElement: effect.element });
      }
      for (const reward of effectRewards) {
        this.effectsService.addRewardToPlayer(player.id, reward, { gameElement: effect.element });
      }
    }
  }

  aiPickAndConvertRewardsIfUsefulAndPossible(
    conversionEffects: StructuredConversionEffect[],
    player: Player,
    gameState: GameState,
    maxConversions = 1,
  ) {
    const conversionEvaluations = conversionEffects.map((x) =>
      this.effectEvaluationService.getConversionEffectEvaluation(x, player, gameState),
    );
    conversionEvaluations.sort((a, b) => b - a);

    this.effectsService.resolveStructuredEffects(conversionEffects.slice(0, maxConversions), player, gameState);
  }

  aiChooseRewardOption(
    player: Player,
    leftSideEffect: StructuredConversionOrRewardEffect,
    rightSideEffect: StructuredConversionOrRewardEffect,
    gameState: GameState,
    gameElement?: GameElement,
  ) {
    let chosenEffect: StructuredConversionOrRewardEffect | undefined;

    let canChooseLeftSide = true;
    let canChooseRightSide = true;
    if (isStructuredConversionEffect(leftSideEffect)) {
      const costEffects = getMultipliedRewardEffects(leftSideEffect.effectCosts, gameState);
      if (!playerCanPayCosts(costEffects, player, gameState)) {
        canChooseLeftSide = false;
      }
    } else {
      const rewards = getMultipliedRewardEffects(leftSideEffect, gameState);
      for (const reward of rewards) {
        if (isNegativeEffect(reward)) {
          if (!playerCanPayCosts([reward], player, gameState)) {
            canChooseLeftSide = false;
          }
        }
      }
    }
    if (isStructuredConversionEffect(rightSideEffect)) {
      const costEffects = getMultipliedRewardEffects(rightSideEffect.effectCosts, gameState);
      if (!playerCanPayCosts(costEffects, player, gameState)) {
        canChooseRightSide = false;
      }
    } else {
      const rewards = getMultipliedRewardEffects(rightSideEffect, gameState);
      for (const reward of rewards) {
        if (isNegativeEffect(reward)) {
          if (!playerCanPayCosts([reward], player, gameState)) {
            canChooseRightSide = false;
          }
        }
      }
    }
    if (canChooseLeftSide && canChooseRightSide) {
      chosenEffect = this.effectEvaluationService.getEffectChoiceDecision(
        player,
        gameState,
        leftSideEffect,
        rightSideEffect,
      );
    } else if (canChooseLeftSide) {
      chosenEffect = leftSideEffect;
    } else if (canChooseRightSide) {
      chosenEffect = rightSideEffect;
    }

    if (chosenEffect) {
      this.effectsService.resolveStructuredEffects([chosenEffect], player, gameState, gameElement);
    }
  }

  setPreferredFieldsForAIPlayer(player: Player) {
    if (!player.isAI) {
      return;
    }

    const gameState = this.gameStateService.getGameState(
      player,
      this.roundService.currentRound,
      this.roundService.currentRoundPhase,
      this.roundService.isFinale,
      this.boardSpaceService.accumulatedSpiceOnBoardSpaces,
    );

    const aiPlayers = this.aiPlayersService.aiPlayers;
    const aiPlayer = aiPlayers.find((x) => x.playerId === player.id);

    const playerLeader = gameState.playerLeader;

    if (!aiPlayer || !gameState.playerHandCards) {
      return;
    }

    let conflictEvaluation =
      0.4 + 0.025 * gameState.playerCombatUnits.troopsInGarrison + 0.1 * gameState.playerCombatUnits.shipsInGarrison;
    if (gameState.conflict) {
      const evaluation = normalizeNumber(
        this.effectEvaluationService.getRewardArrayEvaluation(gameState.conflict.rewards[0], player, gameState),
        30,
        0,
      );
      const evaluationForTurnState = normalizeNumber(
        this.effectEvaluationService.getRewardArrayEvaluationForTurnState(gameState.conflict.rewards[0], player, gameState),
        30,
        0,
      );
      const dreadnoughtEvaluation =
        (gameState.playerCombatUnits.shipsInCombat *
          this.effectEvaluationService.getRewardEffectEvaluation('location-control-choice', player, gameState)) /
        2;

      conflictEvaluation = (evaluation + evaluationForTurnState) / 2 + dreadnoughtEvaluation;
    }

    const techEvaluation = clamp(
      normalizeNumber(
        Math.max(
          ...gameState.availableTechTiles.map((x) => this.aiTechTilesService.getTechTileBuyEvaluation(x, player, gameState)),
        ),
        15,
        0,
      ),
      0,
      1,
    );

    const evaluatedImperiumRowCards = (
      gameState.imperiumRowCards.filter((x) => x.type === 'imperium-card') as ImperiumRowCard[]
    ).map((x) => this.aiCardsService.getImperiumCardBuyEvaluation(x, player, gameState));
    evaluatedImperiumRowCards.sort((a, b) => b - a);
    const topThreeImperiumRowCardEvaluations = take(evaluatedImperiumRowCards, 3);
    const imperiumRowEvaluation = clamp(normalizeNumber(getNumberAverage(topThreeImperiumRowCardEvaluations), 20, 4), 0, 1);

    const { preferredFields } = this.fieldEvaluationService.getPreferredFieldsForAIPlayer(
      player,
      gameState,
      playerLeader,
      aiPlayer,
      conflictEvaluation,
      techEvaluation,
      imperiumRowEvaluation,
      this.aiPlayersService.aiDifficulty,
    );

    this.aiPlayersService.setPreferredFieldsForAIPlayer(player, preferredFields, {
      conflictEvaluation,
      techEvaluation,
      imperiumRowEvaluation,
    });
  }

  private getGameState(player: Player) {
    return this.gameStateService.getGameState(
      player,
      this.roundService.currentRound,
      this.roundService.currentRoundPhase,
      this.roundService.isFinale,
      this.boardSpaceService.accumulatedSpiceOnBoardSpaces,
    );
  }
}
