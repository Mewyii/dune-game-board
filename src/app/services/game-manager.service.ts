import { Injectable } from '@angular/core';
import { cloneDeep, shuffle } from 'lodash';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { hasCustomAgentEffect, hasCustomRevealEffect } from '../helpers/cards';
import { isActiveFactionType } from '../helpers/faction-types';
import {
  getCardCostModifier,
  getFactionInfluenceModifier,
  getFieldIsBlocked,
  getModifiedCostsForField,
  getModifiedLocationTakeoverTroopCosts,
  getModifiedRewardsForField,
  getTechTileCostModifier,
  hasFactionInfluenceModifier,
} from '../helpers/game-modifiers';
import { isResourceType } from '../helpers/resources';
import {
  getFlattenedEffectRewardArray,
  getMultipliedRewardEffects,
  getRewardArrayAIInfos,
  getStructuredConversionEffectIfPossible,
  isDreadnoughtEffectType,
  isEffectTimingFullfilled,
  isRewardEffect,
  isStructuredConversionEffect,
  playerCanPayCosts,
} from '../helpers/rewards';
import {
  ActionField,
  EffectReward,
  EffectRewardType,
  EffectTimingType,
  FactionType,
  StructuredChoiceEffect,
  StructuredConversionEffect,
} from '../models';
import { IntrigueDeckCard } from '../models/intrigue';
import { Player } from '../models/player';
import { AIManager } from './ai/ai.manager';

import { MatDialog } from '@angular/material/dialog';
import { CardAcquiringPlacementType } from '../constants/board-settings';
import { imperiumCardsGameAdjustments } from '../constants/imperium-cards-game-adjustments';
import { leadersGameAdjustments } from '../constants/leaders-game-adjustments';
import { techTilesGameAdjustments } from '../constants/tech-tiles-game-adjustments';
import { getPlayerCombatStrength, getPlayerGarrisonStrength } from '../helpers/ai';
import { delay } from '../helpers/common';
import { getPlayerPersuasion } from '../helpers/player';
import { playerCanEnterCombat, turnInfosNeedToBeResolved } from '../helpers/turn-infos';
import { GameCommands, GameState } from '../models/ai';
import { StructuredChoiceEffectWithGameElement, StructuredConversionEffectWithGameElement } from '../models/turn-info';
import { AIBoardSpacesService } from './ai/ai-board-spaces.service';
import { AICardsService } from './ai/ai-cards.service';
import { AIConflictService } from './ai/ai-conflict.service';
import { AIPlayersService } from './ai/ai-players.service';
import { AIEffectEvaluationService } from './ai/ai.effect-evaluation.service';
import { AudioManager } from './audio-manager.service';
import { BoardSpaceService } from './board-space.service';
import { CardsService, ImperiumDeckCard, ImperiumRowCard, ImperiumRowPlot } from './cards.service';
import { CombatManager } from './combat-manager.service';
import { ConflictsService } from './conflicts.service';
import { DuneEventsManager } from './dune-events.service';
import { EffectsService } from './game-effects.service';
import { GameModifiersService } from './game-modifier.service';
import { GameStateService } from './game-state.service';
import { IntriguesService } from './intrigues.service';
import { LeaderDeckCard, LeadersService, PlayerLeader } from './leaders.service';
import { LocationManager } from './location-manager.service';
import { LoggingService } from './log.service';
import { NotificationService } from './notification.service';
import { PlayerAgentsService } from './player-agents.service';
import { PlayerResourcesService } from './player-resources.service';
import { PlayerRewardChoicesService } from './player-reward-choices.service';
import { PlayerScoreManager } from './player-score-manager.service';
import { PlayersService } from './players.service';
import { RoundPhaseType, RoundService } from './round.service';
import { SettingsService } from './settings.service';
import { TechTileDeckCard, TechTilesService } from './tech-tiles.service';
import { TranslateService } from './translate-service';
import { TurnInfoService } from './turn-info.service';

export interface BaseGameEffect {
  id: string;
  amount: number;
}

export interface GameEffects {
  imperiumRowCards?: BaseGameEffect;
  spiceAccumulation?: BaseGameEffect;
}

export type GameElement =
  | { type: 'imperium-card'; object: ImperiumDeckCard }
  | { type: 'tech-tile'; object: TechTileDeckCard }
  | { type: 'intrigue'; object: IntrigueDeckCard };

@Injectable({
  providedIn: 'root',
})
export class GameManager {
  private startingPlayerIdSubject = new BehaviorSubject<number>(0);
  startingPlayerId$ = this.startingPlayerIdSubject.asObservable();

  private activePlayerIdSubject = new BehaviorSubject<number>(0);
  activePlayerId$ = this.activePlayerIdSubject.asObservable();
  activePlayer$ = combineLatest([this.activePlayerIdSubject.asObservable(), this.playersService.players$]).pipe(
    map(([activePlayerId, players]) => players.find((player) => player.id === activePlayerId)),
  );

  constructor(
    private playerScoreManager: PlayerScoreManager,
    private playersService: PlayersService,
    private combatManager: CombatManager,
    private locationManager: LocationManager,
    private loggingService: LoggingService,
    private leadersService: LeadersService,
    private conflictsService: ConflictsService,
    private techTilesService: TechTilesService,
    private audioManager: AudioManager,
    private settingsService: SettingsService,
    private cardsService: CardsService,
    private gameModifiersService: GameModifiersService,
    private playerRewardChoicesService: PlayerRewardChoicesService,
    private t: TranslateService,
    private intriguesService: IntriguesService,
    private turnInfoService: TurnInfoService,
    private notificationService: NotificationService,
    private playerAgentsService: PlayerAgentsService,
    private playersResourcesService: PlayerResourcesService,
    private gameStateService: GameStateService,
    private boardSpaceService: BoardSpaceService,
    private roundService: RoundService,
    private effectsService: EffectsService,
    private duneEventsManager: DuneEventsManager,
    private aiManager: AIManager,
    private aiPlayersService: AIPlayersService,
    private aiBoardSpacesService: AIBoardSpacesService,
    private aiCardsService: AICardsService,
    private aIConflictService: AIConflictService,
    private effectEvaluationService: AIEffectEvaluationService,
    private dialog: MatDialog,
  ) {
    const startingPlayerIdString = localStorage.getItem('startingPlayerId');
    if (startingPlayerIdString) {
      const startingPlayerId = JSON.parse(startingPlayerIdString) as number;
      this.startingPlayerIdSubject.next(startingPlayerId);
    }

    const activePlayerIdString = localStorage.getItem('activePlayerId');
    if (activePlayerIdString) {
      const activePlayerId = JSON.parse(activePlayerIdString) as number;
      this.activePlayerIdSubject.next(activePlayerId);
    }

    this.startingPlayerId$.subscribe((startingPlayerId) => {
      localStorage.setItem('startingPlayerId', JSON.stringify(startingPlayerId));
    });

    this.activePlayerId$.subscribe((activePlayerId) => {
      localStorage.setItem('activePlayerId', JSON.stringify(activePlayerId));
    });
  }

  get startingPlayerId() {
    return cloneDeep(this.startingPlayerIdSubject.value);
  }

  get activePlayerId() {
    return cloneDeep(this.activePlayerIdSubject.value);
  }

  getActivePlayer() {
    return this.playersService.getPlayer(this.activePlayerId);
  }

  startGame() {
    this.loggingService.clearLogs();
    this.audioManager.playSound('atmospheric');
    this.gameModifiersService.resetAllPlayerGameModifiers();
    const newPlayers = this.playersService.resetPlayers();
    this.combatManager.resetAdditionalCombatPower();
    this.combatManager.deleteAllPlayerTroopsFromCombat();
    this.combatManager.resetAllPlayerShips();
    this.combatManager.setInitialPlayerCombatUnits(newPlayers);
    this.locationManager.resetLocationOwners();
    this.playerRewardChoicesService.resetPlayerRewardChoices();
    this.playerAgentsService.deleteAllPlayerAgents();

    this.playerScoreManager.resetPlayersScores(newPlayers);
    this.playersResourcesService.resetPlayerResources(newPlayers);
    this.playerScoreManager.resetPlayerAlliances();
    this.boardSpaceService.resetAccumulatedSpiceOnBoardSpaces();

    this.cardsService.setLimitedCustomCards();
    this.cardsService.setUnlimitedCustomCards();

    if (this.settingsService.getUseTechtiles() && this.settingsService.getUseDreadnoughts()) {
      this.cardsService.createImperiumDeck();
      this.techTilesService.createTechTileDeck();
      this.intriguesService.createIntrigueDeck();
    } else if (this.settingsService.getUseTechtiles()) {
      this.techTilesService.createTechTileDeck(
        (card) =>
          !card.buyEffects?.some((x) => isDreadnoughtEffectType(x.type)) &&
          !card.effects?.some((x) => isDreadnoughtEffectType(x.type)),
      );

      this.cardsService.createImperiumDeck(
        (card) =>
          !card.buyEffects?.some((x) => isDreadnoughtEffectType(x.type)) &&
          !card.agentEffects?.some((x) => isDreadnoughtEffectType(x.type)) &&
          !card.revealEffects?.some((x) => isDreadnoughtEffectType(x.type)),
      );
      this.intriguesService.createIntrigueDeck(
        (card) =>
          !card.plotEffects?.some((x) => isDreadnoughtEffectType(x.type)) &&
          !card.combatEffects?.some((x) => isDreadnoughtEffectType(x.type)),
      );
    } else if (this.settingsService.getUseDreadnoughts()) {
      this.cardsService.createImperiumDeck(
        (card) =>
          !card.buyEffects?.some((x) => x.type === 'tech') &&
          !card.agentEffects?.some((x) => x.type === 'tech') &&
          !card.revealEffects?.some((x) => x.type === 'tech'),
      );
      this.intriguesService.createIntrigueDeck(
        (card) => !card.plotEffects?.some((x) => x.type === 'tech') && !card.combatEffects?.some((x) => x.type === 'tech'),
      );
    } else {
      this.cardsService.createImperiumDeck(
        (card) =>
          !card.buyEffects?.some((x) => x.type === 'tech' || isDreadnoughtEffectType(x.type)) &&
          !card.agentEffects?.some((x) => x.type === 'tech' || isDreadnoughtEffectType(x.type)) &&
          !card.revealEffects?.some((x) => x.type === 'tech' || isDreadnoughtEffectType(x.type)),
      );
      this.intriguesService.createIntrigueDeck(
        (card) =>
          !card.plotEffects?.some((x) => x.type === 'tech' || isDreadnoughtEffectType(x.type)) &&
          !card.combatEffects?.some((x) => x.type === 'tech' || isDreadnoughtEffectType(x.type)),
      );
    }

    this.cardsService.setInitialPlayerDecks();

    this.aiPlayersService.setAIPlayers(newPlayers);
    this.leadersService.createLeaderDeck();
    this.leadersService.assignRandomLeadersToPlayers(newPlayers);
    this.conflictsService.createConflictDeck();
    if (this.settingsService.getConflictsMode() === 'random') {
      this.conflictsService.setNextConflict();
    }

    this.roundService.resetRound();
    this.roundService.setRoundPhase('select leaders');
    this.startingPlayerIdSubject.next(1);
    this.activePlayerIdSubject.next(1);

    for (const player of newPlayers) {
      this.playerAgentsService.addPlayerAgents(player.id, player.agents);
      this.cardsService.drawPlayerCardsFromDeck(player.id, player.cardsDrawnAtRoundStart);

      if (player.isAI) {
        if (this.aiPlayersService.aiDifficulty === 'hard') {
          this.effectsService.addRewardToPlayer(player.id, { type: 'victory-point' });
        }
      }
    }

    this.turnInfoService.resetTurnInfos();

    if (this.settingsService.eventsEnabled) {
      this.duneEventsManager.setEventDeck();

      const event = this.duneEventsManager.getCurrentEvent();
      if (event) {
        const players = this.playersService.getPlayers();
        if (event.gameEffects) {
          this.resolveGameEffects(event.gameEffects);
        }

        for (const player of players) {
          if (event.gameModifiers) {
            this.gameModifiersService.addPlayerGameModifiers(player.id, event.gameModifiers);
          }
          if (event.immediatePlayerEffects) {
            const gameState = this.getGameState(player);
            this.effectsService.resolveStructuredEffects(event.immediatePlayerEffects, player, gameState);
          }
        }
      }
    }
  }

