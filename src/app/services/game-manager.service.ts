import { Injectable } from '@angular/core';
import { cloneDeep, flatten, max, shuffle } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { getPlayerdreadnoughtCount } from '../helpers/combat-units';
import { getRandomElementFromArray, sum } from '../helpers/common';
import { getFactionScoreTypeFromCost, getFactionScoreTypeFromReward, isFactionScoreType } from '../helpers/faction-score';
import { isActiveFactionType } from '../helpers/faction-types';
import {
  getCardCostModifier,
  getFactionInfluenceModifier,
  getFieldIsBlocked,
  getModifiedCostsForField,
  getModifiedRewardsForField,
  getTechTileCostModifier,
  hasFactionInfluenceModifier,
} from '../helpers/game-modifiers';
import { isResource, isResourceType } from '../helpers/resources';
import {
  getStructuredChoiceEffectIfPossible,
  isConversionEffectType,
  isFactionScoreCostType,
  isFactionScoreRewardType,
  isOptionEffectType,
  isRewardEffect,
  isStructuredChoiceEffect,
  isStructuredConditionalEffect,
} from '../helpers/rewards';
import {
  ActionField,
  ActionType,
  DuneLocation,
  Effect,
  EffectReward,
  EffectRewardType,
  StructuredChoiceEffect,
  StructuredConditionalEffect,
  StructuredEffects,
  StructuredTimingEffect,
} from '../models';
import { IntrigueDeckCard } from '../models/intrigue';
import { Player } from '../models/player';
import { TechTileCard } from '../models/tech-tile';
import { AIManager } from './ai/ai.manager';
import { PlayerCardsFactions as Factions, GameState, PlayerCardsFieldAccess, PlayerCardsRewards } from './ai/models';
import { AudioManager } from './audio-manager.service';
import { CardsService, ImperiumDeckCard, ImperiumRowCard, ImperiumRowPlot } from './cards.service';
import { CombatManager, PlayerCombatScore, PlayerCombatUnits } from './combat-manager.service';
import { ConflictsService } from './conflicts.service';
import { DuneEventsManager } from './dune-events.service';
import { GameModifiersService } from './game-modifier.service';
import { IntriguesService } from './intrigues.service';
import { LeaderDeckCard, LeadersService } from './leaders.service';
import { LocationManager } from './location-manager.service';
import { LoggingService } from './log.service';
import { MinorHousesService } from './minor-houses.service';
import { NotificationService } from './notification.service';
import { PlayerRewardChoicesService } from './player-reward-choices.service';
import { PlayerFactionScoreType, PlayerScore, PlayerScoreManager } from './player-score-manager.service';
import { PlayersService } from './players.service';
import { SettingsService } from './settings.service';
import { TechTileDeckCard, TechTilesService } from './tech-tiles.service';
import { TranslateService } from './translate-service';
import { TurnInfoService } from './turn-info.service';

export interface AgentOnField {
  fieldId: string;
  playerId: number;
}

export interface PlayerAgents {
  playerId: number;
  agentAmount: number;
}

export interface SpiceAccumulation {
  fieldId: string;
  amount: number;
}

export interface BaseGameEffect {
  id: string;
  amount: number;
}

export interface GameEffects {
  imperiumRowCards?: BaseGameEffect;
  spiceAccumulation?: BaseGameEffect;
}

export type RoundPhaseType = 'none' | 'agent-placement' | 'combat' | 'combat-resolvement' | 'done';

export type GameElement = { type: 'card'; object: ImperiumDeckCard } | { type: 'tech-tile'; object: TechTileDeckCard };

@Injectable({
  providedIn: 'root',
})
export class GameManager {
  public autoPlayAI = false;

  private currentRoundSubject = new BehaviorSubject<number>(0);
  public currentRound$ = this.currentRoundSubject.asObservable();

  private currentRoundPhaseSubject = new BehaviorSubject<RoundPhaseType>('none');
  public currentRoundPhase$ = this.currentRoundPhaseSubject.asObservable();

  private startingPlayerIdSubject = new BehaviorSubject<number>(0);
  public startingPlayerId$ = this.startingPlayerIdSubject.asObservable();

  private activePlayerIdSubject = new BehaviorSubject<number>(0);
  public activePlayerId$ = this.activePlayerIdSubject.asObservable();

  private availablePlayerAgentsSubject = new BehaviorSubject<PlayerAgents[]>([]);
  public availablePlayerAgents$ = this.availablePlayerAgentsSubject.asObservable();

  private agentsOnFieldsSubject = new BehaviorSubject<AgentOnField[]>([]);
  public agentsOnFields$ = this.agentsOnFieldsSubject.asObservable();

  private accumulatedSpiceOnFieldsSubject = new BehaviorSubject<SpiceAccumulation[]>([]);
  public accumulatedSpiceOnFields$ = this.accumulatedSpiceOnFieldsSubject.asObservable();

  private isFinaleSubject = new BehaviorSubject<boolean>(false);
  public isFinale$ = this.isFinaleSubject.asObservable();

  constructor(
    private playerScoreManager: PlayerScoreManager,
    private playerManager: PlayersService,
    private combatManager: CombatManager,
    private locationManager: LocationManager,
    private loggingService: LoggingService,
    private duneEventsManager: DuneEventsManager,
    private aIManager: AIManager,
    private leadersService: LeadersService,
    private conflictsService: ConflictsService,
    private minorHousesService: MinorHousesService,
    private techTilesService: TechTilesService,
    private audioManager: AudioManager,
    private settingsService: SettingsService,
    private cardsService: CardsService,
    private gameModifiersService: GameModifiersService,
    private playerRewardChoicesService: PlayerRewardChoicesService,
    private t: TranslateService,
    private intriguesService: IntriguesService,
    private turnInfoService: TurnInfoService,
    private notificationService: NotificationService
  ) {
    const currentRoundString = localStorage.getItem('currentRound');
    if (currentRoundString) {
      const currentRound = JSON.parse(currentRoundString) as number;
      this.currentRoundSubject.next(currentRound);
    }

    const startingPlayerIdString = localStorage.getItem('startingPlayerId');
    if (startingPlayerIdString) {
      const startingPlayerId = JSON.parse(startingPlayerIdString) as number;
      this.startingPlayerIdSubject.next(startingPlayerId);
    }

    const accumulatedSpiceOnFieldsString = localStorage.getItem('accumulatedSpiceOnFields');
    if (accumulatedSpiceOnFieldsString) {
      const accumulatedSpiceOnFields = JSON.parse(accumulatedSpiceOnFieldsString) as SpiceAccumulation[];
      this.accumulatedSpiceOnFieldsSubject.next(accumulatedSpiceOnFields);
    }

    const currentRoundPhaseString = localStorage.getItem('currentRoundPhase');
    if (currentRoundPhaseString) {
      const currentRoundPhase = JSON.parse(currentRoundPhaseString) as RoundPhaseType;
      this.currentRoundPhaseSubject.next(currentRoundPhase);
    }

    const availablePlayerAgentsString = localStorage.getItem('availablePlayerAgents');
    if (availablePlayerAgentsString) {
      const availablePlayerAgents = JSON.parse(availablePlayerAgentsString) as PlayerAgents[];
      this.availablePlayerAgentsSubject.next(availablePlayerAgents);
    }

    const agentsOnFieldsString = localStorage.getItem('agentsOnFields');
    if (agentsOnFieldsString) {
      const agentsOnFields = JSON.parse(agentsOnFieldsString) as AgentOnField[];
      this.agentsOnFieldsSubject.next(agentsOnFields);
    }

    const activePlayerIdString = localStorage.getItem('activePlayerId');
    if (activePlayerIdString) {
      const activePlayerId = JSON.parse(activePlayerIdString) as number;
      this.activePlayerIdSubject.next(activePlayerId);
    }

    const isFinaleString = localStorage.getItem('isFinale');
    if (isFinaleString) {
      const isFinale = JSON.parse(isFinaleString) as boolean;
      this.isFinaleSubject.next(isFinale);
    }

    this.currentRound$.subscribe((currentRound) => {
      localStorage.setItem('currentRound', JSON.stringify(currentRound));
    });

    this.startingPlayerId$.subscribe((startingPlayerId) => {
      localStorage.setItem('startingPlayerId', JSON.stringify(startingPlayerId));
    });

    this.accumulatedSpiceOnFields$.subscribe((accumulatedSpiceOnFields) => {
      localStorage.setItem('accumulatedSpiceOnFields', JSON.stringify(accumulatedSpiceOnFields));
    });

    this.currentRoundPhase$.subscribe((currentRoundPhase) => {
      localStorage.setItem('currentRoundPhase', JSON.stringify(currentRoundPhase));
    });

    this.availablePlayerAgents$.subscribe((availablePlayerAgents) => {
      localStorage.setItem('availablePlayerAgents', JSON.stringify(availablePlayerAgents));
    });

    this.agentsOnFields$.subscribe((agentsOnFields) => {
      localStorage.setItem('agentsOnFields', JSON.stringify(agentsOnFields));
    });

    this.activePlayerId$.subscribe((activePlayerId) => {
      localStorage.setItem('activePlayerId', JSON.stringify(activePlayerId));

      // if (this.autoPlayAI) {
      //   const activePlayerAgentCount = this.getAvailableAgentCountForPlayer(activePlayerId);

      //   if (activePlayerAgentCount > 0) {
      //     setTimeout(() => {
      //       const preferredField = this.aIManager.getPreferredFieldForPlayer(activePlayerId);
      //       if (preferredField) {
      //         this.addAgentToField(preferredField);
      //         this.setNextPlayerActive('agent-placement');
      //       }
      //     }, 1000);
      //   }
      // }
    });

    this.isFinale$.subscribe((isFinale) => {
      localStorage.setItem('isFinale', JSON.stringify(isFinale));
    });
  }

  public get currentRound() {
    return cloneDeep(this.currentRoundSubject.value);
  }

  public get startingPlayerId() {
    return cloneDeep(this.startingPlayerIdSubject.value);
  }

  public get activePlayerId() {
    return cloneDeep(this.activePlayerIdSubject.value);
  }

  public get availablePlayerAgents() {
    return cloneDeep(this.availablePlayerAgentsSubject.value);
  }

  public get agentsOnFields() {
    return cloneDeep(this.agentsOnFieldsSubject.value);
  }

  public get accumulatedSpiceOnFields() {
    return cloneDeep(this.accumulatedSpiceOnFieldsSubject.value);
  }

  public get currentRoundPhase() {
    return cloneDeep(this.currentRoundPhaseSubject.value);
  }

  public getActivePlayer() {
    return this.playerManager.getPlayer(this.activePlayerId);
  }

  public getPlayerAgentsOnFields(playerId: number) {
    return cloneDeep(this.agentsOnFieldsSubject.value.filter((x) => x.playerId === playerId));
  }

  public getAvailableAgentCountForPlayer(playerId: number) {
    return this.availablePlayerAgents.find((x) => x.playerId === playerId)?.agentAmount ?? 0;
  }

  public get isFinale() {
    return cloneDeep(this.isFinaleSubject.value);
  }

  public startGame() {
    this.loggingService.clearLogs();
    this.audioManager.playSound('atmospheric');
    this.gameModifiersService.resetAllPlayerGameModifiers();
    const newPlayers = this.playerManager.resetPlayers();
    this.combatManager.resetAdditionalCombatPower();
    this.combatManager.deleteAllPlayerTroopsFromCombat();
    this.combatManager.resetAllPlayerShips();
    this.combatManager.setInitialPlayerCombatUnits(newPlayers);
    this.locationManager.resetLocationOwners();
    this.playerRewardChoicesService.resetPlayerRewardChoices();

    this.playerScoreManager.resetPlayersScores(newPlayers);
    this.playerScoreManager.resetPlayerAlliances();
    this.removePlayerAgentsFromBoard();
    this.resetAccumulatedSpiceOnFields();

    this.cardsService.setLimitedCustomCards();
    this.cardsService.setUnlimitedCustomCards();
    this.cardsService.createImperiumDeck();
    this.cardsService.setInitialPlayerDecks();
    this.intriguesService.createIntrigueDeck();
    this.aIManager.assignPersonalitiesToAIPlayers(newPlayers);
    this.leadersService.createLeaderDeck();
    this.leadersService.assignRandomLeadersToPlayers(newPlayers);
    this.conflictsService.createConflictDeck();
    this.minorHousesService.setInitialAvailableHouses();
    this.techTilesService.createTechTileDeck();

    this.currentRoundSubject.next(1);
    this.currentRoundPhaseSubject.next('agent-placement');
    this.startingPlayerIdSubject.next(1);
    this.activePlayerIdSubject.next(1);

    for (const player of newPlayers) {
      this.cardsService.drawPlayerCardsFromDeck(player.id, player.cardsDrawnAtRoundStart);

      if (player.isAI && player.id === this.startingPlayerId) {
        this.setCurrentAIPlayer(this.startingPlayerId);

        this.setPreferredFieldsForAIPlayer(this.startingPlayerId);
      }
    }

    this.turnInfoService.resetTurnInfos();

    if (this.settingsService.eventsEnabled) {
      this.duneEventsManager.setEventDeck();

      const event = this.duneEventsManager.getCurrentEvent();
      if (event) {
        const players = this.playerManager.getPlayers();
        if (event.gameEffects) {
          this.resolveGameEffects(event.gameEffects);
        }

        for (const player of players) {
          if (event.gameModifiers) {
            this.gameModifiersService.addPlayerGameModifiers(player.id, event.gameModifiers);
          }
          if (event.immediatePlayerEffects) {
            const gameState = this.getGameState(player);
            this.resolveStructuredEffects(event.immediatePlayerEffects, player, gameState);
          }
        }
      }
    }
  }

