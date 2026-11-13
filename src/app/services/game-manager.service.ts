import { Injectable } from '@angular/core';
import { cloneDeep, shuffle } from 'lodash';
import { BehaviorSubject, combineLatest, map, Subscription } from 'rxjs';
import { hasCustomAgentEffect, hasCustomRevealEffect } from '../helpers/cards';
import { isActiveFactionType } from '../helpers/faction-types';
import {
  getFactionInfluenceModifier,
  getFieldIsBlocked,
  getImperiumCardModifier,
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
  getStructuredEffectTargets,
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
import { getPlayerCombatStrength, getPlayerGarrisonStrength } from '../helpers/combat';
import { delay } from '../helpers/common';
import { playerCanEnterCombat } from '../helpers/turn-infos';
import { CardGameAdjustmentsGameInterface, GameState } from '../models/ai';
import { StructuredChoiceEffectWithGameElement, StructuredConversionEffectWithGameElement } from '../models/turn-info';
import { AIBoardSpacesService } from './ai/ai-board-spaces.service';
import { AICardsService } from './ai/ai-cards.service';
import { AIConflictService } from './ai/ai-conflict.service';
import { AIPlayersService } from './ai/ai-players.service';
import { AIEffectEvaluationService } from './ai/ai.effect-evaluation.service';
import { AudioManager } from './audio-manager.service';
import { BoardSpacesService } from './board-spaces.service';
import { CardsService, ImperiumDeckCard, ImperiumRowCard, ImperiumRowPlot } from './cards.service';
import { CombatManager } from './combat-manager.service';
import { ConflictDeckCard, ConflictsService } from './conflicts.service';
import { DuneEventsManager } from './dune-events.service';
import { EffectsService } from './game-effects.service';
import { GameModifiersService } from './game-modifier.service';
import { GameStateService } from './game-state.service';
import { IntriguesService } from './intrigues.service';
import { LeaderDeckCard, LeadersService, PlayerLeader } from './leaders.service';
import { LocationsService } from './location-manager.service';
import { LoggingService } from './log.service';
import { NotificationService } from './notification.service';
import { PlayerAgentsService } from './player-agents.service';
import { PlayerResourcesService } from './player-resources.service';
import { PlayerRewardChoicesService } from './player-reward-choices.service';
import { PlayerScoreManager } from './player-score-manager.service';
import { TurnInfoService } from './player-turn-info.service';
import { PlayersService } from './players.service';
import { RoundPhaseType, RoundService } from './round.service';
import { SettingsService } from './settings.service';
import { TechTileDeckCard, TechTilesService } from './tech-tiles.service';
import { TranslateService } from './translate-service';

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

  playerEffectChoiceSubscriptions: Subscription[] = [];

  constructor(
    private playerScoreManager: PlayerScoreManager,
    private playersService: PlayersService,
    private combatManager: CombatManager,
    private locationsService: LocationsService,
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
    private boardSpacesService: BoardSpacesService,
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

    this.playersService.playerIds$.subscribe((playerIds) => {
      for (const subscription of this.playerEffectChoiceSubscriptions) {
        subscription.unsubscribe();
      }
      for (const playerId of playerIds) {
        const subscription = this.playerRewardChoicesService
          .playerRewardChoicesNeedingProcessing$(playerId)
          .subscribe((playerRewardChoices) => {
            if (playerRewardChoices && playerRewardChoices.length > 0) {
              const choicesBeingProcessed = this.playerRewardChoicesService.getPlayerRewardChoicesBeingProcessed(playerId);
              if (!choicesBeingProcessed) {
                const player = this.playersService.getPlayer(playerId);
                if (player) {
                  if (!player.isAI) {
                    this.resolvePlayerRewardChoices(player);
                  } else {
                    this.aiResolveRewardChoices(player);
                  }
                }
              }
            }
          });
        this.playerEffectChoiceSubscriptions.push(subscription);
      }
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
    this.locationsService.resetLocationOwners();
    this.playerRewardChoicesService.resetPlayerRewardChoices();
    this.playerAgentsService.deleteAllPlayerAgents();

    this.playerScoreManager.resetPlayersScores(newPlayers);
    this.playersResourcesService.resetPlayerResources(newPlayers);
    this.playerScoreManager.resetPlayerAlliances();
    this.boardSpacesService.resetAccumulatedSpiceOnBoardSpaces();

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
    if (this.settingsService.eventsEnabled) {
      this.duneEventsManager.setEventDeck();
    }

    this.roundService.resetRound();
    this.roundService.setRoundPhase('select leaders');
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
  }

  beginPlay() {
    this.audioManager.playSound('fog');
    this.roundService.setFirstRound();
    this.roundService.setRoundPhase('agent-placement');

    const players = this.playersService.getPlayers();
    const firstActivePlayerId = Math.floor(Math.random() * players.length) + 1;

    this.startingPlayerIdSubject.next(firstActivePlayerId);
    this.playersService.increaseTurnNumberForPlayer(firstActivePlayerId);
    this.activePlayerIdSubject.next(firstActivePlayerId);

    for (const player of players) {
      this.resolveLeaderEffects(player.id, 'timing-game-start');
      this.resolveLeaderEffects(player.id, 'timing-round-start', true);
    }

    if (this.settingsService.eventsEnabled) {
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

    const player = this.playersService.getPlayer(firstActivePlayerId);
    if (player?.isAI) {
      this.setActiveAIPlayer(this.startingPlayerId);
      this.aiManager.setPreferredFieldsForAIPlayer(this.startingPlayerId);
    }
  }

  resolveConflict() {
    this.audioManager.playSound('fog');

    const conflict = this.conflictsService.currentConflict;
    if (conflict) {
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

              this.resolveRewardChoices();

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

            this.resolveRewardChoices();

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
                const returnedTroops = Math.floor(
                  (firstPlayer.score - otherPlayersScoresCombined) / this.settingsService.getTroopStrength(),
                );
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

    this.boardSpacesService.accumulateSpiceOnBoardSpaces();
    this.playerAgentsService.resetPlayerAgents();
    this.combatManager.setAllPlayerShipsFromTimeoutToGarrison();
    this.combatManager.setAllPlayerShipsFromCombatToTimeout();
    this.combatManager.deleteAllPlayerTroopsFromCombat();
    this.combatManager.resetAdditionalCombatPower();
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
      this.playersResourcesService.resetResourceForPlayer(player.id, 'persuasion');

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

      this.resolveRewardChoices();
    }

    for (const player of this.playersService.getPlayers()) {
      this.cardsService.drawPlayerCardsFromDeck(player.id, player.cardsDrawnAtRoundStart);

      if (player.id === this.startingPlayerId) {
        this.resolveLeaderEffects(player.id, 'timing-round-start');
        await this.resolveTechTileEffects(player.id, 'timing-round-start');

        if (player.isAI) {
          this.setActiveAIPlayer(this.startingPlayerId);
          this.aiManager.setPreferredFieldsForAIPlayer(player.id);
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

    this.playersResourcesService.addResourceToPlayer(player.id, 'persuasion', player.permanentPersuasion);

    const playerLocations = this.locationsService.getPlayerLocations(playerId);
    for (const playerLocation of playerLocations) {
      const field = this.boardSpacesService.getBoardSpace(playerLocation.locationId);
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

    this.resolveLeaderEffects(playerId, 'timing-reveal-turn');
    await this.resolveTechTileEffects(playerId, 'timing-reveal-turn');

    this.resolveRewardChoices();
  }

  playerPassedConflict(playerId: number) {
    this.playersService.setTurnStateForPlayer(playerId, 'done');
  }

  async addAgentToField(field: ActionField) {
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

      if (reward.type === 'spice-accumulation' && this.boardSpacesService.boardSpaceHasAccumulatedSpice(field.title.en)) {
        const accumulatedSpice = this.boardSpacesService.getAccumulatedSpiceForBoardSpace(field.title.en);
        this.effectsService.addRewardToPlayer(activePlayer.id, { type: 'spice', amount: accumulatedSpice });
        this.boardSpacesService.resetAccumulatedSpiceOnBoardSpace(field.title.en);
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
        this.playerRewardChoicesService.addPlayerEitherOrChoice(activePlayer.id, {
          type: 'helper-or',
          effectLeft: { type: 'reward', effectRewards: [rewardOptionLeft] },
          effectRight: { type: 'reward', effectRewards: [rewardOptionRight] },
        });
      }
      if (field.conversionOptions) {
        const exclusiveID = crypto.randomUUID();
        for (const option of field.conversionOptions) {
          const [_, conversionEffect] = getStructuredConversionEffectIfPossible(option);
          if (conversionEffect) {
            this.playerRewardChoicesService.addPlayerConversionChoice(activePlayer.id, {
              type: 'helper-trade',
              effectCosts: conversionEffect.effectCosts,
              effectConversionRewards: conversionEffect.effectConversionRewards,
              exlusiveChoiceOfMultipleEffectsId: exclusiveID,
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
    this.turnInfoService.updatePlayerTurnInfo(activePlayer.id, { fieldsVisitedThisTurn: [field] });

    this.resolveImperiumCardEffects(playedCard, activePlayer, 'timing-agent-placed');
    this.resolveLeaderEffects(activePlayer.id, 'timing-agent-placed');
    await this.resolveTechTileEffects(activePlayer.id, 'timing-agent-placed');

    this.resolveRewardChoices();

    this.loggingService.logAgentAction(field);
  }

  private setPlayerAgentOnField(playerId: number, field: ActionField) {
    this.playerAgentsService.setPlayerAgentOnField(playerId, field.title.en);

    this.turnInfoService.setPlayerTurnInfo(playerId, { agentPlacedOnFieldId: field.title.en });

    this.loggingService.logPlayerSentAgentToField(playerId, this.t.translateLS(field.title));
  }

  liftPlayerAgentFromField(playerId: number, field: ActionField) {
    this.audioManager.playSound('click-reverse');

    const agentLiftTodo = this.playerRewardChoicesService.getPlayerRewardChoice(playerId, 'agent-lift');
    if (agentLiftTodo) {
      this.playerRewardChoicesService.removePlayerRewardChoice(playerId, agentLiftTodo.id);
    }

    this.playerAgentsService.removePlayerAgentFromField(playerId, field.title.en);
    this.loggingService.logPlayerLiftedAgentFromField(playerId, this.t.translateLS(field.title));
  }

  async endPlayerTurn(playerId: number) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    if (this.roundService.currentRoundPhase === 'agent-placement') {
      if (player.turnState === 'agent-placement') {
        this.cardsService.discardPlayedPlayerCard(playerId);
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
        this.aiManager.setPreferredFieldsForAIPlayer(nextPlayer.id);
        // if (nextPlayer.turnNumber === 1) {
        //   this.resolveLeaderEffects(nextPlayer.id, 'timing-round-start');
        //   await this.resolveTechTileEffects(nextPlayer.id, 'timing-round-start');
        // }
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
        this.aiManager.setPreferredFieldsForAIPlayer(player.id);
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
      const playerLocation = this.locationsService.getPlayerLocation(locationId);
      if (playerLocation?.playerId === playerId) {
        return;
      }

      let takeOverFromEnemy = false;

      if (playerLocation && playerLocation.playerId !== playerId) {
        takeOverFromEnemy = true;
      }

      if (playerLocation && takeOverFromEnemy) {
        const location = this.boardSpacesService.getBoardSpace(locationId);
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

      this.locationsService.setLocationOwner(locationId, playerId);
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

    this.resolveRewardChoices();

    this.intriguesService.trashPlayerIntrigue(playerId, intrigue.id);
    this.loggingService.logPlayerPlayedIntrigue(playerId, this.t.translateLS(intrigue.name));
    this.turnInfoService.updatePlayerTurnInfo(playerId, { intriguesPlayedThisTurn: [intrigue] });
  }

  trashPlayerIntrigue(playerId: number, intrigue: IntrigueDeckCard) {
    const intrigueTrashTodo = this.playerRewardChoicesService.getPlayerRewardChoice(playerId, 'intrigue-trash');
    if (intrigueTrashTodo) {
      this.playerRewardChoicesService.removePlayerRewardChoice(playerId, intrigueTrashTodo.id);
    }

    this.intriguesService.trashPlayerIntrigue(playerId, intrigue.id);
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

    this.loggingService.logPlayerPickedFactionInfluenceUpChoice(playerId, factionType, 1);
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
    this.loggingService.logPlayerPickedFactionInfluenceDownChoice(playerId, factionType);
  }

  addUnitsIntoCombat(playerId: number, unitType: 'troop' | 'dreadnought', amount: number) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const deployedUnits = this.effectsService.addUnitsToCombatIfPossible(playerId, unitType, amount);

    const currentConflict = this.conflictsService.currentConflict;
    if (!currentConflict && deployedUnits > 0) {
      this.playerRewardChoicesService.setPlayerConflictChoice(player.id, true);
      this.resolveRewardChoices();
    }
  }

  pickCurrentConflict(playerId: number, conflict: ConflictDeckCard) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    const conflictChoice = this.playerRewardChoicesService.getPlayerRewardChoices(playerId)?.conflictChoice;
    if (conflictChoice) {
      this.playerRewardChoicesService.removePlayerConflictChoice(playerId, conflictChoice.id);
    }

    this.conflictsService.setCurrentConflict(conflict.id);
    const boardSpace = conflict.boardSpaceId ? this.boardSpacesService.getBoardSpace(conflict.boardSpaceId) : undefined;
    const boardSpaceName = boardSpace && boardSpace.title ? this.t.translateLS(boardSpace.title) : undefined;
    this.loggingService.logPlayerPickedConflict(
      player.id,
      this.t.translateLS(conflict.name),
      this.roundService.currentRound,
      boardSpaceName,
    );
  }

  private resolveImperiumCardEffects(card: ImperiumDeckCard, player: Player, timing: EffectTimingType) {
    if (timing === 'timing-agent-placed') {
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

    this.resolveRewardChoices();
  }

  private resolveLeaderEffects(playerId: number, timing: EffectTimingType, ignoreStructuredEffects = false) {
    const player = this.playersService.getPlayer(playerId);
    const playerLeader = this.leadersService.getPlayerLeader(playerId);
    const leader = playerLeader?.leader;
    if (!player || !leader || playerLeader?.isFlipped) {
      return;
    }
    let effectsResolved = false;

    if (leader.customTimedFunctions) {
      for (const customTimedFunction of leader.customTimedFunctions) {
        if (customTimedFunction.timing === timing) {
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
          if (customTimedAIFunction.timing === timing) {
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

    this.resolveRewardChoices();
    return effectsResolved;
  }

  private async resolveTechTileEffects(playerId: number, timing: EffectTimingType) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return false;
    }

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

    this.resolveRewardChoices();
    return effectsResolved;
  }

  private resolveGameEffects(gameEffects: GameEffects) {
    if (gameEffects.imperiumRowCards) {
      this.cardsService.addCardsToImperiumRow(gameEffects.imperiumRowCards.amount);
    } else if (gameEffects.spiceAccumulation) {
      this.boardSpacesService.accumulateSpiceOnBoardSpaces(gameEffects.spiceAccumulation.amount);
    }
  }

  resolveRewardChoices() {
    for (const player of this.playersService.getPlayers()) {
      if (player.isAI) {
        this.aiResolveRewardChoices(player);
      } else {
        this.resolvePlayerRewardChoices(player);
      }
    }
  }

  private resolvePlayerRewardChoices(player: Player) {
    const gameState = this.getGameState(player);

    const playerRewardChoices = this.playerRewardChoicesService.getPlayerRewardChoices(player.id);
    const choicesBeingProcessed = this.playerRewardChoicesService.getPlayerRewardChoicesBeingProcessed(player.id);
    if (!playerRewardChoices || choicesBeingProcessed) {
      return;
    } else {
      this.playerRewardChoicesService.setPlayerRewardChoiceProcessing(player.id, true);
    }

    for (const rewardChoice of playerRewardChoices.rewardChoices) {
      const choiceType = rewardChoice.choice.type;
      const choiceAmount = rewardChoice.choice.amount ?? 1;

      if (choiceType === 'signet-ring') {
        for (let i = 0; i < choiceAmount; i++) {
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
          }
        }
      }
      this.playerRewardChoicesService.removePlayerRewardChoice(player.id, rewardChoice.id);
    }

    this.playerRewardChoicesService.setPlayerRewardChoiceProcessing(player.id, false);
  }

  aiResolveRewardChoices(player: Player, depth = 0) {
    if (depth > 2) {
      return;
    }

    const gameState = this.getGameState(player);

    const playerRewardChoices = this.playerRewardChoicesService.getPlayerRewardChoices(player.id);
    const choicesBeingProcessed = this.playerRewardChoicesService.getPlayerRewardChoicesBeingProcessed(player.id);
    if (!playerRewardChoices) {
      return;
    } else if (depth === 0 && choicesBeingProcessed) {
      return;
    } else if (!choicesBeingProcessed) {
      this.playerRewardChoicesService.setPlayerRewardChoiceProcessing(player.id, true);
    }

    for (const conversionChoice of playerRewardChoices.conversionEffectChoices) {
      const updatedPlayer = this.playersService.getPlayer(player.id);
      const updatedGameState = this.getGameState(player);

      if (updatedPlayer && updatedGameState) {
        this.aiManager.aiConvertRewardIfUsefulAndPossible(updatedPlayer, conversionChoice.choice, updatedGameState);

        this.playerRewardChoicesService.removePlayerConversionChoice(
          player.id,
          conversionChoice.id,
          conversionChoice.choice.exlusiveChoiceOfMultipleEffectsId,
        );
      }
    }
    for (const eitherOrChoice of playerRewardChoices.eitherOrEffectChoices) {
      const updatedPlayer = this.playersService.getPlayer(player.id);
      const updatedGameState = this.getGameState(player);

      if (updatedPlayer && updatedGameState) {
        this.aiManager.aiChooseRewardOption(
          updatedPlayer,
          eitherOrChoice.choice.effectLeft,
          eitherOrChoice.choice.effectRight,
          updatedGameState,
          eitherOrChoice.choice.element,
        );

        this.playerRewardChoicesService.removePlayerEitherOrChoice(
          player.id,
          eitherOrChoice.id,
          eitherOrChoice.choice.exlusiveChoiceOfMultipleEffectsId,
        );
      }
    }
    for (const rewardChoice of playerRewardChoices.rewardChoices) {
      const choiceType = rewardChoice.choice.type;
      const choiceAmount = rewardChoice.choice.amount ?? 1;

      if (choiceType === 'card-discard') {
        for (let i = 0; i < choiceAmount; i++) {
          this.aiManager.aiDiscardHandCard(player.id);
        }
      } else if (choiceType === 'intrigue-trash') {
        for (let i = 0; i < choiceAmount; i++) {
          this.aiManager.aiTrashIntrigue(player.id);
        }
      } else if (choiceType === 'agent-lift') {
        for (let i = 0; i < choiceAmount; i++) {
          const agentPlacedOnFieldId = this.turnInfoService.getPlayerTurnInfo(player.id, 'agentPlacedOnFieldId');
          const playerAgentsOnOtherFields = this.playerAgentsService
            .getPlayerAgentsOnFields(player.id)
            .filter((x) => x.fieldId !== agentPlacedOnFieldId);
          if (playerAgentsOnOtherFields.length > 0) {
            const locations = playerAgentsOnOtherFields.filter(
              (x) => this.boardSpacesService.getBoardSpace(x.fieldId)?.ownerReward,
            );
            const nonLocations = playerAgentsOnOtherFields.filter(
              (x) => !this.boardSpacesService.getBoardSpace(x.fieldId)?.ownerReward,
            );

            if (locations.length > 0) {
              shuffle(locations);
              this.playerAgentsService.removePlayerAgentFromField(player.id, locations[0].fieldId);
            } else if (nonLocations.length > 0) {
              shuffle(nonLocations);
              this.playerAgentsService.removePlayerAgentFromField(player.id, nonLocations[0].fieldId);
            }
          }
        }
      } else if (choiceType === 'location-control-choice') {
        for (let i = 0; i < choiceAmount; i++) {
          const updatedGameState = this.getGameState(player);
          const desiredLocation = this.aiBoardSpacesService.getLocationToControl(player, updatedGameState);
          if (desiredLocation) {
            this.changeLocationOwner(desiredLocation.actionField.title.en, player.id);
          }
        }
      } else if (choiceType === 'faction-influence-up-choice') {
        for (let i = 0; i < choiceAmount; i++) {
          const factionType = this.aiManager.getFactionInfluenceIncreaseChoice(player);
          if (factionType) {
            this.increasePlayerFactionScore(player.id, factionType);
          }
        }
      } else if (choiceType === 'faction-influence-up-twice-choice') {
        for (let i = 0; i < choiceAmount; i++) {
          this.aiManager.aiIncreaseFactionInfluenceChoiceTwice(player, choiceAmount);
        }
      } else if (choiceType === 'faction-influence-down-choice') {
        for (let i = 0; i < choiceAmount; i++) {
          const factionType = this.aiManager.getFactionInfluenceDecreaseChoice(player.id);
          if (factionType) {
            this.decreasePlayerFactionScore(player.id, factionType);
          }
        }
      } else if (choiceType === 'signet-ring') {
        for (let i = 0; i < choiceAmount; i++) {
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
          }
        }
      } else if (choiceType === 'card-return-to-hand') {
        const cardToReturn = this.aiManager.getCardToReturnToHandFromDiscardPile(player.id);
        if (cardToReturn) {
          this.returnDiscardedPlayerCardToHand(player.id, cardToReturn);
        }
      } else if (choiceType === 'card-trash') {
        for (let i = 0; i < choiceAmount; i++) {
          this.aiManager.aiTrashCardInPlay(player.id);
        }
      } else if (choiceType === 'card-trash-in-play') {
        for (let i = 0; i < choiceAmount; i++) {
          this.aiManager.aiTrashCardFromHand(player.id);
        }
      } else if (choiceType === 'card-trash-from-hand') {
        for (let i = 0; i < choiceAmount; i++) {
          this.aiManager.aiTrashCardFromDiscardPile(player.id);
        }
      } else if (choiceType === 'tech-tile-trash') {
        const techTile = this.aiManager.getTechTileToTrash(player.id);
        if (techTile) {
          this.techTilesService.trashPlayerTechTile(techTile.techTile.id);
          const trashEffect = techTilesGameAdjustments.find((x) => x.id === techTile.techTile.id)?.onTrashFunction;
          if (trashEffect) {
            trashEffect(player, gameState, this.getUsableGameCommands());
          }
          this.loggingService.logPlayerTrashedTechTile(player.id, this.t.translateLS(techTile.techTile.name));
        }
      } else if (choiceType === 'shipping') {
        const desiredEffects = this.effectEvaluationService.getDesiredRewardEffects(
          player,
          [{ type: 'spice' }, { type: 'water' }, { type: 'solari' }],
          gameState,
        );

        if (desiredEffects.length > 0) {
          this.effectsService.addRewardToPlayer(player.id, desiredEffects[0]);
        }
      }

      this.playerRewardChoicesService.removePlayerRewardChoice(player.id, rewardChoice.id);
    }
    if (playerRewardChoices.conflictChoice) {
      const playerAgentsOnFields = this.playerAgentsService.getPlayerAgentsOnFields(player.id);
      const pickableConflicts = this.conflictsService.conflictStack.filter((x) =>
        playerAgentsOnFields.some((y) => y.fieldId === x.boardSpaceId),
      );
      let pickedConflict: ConflictDeckCard | undefined = undefined;
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
          pickedConflict = pickableConflicts[0];
        } else {
          pickedConflict = pickableConflicts[pickableConflicts.length - 1];
        }
      }
      if (pickedConflict) {
        this.conflictsService.setCurrentConflict(pickedConflict.id);
        const boardSpace = pickedConflict.boardSpaceId
          ? this.boardSpacesService.getBoardSpace(pickedConflict.boardSpaceId)
          : undefined;
        const boardSpaceName = boardSpace && boardSpace.title ? this.t.translateLS(boardSpace.title) : undefined;
        this.loggingService.logPlayerPickedConflict(
          player.id,
          this.t.translateLS(pickableConflicts[0].name),
          this.roundService.currentRound,
          boardSpaceName,
        );
      }

      this.playerRewardChoicesService.removePlayerConflictChoice(player.id, playerRewardChoices.conflictChoice.id);
    }

    this.aiResolveRewardChoices(player, depth + 1);

    this.playerRewardChoicesService.setPlayerRewardChoiceProcessing(player.id, false);
  }

  aiAddUnitsToCombatIfPossible(player: Player) {
    const turnInfo = this.turnInfoService.getPlayerTurnInfos(player.id);
    let needsToPickConflict = false;

    if (turnInfo) {
      if (playerCanEnterCombat(turnInfo)) {
        const aiPlayer = this.aiPlayersService.getAIPlayer(player.id);
        if (aiPlayer) {
          const gameState = this.getGameState(player);
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
            this.playerRewardChoicesService.setPlayerConflictChoice(player.id, true);
            needsToPickConflict = true;
          }
        }
      }

      if (needsToPickConflict) {
        this.aiResolveRewardChoices(player);
      }
    }
  }

  aiBuyTechTileIfPossible(player: Player) {
    const turnInfo = this.turnInfoService.getPlayerTurnInfos(player.id);

    if (turnInfo) {
      if (turnInfo.canBuyTech) {
        const costModifiers = this.gameModifiersService.getPlayerGameModifier(player.id, 'techTiles');

        const desiredTechTile = this.aiManager.aiGetTechTileToBuyIfPossible(player.id, costModifiers);
        if (desiredTechTile) {
          const costModifier = getTechTileCostModifier(desiredTechTile, costModifiers);

          this.buyTechTileForPlayer(
            player,
            desiredTechTile,
            this.playersResourcesService.getPlayerResourceAmount(player.id, 'solari'),
            costModifier,
          );
        }
      }
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

      const targetPlayers = getStructuredEffectTargets(chosenEffect, player, realGameState);
      for (const targetPlayer of targetPlayers) {
        for (const reward of rewards) {
          this.effectsService.addRewardToPlayer(targetPlayer.id, reward, { gameElement: effect.element });
        }
        this.resolveRewardChoices();
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
      for (const cost of effectCosts) {
        this.effectsService.payCostForPlayer(player.id, cost, { gameElement: effect.element });
      }

      const rewards = getMultipliedRewardEffects(effect.effectConversionRewards, realGameState);

      const targetPlayers = getStructuredEffectTargets(effect.effectConversionRewards, player, realGameState);
      for (const targetPlayer of targetPlayers) {
        for (const reward of rewards) {
          this.effectsService.addRewardToPlayer(targetPlayer.id, reward, { gameElement: effect.element });
        }
        this.resolveRewardChoices();
      }

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

    const cardModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'imperiumRow');
    const calculatedModifier = getImperiumCardModifier(card, cardModifiers);
    if (calculatedModifier.isBlocked) {
      return;
    }
    const costModifier = calculatedModifier.costModifier + (options?.additionalCostModifier ?? 0);

    const availablePersuasion = this.playersResourcesService.getPlayerResourceAmount(playerId, 'persuasion');
    const totalPersuasionCosts = card.persuasionCosts ? card.persuasionCosts + costModifier : 0;
    const playerCanAffordCard = availablePersuasion >= totalPersuasionCosts;

    if (playerCanAffordCard) {
      if (card.persuasionCosts) {
        this.playersResourcesService.removeResourceFromPlayer(playerId, 'persuasion', totalPersuasionCosts);
      }
      if (card.type === 'imperium-card') {
        if (card.buyEffects) {
          for (const effect of card.buyEffects) {
            this.effectsService.addRewardToPlayer(player.id, effect, { source: 'Imperium Card Buy Effect' });
          }

          this.resolveRewardChoices();
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
    const hasTrashTodo = this.playerRewardChoicesService.getPlayerRewardChoice(playerId, 'card-trash');
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

    const availablePlayerSolari = this.playersResourcesService.getPlayerResourceAmount(playerId, 'solari');
    const playerCanAffordTechTile = techTile.costs + costModifier <= availablePlayerSolari;

    if (playerCanAffordTechTile) {
      this.buyTechTileForPlayer(player, techTile, availablePlayerSolari, 0);
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

        this.resolveRewardChoices();
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

        this.resolveRewardChoices();
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

  private getUsableGameCommands(): CardGameAdjustmentsGameInterface {
    return {
      // High-level game actions
      acquireImperiumCard: (playerId, card, source, options) => this.acquireImperiumCard(playerId, card, source, options),
      resolveRewardChoices: () => this.resolveRewardChoices(),
      playSound: (sound, chorusAmount) => this.audioManager.playSound(sound, chorusAmount),
      addRewardToPlayer: (playerId, reward) => this.effectsService.addRewardToPlayer(playerId, reward),
      payCostForPlayer: (playerId, cost, options) => this.effectsService.payCostForPlayer(playerId, cost, options),
      removeGameModifier: (playerId, modifierType, modifierId) =>
        this.gameModifiersService.removePlayerGameModifier(playerId, modifierType, modifierId),
      addPlayerGameModifiers: (playerId, modifiers) => this.gameModifiersService.addPlayerGameModifiers(playerId, modifiers),
      increaseAccumulatedSpiceOnBoardSpace: (boardSpaceId) =>
        this.boardSpacesService.increaseAccumulatedSpiceOnBoardSpace(boardSpaceId),
      removePlayerShipsFromCombat: (playerId, amount) => this.combatManager.retreatPlayerShipsFromCombat(playerId, amount),
      setPlayerAgentInTimeout: (playerId, fieldId) => this.playerAgentsService.setPlayerAgentInTimeout(playerId, fieldId),
      setLocationOwner: (boardSpaceId, playerId) => this.locationsService.setLocationOwner(boardSpaceId, playerId),
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
      retreatPlayerShipsFromCombat: (playerId, amount) => this.combatManager.retreatPlayerShipsFromCombat(playerId, amount),
      removePlayerTroopsFromCombat: (playerId, amount) => this.combatManager.retreatPlayerTroopsFromCombat(playerId, amount),
      addPlayerIntrigue: (playerId, intrigue) => this.intriguesService.addPlayerIntrigue(playerId, intrigue),
      trashPlayerIntrigue: (playerId, intrigueId, addToDiscardPile?) =>
        this.intriguesService.trashPlayerIntrigue(playerId, intrigueId, addToDiscardPile),
      removePersuasionFromPlayer: (playerId, amount) =>
        this.playersResourcesService.removeResourceFromPlayer(playerId, 'persuasion', amount),
      getAllBuyableCards: (playerId) => this.cardsService.getAllBuyableCards(playerId),
      getBoardSpaceColor: (actionType) => this.settingsService.getBoardSpaceColor(actionType),
      ai: {
        getImperiumCardToBuy: (availablePersuasion, cards, player, gameState, imperiumRowModifiers) =>
          this.aiCardsService.getImperiumCardToBuy(availablePersuasion, cards, player, gameState, imperiumRowModifiers),
        getCardToTrash: (cards, player, gameState) => this.aiCardsService.getCardToTrash(cards, player, gameState),
        getDesiredRewardEffects: (player, resourceOptions, gameState) =>
          this.effectEvaluationService.getDesiredRewardEffects(player, resourceOptions, gameState),
        getStructuredEffectUsefulnesAndCosts: (player, effect, gameState) =>
          this.effectEvaluationService.getStructuredEffectUsefulnesAndCosts(player, effect, gameState),
      },
      trashImperiumCard: (playerId, card, source) => this.trashImperiumCard(playerId, card, source),
      removeCardFromImperiumRow: (card) => this.cardsService.removeCardFromImperiumRow(card),
      updatePlayerTurnInfo: (playerId, turnInfo) => this.turnInfoService.updatePlayerTurnInfo(playerId, turnInfo),
      getPlayableCombatIntrigues: (player, gameState, playerCombatIntrigues) =>
        this.aIConflictService.getPlayableCombatIntrigues(player, gameState, playerCombatIntrigues),
      acquireTechTile: (playerId, techTile) => this.acquirePlayerTechTile(playerId, techTile),
      getBuyableTechTiles: () => this.techTilesService.buyableTechTiles,
      trashPlayerTechTile: (playerId, techTile) => this.trashPlayerTechTile(playerId, techTile),
      discardPlayerHandCard: (playerId, card) => this.cardsService.discardPlayerHandCard(playerId, card),
      returnDiscardedPlayerCardToHand: (playerId, card) => this.returnDiscardedPlayerCardToHand(playerId, card),
      addPlayerRewardChoice: (playerId, reward) => this.playerRewardChoicesService.addPlayerRewardChoice(playerId, reward),
      addPlayerConversionChoice: (playerId, reward) =>
        this.playerRewardChoicesService.addPlayerConversionChoice(playerId, reward),
      removePlayerRewardChoice: (playerId, id) => this.playerRewardChoicesService.removePlayerRewardChoice(playerId, id),
      dialog: this.dialog,
      translation: this.t,
    };
  }

  private buyTechTileForPlayer(player: Player, techTile: TechTileDeckCard, solariAmount: number, discount: number) {
    const effectiveCosts = techTile.costs - discount;

    if (effectiveCosts > solariAmount) {
      this.notificationService.showWarning(this.t.translate('playerboardWarningNotEnoughResources'));
    }

    if (effectiveCosts > 0) {
      const techCosts = effectiveCosts > solariAmount ? solariAmount : effectiveCosts;
      this.playersResourcesService.removeResourceFromPlayer(player.id, 'solari', techCosts);
      this.loggingService.logPlayerResourcePaid(player.id, 'tech', techCosts);
    }

    this.techTilesService.setPlayerTechTile(player.id, techTile.name.en);

    if (techTile.buyEffects) {
      for (const reward of techTile.buyEffects) {
        this.effectsService.addRewardToPlayer(player.id, reward, { source: 'Tech Tile Buy Effect' });
      }

      this.resolveRewardChoices();
    }
    if (techTile.gameModifiers) {
      this.gameModifiersService.addPlayerGameModifiers(player.id, techTile.gameModifiers);
    }

    this.audioManager.playSound('aquire-tech');

    this.loggingService.logPlayerBoughtTechTile(player.id, this.t.translateLS(techTile.name));
    this.turnInfoService.updatePlayerTurnInfo(player.id, { techTilesBoughtThisTurn: [techTile] });
  }

  private shouldTriggerFinale() {
    const players = this.playersService.getPlayers();
    const playerCount = players.length;

    const finaleTrigger = this.settingsService
      .getFinaleTriggers()
      .filter((trigger) => trigger.playerCount <= playerCount)
      .sort((a, b) => a.playerCount - b.playerCount)
      .pop()?.trigger;

    if (finaleTrigger) {
      return this.playerScoreManager.playerScores.some((x) => x.victoryPoints >= finaleTrigger);
    } else {
      return false;
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

    this.resolveRewardChoices();
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

      const leaderEffectsHandled = this.resolveLeaderEffects(playerId, 'timing-turn-start');

      if (this.turnInfoService.getPlayerTurnInfo(playerId, 'needsToPassTurn')) {
        this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
        return;
      }

      const techTilesPlayed = await this.resolveTechTileEffects(playerId, 'timing-turn-start');

      if (this.turnInfoService.getPlayerTurnInfo(playerId, 'needsToPassTurn')) {
        this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
        return;
      }

      // AI Play Intrigues
      const playerIntrigues = this.intriguesService.getPlayerIntrigues(player.id, 'complot') ?? [];

      let intriguesPlayed = false;
      let playerIntrigueCount = playerIntrigues.length;
      for (const intrigue of playerIntrigues) {
        const player = this.playersService.getPlayer(playerId)!;
        const gameState = this.getGameState(player);

        const isPlayableAndUseful = this.aiCardsService.aiIsPlayableAndUsefulIntrigue(player, intrigue, gameState);
        if (isPlayableAndUseful && (Math.random() < 0.4 + 0.4 * playerIntrigueCount || gameState.isFinale)) {
          this.aiManager.aiPlayIntrigue(player, intrigue, gameState);
          this.resolveRewardChoices();

          intriguesPlayed = true;
          playerIntrigueCount -= 1;
          await delay(2000);

          if (this.turnInfoService.getPlayerTurnInfo(playerId, 'needsToPassTurn')) {
            this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
            return;
          }
        }
      }

      if (leaderEffectsHandled || techTilesPlayed || intriguesPlayed) {
        this.aiManager.setPreferredFieldsForAIPlayer(player.id);
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

          const boardField = this.boardSpacesService.boardSpaces.find((x) =>
            cardAndField?.preferredField.fieldId.includes(x.title.en),
          );
          if (boardField && cardAndField) {
            this.cardsService.setPlayedPlayerCard(playerId, cardAndField.cardToPlay.id);
            this.loggingService.logPlayerPlayedCard(playerId, this.t.translateLS(cardAndField.cardToPlay.name));
            this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsPlayedThisTurn: [cardAndField.cardToPlay] });
            await this.addAgentToField(boardField);

            couldPlaceAgent = true;
            this.aiBuyTechTileIfPossible(player);
            this.aiAddUnitsToCombatIfPossible(player);
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
          const playerPersuasionAvailable = this.playersResourcesService.getPlayerResourceAmount(playerId, 'persuasion');

          const cardBought = this.aiManager.aiBuyImperiumCard(playerId, playerPersuasionAvailable);
          if (cardBought) {
            this.aiResolveRewardChoices(player);
          } else {
            break;
          }
        }

        const playerPersuasionLeft = this.playersResourcesService.getPlayerResourceAmount(playerId, 'persuasion');
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

        this.aiBuyTechTileIfPossible(player);
        this.aiAddUnitsToCombatIfPossible(player);

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

        this.resolveLeaderEffects(playerId, 'timing-combat');

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
                this.resolveRewardChoices();
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
                this.resolveRewardChoices();
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
      this.boardSpacesService.accumulatedSpiceOnBoardSpaces,
    );
  }
}