  beginPlay() {
    this.audioManager.playSound('fog');
    this.roundService.setFirstRound();
    this.roundService.setRoundPhase('agent-placement');

    for (const player of this.playersService.getPlayers()) {
      this.resolveLeaderEffects(player, 'timing-game-start');
      this.resolveLeaderEffects(player, 'timing-round-start', true);
    }

    this.playersService.increaseTurnNumberForPlayer(1);
    this.activePlayerIdSubject.next(1);
    const player = this.playersService.getPlayer(1);
    if (player?.isAI) {
      this.setActiveAIPlayer(this.startingPlayerId);
      this.aiManager.setPreferredFieldsForAIPlayer(player);
    }
  }

  resolveConflict() {
    const conflict = this.conflictsService.currentConflict;
    if (!conflict) {
      return;
    }
    this.audioManager.playSound('fog');

    let playerCombatScores = this.combatManager.getPlayerCombatScores().filter((x) => x.score > 0);
    playerCombatScores.sort((a, b) => b.score - a.score);

    const conflictRewards = conflict.rewards;

    let previousWasTie = false;
    let isFirstCycle = true;

    for (const conflictReward of conflictRewards) {
      const firstPlayer = playerCombatScores[0];
      if (!firstPlayer || firstPlayer.score < 1) {
        break;
      }

      const playersWithSameScore = playerCombatScores.filter((x) => x.score === firstPlayer.score);
      const isTie = playersWithSameScore.length > 1;

      if (previousWasTie) {
        for (const playerScore of playersWithSameScore) {
          const player = this.playersService.getPlayer(playerScore.playerId);
          if (player) {
            for (const reward of conflictReward) {
              this.effectsService.addRewardToPlayer(player.id, reward, { source: 'Combat' });
            }

            this.resolveRewardChoices(player);

            playerCombatScores = playerCombatScores.filter((x) => x.playerId !== playerScore.playerId);
          }
        }

        previousWasTie = false;
      } else if (!isTie) {
        const player = this.playersService.getPlayer(firstPlayer.playerId);

        if (player) {
          for (const reward of conflictReward) {
            this.effectsService.addRewardToPlayer(player.id, reward, { source: 'Combat' });
          }

          this.resolveRewardChoices(player);

          if (isFirstCycle) {
            const dreadnoughtCount = this.combatManager.getPlayerCombatUnits(player.id)?.shipsInCombat;
            if (dreadnoughtCount && dreadnoughtCount > 0) {
              if (!player.isAI) {
                this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
                  type: 'location-control-choice',
                  amount: dreadnoughtCount,
                });
              } else {
                for (let i = 0; i < dreadnoughtCount; i++) {
                  const updatedGameState = this.getGameState(player);
                  const desiredLocation = this.aiBoardSpacesService.getLocationToControl(player, updatedGameState);
                  if (desiredLocation) {
                    this.changeLocationOwner(desiredLocation.actionField.title.en, player.id);
                  }
                }
              }
            }

            const otherPlayersScoresCombined = playerCombatScores.slice(1).reduce((sum, x) => sum + x.score, 0);

            if (firstPlayer.score > otherPlayersScoresCombined) {
              const returnedTroops = Math.floor((firstPlayer.score - otherPlayersScoresCombined) / 2);
              this.combatManager.addPlayerTroopsToGarrison(player.id, returnedTroops);
            }

            this.loggingService.logPlayerWonCombat(player.id, this.roundService.currentRound);
          }
        }

        playerCombatScores = playerCombatScores.filter((x) => x.playerId !== firstPlayer.playerId);
      } else {
        previousWasTie = true;
      }
      isFirstCycle = false;
    }

    this.roundService.setRoundPhase('combat-resolvement');

    for (const player of this.playersService.getPlayers()) {
      if (player.isAI) {
        this.aiManager.aiHealLeadersIfUsefulAndPossible(player.id, 'combat-resolvement');
      }
    }
  }

  async setNextRound() {
    this.audioManager.playSound('ping');
    this.gameModifiersService.removeTemporaryGameModifiers();

    this.boardSpaceService.accumulateSpiceOnBoardSpaces();
    this.playerAgentsService.resetPlayerAgents();
    this.combatManager.setAllPlayerShipsFromTimeoutToGarrison();
    this.combatManager.setAllPlayerShipsFromCombatToTimeout();
    this.combatManager.deleteAllPlayerTroopsFromCombat();
    this.combatManager.resetAdditionalCombatPower();
    this.playersService.resetPersuasionForPlayers();
    this.playersService.resetTurnStateForPlayers();
    this.playersService.resetTurnNumberForPlayers();

    if (this.settingsService.getConflictsMode() === 'random') {
      this.conflictsService.setNextConflict();
    } else {
      this.conflictsService.resetCurrentConflict();
    }

    if (this.shouldTriggerFinale()) {
      this.roundService.setFinale(true);
    }

    this.roundService.setNextRound();
    this.roundService.setRoundPhase('agent-placement');

    this.startingPlayerIdSubject.next(
      this.playersService.getPlayerCount() > this.startingPlayerId ? this.startingPlayerId + 1 : 1,
    );

    this.activePlayerIdSubject.next(this.startingPlayerId);
    this.playersService.increaseTurnNumberForPlayer(this.startingPlayerId);

    if (this.settingsService.getChurnRowCards()) {
      this.cardsService.churnAndClearImperiumRow();
    }
    this.cardsService.discardAllPlayerHandCards();
    this.cardsService.shufflePlayerDiscardPilesUnderDecks();

    this.techTilesService.unFlipTechTiles();

    this.turnInfoService.resetTurnInfos();

    const nextEvent = this.duneEventsManager.setNextEvent();
    if (nextEvent && nextEvent.gameEffects) {
      this.resolveGameEffects(nextEvent.gameEffects);
    }

    const players = this.playersService.getPlayers();
    for (const player of players) {
      if (nextEvent) {
        if (nextEvent.gameModifiers) {
          this.gameModifiersService.addPlayerGameModifiers(player.id, nextEvent.gameModifiers);
        }
        if (nextEvent.immediatePlayerEffects) {
          const gameState = this.getGameState(player);
          this.effectsService.resolveStructuredEffects(nextEvent.immediatePlayerEffects, player, gameState);
        }
      }

      const playerLeader = this.leadersService.getLeader(player.id);
      if (playerLeader?.structuredPassiveEffects) {
        const gameState = this.getGameState(player);
        this.effectsService.resolveStructuredEffects(playerLeader.structuredPassiveEffects, player, gameState);
      }

      this.resolveRewardChoices(player);
    }

    for (const player of this.playersService.getPlayers()) {
      this.cardsService.drawPlayerCardsFromDeck(player.id, player.cardsDrawnAtRoundStart);

      if (player.id === this.startingPlayerId) {
        this.resolveLeaderEffects(player, 'timing-round-start');
        await this.resolveTechTileEffects(player, 'timing-round-start');

        if (player.isAI) {
          this.setActiveAIPlayer(this.startingPlayerId);
          this.aiManager.setPreferredFieldsForAIPlayer(player);
        }
      }
    }
  }

  finishGame() {
    this.audioManager.playSound('atmospheric');
    this.playerAgentsService.resetPlayerAgents();
    this.combatManager.resetAdditionalCombatPower();
    this.loggingService.printLogs();
    this.roundService.resetRound();
    this.roundService.setRoundPhase('none');
    this.startingPlayerIdSubject.next(0);
    this.activePlayerIdSubject.next(0);
    this.setActiveAIPlayer(0);
    this.duneEventsManager.resetEventDeck();
    this.leadersService.resetLeaders();
    this.conflictsService.resetConflicts();
    this.cardsService.resetPlayerHandCards();
    this.cardsService.resetPlayerPlots();
    this.cardsService.resetPlayerTrashPiles();
    this.cardsService.resetImperiumRowCards();
    this.techTilesService.resetTechTileDeck();

    this.roundService.setFinale(false);
  }

  async setPlayerRevealTurn(playerId: number) {
    const player = this.playersService.getPlayer(playerId);

    if (!player) {
      return;
    }

    this.playersService.setTurnStateForPlayer(playerId, 'reveal');

    const playerLocations = this.locationManager.getPlayerLocations(playerId);
    for (const playerLocation of playerLocations) {
      const field = this.settingsService.getBoardField(playerLocation.locationId);
      if (field && field.ownerReward) {
        this.effectsService.addRewardToPlayer(player.id, field.ownerReward);
      }
    }

    const playerHand = this.cardsService.getPlayerHand(playerId);
    if (playerHand) {
      for (const card of playerHand.cards) {
        this.resolveImperiumCardEffects(card, player, 'timing-reveal-turn');
      }
    }

    this.resolveLeaderEffects(player, 'timing-reveal-turn');
    await this.resolveTechTileEffects(player, 'timing-reveal-turn');

    this.resolveRewardChoices(player);
  }

  playerPassedConflict(playerId: number) {
    this.playersService.setTurnStateForPlayer(playerId, 'done');
  }

  addAgentToField(field: ActionField) {
    const activePlayer = this.getActivePlayer();

    if (
      this.roundService.currentRoundPhase !== 'agent-placement' ||
      !activePlayer ||
      activePlayer.turnState !== 'agent-placement'
    ) {
      this.notificationService.showWarning(this.t.translate('playerboardWarningNotAgentTurnPhase'));
      return;
    }

    const playerCard = this.cardsService.getPlayedPlayerCard(activePlayer.id);
    if (!playerCard) {
      this.notificationService.showWarning(this.t.translate('playerboardWarningCardNeededToPlaceAgent'));
      return;
    }

    const playedCard = this.cardsService.getPlayerHandCard(activePlayer.id, playerCard.cardId);

    if (!playedCard || !playedCard.fieldAccess?.some((x) => x === field.actionType)) {
      this.notificationService.showWarning(this.t.translate('playerboardWarningCardNeedsToHaveFieldAccess'));
      return;
    }

    const activePlayerAgentCount = this.playerAgentsService.getAvailablePlayerAgentCount(activePlayer.id);
    if (activePlayerAgentCount < 1) {
      this.notificationService.showWarning(this.t.translate('playerboardWarningNoAgentsLeft'));
      return;
    }

    const playerTurnInfo = this.turnInfoService.getPlayerTurnInfos(activePlayer.id);
    const agentAlreadyPlacedThisTurn = playerTurnInfo?.agentPlacedOnFieldId;
    if (agentAlreadyPlacedThisTurn) {
      this.notificationService.showWarning(this.t.translate('playerboardWarningAgentAlreadyPlacedThisTurn'));
      return;
    }

    const playerNeedsToPassTurn = playerTurnInfo?.needsToPassTurn;
    if (playerNeedsToPassTurn) {
      this.notificationService.showWarning(this.t.translate('playerboardWarningNeedToPassTurn'));
      return;
    }

    const gameModifiers = this.gameModifiersService.getPlayerGameModifiers(activePlayer.id);

    if (getFieldIsBlocked(field, gameModifiers?.fieldBlock)) {
      this.notificationService.showWarning(this.t.translate('playerboardWarningFieldIsBlocked'));
      return;
    }

    const fieldCosts = getModifiedCostsForField(field, gameModifiers?.fieldCost);

    if (fieldCosts) {
      if (!playerCanPayCosts(fieldCosts, activePlayer, this.getGameState(activePlayer))) {
        this.notificationService.showWarning(this.t.translate('playerboardWarningNotEnoughResources'));
        return;
      }

      for (let cost of fieldCosts) {
        if (isResourceType(cost.type)) {
          this.playersResourcesService.removeResourceFromPlayer(activePlayer.id, cost.type, cost.amount ?? 1);
        }
      }
    }

    this.audioManager.playSound('click');

    this.setPlayerAgentOnField(activePlayer.id, field);

    const fieldRewards = getModifiedRewardsForField(field, gameModifiers?.fieldReward);

    const { rewardOptionIndex, hasRewardChoice: hasRewardOptions } = getRewardArrayAIInfos(fieldRewards);
    let rewards: EffectReward[] = [];
    let rewardOptionLeft: EffectReward | undefined = undefined;
    let rewardOptionRight: EffectReward | undefined = undefined;

    if (hasRewardOptions) {
      for (const [index, reward] of fieldRewards.entries()) {
        if (isRewardEffect(reward)) {
          if (index === rewardOptionIndex - 1) {
            rewardOptionLeft = reward;
          } else if (index === rewardOptionIndex + 1) {
            rewardOptionRight = reward;
          } else {
            rewards.push(reward);
          }
        }
      }
    } else {
      rewards = fieldRewards as EffectReward[];
    }

    for (const reward of getFlattenedEffectRewardArray(rewards)) {
      this.effectsService.addRewardToPlayer(activePlayer.id, reward);

      if (reward.type === 'spice-accumulation' && this.boardSpaceService.boardSpaceHasAccumulatedSpice(field.title.en)) {
        const accumulatedSpice = this.boardSpaceService.getAccumulatedSpiceForBoardSpace(field.title.en);
        this.effectsService.addRewardToPlayer(activePlayer.id, { type: 'spice', amount: accumulatedSpice });
        this.boardSpaceService.resetAccumulatedSpiceOnBoardSpace(field.title.en);
      }
    }

    if (isActiveFactionType(field.actionType)) {
      if (hasFactionInfluenceModifier(gameModifiers, field.actionType)) {
        const factionInfluenceModifier = getFactionInfluenceModifier(gameModifiers, field.actionType);
        if (factionInfluenceModifier) {
          if (factionInfluenceModifier.noInfluence) {
            if (factionInfluenceModifier.alternateReward) {
              this.effectsService.addRewardToPlayer(activePlayer.id, factionInfluenceModifier.alternateReward);
            }
          }
        }
      } else {
        this.audioManager.playSound('influence');
        const factionRewards = this.playerScoreManager.addFactionScore(
          activePlayer.id,
          field.actionType,
          1,
          this.roundService.currentRound,
        );

        for (const reward of factionRewards) {
          this.effectsService.addRewardToPlayer(activePlayer.id, reward);
        }
      }
    }

    if (!activePlayer.isAI) {
      if (hasRewardOptions && rewardOptionLeft && rewardOptionRight) {
        this.turnInfoService.updatePlayerTurnInfo(activePlayer.id, {
          effectChoices: [
            {
              type: 'helper-or',
              effectLeft: { type: 'reward', effectRewards: [rewardOptionLeft] },
              effectRight: { type: 'reward', effectRewards: [rewardOptionRight] },
            },
          ],
        });
      }
      if (field.conversionOptions) {
        const exclusiveID = crypto.randomUUID();
        for (const option of field.conversionOptions) {
          const [_, conversionEffect] = getStructuredConversionEffectIfPossible(option);
          if (conversionEffect) {
            this.turnInfoService.updatePlayerTurnInfo(activePlayer.id, {
              effectConversions: [
                {
                  type: 'helper-trade',
                  effectCosts: conversionEffect.effectCosts,
                  effectConversions: conversionEffect.effectConversions,
                  exlusiveChoiceOfMultipleEffectsId: exclusiveID,
                },
              ],
            });
          }
        }
      }
    } else if (activePlayer.isAI) {
      const aiPlayer = this.aiPlayersService.getAIPlayer(activePlayer.id);

      if (activePlayer && aiPlayer) {
        if (hasRewardOptions && rewardOptionLeft && rewardOptionRight) {
          const aiDecision = this.aiBoardSpacesService.getFieldDecision(activePlayer.id, field.title.en);
          if (rewardOptionLeft.type.includes(aiDecision)) {
            this.effectsService.addRewardToPlayer(activePlayer.id, rewardOptionLeft, { source: 'Board Space' });
          } else {
            this.effectsService.addRewardToPlayer(activePlayer.id, rewardOptionRight, { source: 'Board Space' });
          }
        }

        if (field.conversionOptions) {
          const gameState = this.getGameState(activePlayer);
          const conversionEffects: StructuredConversionEffect[] = [];
          for (const conversionOption of field.conversionOptions) {
            const [_, conversionEffect] = getStructuredConversionEffectIfPossible(conversionOption);
            if (conversionEffect) {
              const costEffects = getMultipliedRewardEffects(conversionEffect.effectCosts, gameState);
              if (playerCanPayCosts(costEffects, activePlayer, gameState)) {
                conversionEffects.push(conversionEffect);
              }
            }
          }

          this.aiManager.aiPickAndConvertRewardsIfUsefulAndPossible(conversionEffects, activePlayer, gameState);
        }
      }
    }

    this.resolveImperiumCardEffects(playedCard, activePlayer, 'timing-agent-placement');

    this.resolveRewardChoices(activePlayer);

    this.turnInfoService.updatePlayerTurnInfo(activePlayer.id, { fieldsVisitedThisTurn: [field] });
    this.loggingService.logAgentAction(field);
  }

  private setPlayerAgentOnField(playerId: number, field: ActionField) {
    this.playerAgentsService.setPlayerAgentOnField(playerId, field.title.en);

    this.turnInfoService.setPlayerTurnInfo(playerId, { agentPlacedOnFieldId: field.title.en });

    this.loggingService.logPlayerSentAgentToField(playerId, this.t.translateLS(field.title));
  }

  async endPlayerTurn(playerId: number) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    if (this.roundService.currentRoundPhase === 'agent-placement') {
      if (player.turnState === 'agent-placement') {
        this.cardsService.discardPlayedPlayerCard(this.activePlayerId);
      } else if (player.turnState === 'reveal') {
        const playerHand = this.cardsService.getPlayerHand(player.id);
        if (playerHand && playerHand.cards) {
          this.cardsService.discardPlayerHandCards(player.id);
          this.playersService.setTurnStateForPlayer(player.id, 'revealed');
        }
      }
    }

    this.turnInfoService.clearPlayerTurnInfo(playerId);

    await this.setNextPlayerTurn();
  }

  async setNextPlayerTurn() {
    const players = this.playersService.getPlayers();
    const nextPlayer = players.find((x) => x.id > this.activePlayerId) ?? players[0];
    if (nextPlayer) {
      this.activePlayerIdSubject.next(nextPlayer.id);

      if (this.roundService.currentRoundPhase === 'agent-placement') {
        this.playersService.increaseTurnNumberForPlayer(nextPlayer.id);
      }
      this.setActiveAIPlayer(nextPlayer.id);
      if (nextPlayer.isAI && this.roundService.currentRoundPhase === 'agent-placement') {
        this.aiManager.setPreferredFieldsForAIPlayer(nextPlayer);
        this.resolveLeaderEffects(nextPlayer, 'timing-round-start');
        await this.resolveTechTileEffects(nextPlayer, 'timing-round-start');
      }
    }
  }

  setRoundState(turnPhase: RoundPhaseType) {
    if (turnPhase === 'combat') {
      this.audioManager.playSound('conflict');
    }
    this.roundService.setRoundPhase(turnPhase);
  }

  setRoundStateToCombat() {
    this.setRoundState('combat');

    const players = this.playersService.getPlayers();
    for (const player of players) {
      const playerIntrigues = this.intriguesService.getPlayerIntrigues(player.id);
      if (!playerIntrigues || playerIntrigues.length < 1) {
        this.playersService.setTurnStateForPlayer(player.id, 'done');
      }
    }
  }

  setAIActiveForPlayer(player: Player, active: boolean) {
    this.audioManager.playSound('tech-tile');

    this.playersService.setAIActiveForPlayer(player.id, active);
    if (active) {
      this.aiPlayersService.addAIPlayer(player.id);
      if (this.roundService.currentRound > 0) {
        this.aiManager.setPreferredFieldsForAIPlayer(player);
      }
    } else {
      this.aiPlayersService.removeAIPlayer(player.id);
    }
    this.aiPlayersService.setActiveAIPlayerId(player.id);
  }

  setActiveAIPlayer(playerId: number) {
    this.aiPlayersService.setActiveAIPlayerId(playerId);
  }

  changeLocationOwner(locationId: string, playerId: number) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const playerAgentsOnFields = this.playerAgentsService.getPlayerAgentsOnFields(playerId).map((x) => x.fieldId);
    if (playerAgentsOnFields.some((x) => x === locationId)) {
      const playerLocation = this.locationManager.getPlayerLocation(locationId);
      if (playerLocation?.playerId === playerId) {
        return;
      }

      let takeOverFromEnemy = false;

      if (playerLocation && playerLocation.playerId !== playerId) {
        takeOverFromEnemy = true;
      }

      if (playerLocation && takeOverFromEnemy) {
        const location = this.settingsService.getBoardField(locationId);
        const effectiveTakeOverTroopCosts = getModifiedLocationTakeoverTroopCosts(
          this.settingsService.getLocationTakeoverTroopCosts(),
          location,
          this.gameModifiersService.getPlayerGameModifier(playerId, 'locationTakeoverTroopCosts'),
        );

        const troopsInGarrison = this.combatManager.getPlayerTroopsInGarrison(playerId);

        if (troopsInGarrison < effectiveTakeOverTroopCosts) {
          return;
        }

        if (effectiveTakeOverTroopCosts > 0) {
          this.effectsService.payCostForPlayer(playerId, { type: 'loose-troop', amount: effectiveTakeOverTroopCosts });
        }

        this.effectsService.payCostForPlayer(
          playerLocation.playerId,
          { type: 'victory-point' },
          { source: 'Location-Loss' },
        );
        this.loggingService.logPlayerLostLocationControl(
          playerLocation.playerId,
          this.roundService.currentRound,
          locationId,
        );
      }
      const locationControlChoice = this.playerRewardChoicesService.getPlayerRewardChoice(
        playerId,
        'location-control-choice',
      );
      if (locationControlChoice) {
        this.playerRewardChoicesService.removePlayerRewardChoice(playerId, locationControlChoice.id);
      }

      this.audioManager.playSound('location-control');

      this.locationManager.setLocationOwner(locationId, playerId);
      this.effectsService.addRewardToPlayer(player.id, { type: 'victory-point' }, { source: 'Location' });
      this.loggingService.logPlayerGainedLocationControl(playerId, this.roundService.currentRound, locationId);
    }
  }

  playPlayerIntrigue(playerId: number, intrigue: IntrigueDeckCard) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const roundPhase = this.roundService.currentRoundPhase;
    if (roundPhase !== 'agent-placement' && roundPhase !== 'combat') {
      this.notificationService.showWarning(this.t.translate('intrigueWarningCombatWrongRoundPhase'));
      return;
    }

    if (intrigue.type === 'complot' && roundPhase !== 'agent-placement') {
      this.notificationService.showWarning(this.t.translate('intrigueWarningComplotWrongRoundPhase'));
      return;
    }
    if (intrigue.type === 'combat' && roundPhase !== 'combat') {
      this.notificationService.showWarning(this.t.translate('intrigueWarningCombatWrongRoundPhase'));
      return;
    }

    if (roundPhase === 'agent-placement') {
      this.effectsService.resolveStructuredEffects(intrigue.structuredPlotEffects, player, this.getGameState(player), {
        type: 'intrigue',
        object: intrigue,
      });
    }
    if (roundPhase === 'combat') {
      this.effectsService.resolveStructuredEffects(intrigue.structuredCombatEffects, player, this.getGameState(player), {
        type: 'intrigue',
        object: intrigue,
      });
    }

    this.resolveRewardChoices(player);

    this.intriguesService.trashPlayerIntrigue(playerId, intrigue.id);
    this.loggingService.logPlayerPlayedIntrigue(playerId, this.t.translateLS(intrigue.name));
    this.turnInfoService.updatePlayerTurnInfo(playerId, { intriguesPlayedThisTurn: [intrigue] });
  }

  trashPlayerIntrigue(playerId: number, intrigue: IntrigueDeckCard) {
    const intrigueTrashTodo = this.playerRewardChoicesService.getPlayerRewardChoice(playerId, 'intrigue-trash');
    if (intrigueTrashTodo) {
      this.playerRewardChoicesService.removePlayerRewardChoice(playerId, intrigueTrashTodo.id);
    }

    this.intriguesService.trashPlayerIntrigue(this.activePlayerId, intrigue.id);
    this.loggingService.logPlayerTrashedIntrigue(playerId, this.t.translateLS(intrigue.name));
  }

  increasePlayerFactionScore(playerId: number, factionType: FactionType) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }
    const influenceUpChoiceTodo = this.playerRewardChoicesService.getPlayerRewardChoice(
      playerId,
      'faction-influence-up-choice',
    );
    if (influenceUpChoiceTodo) {
      this.playerRewardChoicesService.removePlayerRewardChoice(playerId, influenceUpChoiceTodo.id);
    }

    this.effectsService.addRewardToPlayer(playerId, {
      type: ('faction-influence-up-' + factionType) as EffectRewardType,
    });

    this.aiManager.setPreferredFieldsForAIPlayer(player);
  }

  decreasePlayerFactionScore(playerId: number, factionType: FactionType) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const influenceDownChoiceTodo = this.playerRewardChoicesService.getPlayerRewardChoice(
      playerId,
      'faction-influence-down-choice',
    );
    if (influenceDownChoiceTodo) {
      this.playerRewardChoicesService.removePlayerRewardChoice(playerId, influenceDownChoiceTodo.id);
    }

    this.effectsService.addRewardToPlayer(playerId, {
      type: ('faction-influence-down-' + factionType) as EffectRewardType,
    });

    this.aiManager.setPreferredFieldsForAIPlayer(player);
  }

  addUnitsIntoCombat(playerId: number, unitType: 'troop' | 'dreadnought', amount: number) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }
    const currentConflict = this.conflictsService.currentConflict;
    if (!currentConflict) {
      this.turnInfoService.setPlayerTurnInfo(playerId, { needsToPickConflict: true });
      this.resolveRewardChoices(player);
    }

    this.effectsService.addUnitsToCombatIfPossible(playerId, unitType, amount);
  }

  pickCurrentConflict(playerId: number, conflictId: string) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const conflictChoice = this.playerRewardChoicesService.getPlayerRewardChoices(playerId)?.conflictChoice;
    if (conflictChoice) {
      this.playerRewardChoicesService.removePlayerConflictChoice(playerId);
    }

    this.conflictsService.setCurrentConflict(conflictId);
  }

  private resolveImperiumCardEffects(card: ImperiumDeckCard, player: Player, timing: EffectTimingType) {
    if (timing === 'timing-agent-placement') {
      if (card.structuredAgentEffects) {
        const gameState = this.getGameState(player);

        this.effectsService.resolveStructuredEffects(card.structuredAgentEffects, player, gameState, {
          type: 'imperium-card',
          object: card,
        });
      }
      if (hasCustomAgentEffect(card)) {
        const customEffects = imperiumCardsGameAdjustments.find((x) => x.id === card.name.en);
        if (customEffects?.customAgentFunction) {
          const gameState = this.getGameState(player);
          const updatedPlayer = this.playersService.getPlayer(player.id);
          if (updatedPlayer) {
            customEffects.customAgentFunction(updatedPlayer, gameState, this.getUsableGameCommands(), {
              type: 'imperium-card',
              object: card,
            });
          }
        } else if (player.isAI && customEffects?.customAgentAIFunction) {
          const gameState = this.getGameState(player);
          const updatedPlayer = this.playersService.getPlayer(player.id);
          if (updatedPlayer) {
            customEffects.customAgentAIFunction(updatedPlayer, gameState, this.getUsableGameCommands(), {
              type: 'imperium-card',
              object: card,
            });
          }
        } else {
          const localizedString = this.t.translateLS(card.customAgentEffect);
          this.playerRewardChoicesService.addPlayerCustomChoice(player.id, localizedString);
        }
      }
    } else if (timing === 'timing-reveal-turn') {
      if (card.structuredRevealEffects) {
        const gameState = this.getGameState(player);

        this.effectsService.resolveStructuredEffects(card.structuredRevealEffects, player, gameState, {
          type: 'imperium-card',
          object: card,
        });
      }
      if (hasCustomRevealEffect(card)) {
        const customEffects = imperiumCardsGameAdjustments.find((x) => x.id === card.name.en);
        if (customEffects?.customRevealFunction) {
          const gameState = this.getGameState(player);
          const updatedPlayer = this.playersService.getPlayer(player.id);
          if (updatedPlayer) {
            customEffects.customRevealFunction(updatedPlayer, gameState, this.getUsableGameCommands(), {
              type: 'imperium-card',
              object: card,
            });
          }
        } else if (player.isAI && customEffects?.customRevealAIFunction) {
          const gameState = this.getGameState(player);
          const updatedPlayer = this.playersService.getPlayer(player.id);
          if (updatedPlayer) {
            customEffects.customRevealAIFunction(updatedPlayer, gameState, this.getUsableGameCommands(), {
              type: 'imperium-card',
              object: card,
            });
          }
        } else {
          const localizedString = this.t.translateLS(card.customRevealEffect);
          this.playerRewardChoicesService.addPlayerCustomChoice(player.id, localizedString);
        }
      }
    }

    this.resolveRewardChoices(player);
  }

  private resolveLeaderEffects(player: Player, timing: EffectTimingType, ignoreStructuredEffects = false) {
    let effectsResolved = false;

    const playerLeader = this.leadersService.getPlayerLeader(player.id);
    const leader = playerLeader?.leader;
    if (!leader || playerLeader?.isFlipped) {
      return;
    }

    if (leader.customTimedFunctions) {
      for (const customTimedFunction of leader.customTimedFunctions) {
        if (customTimedFunction.timing == timing) {
          const gameState = this.getGameState(player);
          const updatedPlayer = this.playersService.getPlayer(player.id);
          if (updatedPlayer) {
            customTimedFunction.function(updatedPlayer, gameState, this.getUsableGameCommands());
            effectsResolved = true;
          }
        }
      }
    }

    if (!player.isAI) {
      if (!ignoreStructuredEffects) {
        const effects = leader.structuredPassiveEffects;
        if (effects) {
          for (const effect of effects) {
            if (effect.type === 'reward') {
              const gameState = this.getGameState(player);
              this.effectsService.resolveStructuredEffect(effect, player, gameState, undefined);
              effectsResolved = true;
            }
          }
        }
      }
    }

    if (player.isAI) {
      if (!ignoreStructuredEffects && leader.structuredPassiveEffects) {
        const gameState = this.getGameState(player);
        const updatedPlayer = this.playersService.getPlayer(player.id);
        if (updatedPlayer) {
          this.effectsService.resolveStructuredEffects(leader.structuredPassiveEffects, updatedPlayer, gameState);
          effectsResolved = true;
        }
      }

      if (leader.customTimedAIFunctions) {
        for (const customTimedAIFunction of leader.customTimedAIFunctions) {
          if (customTimedAIFunction.timing == timing) {
            const gameState = this.getGameState(player);
            const updatedPlayer = this.playersService.getPlayer(player.id);
            if (updatedPlayer) {
              customTimedAIFunction.function(updatedPlayer, gameState, this.getUsableGameCommands());
              effectsResolved = true;
            }
          }
        }
      }
    }

    this.resolveRewardChoices(player);
    return effectsResolved;
  }

  private async resolveTechTileEffects(player: Player, timing: EffectTimingType) {
    let effectsResolved = false;

    const playerTechTiles = this.techTilesService.getPlayerTechTiles(player.id);
    for (const playerTechTile of playerTechTiles) {
      const techTile = playerTechTile.techTile;

      if (!playerTechTile.isFlipped) {
        const customEffects = techTilesGameAdjustments.find((x) => x.id === techTile.name.en);

        if (techTile.customEffect?.en) {
          if (customEffects?.customTimedFunction) {
            if (customEffects.customTimedFunction.timing == timing) {
              const gameState = this.getGameState(player);
              const updatedPlayer = this.playersService.getPlayer(player.id);
              if (updatedPlayer) {
                customEffects.customTimedFunction.function(updatedPlayer, gameState, this.getUsableGameCommands(), {
                  type: 'tech-tile',
                  object: techTile,
                });
                effectsResolved = true;
              }
            }
          }
        }

        if (!player.isAI) {
          const effects = techTile.structuredEffects;
          if (effects) {
            for (const effect of effects) {
              if (effect.type === 'reward') {
                const gameState = this.getGameState(player);
                this.effectsService.resolveStructuredEffect(effect, player, gameState, {
                  type: 'tech-tile',
                  object: techTile,
                });
                effectsResolved = true;
              }
            }
          }
        }

        if (player.isAI) {
          const effects = techTile.structuredEffects;
          if (effects) {
            const gameState = this.getGameState(player);
            this.effectsService.resolveStructuredEffects(effects, player, gameState, {
              type: 'tech-tile',
              object: techTile,
            });
            effectsResolved = true;
          }

          if (customEffects?.customTimedAIFunction) {
            if (customEffects.customTimedAIFunction.timing == timing) {
              const gameState = this.getGameState(player);
              const updatedPlayer = this.playersService.getPlayer(player.id);
              if (updatedPlayer) {
                customEffects.customTimedAIFunction.function(updatedPlayer, gameState, this.getUsableGameCommands(), {
                  type: 'tech-tile',
                  object: techTile,
                });
                effectsResolved = true;
                await delay(2000);
              }
            }
          }
        }
      }
    }

    this.resolveRewardChoices(player);
    return effectsResolved;
  }

  private resolveGameEffects(gameEffects: GameEffects) {
    if (gameEffects.imperiumRowCards) {
      this.cardsService.addCardsToImperiumRow(gameEffects.imperiumRowCards.amount);
    } else if (gameEffects.spiceAccumulation) {
      this.boardSpaceService.accumulateSpiceOnBoardSpaces(gameEffects.spiceAccumulation.amount);
    }
  }

  resolveRewardChoices(player: Player) {
    if (!player.isAI) {
      this.resolvePlayerRewardChoices(player);
    } else {
      this.aiResolveRewardChoices(player);
    }
  }

  private resolvePlayerRewardChoices(player: Player) {
    const turnInfo = this.turnInfoService.getPlayerTurnInfos(player.id);
    if (!turnInfo) {
      return;
    }

    const gameState = this.getGameState(player);

    if (turnInfo.cardDrawOrDestroyAmount > 0) {
      for (let i = 0; i < turnInfo.cardDrawOrDestroyAmount; i++) {
        const choiceEffect: StructuredChoiceEffect = {
          type: 'helper-or',
          effectLeft: {
            type: 'reward',
            effectRewards: [{ type: 'card-draw' }],
          },
          effectRight: {
            type: 'reward',
            effectRewards: [{ type: 'focus' }],
          },
        };
        this.turnInfoService.updatePlayerTurnInfo(player.id, { effectChoices: [choiceEffect] });
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { cardDrawOrDestroyAmount: 0 });
    }
    if (turnInfo.cardDiscardAmount) {
      for (let i = 0; i < turnInfo.cardDiscardAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'card-discard',
        });
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { cardDiscardAmount: 0 });
    }
    if (turnInfo.cardDestroyAmount) {
      for (let i = 0; i < turnInfo.cardDestroyAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'card-destroy',
        });
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { cardDestroyAmount: 0 });
    }
    if (turnInfo.shippingAmount > 0) {
      this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
        type: 'shipping',
        amount: turnInfo.shippingAmount,
      });
      this.turnInfoService.setPlayerTurnInfo(player.id, { shippingAmount: 0 });
    }
    if (turnInfo.locationControlAmount > 0) {
      for (let i = 0; i < turnInfo.locationControlAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'location-control-choice',
        });
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { locationControlAmount: 0 });
    }

    if (turnInfo.factionInfluenceUpChoiceAmount > 0) {
      for (let i = 0; i < turnInfo.factionInfluenceUpChoiceAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'faction-influence-up-choice',
        });
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { factionInfluenceUpChoiceAmount: 0 });
    }

    if (turnInfo.factionInfluenceUpChoiceTwiceAmount > 0) {
      for (let i = 0; i < turnInfo.factionInfluenceUpChoiceTwiceAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'faction-influence-up-twice-choice',
        });
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { factionInfluenceUpChoiceTwiceAmount: 0 });
    }

    if (turnInfo.factionInfluenceDownChoiceAmount > 0) {
      for (let i = 0; i < turnInfo.factionInfluenceDownChoiceAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'faction-influence-down-choice',
        });
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { factionInfluenceDownChoiceAmount: 0 });
    }

    if (turnInfo.signetRingAmount > 0) {
      for (let i = 0; i < turnInfo.signetRingAmount; i++) {
        const playerLeader = this.leadersService.getLeader(player.id);
        if (playerLeader) {
          if (playerLeader.structuredSignetEffects) {
            this.effectsService.resolveStructuredEffects(playerLeader.structuredSignetEffects, player, gameState);
          } else if (playerLeader.customSignetEffects) {
            this.effectsService.resolveStructuredEffects(playerLeader.customSignetEffects, player, gameState);
          } else if (playerLeader.customSignetFunction) {
            playerLeader.customSignetFunction(player, gameState, this.getUsableGameCommands());
          } else if (playerLeader.signetDescription.en) {
            this.playerRewardChoicesService.addPlayerCustomChoice(
              player.id,
              this.t.translateLS(playerLeader.signetDescription),
            );
          }
        } else {
          this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
            type: 'signet-ring',
          });
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { signetRingAmount: 0 });
    }
    if (turnInfo.intrigueTrashAmount > 0) {
      for (let i = 0; i < turnInfo.intrigueTrashAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'intrigue-trash',
        });
      }

      this.turnInfoService.setPlayerTurnInfo(player.id, { intrigueTrashAmount: 0 });
    }
    if (turnInfo.techTileTrashAmount > 0) {
      this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
        type: 'tech-tile-trash',
      });

      this.turnInfoService.setPlayerTurnInfo(player.id, { techTileTrashAmount: 0 });
    }
    if (turnInfo.canLiftAgent) {
      this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
        type: 'agent-lift',
      });
      this.turnInfoService.setPlayerTurnInfo(player.id, { canLiftAgent: false });
    }
    if (turnInfo.cardReturnToHandAmount > 0) {
      this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
        type: 'card-return-to-hand',
      });
      this.turnInfoService.setPlayerTurnInfo(player.id, { cardReturnToHandAmount: 0 });
    }
    if (turnInfo.needsToPickConflict) {
      this.playerRewardChoicesService.setPlayerConflictChoice(player.id, true);
      this.turnInfoService.setPlayerTurnInfo(player.id, { needsToPickConflict: false });
    }
    if (turnInfo.enemiesEffects.length > 0) {
      const enemies = this.playersService.getEnemyPlayers(player.id);

      for (const enemy of enemies) {
        for (const effect of turnInfo.enemiesEffects) {
          this.effectsService.addRewardToPlayer(enemy.id, effect);
        }
        this.resolveRewardChoices(enemy);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { enemiesEffects: [] });
    }
  }

  aiResolveRewardChoices(player: Player, depth = 0) {
    const turnInfo = this.turnInfoService.getPlayerTurnInfos(player.id);
    if (!turnInfo || depth > 2) {
      return;
    }

    const gameState = this.getGameState(player);

    if (turnInfo.cardDrawOrDestroyAmount > 0) {
      for (let i = 0; i < turnInfo.cardDrawOrDestroyAmount; i++) {
        const desiredEffects = this.effectEvaluationService.getDesiredRewardEffects(
          player,
          [{ type: 'card-draw' }, { type: 'focus' }],
          gameState,
        );

        if (desiredEffects.length > 0) {
          this.effectsService.addRewardToPlayer(player.id, desiredEffects[0]);
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { cardDrawOrDestroyAmount: 0 });
    }
    if (turnInfo.cardDiscardAmount) {
      for (let i = 0; i < turnInfo.cardDiscardAmount; i++) {
        this.aiManager.aiDiscardHandCard(player.id);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { cardDiscardAmount: 0 });
    }
    if (turnInfo.cardDestroyAmount) {
      for (let i = 0; i < turnInfo.cardDestroyAmount; i++) {
        this.aiManager.aiTrashCardInPlay(player.id);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { cardDestroyAmount: 0 });
    }
    if (turnInfo.shippingAmount > 0) {
      const desiredEffects = this.effectEvaluationService.getDesiredRewardEffects(
        player,
        [{ type: 'spice' }, { type: 'water' }, { type: 'solari' }],
        gameState,
      );

      if (desiredEffects.length > 0) {
        this.effectsService.addRewardToPlayer(player.id, desiredEffects[0]);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { shippingAmount: 0 });
    }
    if (turnInfo.locationControlAmount > 0) {
      for (let i = 0; i < turnInfo.locationControlAmount; i++) {
        const updatedGameState = this.getGameState(player);
        const desiredLocation = this.aiBoardSpacesService.getLocationToControl(player, updatedGameState);
        if (desiredLocation) {
          this.changeLocationOwner(desiredLocation.actionField.title.en, player.id);
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { locationControlAmount: 0 });
    }
    if (turnInfo.factionInfluenceUpChoiceAmount > 0) {
      this.aiManager.aiIncreaseFactionInfluenceChoice(player, turnInfo.factionInfluenceUpChoiceAmount);
      this.turnInfoService.setPlayerTurnInfo(player.id, { factionInfluenceUpChoiceAmount: 0 });
    }
    if (turnInfo.factionInfluenceUpChoiceTwiceAmount > 0) {
      this.aiManager.aiIncreaseFactionInfluenceChoiceTwice(player, turnInfo.factionInfluenceUpChoiceTwiceAmount);
      this.turnInfoService.setPlayerTurnInfo(player.id, { factionInfluenceUpChoiceTwiceAmount: 0 });
    }
    if (turnInfo.factionInfluenceDownChoiceAmount > 0) {
      this.aiManager.aiDecreaseFactionInfluenceChoice(player.id, turnInfo.factionInfluenceDownChoiceAmount);
      this.turnInfoService.setPlayerTurnInfo(player.id, { factionInfluenceDownChoiceAmount: 0 });
    }
    if (turnInfo.intrigueTrashAmount > 0) {
      for (let i = 0; i < turnInfo.intrigueTrashAmount; i++) {
        this.aiManager.aiTrashIntrigue(player.id);
      }

      this.turnInfoService.setPlayerTurnInfo(player.id, { intrigueTrashAmount: 0 });
    }
    if (turnInfo.techTileTrashAmount > 0) {
      const techTile = this.aiManager.getTechTileToTrash(player.id);
      if (techTile) {
        this.techTilesService.trashPlayerTechTile(techTile.techTile.id);
        const trashEffect = techTilesGameAdjustments.find((x) => x.id === techTile.techTile.id)?.onTrashFunction;
        if (trashEffect) {
          trashEffect(player, gameState, this.getUsableGameCommands());
        }
        this.loggingService.logPlayerTrashedTechTile(player.id, this.t.translateLS(techTile.techTile.name));
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { techTileTrashAmount: 0 });
    }
    if (turnInfo.effectChoices.length > 0) {
      for (const effectOption of turnInfo.effectChoices) {
        const updatedPlayer = this.playersService.getPlayer(player.id);
        const updatedGameState = this.getGameState(player);

        if (updatedPlayer && updatedGameState) {
          this.aiManager.aiChooseRewardOption(
            updatedPlayer,
            effectOption.effectLeft,
            effectOption.effectRight,
            updatedGameState,
            effectOption.element,
          );
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { effectChoices: [] });
    }
    if (turnInfo.effectConversions.length > 0) {
      for (const effectConversion of turnInfo.effectConversions) {
        const updatedPlayer = this.playersService.getPlayer(player.id);
        const updatedGameState = this.getGameState(player);

        if (updatedPlayer && updatedGameState) {
          this.aiManager.aiConvertRewardIfUsefulAndPossible(updatedPlayer, effectConversion, updatedGameState);
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { effectConversions: [] });
    }

    if (turnInfo.canLiftAgent) {
      const playerAgentsOnOtherFields = this.playerAgentsService
        .getPlayerAgentsOnFields(player.id)
        .filter((x) => x.fieldId !== turnInfo.agentPlacedOnFieldId);
      if (playerAgentsOnOtherFields.length > 0) {
        const locations = playerAgentsOnOtherFields.filter(
          (x) => this.settingsService.getBoardField(x.fieldId)?.ownerReward,
        );
        const nonLocations = playerAgentsOnOtherFields.filter(
          (x) => !this.settingsService.getBoardField(x.fieldId)?.ownerReward,
        );

        if (locations.length > 0) {
          shuffle(locations);
          this.playerAgentsService.removePlayerAgentFromField(player.id, locations[0].fieldId);
        } else if (nonLocations.length > 0) {
          shuffle(nonLocations);
          this.playerAgentsService.removePlayerAgentFromField(player.id, nonLocations[0].fieldId);
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { canLiftAgent: false });
    }
    if (turnInfo.cardReturnToHandAmount > 0) {
      const cardToReturn = this.aiManager.getCardToReturnToHandFromDiscardPile(player.id);
      if (cardToReturn) {
        this.returnDiscardedPlayerCardToHand(player.id, cardToReturn);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { cardReturnToHandAmount: 0 });
    }
    if (playerCanEnterCombat(turnInfo)) {
      const aiPlayer = this.aiPlayersService.getAIPlayer(player.id);
      if (!aiPlayer) {
        return;
      }

      const deployableUnits = turnInfo.deployableUnits - turnInfo.deployedUnits;
      const deployableTroops = turnInfo.deployableTroops - turnInfo.deployedTroops;
      const deployableDreadnoughts = turnInfo.deployableDreadnoughts - turnInfo.deployedDreadnoughts;

      const addedUnitsToCombat = this.aiManager.aiAddUnitsToCombat(
        player,
        gameState,
        deployableUnits,
        deployableTroops,
        deployableDreadnoughts,
      );

      const currentConflict = this.conflictsService.currentConflict;
      if (addedUnitsToCombat && !currentConflict) {
        this.turnInfoService.setPlayerTurnInfo(player.id, { needsToPickConflict: true });
      }
    }
    if (turnInfo.signetRingAmount > 0) {
      for (let i = 0; i < turnInfo.signetRingAmount; i++) {
        const playerLeader = this.leadersService.getLeader(player.id);
        if (playerLeader) {
          if (playerLeader.structuredSignetEffects) {
            this.effectsService.resolveStructuredEffects(playerLeader.structuredSignetEffects, player, gameState);
          } else if (playerLeader.customSignetEffects) {
            this.effectsService.resolveStructuredEffects(playerLeader.customSignetEffects, player, gameState);
          } else if (playerLeader.customSignetFunction) {
            playerLeader.customSignetFunction(player, gameState, this.getUsableGameCommands());
          } else if (!playerLeader.customSignetAIFunction && playerLeader.signetDescription.en) {
            this.playerRewardChoicesService.addPlayerCustomChoice(
              player.id,
              this.t.translateLS(playerLeader.signetDescription),
            );
          }
          if (playerLeader.customSignetAIFunction) {
            playerLeader.customSignetAIFunction(player, gameState, this.getUsableGameCommands());
          }
        } else {
          this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
            type: 'signet-ring',
          });
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { signetRingAmount: 0 });
    }
    if (turnInfo.needsToPickConflict) {
      const playerAgentsOnFields = this.playerAgentsService.getPlayerAgentsOnFields(player.id);
      const pickableConflicts = this.conflictsService.conflictStack.filter((x) =>
        playerAgentsOnFields.some((y) => y.fieldId === x.boardSpaceId),
      );
      if (pickableConflicts.length > 1) {
        pickableConflicts.sort(
          (a, b) =>
            this.effectEvaluationService.getRewardArrayEvaluationForTurnState(b.rewards[0], player, gameState) -
            this.effectEvaluationService.getRewardArrayEvaluationForTurnState(a.rewards[0], player, gameState),
        );

        const enemyGarrisonStrengths = gameState.enemyCombatUnits.map((x) => ({
          ...x,
          garrisonStrength: getPlayerGarrisonStrength(x, gameState),
        }));
        enemyGarrisonStrengths.sort((a, b) => b.garrisonStrength - a.garrisonStrength);
        const highestEnemyGarrisonStrength = enemyGarrisonStrengths[0].garrisonStrength;

        if (
          getPlayerCombatStrength(gameState.playerCombatUnits, gameState) +
            getPlayerGarrisonStrength(gameState.playerCombatUnits, gameState) >=
          highestEnemyGarrisonStrength
        ) {
          this.conflictsService.setCurrentConflict(pickableConflicts[0].id);
        } else {
          this.conflictsService.setCurrentConflict(pickableConflicts[pickableConflicts.length - 1].id);
        }
      } else if (pickableConflicts.length === 1) {
        this.conflictsService.setCurrentConflict(pickableConflicts[0].id);
      } else {
        // TODO: handle case where there are no pickable conflicts (should not happen)
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { needsToPickConflict: false });
    }
    if (turnInfo.enemiesEffects.length > 0) {
      const enemies = this.playersService.getEnemyPlayers(player.id);

      for (const enemy of enemies) {
        for (const effect of turnInfo.enemiesEffects) {
          this.effectsService.addRewardToPlayer(enemy.id, effect);
        }
        this.resolveRewardChoices(enemy);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { enemiesEffects: [] });
    }
    if (turnInfo.canBuyTech) {
      const costModifiers = this.gameModifiersService.getPlayerGameModifier(player.id, 'techTiles');

      const desiredTechTile = this.aiManager.aiGetTechTileToBuyIfPossible(player.id, costModifiers);
      if (desiredTechTile) {
        const costModifier = getTechTileCostModifier(desiredTechTile, costModifiers);

        this.buyTechTileForPlayer(
          player,
          desiredTechTile,
          this.playersResourcesService.getPlayerResourceAmount(player.id, 'tech'),
          costModifier,
        );
      }
    }

    const newTurnInfo = this.turnInfoService.getPlayerTurnInfos(player.id);
    if (newTurnInfo && turnInfosNeedToBeResolved(newTurnInfo)) {
      this.aiResolveRewardChoices(player, depth + 1);
    }
  }

  resolveEffectChoice(
    playerId: number,
    effect: StructuredChoiceEffectWithGameElement,
    choice: 'left' | 'right',
    gameState?: GameState,
  ) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return false;
    }
    const realGameState = gameState ? gameState : this.getGameState(player);

    const chosenEffect = choice === 'left' ? effect.effectLeft : effect.effectRight;

    if (isStructuredConversionEffect(chosenEffect)) {
      this.resolveEffectConversionIfPossible(playerId, { ...chosenEffect, element: effect.element }, realGameState);
    } else {
      const rewards = getMultipliedRewardEffects(chosenEffect, realGameState);
      for (const reward of rewards) {
        this.effectsService.addRewardToPlayer(player.id, reward, { gameElement: effect.element });

        this.resolveRewardChoices(player);
      }
    }

    return true;
  }

  resolveEffectConversionIfPossible(
    playerId: number,
    effect: StructuredConversionEffectWithGameElement,
    gameState?: GameState,
  ) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return false;
    }
    const realGameState = gameState ? gameState : this.getGameState(player);

    const effectCosts = getMultipliedRewardEffects(effect.effectCosts, realGameState);

    if (playerCanPayCosts(effectCosts, player, realGameState)) {
      const rewards = getMultipliedRewardEffects(effect.effectConversions, realGameState);

      for (const cost of effectCosts) {
        this.effectsService.payCostForPlayer(player.id, cost, { gameElement: effect.element });
      }
      for (const reward of rewards) {
        this.effectsService.addRewardToPlayer(player.id, reward, { gameElement: effect.element });
      }

      this.resolveRewardChoices(player);

      return true;
    } else {
      this.notificationService.showWarning(this.t.translate('playerboardWarningNotEnoughResources'));
      return false;
    }
  }

  acquireImperiumCard(
    playerId: number,
    card: ImperiumRowCard | ImperiumDeckCard | ImperiumRowPlot,
    source: 'deck' | 'row' | 'always-buyable',
    options?: { additionalCostModifier?: number; acquireLocation: CardAcquiringPlacementType },
  ) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const costModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'imperiumRow');
    const costModifier = getCardCostModifier(card, costModifiers) + (options?.additionalCostModifier ?? 0);

    const availablePersuasion = getPlayerPersuasion(player);
    const totalPersuasionCosts = card.persuasionCosts ? card.persuasionCosts + costModifier : 0;
    const playerCanAffordCard = availablePersuasion >= totalPersuasionCosts;

    if (playerCanAffordCard) {
      if (card.persuasionCosts) {
        this.playersService.addPersuasionSpentToPlayer(playerId, totalPersuasionCosts);
      }
      if (card.type === 'imperium-card') {
        if (card.buyEffects) {
          for (const effect of card.buyEffects) {
            this.effectsService.addRewardToPlayer(player.id, effect, { source: 'Imperium Card Buy Effect' });
          }

          this.resolveRewardChoices(player);
        }

        if (source === 'deck') {
          this.cardsService.aquirePlayerCardFromImperiumDeck(playerId, card, options?.acquireLocation);
        } else if (source === 'row') {
          this.cardsService.aquirePlayerCardFromImperiumRow(playerId, card, options?.acquireLocation);
        } else {
          this.cardsService.aquirePlayerCardFromLimitedCustomCards(playerId, card, options?.acquireLocation);
        }
      } else {
        this.cardsService.aquirePlayerPlotFromImperiumRow(playerId, card);
      }

      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [card] });

      this.loggingService.logPlayerBoughtCard(playerId, this.t.translateLS(card.name));

      return true;
    } else {
      this.notificationService.showWarning(this.t.translate('buyCardWarningNotEnoughPersuasion'));
    }

    return false;
  }

  discardImperiumCardFromHand(playerId: number, card: ImperiumDeckCard) {
    const cardDiscardTodo = this.playerRewardChoicesService.getPlayerRewardChoice(playerId, 'card-discard');
    if (cardDiscardTodo) {
      this.playerRewardChoicesService.removePlayerRewardChoice(playerId, cardDiscardTodo.id);
    }

    this.audioManager.playSound('card-discard');
    this.cardsService.discardPlayerHandCard(playerId, card);

    this.loggingService.logPlayerDiscardedCard(playerId, this.t.translateLS(card.name));
  }

  trashImperiumCard(playerId: number, card: ImperiumDeckCard, source: 'hand' | 'discard-pile') {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }
    const hasFocus = this.playersResourcesService.getPlayerResourceAmount(playerId, 'focus') > 0;
    const hasTrashTodo = this.playerRewardChoicesService.getPlayerRewardChoice(playerId, 'card-destroy');
    let canTrashCard = false;
    if (hasTrashTodo) {
      this.playerRewardChoicesService.removePlayerRewardChoice(playerId, hasTrashTodo.id);
      canTrashCard = true;
    } else if (hasFocus) {
      this.playersResourcesService.removeResourceFromPlayer(playerId, 'focus', 1);
      canTrashCard = true;
    } else {
      this.notificationService.showWarning(this.t.translate('playerboardWarningNotEnoughResources'));
    }

    if (canTrashCard) {
      this.audioManager.playSound('card-discard');
      if (source === 'hand') {
        this.cardsService.trashPlayerHandCard(playerId, card);
      } else {
        this.cardsService.trashDiscardedPlayerCard(playerId, card);
      }
      this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(card.name));
    }
  }

  returnDiscardedPlayerCardToHand(playerId: number, card: ImperiumDeckCard) {
    const cardReturnTodo = this.playerRewardChoicesService.getPlayerRewardChoice(playerId, 'card-return-to-hand');
    if (cardReturnTodo) {
      this.playerRewardChoicesService.removePlayerRewardChoice(playerId, cardReturnTodo.id);
    }

    this.cardsService.returnDiscardedPlayerCardToHand(playerId, card);
    this.loggingService.logPlayerReturnedCardToHand(playerId, this.t.translateLS(card.name));
  }

  acquirePlayerTechTile(playerId: number, techTile: TechTileDeckCard) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const canBuyTech = this.turnInfoService.getPlayerTurnInfo(playerId, 'canBuyTech');
    if (!canBuyTech) {
      this.notificationService.showWarning(this.t.translate('techBoardWarningNoTechGainedThisTurn'));
      return;
    }

    const costModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'techTiles');
    const costModifier = getTechTileCostModifier(techTile, costModifiers);

    const availablePlayerSpice = this.playersResourcesService.getPlayerResourceAmount(playerId, 'spice');
    const availablePlayerTech = this.playersResourcesService.getPlayerResourceAmount(playerId, 'tech');
    const playerCanAffordTechTile = techTile.costs + costModifier <= availablePlayerSpice + availablePlayerTech;

    if (playerCanAffordTechTile) {
      this.buyTechTileForPlayer(player, techTile, availablePlayerTech, 0);
    } else {
      this.notificationService.showWarning(this.t.translate('buyTechTileWarningNotEnoughTech'));
    }
  }

  trashPlayerTechTile(playerId: number, techTile: TechTileDeckCard) {
    this.techTilesService.trashPlayerTechTile(techTile.id);
    this.loggingService.logPlayerTrashedTechTile(playerId, this.t.translateLS(techTile.name));
  }

  activatePlayerTechtile(playerId: number, techTile: TechTileDeckCard, type: 'effect' | 'function') {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    if (type === 'effect') {
      if (techTile.structuredEffects) {
        this.effectsService.resolveStructuredEffects(techTile.structuredEffects, player, this.getGameState(player), {
          type: 'tech-tile',
          object: techTile,
        });

        this.resolveRewardChoices(player);
      }
    }

    if (type === 'function') {
      const activeFunction = techTilesGameAdjustments.find(
        (y) => techTile.name.en === y.id && y.customTimedActivatedFunction,
      )?.customTimedActivatedFunction;
      if (activeFunction) {
        if (
          isEffectTimingFullfilled(activeFunction.timing, player, {
            currentRound: this.roundService.currentRound,
            currentRoundPhase: this.roundService.currentRoundPhase,
            playerAgentsOnFields: this.playerAgentsService.getPlayerAgentsOnFields(player.id),
            playerTurnInfos: this.turnInfoService.getPlayerTurnInfos(player.id),
          })
        ) {
          activeFunction.function(player, this.getGameState(player), this.getUsableGameCommands(), {
            type: 'tech-tile',
            object: techTile,
          });
        }
      }
    }
  }

  activatePlayerLeader(playerId: number, playerLeader: PlayerLeader, type: 'effect' | 'function') {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const leader = playerLeader.leader;

    if (type === 'effect') {
      if (leader.structuredPassiveEffects) {
        this.effectsService.resolveStructuredEffects(leader.structuredPassiveEffects, player, this.getGameState(player));

        this.resolveRewardChoices(player);
      }
    }

    if (type === 'function') {
      const activeFunctions = leadersGameAdjustments.find(
        (y) => leader.name.en === y.id && y.customTimedActivatedFunctions,
      )?.customTimedActivatedFunctions;
      if (activeFunctions && activeFunctions.length > 0) {
        for (const activeFunction of activeFunctions) {
          if (
            isEffectTimingFullfilled(activeFunction.timing, player, {
              currentRound: this.roundService.currentRound,
              currentRoundPhase: this.roundService.currentRoundPhase,
              playerAgentsOnFields: this.playerAgentsService.getPlayerAgentsOnFields(player.id),
              playerTurnInfos: this.turnInfoService.getPlayerTurnInfos(player.id),
            })
          ) {
            activeFunction.function(player, this.getGameState(player), this.getUsableGameCommands());
          }
        }
      }
    }
  }

  private getUsableGameCommands(): GameCommands {
    return {
      // High-level game actions
      acquireImperiumCard: (playerId, card, source, options) => this.acquireImperiumCard(playerId, card, source, options),
      resolveRewardChoices: (player) => this.resolveRewardChoices(player),
      playSound: (sound, chorusAmount) => this.audioManager.playSound(sound, chorusAmount),
      addRewardToPlayer: (playerId, reward) => this.effectsService.addRewardToPlayer(playerId, reward),
      payCostForPlayer: (playerId, cost, options) => this.effectsService.payCostForPlayer(playerId, cost, options),
      removeGameModifier: (playerId, modifierType, modifierId) =>
        this.gameModifiersService.removePlayerGameModifier(playerId, modifierType, modifierId),
      addPlayerGameModifiers: (playerId, modifiers) => this.gameModifiersService.addPlayerGameModifiers(playerId, modifiers),
      increaseAccumulatedSpiceOnBoardSpace: (boardSpaceId) =>
        this.boardSpaceService.increaseAccumulatedSpiceOnBoardSpace(boardSpaceId),
      removePlayerShipsFromCombat: (playerId, amount) => this.combatManager.removePlayerShipsFromCombat(playerId, amount),
      setPlayerAgentInTimeout: (playerId, fieldId) => this.playerAgentsService.setPlayerAgentInTimeout(playerId, fieldId),
      setLocationOwner: (boardSpaceId, playerId) => this.locationManager.setLocationOwner(boardSpaceId, playerId),
      changeFieldMarkerModifier: (playerId, fieldId, changeAmount) =>
        this.gameModifiersService.changeFieldMarkerModifier(playerId, fieldId, changeAmount),
      addPlayerImperiumRowModifier: (playerId, content) =>
        this.gameModifiersService.addPlayerImperiumRowModifier(playerId, content),
      logPlayerGainedLocationControl: (playerId, roundNumber, locationId) =>
        this.loggingService.logPlayerGainedLocationControl(playerId, roundNumber, locationId),
      resolveStructuredEffect: (effect, player, gameState, gameElement, timing) =>
        this.effectsService.resolveStructuredEffect(effect, player, gameState, gameElement, timing),
      resolveStructuredEffects: (effects, player, gameState, gameElement, timing) =>
        this.effectsService.resolveStructuredEffects(effects, player, gameState, gameElement, timing),
      retreatPlayerTroopsFromCombat: (playerId, amount) =>
        this.combatManager.retreatPlayerTroopsFromCombat(playerId, amount),
      addPlayerIntrigue: (playerId, intrigue) => this.intriguesService.addPlayerIntrigue(playerId, intrigue),
      trashPlayerIntrigue: (playerId, intrigueId, addToDiscardPile?) =>
        this.intriguesService.trashPlayerIntrigue(playerId, intrigueId, addToDiscardPile),
      removePersuasionFromPlayer: (playerId, amount) => this.playersService.removePersuasionFromPlayer(playerId, amount),
      getAllBuyableCards: (playerId) => this.cardsService.getAllBuyableCards(playerId),
      getBoardSpaceColor: (actionType) => this.settingsService.getBoardSpaceColor(actionType),
      ai: {
        getImperiumCardToBuy: (availablePersuasion, cards, player, gameState, imperiumRowModifiers) =>
          this.aiCardsService.getImperiumCardToBuy(availablePersuasion, cards, player, gameState, imperiumRowModifiers),
        getDesiredRewardEffects: (player, resourceOptions, gameState) =>
          this.effectEvaluationService.getDesiredRewardEffects(player, resourceOptions, gameState),
        getStructuredEffectUsefulnesAndCosts: (player, effect, gameState) =>
          this.effectEvaluationService.getStructuredEffectUsefulnesAndCosts(player, effect, gameState),
      },
      trashImperiumCard: (playerId, card, source) => this.trashImperiumCard(playerId, card, source),
      updatePlayerTurnInfo: (playerId, turnInfo) => this.turnInfoService.updatePlayerTurnInfo(playerId, turnInfo),
      getPlayableCombatIntrigues: (player, gameState, playerCombatIntrigues) =>
        this.aIConflictService.getPlayableCombatIntrigues(player, gameState, playerCombatIntrigues),
      trashPlayerTechTile: (playerId, techTile) => this.trashPlayerTechTile(playerId, techTile),
      returnDiscardedPlayerCardToHand: (playerId, card) => this.returnDiscardedPlayerCardToHand(playerId, card),
      dialog: this.dialog,
      translation: this.t,
    };
  }

  private buyTechTileForPlayer(player: Player, techTile: TechTileDeckCard, techAmount: number, discount: number) {
    const effectiveCosts = techTile.costs - discount;

    if (effectiveCosts > techAmount) {
      this.notificationService.showWarning(this.t.translate('playerboardWarningNotEnoughResources'));
    }

    if (effectiveCosts > 0) {
      const techCosts = effectiveCosts > techAmount ? techAmount : effectiveCosts;
      this.playersResourcesService.removeResourceFromPlayer(player.id, 'tech', techCosts);
      this.loggingService.logPlayerResourcePaid(player.id, 'tech', techCosts);
    }

    this.techTilesService.setPlayerTechTile(player.id, techTile.name.en);

    if (techTile.buyEffects) {
      for (const reward of techTile.buyEffects) {
        this.effectsService.addRewardToPlayer(player.id, reward, { source: 'Tech Tile Buy Effect' });
      }

      this.resolveRewardChoices(player);
    }
    if (techTile.gameModifiers) {
      this.gameModifiersService.addPlayerGameModifiers(player.id, techTile.gameModifiers);
    }

    this.audioManager.playSound('aquire-tech');

    this.loggingService.logPlayerBoughtTechTile(player.id, this.t.translateLS(techTile.name));
    this.turnInfoService.updatePlayerTurnInfo(player.id, { techTilesBoughtThisTurn: [techTile] });
  }

  private shouldTriggerFinale() {
    const playerScores = this.playerScoreManager.playerScores;
    const finaleTrigger = this.settingsService.getFinaleTrigger();
    if (playerScores.length < 4) {
      return playerScores.some((x) => x.victoryPoints > finaleTrigger);
    } else {
      return playerScores.some((x) => x.victoryPoints > finaleTrigger - 1);
    }
  }

  lockInLeader(playerId: number, leader: LeaderDeckCard) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }
    this.leadersService.lockInLeader(playerId);

    for (const startingResource of this.settingsService.getStartingResources()) {
      this.effectsService.addRewardToPlayer(player.id, startingResource);
    }
    for (const startingResource of leader.startingResources) {
      this.effectsService.addRewardToPlayer(player.id, startingResource);
    }

    if (leader.gameModifiers) {
      this.gameModifiersService.addPlayerGameModifiers(playerId, leader.gameModifiers);
    }

    this.resolveRewardChoices(player);
  }

  healLeader(playerId: number) {
    const leaderHealAmount = this.playersResourcesService.getPlayerResourceAmount(playerId, 'leader-heal');
    const healCosts = this.roundService.currentRoundPhase === 'combat-resolvement' ? 1 : 2;
    if (leaderHealAmount >= healCosts) {
      this.effectsService.payCostForPlayer(playerId, { type: 'leader-heal', amount: healCosts });
      this.leadersService.unflipLeader(playerId);
    }
  }

  async executeAITurn(playerId: number) {
    const player = this.playersService.getPlayer(playerId);

    if (!player || player.turnState === 'done') {
      return;
    }

    this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'working' });

    const roundPhase = this.roundService.currentRoundPhase;

    if (roundPhase === 'agent-placement') {
      this.aiManager.aiHealLeadersIfUsefulAndPossible(player.id, 'agent-placement');

      const leaderEffectsHandled = this.resolveLeaderEffects(player, 'timing-turn-start');

      if (this.turnInfoService.getPlayerTurnInfo(playerId, 'needsToPassTurn')) {
        this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
        return;
      }

      const techTilesPlayed = await this.resolveTechTileEffects(player, 'timing-turn-start');

      if (this.turnInfoService.getPlayerTurnInfo(playerId, 'needsToPassTurn')) {
        this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
        return;
      }

      // AI Play Intrigues
      const playerIntrigues = this.intriguesService.getPlayerIntrigues(player.id, 'complot') ?? [];

      let intriguesPlayed = false;
      for (const intrigue of playerIntrigues) {
        const player = this.playersService.getPlayer(playerId)!;
        const gameState = this.getGameState(player);

        const isPlayableAndUseful = this.aiCardsService.aiIsPlayableAndUsefulIntrigue(player, intrigue, gameState);
        if (isPlayableAndUseful && Math.random() < 0.6 + 0.2 * playerIntrigues.length) {
          this.aiManager.aiPlayIntrigue(player, intrigue, gameState);
          this.aiResolveRewardChoices(player);

          intriguesPlayed = true;
          await delay(2000);

          if (this.turnInfoService.getPlayerTurnInfo(playerId, 'needsToPassTurn')) {
            this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
            return;
          }
        }
      }

      if (leaderEffectsHandled || techTilesPlayed || intriguesPlayed) {
        this.aiManager.setPreferredFieldsForAIPlayer(player);
      }

      if (this.turnInfoService.getPlayerTurnInfo(playerId, 'needsToPassTurn')) {
        this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
        return;
      }

      const playerAgentCount = this.playerAgentsService.getAvailablePlayerAgentCount(playerId);

      let couldPlaceAgent = false;
      if (player.turnState === 'agent-placement' && playerAgentCount > 0) {
        const gameState = this.getGameState(player);

        const playerHandCards = this.cardsService.getPlayerHand(player.id)?.cards;
        if (playerHandCards && playerHandCards.length > 0) {
          const cardAndField = this.aiManager.getCardAndFieldToPlay(playerHandCards, player, gameState);

          const boardField = this.settingsService.boardFields.find((x) =>
            cardAndField?.preferredField.fieldId.includes(x.title.en),
          );
          if (boardField && cardAndField) {
            this.cardsService.setPlayedPlayerCard(playerId, cardAndField.cardToPlay.id);
            this.loggingService.logPlayerPlayedCard(playerId, this.t.translateLS(cardAndField.cardToPlay.name));
            this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsPlayedThisTurn: [cardAndField.cardToPlay] });
            this.addAgentToField(boardField);

            this.resolveLeaderEffects(player, 'timing-agent-placement');
            await this.resolveTechTileEffects(player, 'timing-agent-placement');

            couldPlaceAgent = true;
            this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
          }
        }
      }

      if (!couldPlaceAgent && player.turnState !== 'reveal') {
        await this.setPlayerRevealTurn(playerId);
        this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'ready' });
      }
      if (player.turnState === 'reveal') {
        const maxCardsBoughtPerTurn = 3;
        for (let i = 0; i < maxCardsBoughtPerTurn; i++) {
          const playerPersuasionAvailable = getPlayerPersuasion(player);

          const cardBought = this.aiManager.aiBuyImperiumCard(playerId, playerPersuasionAvailable);
          if (cardBought) {
            this.aiResolveRewardChoices(player);
          } else {
            break;
          }
        }

        const playerPersuasionLeft = getPlayerPersuasion(player);
        if (playerPersuasionLeft > 0) {
          this.aiManager.aiBuyPlotCards(playerId, playerPersuasionLeft);
        }

        const playerFocusTokens = this.playersResourcesService.getPlayerResourceAmount(playerId, 'focus');
        for (let i = 0; i < playerFocusTokens; i++) {
          const success = this.aiManager.aiTrashCardInPlay(playerId);
          if (success) {
            this.playersResourcesService.removeResourceFromPlayer(playerId, 'focus', 1);
          } else {
            break;
          }
        }

        const playerHand = this.cardsService.getPlayerHand(player.id);
        if (playerHand && playerHand.cards) {
          this.cardsService.discardPlayerHandCards(player.id);
          this.playersService.setTurnStateForPlayer(player.id, 'revealed');
        }
        this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
      }
    } else if (roundPhase === 'combat') {
      if (player.turnState === 'revealed') {
        const gameState = this.getGameState(player);

        this.resolveLeaderEffects(player, 'timing-combat');

        const playerCombatIntrigues = gameState.playerCombatIntrigues;
        const playerCombatScore = getPlayerCombatStrength(gameState.playerCombatUnits, gameState);

        if (playerCombatIntrigues.length < 1 || playerCombatScore < 1) {
          this.playersService.setTurnStateForPlayer(playerId, 'done');
        } else {
          const sortedEnemyCombatScores = gameState.enemyCombatUnits
            .map((x) => getPlayerCombatStrength(x, gameState))
            .sort((a, b) => b - a);
          const currentCombatRank = sortedEnemyCombatScores.filter((x) => x >= playerCombatScore).length + 1;

          if (currentCombatRank === 1 && !this.roundService.isFinale) {
            this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
            return;
          }

          const { playableIntriguesWithSwords, playableIntriguesWithoutSwords } =
            this.aIConflictService.getPlayableCombatIntrigues(player, gameState, playerCombatIntrigues);

          const maxAdditionalCombatScore = playableIntriguesWithSwords.reduce((sum, x) => sum + x.addedScore, 0);

          const potentialCombatRank =
            sortedEnemyCombatScores.filter((x) => x >= playerCombatScore + maxAdditionalCombatScore).length + 1;

          if (potentialCombatRank < currentCombatRank) {
            const chanceToPlayIntrigues = 1 / (2 * potentialCombatRank - 1);
            if (chanceToPlayIntrigues > Math.random() || this.roundService.isFinale) {
              const targetEnemyCombatScore = sortedEnemyCombatScores.find(
                (x) => playerCombatScore + maxAdditionalCombatScore > x,
              )!;

              let playerCurrentCombatScore = playerCombatScore;

              for (const intrigueWithCombatScore of playableIntriguesWithSwords) {
                const intrigue = intrigueWithCombatScore.intrigue;
                this.aiManager.aiPlayIntrigue(player, intrigue, gameState);
                this.aiResolveRewardChoices(player);
                await delay(2000);

                playerCurrentCombatScore += intrigueWithCombatScore.addedScore;
                if (playerCurrentCombatScore > targetEnemyCombatScore) {
                  break;
                }
              }
            }
          } else if (playableIntriguesWithoutSwords.length > 0) {
            for (const playableIntrigue of playableIntriguesWithoutSwords) {
              const potentialCombatRank =
                sortedEnemyCombatScores.filter((x) => x >= playerCombatScore - playableIntrigue.subtractedScore).length + 1;
              if (Math.random() < 0.5 && potentialCombatRank === currentCombatRank) {
                this.aiManager.aiPlayIntrigue(player, playableIntrigue.intrigue, gameState);
                this.aiResolveRewardChoices(player);
                break;
              }
            }
          } else if (playableIntriguesWithSwords.length < 1) {
            this.playersService.setTurnStateForPlayer(playerId, 'done');
          }
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
    } else {
      this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
    }
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