  public resolveConflict() {
    this.audioManager.playSound('fog');

    let playerCombatScores = this.combatManager.getPlayerCombatScores().filter((x) => x.score > 0);
    playerCombatScores.sort((a, b) => b.score - a.score);

    const conflictRewards = this.conflictsService.currentConflict.rewards;

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
          const player = this.playerManager.getPlayer(playerScore.playerId);
          if (player) {
            for (const reward of conflictReward) {
              this.addRewardToPlayer(player.id, reward, undefined, 'Combat');
            }

            this.resolveRewardChoices(player);

            playerCombatScores = playerCombatScores.filter((x) => x.playerId !== playerScore.playerId);
          }
        }

        previousWasTie = false;
      } else if (!isTie) {
        const player = this.playerManager.getPlayer(firstPlayer.playerId);

        if (player) {
          for (const reward of conflictReward) {
            this.addRewardToPlayer(player.id, reward, undefined, 'Combat');
          }

          this.resolveRewardChoices(player);

          if (isFirstCycle) {
            const dreadnoughtCount = this.combatManager.getPlayerCombatUnits(player.id)?.shipsInCombat;
            if (dreadnoughtCount && dreadnoughtCount > 0) {
              if (!player.isAI) {
                this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
                  type: 'location-control',
                  amount: dreadnoughtCount,
                });
              } else {
                this.aiControlLocations(player, dreadnoughtCount);
              }
            }

            this.loggingService.logPlayerWonCombat(player.id, this.currentRound);
          }
        }

        playerCombatScores = playerCombatScores.filter((x) => x.playerId !== firstPlayer.playerId);
      } else {
        previousWasTie = true;
      }
      isFirstCycle = false;
    }

    this.currentRoundPhaseSubject.next('combat-resolvement');
  }

  public setNextRound() {
    this.audioManager.playSound('ping');
    this.gameModifiersService.removeTemporaryGameModifiers();

    this.accumulateSpiceOnFields();
    this.removePlayerAgentsFromBoard();
    this.combatManager.setAllPlayerShipsFromTimeoutToGarrison();
    this.combatManager.setAllPlayerShipsFromCombatToTimeout();
    this.combatManager.deleteAllPlayerTroopsFromCombat();
    this.combatManager.resetAdditionalCombatPower();
    this.playerManager.resetPersuasionForPlayers();
    this.playerManager.resetTurnStateForPlayers();

    this.conflictsService.setNextConflict();

    if (this.shouldTriggerFinale()) {
      this.isFinaleSubject.next(true);
    }

    this.currentRoundSubject.next(this.currentRoundSubject.value + 1);
    this.currentRoundPhaseSubject.next('agent-placement');

    this.startingPlayerIdSubject.next(
      this.playerManager.getPlayerCount() > this.startingPlayerId ? this.startingPlayerId + 1 : 1
    );

    this.activePlayerIdSubject.next(this.startingPlayerId);

    this.cardsService.churnAndClearImperiumRow();
    this.cardsService.discardAllPlayerHandCards();
    this.cardsService.shufflePlayerDiscardPilesUnderDecks();

    for (const player of this.playerManager.getPlayers()) {
      this.cardsService.drawPlayerCardsFromDeck(player.id, player.cardsDrawnAtRoundStart);

      this.setCurrentAIPlayer(this.startingPlayerId);
      if (player.isAI && player.id === this.startingPlayerId) {
        this.setPreferredFieldsForAIPlayer(this.startingPlayerId);
      }
    }

    this.techTilesService.unFlipTechTiles();

    const nextEvent = this.duneEventsManager.setNextEvent();
    if (nextEvent && nextEvent.gameEffects) {
      this.resolveGameEffects(nextEvent.gameEffects);
    }

    const players = this.playerManager.getPlayers();
    for (const player of players) {
      if (nextEvent) {
        if (nextEvent.gameModifiers) {
          this.gameModifiersService.addPlayerGameModifiers(player.id, nextEvent.gameModifiers);
        }
        if (nextEvent.immediatePlayerEffects) {
          const gameState = this.getGameState(player);
          this.resolveStructuredEffects(nextEvent.immediatePlayerEffects, player, gameState);
        }
      }

      const playerLeader = this.leadersService.getLeader(player.id);
      const leaderPassiveTimingEffects = playerLeader?.structuredPassiveEffects?.timingEffects;
      if (leaderPassiveTimingEffects) {
        const gameState = this.getGameState(player);

        for (const effect of leaderPassiveTimingEffects) {
          this.resolveStructuredTimingEffects(effect, player, gameState);
        }
      }

      this.resolveRewardChoices(player);
    }
  }

  public finishGame() {
    this.audioManager.playSound('atmospheric');
    this.removePlayerAgentsFromBoard();
    this.combatManager.resetAdditionalCombatPower();
    this.loggingService.printLogs();
    this.currentRoundSubject.next(0);
    this.currentRoundPhaseSubject.next('none');
    this.startingPlayerIdSubject.next(0);
    this.activePlayerIdSubject.next(0);
    this.duneEventsManager.resetEventDeck();
    this.leadersService.resetLeaders();
    this.conflictsService.resetConflicts();
    this.cardsService.resetPlayerHandCards();
    this.cardsService.resetPlayerPlots();
    this.cardsService.resetPlayerTrashPiles();

    this.isFinaleSubject.next(false);
  }

  public setPlayerRevealTurn(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);

    if (!player) {
      return;
    }

    this.playerManager.setTurnStateForPlayer(playerId, 'reveal');

    const playerLocations = this.locationManager.getPlayerLocations(playerId);
    for (const playerLocation of playerLocations) {
      const location = this.settingsService.getBoardLocation(playerLocation.locationId);
      if (location && location.ownerReward) {
        this.addRewardToPlayer(player.id, location.ownerReward);
      }
    }

    const playerHand = this.cardsService.getPlayerHand(playerId);
    if (playerHand) {
      for (const card of playerHand.cards) {
        if (card.structuredRevealEffects) {
          const gameState = this.getGameState(player);

          this.resolveStructuredEffects(
            card.structuredRevealEffects,
            player,
            gameState,
            { type: 'card', object: card },
            playerHand.cards.filter((x) => x.id !== card.id)
          );
        }
        if (card.customRevealEffect?.en) {
          const localizedString = this.t.translateLS(card.customRevealEffect);
          this.playerRewardChoicesService.addPlayerCustomChoice(playerId, localizedString);
        }
      }
    }

    const playerLeader = this.leadersService.getLeader(player.id);
    const leaderPassiveTimingEffects = playerLeader?.structuredPassiveEffects?.timingEffects;
    if (leaderPassiveTimingEffects) {
      const gameState = this.getGameState(player);
      const updatedPlayer = this.playerManager.getPlayer(playerId);
      if (updatedPlayer) {
        for (const effect of leaderPassiveTimingEffects) {
          this.resolveStructuredTimingEffects(effect, updatedPlayer, gameState);
        }
      }
    }

    this.resolveRewardChoices(player);
  }

  public playerPassedConflict(playerId: number) {
    this.playerManager.setTurnStateForPlayer(playerId, 'done');
  }

  private removePlayerAgentsFromBoard() {
    this.agentsOnFieldsSubject.next([]);

    const playerAgents: PlayerAgents[] = [];
    for (let player of this.playerManager.getPlayers()) {
      playerAgents.push({ playerId: player.id, agentAmount: player.agents });
    }

    this.availablePlayerAgentsSubject.next(playerAgents);
  }

  public addAgentToField(field: ActionField) {
    const activePlayer = this.getActivePlayer();

    if (this.currentRoundPhase !== 'agent-placement' || !activePlayer || activePlayer.turnState !== 'agent-placement') {
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

    const activePlayerAgentCount = this.getAvailableAgentCountForPlayer(activePlayer.id);
    if (activePlayerAgentCount < 1) {
      this.notificationService.showWarning(this.t.translate('playerboardWarningNoAgentsLeft'));
      return;
    }

    const agentAlreadyPlacedThisTurn = this.turnInfoService.getPlayerTurnInfo(activePlayer.id)?.agentPlacedOnFieldId;
    if (agentAlreadyPlacedThisTurn) {
      this.notificationService.showWarning(this.t.translate('playerboardWarningAgentAlreadyPlacedThisTurn'));
      return;
    }

    const gameModifiers = this.gameModifiersService.getPlayerGameModifiers(activePlayer.id);

    if (getFieldIsBlocked(field, gameModifiers?.fieldBlock)) {
      this.notificationService.showWarning(this.t.translate('playerboardWarningFieldIsBlocked'));
      return;
    }

    const fieldCosts = getModifiedCostsForField(field, gameModifiers?.fieldCost);

    if (fieldCosts) {
      if (!this.playerCanPayCosts(activePlayer.id, fieldCosts)) {
        this.notificationService.showWarning(this.t.translate('playerboardWarningNotEnoughResources'));
        return;
      }

      for (let cost of fieldCosts) {
        if (isResource(cost)) {
          this.playerManager.removeResourceFromPlayer(activePlayer.id, cost.type, cost.amount ?? 1);
        }
      }
    }

    this.audioManager.playSound('click');

    this.setPlayerOnField(activePlayer.id, field);

    const fieldRewards = getModifiedRewardsForField(field, gameModifiers?.fieldReward);

    const { rewardOptionIndex, hasRewardOptions } = this.aIManager.getRewardArrayAIInfos(fieldRewards);
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

    for (const reward of rewards) {
      this.addRewardToPlayer(activePlayer.id, reward);

      if (reward.type === 'spice-accumulation' && this.fieldHasAccumulatedSpice(field.title.en)) {
        const accumulatedSpice = this.getAccumulatedSpiceForField(field.title.en);
        this.addRewardToPlayer(activePlayer.id, { type: 'spice', amount: accumulatedSpice });
        this.resetAccumulatedSpiceOnField(field.title.en);
      }
    }

    if (isActiveFactionType(field.actionType)) {
      if (hasFactionInfluenceModifier(gameModifiers, field.actionType)) {
        const factionInfluenceModifier = getFactionInfluenceModifier(gameModifiers, field.actionType);
        if (factionInfluenceModifier) {
          if (factionInfluenceModifier.noInfluence) {
            if (factionInfluenceModifier.alternateReward) {
              this.addRewardToPlayer(activePlayer.id, factionInfluenceModifier.alternateReward);
            }
          }
        }
      } else {
        this.audioManager.playSound('influence');
        const factionRewards = this.playerScoreManager.addFactionScore(
          activePlayer.id,
          field.actionType,
          1,
          this.currentRound
        );

        for (const reward of factionRewards) {
          this.addRewardToPlayer(activePlayer.id, reward);
        }
      }
    }

    this.addPlayedCardRewards(playedCard, activePlayer, activePlayer.isAI);

    if (!activePlayer.isAI) {
      if (hasRewardOptions && rewardOptionLeft && rewardOptionRight) {
        this.playerRewardChoicesService.addPlayerRewardsChoice(activePlayer.id, [
          rewardOptionLeft,
          { type: 'helper-or' },
          rewardOptionRight,
        ]);
      }
      if (field.conversionOptions) {
        for (const option of field.conversionOptions) {
          this.playerRewardChoicesService.addPlayerRewardsChoice(activePlayer.id, option);
        }
      }
    } else if (activePlayer.isAI) {
      const aiPlayer = this.aIManager.getAIPlayer(activePlayer.id);

      if (activePlayer && aiPlayer) {
        if (hasRewardOptions && rewardOptionLeft && rewardOptionRight) {
          const aiDecision = this.aIManager.getFieldDecision(activePlayer.id, field.title.en);
          if (rewardOptionLeft.type.includes(aiDecision)) {
            this.addRewardToPlayer(activePlayer.id, rewardOptionLeft);
          } else {
            this.addRewardToPlayer(activePlayer.id, rewardOptionRight);
          }
        }

        if (field.conversionOptions) {
          const gameState = this.getGameState(activePlayer);

          let favoredConversionValue = 0;
          let favoredConversion: { costs: EffectReward[]; rewards: EffectReward[] } | undefined;

          for (const conversionOption of field.conversionOptions) {
            const [_, choiceEffect] = getStructuredChoiceEffectIfPossible(conversionOption);
            if (choiceEffect) {
              if (this.playerCanPayCosts(activePlayer.id, choiceEffect.left)) {
                const costsEvaluation = this.aIManager.getCostsArrayEvaluationForTurnState(
                  choiceEffect.left,
                  activePlayer,
                  gameState
                );
                const conversionValue =
                  this.aIManager.getRewardArrayEvaluationForTurnState(choiceEffect.right, activePlayer, gameState) -
                  costsEvaluation;

                if (conversionValue > favoredConversionValue) {
                  favoredConversionValue = conversionValue;
                  favoredConversion = { costs: choiceEffect.left, rewards: choiceEffect.right };
                }
              }
            }
          }

          if (favoredConversion) {
            for (const cost of favoredConversion.costs) {
              this.payCostForPlayer(activePlayer.id, cost);
            }
            for (const reward of favoredConversion.rewards) {
              this.addRewardToPlayer(activePlayer.id, reward);
            }
          }
        }
      }
    }

    this.removeAgentFromPlayer(activePlayer.id);

    this.resolveRewardChoices(activePlayer);

    this.turnInfoService.updatePlayerTurnInfo(activePlayer.id, { fieldsVisitedThisTurn: [field] });
    this.loggingService.logAgentAction(field);
  }

  addPlayedCardRewards(card: ImperiumDeckCard, player: Player, isAI?: boolean) {
    if (card.structuredAgentEffects) {
      const gameState = this.getGameState(player);

      this.resolveStructuredEffects(card.structuredAgentEffects, player, gameState, { type: 'card', object: card });
    }
    if (card.customAgentEffect) {
      const localizedString = this.t.translateLS(card.customAgentEffect);
      this.playerRewardChoicesService.addPlayerCustomChoice(player.id, localizedString);
    }
  }

  public getAgentOnField(fieldId: string) {
    return this.agentsOnFieldsSubject.value.find((x) => x.fieldId === fieldId);
  }

  public removePlayerAgentFromField(playerId: number, fieldId: string) {
    this.agentsOnFieldsSubject.next(this.agentsOnFields.filter((x) => !(x.fieldId === fieldId && x.playerId === playerId)));

    this.addAgentToPlayer(playerId);
  }

  private setPlayerOnField(playerId: number, field: ActionField) {
    this.agentsOnFieldsSubject.next([...this.agentsOnFieldsSubject.value, { playerId, fieldId: field.title.en }]);

    this.turnInfoService.updatePlayerTurnInfo(playerId, { agentPlacedOnFieldId: field.title.en });

    this.loggingService.logPlayerSentAgentToField(playerId, this.t.translateLS(field.title));
  }

  public addAgentToPlayer(playerId: number) {
    const availablePlayerAgents = this.availablePlayerAgents;
    const playerAgentsIndex = availablePlayerAgents.findIndex((x) => x.playerId === playerId);
    const playerAgents = availablePlayerAgents[playerAgentsIndex];
    availablePlayerAgents[playerAgentsIndex] = {
      ...playerAgents,
      agentAmount: playerAgents.agentAmount + 1,
    };

    this.availablePlayerAgentsSubject.next(availablePlayerAgents);
  }

  public removeAgentFromPlayer(playerId: number) {
    const availablePlayerAgents = this.availablePlayerAgents;
    const playerAgentsIndex = availablePlayerAgents.findIndex((x) => x.playerId === playerId);
    const playerAgents = availablePlayerAgents[playerAgentsIndex];
    availablePlayerAgents[playerAgentsIndex] = {
      ...playerAgents,
      agentAmount: playerAgents.agentAmount > 0 ? playerAgents.agentAmount - 1 : 0,
    };

    this.availablePlayerAgentsSubject.next(availablePlayerAgents);
  }

  public addTroopsToPlayer(playerId: number, amount: number) {
    this.audioManager.playSound('troops');
    this.combatManager.addPlayerTroopsToGarrison(playerId, amount);
    this.turnInfoService.updatePlayerTurnInfo(playerId, { troopsGainedThisTurn: amount });

    this.setPreferredFieldsForAIPlayer(playerId);
  }

  public addDreadnoughtToPlayer(playerId: number) {
    this.audioManager.playSound('dreadnought');
    this.combatManager.addPlayerShipsToGarrison(playerId, 1);
    this.turnInfoService.updatePlayerTurnInfo(playerId, { dreadnoughtsGainedThisTurn: 1 });

    this.setPreferredFieldsForAIPlayer(playerId);
  }

  public endPlayerTurn(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }
    const roundPhase = this.currentRoundPhase;

    if (roundPhase === 'agent-placement') {
      if (player.turnState === 'agent-placement') {
        this.cardsService.discardPlayedPlayerCard(this.activePlayerId);
      } else if (player.turnState === 'reveal') {
        const playerHand = this.cardsService.getPlayerHand(player.id);
        if (playerHand && playerHand.cards) {
          this.cardsService.discardPlayerHandCards(player.id);
          this.playerManager.setTurnStateForPlayer(player.id, 'revealed');
        }
      }
    }

    this.turnInfoService.clearPlayerTurnInfo(playerId);

    const players = this.playerManager.getPlayers();
    const nextPlayer = players.find((x) => x.id > this.activePlayerId) ?? players[0];
    if (nextPlayer) {
      this.activePlayerIdSubject.next(nextPlayer.id);

      this.setCurrentAIPlayer(nextPlayer.id);
      if (nextPlayer.isAI) {
        this.setPreferredFieldsForAIPlayer(nextPlayer.id);
      }
    }
  }

  public setRoundState(turnPhase: RoundPhaseType) {
    if (turnPhase === 'combat') {
      this.audioManager.playSound('conflict');
    }
    this.currentRoundPhaseSubject.next(turnPhase);
  }

  public setRoundStateToCombat() {
    this.setRoundState('combat');

    const players = this.playerManager.getPlayers();
    for (const player of players) {
      const playerIntrigues = this.intriguesService.getPlayerIntrigues(player.id);
      if (!playerIntrigues || playerIntrigues.length < 1) {
        this.playerManager.setTurnStateForPlayer(player.id, 'done');
      }
    }
  }

  public setCurrentAIPlayer(playerId: number) {
    this.aIManager.setCurrentAIPlayerId(playerId);
  }

  public setPreferredFieldsForAIPlayer(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);
    if (player && player.isAI) {
      this.aIManager.setPreferredFieldsForAIPlayer(player, this.getGameState(player));
    }
  }

  public changeLocationOwner(locationId: string, playerId: number) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const playerAgentsOnFields = this.getPlayerAgentsOnFields(playerId).map((x) => x.fieldId);
    if (playerAgentsOnFields.some((x) => x === locationId)) {
      const playerLocation = this.locationManager.getPlayerLocation(locationId);
      if (playerLocation) {
        if (playerLocation.playerId !== playerId) {
          const locationTakeoverTroopCosts = this.settingsService.getLocationTakeoverTroopCosts();
          if (this.playerCanPayCosts(playerId, [{ type: 'loose-troop', amount: locationTakeoverTroopCosts }])) {
            this.audioManager.playSound('location-control');
            this.locationManager.setLocationOwner(locationId, playerId);
            this.payCostForPlayer(playerLocation.playerId, { type: 'victory-point' }, 'Location');
            this.payCostForPlayer(playerId, { type: 'loose-troop', amount: locationTakeoverTroopCosts });
            this.addRewardToPlayer(player.id, { type: 'victory-point' }, undefined, 'Location');

            this.loggingService.logPlayerLostLocationControl(playerLocation.playerId, this.currentRound);
            this.loggingService.logPlayerGainedLocationControl(playerId, this.currentRound);
          }
        }
      } else {
        this.audioManager.playSound('location-control');
        this.locationManager.setLocationOwner(locationId, playerId);
        this.addRewardToPlayer(player.id, { type: 'victory-point' }, undefined, 'Location');
        this.loggingService.logPlayerGainedLocationControl(playerId, this.currentRound);
      }
    }
  }

  public playIntrigue(playerId: number, intrigue: IntrigueDeckCard) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    if (intrigue.structuredEffects) {
      for (const reward of intrigue.structuredEffects.rewards) {
        this.addRewardToPlayer(player.id, reward);
      }
      for (const choiceEffect of intrigue.structuredEffects.choiceEffects) {
        this.playerRewardChoicesService.addPlayerRewardsChoice(this.activePlayerId, [
          ...choiceEffect.left,
          { type: choiceEffect.choiceType },
          ...choiceEffect.right,
        ]);
      }
    }

    this.intriguesService.trashPlayerIntrigue(playerId, intrigue.id);
    this.loggingService.logPlayerPlayedIntrigue(playerId, this.t.translateLS(intrigue.name));
    this.turnInfoService.updatePlayerTurnInfo(playerId, { intriguesPlayedThisTurn: [intrigue] });
  }

  public doAIAction(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);
    const playerAgentCount = this.getAvailableAgentCountForPlayer(playerId);
    let couldPlaceAgent = false;

    if (!player || player.turnState === 'done') {
      return;
    }

    this.turnInfoService.updatePlayerTurnInfo(player.id, { isDoingAIActions: true });

    const roundPhase = this.currentRoundPhase;
    const gameState = this.getGameState(player);

    if (roundPhase === 'agent-placement') {
      const playerTurnInfo = this.turnInfoService.getPlayerTurnInfo(player.id);
      const hasPlacedAgentsThisTurn = playerTurnInfo && playerTurnInfo.fieldsVisitedThisTurn.length > 0;
      if (!hasPlacedAgentsThisTurn) {
        this.aiPlayPossibleAndUsefulTechTiles(player);

        const playerIntrigues = this.intriguesService.getPlayerIntrigues(player.id, 'complot');
        const playableAndUsefulIntrigues = this.aiGetPlayableAndUsefulIntrigues(player, playerIntrigues, gameState);

        if (playableAndUsefulIntrigues.length > 0 && Math.random() < 0.4 + 0.4 * playableAndUsefulIntrigues.length) {
          this.aiPlayIntrigue(player, playableAndUsefulIntrigues[0], gameState);

          this.setPreferredFieldsForAIPlayer(player.id);

          setTimeout(() => {
            this.doAIAction(player.id);
          }, 1500);
        } else {
          if (player.turnState === 'agent-placement' && playerAgentCount > 0) {
            const playerHandCards = this.cardsService.getPlayerHand(player.id)?.cards;
            if (playerHandCards && playerHandCards.length > 0) {
              const cardAndField = this.aIManager.getCardAndFieldToPlay(playerHandCards, player, gameState);

              const boardField = this.settingsService.boardFields.find((x) =>
                cardAndField?.preferredField.fieldId.includes(x.title.en)
              );
              if (boardField && cardAndField) {
                this.cardsService.setPlayedPlayerCard(playerId, cardAndField.cardToPlay.id);
                this.loggingService.logPlayerPlayedCard(playerId, this.t.translateLS(cardAndField.cardToPlay.name));
                this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsPlayedThisTurn: [cardAndField.cardToPlay] });
                this.addAgentToField(boardField);

                couldPlaceAgent = true;
                this.turnInfoService.setPlayerTurnInfo(player.id, { isDoingAIActions: false });
              }
            }
          }
          if (!couldPlaceAgent && player.turnState !== 'reveal') {
            this.setPlayerRevealTurn(playerId);
            this.turnInfoService.setPlayerTurnInfo(player.id, { isDoingAIActions: false });
          }
          if (player.turnState === 'reveal') {
            const playerPersuasionAvailable = this.playerManager.getPlayerPersuasion(playerId);
            this.aiBuyImperiumCards(playerId, playerPersuasionAvailable);

            const playerPersuasionLeft = this.playerManager.getPlayerPersuasion(playerId);
            if (playerPersuasionLeft > 0) {
              this.aiBuyPlotCards(playerId, playerPersuasionLeft);
            }

            const playerFocusTokens = this.playerManager.getPlayerFocusTokens(playerId);
            this.aiUseFocusTokens(playerId, playerFocusTokens);

            const playerHand = this.cardsService.getPlayerHand(player.id);
            if (playerHand && playerHand.cards) {
              this.cardsService.discardPlayerHandCards(player.id);
              this.playerManager.setTurnStateForPlayer(player.id, 'revealed');
            }
            this.turnInfoService.setPlayerTurnInfo(player.id, { isDoingAIActions: false });
          }
        }
      }
    }
    if (roundPhase === 'combat') {
      if (player.turnState === 'revealed') {
        const playerCombatIntrigues = this.intriguesService.getPlayerIntrigues(playerId, 'combat');
        const playerCombatScore = this.combatManager.getPlayerCombatScore(playerId);

        if (!playerCombatIntrigues || playerCombatIntrigues.length < 1 || playerCombatScore < 1) {
          this.playerManager.setTurnStateForPlayer(playerId, 'done');
        } else {
          const enemyCombatScores = this.combatManager.getEnemyCombatScores(playerId).map((x) => x.score);
          const highestEnemyCombatScore = max(enemyCombatScores) ?? 0;
          if (highestEnemyCombatScore >= playerCombatScore) {
            const intriguesWithCombatScores: { intrigue: IntrigueDeckCard; score: number }[] = [];
            const intriguesWithoutCombatScores: IntrigueDeckCard[] = [];

            for (const intrigue of playerCombatIntrigues) {
              if (intrigue.structuredEffects) {
                let swordAmount = intrigue.structuredEffects.rewards.filter((x) => x.type === 'sword').length;
                let canPayCosts = true;

                for (const choiceEffect of intrigue.structuredEffects.choiceEffects) {
                  if (isConversionEffectType(choiceEffect.choiceType)) {
                    canPayCosts = this.playerCanPayCosts(playerId, choiceEffect.left);
                    if (canPayCosts) {
                      swordAmount += choiceEffect.right.filter((x) => x.type === 'sword').length;
                    }
                  }
                }

                if (canPayCosts) {
                  if (swordAmount > 0) {
                    intriguesWithCombatScores.push({ intrigue, score: swordAmount });
                  } else {
                    intriguesWithoutCombatScores.push(intrigue);
                  }
                }
              }
            }

            const maxAdditionalCombatScore = sum(intriguesWithCombatScores.map((x) => x.score));
            const playerCanWinCombat = playerCombatScore + maxAdditionalCombatScore > highestEnemyCombatScore;
            if (playerCanWinCombat || this.isFinale) {
              let playerCurrentCombatScore = playerCombatScore;

              for (const intrigueWithCombatScore of intriguesWithCombatScores) {
                const intrigue = intrigueWithCombatScore.intrigue;
                this.aiPlayIntrigue(player, intrigue, gameState);

                const swordAmount = intrigue.effects.filter((x) => x.type === 'sword').length;
                playerCurrentCombatScore += swordAmount;
                if (playerCurrentCombatScore > highestEnemyCombatScore) {
                  break;
                }
              }
            } else if (intriguesWithCombatScores.length > 0 && Math.random() < 0.15 * intriguesWithCombatScores.length) {
              const beatableCombatScore = enemyCombatScores.find(
                (x) => x >= playerCombatScore && x < playerCombatScore + maxAdditionalCombatScore
              );
              if (beatableCombatScore) {
                let playerCurrentCombatScore = playerCombatScore;

                for (const intrigueWithCombatScore of intriguesWithCombatScores) {
                  const intrigue = intrigueWithCombatScore.intrigue;
                  this.aiPlayIntrigue(player, intrigue, gameState);

                  const swordAmount = intrigue.effects.filter((x) => x.type === 'sword').length;
                  playerCurrentCombatScore += swordAmount;
                  if (playerCurrentCombatScore > beatableCombatScore) {
                    break;
                  }
                }
              }
            } else {
              for (const intrigue of intriguesWithoutCombatScores) {
                this.aiPlayIntrigue(player, intrigue, gameState);
              }

              this.playerManager.setTurnStateForPlayer(playerId, 'done');
            }
          }
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { isDoingAIActions: false });
    }
  }

  aiPlayIntrigue(player: Player, intrigue: IntrigueDeckCard, gameState: GameState) {
    const intrigueEffects = intrigue.structuredEffects;

    this.loggingService.logPlayerPlayedIntrigue(player.id, this.t.translateLS(intrigue.name));
    this.turnInfoService.updatePlayerTurnInfo(player.id, { intriguesPlayedThisTurn: [intrigue] });

    if (intrigueEffects) {
      for (const reward of intrigueEffects.rewards) {
        this.addRewardToPlayer(player.id, reward);
      }
      for (const choiceEffect of intrigueEffects.choiceEffects) {
        if (isConversionEffectType(choiceEffect.choiceType)) {
          this.aiConvertRewardIfUsefulAndPossible(player, choiceEffect.left, choiceEffect.right, gameState);
        }
      }
    }

    this.aiResolveRewardChoices(player);

    this.intriguesService.trashPlayerIntrigue(player.id, intrigue.id);
  }

  aiGetPlayableAndUsefulIntrigues(player: Player, intrigues: IntrigueDeckCard[] | undefined, gameState: GameState) {
    const playableAndUsefulIntrigues: IntrigueDeckCard[] = [];
    if (!intrigues) {
      return playableAndUsefulIntrigues;
    }
    for (const intrigue of intrigues) {
      const intrigueEffects = intrigue.structuredEffects;

      if (intrigueEffects) {
        let isUseful = this.aIManager.getRewardArrayEvaluationForTurnState(intrigueEffects.rewards, player, gameState) > 0;

        for (const choiceEffect of intrigueEffects.choiceEffects) {
          if (isConversionEffectType(choiceEffect.choiceType)) {
            const costs = choiceEffect.left;
            const rewards = choiceEffect.right;
            if (rewards.some((x) => x.type === 'location-control')) {
              if (gameState.freeLocations.length < 1) {
                costs.push({ type: 'troop', amount: this.settingsService.getLocationTakeoverTroopCosts() });
              }
            }

            const costsEvaluation = this.aIManager.getCostsArrayEvaluationForTurnState(costs, player, gameState);
            const conversionIsUseful =
              this.aIManager.getRewardArrayEvaluationForTurnState(rewards, player, gameState) - costsEvaluation > 0;

            if (conversionIsUseful && this.playerCanPayCosts(player.id, costs)) {
              isUseful = true;
            }
          }
        }

        if (isUseful) {
          playableAndUsefulIntrigues.push(intrigue);
        }
      }
    }

    return playableAndUsefulIntrigues;
  }

  private aiPlayPossibleAndUsefulTechTiles(player: Player) {
    const playerTechTiles = this.techTilesService.getPlayerTechTiles(player.id);
    for (const playerTechTile of playerTechTiles) {
      if (!playerTechTile.isFlipped) {
        const effects = playerTechTile.techTile.structuredEffects;
        if (effects) {
          const gameState = this.getGameState(player);
          this.resolveStructuredEffects(effects, player, gameState, {
            type: 'tech-tile',
            object: playerTechTile.techTile,
          });
        }
      }
    }

    this.aiResolveRewardChoices(player);
  }

  public aiDiscardHandCard(playerId: number) {
    const playerHandCards = this.cardsService.getPlayerHand(playerId)?.cards;
    if (playerHandCards) {
      const activeCards = this.cardsService.playedPlayerCards;
      const discardableCards = playerHandCards.filter((x) => !activeCards.some((y) => x.id === y.cardId));

      const player = this.playerManager.getPlayer(playerId);
      if (!player) {
        return;
      }

      const gameState = this.getGameState(player);
      const cardToDiscard = this.aIManager.getCardToDiscard(discardableCards, player, gameState);
      if (cardToDiscard) {
        this.cardsService.discardPlayerHandCard(playerId, cardToDiscard);

        this.loggingService.logPlayerDiscardedCard(playerId, this.t.translateLS(cardToDiscard.name));
      }
    }
  }

  public aiTrashCardFromHand(playerId: number) {
    const playerHandCards = this.cardsService.getPlayerHand(playerId)?.cards;
    if (playerHandCards) {
      const activeCards = this.cardsService.playedPlayerCards;
      const trashableCards = playerHandCards.filter((x) => !activeCards.some((y) => x.id === y.cardId));

      const player = this.playerManager.getPlayer(playerId);
      if (!player) {
        return;
      }

      const gameState = this.getGameState(player);
      const cardToTrash = this.aIManager.getCardToTrash(trashableCards, player, gameState);
      if (cardToTrash) {
        this.cardsService.trashPlayerHandCard(playerId, cardToTrash);

        this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(cardToTrash.name));
      }
    }
  }

  public aiTrashCardFromDiscardPile(playerId: number) {
    const playerDiscardPileCards = this.cardsService.getPlayerDiscardPile(playerId)?.cards;
    if (playerDiscardPileCards) {
      const player = this.playerManager.getPlayer(playerId);
      if (!player) {
        return;
      }

      const gameState = this.getGameState(player);
      const cardToTrash = this.aIManager.getCardToTrash(playerDiscardPileCards, player, gameState);
      if (cardToTrash) {
        this.cardsService.trashDiscardedPlayerCard(playerId, cardToTrash);

        this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(cardToTrash.name));
      }
    }
  }

  public aiAddCardToHandFromDiscardPile(playerId: number) {
    const playerDiscardPileCards = this.cardsService.getPlayerDiscardPile(playerId)?.cards;
    if (playerDiscardPileCards) {
      const player = this.playerManager.getPlayer(playerId);
      if (!player) {
        return;
      }

      const gameState = this.getGameState(player);
      const cardToAddToHand = this.aIManager.getCardToPlay(playerDiscardPileCards, player, gameState);
      if (cardToAddToHand) {
        this.cardsService.removeCardFromDiscardPile(playerId, cardToAddToHand);
        this.cardsService.addCardToPlayerHand(playerId, cardToAddToHand);
      }
    }
  }

  public aiTrashIntrigue(playerId: number) {
    const playerIntrigues = this.intriguesService.getPlayerIntrigues(playerId);
    if (playerIntrigues && playerIntrigues.length > 0) {
      const player = this.playerManager.getPlayer(playerId);
      if (!player) {
        return;
      }

      const gameState = this.getGameState(player);

      const intrigueToTrash = this.aIManager.getIntrigueToTrash(playerIntrigues, player, gameState);
      if (intrigueToTrash) {
        this.intriguesService.trashPlayerIntrigue(playerId, intrigueToTrash.id);

        this.loggingService.logPlayerTrashedIntrigue(playerId, this.t.translateLS(intrigueToTrash.name));
      }
    }
  }

  private aiConvertRewardIfUsefulAndPossible(
    player: Player,
    costs: EffectReward[],
    rewards: EffectReward[],
    gameState: GameState,
    element?: GameElement
  ) {
    const costsEvaluation = this.aIManager.getCostsArrayEvaluationForTurnState(costs, player, gameState);
    const conversionIsUseful =
      this.aIManager.getRewardArrayEvaluationForTurnState(rewards, player, gameState) - costsEvaluation > 0;

    if (conversionIsUseful && this.playerCanPayCosts(player.id, costs)) {
      for (const cost of costs) {
        this.payCostForPlayer(player.id, cost, undefined, element);
      }
      for (const reward of rewards) {
        this.addRewardToPlayer(player.id, reward, element);
      }
    }
  }

  private aiChooseRewardOption(
    player: Player,
    leftSideRewards: EffectReward[],
    rightSideRewards: EffectReward[],
    gameState: GameState,
    element?: GameElement
  ) {
    const leftSideEvaluation = this.aIManager.getRewardArrayEvaluationForTurnState(leftSideRewards, player, gameState);
    const rightSideEvaluation = this.aIManager.getRewardArrayEvaluationForTurnState(rightSideRewards, player, gameState);

    if (leftSideEvaluation >= rightSideEvaluation) {
      for (const reward of leftSideRewards) {
        this.addRewardToPlayer(player.id, reward, element);
      }
    } else {
      for (const reward of rightSideRewards) {
        this.addRewardToPlayer(player.id, reward, element);
      }
    }
  }

  private aiControlLocations(player: Player, locationsToOccupy: number) {
    const gameState = this.getGameState(player);

    for (let i = 0; i < locationsToOccupy; i++) {
      const boardLocations = this.settingsService.getBoardLocations();
      const playerLocations = this.locationManager.getPlayerLocations(player.id);
      const controllableLocations = boardLocations.filter(
        (x) => !playerLocations.some((y) => x.actionField.title.en === y.locationId)
      );

      const preferredLocation = this.aIManager.getPreferredLocationForPlayer(player, controllableLocations, gameState);
      if (preferredLocation) {
        this.changeLocationOwner(preferredLocation.actionField.title.en, player.id);
      }
    }
  }

  public aiIncreaseInfluenceChoice(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    this.addRewardToPlayer(player.id, { type: 'faction-influence-up-choice' });
    this.aiResolveRewardChoices(player);
  }

  public aiDecreaseInfluenceChoice(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    this.payCostForPlayer(playerId, { type: 'faction-influence-down-choice' });
    this.aiResolveRewardChoices(player);
  }

  private resolveStructuredEffects(
    structuredEffects: StructuredEffects,
    player: Player,
    gameState: GameState,
    element?: GameElement,
    additionalCardsInPlay?: ImperiumDeckCard[]
  ) {
    const effects = structuredEffects;
    for (const reward of effects.rewards) {
      this.addRewardToPlayer(player.id, reward, element);
    }
    for (const choiceEffect of effects.choiceEffects) {
      this.resolveStructuredChoiceEffect(choiceEffect, player.id, element);
    }
    for (const conditionalEffect of effects.conditionalEffects) {
      this.resolveStructuredConditionEffects(conditionalEffect, player, gameState, element, additionalCardsInPlay);
    }
    if (effects.timingEffects) {
      for (const timingEffect of effects.timingEffects) {
        this.resolveStructuredTimingEffects(timingEffect, player, gameState, element, additionalCardsInPlay);
      }
    }
  }

  private resolveStructuredTimingEffects(
    timingEffect: StructuredTimingEffect,
    player: Player,
    gameState: GameState,
    element?: GameElement,
    additionalCardsInPlay?: ImperiumDeckCard[]
  ) {
    let conditionFullfilled = false;

    if (timingEffect.type === 'timing-game-start') {
      const hasPlacedAgentThisRound = this.agentsOnFields.filter((x) => x.playerId === player.id).length > 0;
      if (this.currentRound === 1 && player.turnState === 'agent-placement' && !hasPlacedAgentThisRound) {
        conditionFullfilled = true;
      }
    }
    if (timingEffect.type === 'timing-round-start') {
      const hasPlacedAgentThisRound = this.agentsOnFields.filter((x) => x.playerId === player.id).length > 0;
      if (player.turnState === 'agent-placement' && !hasPlacedAgentThisRound) {
        conditionFullfilled = true;
      }
    } else if (timingEffect.type === 'timing-reveal-turn') {
      if (player.turnState === 'reveal') {
        conditionFullfilled = true;
      }
    }
    if (conditionFullfilled) {
      if (isStructuredConditionalEffect(timingEffect.effect)) {
        this.resolveStructuredConditionEffects(timingEffect.effect, player, gameState, element, additionalCardsInPlay);
      } else if (isStructuredChoiceEffect(timingEffect.effect)) {
        this.resolveStructuredChoiceEffect(timingEffect.effect, player.id, element);
      } else {
        for (const reward of timingEffect.effect) {
          this.addRewardToPlayer(player.id, reward, element);
        }
      }
    }
  }

  private resolveStructuredConditionEffects(
    conditionalEffect: StructuredConditionalEffect,
    player: Player,
    gameState: GameState,
    element?: GameElement,
    additionalCardsInPlay?: ImperiumDeckCard[]
  ) {
    let conditionFullfilled = false;

    if (conditionalEffect.condition === 'condition-connection') {
      if (
        gameState.playerCardsFactionsInPlay[conditionalEffect.faction] > 0 ||
        additionalCardsInPlay?.some((x) => x.faction === conditionalEffect.faction)
      ) {
        conditionFullfilled = true;
      }
    } else if (conditionalEffect.condition === 'condition-influence' && conditionalEffect.amount) {
      if (gameState.playerScore[conditionalEffect.faction] >= conditionalEffect.amount) {
        conditionFullfilled = true;
      }
    }
    if (conditionFullfilled) {
      if (isStructuredChoiceEffect(conditionalEffect.effect)) {
        this.resolveStructuredChoiceEffect(conditionalEffect.effect, player.id, element);
      } else {
        for (const reward of conditionalEffect.effect) {
          this.addRewardToPlayer(player.id, reward, element);
        }
      }
    }
  }

  private resolveStructuredChoiceEffect(
    structuredChoiceEffect: StructuredChoiceEffect,
    playerId: number,
    element?: GameElement
  ) {
    if (isOptionEffectType(structuredChoiceEffect.choiceType)) {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { effectOptions: [{ ...structuredChoiceEffect, element }] });
    } else if (isConversionEffectType(structuredChoiceEffect.choiceType)) {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { effectConversions: [{ ...structuredChoiceEffect, element }] });
    }
  }

  private resolveGameEffects(gameEffects: GameEffects) {
    if (gameEffects.imperiumRowCards) {
      this.cardsService.addCardsToImperiumRow(gameEffects.imperiumRowCards.amount);
    } else if (gameEffects.spiceAccumulation) {
      this.accumulateSpiceOnFields(gameEffects.spiceAccumulation.amount);
    }
  }

  private resolveRewardChoices(player: Player) {
    if (!player.isAI) {
      this.resolvePlayerRewardChoices(player);
    } else {
      this.aiResolveRewardChoices(player);
    }
  }

  private resolvePlayerRewardChoices(player: Player) {
    const turnInfo = this.turnInfoService.getPlayerTurnInfo(player.id);
    if (!turnInfo) {
      return;
    }

    const gameState = this.getGameState(player);

    if (turnInfo.cardDrawOrDestroyAmount > 0) {
      for (let i = 0; i < turnInfo.cardDrawOrDestroyAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'card-draw-or-destroy',
        });
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
          type: 'location-control',
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
            this.resolveStructuredEffects(playerLeader.structuredSignetEffects, player, gameState);
          } else if (playerLeader.signetDescription.en) {
            this.playerRewardChoicesService.addPlayerCustomChoice(
              player.id,
              this.t.translateLS(playerLeader.signetDescription)
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
    if (turnInfo.effectOptions.length > 0) {
      for (const effectOption of turnInfo.effectOptions) {
        this.playerRewardChoicesService.addPlayerRewardsChoice(player.id, [
          ...effectOption.left,
          { type: effectOption.choiceType },
          ...effectOption.right,
        ]);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { effectOptions: [] });
    }
    if (turnInfo.effectConversions.length > 0) {
      for (const effectConversion of turnInfo.effectConversions) {
        this.playerRewardChoicesService.addPlayerRewardsChoice(player.id, [
          ...effectConversion.left,
          { type: effectConversion.choiceType },
          ...effectConversion.right,
        ]);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { effectConversions: [] });
    }

    if (turnInfo.canLiftAgent) {
      this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
        type: 'agent-lift',
      });
      this.turnInfoService.setPlayerTurnInfo(player.id, { canLiftAgent: false });
    }

    if (turnInfo.canEnterCombat) {
    }
  }

  private aiResolveRewardChoices(player: Player) {
    const turnInfo = this.turnInfoService.getPlayerTurnInfo(player.id);
    if (!turnInfo) {
      return;
    }

    const gameState = this.getGameState(player);

    if (turnInfo.cardDrawOrDestroyAmount > 0) {
      for (let i = 0; i < turnInfo.cardDrawOrDestroyAmount; i++) {
        const drawEvaluation = this.aIManager.getEffectEvaluationForTurnState('card-draw', player, gameState);
        const focusEvaluation = this.aIManager.getEffectEvaluationForTurnState('focus', player, gameState);

        if (drawEvaluation > focusEvaluation) {
          this.audioManager.playSound('card-draw');
          this.cardsService.drawPlayerCardsFromDeck(player.id, 1);
        } else {
          this.playerManager.addFocusTokens(player.id, 1);
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { cardDrawOrDestroyAmount: 0 });
    }
    if (turnInfo.cardDiscardAmount) {
      for (let i = 0; i < turnInfo.cardDiscardAmount; i++) {
        this.aiDiscardHandCard(player.id);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { cardDiscardAmount: 0 });
    }
    if (turnInfo.shippingAmount > 0) {
      const spiceEvaluation = this.aIManager.getEffectEvaluationForTurnState('spice', player, gameState);
      const waterEvaluation = this.aIManager.getEffectEvaluationForTurnState('water', player, gameState);

      if (spiceEvaluation >= waterEvaluation) {
        this.addRewardToPlayer(player.id, { type: 'spice', amount: turnInfo.shippingAmount });
      } else {
        this.playerManager.addFocusTokens(player.id, 1);
        this.addRewardToPlayer(player.id, { type: 'water', amount: turnInfo.shippingAmount });
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { shippingAmount: 0 });
    }
    if (turnInfo.locationControlAmount > 0) {
      for (let i = 0; i < turnInfo.locationControlAmount; i++) {
        const updatedGameState = this.getGameState(player);
        this.aiControlLocation(player, updatedGameState);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { locationControlAmount: 0 });
    }
    if (turnInfo.factionInfluenceUpChoiceAmount > 0) {
      this.aiAddFactionInfluenceUpChoice(player, turnInfo.factionInfluenceUpChoiceAmount);
      this.turnInfoService.setPlayerTurnInfo(player.id, { factionInfluenceUpChoiceAmount: 0 });
    }
    if (turnInfo.factionInfluenceUpChoiceTwiceAmount > 0) {
      this.aiAddFactionInfluenceUpChoiceTwice(player, turnInfo.factionInfluenceUpChoiceTwiceAmount);
      this.turnInfoService.setPlayerTurnInfo(player.id, { factionInfluenceUpChoiceTwiceAmount: 0 });
    }
    if (turnInfo.factionInfluenceDownChoiceAmount > 0) {
      this.addFactionInfluenceDownChoiceForAI(player.id, turnInfo.factionInfluenceDownChoiceAmount);
      this.turnInfoService.setPlayerTurnInfo(player.id, { factionInfluenceDownChoiceAmount: 0 });
    }
    if (turnInfo.signetRingAmount > 0) {
      for (let i = 0; i < turnInfo.signetRingAmount; i++) {
        const playerLeader = this.leadersService.getLeader(player.id);
        if (playerLeader) {
          if (playerLeader.structuredSignetEffects) {
            this.resolveStructuredEffects(playerLeader.structuredSignetEffects, player, gameState);
          } else if (playerLeader.signetDescription.en) {
            this.playerRewardChoicesService.addPlayerCustomChoice(
              player.id,
              this.t.translateLS(playerLeader.signetDescription)
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
    if (turnInfo.effectOptions.length > 0) {
      for (const effectOption of turnInfo.effectOptions) {
        const updatedPlayer = this.playerManager.getPlayer(player.id);
        const updatedGameState = this.getGameState(player);

        if (updatedPlayer && updatedGameState) {
          this.aiChooseRewardOption(
            updatedPlayer,
            effectOption.left,
            effectOption.right,
            updatedGameState,
            effectOption.element
          );
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { effectOptions: [] });
    }
    if (turnInfo.effectConversions.length > 0) {
      for (const effectConversion of turnInfo.effectConversions) {
        const updatedPlayer = this.playerManager.getPlayer(player.id);
        const updatedGameState = this.getGameState(player);

        if (updatedPlayer && updatedGameState) {
          this.aiConvertRewardIfUsefulAndPossible(
            updatedPlayer,
            effectConversion.left,
            effectConversion.right,
            updatedGameState,
            effectConversion.element
          );
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { effectConversions: [] });
    }

    if (turnInfo.canLiftAgent) {
      const playerAgentsOnOtherFields = this.agentsOnFields.filter(
        (x) => x.playerId === player.id && x.fieldId !== turnInfo.agentPlacedOnFieldId
      );
      if (playerAgentsOnOtherFields.length > 0) {
        shuffle(playerAgentsOnOtherFields);
        this.removePlayerAgentFromField(player.id, playerAgentsOnOtherFields[0].fieldId);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { canLiftAgent: false });
    }
    if (turnInfo.canEnterCombat) {
      const aiPlayer = this.aIManager.getAIPlayer(player.id);
      if (!aiPlayer) {
        return;
      }

      const deployableUnits = this.turnInfoService.getDeployablePlayerUnits(player.id);
      if (!deployableUnits) {
        return;
      }

      const playerCombatUnits = this.combatManager.getPlayerCombatUnits(player.id);
      const enemyCombatScores = this.combatManager.getEnemyCombatScores(player.id);
      const playerIntrigueCount = this.intriguesService.getPlayerIntrigueCount(player.id);
      const playerHasAgentsLeft = (this.availablePlayerAgents.find((x) => x.playerId === player.id)?.agentAmount ?? 0) > 1;

      const combatDecision = aiPlayer.decisions.find((x) => x.includes('conflict'));

      if (combatDecision) {
        if (this.isFinale) {
          const troopsAdded = this.combatManager.addAllPossibleTroopsToCombat(player.id, turnInfo.troopsGainedThisTurn);
          const dreadnoughtsAdded = this.combatManager.addAllPossibleDreadnoughtsToCombat(
            player.id,
            turnInfo.dreadnoughtsGainedThisTurn
          );
          const unitsAdded = this.combatManager.addAllPossibleUnitsToCombat(player.id, turnInfo.deployableUnits);
          this.turnInfoService.updatePlayerTurnInfo(player.id, {
            deployedUnitsThisTurn: unitsAdded,
            deployedTroopsThisTurn: troopsAdded,
            deployedDreadnoughtsThisTurn: dreadnoughtsAdded,
          });
        } else if (combatDecision.includes('win')) {
          if (playerCombatUnits && enemyCombatScores) {
            const addUnitsDecision = this.aIManager.getAddAdditionalUnitsToCombatDecision(
              playerCombatUnits,
              enemyCombatScores,
              turnInfo.deployableUnits + turnInfo.troopsGainedThisTurn + turnInfo.dreadnoughtsGainedThisTurn,
              playerHasAgentsLeft,
              playerIntrigueCount > 2
            );

            if (addUnitsDecision === 'all') {
              const troopsAdded = this.combatManager.addAllPossibleTroopsToCombat(player.id, turnInfo.troopsGainedThisTurn);
              const dreadnoughtsAdded = this.combatManager.addAllPossibleDreadnoughtsToCombat(
                player.id,
                turnInfo.dreadnoughtsGainedThisTurn
              );
              const unitsAdded = this.combatManager.addAllPossibleUnitsToCombat(player.id, turnInfo.deployableUnits);
              this.turnInfoService.updatePlayerTurnInfo(player.id, {
                deployedUnitsThisTurn: unitsAdded,
                deployedTroopsThisTurn: troopsAdded,
                deployedDreadnoughtsThisTurn: dreadnoughtsAdded,
              });
            } else if (addUnitsDecision === 'minimum') {
              this.addMinimumUnitsToCombat(player.id, playerCombatUnits, enemyCombatScores, playerHasAgentsLeft);
            }
          }
        } else if (combatDecision.includes('participate')) {
          if (playerCombatUnits) {
            this.addMinimumUnitsToCombat(player.id, playerCombatUnits, enemyCombatScores, playerHasAgentsLeft);
          }
        }
      }
    }
    if (turnInfo.canBuyTech) {
      this.aiBuyTechIfPossible(player.id);
    }
  }

  private aiControlLocation(player: Player, gameState: GameState) {
    const playerAgentsOnFields = this.getPlayerAgentsOnFields(player.id).map((x) => x.fieldId);

    const possibleBoardLocations = this.settingsService
      .getBoardLocations()
      .filter((x) => playerAgentsOnFields.includes(x.actionField.title.en));
    const playerLocations = this.locationManager.getPlayerLocations(player.id);
    const enemyLocations = this.locationManager.getEnemyLocations(player.id);
    const freeLocations = possibleBoardLocations.filter(
      (x) =>
        !playerLocations.some((y) => x.actionField.title.en === y.locationId) &&
        !enemyLocations.some((y) => x.actionField.title.en === y.locationId)
    );
    const highPriorityLocations = enemyLocations.filter((x) => x.playerId === gameState.rival?.id);

    let controllableLocations: DuneLocation[] = [];

    if (enemyLocations.length > 0) {
      const playerTroopAmount = this.combatManager.getPlayerTroopsInGarrison(player.id);
      const stealChance = 0.2 * playerTroopAmount + 0.1 * (gameState.currentRound - 1);
      const locationTakeoverTroopCosts = this.settingsService.getLocationTakeoverTroopCosts() ?? 0;

      if (playerTroopAmount >= locationTakeoverTroopCosts && stealChance > Math.random()) {
        if (highPriorityLocations.length > 0) {
          controllableLocations = possibleBoardLocations.filter((x) =>
            highPriorityLocations.some((y) => x.actionField.title.en === y.locationId)
          );
        } else {
          controllableLocations = possibleBoardLocations.filter(
            (x) => !playerLocations.some((y) => x.actionField.title.en === y.locationId)
          );
        }
      } else {
        controllableLocations = freeLocations;
      }
    } else {
      controllableLocations = freeLocations;
    }

    const preferredLocation = this.aIManager.getPreferredLocationForPlayer(player, controllableLocations, gameState);
    if (preferredLocation) {
      this.changeLocationOwner(preferredLocation.actionField.title.en, player.id);
    }
  }

  private aiBuyImperiumCards(playerId: number, availablePersuasion: number) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const gameState = this.getGameState(player);

    const imperiumRow = this.cardsService.imperiumRow.filter((x) => x.type === 'imperium-card') as ImperiumRowCard[];
    const imperiumRowModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'imperiumRow');

    const alwaysBuyableCards = [
      ...this.cardsService.limitedCustomCards,
      ...this.cardsService.unlimitedCustomCards.map((x) => this.cardsService.instantiateImperiumCard(x)),
    ];

    let recruitableCards: ImperiumDeckCard[] = [];
    const factionRecruitment = this.turnInfoService.getPlayerTurnInfo(playerId)?.factionRecruitment;
    if (factionRecruitment && factionRecruitment.length > 0) {
      const recruitmentCardAmount = this.settingsService.getRecruitmentCardAmount();
      recruitableCards = this.cardsService
        .getTopDeckCards(recruitmentCardAmount)
        .filter((x) => factionRecruitment.some((y) => y === x.faction) && x.type === 'imperium-card') as ImperiumDeckCard[];
    }

    const availableCards = [...imperiumRow, ...recruitableCards, ...shuffle(alwaysBuyableCards)];

    const cardToBuy = this.aIManager.getImperiumCardToBuy(
      availablePersuasion,
      availableCards,
      player,
      gameState,
      imperiumRowModifiers
    );
    if (cardToBuy) {
      const costModifier = getCardCostModifier(cardToBuy, imperiumRowModifiers);
      if (cardToBuy.persuasionCosts) {
        this.playerManager.addPersuasionSpentToPlayer(playerId, cardToBuy.persuasionCosts + costModifier);
      }
      if (cardToBuy.buyEffects) {
        for (const effect of cardToBuy.buyEffects) {
          this.addRewardToPlayer(player.id, effect);
        }
      }

      this.aiResolveRewardChoices(player);

      if (this.cardsService.limitedCustomCards.some((x) => x.id === cardToBuy.id)) {
        this.cardsService.aquirePlayerCardFromLimitedCustomCards(playerId, cardToBuy);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [cardToBuy] });
      } else if (recruitableCards.some((x) => x.id === cardToBuy.id)) {
        this.cardsService.aquirePlayerCardFromImperiumDeck(playerId, cardToBuy);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [cardToBuy] });
      } else if (imperiumRow.some((x) => x.id === cardToBuy.id)) {
        this.cardsService.aquirePlayerCardFromImperiumRow(playerId, cardToBuy);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [cardToBuy] });
      } else {
        this.cardsService.shuffleCardsUnderPlayerDeck(playerId, [cardToBuy]);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [cardToBuy] });
      }

      this.loggingService.logPlayerBoughtCard(playerId, this.t.translateLS(cardToBuy.name));

      this.aiBuyImperiumCards(playerId, availablePersuasion - ((cardToBuy.persuasionCosts ?? 0) + costModifier));
    }
  }

  private aiBuyPlotCards(playerId: number, availablePersuasion: number) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const imperiumRowPlots = this.cardsService.imperiumRow.filter((x) => x.type === 'plot') as ImperiumRowPlot[];
    const imperiumRowModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'imperiumRow');

    const plotToBuy = this.aIManager.getPlotToBuy(availablePersuasion, imperiumRowPlots, player, imperiumRowModifiers);
    if (plotToBuy) {
      const costModifier = getCardCostModifier(plotToBuy, imperiumRowModifiers);
      if (plotToBuy.persuasionCosts) {
        this.playerManager.addPersuasionSpentToPlayer(playerId, plotToBuy.persuasionCosts + costModifier);
      }
      this.cardsService.aquirePlayerPlotFromImperiumRow(playerId, plotToBuy);

      this.loggingService.logPlayerBoughtCard(playerId, this.t.translateLS(plotToBuy.name));
    }
  }

  private aiUseFocusTokens(playerId: number, focusTokens: number) {
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

    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const gameState = this.getGameState(player);

    const cardToTrash = this.aIManager.getCardToTrash(cards, player, gameState);
    if (cardToTrash) {
      this.cardsService.trashDiscardedPlayerCard(playerId, cardToTrash);
      this.cardsService.trashPlayerHandCard(playerId, cardToTrash);

      this.playerManager.removeFocusTokens(playerId, 1);

      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsTrashedThisTurn: [cardToTrash] });
      this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(cardToTrash.name));

      if (focusTokens > 1) {
        this.aiUseFocusTokens(playerId, focusTokens - 1);
      }
    }
  }

  acquireImperiumRowCard(playerId: number, card: ImperiumRowCard | ImperiumRowPlot) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const costModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'imperiumRow');
    const costModifier = getCardCostModifier(card, costModifiers);

    const availablePersuasion = this.playerManager.getPlayerPersuasion(playerId);
    const playerCanAffordCard = !card.persuasionCosts || availablePersuasion >= card.persuasionCosts + costModifier;

    if (playerCanAffordCard) {
      if (card.persuasionCosts) {
        this.playerManager.addPersuasionSpentToPlayer(playerId, card.persuasionCosts + costModifier);
      }
      if (card.type === 'imperium-card') {
        if (card.buyEffects && card.buyEffects.length > 0) {
          for (const effect of card.buyEffects) {
            this.addRewardToPlayer(player.id, effect);
          }

          this.resolveRewardChoices(player);
        }
        this.cardsService.aquirePlayerCardFromImperiumRow(playerId, card);
      } else {
        this.cardsService.aquirePlayerPlotFromImperiumRow(playerId, card);
      }

      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [card] });
      this.loggingService.logPlayerBoughtCard(playerId, this.t.translateLS(card.name));
    }
  }

  acquireImperiumDeckCard(playerId: number, card: ImperiumDeckCard) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return false;
    }

    const costModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'imperiumRow');
    const costModifier = getCardCostModifier(card, costModifiers);

    const availablePersuasion = this.playerManager.getPlayerPersuasion(playerId);
    const playerCanAffordCard = !card.persuasionCosts || availablePersuasion >= card.persuasionCosts + costModifier;

    if (playerCanAffordCard) {
      if (card.persuasionCosts) {
        this.playerManager.addPersuasionSpentToPlayer(playerId, card.persuasionCosts + costModifier);
      }
      if (card.buyEffects && card.buyEffects.length > 0) {
        for (const effect of card.buyEffects) {
          this.addRewardToPlayer(player.id, effect);
        }

        this.resolveRewardChoices(player);
      }
      this.cardsService.aquirePlayerCardFromImperiumDeck(playerId, card);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [card] });

      this.loggingService.logPlayerBoughtCard(playerId, this.t.translateLS(card.name));
      return true;
    } else {
      return false;
    }
  }

  acquireCustomImperiumCard(playerId: number, card: ImperiumDeckCard) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const costModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'imperiumRow');
    const costModifier = getCardCostModifier(card, costModifiers);

    const availablePersuasion = this.playerManager.getPlayerPersuasion(playerId);
    const playerCanAffordCard = !card.persuasionCosts || availablePersuasion >= card.persuasionCosts + costModifier;

    if (playerCanAffordCard) {
      if (card.persuasionCosts) {
        this.playerManager.addPersuasionSpentToPlayer(playerId, card.persuasionCosts + costModifier);
      }
      if (card.buyEffects) {
        for (const effect of card.buyEffects) {
          this.addRewardToPlayer(player.id, effect);
        }

        this.resolveRewardChoices(player);
      }
      this.cardsService.aquirePlayerCardFromLimitedCustomCards(playerId, card);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [card] });

      this.loggingService.logPlayerBoughtCard(playerId, this.t.translateLS(card.name));
    }
  }

  acquirePlayerTechTile(playerId: number, techTile: TechTileCard) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const canBuyTech = this.turnInfoService.getPlayerTurnInfo(playerId)?.canBuyTech;
    if (!canBuyTech) {
      this.notificationService.showWarning(this.t.translate('techBoardWarningNoTechGainedThisTurn'));
      return;
    }

    const costModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'techTiles');
    const costModifier = getTechTileCostModifier(techTile, costModifiers);

    const availablePlayerSpice = player.resources.find((x) => x.type === 'spice')?.amount ?? 0;
    const availablePlayerTech = player.tech;
    const playerCanAffordTechTile = techTile.costs + costModifier <= availablePlayerSpice + availablePlayerTech;

    if (playerCanAffordTechTile) {
      this.buyTechTileForPlayer(player, techTile, availablePlayerTech, 0);
    }
  }

  private getGameState(player: Player): GameState {
    const playerDeckCards = this.cardsService.getPlayerDeck(player.id)?.cards ?? [];
    const playerHandCards = this.cardsService.getPlayerHand(player.id)?.cards ?? [];
    const playerDiscardPileCards = this.cardsService.getPlayerDiscardPile(player.id)?.cards ?? [];
    const playerTrashPileCards = this.cardsService.getPlayerTrashPile(player.id)?.cards;
    const playerCardsTrashed = playerTrashPileCards?.length ?? 0;

    const playerCards = [...playerDeckCards, ...playerHandCards, ...playerDiscardPileCards];

    const playerCardsFactions = this.getInitialFactions();
    const playerCardsFieldAccess = this.getInitialPlayerCardsFieldAccess();
    const playerCardsRewards = this.getInitialPlayerCardsRewards();

    const playerGameModifiers = this.gameModifiersService.getPlayerGameModifiers(player.id);

    for (const playerCard of playerCards) {
      if (playerCard.faction) {
        playerCardsFactions[playerCard.faction] += 1;
      }
      if (playerCard.fieldAccess) {
        for (const access of playerCard.fieldAccess) {
          playerCardsFieldAccess[access] += 1;
        }
      }
      if (playerCard.structuredAgentEffects?.rewards) {
        for (const reward of playerCard.structuredAgentEffects.rewards) {
          playerCardsRewards[reward.type] += reward.amount ?? 1;
        }
      }
      if (playerCard.structuredRevealEffects?.rewards) {
        for (const reward of playerCard.structuredRevealEffects.rewards) {
          playerCardsRewards[reward.type] += reward.amount ?? 1;
        }
      }
    }
    const playerCardsFactionsInPlay = this.getInitialFactions();
    for (const playerCard of playerDiscardPileCards) {
      if (playerCard.faction) {
        playerCardsFactionsInPlay[playerCard.faction] += 1;
      }
    }

    const playerTechTilesFactions = this.getInitialFactions();
    const playerTechTiles = this.techTilesService.getPlayerTechTiles(player.id).map((x) => x.techTile);
    for (const techTile of playerTechTiles) {
      if (techTile.faction) {
        playerTechTilesFactions[techTile.faction] += 1;
      }
    }

    const playerCardsBought =
      (playerDeckCards.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerHandCards.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerDiscardPileCards.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerTrashPileCards?.filter((x) => x.persuasionCosts).length ?? 0);

    const playerCombatUnits = this.combatManager.getPlayerCombatUnits(player.id)!;
    const playerDreadnoughtCount = getPlayerdreadnoughtCount(playerCombatUnits);

    const playerScore = this.playerScoreManager.getPlayerScore(player.id)!;
    const playerFactionFriendships = this.getFactionFriendships(playerScore);
    const playerFieldUnlocksForFactions = this.gameModifiersService.getPlayerFieldUnlocksForFactions(player.id) ?? [];
    const playerFieldUnlocksForIds = this.gameModifiersService.getPlayerFieldUnlocksForIds(player.id) ?? [];
    const playerEnemyFieldTypeAcessTroughCards = flatten(
      playerHandCards.filter((x) => x.fieldAccess && x.canInfiltrate).map((x) => x.fieldAccess)
    ) as ActionType[];
    const playerEnemyFieldTypeAcessTroughGameModifiers =
      this.gameModifiersService.getPlayerFieldEnemyAcessForActionTypes(player.id) ?? [];

    const playerBlockedFieldsForActionTypes =
      this.gameModifiersService.getPlayerBlockedFieldsForActionTypes(player.id) ?? [];
    const playerBlockedFieldsForIds = this.gameModifiersService.getPlayerBlockedFieldsForIds(player.id) ?? [];

    const playerIntrigues = this.intriguesService.getPlayerIntrigues(player.id) ?? [];
    const playerCombatIntrigues = playerIntrigues.filter((x) => x.type === 'combat');
    const playerIntrigueCount = playerIntrigues.length;
    const playerCombatIntrigueCount = playerCombatIntrigues.length;
    const playerIntrigueStealAmount = this.intriguesService
      .getEnemyIntrigues(player.id)
      .filter((x) => x.intrigues.length > 3).length;

    const playerLocations = this.locationManager.ownedLocations
      .filter((x) => x.playerId === player.id)
      .map((x) => x.locationId);
    const enemyLocations = this.locationManager.ownedLocations
      .filter((x) => x.playerId !== player.id)
      .map((x) => x.locationId);
    const freeLocations = this.settingsService.controllableLocations.filter(
      (x) => !playerLocations.includes(x) && !enemyLocations.includes(x)
    );

    const enemyScore = this.playerScoreManager.getEnemyScore(player.id)!;

    const rivalId = enemyScore.sort((a, b) => b.victoryPoints - a.victoryPoints)[0];
    const rival = this.playerManager.getPlayer(rivalId.playerId);

    const playerLeader = this.leadersService.getLeader(player.id);
    const playerTurnInfos = this.turnInfoService.getPlayerTurnInfo(player.id);

    return {
      currentRound: this.currentRound,
      accumulatedSpiceOnFields: this.accumulatedSpiceOnFields,
      playerAgentsAvailable: this.availablePlayerAgents.find((x) => x.playerId === player.id)?.agentAmount ?? 0,
      enemyAgentsAvailable: this.availablePlayerAgents.filter((x) => x.playerId !== player.id),
      playerScore: playerScore,
      enemyScore,
      playerCombatUnits,
      enemyCombatUnits: this.combatManager.getEnemyCombatUnits(player.id),
      agentsOnFields: this.agentsOnFields,
      playerAgentsOnFields: this.agentsOnFields.filter((x) => x.playerId === player.id),
      enemyAgentsOnFields: this.agentsOnFields.filter((x) => x.playerId !== player.id),
      isOpeningTurn: this.isOpeningTurn(player.id),
      isFinale: this.isFinale,
      enemyPlayers: this.playerManager.getEnemyPlayers(player.id),
      playerLeader: playerLeader!,
      playerLeaderSignetRingEffects: playerLeader?.structuredSignetEffects,
      conflict: this.conflictsService.currentConflict,
      availableTechTiles: this.techTilesService.buyableTechTiles,
      currentEvent: this.duneEventsManager.eventDeck[this.currentRound - 1],
      playerDeckSizeTotal:
        (playerDeckCards?.length ?? 0) + (playerHandCards?.length ?? 0) + (playerDiscardPileCards?.length ?? 0),
      playerHandCards,
      playerDeckCards,
      playerDiscardPileCards,
      playerTrashPileCards,
      playerCardsBought,
      playerCardsTrashed,
      playerDreadnoughtCount,
      imperiumRowCards: this.cardsService.imperiumRow,
      playerFactionFriendships,
      playerFieldUnlocksForFactions,
      playerFieldUnlocksForIds,
      playerEnemyFieldTypeAcessTroughCards,
      playerEnemyFieldTypeAcessTroughGameModifiers,
      blockedFieldsForActionTypes: playerBlockedFieldsForActionTypes,
      blockedFieldsForIds: playerBlockedFieldsForIds,
      playerIntrigues,
      playerCombatIntrigues,
      playerIntrigueCount,
      playerCombatIntrigueCount,
      playerIntrigueStealAmount,
      playerLocations,
      enemyLocations,
      freeLocations,
      rival,
      playerTurnInfos,
      playerCardsFactions,
      playerCardsFieldAccess,
      playerCardsRewards,
      playerCardsFactionsInPlay,
      playerGameModifiers,
      playerTechTilesFactions,
    } as GameState;
  }

  private fieldHasAccumulatedSpice(fieldId: string) {
    return this.accumulatedSpiceOnFields.some((x) => x.fieldId === fieldId);
  }

  private getAccumulatedSpiceForField(fieldId: string) {
    return this.accumulatedSpiceOnFields.find((x) => x.fieldId === fieldId)?.amount ?? 0;
  }

  public increaseAccumulatedSpiceOnField(fieldId: string) {
    const accumulatedSpiceOnFields = this.accumulatedSpiceOnFields;

    const index = accumulatedSpiceOnFields.findIndex((x) => x.fieldId === fieldId);
    if (index > -1) {
      const element = accumulatedSpiceOnFields[index];
      accumulatedSpiceOnFields[index] = {
        ...element,
        amount: element.amount + 1,
      };
    } else {
      accumulatedSpiceOnFields.push({ fieldId, amount: 1 });
    }

    this.accumulatedSpiceOnFieldsSubject.next(accumulatedSpiceOnFields);
  }

  public decreaseAccumulatedSpiceOnField(fieldId: string, amount = 1) {
    const accumulatedSpiceOnFields = this.accumulatedSpiceOnFields;

    const index = accumulatedSpiceOnFields.findIndex((x) => x.fieldId === fieldId && x.amount > 0);
    if (index > -1) {
      const element = accumulatedSpiceOnFields[index];
      accumulatedSpiceOnFields[index] = {
        ...element,
        amount: element.amount - amount,
      };
    }

    this.accumulatedSpiceOnFieldsSubject.next(accumulatedSpiceOnFields);
  }

  public resetAccumulatedSpiceOnField(fieldId: string) {
    const accumulatedSpiceOnFields = this.accumulatedSpiceOnFields;

    const index = accumulatedSpiceOnFields.findIndex((x) => x.fieldId === fieldId && x.amount > 0);
    if (index > -1) {
      const element = accumulatedSpiceOnFields[index];
      accumulatedSpiceOnFields[index] = {
        ...element,
        amount: 0,
      };
    }

    this.accumulatedSpiceOnFieldsSubject.next(accumulatedSpiceOnFields);
  }

  private accumulateSpiceOnFields(amount = 1) {
    const spiceFieldNames = this.settingsService.spiceAccumulationFields;

    const accumulatedSpiceOnFields = this.accumulatedSpiceOnFields;

    for (let fieldName of spiceFieldNames) {
      if (!this.agentsOnFields.some((x) => x.fieldId === fieldName)) {
        const index = accumulatedSpiceOnFields.findIndex((x) => x.fieldId === fieldName);
        if (index > -1) {
          const element = accumulatedSpiceOnFields[index];
          accumulatedSpiceOnFields[index] = {
            ...element,
            amount: element.amount + amount,
          };
        } else {
          accumulatedSpiceOnFields.push({ fieldId: fieldName, amount: amount });
        }
      } else {
        const index = accumulatedSpiceOnFields.findIndex((x) => x.fieldId === fieldName);

        if (index > -1) {
          accumulatedSpiceOnFields.splice(index, 1);
        }
      }
    }

    this.accumulatedSpiceOnFieldsSubject.next(accumulatedSpiceOnFields);
  }

  private resetAccumulatedSpiceOnFields() {
    this.accumulatedSpiceOnFieldsSubject.next([]);
  }

  private playerCanPayCosts(playerId: number, costs: EffectReward[]) {
    let canPayCosts = true;
    const player = this.playerManager.getPlayer(playerId);
    const playerScore = this.playerScoreManager.getPlayerScore(playerId);
    const playerCombatUnits = this.combatManager.getPlayerCombatUnits(playerId);
    let playerIntrigueCount = this.intriguesService.getPlayerIntrigueCount(playerId);
    let playerCombatScore = this.combatManager.getPlayerCombatScore(playerId);
    const playerHandCards = this.cardsService.getPlayerHand(playerId)?.cards;

    if (player) {
      for (let cost of costs) {
        const costType = cost.type;
        const costAmount = cost.amount ?? 1;
        if (isResourceType(costType)) {
          const resourceIndex = player.resources.findIndex((x) => x.type === cost.type);
          const currentResourceAmount = player.resources[resourceIndex].amount;

          if (currentResourceAmount && currentResourceAmount >= costAmount) {
            player.resources[resourceIndex].amount = currentResourceAmount - costAmount;
          } else {
            canPayCosts = false;
          }
        } else if (costType === 'tech') {
          if (player.tech < costAmount) {
            canPayCosts = false;
          }
        } else if (costType === 'card-discard') {
          if (playerHandCards && playerHandCards.length >= costAmount) {
            playerHandCards.splice(0, costAmount);
          } else {
            canPayCosts = false;
          }
        } else if (costType === 'persuasion') {
          player.persuasionSpentThisRound += costAmount;
          if (player.persuasionSpentThisRound > player.permanentPersuasion + player.persuasionGainedThisRound) {
            canPayCosts = false;
          }
        } else if (costType === 'sword') {
          if (playerCombatScore >= costAmount) {
            playerCombatScore -= 1;
          } else {
            canPayCosts = false;
          }
        } else if (costType === 'troop' || costType === 'loose-troop') {
          if (playerCombatUnits && playerCombatUnits.troopsInGarrison >= costAmount) {
            playerCombatUnits.troopsInGarrison -= costAmount;
          } else {
            canPayCosts = false;
          }
        } else if (costType === 'intrigue-trash') {
          playerIntrigueCount -= 1;
          if (playerIntrigueCount < 0) {
            canPayCosts = false;
          }
        } else if (isFactionScoreCostType(costType)) {
          const scoreType = getFactionScoreTypeFromCost(cost);
          if (scoreType && playerScore && playerScore[scoreType] >= costAmount) {
            playerScore[scoreType] -= 1;
          } else {
            canPayCosts = false;
          }
        } else if (costType === 'faction-influence-down-choice') {
          if (playerScore) {
            let counter = 0;
            counter += playerScore.bene > 0 ? 1 : 0;
            counter += playerScore.fremen > 0 ? 1 : 0;
            counter += playerScore.emperor > 0 ? 1 : 0;
            counter += playerScore.guild > 0 ? 1 : 0;

            if (counter < 1) {
              canPayCosts = false;
            }
          }
        }
      }
    }

    return canPayCosts;
  }

  private aiBuyTechIfPossible(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const costModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'techTiles');

    const buyableTechTiles = this.techTilesService.buyableTechTiles;
    const availablePlayerSpice = player.resources.find((x) => x.type === 'spice')?.amount ?? 0;
    const availablePlayerTech = player.tech;
    const affordableTechTiles = buyableTechTiles.filter(
      (x) => x.costs + getTechTileCostModifier(x, costModifiers) <= availablePlayerTech + availablePlayerSpice
    );

    if (affordableTechTiles.length > 0) {
      const gameState = this.getGameState(player);
      const mostDesiredTechTile = buyableTechTiles.sort(
        (a, b) =>
          this.aIManager.getTechTileEvaluation(b, player, gameState) -
          this.aIManager.getTechTileEvaluation(a, player, gameState)
      )[0];

      const desire = this.aIManager.getTechTileEvaluation(mostDesiredTechTile, player, gameState);
      const effectiveCosts = mostDesiredTechTile.costs - availablePlayerTech;

      if (
        affordableTechTiles.some((x) => x.name.en === mostDesiredTechTile.name.en) &&
        (desire > 0.25 || effectiveCosts < 1)
      ) {
        const costModifier = getTechTileCostModifier(mostDesiredTechTile, costModifiers);
        this.buyTechTileForPlayer(player, mostDesiredTechTile, availablePlayerTech, costModifier);
      } else if (this.isFinale) {
        const costModifier = getTechTileCostModifier(affordableTechTiles[0], costModifiers);
        this.buyTechTileForPlayer(player, affordableTechTiles[0], availablePlayerTech, costModifier);
      }
    }
  }

  private buyTechTileForPlayer(player: Player, techTile: TechTileCard, techAmount: number, discount: number) {
    const effectiveCosts = techTile.costs - discount;

    if (effectiveCosts > 0) {
      if (techAmount) {
        const techCosts = effectiveCosts > techAmount ? techAmount : effectiveCosts;
        this.playerManager.removeTechFromPlayer(player.id, techCosts);
        this.loggingService.logPlayerResourcePaid(player.id, 'tech', techCosts);
      }

      if (effectiveCosts > techAmount) {
        this.playerManager.removeResourceFromPlayer(player.id, 'spice', effectiveCosts - techAmount);
        this.loggingService.logPlayerResourcePaid(player.id, 'spice', effectiveCosts - techAmount);
      }
    }

    this.techTilesService.setPlayerTechTile(player.id, techTile.name.en);

    if (techTile.buyEffects) {
      for (const reward of techTile.buyEffects) {
        this.addRewardToPlayer(player.id, reward);
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

  private isOpeningTurn(playerId: number) {
    if (this.currentRound === 1) {
      return this.availablePlayerAgents.find((x) => x.playerId == playerId)?.agentAmount === 2;
    }
    return false;
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

  public addRewardToPlayer(playerId: number, reward: EffectReward, element?: GameElement, source?: string) {
    const playerGameModifier = this.gameModifiersService.getPlayerGameModifiers(playerId);

    const rewardType = reward.type;
    const rewardAmount = reward.amount ?? 1;
    if (isResourceType(rewardType)) {
      if (rewardType === 'solari') {
        this.audioManager.playSound('solari', rewardAmount);
      } else if (rewardType === 'water') {
        this.audioManager.playSound('water', rewardAmount);
      } else if (rewardType === 'spice') {
        this.audioManager.playSound('spice', rewardAmount);
      }

      this.playerManager.addResourceToPlayer(playerId, rewardType, rewardAmount);
    } else if (rewardType === 'shipping') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { shippingAmount: 1 });
    } else if (isFactionScoreRewardType(rewardType)) {
      this.audioManager.playSound('influence');

      const scoreType = getFactionScoreTypeFromReward(reward);
      const factionInfluenceModifier = getFactionInfluenceModifier(playerGameModifier, scoreType);
      if (factionInfluenceModifier) {
        if (factionInfluenceModifier.noInfluence) {
          if (factionInfluenceModifier.alternateReward) {
            this.addRewardToPlayer(playerId, factionInfluenceModifier.alternateReward);
          }
        }
      } else {
        const factionRewards = this.playerScoreManager.addFactionScore(
          playerId,
          scoreType as PlayerFactionScoreType,
          1,
          this.currentRound
        );

        for (const reward of factionRewards) {
          this.addRewardToPlayer(playerId, reward, element, 'Influence');
        }
      }
    } else if (rewardType === 'faction-influence-up-choice') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionInfluenceUpChoiceAmount: 1 });
    } else if (rewardType === 'faction-influence-up-twice-choice') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionInfluenceUpChoiceTwiceAmount: 1 });
    } else if (isFactionScoreCostType(rewardType)) {
      this.audioManager.playSound('fog');

      const scoreType = getFactionScoreTypeFromCost(reward);

      this.playerScoreManager.removePlayerScore(playerId, scoreType as PlayerFactionScoreType, 1, this.currentRound);
    } else if (rewardType === 'faction-influence-down-choice') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionInfluenceDownChoiceAmount: 1 });
    } else if (rewardType === 'tech') {
      this.audioManager.playSound('tech-agent', rewardAmount);
      this.playerManager.addTechToPlayer(playerId, rewardAmount);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { canBuyTech: true });
    } else if (rewardType === 'intrigue') {
      this.audioManager.playSound('intrigue', rewardAmount);
      this.intriguesService.drawPlayerIntriguesFromDeck(playerId, rewardAmount);
    } else if (rewardType === 'troop') {
      this.audioManager.playSound('troops', rewardAmount);
      this.combatManager.addPlayerTroopsToGarrison(playerId, rewardAmount);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { troopsGainedThisTurn: rewardAmount });
    } else if (rewardType === 'dreadnought') {
      this.audioManager.playSound('dreadnought');
      this.combatManager.addPlayerShipsToGarrison(playerId, 1);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { troopsGainedThisTurn: rewardAmount });
    } else if (rewardType === 'card-draw') {
      this.audioManager.playSound('card-draw');
      this.cardsService.drawPlayerCardsFromDeck(playerId, rewardAmount);
    } else if (rewardType === 'card-destroy') {
      this.playerManager.addFocusTokens(playerId, rewardAmount);
    } else if (rewardType == 'card-draw-or-destroy') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardDrawOrDestroyAmount: 1 });
    } else if (rewardType === 'card-discard') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardDiscardAmount: 1 });
    } else if (rewardType === 'focus') {
      this.audioManager.playSound('focus');
      this.playerManager.addFocusTokens(playerId, rewardAmount);
    } else if (rewardType == 'persuasion') {
      this.playerManager.addPersuasionGainedToPlayer(playerId, rewardAmount);
    } else if (rewardType == 'sword') {
      this.audioManager.playSound('sword');
      this.combatManager.addAdditionalCombatPowerToPlayer(playerId, rewardAmount);
    } else if (rewardType === 'council-seat-small' || rewardType === 'council-seat-large') {
      this.addHighCouncilSeatIfPossible(playerId);
    } else if (rewardType === 'sword-master' || rewardType === 'agent') {
      this.addSwordmasterIfPossible(playerId);
      this.addAgentToPlayer(playerId);
    } else if (rewardType === 'mentat') {
      this.addAgentToPlayer(playerId);
    } else if (rewardType === 'agent-lift') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { canLiftAgent: true });
    } else if (rewardType === 'victory-point') {
      this.audioManager.playSound('victory-point');
      this.playerScoreManager.addPlayerScore(playerId, 'victoryPoints', rewardAmount, this.currentRound);
      this.loggingService.logPlayerGainedVictoryPoint(playerId, this.currentRound, source);
      return;
    } else if (rewardType === 'foldspace') {
      const foldspaceCard = this.settingsService
        .getCustomCards()
        ?.find((x) => x.name.en.toLocaleLowerCase() === 'foldspace');
      if (foldspaceCard) {
        this.cardsService.addCardToPlayerHand(playerId, this.cardsService.instantiateImperiumCard(foldspaceCard));
      }
    } else if (rewardType === 'location-control') {
      this.audioManager.playSound('location-control');
      this.turnInfoService.updatePlayerTurnInfo(playerId, { locationControlAmount: 1 });
    } else if (rewardType === 'signet-ring') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { signetRingAmount: 1 });
    } else if (rewardType === 'signet-token') {
      this.audioManager.playSound('signet');
      this.playerManager.addSignetTokensToPlayer(playerId, rewardAmount);
    } else if (rewardType === 'trash-self' && element) {
      if (element.type === 'card') {
        this.cardsService.trashPlayerHandCard(playerId, element.object);
        this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(element.object.name));
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsTrashedThisTurn: [element.object] });
      } else if (element.type === 'tech-tile') {
        this.techTilesService.trashTechTile(element.object.id);
        this.loggingService.logPlayerTrashedTechTile(playerId, this.t.translateLS(element.object.name));
      }
    } else if (reward.type === 'tech-tile-flip' && element) {
      if (element.type === 'tech-tile') {
        this.techTilesService.flipTechTile(element.object.id);
        this.audioManager.playSound('tech-tile');
        this.turnInfoService.updatePlayerTurnInfo(playerId, { techTilesFlippedThisTurn: [element.object] });
        this.loggingService.logPlayerPlayedTechTile(playerId, this.t.translateLS(element.object.name));
      }
    } else if (reward.type === 'combat') {
      this.audioManager.playSound('combat');

      let deployableUnits = this.settingsService.getCombatMaxDeployableUnits();
      const combatModifier = this.gameModifiersService.getPlayerGameModifier(playerId, 'combat');
      if (combatModifier && combatModifier.combatMaxDeployableUnits) {
        deployableUnits = combatModifier.combatMaxDeployableUnits;
      }

      this.turnInfoService.setPlayerTurnInfo(playerId, { canEnterCombat: true, deployableUnits });
    } else if (reward.type === 'intrigue-draw') {
      const enemiesIntrigues = this.intriguesService.getEnemyIntrigues(playerId).filter((x) => x.intrigues.length > 3);
      for (const enemyIntrigues of enemiesIntrigues) {
        const stolenIntrigue = getRandomElementFromArray(enemyIntrigues.intrigues);
        this.intriguesService.trashPlayerIntrigue(enemyIntrigues.playerId, stolenIntrigue.id);
        this.intriguesService.addPlayerIntrigue(playerId, stolenIntrigue);
        this.loggingService.logPlayerStoleIntrigue(playerId, enemyIntrigues.playerId);
      }
    } else if (reward.type === 'recruitment-bene') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionRecruitment: ['bene'] });
    } else if (reward.type === 'recruitment-fremen') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionRecruitment: ['fremen'] });
    } else if (reward.type === 'recruitment-guild') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionRecruitment: ['guild'] });
    } else if (reward.type === 'recruitment-emperor') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionRecruitment: ['emperor'] });
    }

    this.loggingService.logPlayerResourceGained(playerId, rewardType, rewardAmount);
  }

  public payCostForPlayer(playerId: number, cost: EffectReward, source?: string, element?: GameElement) {
    const costType = cost.type;
    const costAmount = cost.amount ?? 1;
    if (isResourceType(costType)) {
      this.playerManager.removeResourceFromPlayer(playerId, costType, costAmount);
    } else if (costType === 'shipping') {
      this.playerManager.removeResourceFromPlayer(playerId, 'water', costAmount);
    } else if (costType === 'tech') {
      this.playerManager.removeTechFromPlayer(playerId, costAmount);
    } else if (isFactionScoreRewardType(costType)) {
      const scoreType = getFactionScoreTypeFromReward(cost);

      this.playerScoreManager.removePlayerScore(playerId, scoreType as PlayerFactionScoreType, 1, this.currentRound);
    } else if (costType === 'faction-influence-down-choice') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionInfluenceDownChoiceAmount: 1 });
    } else if (costType === 'intrigue' || costType === 'intrigue-trash') {
      this.aiTrashIntrigue(playerId);
    } else if (costType === 'sword') {
      this.combatManager.removeAdditionalCombatPowerFromPlayer(playerId, costAmount);
    } else if (costType === 'troop' || costType === 'loose-troop') {
      this.combatManager.removePlayerTroopsFromGarrison(playerId, costAmount);
    } else if (costType === 'dreadnought') {
      this.combatManager.removePlayerShipsFromGarrison(playerId, 1);
    } else if (costType === 'card-discard') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardDiscardAmount: 1 });
    } else if (costType === 'card-destroy' || costType === 'focus') {
      this.playerManager.addFocusTokens(playerId, costAmount);
    } else if (costType === 'persuasion') {
      this.playerManager.addPersuasionSpentToPlayer(playerId, costAmount);
    } else if (costType === 'victory-point') {
      this.playerScoreManager.removePlayerScore(playerId, 'victoryPoints', costAmount, this.currentRound);
      this.loggingService.logPlayerLostVictoryPoint(playerId, this.currentRound, source);
    } else if (costType === 'trash-self' && element) {
      if (element.type === 'card') {
        this.cardsService.trashPlayerHandCard(playerId, element.object);
        this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(element.object.name));
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsTrashedThisTurn: [element.object] });
      } else if (element.type === 'tech-tile') {
        this.techTilesService.trashTechTile(element.object.id);
        this.loggingService.logPlayerTrashedTechTile(playerId, this.t.translateLS(element.object.name));
      }
    } else if (costType === 'tech-tile-flip' && element) {
      if (element.type === 'tech-tile') {
        this.techTilesService.flipTechTile(element.object.id);
        this.audioManager.playSound('tech-tile');
        this.turnInfoService.updatePlayerTurnInfo(playerId, { techTilesFlippedThisTurn: [element.object] });
        this.loggingService.logPlayerPlayedTechTile(playerId, this.t.translateLS(element.object.name));
      }
    }

    this.loggingService.logPlayerResourcePaid(playerId, costType, cost.amount);
  }

  public lockInLeader(playerId: number, leader: LeaderDeckCard) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }
    this.leadersService.lockInLeader(playerId);

    if (leader.startingResources) {
      for (const startingResource of leader.startingResources) {
        this.addRewardToPlayer(player.id, startingResource);
      }
    }
    if (leader.gameModifiers) {
      this.gameModifiersService.addPlayerGameModifiers(playerId, leader.gameModifiers);
    }
    if (leader.structuredPassiveEffects) {
      const gameState = this.getGameState(player);
      this.resolveStructuredEffects(leader.structuredPassiveEffects, player, gameState);
    }

    this.resolveRewardChoices(player);
  }

  private addSwordmasterIfPossible(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);

    if (player && !player.hasSwordmaster) {
      this.audioManager.playSound('swordmaster');
      this.playerManager.addPermanentAgentToPlayer(playerId);
    }
  }

  private addHighCouncilSeatIfPossible(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);
    if (player && !player.hasCouncilSeat) {
      this.audioManager.playSound('high-council');
      this.playerManager.addCouncilSeatToPlayer(playerId);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionInfluenceUpChoiceAmount: 1 });
    }
  }

  public addMinimumUnitsToCombat(
    playerId: number,
    playerCombatUnits: PlayerCombatUnits,
    enemyCombatScores: PlayerCombatScore[],
    playerHasAgentsLeft: boolean
  ) {
    if (playerHasAgentsLeft) {
      let troopsAdded = 0;

      if (playerCombatUnits.troopsInGarrison > 0) {
        const maxTroopAddChance = playerCombatUnits.troopsInGarrison * 0.2;
        const troopsToAdd = playerCombatUnits.troopsInGarrison > 1 && Math.random() < maxTroopAddChance ? 2 : 1;

        this.combatManager.addPlayerTroopsToCombat(playerId, troopsToAdd);
        troopsAdded = troopsToAdd;
      }

      if (troopsAdded === 0 && playerCombatUnits.shipsInGarrison > 0) {
        if (playerCombatUnits.shipsInGarrison > 0 || Math.random() > 0.75) {
          this.combatManager.addPlayerShipsToCombat(playerId, 1);
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
      this.combatManager.addPlayerTroopsToCombat(playerId, troopsToAdd);
    }
  }

  private aiAddFactionInfluenceUpChoice(player: Player, amount: number) {
    const increasedFactionScoreTypes: PlayerFactionScoreType[] = [];
    for (let i = amount; i > 0; i--) {
      const playerScores = this.playerScoreManager.playerScores;
      if (playerScores) {
        const desiredScoreType = this.aIManager.getMostDesiredFactionScoreType(
          player.id,
          playerScores,
          1,
          increasedFactionScoreTypes
        );

        if (desiredScoreType) {
          const factionRewards = this.playerScoreManager.addFactionScore(player.id, desiredScoreType, 1, this.currentRound);
          increasedFactionScoreTypes.push(desiredScoreType);

          for (const reward of factionRewards) {
            this.addRewardToPlayer(player.id, reward, undefined, 'Influence');
          }
        }
      }
    }
  }

  private aiAddFactionInfluenceUpChoiceTwice(player: Player, amount: number) {
    const increasedFactionScoreTypes: PlayerFactionScoreType[] = [];
    for (let i = amount; i > 0; i--) {
      const playerScores = this.playerScoreManager.playerScores;
      if (playerScores) {
        const desiredScoreType = this.aIManager.getMostDesiredFactionScoreType(
          player.id,
          playerScores,
          1,
          increasedFactionScoreTypes
        );

        if (desiredScoreType) {
          const factionRewards = this.playerScoreManager.addFactionScore(player.id, desiredScoreType, 2, this.currentRound);
          increasedFactionScoreTypes.push(desiredScoreType);

          for (const reward of factionRewards) {
            this.addRewardToPlayer(player.id, reward, undefined, 'Influence');
          }
        }
      }
    }
  }

  private addFactionInfluenceDownChoiceForAI(playerId: number, amount: number) {
    for (let i = amount; i > 0; i--) {
      const playerScores = this.playerScoreManager.getPlayerScore(playerId);
      if (playerScores) {
        const leastDesiredScoreType = this.aIManager.getLeastDesiredFactionScoreType(playerScores);
        if (leastDesiredScoreType) {
          this.playerScoreManager.removePlayerScore(playerId, leastDesiredScoreType, 1, this.currentRound);
        }
      }
    }
  }

  private getExtractedRewardsFromCustomAgentEffect(customAgentEffect: string) {
    const rewards: Effect[] = [];
    let restString = customAgentEffect;

    const potentialReward = customAgentEffect.slice(0, customAgentEffect.indexOf('}') + 1).trim();

    const resourceRegExp = /^{resource:.*?}/g;
    const isReward = resourceRegExp.test(potentialReward);
    if (isReward) {
      const amountRegExp = /;amount:.*?}/g;
      const amountString = potentialReward.match(amountRegExp);
      if (!amountString) {
        const resource = potentialReward.substring(10, potentialReward.length - 1) as EffectRewardType;
        rewards.push({ type: resource, amount: 1 });
      } else {
        const amount = amountString[0].substring(8, amountString[0].length - 1);
        const amountNumber = parseInt(amount);

        const resource = potentialReward.substring(10, potentialReward.length - amount.length - 9) as EffectRewardType;
        rewards.push({ type: resource, amount: amountNumber });
      }
      restString = customAgentEffect.slice(customAgentEffect.indexOf('}') + 1).trim();
      if (restString.length > 0) {
        const newResult = this.getExtractedRewardsFromCustomAgentEffect(restString);
        rewards.push(...newResult.rewards);
        restString = newResult.restString;
      }
    }
    return { rewards: rewards, restString: restString };
  }

  private getFactionFriendships(playerScore: PlayerScore) {
    const result: PlayerFactionScoreType[] = [];
    for (const [index, value] of Object.entries(playerScore)) {
      if (value > 1 && isFactionScoreType(index)) {
        result.push(index);
      }
    }
    return result;
  }

  private getInitialFactions(): Factions {
    return {
      bene: 0,
      emperor: 0,
      fremen: 0,
      guild: 0,
    };
  }

  private getInitialPlayerCardsFieldAccess(): PlayerCardsFieldAccess {
    return {
      fremen: 0,
      bene: 0,
      guild: 0,
      emperor: 0,
      spice: 0,
      landsraad: 0,
      choam: 0,
      town: 0,
    };
  }

  private getInitialPlayerCardsRewards(): PlayerCardsRewards {
    return {
      water: 0,
      spice: 0,
      solari: 0,
      troop: 0,
      dreadnought: 0,
      agent: 0,
      'agent-lift': 0,
      buildup: 0,
      'card-destroy': 0,
      'card-discard': 0,
      'card-draw': 0,
      'card-draw-or-destroy': 0,
      'card-round-start': 0,
      combat: 0,
      'council-seat-large': 0,
      'council-seat-small': 0,
      'faction-influence-down-bene': 0,
      'faction-influence-down-choice': 0,
      'faction-influence-down-emperor': 0,
      'faction-influence-down-fremen': 0,
      'faction-influence-down-guild': 0,
      'faction-influence-up-bene': 0,
      'faction-influence-up-choice': 0,
      'faction-influence-up-emperor': 0,
      'faction-influence-up-fremen': 0,
      'faction-influence-up-guild': 0,
      'faction-influence-up-twice-choice': 0,
      focus: 0,
      foldspace: 0,
      intrigue: 0,
      'intrigue-draw': 0,
      'intrigue-trash': 0,
      'location-control': 0,
      'loose-troop': 0,
      mentat: 0,
      persuasion: 0,
      placeholder: 0,
      shipping: 0,
      'signet-ring': 0,
      'signet-token': 0,
      'spice-accumulation': 0,
      sword: 0,
      'sword-master': 0,
      tech: 0,
      'tech-tile': 0,
      'tech-tile-flip': 0,
      'victory-point': 0,
      'trash-self': 0,
      'recruitment-emperor': 0,
      'recruitment-fremen': 0,
      'recruitment-bene': 0,
      'recruitment-guild': 0,
      research: 0,
      specimen: 0,
      beetle: 0,
    };
  }
}
