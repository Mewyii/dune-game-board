import { Injectable } from '@angular/core';
import { cloneDeep, shuffle } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { isResource, isResourceType } from '../helpers/resources';
import { CombatManager, PlayerCombatScore, PlayerCombatUnits } from './combat-manager.service';
import { LoggingService } from './log.service';
import { PlayersService } from './players.service';
import { PlayerFactionScoreType, PlayerScore, PlayerScoreManager } from './player-score-manager.service';
import { LocationManager } from './location-manager.service';
import { DuneEventsManager } from './dune-events.service';
import { ActionField, DuneLocation, Reward, RewardType } from '../models';
import { AIManager } from './ai/ai.manager';
import { LeadersService } from './leaders.service';
import { ConflictsService } from './conflicts.service';
import { MinorHousesService } from './minor-houses.service';
import { TechTilesService } from './tech-tiles.service';
import { AudioManager } from './audio-manager.service';
import { SettingsService } from './settings.service';
import { getRandomElementFromArray, sum } from '../helpers/common';
import { GameState } from './ai/models';
import { CardsService, ImperiumDeckCard } from './cards.service';
import { isFactionScoreCostType, isFactionScoreRewardType } from '../helpers/rewards';
import { getFactionScoreTypeFromCost, getFactionScoreTypeFromReward, isFactionScoreType } from '../helpers/faction-score';
import { getPlayerdreadnoughtCount } from '../helpers/combat-units';
import { Leader } from '../constants/leaders';
import { LeaderImageOnly } from '../constants/leaders-old';
import { GameModifiersService } from './game-modifier.service';
import { getCardCostModifier, getFactionInfluenceModifier, hasFactionInfluenceModifier } from '../helpers/game-modifiers';
import { isFactionType } from '../helpers/faction-types';
import { PlayerRewardChoicesService } from './player-reward-choices.service';
import { TranslateService } from './translate-service';
import { IntriguesService } from './intrigues.service';
import { TurnInfoService } from './turn-info.service';
import { IntrigueDeckCard } from '../models/intrigue';
import { Player } from '../models/player';
import { TechTileCard } from '../models/tech-tile';

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

