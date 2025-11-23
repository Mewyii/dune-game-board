import { Injectable } from '@angular/core';
import { cloneDeep, flatten, max, shuffle } from 'lodash';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { hasCustomAgentEffect, hasCustomRevealEffect } from '../helpers/cards';
import { getPlayerdreadnoughtCount } from '../helpers/combat-units';
import { delay, getRandomElementFromArray, sum } from '../helpers/common';
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
  getFlattenedEffectRewardArray,
  getMultipliedRewardEffects,
  getRewardArrayAIInfos,
  getStructuredConversionEffectIfPossible,
  isChoiceEffectType,
  isConditionFullfilled,
  isConversionEffectType,
  isFactionScoreCostType,
  isFactionScoreRewardType,
  isNegativeEffect,
  isRewardEffect,
  isStructuredChoiceEffect,
  isStructuredConversionEffect,
  isStructuredRewardEffect,
  isTimingFullfilled,
  playerCanPayCosts,
} from '../helpers/rewards';
import { playerCanEnterCombat, turnInfosNeedToBeResolved } from '../helpers/turn-infos';
import {
  ActionField,
  ActionType,
  EffectPlayerTurnTiming,
  EffectReward,
  EffectRewardType,
  FactionType,
  StructuredChoiceEffect,
  StructuredConversionEffect,
  StructuredConversionOrRewardEffect,
  StructuredEffect,
} from '../models';
import { IntrigueDeckCard } from '../models/intrigue';
import { Player } from '../models/player';
import { StructuredChoiceEffectWithGameElement, StructuredConversionEffectWithGameElement } from '../models/turn-info';
import { AIManager } from './ai/ai.manager';

import {
  GameServices,
  GameState,
  PlayerGameElementFactions,
  PlayerGameElementFieldAccess,
  PlayerGameElementRewards,
} from '../models/ai';
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

export type RoundPhaseType = 'none' | 'select leaders' | 'agent-placement' | 'combat' | 'combat-resolvement' | 'done';

export type GameElement =
  | { type: 'imperium-card'; object: ImperiumDeckCard }
  | { type: 'tech-tile'; object: TechTileDeckCard }
  | { type: 'intrigue'; object: IntrigueDeckCard };

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
  public activePlayer$ = combineLatest([this.activePlayerIdSubject.asObservable(), this.playerManager.players$]).pipe(
    map(([activePlayerId, players]) => players.find((player) => player.id === activePlayerId))
  );

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

    if (this.settingsService.getUseTechtiles() && this.settingsService.getUseDreadnoughts()) {
      this.cardsService.createImperiumDeck();
      this.techTilesService.createTechTileDeck();
    } else if (this.settingsService.getUseTechtiles()) {
      this.techTilesService.createTechTileDeck(
        (card) =>
          !card.buyEffects?.some((x) => x.type === 'dreadnought') &&
          !card.effects?.some((x) => x.type === 'dreadnought-retreat') &&
          !card.effects?.some((x) => x.type === 'dreadnought-insert-or-retreat') &&
          !card.effects?.some((x) => x.type === 'dreadnought-insert')
      );

      this.cardsService.createImperiumDeck(
        (card) =>
          !card.buyEffects?.some((x) => x.type === 'dreadnought') &&
          !card.agentEffects?.some((x) => x.type === 'dreadnought-retreat') &&
          !card.revealEffects?.some((x) => x.type === 'dreadnought-insert-or-retreat') &&
          !card.revealEffects?.some((x) => x.type === 'dreadnought-insert')
      );
    } else if (this.settingsService.getUseDreadnoughts()) {
      this.cardsService.createImperiumDeck(
        (card) =>
          !card.buyEffects?.some((x) => x.type === 'tech') &&
          !card.agentEffects?.some((x) => x.type === 'tech') &&
          !card.revealEffects?.some((x) => x.type === 'tech')
      );
    } else {
      this.cardsService.createImperiumDeck(
        (card) =>
          !card.buyEffects?.some((x) => x.type === 'tech') &&
          !card.agentEffects?.some((x) => x.type === 'tech') &&
          !card.revealEffects?.some((x) => x.type === 'tech') &&
          !card.buyEffects?.some((x) => x.type === 'dreadnought') &&
          !card.agentEffects?.some((x) => x.type === 'dreadnought-retreat') &&
          !card.revealEffects?.some((x) => x.type === 'dreadnought-insert-or-retreat') &&
          !card.revealEffects?.some((x) => x.type === 'dreadnought-insert')
      );
    }

    this.cardsService.setInitialPlayerDecks();
    this.intriguesService.createIntrigueDeck();
    this.aIManager.setAIPlayers(newPlayers);
    this.leadersService.createLeaderDeck();
    this.leadersService.assignRandomLeadersToPlayers(newPlayers);
    this.conflictsService.createConflictDeck();
    this.minorHousesService.setInitialAvailableHouses();

    this.currentRoundSubject.next(1);
    this.currentRoundPhaseSubject.next('select leaders');
    this.startingPlayerIdSubject.next(1);
    this.activePlayerIdSubject.next(1);

    for (const player of newPlayers) {
      this.cardsService.drawPlayerCardsFromDeck(player.id, player.cardsDrawnAtRoundStart);

      if (player.isAI) {
        if (this.aIManager.aiDifficulty === 'hard') {
          this.addRewardToPlayer(player.id, { type: 'victory-point' });
        }

        if (player.id === this.startingPlayerId) {
          this.setActiveAIPlayer(this.startingPlayerId);
          this.setPreferredFieldsForAIPlayer(this.startingPlayerId);
        }
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

  public beginPlay() {
    this.audioManager.playSound('fog');
    this.currentRoundPhaseSubject.next('agent-placement');
    this.playerManager.increaseTurnNumberForPlayer(1);
    this.activePlayerIdSubject.next(1);
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
              this.addRewardToPlayer(player.id, reward, { source: 'Combat' });
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
            this.addRewardToPlayer(player.id, reward, { source: 'Combat' });
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
                for (let i = 0; i < dreadnoughtCount; i++) {
                  const updatedGameState = this.getGameState(player);
                  this.aiControlLocation(player, updatedGameState);
                }
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
    this.playerManager.resetTurnNumberForPlayers();

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
    this.playerManager.increaseTurnNumberForPlayer(this.startingPlayerId);

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
      if (playerLeader?.structuredPassiveEffects) {
        const gameState = this.getGameState(player);
        this.resolveStructuredEffects(playerLeader.structuredPassiveEffects, player, gameState);
      }
      if (playerLeader?.customEffects) {
        const gameState = this.getGameState(player);
        this.resolveStructuredEffects(playerLeader.customEffects, player, gameState);
      }

      this.resolveRewardChoices(player);
    }

    for (const player of this.playerManager.getPlayers()) {
      this.cardsService.drawPlayerCardsFromDeck(player.id, player.cardsDrawnAtRoundStart);

      if (player.isAI && player.id === this.startingPlayerId) {
        this.setActiveAIPlayer(this.startingPlayerId);
        this.setPreferredFieldsForAIPlayer(this.startingPlayerId);
      }
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
    this.setActiveAIPlayer(0);
    this.duneEventsManager.resetEventDeck();
    this.leadersService.resetLeaders();
    this.conflictsService.resetConflicts();
    this.cardsService.resetPlayerHandCards();
    this.cardsService.resetPlayerPlots();
    this.cardsService.resetPlayerTrashPiles();
    this.cardsService.resetImperiumRowCards();
    this.techTilesService.resetTechTileDeck();

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
      const field = this.settingsService.getBoardField(playerLocation.locationId);
      if (field && field.ownerReward) {
        this.addRewardToPlayer(player.id, field.ownerReward);
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
            { type: 'imperium-card', object: card },
            'reveal'
          );
        }
        if (hasCustomRevealEffect(card)) {
          const localizedString = this.t.translateLS(card.customRevealEffect);
          this.playerRewardChoicesService.addPlayerCustomChoice(playerId, localizedString);
        }
      }
    }

    const playerLeader = this.leadersService.getLeader(player.id);
    if (playerLeader?.structuredPassiveEffects) {
      const gameState = this.getGameState(player);
      const updatedPlayer = this.playerManager.getPlayer(playerId);
      if (updatedPlayer) {
        this.resolveStructuredEffects(playerLeader.structuredPassiveEffects, updatedPlayer, gameState);
      }
    }
    if (playerLeader?.customEffects) {
      const gameState = this.getGameState(player);
      const updatedPlayer = this.playerManager.getPlayer(playerId);
      if (updatedPlayer) {
        this.resolveStructuredEffects(playerLeader.customEffects, updatedPlayer, gameState);
      }
    }
    if (playerLeader?.customTimedFunction) {
      if (playerLeader.customTimedFunction.timing == 'timing-reveal-turn') {
        const gameState = this.getGameState(player);
        const updatedPlayer = this.playerManager.getPlayer(playerId);
        if (updatedPlayer) {
          playerLeader.customTimedFunction.function(updatedPlayer, gameState, this.getGameServices());
        }
      }
    }

    this.resolveTechTileEffects(player);

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
        if (isResource(cost)) {
          this.playerManager.removeResourceFromPlayer(activePlayer.id, cost.type, cost.amount ?? 1);
        }
      }
    }

    this.audioManager.playSound('click');

    this.setPlayerOnField(activePlayer.id, field);

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

    const playerLeader = this.leadersService.getLeader(activePlayer.id);

    if (playerLeader?.customTimedFunction) {
      if (playerLeader.customTimedFunction.timing == 'timing-agent-placement') {
        const gameState = this.getGameState(activePlayer);
        const updatedPlayer = this.playerManager.getPlayer(activePlayer.id);
        if (updatedPlayer) {
          playerLeader.customTimedFunction.function(updatedPlayer, gameState, this.getGameServices());
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
        for (const option of field.conversionOptions) {
          const [_, conversionEffect] = getStructuredConversionEffectIfPossible(option);
          if (conversionEffect) {
            this.turnInfoService.updatePlayerTurnInfo(activePlayer.id, {
              effectConversions: [
                {
                  type: 'helper-trade',
                  effectCosts: conversionEffect.effectCosts,
                  effectConversions: conversionEffect.effectConversions,
                },
              ],
            });
          }
        }
      }
    } else if (activePlayer.isAI) {
      const aiPlayer = this.aIManager.getAIPlayer(activePlayer.id);

      if (activePlayer && aiPlayer) {
        if (hasRewardOptions && rewardOptionLeft && rewardOptionRight) {
          const aiDecision = this.aIManager.getFieldDecision(activePlayer.id, field.title.en);
          if (rewardOptionLeft.type.includes(aiDecision)) {
            this.addRewardToPlayer(activePlayer.id, rewardOptionLeft, { source: 'Board Space' });
          } else {
            this.addRewardToPlayer(activePlayer.id, rewardOptionRight, { source: 'Board Space' });
          }
        }

        if (field.conversionOptions) {
          const gameState = this.getGameState(activePlayer);

          let favoredConversionValue = 0;
          let favoredConversion: { costs: EffectReward[]; rewards: EffectReward[] } | undefined;

          for (const conversionOption of field.conversionOptions) {
            const [_, choiceEffect] = getStructuredConversionEffectIfPossible(conversionOption);
            if (choiceEffect) {
              const costEffects = getMultipliedRewardEffects(choiceEffect.effectCosts, gameState);
              if (playerCanPayCosts(costEffects, activePlayer, gameState)) {
                const rewards = getMultipliedRewardEffects(choiceEffect.effectConversions, gameState);

                const conversionValue = this.aIManager.getEffectConversionValue(
                  activePlayer,
                  gameState,
                  costEffects,
                  rewards
                );

                if (conversionValue > favoredConversionValue) {
                  favoredConversionValue = conversionValue;
                  favoredConversion = { costs: costEffects, rewards: rewards };
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

      this.resolveStructuredEffects(card.structuredAgentEffects, player, gameState, { type: 'imperium-card', object: card });
    }
    if (hasCustomAgentEffect(card)) {
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
    this.turnInfoService.updatePlayerTurnInfo(playerId, { troopsGained: amount });

    this.setPreferredFieldsForAIPlayer(playerId);
  }

  public addDreadnoughtToPlayer(playerId: number) {
    this.audioManager.playSound('dreadnought');
    this.combatManager.addPlayerShipsToGarrison(playerId, 1);
    this.turnInfoService.updatePlayerTurnInfo(playerId, { dreadnoughtsGained: 1 });

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

      if (roundPhase === 'agent-placement') {
        this.playerManager.increaseTurnNumberForPlayer(nextPlayer.id);
      }
      this.setActiveAIPlayer(nextPlayer.id);
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

  public setAIActiveForPlayer(playerId: number, active: boolean) {
    this.playerManager.setAIActiveForPlayer(playerId, active);
    if (active) {
      this.aIManager.addAIPlayer(playerId);
    } else {
      this.aIManager.removeAIPlayer(playerId);
    }
    this.aIManager.setactiveAIPlayerId(playerId);
  }

  public setActiveAIPlayer(playerId: number) {
    this.aIManager.setactiveAIPlayerId(playerId);
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
          const troopsInGarrison = this.combatManager.getPlayerTroopsInGarrison(playerId);
          if (!locationTakeoverTroopCosts || troopsInGarrison >= locationTakeoverTroopCosts) {
            this.audioManager.playSound('location-control');
            this.locationManager.setLocationOwner(locationId, playerId);
            this.payCostForPlayer(playerLocation.playerId, { type: 'victory-point' }, 'Location');
            this.payCostForPlayer(playerId, { type: 'loose-troop', amount: locationTakeoverTroopCosts });
            this.addRewardToPlayer(player.id, { type: 'victory-point' }, { source: 'Location' });

            this.loggingService.logPlayerLostLocationControl(playerLocation.playerId, this.currentRound, locationId);
            this.loggingService.logPlayerGainedLocationControl(playerId, this.currentRound, locationId);
          }
        }
      } else {
        this.audioManager.playSound('location-control');
        this.locationManager.setLocationOwner(locationId, playerId);
        this.addRewardToPlayer(player.id, { type: 'victory-point' }, { source: 'Location' });
        this.loggingService.logPlayerGainedLocationControl(playerId, this.currentRound, locationId);
      }
    }
  }

  public playPlayerIntrigue(playerId: number, intrigue: IntrigueDeckCard) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const roundPhase = this.currentRoundPhase;
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
      this.resolveStructuredEffects(intrigue.structuredPlotEffects, player, this.getGameState(player), {
        type: 'intrigue',
        object: intrigue,
      });
    }
    if (roundPhase === 'combat') {
      this.resolveStructuredEffects(intrigue.structuredCombatEffects, player, this.getGameState(player), {
        type: 'intrigue',
        object: intrigue,
      });
    }

    this.resolveRewardChoices(player);

    this.intriguesService.trashPlayerIntrigue(playerId, intrigue.id);
    this.loggingService.logPlayerPlayedIntrigue(playerId, this.t.translateLS(intrigue.name));
    this.turnInfoService.updatePlayerTurnInfo(playerId, { intriguesPlayedThisTurn: [intrigue] });
  }

  public trashPlayerIntrigue(playerId: number, intrigue: IntrigueDeckCard) {
    const intrigueTrashTodo = this.playerRewardChoicesService.getPlayerRewardChoice(playerId, 'intrigue-trash');
    if (intrigueTrashTodo) {
      this.playerRewardChoicesService.removePlayerRewardChoice(playerId, intrigueTrashTodo.id);
    }

    this.intriguesService.trashPlayerIntrigue(this.activePlayerId, intrigue.id);
    this.loggingService.logPlayerTrashedIntrigue(playerId, this.t.translateLS(intrigue.name));
  }

  increasePlayerFactionScore(playerId: number, factionType: FactionType) {
    const influenceUpChoiceTodo = this.playerRewardChoicesService.getPlayerRewardChoice(
      playerId,
      'faction-influence-up-choice'
    );
    if (influenceUpChoiceTodo) {
      this.playerRewardChoicesService.removePlayerRewardChoice(playerId, influenceUpChoiceTodo.id);
    }

    this.addRewardToPlayer(playerId, {
      type: ('faction-influence-up-' + factionType) as EffectRewardType,
    });

    this.setPreferredFieldsForAIPlayer(playerId);
  }

  decreasePlayerFactionScore(playerId: number, factionType: FactionType) {
    const influenceDownChoiceTodo = this.playerRewardChoicesService.getPlayerRewardChoice(
      playerId,
      'faction-influence-down-choice'
    );
    if (influenceDownChoiceTodo) {
      this.playerRewardChoicesService.removePlayerRewardChoice(playerId, influenceDownChoiceTodo.id);
    }

    this.addRewardToPlayer(playerId, {
      type: ('faction-influence-down-' + factionType) as EffectRewardType,
    });

    this.setPreferredFieldsForAIPlayer(playerId);
  }

  public resolveEffectChoice(
    playerId: number,
    effect: StructuredChoiceEffectWithGameElement,
    choice: 'left' | 'right',
    gameState?: GameState
  ) {
    const player = this.playerManager.getPlayer(playerId);
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
        this.addRewardToPlayer(player.id, reward, { gameElement: effect.element });

        this.resolveRewardChoices(player);
      }
    }

    return true;
  }

  public resolveEffectConversionIfPossible(
    playerId: number,
    effect: StructuredConversionEffectWithGameElement,
    gameState?: GameState
  ) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return false;
    }
    const realGameState = gameState ? gameState : this.getGameState(player);

    const effectCosts = getMultipliedRewardEffects(effect.effectCosts, realGameState);

    if (playerCanPayCosts(effectCosts, player, realGameState)) {
      const rewards = getMultipliedRewardEffects(effect.effectConversions, realGameState);

      for (const cost of effectCosts) {
        this.payCostForPlayer(player.id, cost, undefined, effect.element);
      }
      for (const reward of rewards) {
        this.addRewardToPlayer(player.id, reward, { gameElement: effect.element });
      }

      this.resolveRewardChoices(player);

      return true;
    } else {
      this.notificationService.showWarning(this.t.translate('playerboardWarningNotEnoughResources'));
      return false;
    }
  }

  public async doAIAction(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);

    if (!player || player.turnState === 'done') {
      return;
    }

    this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'working' });

    const roundPhase = this.currentRoundPhase;

    if (roundPhase === 'agent-placement') {
      // AI Use Leader Effects
      const playerLeader = this.leadersService.getLeader(playerId);
      if (playerLeader?.structuredPassiveEffects) {
        const gameState = this.getGameState(player);
        this.resolveStructuredEffects(playerLeader.structuredPassiveEffects, player, gameState);
        this.aiResolveRewardChoices(player);
      }
      if (playerLeader?.customEffects) {
        const gameState = this.getGameState(player);
        this.resolveStructuredEffects(playerLeader.customEffects, player, gameState);
        this.aiResolveRewardChoices(player);
      }

      if (this.turnInfoService.getPlayerTurnInfo(playerId, 'needsToPassTurn')) {
        this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
        return;
      }

      // AI Play Tech tiles
      const playerTechTiles = this.techTilesService.getPlayerTechTiles(player.id);

      let techTilesPlayed = false;
      for (const playerTechTile of playerTechTiles) {
        if (!playerTechTile.isFlipped) {
          const effects = playerTechTile.techTile.structuredEffects;
          if (effects) {
            const player = this.playerManager.getPlayer(playerId)!;
            const gameState = this.getGameState(player);

            const techTilePlayEvaluation = this.aIManager.getTechTilePlayEvaluation(
              playerTechTile.techTile,
              player,
              gameState
            );
            if (techTilePlayEvaluation > 0) {
              this.resolveStructuredEffects(effects, player, gameState, {
                type: 'tech-tile',
                object: playerTechTile.techTile,
              });
              this.aiResolveRewardChoices(player);
              techTilesPlayed = true;
              await delay(2000);
            }

            if (this.turnInfoService.getPlayerTurnInfo(playerId, 'needsToPassTurn')) {
              this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
              return;
            }
          }
        }
      }

      // AI Play Intrigues
      const playerIntrigues = this.intriguesService.getPlayerIntrigues(player.id, 'complot') ?? [];

      let intriguesPlayed = false;
      for (const intrigue of playerIntrigues) {
        const player = this.playerManager.getPlayer(playerId)!;
        const gameState = this.getGameState(player);

        const isPlayableAndUseful = this.aiIsPlayableAndUsefulIntrigue(player, intrigue, gameState);
        if (isPlayableAndUseful && Math.random() < 0.6 + 0.2 * playerIntrigues.length) {
          this.aiPlayIntrigue(player, intrigue, gameState);
          intriguesPlayed = true;
          await delay(2000);

          if (this.turnInfoService.getPlayerTurnInfo(playerId, 'needsToPassTurn')) {
            this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
            return;
          }
        }
      }

      if (techTilesPlayed || intriguesPlayed) {
        this.setPreferredFieldsForAIPlayer(player.id);
      }

      if (this.turnInfoService.getPlayerTurnInfo(playerId, 'needsToPassTurn')) {
        this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
        return;
      }

      const playerAgentCount = this.getAvailableAgentCountForPlayer(playerId);

      let couldPlaceAgent = false;
      if (player.turnState === 'agent-placement' && playerAgentCount > 0) {
        const gameState = this.getGameState(player);

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
            this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
          }
        }
      }

      if (!couldPlaceAgent && player.turnState !== 'reveal') {
        this.setPlayerRevealTurn(playerId);
        this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'ready' });
      }
      if (player.turnState === 'reveal') {
        const playerPersuasionAvailable = this.playerManager.getPlayerPersuasion(playerId);
        this.aiBuyImperiumCards(playerId, playerPersuasionAvailable);

        const playerPersuasionLeft = this.playerManager.getPlayerPersuasion(playerId);
        if (playerPersuasionLeft > 0) {
          this.aiBuyPlotCards(playerId, playerPersuasionLeft);
        }

        const playerFocusTokens = this.playerManager.getPlayerFocusTokens(playerId);
        for (let i = 0; i < playerFocusTokens; i++) {
          const success = this.aiTrashCardInPlay(playerId);
          if (success) {
            this.playerManager.removeFocusTokens(playerId, 1);
          } else {
            break;
          }
        }

        const playerHand = this.cardsService.getPlayerHand(player.id);
        if (playerHand && playerHand.cards) {
          this.cardsService.discardPlayerHandCards(player.id);
          this.playerManager.setTurnStateForPlayer(player.id, 'revealed');
        }
        this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
      }
    } else if (roundPhase === 'combat') {
      if (player.turnState === 'revealed') {
        const gameState = this.getGameState(player);

        const playerCombatIntrigues = this.intriguesService.getPlayerIntrigues(playerId, 'combat');
        const playerCombatScore = this.combatManager.getPlayerCombatScore(playerId);

        const playerLeader = this.leadersService.getLeader(playerId);
        const playerLeaderCombatEffects: { effect: StructuredEffect; score: number }[] = [];
        if (playerLeader?.structuredPassiveEffects) {
          for (const effect of playerLeader.structuredPassiveEffects) {
            let result = this.aIManager.getStructuredEffectRewardsAndCosts(effect, player, gameState);

            let swordAmount = result.rewards.find((x) => x.type === 'sword');
            if (swordAmount) {
              playerLeaderCombatEffects.push({ effect, score: swordAmount.amount ?? 1 });
            }
          }
        }
        if (playerLeader?.customEffects) {
          for (const effect of playerLeader.customEffects) {
            let result = this.aIManager.getStructuredEffectRewardsAndCosts(effect, player, gameState);

            let swordAmount = result.rewards.find((x) => x.type === 'sword');
            if (swordAmount) {
              playerLeaderCombatEffects.push({ effect, score: swordAmount.amount ?? 1 });
            }
          }
        }

        if ((playerLeaderCombatEffects.length < 1 && playerCombatIntrigues.length < 1) || playerCombatScore < 1) {
          this.playerManager.setTurnStateForPlayer(playerId, 'done');
        } else {
          const enemyCombatScores = this.combatManager.getEnemyCombatScores(playerId).map((x) => x.score);
          const highestEnemyCombatScore = max(enemyCombatScores) ?? 0;
          const playerIsWinningCombat = playerCombatScore > highestEnemyCombatScore;
          const intriguesWithCombatScores: { intrigue: IntrigueDeckCard; score: number }[] = [];
          const intriguesWithoutCombatScores: IntrigueDeckCard[] = [];
          let trackedCosts: EffectReward[] = [];

          for (const intrigue of playerCombatIntrigues) {
            if (intrigue.structuredCombatEffects) {
              let result = this.aIManager.getAllStructuredEffectsRewardsAndCosts(
                intrigue.structuredCombatEffects,
                player,
                gameState
              );

              const combinedCosts = getFlattenedEffectRewardArray([...trackedCosts, ...result.costs]);

              if (playerCanPayCosts(combinedCosts, player, gameState)) {
                let swordAmount = result.rewards.find((x) => x.type === 'sword');
                if (swordAmount) {
                  trackedCosts = combinedCosts;
                  intriguesWithCombatScores.push({ intrigue, score: swordAmount.amount ?? 1 });
                } else {
                  intriguesWithoutCombatScores.push(intrigue);
                }
              }
            }
          }

          const maxAdditionalCombatScore =
            sum(intriguesWithCombatScores.map((x) => x.score)) + sum(playerLeaderCombatEffects.map((x) => x.score));
          const playerCanWinCombat = playerCombatScore + maxAdditionalCombatScore > highestEnemyCombatScore;

          if ((!playerIsWinningCombat && playerCanWinCombat) || this.isFinale) {
            let playerCurrentCombatScore = playerCombatScore;
            for (const effectWithCombatScore of playerLeaderCombatEffects) {
              this.resolveStructuredEffects([effectWithCombatScore.effect], player, gameState);

              playerCurrentCombatScore += effectWithCombatScore.score;
              if (playerCurrentCombatScore > highestEnemyCombatScore) {
                break;
              }
            }

            if (playerCurrentCombatScore <= highestEnemyCombatScore) {
              for (const intrigueWithCombatScore of intriguesWithCombatScores) {
                const intrigue = intrigueWithCombatScore.intrigue;
                this.aiPlayIntrigue(player, intrigue, gameState);

                playerCurrentCombatScore += intrigueWithCombatScore.score;
                if (playerCurrentCombatScore > highestEnemyCombatScore) {
                  break;
                }
              }
            }
          } else if (!playerIsWinningCombat && intriguesWithoutCombatScores.length > 0) {
            for (const intrigue of intriguesWithoutCombatScores) {
              this.aiPlayIntrigue(player, intrigue, gameState);
              await delay(2000);
            }

            this.playerManager.setTurnStateForPlayer(playerId, 'done');
          } else if (
            intriguesWithCombatScores.length > 0 &&
            (this.intriguesService.getPlayerIntrigueCount(player.id) > 2 ||
              Math.random() < 0.15 * intriguesWithCombatScores.length)
          ) {
            const beatableCombatScore = enemyCombatScores.find(
              (x) => x >= playerCombatScore && x < playerCombatScore + maxAdditionalCombatScore
            );
            if (beatableCombatScore) {
              let playerCurrentCombatScore = playerCombatScore;

              for (const intrigueWithCombatScore of intriguesWithCombatScores) {
                const intrigue = intrigueWithCombatScore.intrigue;
                this.aiPlayIntrigue(player, intrigue, gameState);

                playerCurrentCombatScore += intrigueWithCombatScore.score;
                await delay(2000);
                if (playerCurrentCombatScore > beatableCombatScore) {
                  break;
                }
              }
            }
          }
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
    } else {
      this.turnInfoService.setPlayerTurnInfo(player.id, { aiStatus: 'done' });
    }
  }

  aiPlayIntrigue(player: Player, intrigue: IntrigueDeckCard, gameState: GameState) {
    const intrigueEffects =
      gameState.currentRoundPhase === 'agent-placement' ? intrigue.structuredPlotEffects : intrigue.structuredCombatEffects;

    this.loggingService.logPlayerPlayedIntrigue(player.id, this.t.translateLS(intrigue.name));
    this.turnInfoService.updatePlayerTurnInfo(player.id, { intriguesPlayedThisTurn: [intrigue] });

    if (intrigueEffects) {
      this.resolveStructuredEffects(intrigueEffects, player, gameState, { type: 'intrigue', object: intrigue });
      this.aiResolveRewardChoices(player);
    }

    this.intriguesService.trashPlayerIntrigue(player.id, intrigue.id);
  }

  aiGetPlayableAndUsefulIntrigues(player: Player, intrigues: IntrigueDeckCard[] | undefined, gameState: GameState) {
    const playableAndUsefulIntrigues: IntrigueDeckCard[] = [];
    if (!intrigues) {
      return playableAndUsefulIntrigues;
    }
    for (const intrigue of intrigues) {
      let { isUseful, costs } = this.aIManager.getIntriguePlayEvaluation(intrigue, player, gameState);

      if (isUseful && playerCanPayCosts(costs, player, gameState)) {
        playableAndUsefulIntrigues.push(intrigue);
      }
    }

    return playableAndUsefulIntrigues;
  }

  aiIsPlayableAndUsefulIntrigue(player: Player, intrigue: IntrigueDeckCard, gameState: GameState) {
    let { isUseful, costs } = this.aIManager.getIntriguePlayEvaluation(intrigue, player, gameState);

    if (isUseful && playerCanPayCosts(costs, player, gameState)) {
      return true;
    }

    return false;
  }

  private resolveTechTileEffects(player: Player) {
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

    this.resolveRewardChoices(player);
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

  public aiTrashTechTile(playerId: number) {
    const playerTechTiles = this.techTilesService.getPlayerTechTiles(playerId);
    if (playerTechTiles && playerTechTiles.length > 0) {
      const player = this.playerManager.getPlayer(playerId);
      if (!player) {
        return;
      }

      const gameState = this.getGameState(player);

      const techTileToTrash = this.aIManager.getTechTileToTrash(playerTechTiles, player, gameState);
      if (techTileToTrash) {
        this.techTilesService.trashPlayerTechTile(techTileToTrash.techTile.id);
        this.loggingService.logPlayerTrashedTechTile(playerId, this.t.translateLS(techTileToTrash.techTile.name));
      }
    }
  }

  private aiConvertRewardIfUsefulAndPossible(
    player: Player,
    effect: StructuredConversionEffectWithGameElement,
    gameState: GameState,
    overrideConversionIsUseful?: boolean
  ) {
    const effectCosts = getMultipliedRewardEffects(effect.effectCosts, gameState);
    const effectRewards = getMultipliedRewardEffects(effect.effectConversions, gameState);
    const conversionIsUseful = overrideConversionIsUseful
      ? overrideConversionIsUseful
      : this.aIManager.getEffectConversionDecision(player, gameState, effectCosts, effectRewards);

    if (conversionIsUseful && playerCanPayCosts(effectCosts, player, gameState)) {
      for (const cost of effectCosts) {
        this.payCostForPlayer(player.id, cost, undefined, effect.element);
      }
      for (const reward of effectRewards) {
        this.addRewardToPlayer(player.id, reward, { gameElement: effect.element });
      }
    }
  }

  private aiChooseRewardOption(
    player: Player,
    leftSideEffect: StructuredConversionOrRewardEffect,
    rightSideEffect: StructuredConversionOrRewardEffect,
    gameState: GameState,
    gameElement?: GameElement
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
      chosenEffect = this.aIManager.getChoiceEffectDecision(player, gameState, leftSideEffect, rightSideEffect);
    } else if (canChooseLeftSide) {
      chosenEffect = leftSideEffect;
    } else if (canChooseRightSide) {
      chosenEffect = rightSideEffect;
    }

    if (chosenEffect) {
      if (isStructuredConversionEffect(chosenEffect)) {
        const costEffects = getMultipliedRewardEffects(chosenEffect.effectCosts, gameState);
        for (const cost of costEffects) {
          this.payCostForPlayer(player.id, cost, undefined, gameElement);
        }
        const rewards = getMultipliedRewardEffects(chosenEffect.effectConversions, gameState);
        for (const reward of rewards) {
          this.addRewardToPlayer(player.id, reward, { gameElement });
        }
      } else {
        const rewards = getMultipliedRewardEffects(chosenEffect, gameState);
        for (const reward of rewards) {
          this.addRewardToPlayer(player.id, reward, { gameElement });
        }
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
    structuredEffects: StructuredEffect[],
    player: Player,
    gameState: GameState,
    gameElement?: GameElement,
    timing?: EffectPlayerTurnTiming
  ) {
    const effects = structuredEffects;
    for (const effect of effects) {
      let timingFullfilled = true;
      let conditionFullfilled = true;
      if (effect.timing) {
        timingFullfilled = isTimingFullfilled(effect.timing, player, gameState);
      }
      if (effect.condition) {
        conditionFullfilled = isConditionFullfilled(effect.condition, player, gameState, timing);
      }

      if (timingFullfilled && conditionFullfilled) {
        if (isStructuredRewardEffect(effect)) {
          const rewards = getMultipliedRewardEffects(effect, gameState, timing);

          for (const reward of rewards) {
            this.addRewardToPlayer(player.id, reward, { gameElement, source: gameElement?.type });
          }
        } else if (isStructuredChoiceEffect(effect)) {
          this.resolveStructuredChoiceEffect(effect, player.id, gameElement);
        } else if (isStructuredConversionEffect(effect)) {
          this.resolveStructuredConversionEffect(effect, player.id, gameElement);
        }
      }
    }
  }

  private resolveStructuredChoiceEffect(
    structuredChoiceEffect: StructuredChoiceEffect,
    playerId: number,
    element?: GameElement
  ) {
    if (isChoiceEffectType(structuredChoiceEffect.type)) {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { effectChoices: [{ ...structuredChoiceEffect, element }] });
    }
  }

  private resolveStructuredConversionEffect(
    structuredChoiceEffect: StructuredConversionEffect,
    playerId: number,
    element?: GameElement
  ) {
    if (isConversionEffectType(structuredChoiceEffect.type)) {
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

  public resolveRewardChoices(player: Player) {
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
          } else if (playerLeader.customSignetEffects) {
            this.resolveStructuredEffects(playerLeader.customSignetEffects, player, gameState);
          } else if (playerLeader.customSignetFunction) {
            playerLeader.customSignetFunction(player, gameState, this.getGameServices());
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
    if (turnInfo.intrigueTrashAmount > 0) {
      this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
        type: 'intrigue-trash',
      });

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
    if (turnInfo.enemiesEffects.length > 0) {
      const enemies = this.playerManager.getEnemyPlayers(player.id);

      for (const enemy of enemies) {
        for (const effect of turnInfo.enemiesEffects) {
          this.addRewardToPlayer(enemy.id, effect);
        }
        this.resolveRewardChoices(enemy);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { enemiesEffects: [] });
    }
  }

  private aiResolveRewardChoices(player: Player, depth = 0) {
    const turnInfo = this.turnInfoService.getPlayerTurnInfos(player.id);
    if (!turnInfo || depth > 2) {
      return;
    }

    const gameState = this.getGameState(player);

    if (turnInfo.cardDrawOrDestroyAmount > 0) {
      for (let i = 0; i < turnInfo.cardDrawOrDestroyAmount; i++) {
        const decision = this.aIManager.getEffectTypesDecision(player, gameState, ['card-draw', 'focus']);

        if (decision) {
          this.addRewardToPlayer(player.id, { type: decision, amount: 1 });
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
    if (turnInfo.cardDestroyAmount) {
      for (let i = 0; i < turnInfo.cardDestroyAmount; i++) {
        this.aiTrashCardInPlay(player.id);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { cardDestroyAmount: 0 });
    }
    if (turnInfo.shippingAmount > 0) {
      const decision = this.aIManager.getEffectTypesDecision(player, gameState, ['spice', 'water', 'solari']);

      if (decision) {
        this.addRewardToPlayer(player.id, { type: decision, amount: turnInfo.shippingAmount });
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
    if (turnInfo.intrigueTrashAmount > 0) {
      this.aiTrashIntrigue(player.id);
      this.turnInfoService.setPlayerTurnInfo(player.id, { intrigueTrashAmount: 0 });
    }
    if (turnInfo.techTileTrashAmount > 0) {
      this.aiTrashTechTile(player.id);
      this.turnInfoService.setPlayerTurnInfo(player.id, { techTileTrashAmount: 0 });
    }
    if (turnInfo.effectChoices.length > 0) {
      for (const effectOption of turnInfo.effectChoices) {
        const updatedPlayer = this.playerManager.getPlayer(player.id);
        const updatedGameState = this.getGameState(player);

        if (updatedPlayer && updatedGameState) {
          this.aiChooseRewardOption(
            updatedPlayer,
            effectOption.effectLeft,
            effectOption.effectRight,
            updatedGameState,
            effectOption.element
          );
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { effectChoices: [] });
    }
    if (turnInfo.effectConversions.length > 0) {
      for (const effectConversion of turnInfo.effectConversions) {
        const updatedPlayer = this.playerManager.getPlayer(player.id);
        const updatedGameState = this.getGameState(player);

        if (updatedPlayer && updatedGameState) {
          this.aiConvertRewardIfUsefulAndPossible(updatedPlayer, effectConversion, updatedGameState);
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { effectConversions: [] });
    }

    if (turnInfo.canLiftAgent) {
      const playerAgentsOnOtherFields = this.agentsOnFields.filter(
        (x) => x.playerId === player.id && x.fieldId !== turnInfo.agentPlacedOnFieldId
      );
      if (playerAgentsOnOtherFields.length > 0) {
        const locations = playerAgentsOnOtherFields.filter(
          (x) => this.settingsService.getBoardField(x.fieldId)?.ownerReward
        );
        const nonLocations = playerAgentsOnOtherFields.filter(
          (x) => !this.settingsService.getBoardField(x.fieldId)?.ownerReward
        );

        if (locations.length > 0) {
          shuffle(locations);
          this.removePlayerAgentFromField(player.id, locations[0].fieldId);
        } else if (nonLocations.length > 0) {
          shuffle(nonLocations);
          this.removePlayerAgentFromField(player.id, nonLocations[0].fieldId);
        }
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { canLiftAgent: false });
    }
    if (turnInfo.cardReturnToHandAmount > 0) {
      const playerDiscardPile = this.cardsService.getPlayerDiscardPile(player.id);
      if (playerDiscardPile && playerDiscardPile?.cards.length > 0) {
        const highestEvaluatedCard = this.aIManager.getCardToPlay(playerDiscardPile.cards, player, gameState);
        if (highestEvaluatedCard) {
          this.cardsService.returnDiscardedPlayerCardToHand(player.id, highestEvaluatedCard);
        }
      }

      this.turnInfoService.setPlayerTurnInfo(player.id, { cardReturnToHandAmount: 0 });
    }
    if (playerCanEnterCombat(turnInfo)) {
      const aiPlayer = this.aIManager.getAIPlayer(player.id);
      if (!aiPlayer) {
        return;
      }

      const playerCombatUnits = this.combatManager.getPlayerCombatUnits(player.id);
      const enemyCombatScores = this.combatManager.getEnemyCombatScores(player.id);
      const playerHasAgentsLeft = (this.availablePlayerAgents.find((x) => x.playerId === player.id)?.agentAmount ?? 0) > 1;

      if (playerCombatUnits) {
        const deployableTroops = turnInfo.deployableTroops - turnInfo.deployedTroops;
        let addableTroops =
          playerCombatUnits.troopsInGarrison >= deployableTroops ? deployableTroops : playerCombatUnits.troopsInGarrison;

        const deployableDreadnoughts =
          turnInfo.deployableDreadnoughts -
          turnInfo.deployedDreadnoughts +
          (turnInfo.canEnterCombat ? turnInfo.dreadnoughtsGained : 0);
        let addableDreadnoughts =
          playerCombatUnits.shipsInGarrison >= deployableDreadnoughts
            ? deployableDreadnoughts
            : playerCombatUnits.shipsInGarrison;

        let deployableUnits = turnInfo.deployableUnits - turnInfo.deployedUnits;
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

        const addUnitsDecision = this.aIManager.getAddAdditionalUnitsToCombatDecision(playerCombatUnits, gameState);

        if (addUnitsDecision === 'all' || this.isFinale) {
          this.addUnitsToCombatIfPossible(player.id, 'troop', addableTroops);
          this.addUnitsToCombatIfPossible(player.id, 'dreadnought', addableDreadnoughts);
        } else if (addUnitsDecision === 'minimum') {
          this.aiAddMinimumUnitsToCombat(player.id, playerCombatUnits, enemyCombatScores, playerHasAgentsLeft);
        } else if (addUnitsDecision !== 'none') {
          this.addUnitsToCombatIfPossible(player.id, 'dreadnought', addableDreadnoughts);
          const addedShipCombatStrength = this.settingsService.getDreadnoughtStrength() * addableDreadnoughts;

          if (addUnitsDecision > addedShipCombatStrength) {
            const strengthToAdd = addUnitsDecision - addedShipCombatStrength;
            const troopsToAdd = Math.round(strengthToAdd / this.settingsService.getTroopStrength());
            this.addUnitsToCombatIfPossible(player.id, 'troop', addableTroops > troopsToAdd ? troopsToAdd : addableTroops);
          }
        }
      }
    }
    if (turnInfo.signetRingAmount > 0) {
      for (let i = 0; i < turnInfo.signetRingAmount; i++) {
        const playerLeader = this.leadersService.getLeader(player.id);
        if (playerLeader) {
          if (playerLeader.structuredSignetEffects) {
            this.resolveStructuredEffects(playerLeader.structuredSignetEffects, player, gameState);
          } else if (playerLeader.customSignetEffects) {
            this.resolveStructuredEffects(playerLeader.customSignetEffects, player, gameState);
          } else if (playerLeader.customSignetFunction) {
            playerLeader.customSignetFunction(player, gameState, this.getGameServices());
          } else if (playerLeader.customSignetAIFunction) {
            playerLeader.customSignetAIFunction(player, gameState, this.getGameServices());
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
    if (turnInfo.enemiesEffects.length > 0) {
      const enemies = this.playerManager.getEnemyPlayers(player.id);

      for (const enemy of enemies) {
        for (const effect of turnInfo.enemiesEffects) {
          this.addRewardToPlayer(enemy.id, effect);
        }
        this.resolveRewardChoices(enemy);
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { enemiesEffects: [] });
    }
    if (turnInfo.canBuyTech) {
      this.aiBuyTechIfPossible(player.id);
    }

    const newTurnInfo = this.turnInfoService.getPlayerTurnInfos(player.id);
    if (newTurnInfo && turnInfosNeedToBeResolved(newTurnInfo)) {
      this.aiResolveRewardChoices(player, depth + 1);
    }
  }

  private aiControlLocation(player: Player, gameState: GameState) {
    const playerAgentsOnFields = this.getPlayerAgentsOnFields(player.id).map((x) => x.fieldId);

    const locationsWithPlayerAgents = this.settingsService
      .getBoardLocations()
      .filter((x) => playerAgentsOnFields.includes(x.actionField.title.en));

    const playerLocations = this.locationManager.getPlayerLocations(player.id);
    const enemyLocations = this.locationManager.getEnemyLocations(player.id);

    const freeControllableLocations = locationsWithPlayerAgents.filter(
      (x) =>
        !playerLocations.some((y) => x.actionField.title.en === y.locationId) &&
        !enemyLocations.some((y) => x.actionField.title.en === y.locationId)
    );

    const enemyControllableLocations = locationsWithPlayerAgents.filter((x) =>
      enemyLocations.some((y) => x.actionField.title.en === y.locationId)
    );

    const locationTakeoverTroopCosts = this.settingsService.getLocationTakeoverTroopCosts() ?? 0;
    const playerTroopAmount = this.combatManager.getPlayerTroopsInGarrison(player.id);
    const playerCanConquerLocations = playerTroopAmount >= locationTakeoverTroopCosts;

    let controllableLocations = freeControllableLocations;

    if (playerCanConquerLocations && enemyControllableLocations.length > 0) {
      const conquerDesire = 0.2 * playerTroopAmount + 0.1 * (gameState.currentRound - 1);
      if (freeControllableLocations.length < 1 || conquerDesire > Math.random()) {
        if (gameState.rival) {
          const rivalLocations = this.locationManager.getPlayerLocations(gameState.rival.id);
          const controllableRivalLocations = locationsWithPlayerAgents.filter((x) =>
            rivalLocations.some((y) => x.actionField.title.en === y.locationId)
          );

          if (controllableRivalLocations.length > 0) {
            controllableLocations = controllableRivalLocations;
          } else {
            controllableLocations = enemyControllableLocations;
          }
        } else {
          controllableLocations = enemyControllableLocations;
        }
      }
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
    const factionRecruitment = this.turnInfoService.getPlayerTurnInfo(playerId, 'factionRecruitment');
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
          this.addRewardToPlayer(player.id, effect, { source: 'Imperium Card Buy Effect' });
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
        const rule = this.settingsService.getCardAcquiringRuleImperiumRow();
        if (rule === 'discard-pile') {
          this.cardsService.addCardToPlayerDiscardPile(playerId, cardToBuy);
        } else if (rule === 'under-deck') {
          this.cardsService.addCardUnderPlayerDeck(playerId, cardToBuy);
        } else {
          this.cardsService.addCardToPlayerHand(playerId, cardToBuy);
        }
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

  private aiTrashCardInPlay(playerId: number) {
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

      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsTrashedThisTurn: [cardToTrash] });
      this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(cardToTrash.name));
      return true;
    }
    return false;
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
            this.addRewardToPlayer(player.id, effect, { source: 'Imperium Card Buy Effect' });
          }

          this.resolveRewardChoices(player);
        }

        this.cardsService.aquirePlayerCardFromImperiumRow(playerId, card);
      } else {
        this.cardsService.aquirePlayerPlotFromImperiumRow(playerId, card);
      }

      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [card] });
      this.loggingService.logPlayerBoughtCard(playerId, this.t.translateLS(card.name));
    } else {
      this.notificationService.showWarning(this.t.translate('buyCardWarningNotEnoughPersuasion'));
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
          this.addRewardToPlayer(player.id, effect, { source: 'Imperium Card Buy Effect' });
        }

        this.resolveRewardChoices(player);
      }
      this.cardsService.aquirePlayerCardFromImperiumDeck(playerId, card);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [card] });

      this.loggingService.logPlayerBoughtCard(playerId, this.t.translateLS(card.name));
      return true;
    } else {
      this.notificationService.showWarning(this.t.translate('buyCardWarningNotEnoughPersuasion'));
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
          this.addRewardToPlayer(player.id, effect, { source: 'Imperium Card Buy Effect' });
        }

        this.resolveRewardChoices(player);
      }
      this.cardsService.aquirePlayerCardFromLimitedCustomCards(playerId, card);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsBoughtThisTurn: [card] });

      this.loggingService.logPlayerBoughtCard(playerId, this.t.translateLS(card.name));
    } else {
      this.notificationService.showWarning(this.t.translate('buyCardWarningNotEnoughPersuasion'));
    }
  }

  discardImperiumCardFromHand(playerId: number, card: ImperiumDeckCard) {
    const cardDiscardTodo = this.playerRewardChoicesService.getPlayerRewardChoice(playerId, 'card-discard');
    if (cardDiscardTodo) {
      this.playerRewardChoicesService.removePlayerRewardChoice(playerId, cardDiscardTodo.id);
    }

    this.audioManager.playSound('card-discard');
    this.cardsService.discardPlayerHandCard(this.activePlayerId, card);

    this.loggingService.logPlayerDiscardedCard(this.activePlayerId, this.t.translateLS(card.name));
  }

  acquirePlayerTechTile(playerId: number, techTile: TechTileDeckCard) {
    const player = this.playerManager.getPlayer(playerId);
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

    const availablePlayerSpice = player.resources.find((x) => x.type === 'spice')?.amount ?? 0;
    const availablePlayerTech = player.tech;
    const playerCanAffordTechTile = techTile.costs + costModifier <= availablePlayerSpice + availablePlayerTech;

    if (playerCanAffordTechTile) {
      this.buyTechTileForPlayer(player, techTile, availablePlayerTech, 0);
    } else {
      this.notificationService.showWarning(this.t.translate('buyTechTileWarningNotEnoughTech'));
    }
  }

  activatePlayerTechtile(playerId: number, techTile: TechTileDeckCard) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    if (techTile.structuredEffects) {
      this.resolveStructuredEffects(techTile.structuredEffects, player, this.getGameState(player), {
        type: 'tech-tile',
        object: techTile,
      });

      this.resolveRewardChoices(player);
    }
  }

  private getGameState(player: Player): GameState {
    const playerAgentsOnFields = this.agentsOnFields.filter((x) => x.playerId === player.id);
    const enemyAgentsOnFields = this.agentsOnFields.filter((x) => x.playerId !== player.id);

    const playerCombatUnits = this.combatManager.getPlayerCombatUnits(player.id)!;
    const playerDreadnoughtCount = getPlayerdreadnoughtCount(playerCombatUnits);

    const playerDeckCards = this.cardsService.getPlayerDeck(player.id)?.cards ?? [];
    const playerHandCards = this.cardsService.getPlayerHand(player.id)?.cards ?? [];
    const playerDiscardPileCards = this.cardsService.getPlayerDiscardPile(player.id)?.cards ?? [];
    const playerTrashPileCards = this.cardsService.getPlayerTrashPile(player.id)?.cards;
    const playerCardsTrashed = playerTrashPileCards?.length ?? 0;

    const playerCards = [...playerDeckCards, ...playerHandCards, ...playerDiscardPileCards];

    const playerCardsFactions = this.getInitialFactions();
    const playerCardsFieldAccess: ActionType[] = [];
    const playerCardsFieldAccessCounts = this.getInitialGameElementFieldAccess();
    const playerCardsRewards = this.getInitialGameElementRewards();
    const playerCardsConnectionEffects = this.getInitialFactions();

    const playerHandCardsFactions = this.getInitialFactions();
    const playerHandCardsFieldAccess: ActionType[] = [];
    const playerHandCardsFieldAccessCounts = this.getInitialGameElementFieldAccess();
    const playerHandCardsRewards = this.getInitialGameElementRewards();
    const playerHandCardsConnectionAgentEffects = this.getInitialFactions();
    const playerHandCardsConnectionRevealEffects = this.getInitialFactions();

    const playerGameModifiers = this.gameModifiersService.getPlayerGameModifiers(player.id);

    for (const playerCard of playerCards) {
      if (playerCard.faction) {
        playerCardsFactions[playerCard.faction] += 1;
      }
      if (playerCard.fieldAccess) {
        for (const access of playerCard.fieldAccess) {
          if (!playerCardsFieldAccess.includes(access)) {
            playerCardsFieldAccess.push(access);
          }
          playerCardsFieldAccessCounts[access] += 1;
        }
      }
      if (playerCard.structuredAgentEffects) {
        for (const agentEffect of playerCard.structuredAgentEffects) {
          if (agentEffect.condition) {
            if (agentEffect.condition.type === 'condition-connection') {
              playerCardsConnectionEffects[agentEffect.condition.faction] += 1;
            }
          }
          if (!agentEffect.condition && isStructuredRewardEffect(agentEffect)) {
            for (const reward of agentEffect.effectRewards) {
              playerCardsRewards[reward.type] += reward.amount ?? 1;
            }
          }
        }
      }
      if (playerCard.structuredRevealEffects) {
        for (const revealEffect of playerCard.structuredRevealEffects) {
          if (revealEffect.condition) {
            if (revealEffect.condition.type === 'condition-connection') {
              playerCardsConnectionEffects[revealEffect.condition.faction] += 1;
            }
          }
          if (!revealEffect.condition && isStructuredRewardEffect(revealEffect)) {
            for (const reward of revealEffect.effectRewards) {
              playerCardsRewards[reward.type] += reward.amount ?? 1;
            }
          }
        }
      }
    }

    const playerCardsFactionsInPlay = this.getInitialFactions();
    for (const playerCard of playerDiscardPileCards) {
      if (playerCard.faction) {
        playerCardsFactionsInPlay[playerCard.faction] += 1;
      }
    }

    for (const playerHandCard of playerHandCards) {
      if (playerHandCard.faction) {
        playerHandCardsFactions[playerHandCard.faction] += 1;
      }
      if (playerHandCard.fieldAccess) {
        for (const access of playerHandCard.fieldAccess) {
          if (!playerHandCardsFieldAccess.includes(access)) {
            playerHandCardsFieldAccess.push(access);
          }
          playerHandCardsFieldAccessCounts[access] += 1;
        }
      }
      if (playerHandCard.structuredAgentEffects) {
        for (const agentEffect of playerHandCard.structuredAgentEffects) {
          if (agentEffect.condition) {
            if (agentEffect.condition.type === 'condition-connection') {
              playerHandCardsConnectionAgentEffects[agentEffect.condition.faction] += 1;
            }
          }
          if (!agentEffect.condition && isStructuredRewardEffect(agentEffect)) {
            for (const reward of agentEffect.effectRewards) {
              playerHandCardsRewards[reward.type] += reward.amount ?? 1;
            }
          }
        }
      }
      if (playerHandCard.structuredRevealEffects) {
        for (const revealEffect of playerHandCard.structuredRevealEffects) {
          if (revealEffect.condition) {
            if (revealEffect.condition.type === 'condition-connection') {
              playerHandCardsConnectionRevealEffects[revealEffect.condition.faction] += 1;
            }
          }
          if (!revealEffect.condition && isStructuredRewardEffect(revealEffect)) {
            for (const reward of revealEffect.effectRewards) {
              playerHandCardsRewards[reward.type] += reward.amount ?? 1;
            }
          }
        }
      }
    }

    const playerTechTilesFactions = this.getInitialFactions();
    const playerTechTilesRewards = this.getInitialGameElementRewards();
    const playerTechTilesConversionCosts = this.getInitialGameElementRewards();
    const playerTechTiles = this.techTilesService.getPlayerTechTiles(player.id).map((x) => x.techTile);

    const partialGameStateForEffectMultipliers = {
      playerAgentsOnFields,
      playerCombatUnits,
      playerHandCardsRewards,
      playerHandCardsFactions,
      playerCardsFactionsInPlay,
    };

    for (const techTile of playerTechTiles) {
      if (techTile.faction) {
        playerTechTilesFactions[techTile.faction] += 1;
      }
      if (techTile.structuredEffects) {
        const rewards: EffectReward[] = [];
        const conversionCosts: EffectReward[] = [];

        for (const effect of techTile.structuredEffects) {
          if (isStructuredRewardEffect(effect)) {
            rewards.push(...getMultipliedRewardEffects(effect, partialGameStateForEffectMultipliers));
          } else if (isStructuredChoiceEffect(effect)) {
          } else if (isStructuredConversionEffect(effect)) {
            conversionCosts.push(...getMultipliedRewardEffects(effect.effectCosts, partialGameStateForEffectMultipliers));
            rewards.push(...getMultipliedRewardEffects(effect.effectConversions, partialGameStateForEffectMultipliers));
          }
        }

        for (const reward of rewards) {
          playerTechTilesRewards[reward.type] += reward.amount ?? 1;
        }
        for (const cost of conversionCosts) {
          playerTechTilesConversionCosts[cost.type] += cost.amount ?? 1;
        }
      }
    }

    const playerIntrigues = this.intriguesService.getPlayerIntrigues(player.id) ?? [];
    const playerIntriguesRewards = this.getInitialGameElementRewards();
    const playerIntriguesConversionCosts = this.getInitialGameElementRewards();
    for (const intrigue of playerIntrigues) {
      if (intrigue.structuredPlotEffects) {
        const rewards: EffectReward[] = [];
        const conversionCosts: EffectReward[] = [];

        for (const effect of intrigue.structuredPlotEffects) {
          if (isStructuredRewardEffect(effect)) {
            rewards.push(...getMultipliedRewardEffects(effect, partialGameStateForEffectMultipliers));
          } else if (isStructuredChoiceEffect(effect)) {
          } else if (isStructuredConversionEffect(effect)) {
            conversionCosts.push(...getMultipliedRewardEffects(effect.effectCosts, partialGameStateForEffectMultipliers));
            rewards.push(...getMultipliedRewardEffects(effect.effectConversions, partialGameStateForEffectMultipliers));
          }
        }

        for (const reward of rewards) {
          playerIntriguesRewards[reward.type] += reward.amount ?? 1;
        }
        for (const cost of conversionCosts) {
          playerIntriguesConversionCosts[cost.type] += cost.amount ?? 1;
        }
      }
    }

    const playerCardsBought =
      (playerDeckCards.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerHandCards.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerDiscardPileCards.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerTrashPileCards?.filter((x) => x.persuasionCosts).length ?? 0);

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

    const playerCombatIntrigues = playerIntrigues.filter((x) => x.type === 'combat');
    const playerIntrigueCount = playerIntrigues.length;
    const playerCombatIntrigueCount = playerCombatIntrigues.length;
    const playerIntrigueStealAmount = this.intriguesService
      .getEnemyIntrigues(player.id)
      .filter((x) => x.intrigues.length > 3).length;

    const enemyIntrigueCounts = this.intriguesService
      .getEnemyIntrigues(player.id)
      .map((x) => ({ playerId: x.playerId, intrigueCount: x.intrigues.length }));

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
    const rival = this.currentRound > 4 ? this.playerManager.getPlayer(rivalId.playerId) : undefined;

    const playerLeader = this.leadersService.getLeader(player.id);
    const playerTurnInfos = this.turnInfoService.getPlayerTurnInfos(player.id);

    return {
      playersCount: this.playerManager.getPlayerCount(),
      currentRound: this.currentRound,
      currentRoundPhase: this.currentRoundPhase,
      accumulatedSpiceOnFields: this.accumulatedSpiceOnFields,
      playerAgentsAvailable: this.availablePlayerAgents.find((x) => x.playerId === player.id)?.agentAmount ?? 0,
      enemyAgentsAvailable: this.availablePlayerAgents.filter((x) => x.playerId !== player.id),
      playerScore: playerScore,
      enemyScore,
      playerCombatUnits,
      enemyCombatUnits: this.combatManager.getEnemyCombatUnits(player.id),
      agentsOnFields: this.agentsOnFields,
      playerAgentsOnFields,
      enemyAgentsOnFields,
      isOpeningTurn: this.isOpeningTurn(player.id),
      isFinale: this.isFinale,
      enemyPlayers: this.playerManager.getEnemyPlayers(player.id),
      playerLeader: playerLeader!,
      playerLeaderSignetRingEffects: playerLeader?.structuredSignetEffects,
      playerLeaderSignetTokenValue: playerLeader?.signetTokenValue,
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
      playerIntriguesRewards,
      playerIntriguesConversionCosts,
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
      playerCardsFieldAccessCounts,
      playerCardsRewards,
      playerCardsConnectionEffects,
      playerHandCardsFactions,
      playerHandCardsFieldAccess,
      playerHandCardsFieldAccessCounts,
      playerHandCardsRewards,
      playerHandCardsConnectionAgentEffects,
      playerHandCardsConnectionRevealEffects,
      playerCardsFactionsInPlay,
      playerGameModifiers,
      playerTechTiles,
      playerTechTilesFactions,
      playerTechTilesRewards,
      playerTechTilesConversionCosts,
      enemyIntrigueCounts,
      gameSettings: {
        combatMaxDeployableUnits: this.settingsService.getCombatMaxDeployableUnits(),
        troopCombatStrength: this.settingsService.getTroopStrength(),
        dreadnoughtCombatStrength: this.settingsService.getDreadnoughtStrength(),
        factionInfluenceMaxScore: this.settingsService.getFactionInfluenceMaxScore(),
        factionInfluenceAllianceTreshold: this.settingsService.getFactionInfluenceAllianceTreshold(),
      },
      boardSpaces: this.settingsService.boardFields,
    } as GameState;
  }

  private getGameServices(): GameServices {
    return {
      locationManager: this.locationManager,
      audioManager: this.audioManager,
      gameModifierService: this.gameModifiersService,
      loggingService: this.loggingService,
      turnInfoService: this.turnInfoService,
      playersService: this.playerManager,
      aiManager: this.aIManager,
      gameManager: this,
    };
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
          this.aIManager.getTechTileBuyEvaluation(b, player, gameState) -
          this.aIManager.getTechTileBuyEvaluation(a, player, gameState)
      )[0];

      const desire = this.aIManager.getTechTileBuyEvaluation(mostDesiredTechTile, player, gameState);
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

  private buyTechTileForPlayer(player: Player, techTile: TechTileDeckCard, techAmount: number, discount: number) {
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
        this.addRewardToPlayer(player.id, reward, { source: 'Tech Tile Buy Effect' });
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

  public addRewardToPlayer(
    playerId: number,
    reward: EffectReward,
    additionalInfos?: { gameElement?: GameElement; source?: string }
  ) {
    const playerGameModifier = this.gameModifiersService.getPlayerGameModifiers(playerId);

    const rewardType = reward.type;
    const rewardAmount = reward.amount ?? 1;
    const gameElement = additionalInfos?.gameElement;
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
          this.addRewardToPlayer(playerId, reward, { gameElement, source: 'Influence' });
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

      const maxPlayerIntrigueCount = this.settingsService.getMaxPlayerIntrigueCount();
      const newPlayerIntrigueCount = this.intriguesService.getPlayerIntrigueCount(playerId) + rewardAmount;
      if (maxPlayerIntrigueCount && newPlayerIntrigueCount > maxPlayerIntrigueCount) {
        this.turnInfoService.updatePlayerTurnInfo(playerId, {
          intrigueTrashAmount: newPlayerIntrigueCount - maxPlayerIntrigueCount,
        });
      }
    } else if (rewardType === 'intrigue-trash') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { intrigueTrashAmount: 1 });
    } else if (rewardType === 'troop') {
      this.audioManager.playSound('troops', rewardAmount);
      this.combatManager.addPlayerTroopsToGarrison(playerId, rewardAmount);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { troopsGained: rewardAmount });
    } else if (rewardType === 'dreadnought') {
      this.audioManager.playSound('dreadnought');
      this.combatManager.addPlayerShipsToGarrison(playerId, 1);
      this.turnInfoService.updatePlayerTurnInfo(playerId, { dreadnoughtsGained: rewardAmount });
    } else if (rewardType === 'card-draw') {
      this.audioManager.playSound('card-draw');
      this.cardsService.drawPlayerCardsFromDeck(playerId, rewardAmount);
    } else if (rewardType === 'card-destroy') {
      this.audioManager.playSound('sword');
      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardDestroyAmount: rewardAmount });
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
      this.loggingService.logPlayerGainedVictoryPoint(playerId, this.currentRound, additionalInfos?.source);
      return;
    } else if (rewardType === 'foldspace') {
      this.audioManager.playSound('card-draw');
      const foldspaceCard = this.settingsService.getCustomCards()?.find((x) => x.type === 'foldspace');

      if (foldspaceCard) {
        const rule = this.settingsService.getCardAcquiringRuleFoldspace();
        if (rule === 'discard-pile') {
          this.cardsService.addCardToPlayerDiscardPile(playerId, this.cardsService.instantiateImperiumCard(foldspaceCard));
        } else if (rule === 'under-deck') {
          this.cardsService.addCardUnderPlayerDeck(playerId, this.cardsService.instantiateImperiumCard(foldspaceCard));
        } else {
          this.cardsService.addCardToPlayerHand(playerId, this.cardsService.instantiateImperiumCard(foldspaceCard));
        }
      }
    } else if (rewardType === 'location-control') {
      this.audioManager.playSound('location-control');
      this.turnInfoService.updatePlayerTurnInfo(playerId, { locationControlAmount: 1 });
    } else if (rewardType === 'signet-ring') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { signetRingAmount: 1 });
    } else if (rewardType === 'signet-token') {
      this.audioManager.playSound('signet');
      this.playerManager.addSignetTokensToPlayer(playerId, rewardAmount);
    } else if (rewardType === 'trash-self') {
      if (gameElement && gameElement.type === 'imperium-card') {
        this.cardsService.trashPlayerHandCard(playerId, gameElement.object);
        this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(gameElement.object.name));
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsTrashedThisTurn: [gameElement.object] });
      } else if (gameElement && gameElement.type === 'tech-tile') {
        this.techTilesService.trashPlayerTechTile(gameElement.object.id);
        this.loggingService.logPlayerTrashedTechTile(playerId, this.t.translateLS(gameElement.object.name));
      }
    } else if (rewardType === 'tech-tile-flip') {
      if (gameElement && gameElement.type === 'tech-tile') {
        this.techTilesService.flipTechTile(gameElement.object.id);
        this.audioManager.playSound('tech-tile');
        this.turnInfoService.updatePlayerTurnInfo(playerId, { techTilesFlippedThisTurn: [gameElement.object] });
        this.loggingService.logPlayerPlayedTechTile(playerId, this.t.translateLS(gameElement.object.name));
      }
    } else if (rewardType === 'combat') {
      this.audioManager.playSound('combat');

      let deployableUnits = this.settingsService.getCombatMaxDeployableUnits();
      const combatModifier = this.gameModifiersService.getPlayerGameModifier(playerId, 'combat');
      if (combatModifier && combatModifier.combatMaxDeployableUnits) {
        deployableUnits = combatModifier.combatMaxDeployableUnits;
      }

      this.turnInfoService.setPlayerTurnInfo(playerId, { canEnterCombat: true, deployableUnits });
    } else if (rewardType === 'intrigue-draw') {
      const enemiesIntrigues = this.intriguesService.getEnemyIntrigues(playerId).filter((x) => x.intrigues.length > 3);
      for (const enemyIntrigues of enemiesIntrigues) {
        const stolenIntrigue = getRandomElementFromArray(enemyIntrigues.intrigues);
        this.intriguesService.trashPlayerIntrigue(enemyIntrigues.playerId, stolenIntrigue.id);
        this.intriguesService.addPlayerIntrigue(playerId, stolenIntrigue);
        this.loggingService.logPlayerStoleIntrigue(playerId, enemyIntrigues.playerId);
      }
    } else if (rewardType === 'recruitment-bene') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionRecruitment: ['bene'] });
    } else if (rewardType === 'recruitment-fremen') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionRecruitment: ['fremen'] });
    } else if (rewardType === 'recruitment-guild') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionRecruitment: ['guild'] });
    } else if (rewardType === 'recruitment-emperor') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionRecruitment: ['emperor'] });
    } else if (rewardType === 'troop-insert') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { deployableTroops: rewardAmount });
    } else if (rewardType === 'troop-insert-or-retreat') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { deployableTroops: rewardAmount });
    } else if (rewardType === 'troop-retreat') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { retreatableTroops: rewardAmount });
    } else if (rewardType === 'dreadnought-insert') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { deployableDreadnoughts: rewardAmount });
    } else if (rewardType === 'dreadnought-insert-or-retreat') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { deployableDreadnoughts: rewardAmount });
    } else if (rewardType === 'dreadnought-retreat') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { retreatableDreadnoughts: rewardAmount });
    } else if (rewardType === 'enemies-troop-destroy') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { enemiesEffects: [{ type: 'loose-troop' }] });
    } else if (rewardType === 'enemies-card-discard') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { enemiesEffects: [{ type: 'card-discard' }] });
    } else if (rewardType === 'enemies-intrigue-trash') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { enemiesEffects: [{ type: 'intrigue-trash' }] });
    } else if (rewardType === 'card-return-to-hand') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardReturnToHandAmount: rewardAmount });
    } else if (rewardType === 'turn-pass') {
      this.turnInfoService.setPlayerTurnInfo(playerId, { needsToPassTurn: true });
    }
    this.loggingService.logPlayerResourceGained(playerId, rewardType, rewardAmount);
  }

  public payCostForPlayer(playerId: number, cost: EffectReward, source?: string, element?: GameElement) {
    const costType = cost.type;
    const costAmount = cost.amount ?? 1;
    if (isResourceType(costType)) {
      this.playerManager.removeResourceFromPlayer(playerId, costType, costAmount);
    } else if (costType === 'signet-token') {
      this.playerManager.removeSignetTokensFromPlayer(playerId, costAmount);
    } else if (costType === 'focus') {
      this.playerManager.removeFocusTokens(playerId, costAmount);
    } else if (costType === 'shipping') {
      this.playerManager.removeResourceFromPlayer(playerId, 'water', costAmount);
    } else if (costType === 'tech') {
      this.playerManager.removeTechFromPlayer(playerId, costAmount);
    } else if (isFactionScoreRewardType(costType)) {
      const scoreType = getFactionScoreTypeFromReward(cost);

      this.playerScoreManager.removePlayerScore(
        playerId,
        scoreType as PlayerFactionScoreType,
        costAmount,
        this.currentRound
      );
    } else if (costType === 'tech-tile-trash') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { techTileTrashAmount: costAmount });
    } else if (costType === 'faction-influence-down-choice') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionInfluenceDownChoiceAmount: costAmount });
    } else if (costType === 'intrigue') {
      this.audioManager.playSound('intrigue', costAmount);
      this.intriguesService.drawPlayerIntriguesFromDeck(playerId, costAmount);
    } else if (costType === 'intrigue-trash') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { intrigueTrashAmount: costAmount });
    } else if (costType === 'sword') {
      this.combatManager.removeAdditionalCombatPowerFromPlayer(playerId, costAmount);
    } else if (costType === 'troop' || costType === 'loose-troop') {
      this.combatManager.removePlayerTroopsFromGarrison(playerId, costAmount);
    } else if (costType === 'dreadnought') {
      this.combatManager.removePlayerShipsFromGarrison(playerId, costAmount);
    } else if (costType === 'dreadnought-retreat') {
      this.combatManager.removePlayerShipsFromCombat(playerId, costAmount);
    } else if (costType === 'card-discard') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardDiscardAmount: costAmount });
    } else if (costType === 'card-destroy') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { cardDestroyAmount: costAmount });
    } else if (costType === 'persuasion') {
      this.playerManager.addPersuasionSpentToPlayer(playerId, costAmount);
    } else if (costType === 'victory-point') {
      this.playerScoreManager.removePlayerScore(playerId, 'victoryPoints', costAmount, this.currentRound);
      this.loggingService.logPlayerLostVictoryPoint(playerId, this.currentRound, source);
    } else if (costType === 'trash-self' && element) {
      if (element.type === 'imperium-card') {
        this.cardsService.trashPlayerHandCard(playerId, element.object);
        this.loggingService.logPlayerTrashedCard(playerId, this.t.translateLS(element.object.name));
        this.turnInfoService.updatePlayerTurnInfo(playerId, { cardsTrashedThisTurn: [element.object] });
      } else if (element.type === 'tech-tile') {
        this.techTilesService.trashPlayerTechTile(element.object.id);
        this.loggingService.logPlayerTrashedTechTile(playerId, this.t.translateLS(element.object.name));
      }
    } else if (costType === 'tech-tile-flip' && element) {
      if (element.type === 'tech-tile') {
        this.techTilesService.flipTechTile(element.object.id);
        this.audioManager.playSound('tech-tile');
        this.turnInfoService.updatePlayerTurnInfo(playerId, { techTilesFlippedThisTurn: [element.object] });
        this.loggingService.logPlayerPlayedTechTile(playerId, this.t.translateLS(element.object.name));
      }
    } else if (costType === 'turn-pass') {
      this.turnInfoService.setPlayerTurnInfo(playerId, { needsToPassTurn: true });
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
    if (leader.customTimedAIFunction) {
      if (leader.customTimedAIFunction.timing === 'timing-game-start') {
        const gameState = this.getGameState(player);
        leader.customTimedAIFunction.function(player, gameState, this.getGameServices());
      }
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

  public addUnitsToCombatIfPossible(playerId: number, unitType: 'troop' | 'dreadnought', amount: number) {
    const playerTurnInfos = this.turnInfoService.getPlayerTurnInfos(playerId);
    if (!playerTurnInfos) {
      return;
    }

    let deployedAmount = 0;

    if (unitType === 'troop') {
      const deployableTroops = playerTurnInfos.deployableTroops - playerTurnInfos.deployedTroops;
      const troopsToDeploy = deployableTroops >= amount ? amount : deployableTroops;

      if (troopsToDeploy > 0) {
        this.combatManager.addPlayerTroopsToCombat(playerId, troopsToDeploy);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { deployedTroops: troopsToDeploy });
        deployedAmount += troopsToDeploy;
      }
    } else if (unitType === 'dreadnought') {
      const deployableDreadnoughts = playerTurnInfos.deployableDreadnoughts - playerTurnInfos.deployedDreadnoughts;
      const dreadnoughtsToDeploy = deployableDreadnoughts >= amount ? amount : deployableDreadnoughts;

      if (dreadnoughtsToDeploy > 0) {
        this.combatManager.addPlayerShipsToCombat(playerId, dreadnoughtsToDeploy);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { deployedDreadnoughts: dreadnoughtsToDeploy });
        deployedAmount += dreadnoughtsToDeploy;
      }
    }
    if (deployedAmount < amount) {
      const deployableUnits = playerTurnInfos.deployableUnits - playerTurnInfos.deployedUnits;
      const unitsToDeploy = deployableUnits >= amount ? amount : deployableUnits;

      if (unitsToDeploy > 0) {
        if (unitType === 'troop') {
          this.combatManager.addPlayerTroopsToCombat(playerId, unitsToDeploy);
        } else {
          this.combatManager.addPlayerShipsToCombat(playerId, unitsToDeploy);
        }
        this.turnInfoService.updatePlayerTurnInfo(playerId, { deployedUnits: unitsToDeploy });
      }
    }
  }

  public retreatUnitsIfPossible(playerId: number, unitType: 'troop' | 'dreadnought', amount: number) {
    const playerTurnInfos = this.turnInfoService.getPlayerTurnInfos(playerId);
    if (!playerTurnInfos) {
      return;
    }

    let retreatedAmount = 0;

    if (unitType === 'troop') {
      const canRetreatTroops = playerTurnInfos.canRetreatUnits;
      const troopsToRetreat = canRetreatTroops
        ? amount
        : playerTurnInfos.deployedTroops >= amount
          ? amount
          : playerTurnInfos.deployedTroops;

      if (canRetreatTroops || troopsToRetreat > 0) {
        this.combatManager.removePlayerTroopsFromCombat(playerId, troopsToRetreat);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { deployedTroops: -troopsToRetreat });
        retreatedAmount += troopsToRetreat;
      }
    } else if (unitType === 'dreadnought') {
      const canRetreatDreadnoughts = playerTurnInfos.canRetreatUnits;
      const dreadnoughtsToRetreat = canRetreatDreadnoughts
        ? amount
        : playerTurnInfos.deployedDreadnoughts >= amount
          ? amount
          : playerTurnInfos.deployedDreadnoughts;

      if (canRetreatDreadnoughts || dreadnoughtsToRetreat > 0) {
        this.combatManager.removePlayerShipsFromCombat(playerId, dreadnoughtsToRetreat);
        this.turnInfoService.updatePlayerTurnInfo(playerId, { deployedDreadnoughts: -dreadnoughtsToRetreat });
        retreatedAmount += dreadnoughtsToRetreat;
      }
    }
    if (retreatedAmount < amount) {
      const retreatableUnits = playerTurnInfos.deployedUnits;
      const unitsToDeploy = playerTurnInfos.deployedUnits >= amount ? amount : playerTurnInfos.deployedUnits;

      if (unitsToDeploy > 0) {
        if (unitType === 'troop') {
          this.combatManager.removePlayerTroopsFromCombat(playerId, unitsToDeploy);
        } else {
          this.combatManager.removePlayerShipsFromCombat(playerId, unitsToDeploy);
        }
        this.turnInfoService.updatePlayerTurnInfo(playerId, { deployedUnits: -unitsToDeploy });
      }
    }
  }

  public aiAddMinimumUnitsToCombat(
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

        this.addUnitsToCombatIfPossible(playerId, 'troop', troopsToAdd);
        troopsAdded = troopsToAdd;
      }

      if (troopsAdded === 0 && playerCombatUnits.shipsInGarrison > 0) {
        if (playerCombatUnits.shipsInGarrison > 0 || Math.random() > 0.75) {
          this.addUnitsToCombatIfPossible(playerId, 'dreadnought', 1);
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
      this.addUnitsToCombatIfPossible(playerId, 'troop', troopsToAdd);
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
          this.audioManager.playSound('influence');
          increasedFactionScoreTypes.push(desiredScoreType);

          for (const reward of factionRewards) {
            this.addRewardToPlayer(player.id, reward, { source: 'Influence' });
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
          this.audioManager.playSound('influence');
          increasedFactionScoreTypes.push(desiredScoreType);

          for (const reward of factionRewards) {
            this.addRewardToPlayer(player.id, reward, { source: 'Influence' });
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

  private getFactionFriendships(playerScore: PlayerScore) {
    const result: PlayerFactionScoreType[] = [];
    for (const [index, value] of Object.entries(playerScore)) {
      if (value > 1 && isFactionScoreType(index)) {
        result.push(index);
      }
    }
    return result;
  }

  private getInitialFactions(): PlayerGameElementFactions {
    return {
      bene: 0,
      emperor: 0,
      fremen: 0,
      guild: 0,
    };
  }

  private getInitialGameElementFieldAccess(): PlayerGameElementFieldAccess {
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

  private getInitialGameElementRewards(): PlayerGameElementRewards {
    return {
      spice: 0,
      water: 0,
      solari: 0,
      troop: 0,
      dreadnought: 0,
      agent: 0,
      'agent-lift': 0,
      'card-destroy': 0,
      'card-discard': 0,
      'card-draw': 0,
      'card-draw-or-destroy': 0,
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
      'tech-tile-trash': 0,
      'victory-point': 0,
      'trash-self': 0,
      'recruitment-emperor': 0,
      'recruitment-fremen': 0,
      'recruitment-bene': 0,
      'recruitment-guild': 0,
      research: 0,
      specimen: 0,
      beetle: 0,
      'troop-insert': 0,
      'troop-insert-or-retreat': 0,
      'troop-retreat': 0,
      'dreadnought-insert': 0,
      'dreadnought-insert-or-retreat': 0,
      'dreadnought-retreat': 0,
      'enemies-card-discard': 0,
      'enemies-troop-destroy': 0,
      'enemies-intrigue-trash': 0,
      'card-return-to-hand': 0,
      'turn-pass': 0,
    };
  }
}