export type RoundPhaseType = 'none' | 'agent-placement' | 'combat' | 'combat-resolvement' | 'done';

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
    private translateService: TranslateService,
    private intriguesService: IntriguesService,
    private turnInfoService: TurnInfoService
  ) {
    const currentRoundString = localStorage.getItem('currentTurn');
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

    const activePlayerIdString = localStorage.getItem('activeAgentPlacementPlayerId');
    if (activePlayerIdString) {
      const activePlayerId = JSON.parse(activePlayerIdString) as number;
      this.activePlayerIdSubject.next(activePlayerId);
    }

    const isFinaleString = localStorage.getItem('isFinale');
    if (isFinaleString) {
      const isFinale = JSON.parse(isFinaleString) as boolean;
      this.isFinaleSubject.next(isFinale);
    }

    this.currentRound$.subscribe((currentTurn) => {
      localStorage.setItem('currentTurn', JSON.stringify(currentTurn));
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
      localStorage.setItem('activeAgentPlacementPlayerId', JSON.stringify(activePlayerId));

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

    if (this.settingsService.eventsEnabled) {
      this.duneEventsManager.setGameEvents();
    }

    this.playerScoreManager.resetPlayersScores(newPlayers);
    this.playerScoreManager.resetPlayerAlliances();
    this.removePlayerAgentsFromBoard();
    this.resetAccumulatedSpiceOnFields();

    this.cardsService.resetPlayerTrashPiles();
    this.cardsService.setLimitedCustomCards();
    this.cardsService.setUnlimitedCustomCards();
    this.cardsService.setImperiumDeck();
    this.cardsService.setInitialPlayerDecks();
    this.intriguesService.setInitialIntrigueDeck();
    this.aIManager.assignPersonalitiesToAIPlayers(newPlayers);
    this.leadersService.assignRandomLeadersToPlayers(newPlayers);
    this.conflictsService.setInitialConflictStack();
    this.minorHousesService.setInitialAvailableHouses();
    this.techTilesService.setInitialAvailableTechTiles();

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
              this.addRewardToPlayer(player, reward);
            }

            if (!player.isAI) {
              this.showPlayerRewardChoices(player);
            } else {
              this.aiResolveRewardChoices(player);
            }

            playerCombatScores = playerCombatScores.filter((x) => x.playerId !== playerScore.playerId);
          }
        }

        previousWasTie = false;
      } else if (!isTie) {
        const player = this.playerManager.getPlayer(firstPlayer.playerId);

        if (player) {
          for (const reward of conflictReward) {
            this.addRewardToPlayer(player, reward);
          }

          if (!player.isAI) {
            this.showPlayerRewardChoices(player);
          } else {
            this.aiResolveRewardChoices(player);

            if (isFirstCycle) {
              const dreadnoughtCount = this.combatManager.getPlayerCombatUnits(player.id)?.shipsInCombat;
              if (dreadnoughtCount && dreadnoughtCount > 0) {
                this.aiControlLocations(player, dreadnoughtCount);
              }
            }
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

    this.cardsService.churnImperiumRow();
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
    this.duneEventsManager.resetGameEvents();
    this.leadersService.resetLeaders();
    this.conflictsService.resetConflicts();

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
        this.addRewardToPlayer(player, location.ownerReward);
      }
    }

    const playerHand = this.cardsService.getPlayerHand(playerId);
    if (playerHand) {
      const gameState = this.getGameState(player);

      for (const card of playerHand.cards) {
        if (card.revealEffects) {
          const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } =
            this.aIManager.getRewardArrayAIInfos(card.revealEffects);

          if (!hasRewardOptions && !hasRewardConversion) {
            for (const reward of card.revealEffects) {
              this.addRewardToPlayer(player, reward, card);
            }
          } else if (!player.isAI && (hasRewardOptions || hasRewardConversion)) {
            this.playerRewardChoicesService.addPlayerRewardsChoice(player.id, card.revealEffects);
          } else if (player.isAI && hasRewardOptions) {
            const leftSideRewards = card.revealEffects.slice(0, rewardOptionIndex);
            const rightSideRewards = card.revealEffects.slice(rewardOptionIndex + 1);
            const leftSideEvaluation = this.aIManager.getRewardArrayEvaluationForTurnState(
              leftSideRewards,
              player,
              gameState
            );
            const rightSideEvaluation = this.aIManager.getRewardArrayEvaluationForTurnState(
              rightSideRewards,
              player,
              gameState
            );

            if (leftSideEvaluation >= rightSideEvaluation) {
              for (const reward of leftSideRewards) {
                this.addRewardToPlayer(player, reward, card);
              }
            } else {
              for (const reward of rightSideRewards) {
                this.addRewardToPlayer(player, reward, card);
              }
            }
          } else if (player.isAI && hasRewardConversion) {
            const costs = card.revealEffects.slice(0, rewardConversionIndex);
            const rewards = card.revealEffects.slice(rewardConversionIndex + 1);
            const costsEvaluation = this.aIManager.getCostsArrayEvaluationForTurnState(costs, player, gameState);
            const conversionIsUseful =
              this.aIManager.getRewardArrayEvaluationForTurnState(rewards, player, gameState) - costsEvaluation > 0;

            if (conversionIsUseful && this.playerCanPayCosts(playerId, costs)) {
              for (const cost of costs) {
                this.payCostForPlayer(playerId, cost);
              }
              for (const reward of rewards) {
                this.addRewardToPlayer(player, reward, card);
              }
            }
          }
        }
        if (card.customRevealEffect) {
          const localizedString = this.translateService.translate(card.customRevealEffect);
          const { rewards, restString } = this.getExtractedRewardsFromCustomAgentEffect(localizedString);
          for (const reward of rewards) {
            this.addRewardToPlayer(player, reward);
          }

          if (restString) {
            this.playerRewardChoicesService.addPlayerCustomChoice(playerId, restString);
          }
        }
      }

      if (!player.isAI) {
        this.showPlayerRewardChoices(player);
      } else {
        this.aiResolveRewardChoices(player);
      }
    }
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
      return;
    }

    const activePlayerAgentCount = this.getAvailableAgentCountForPlayer(activePlayer.id);
    if (activePlayerAgentCount < 1) {
      return;
    }

    const gameModifiers = this.gameModifiersService.getPlayerGameModifiers(activePlayer.id);

    const fieldCosts = this.gameModifiersService.getModifiedCostsForField(activePlayer.id, field);

    if (fieldCosts) {
      if (!this.playerCanPayCosts(activePlayer.id, fieldCosts)) {
        return;
      }

      for (let cost of fieldCosts) {
        if (isResource(cost)) {
          this.playerManager.removeResourceFromPlayer(activePlayer.id, cost.type, cost.amount ?? 1);
        }
      }
    }

    this.setPlayerOnField(activePlayer.id, field);

    const fieldRewards = this.gameModifiersService.getModifiedRewardsForField(activePlayer.id, field);

    const { rewardOptionIndex, hasRewardOptions } = this.aIManager.getRewardArrayAIInfos(fieldRewards);
    let rewards: Reward[] = [];
    const option: Reward[] = [];

    if (!field.tradeOptionField) {
      if (hasRewardOptions) {
        for (const [index, reward] of fieldRewards.entries()) {
          const isRewardOption = hasRewardOptions && (index === rewardOptionIndex - 1 || index === rewardOptionIndex + 1);
          if (isRewardOption || index === rewardOptionIndex) {
            option.push(reward);
          } else {
            rewards.push(reward);
          }
        }
      } else {
        rewards = fieldRewards;
      }

      for (const reward of rewards) {
        this.addRewardToPlayer(activePlayer, reward);

        if (reward.type === 'spice-accumulation' && this.fieldHasAccumulatedSpice(field.title.en)) {
          const accumulatedSpice = this.getAccumulatedSpiceForField(field.title.en);
          this.audioManager.playSound('spice', accumulatedSpice);
          this.playerManager.addResourceToPlayer(activePlayer.id, 'spice', accumulatedSpice);
        }
      }
    }

    if (isFactionType(field.actionType)) {
      if (hasFactionInfluenceModifier(gameModifiers, field.actionType)) {
        const factionInfluenceModifier = getFactionInfluenceModifier(gameModifiers, field.actionType);
        if (factionInfluenceModifier) {
          if (factionInfluenceModifier.noInfluence) {
            if (factionInfluenceModifier.alternateReward) {
              this.addRewardToPlayer(activePlayer, factionInfluenceModifier.alternateReward);
            }
          }
        }
      } else {
        this.audioManager.playSound('influence');
        const factionRewards = this.playerScoreManager.addFactionScore(activePlayer.id, field.actionType, 1);

        for (const reward of factionRewards) {
          this.addRewardToPlayer(activePlayer, reward);
        }
      }
    }

    this.addPlayedCardRewards(activePlayer, activePlayer.isAI);

    if (!activePlayer.isAI) {
      if (hasRewardOptions) {
        this.playerRewardChoicesService.addPlayerRewardsChoice(activePlayer.id, option);
      }

      this.showPlayerRewardChoices(activePlayer);
    } else if (activePlayer.isAI) {
      const aiPlayer = this.aIManager.getAIPlayer(activePlayer.id);

      if (activePlayer && aiPlayer) {
        if (hasRewardOptions) {
          const aiDecision = this.aIManager.getFieldDecision(activePlayer.id, field.title.en);
          const reward = fieldRewards.find((x) => x.type.includes(aiDecision));

          if (reward) {
            this.addRewardToPlayer(activePlayer, reward);
          }
        }
        this.aiResolveRewardChoices(activePlayer);

        if (field.tradeOptionField) {
          const tradeOption = field.tradeOptionField;
          const sellSpiceAmount = this.aIManager.getDesiredSpiceToSell(
            activePlayer,
            tradeOption.tradeFormula,
            tradeOption.maxTradeAmount
          );
          const solariFromSpiceSale = tradeOption.tradeFormula(sellSpiceAmount);

          this.audioManager.playSound('solari', solariFromSpiceSale);
          this.playerManager.removeResourceFromPlayer(activePlayer.id, 'spice', sellSpiceAmount);
          this.playerManager.addResourceToPlayer(activePlayer.id, 'solari', solariFromSpiceSale);
        }
      }
    }

    this.removeAgentFromPlayer(activePlayer.id);

    this.loggingService.logAgentAction(field);
  }

  addPlayedCardRewards(player: Player, isAI?: boolean) {
    const playerCard = this.cardsService.getPlayedPlayerCard(player.id);
    if (playerCard) {
      const card = this.cardsService.getPlayerHandCard(player.id, playerCard.cardId);
      if (card) {
        if (card.agentEffects) {
          const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } =
            this.aIManager.getRewardArrayAIInfos(card.agentEffects);
          if (!hasRewardOptions && !hasRewardConversion) {
            for (const agentEffect of card.agentEffects) {
              this.addRewardToPlayer(player, agentEffect, card);
            }
          } else if (isAI && hasRewardOptions) {
            const gameState = this.getGameState(player);

            const leftSideRewards = card.agentEffects.slice(0, rewardOptionIndex);
            const rightSideRewards = card.agentEffects.slice(rewardOptionIndex + 1);
            const leftSideEvaluation = this.aIManager.getRewardArrayEvaluationForTurnState(
              leftSideRewards,
              player,
              gameState
            );
            const rightSideEvaluation = this.aIManager.getRewardArrayEvaluationForTurnState(
              rightSideRewards,
              player,
              gameState
            );

            if (leftSideEvaluation >= rightSideEvaluation) {
              for (const reward of leftSideRewards) {
                this.addRewardToPlayer(player, reward, card);
              }
            } else {
              for (const reward of rightSideRewards) {
                this.addRewardToPlayer(player, reward, card);
              }
            }
          } else if (isAI && hasRewardConversion) {
            const costs = card.agentEffects.slice(0, rewardConversionIndex);
            const rewards = card.agentEffects.slice(rewardConversionIndex + 1);
            if (this.playerCanPayCosts(player.id, costs)) {
              for (const cost of costs) {
                const aiInfo = this.payCostForPlayer(player.id, cost);
              }
              for (const reward of rewards) {
                this.addRewardToPlayer(player, reward, card);
              }
            }
          }
        }
        if (card.customAgentEffect) {
          const localizedString = this.translateService.translate(card.customAgentEffect);
          const { rewards, restString } = this.getExtractedRewardsFromCustomAgentEffect(localizedString);
          for (const reward of rewards) {
            this.addRewardToPlayer(player, reward);
          }

          if (restString && isAI) {
            this.playerRewardChoicesService.addPlayerCustomChoice(player.id, restString);
          }
        }
      }
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

    this.loggingService.logPlayerSentAgentToField(playerId, this.translateService.translate(field.title));
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

    const playerLocation = this.locationManager.getPlayerLocation(locationId);
    if (playerLocation) {
      if (playerLocation.playerId !== playerId) {
        if (this.playerCanPayCosts(playerId, [{ type: 'loose-troop' }])) {
          this.audioManager.playSound('location-control');
          this.locationManager.setLocationOwner(locationId, playerId);
          this.payCostForPlayer(playerLocation.playerId, { type: 'victory-point' });
          this.payCostForPlayer(playerId, { type: 'loose-troop' });
          this.addRewardToPlayer(player, { type: 'victory-point' });
        }
      }
    } else {
      this.audioManager.playSound('location-control');
      this.locationManager.setLocationOwner(locationId, playerId);
      this.addRewardToPlayer(player, { type: 'victory-point' });
    }
  }

  public playIntrigue(playerId: number, intrigue: IntrigueDeckCard) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const { hasRewardOptions, hasRewardConversion } = this.aIManager.getRewardArrayAIInfos(intrigue.effects);
    if (hasRewardOptions || hasRewardConversion) {
      this.playerRewardChoicesService.addPlayerRewardsChoice(this.activePlayerId, intrigue.effects);
    } else {
      for (const reward of intrigue.effects) {
        this.addRewardToPlayer(player, reward);
      }
    }
    this.intriguesService.trashPlayerIntrigue(this.activePlayerId, intrigue.id);
    this.loggingService.logPlayerPlayedIntrigue(this.activePlayerId, this.translateService.translate(intrigue.name));
  }

  public doAIAction(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);
    const playerAgentCount = this.getAvailableAgentCountForPlayer(playerId);
    let couldPlaceAgent = false;

    if (!player || player.turnState === 'done') {
      return;
    }

    const roundPhase = this.currentRoundPhase;
    const gameState = this.getGameState(player);

    if (roundPhase === 'agent-placement') {
      const playerIntrigues = this.intriguesService.getPlayerIntrigues(player.id, 'complot');
      const playableAndUsefulIntrigues = this.aiGetPlayableAndUsefulIntrigues(player, playerIntrigues, gameState);

      if (playableAndUsefulIntrigues.length > 0 && Math.random() < 0.4 + 0.4 * playableAndUsefulIntrigues.length) {
        this.aiPlayIntrigue(player, playableAndUsefulIntrigues[0]);

        this.setPreferredFieldsForAIPlayer(player.id);
      } else {
        if (player.turnState === 'agent-placement' && playerAgentCount > 0) {
          const playerHandCards = this.cardsService.getPlayerHand(player.id)?.cards;
          if (playerHandCards && playerHandCards.length > 0) {
            const cardAndField = this.aIManager.getCardAndFieldToPlay(playerHandCards, player, gameState, 3);

            const boardField = this.settingsService.boardFields.find((x) =>
              cardAndField?.preferredField.fieldId.includes(x.title.en)
            );
            if (boardField && cardAndField) {
              this.cardsService.setPlayedPlayerCard(playerId, cardAndField.cardToPlay.id);
              this.loggingService.logPlayerPlayedCard(
                playerId,
                this.translateService.translate(cardAndField.cardToPlay.name)
              );
              this.addAgentToField(boardField);

              couldPlaceAgent = true;
            }
          }
        }
        if (!couldPlaceAgent && player.turnState !== 'reveal') {
          this.setPlayerRevealTurn(playerId);
        }
        if (player.turnState === 'reveal') {
          const playerPersuasionAvailable = this.playerManager.getPlayerPersuasion(playerId);
          this.aiBuyImperiumCards(playerId, playerPersuasionAvailable);

          const playerFocusTokens = this.playerManager.getPlayerFocusTokens(playerId);
          this.aiUseFocusTokens(playerId, playerFocusTokens);

          this.playerManager.setTurnStateForPlayer(playerId, 'revealed');
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
          const highestEnemyCombatScore = this.combatManager.getEnemyHighestCombatScores(playerId);
          if (highestEnemyCombatScore >= playerCombatScore) {
            const intriguesWithCombatScores: { intrigue: IntrigueDeckCard; score: number }[] = [];
            const intriguesWithoutCombatScores: IntrigueDeckCard[] = [];

            for (const intrigue of playerCombatIntrigues) {
              const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } =
                this.aIManager.getRewardArrayAIInfos(intrigue.effects);

              if (!hasRewardOptions && !hasRewardConversion) {
                const swordAmount = intrigue.effects.filter((x) => x.type === 'sword').length;
                if (swordAmount > 0) {
                  intriguesWithCombatScores.push({ intrigue, score: swordAmount });
                } else {
                  intriguesWithoutCombatScores.push(intrigue);
                }
              } else if (hasRewardConversion) {
                const costs = intrigue.effects.slice(0, rewardConversionIndex);
                const rewards = intrigue.effects.slice(rewardConversionIndex + 1);
                if (this.playerCanPayCosts(playerId, costs)) {
                  const swordAmount = rewards.filter((x) => x.type === 'sword').length;
                  if (swordAmount > 0) {
                    intriguesWithCombatScores.push({ intrigue, score: swordAmount });
                  } else {
                    intriguesWithoutCombatScores.push(intrigue);
                  }
                }
              }
            }

            const maxAdditionalCombatScore = sum(intriguesWithCombatScores.map((x) => x.score));
            if (playerCombatScore + maxAdditionalCombatScore > highestEnemyCombatScore) {
              let playerCurrentCombatScore = playerCombatScore;

              for (const intrigueWithCombatScore of intriguesWithCombatScores) {
                const intrigue = intrigueWithCombatScore.intrigue;
                this.aiPlayIntrigue(player, intrigue);

                const swordAmount = intrigue.effects.filter((x) => x.type === 'sword').length;
                playerCurrentCombatScore += swordAmount;
                if (playerCurrentCombatScore > highestEnemyCombatScore) {
                  break;
                }
              }
            } else {
              for (const intrigue of intriguesWithoutCombatScores) {
                this.aiPlayIntrigue(player, intrigue);
              }

              this.playerManager.setTurnStateForPlayer(playerId, 'done');
            }
          }
        }
      }
    }
  }

  aiPlayIntrigue(player: Player, intrigue: IntrigueDeckCard) {
    const intrigueEffects = intrigue.effects;

    this.loggingService.logPlayerPlayedIntrigue(player.id, this.translateService.translate(intrigue.name));

    const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } =
      this.aIManager.getRewardArrayAIInfos(intrigueEffects);

    if (!hasRewardOptions && !hasRewardConversion) {
      for (const agentEffect of intrigueEffects) {
        this.addRewardToPlayer(player, agentEffect);
      }
    } else if (hasRewardConversion) {
      const costs = intrigueEffects.slice(0, rewardConversionIndex);
      const rewards = intrigueEffects.slice(rewardConversionIndex + 1);
      if (this.playerCanPayCosts(player.id, costs)) {
        for (const cost of costs) {
          const aiInfo = this.payCostForPlayer(player.id, cost);
        }
        for (const reward of rewards) {
          this.addRewardToPlayer(player, reward);
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
      const { hasRewardConversion, rewardConversionIndex } = this.aIManager.getRewardArrayAIInfos(intrigue.effects);

      if (!hasRewardConversion) {
        const isUseful = this.aIManager.getRewardArrayEvaluationForTurnState(intrigue.effects, player, gameState) > 0;

        if (isUseful) {
          playableAndUsefulIntrigues.push(intrigue);
        }
      } else if (hasRewardConversion) {
        const costs = intrigue.effects.slice(0, rewardConversionIndex);
        const rewards = intrigue.effects.slice(rewardConversionIndex + 1);

        const costsEvaluation = this.aIManager.getCostsArrayEvaluationForTurnState(costs, player, gameState);
        const conversionIsUseful =
          this.aIManager.getRewardArrayEvaluationForTurnState(rewards, player, gameState) - costsEvaluation > 0;

        if (conversionIsUseful && this.playerCanPayCosts(player.id, costs)) {
          playableAndUsefulIntrigues.push(intrigue);
        }
      }
    }

    return playableAndUsefulIntrigues;
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

        this.loggingService.logPlayerDiscardedCard(playerId, this.translateService.translate(cardToDiscard.name));
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

        this.loggingService.logPlayerTrashedCard(playerId, this.translateService.translate(cardToTrash.name));
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

        this.loggingService.logPlayerTrashedCard(playerId, this.translateService.translate(cardToTrash.name));
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

        this.loggingService.logPlayerTrashedIntrigue(playerId, this.translateService.translate(intrigueToTrash.name));
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

  private showPlayerRewardChoices(player: Player) {
    const turnInfo = this.turnInfoService.getPlayerTurnInfo(player.id);
    if (!turnInfo) {
      return;
    }

    this.turnInfoService.clearPlayerTurnInfo(player.id);

    if (turnInfo.cardDrawOrDestroyAmount > 0) {
      for (let i = 0; i < turnInfo.cardDrawOrDestroyAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'card-draw-or-destroy',
        });
      }
    }

    if (turnInfo.shippingAmount > 0) {
      this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
        type: 'shipping',
        amount: turnInfo.shippingAmount,
      });
    }
    if (turnInfo.locationControlAmount > 0) {
      for (let i = 0; i < turnInfo.locationControlAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'location-control',
        });
      }
    }
    if (turnInfo.factionInfluenceUpChoiceAmount > 0) {
      for (let i = 0; i < turnInfo.factionInfluenceUpChoiceAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'faction-influence-up-choice',
        });
      }
    }
    if (turnInfo.factionInfluenceUpChoiceTwiceAmount > 0) {
      for (let i = 0; i < turnInfo.factionInfluenceUpChoiceTwiceAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'faction-influence-up-twice-choice',
        });
      }
    }
    if (turnInfo.factionInfluenceDownChoiceAmount > 0) {
      for (let i = 0; i < turnInfo.factionInfluenceDownChoiceAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'faction-influence-down-choice',
        });
      }
    }
    if (turnInfo.signetRingAmount > 0) {
      for (let i = 0; i < turnInfo.signetRingAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'signet-ring',
        });
      }
    }
    if (turnInfo.canLiftAgent) {
      this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
        type: 'agent-lift',
      });
    }
    if (turnInfo.canEnterCombat) {
      this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
        type: 'combat',
      });
    }
    if (turnInfo.techBuyOptionsWithAgents) {
      for (const techBuyOption of turnInfo.techBuyOptionsWithAgents) {
        if (techBuyOption === 0) {
          this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
            type: 'tech',
          });
        } else if (techBuyOption === 1) {
          this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
            type: 'tech-reduced',
          });
        } else if (techBuyOption === 2) {
          this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
            type: 'tech-reduced-two',
          });
        } else if (techBuyOption === 3) {
          this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
            type: 'tech-reduced-three',
          });
        }
      }
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

    if (turnInfo.shippingAmount > 0) {
      const spiceEvaluation = this.aIManager.getEffectEvaluationForTurnState('spice', player, gameState);
      const waterEvaluation = this.aIManager.getEffectEvaluationForTurnState('water', player, gameState);

      if (spiceEvaluation > waterEvaluation) {
        this.addRewardToPlayer(player, { type: 'spice', amount: turnInfo.shippingAmount });
      } else {
        this.playerManager.addFocusTokens(player.id, 1);
        this.addRewardToPlayer(player, { type: 'water', amount: turnInfo.shippingAmount });
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { shippingAmount: 0 });
    }
    if (turnInfo.locationControlAmount > 0) {
      const gameState = this.getGameState(player);

      for (let i = 0; i < turnInfo.locationControlAmount; i++) {
        this.aiControlLocation(player, gameState);
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
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'signet-ring',
        });
      }
      this.turnInfoService.setPlayerTurnInfo(player.id, { signetRingAmount: 0 });
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
    if (turnInfo.techBuyOptionsWithAgents) {
      for (const techBuyOption of turnInfo.techBuyOptionsWithAgents) {
        this.turnInfoService.setPlayerTurnInfo(player.id, { techBuyOptionsWithAgents: [] });
        this.aiBuyTechOrStackTechAgents(player.id, techBuyOption);
      }
    }
  }

  private aiControlLocation(player: Player, gameState: GameState) {
    const boardLocations = this.settingsService.getBoardLocations();
    const playerLocations = this.locationManager.getPlayerLocations(player.id);
    const enemyLocations = this.locationManager.getEnemyLocations(player.id);
    const freeLocations = boardLocations.filter(
      (x) =>
        !playerLocations.some((y) => x.actionField.title.en === y.locationId) &&
        !enemyLocations.some((y) => x.actionField.title.en === y.locationId)
    );
    const highPriorityLocations = enemyLocations.filter((x) => x.playerId === gameState.rival?.id);

    let controllableLocations: DuneLocation[] = [];

    if (enemyLocations.length > 0) {
      const playerTroopAmount = this.combatManager.getPlayerTroopsInGarrison(player.id);
      const stealChance = 0.2 * playerTroopAmount + 0.1 * (gameState.currentRound - 1);

      if (playerTroopAmount > 0 && stealChance > Math.random()) {
        if (highPriorityLocations.length > 0) {
          controllableLocations = boardLocations.filter((x) =>
            highPriorityLocations.some((y) => x.actionField.title.en === y.locationId)
          );
        } else {
          controllableLocations = boardLocations.filter(
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

    const imperiumRow = this.cardsService.imperiumRow;
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
        .filter((x) => factionRecruitment.some((y) => y === x.faction));
    }

    const availableCards = [...imperiumRow, ...recruitableCards, ...shuffle(alwaysBuyableCards)];

    const cardToBuy = this.aIManager.getCardToBuy(
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
          this.addRewardToPlayer(player, effect);
        }
      }

      this.aiResolveRewardChoices(player);

      if (this.cardsService.limitedCustomCards.some((x) => x.id === cardToBuy.id)) {
        this.cardsService.aquirePlayerCardFromLimitedCustomCards(playerId, cardToBuy);
      } else if (recruitableCards.some((x) => x.id === cardToBuy.id)) {
        this.cardsService.aquirePlayerCardFromImperiumDeck(playerId, cardToBuy);
      } else {
        this.cardsService.aquirePlayerCardFromImperiumRow(playerId, cardToBuy);
      }

      this.loggingService.logPlayerBoughtCard(playerId, this.translateService.translate(cardToBuy.name));

      this.aiBuyImperiumCards(playerId, availablePersuasion - ((cardToBuy.persuasionCosts ?? 0) + costModifier));
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
    if ((playerDeckCards?.length ?? 0) + (playerHandCards?.length ?? 0) + (playerDiscardPileCards?.length ?? 0) < 8) {
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

      this.loggingService.logPlayerTrashedCard(playerId, this.translateService.translate(cardToTrash.name));

      if (focusTokens > 1) {
        this.aiUseFocusTokens(playerId, focusTokens - 1);
      }
    }
  }

  acquireImperiumRowCard(playerId: number, card: ImperiumDeckCard) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const costModifiers = this.gameModifiersService.getPlayerGameModifier(playerId, 'imperiumRow');
    const costModifier = getCardCostModifier(card, costModifiers);

    const availablePersuasion = this.playerManager.getPlayerPersuasion(playerId);

    if (!card.persuasionCosts || availablePersuasion >= card.persuasionCosts) {
      if (card.persuasionCosts) {
        this.playerManager.addPersuasionSpentToPlayer(this.activePlayerId, card.persuasionCosts + costModifier);
      }
      if (card.buyEffects) {
        for (const effect of card.buyEffects) {
          this.addRewardToPlayer(player, effect);
        }
      }
      this.cardsService.aquirePlayerCardFromImperiumRow(this.activePlayerId, card);

      this.loggingService.logPlayerBoughtCard(this.activePlayerId, this.translateService.translate(card.name));
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

    if (!card.persuasionCosts || availablePersuasion >= card.persuasionCosts) {
      if (card.persuasionCosts) {
        this.playerManager.addPersuasionSpentToPlayer(this.activePlayerId, card.persuasionCosts + costModifier);
      }
      if (card.buyEffects) {
        for (const effect of card.buyEffects) {
          this.addRewardToPlayer(player, effect);
        }
      }
      this.cardsService.aquirePlayerCardFromImperiumDeck(this.activePlayerId, card);

      this.loggingService.logPlayerBoughtCard(this.activePlayerId, this.translateService.translate(card.name));
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

    if (!card.persuasionCosts || availablePersuasion >= card.persuasionCosts) {
      if (card.persuasionCosts) {
        this.playerManager.addPersuasionSpentToPlayer(this.activePlayerId, card.persuasionCosts + costModifier);
      }
      if (card.buyEffects) {
        for (const effect of card.buyEffects) {
          this.addRewardToPlayer(player, effect);
        }
      }
      this.cardsService.removeCardFromLimitedCustomCards(card);

      this.cardsService.addCardToPlayerDiscardPile(this.activePlayerId, this.cardsService.instantiateImperiumCard(card));

      this.loggingService.logPlayerBoughtCard(this.activePlayerId, this.translateService.translate(card.name));
    }
  }

  acquirePlayerTechTile(playerId: number, techTile: TechTileCard) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const availablePlayerSpice = player.resources.find((x) => x.type === 'spice')?.amount ?? 0;
    const availablePlayerTechAgents = player.techAgents;
    const playerCanAffordTechTile = techTile.costs <= availablePlayerSpice + availablePlayerTechAgents;

    if (playerCanAffordTechTile) {
      this.buyTechTileForPlayer(player, techTile, availablePlayerTechAgents, 0);
    }
  }

  private getGameState(player: Player): GameState {
    const playerDeckCards = this.cardsService.getPlayerDeck(player.id)?.cards ?? [];
    const playerHandCards = this.cardsService.getPlayerHand(player.id)?.cards ?? [];
    const playerDiscardPileCards = this.cardsService.getPlayerDiscardPile(player.id)?.cards;
    const playerTrashPileCards = this.cardsService.getPlayerTrashPile(player.id)?.cards;
    const playerCardsTrashed = playerTrashPileCards?.length ?? 0;

    const playerCardsBought =
      (playerDeckCards?.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerHandCards?.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerDiscardPileCards?.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerTrashPileCards?.filter((x) => x.persuasionCosts).length ?? 0);

    const playerCombatUnits = this.combatManager.getPlayerCombatUnits(player.id)!;
    const playerDreadnoughtCount = getPlayerdreadnoughtCount(playerCombatUnits);

    const playerScore = this.playerScoreManager.getPlayerScore(player.id)!;
    const playerFactionFriendships = this.getFactionFriendships(playerScore);
    const playerFieldUnlocksForFactions = this.gameModifiersService.getPlayerFieldUnlocksForFactions(player.id);
    const playerFieldUnlocksForIds = this.gameModifiersService.getPlayerFieldUnlocksForIds(player.id);

    const playerIntrigues = this.intriguesService.getPlayerIntrigues(player.id) ?? [];
    const playerCombatIntrigues = playerIntrigues.filter((x) => x.type === 'combat');
    const playerIntrigueCount = playerIntrigues.length;
    const playerCombatIntrigueCount = playerCombatIntrigues.length;
    const playerIntrigueStealAmount = this.intriguesService
      .getEnemyIntrigues(player.id)
      .filter((x) => x.intrigues.length > 3).length;

    const occupiedLocations = this.locationManager.ownedLocations.map((x) => x.locationId);
    const freeLocations = this.settingsService.controllableLocations.filter((x) => !occupiedLocations.includes(x));

    const enemyScore = this.playerScoreManager.getEnemyScore(player.id)!;

    const rivalId = enemyScore.sort((a, b) => b.victoryPoints - a.victoryPoints)[0];
    const rival = this.playerManager.getPlayer(rivalId.playerId);

    const playerTurnInfos = this.turnInfoService.getPlayerTurnInfo(player.id);

    return {
      currentRound: this.currentRound,
      accumulatedSpiceOnFields: this.accumulatedSpiceOnFields,
      playerAgentCount: this.availablePlayerAgents.find((x) => x.playerId === player.id)?.agentAmount ?? 0,
      enemyAgentCount: this.availablePlayerAgents.filter((x) => x.playerId !== player.id),
      playerScore: playerScore,
      enemyScore,
      playerCombatUnits,
      enemyCombatUnits: this.combatManager.getEnemyCombatUnits(player.id),
      agentsOnFields: this.agentsOnFields,
      playerAgentsOnFields: this.agentsOnFields.filter((x) => x.playerId === player.id),
      isOpeningTurn: this.isOpeningTurn(player.id),
      isFinale: this.isFinale,
      enemyPlayers: this.playerManager.getEnemyPlayers(player.id),
      playerLeader: this.leadersService.getLeader(player.id)!,
      conflict: this.conflictsService.currentConflict,
      availableTechTiles: this.techTilesService.buyableTechTiles,
      currentEvent: this.duneEventsManager.gameEvents[this.currentRound - 1],
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
      playerIntrigues,
      playerCombatIntrigues,
      playerIntrigueCount,
      playerCombatIntrigueCount,
      playerIntrigueStealAmount,
      occupiedLocations,
      freeLocations,
      rival,
      playerTurnInfos,
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

  public decreaseAccumulatedSpiceOnField(fieldId: string) {
    const accumulatedSpiceOnFields = this.accumulatedSpiceOnFields;

    const index = accumulatedSpiceOnFields.findIndex((x) => x.fieldId === fieldId && x.amount > 0);
    if (index > -1) {
      const element = accumulatedSpiceOnFields[index];
      accumulatedSpiceOnFields[index] = {
        ...element,
        amount: element.amount - 1,
      };
    }

    this.accumulatedSpiceOnFieldsSubject.next(accumulatedSpiceOnFields);
  }

  private accumulateSpiceOnFields() {
    const spiceFieldNames = this.settingsService.spiceAccumulationFields;

    const accumulatedSpiceOnFields = this.accumulatedSpiceOnFields;

    for (let fieldName of spiceFieldNames) {
      if (!this.agentsOnFields.some((x) => x.fieldId === fieldName)) {
        const index = accumulatedSpiceOnFields.findIndex((x) => x.fieldId === fieldName);
        if (index > -1) {
          const element = accumulatedSpiceOnFields[index];
          accumulatedSpiceOnFields[index] = {
            ...element,
            amount: element.amount + 1,
          };
        } else {
          accumulatedSpiceOnFields.push({ fieldId: fieldName, amount: 1 });
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

  private playerCanPayCosts(playerId: number, costs: Reward[]) {
    let canPayCosts = true;
    const player = this.playerManager.getPlayer(playerId);
    let playerIntrigueCount = this.intriguesService.getPlayerIntrigueCount(playerId);
    let playerCombatScore = this.combatManager.getPlayerCombatScore(playerId);
    if (player) {
      for (let cost of costs) {
        const costType = cost.type;
        if (isResourceType(costType)) {
          const resourceIndex = player.resources.findIndex((x) => x.type === cost.type);
          const currentResourceAmount = player.resources[resourceIndex].amount;
          if (currentResourceAmount && currentResourceAmount >= (cost.amount ?? 1)) {
            player.resources[resourceIndex].amount = currentResourceAmount - (cost.amount ?? 1);
          } else {
            canPayCosts = false;
          }
        } else if (costType === 'card-discard') {
          const playerHandCards = this.cardsService.getPlayerHand(playerId)?.cards;
          if (!playerHandCards || playerHandCards.length < 1) {
            canPayCosts = false;
          }
        } else if (costType === 'persuasion') {
          player.persuasionSpentThisRound += cost.amount ?? 1;
          if (player.persuasionSpentThisRound > player.permanentPersuasion + player.persuasionGainedThisRound) {
            canPayCosts = false;
          }
        } else if (costType === 'sword') {
          playerCombatScore -= 1;
          if (playerCombatScore < 0) {
            canPayCosts = false;
          }
        } else if (costType === 'troop' || costType === 'loose-troop') {
          const playerCombatUnits = this.combatManager.getPlayerCombatUnits(playerId);
          if ((playerCombatUnits?.troopsInGarrison ?? 0) < 1) {
            canPayCosts = false;
          }
        } else if (costType === 'intrigue-trash') {
          playerIntrigueCount -= 1;
          if (playerIntrigueCount < 0) {
            canPayCosts = false;
          }
        } else if (isFactionScoreCostType(costType)) {
          const scoreType = getFactionScoreTypeFromCost(cost);
          const playerScore = this.playerScoreManager.getPlayerScore(playerId);
          if (scoreType && playerScore && playerScore[scoreType] < 1) {
            canPayCosts = false;
          }
        } else if (costType === 'faction-influence-down-choice') {
          const playerScore = this.playerScoreManager.getPlayerScore(playerId);
          if (playerScore) {
            let counter = 0;
            counter += playerScore.bene > 0 ? 1 : 0;
            counter += playerScore.fremen > 0 ? 1 : 0;
            counter += playerScore.emperor > 0 ? 1 : 0;
            counter += playerScore.guild > 0 ? 1 : 0;

            // We never want to have 0 influence for all factions;
            if (counter < 2) {
              canPayCosts = false;
            }
          }
        }
      }
    }

    return canPayCosts;
  }

  private aiBuyTechOrStackTechAgents(playerId: number, techDiscount: number) {
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const buyableTechTiles = this.techTilesService.buyableTechTiles;
    const availablePlayerSpice = player.resources.find((x) => x.type === 'spice')?.amount ?? 0;
    const availablePlayerTechAgents = player.techAgents;
    const affordableTechTiles = buyableTechTiles.filter(
      (x) => x.costs - techDiscount <= availablePlayerTechAgents + availablePlayerSpice
    );

    if (affordableTechTiles.length > 0) {
      const gameState = this.getGameState(player);
      const mostDesiredTechTile = buyableTechTiles.sort(
        (a, b) => b.aiEvaluation(player, gameState) - a.aiEvaluation(this.getActivePlayer()!, gameState)
      )[0];

      const desire = mostDesiredTechTile.aiEvaluation(player, gameState);
      const effectiveCosts = mostDesiredTechTile.costs - techDiscount - availablePlayerTechAgents;

      if (
        affordableTechTiles.some((x) => x.name.en === mostDesiredTechTile.name.en) &&
        (desire > 0.25 || effectiveCosts < 1)
      ) {
        this.buyTechTileForPlayer(player, mostDesiredTechTile, availablePlayerTechAgents, techDiscount);
      } else if (this.isFinale) {
        this.buyTechTileForPlayer(player, affordableTechTiles[0], availablePlayerTechAgents, techDiscount);
      } else {
        this.playerManager.addTechAgentsToPlayer(player.id, techDiscount + 1);
      }
    } else {
      this.playerManager.addTechAgentsToPlayer(player.id, techDiscount + 1);
    }
  }

  private buyTechTileForPlayer(player: Player, techTile: TechTileCard, techAgents: number, discount: number) {
    const effectiveCosts = techTile.costs - discount;

    if (effectiveCosts > 0) {
      if (techAgents) {
        this.playerManager.removeTechAgentsFromPlayer(player.id, effectiveCosts > techAgents ? techAgents : effectiveCosts);
      }

      if (effectiveCosts > techAgents) {
        this.playerManager.removeResourceFromPlayer(player.id, 'spice', effectiveCosts - techAgents);
      }
    }

    this.techTilesService.setPlayerTechTile(player.id, techTile.name.en);

    if (techTile.buyEffects) {
      for (const reward of techTile.buyEffects) {
        this.addRewardToPlayer(player, reward);
      }

      if (!player.isAI) {
        this.showPlayerRewardChoices(player);
      } else {
        this.aiResolveRewardChoices(player);
      }
    }
    if (techTile.gameModifiers) {
      this.gameModifiersService.addPlayerGameModifiers(player.id, techTile.gameModifiers);
    }

    this.audioManager.playSound('aquire-tech');
  }

  private isOpeningTurn(playerId: number) {
    if (this.currentRound === 1) {
      return this.availablePlayerAgents.find((x) => x.playerId == playerId)?.agentAmount === 2;
    }
    return false;
  }

  private shouldTriggerFinale() {
    const playerScores = this.playerScoreManager.playerScores;
    if (playerScores.length < 4) {
      return playerScores.some((x) => x.victoryPoints > 7);
    } else {
      return playerScores.some((x) => x.victoryPoints > 6);
    }
  }

  public addRewardToPlayer(player: Player, reward: Reward, card?: ImperiumDeckCard) {
    const playerGameModifier = this.gameModifiersService.getPlayerGameModifiers(player.id);

    const rewardType = reward.type;
    if (isResourceType(rewardType)) {
      if (rewardType === 'solari') {
        this.audioManager.playSound('solari', reward.amount);
      } else if (rewardType === 'water') {
        this.audioManager.playSound('water', reward.amount);
      } else if (rewardType === 'spice') {
        this.audioManager.playSound('spice', reward.amount);
      }

      this.playerManager.addResourceToPlayer(player.id, rewardType, reward.amount ?? 1);
    } else if (rewardType === 'shipping') {
      this.turnInfoService.updatePlayerTurnInfo(player.id, { shippingAmount: 1 });
    } else if (isFactionScoreRewardType(rewardType)) {
      this.audioManager.playSound('influence');

      const scoreType = getFactionScoreTypeFromReward(reward);
      const factionInfluenceModifier = getFactionInfluenceModifier(playerGameModifier, scoreType);
      if (factionInfluenceModifier) {
        if (factionInfluenceModifier.noInfluence) {
          if (factionInfluenceModifier.alternateReward) {
            this.addRewardToPlayer(player, factionInfluenceModifier.alternateReward);
          }
        }
      } else {
        const factionRewards = this.playerScoreManager.addFactionScore(player.id, scoreType as PlayerFactionScoreType, 1);

        for (const reward of factionRewards) {
          this.addRewardToPlayer(player, reward);
        }
      }
    } else if (rewardType === 'faction-influence-up-choice') {
      this.audioManager.playSound('influence');
      this.turnInfoService.updatePlayerTurnInfo(player.id, { factionInfluenceUpChoiceAmount: 1 });
    } else if (rewardType === 'faction-influence-up-twice-choice') {
      this.turnInfoService.updatePlayerTurnInfo(player.id, { factionInfluenceUpChoiceAmount: 1 });
    } else if (
      rewardType === 'tech' ||
      rewardType === 'tech-reduced' ||
      rewardType === 'tech-reduced-two' ||
      rewardType === 'tech-reduced-three'
    ) {
      const agents =
        rewardType === 'tech'
          ? 0
          : rewardType === 'tech-reduced'
          ? 1
          : rewardType === 'tech-reduced-two'
          ? 2
          : rewardType === 'tech-reduced-three'
          ? 3
          : 0;
      this.audioManager.playSound('tech-agent', agents);
      this.turnInfoService.updatePlayerTurnInfo(player.id, { techBuyOptionsWithAgents: [agents] });
    } else if (rewardType === 'intrigue') {
      this.audioManager.playSound('intrigue', reward.amount);
      this.intriguesService.drawPlayerIntriguesFromDeck(player.id, reward.amount ?? 1);
    } else if (rewardType === 'troop') {
      this.audioManager.playSound('troops', reward.amount);
      this.combatManager.addPlayerTroopsToGarrison(player.id, reward.amount ?? 1);
      this.turnInfoService.updatePlayerTurnInfo(player.id, { troopsGainedThisTurn: reward.amount ?? 1 });
    } else if (rewardType === 'dreadnought') {
      this.audioManager.playSound('dreadnought');
      this.combatManager.addPlayerShipsToGarrison(player.id, 1);
      this.turnInfoService.updatePlayerTurnInfo(player.id, { troopsGainedThisTurn: reward.amount ?? 1 });
    } else if (rewardType === 'card-draw') {
      this.audioManager.playSound('card-draw');
      this.cardsService.drawPlayerCardsFromDeck(player.id, reward.amount ?? 1);
    } else if (rewardType === 'card-destroy') {
      this.playerManager.addFocusTokens(player.id, reward.amount ?? 1);
    } else if (rewardType == 'card-draw-or-destroy') {
      this.turnInfoService.updatePlayerTurnInfo(player.id, { cardDrawOrDestroyAmount: 1 });
    } else if (rewardType === 'focus') {
      this.audioManager.playSound('focus');
      this.playerManager.addFocusTokens(player.id, reward.amount ?? 1);
    } else if (rewardType == 'persuasion') {
      this.playerManager.addPersuasionGainedToPlayer(player.id, reward.amount ?? 1);
    } else if (rewardType == 'sword') {
      this.audioManager.playSound('sword');
      this.combatManager.addAdditionalCombatPowerToPlayer(player.id, reward.amount ?? 1);
    } else if (rewardType === 'council-seat-small' || rewardType === 'council-seat-large') {
      if (!player.hasCouncilSeat) {
        this.audioManager.playSound('high-council');
        this.playerManager.addCouncilSeatToPlayer(player.id);
      }
    } else if (rewardType === 'sword-master' || rewardType === 'agent') {
      if (!player.hasSwordmaster) {
        this.audioManager.playSound('swordmaster');
        this.playerManager.addPermanentAgentToPlayer(player.id);
      }
      this.addAgentToPlayer(player.id);
    } else if (rewardType === 'mentat') {
      this.addAgentToPlayer(player.id);
    } else if (rewardType === 'agent-lift') {
      this.turnInfoService.updatePlayerTurnInfo(player.id, { canLiftAgent: true });
    } else if (rewardType === 'victory-point') {
      this.audioManager.playSound('victory-point');
      this.playerScoreManager.addPlayerScore(player.id, 'victoryPoints', reward.amount ?? 1);
    } else if (rewardType === 'foldspace') {
      const foldspaceCard = this.settingsService
        .getCustomCards()
        ?.find((x) => x.name.en.toLocaleLowerCase() === 'foldspace');
      if (foldspaceCard) {
        this.cardsService.addCardToPlayerHand(player.id, this.cardsService.instantiateImperiumCard(foldspaceCard));
      }
    } else if (rewardType === 'location-control') {
      this.audioManager.playSound('location-control');
      this.turnInfoService.updatePlayerTurnInfo(player.id, { locationControlAmount: 1 });
    } else if (rewardType === 'signet-ring') {
      this.turnInfoService.updatePlayerTurnInfo(player.id, { signetRingAmount: 1 });
    } else if (rewardType === 'trash-self' && card) {
      this.cardsService.trashPlayerHandCard(player.id, card);
      this.loggingService.logPlayerTrashedCard(player.id, this.translateService.translate(card.name));
    } else if (reward.type === 'combat') {
      this.audioManager.playSound('combat');
      this.turnInfoService.setPlayerTurnInfo(player.id, { canEnterCombat: true, deployableUnits: 2 });
    } else if (reward.type === 'intrigue-draw') {
      const enemiesIntrigues = this.intriguesService.getEnemyIntrigues(player.id).filter((x) => x.intrigues.length > 3);
      for (const enemyIntrigues of enemiesIntrigues) {
        const stolenIntrigue = getRandomElementFromArray(enemyIntrigues.intrigues);
        this.intriguesService.trashPlayerIntrigue(enemyIntrigues.playerId, stolenIntrigue.id);
        this.intriguesService.addPlayerIntrigue(player.id, stolenIntrigue);
        this.loggingService.logPlayerStoleIntrigue(player.id, enemyIntrigues.playerId);
      }
    } else if (reward.type === 'recruitment-bene') {
      this.turnInfoService.updatePlayerTurnInfo(player.id, { factionRecruitment: ['bene'] });
    } else if (reward.type === 'recruitment-fremen') {
      this.turnInfoService.updatePlayerTurnInfo(player.id, { factionRecruitment: ['fremen'] });
    } else if (reward.type === 'recruitment-guild') {
      this.turnInfoService.updatePlayerTurnInfo(player.id, { factionRecruitment: ['guild'] });
    } else if (reward.type === 'recruitment-emperor') {
      this.turnInfoService.updatePlayerTurnInfo(player.id, { factionRecruitment: ['emperor'] });
    }

    this.loggingService.logPlayerResourceGained(player.id, rewardType, reward.amount);
  }

  public payCostForPlayer(playerId: number, cost: Reward) {
    const costType = cost.type;
    if (isResourceType(costType)) {
      this.playerManager.removeResourceFromPlayer(playerId, costType, cost.amount ?? 1);
    } else if (costType === 'shipping') {
      this.playerManager.removeResourceFromPlayer(playerId, 'water', cost.amount ?? 1);
    } else if (isFactionScoreRewardType(costType)) {
      const scoreType = getFactionScoreTypeFromReward(cost);

      this.playerScoreManager.removePlayerScore(playerId, scoreType as PlayerFactionScoreType, 1);
    } else if (costType === 'faction-influence-down-choice') {
      this.turnInfoService.updatePlayerTurnInfo(playerId, { factionInfluenceDownChoiceAmount: 1 });
    } else if (costType === 'intrigue' || costType === 'intrigue-trash') {
      this.aiTrashIntrigue(playerId);
    } else if (costType === 'sword') {
      this.combatManager.removeAdditionalCombatPowerFromPlayer(playerId, cost.amount ?? 1);
    } else if (costType === 'troop' || costType === 'loose-troop') {
      this.combatManager.removePlayerTroopsFromGarrison(playerId, cost.amount ?? 1);
    } else if (costType === 'dreadnought') {
      this.combatManager.removePlayerShipsFromGarrison(playerId, 1);
    } else if (costType === 'card-discard') {
      this.aiDiscardHandCard(playerId);
    } else if (costType === 'card-destroy' || costType === 'focus') {
      this.playerManager.addFocusTokens(playerId, cost.amount ?? 1);
    } else if (costType === 'persuasion') {
      this.playerManager.addPersuasionSpentToPlayer(playerId, cost.amount ?? 1);
    } else if (costType === 'victory-point') {
      this.playerScoreManager.removePlayerScore(playerId, 'victoryPoints', cost.amount ?? 1);
    }

    this.loggingService.logPlayerResourcePaid(playerId, costType, cost.amount);
  }

  lockInLeader(playerId: number, leader: Leader | LeaderImageOnly | undefined) {
    this.leadersService.lockInLeader(playerId);

    if (leader && leader.gameModifiers) {
      this.gameModifiersService.addPlayerGameModifiers(playerId, leader.gameModifiers);
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
      const playerScores = this.playerScoreManager.getPlayerScore(player.id);
      if (playerScores) {
        const desiredScoreType = this.aIManager.getMostDesiredFactionScoreType(playerScores, increasedFactionScoreTypes);

        if (desiredScoreType) {
          const factionRewards = this.playerScoreManager.addFactionScore(player.id, desiredScoreType, 1);
          increasedFactionScoreTypes.push(desiredScoreType);

          for (const reward of factionRewards) {
            this.addRewardToPlayer(player, reward);
          }
        }
      }
    }
  }

  private aiAddFactionInfluenceUpChoiceTwice(player: Player, amount: number) {
    const increasedFactionScoreTypes: PlayerFactionScoreType[] = [];
    for (let i = amount; i > 0; i--) {
      const playerScores = this.playerScoreManager.getPlayerScore(player.id);
      if (playerScores) {
        const desiredScoreType = this.aIManager.getMostDesiredFactionScoreType(playerScores, increasedFactionScoreTypes);

        if (desiredScoreType) {
          const factionRewards = this.playerScoreManager.addFactionScore(player.id, desiredScoreType, 2);
          increasedFactionScoreTypes.push(desiredScoreType);

          for (const reward of factionRewards) {
            this.addRewardToPlayer(player, reward);
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
          this.playerScoreManager.removePlayerScore(playerId, leastDesiredScoreType, 1);
        }
      }
    }
  }

  private getExtractedRewardsFromCustomAgentEffect(customAgentEffect: string) {
    const rewards: Reward[] = [];
    let restString = customAgentEffect;

    const potentialReward = customAgentEffect.slice(0, customAgentEffect.indexOf('}') + 1).trim();

    const resourceRegExp = /^{resource:.*?}/g;
    const isReward = resourceRegExp.test(potentialReward);
    if (isReward) {
      const amountRegExp = /;amount:.*?}/g;
      const amountString = potentialReward.match(amountRegExp);
      if (!amountString) {
        const resource = potentialReward.substring(10, potentialReward.length - 1) as RewardType;
        rewards.push({ type: resource, amount: 1 });
      } else {
        const amount = amountString[0].substring(8, amountString[0].length - 1);
        const amountNumber = parseInt(amount);

        const resource = potentialReward.substring(10, potentialReward.length - amount.length - 9) as RewardType;
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
}
