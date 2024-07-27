import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { isResource, isResourceType } from '../helpers/resources';
import { CombatManager, PlayerCombatUnits } from './combat-manager.service';
import { LoggingService } from './log.service';
import { Player, PlayerManager } from './player-manager.service';
import { PlayerFactionScoreType, PlayerScoreManager } from './player-score-manager.service';
import { LocationManager } from './location-manager.service';
import { DuneEventsManager } from './dune-events.service';
import { ActionField, Reward } from '../models';
import { AIAgentPlacementInfo, AIManager } from './ai/ai.manager';
import { LeadersService } from './leaders.service';
import { ConflictsService } from './conflicts.service';
import { MinorHousesService } from './minor-houses.service';
import { TechTilesService } from './tech-tiles.service';
import { TechTile } from '../constants/tech-tiles';
import { AudioManager } from './audio-manager.service';
import { SettingsService } from './settings.service';
import { shuffle } from '../helpers/common';
import { GameState } from './ai/models';
import { CardsService, ImperiumDeckCard } from './cards.service';
import { isFactionScoreRewardType } from '../helpers/rewards';
import { getFactionScoreTypeFromReward } from '../helpers/faction-score';

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

export type TurnPhaseType = 'none' | 'agent-placement' | 'combat' | 'done';

@Injectable({
  providedIn: 'root',
})
export class GameManager {
  public autoPlayAI = false;

  private currentRoundSubject = new BehaviorSubject<number>(0);
  public currentRound$ = this.currentRoundSubject.asObservable();

  private currentTurnStateSubject = new BehaviorSubject<TurnPhaseType>('none');
  public currentTurnState$ = this.currentTurnStateSubject.asObservable();

  private startingPlayerIdSubject = new BehaviorSubject<number>(0);
  public startingPlayerId$ = this.startingPlayerIdSubject.asObservable();

  private activePlayerIdSubject = new BehaviorSubject<number>(0);
  public activePlayerId$ = this.activePlayerIdSubject.asObservable();

  public activeCombatPlayerId: number = 0;

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
    private playerManager: PlayerManager,
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
    private cardsService: CardsService
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

    const currentTurnStateString = localStorage.getItem('currentTurnState');
    if (currentTurnStateString) {
      const currentTurnState = JSON.parse(currentTurnStateString) as TurnPhaseType;
      this.currentTurnStateSubject.next(currentTurnState);
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

    this.currentTurnState$.subscribe((currentTurnState) => {
      localStorage.setItem('currentTurnState', JSON.stringify(currentTurnState));
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

  public get currentTurnState() {
    return cloneDeep(this.currentTurnStateSubject.value);
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
    this.loggingService.clearLog();
    this.audioManager.playSound('atmospheric');
    const newPlayers = this.playerManager.resetPlayers();
    this.combatManager.resetAdditionalCombatPower();
    this.combatManager.deleteAllPlayerTroopsFromCombat();
    this.combatManager.resetAllPlayerShips();
    this.combatManager.setInitialPlayerCombatUnits(newPlayers);
    this.locationManager.resetLocationOwners();
    this.duneEventsManager.setGameEvents();
    this.playerScoreManager.resetPlayersScores(newPlayers);
    this.playerScoreManager.resetPlayerAlliances();
    this.removePlayerAgentsFromBoard();
    this.resetAccumulatedSpiceOnFields();

    this.cardsService.resetPlayerTrashPiles();
    this.cardsService.setImperiumDeck();
    this.cardsService.setInitialPlayerDecks();
    this.aIManager.assignPersonalitiesToAIPlayers(newPlayers);
    this.leadersService.assignLeadersToPlayers(newPlayers);
    this.conflictsService.setInitialConflict();
    this.minorHousesService.setInitialAvailableHouses();
    this.techTilesService.setInitialAvailableTechTiles();

    this.currentRoundSubject.next(1);
    this.currentTurnStateSubject.next('agent-placement');
    this.startingPlayerIdSubject.next(1);
    this.activePlayerIdSubject.next(1);
    this.activeCombatPlayerId = 1;

    for (const player of newPlayers) {
      this.cardsService.drawPlayerCardsFromDeck(player.id, player.cardsDrawnAtRoundStart);

      if (player.isAI && player.id === this.startingPlayerId) {
        this.setCurrentAIPlayer(this.startingPlayerId);

        this.setPreferredFieldsForAIPlayer(this.startingPlayerId);
      }
    }
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
    this.currentTurnStateSubject.next('agent-placement');

    this.startingPlayerIdSubject.next(
      this.playerManager.getPlayerCount() > this.startingPlayerId ? this.startingPlayerId + 1 : 1
    );

    this.activePlayerIdSubject.next(this.startingPlayerId);
    this.activeCombatPlayerId = this.startingPlayerId;

    this.cardsService.discardAllPlayerHandCards();
    this.cardsService.shufflePlayerDiscardPilesUnderDecks();
    for (const player of this.playerManager.getPlayers()) {
      this.cardsService.drawPlayerCardsFromDeck(player.id, player.cardsDrawnAtRoundStart);

      if (player.isAI && player.id === this.startingPlayerId) {
        this.setCurrentAIPlayer(this.startingPlayerId);

        this.setPreferredFieldsForAIPlayer(this.startingPlayerId);
      }
    }
  }

  public finishGame() {
    this.audioManager.playSound('atmospheric');
    this.removePlayerAgentsFromBoard();
    this.combatManager.resetAdditionalCombatPower();
    this.loggingService.printLog();
    this.currentRoundSubject.next(0);
    this.currentTurnStateSubject.next('none');
    this.startingPlayerIdSubject.next(0);
    this.activePlayerIdSubject.next(0);
    this.activeCombatPlayerId = 0;
    this.duneEventsManager.resetGameEvents();
    this.leadersService.resetLeaders();
    this.conflictsService.resetConflicts();

    this.isFinaleSubject.next(false);
  }

  public revealPlayerCards(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);

    if (!player) {
      return;
    }

    this.playerManager.setTurnStateForPlayer(playerId, 'reveal');
    const playerHand = this.cardsService.getPlayerHand(playerId);
    if (playerHand) {
      for (const card of playerHand.cards) {
        if (card.revealEffects) {
          const fieldOptions: Reward[] = [];
          const { hasRewardOptions, hasRewardConversion, rewardOptionIndex } = this.aIManager.getRewardArrayAIInfos(
            card.revealEffects
          );

          for (const [index, reward] of card.revealEffects.entries()) {
            const isRewardOption = hasRewardOptions && (index === rewardOptionIndex - 1 || index === rewardOptionIndex + 1);

            if (!hasRewardOptions && !hasRewardConversion) {
              const aiInfo = this.addRewardToPlayer(reward);
            } else {
              fieldOptions.push(reward);
            }
          }
        }
      }
    }
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

    if (this.currentTurnState !== 'agent-placement' || !activePlayer || activePlayer.turnState !== 'agent-placement') {
      return;
    }

    const activePlayerAgentCount = this.getAvailableAgentCountForPlayer(activePlayer.id);
    if (activePlayerAgentCount < 1) {
      return;
    }

    if (field.rewards.some((x) => x.type === 'sword-master') && activePlayer.hasSwordmaster) {
      return;
    }

    if (
      field.rewards.some((x) => x.type === 'council-seat-small' || x.type === 'council-seat-large') &&
      activePlayer.hasCouncilSeat
    ) {
      return;
    }

    if (field.costs) {
      if (!this.playerCanPayCosts(activePlayer.id, field.costs)) {
        return;
      }

      for (let cost of field.costs) {
        if (isResource(cost)) {
          this.playerManager.removeResourceFromPlayer(activePlayer.id, cost.type, cost.amount ?? 1);
        }
      }
    }

    this.setPlayerOnField(field.title.en);

    let aiAgentPlacementInfos = this.getInitialAIAgentPlacementInfos();

    const fieldOptions: Reward[] = [];
    const { rewardOptionIndex, hasRewardOptions } = this.aIManager.getRewardArrayAIInfos(field.rewards);

    if (!field.tradeOptionField) {
      for (const [index, reward] of field.rewards.entries()) {
        const isRewardOption = hasRewardOptions && (index === rewardOptionIndex - 1 || index === rewardOptionIndex + 1);

        if (!isRewardOption) {
          const aiInfo = this.addRewardToPlayer(reward);
          aiAgentPlacementInfos = this.updateAiAgentPlacementInfo(aiAgentPlacementInfos, aiInfo);

          if (reward.type === 'spice-accumulation' && this.fieldHasAccumulatedSpice(field.title.en)) {
            const accumulatedSpice = this.getAccumulatedSpiceForField(field.title.en);
            this.audioManager.playSound('spice', accumulatedSpice);
            this.playerManager.addResourceToPlayer(activePlayer.id, 'spice', accumulatedSpice);
          }
        } else {
          fieldOptions.push(reward);
        }
        if (reward.type === 'mentat') {
          this.addAgentToPlayer(activePlayer.id);
        }
        if (reward.type == 'agent-lift') {
          aiAgentPlacementInfos.canLiftAgent = true;
        }
        if (reward.type === 'combat') {
          this.audioManager.playSound('combat');
          aiAgentPlacementInfos.canEnterCombat = true;
        }
      }

      const factionRewards = this.playerScoreManager.addFactionScore(activePlayer.id, field.actionType, 1);

      for (const reward of factionRewards) {
        const aiInfo = this.addRewardToPlayer(reward);
        aiAgentPlacementInfos = this.updateAiAgentPlacementInfo(aiAgentPlacementInfos, aiInfo);

        if (reward.type === 'combat') {
          aiAgentPlacementInfos.canEnterCombat = true;
        }
      }
    }

    const aiInfo = this.addPlayedCardRewards();
    aiAgentPlacementInfos = this.updateAiAgentPlacementInfo(aiAgentPlacementInfos, aiInfo);

    if (activePlayer.isAI) {
      const aiPlayer = this.aIManager.getAIPlayer(activePlayer.id);

      if (activePlayer && aiPlayer) {
        if (aiAgentPlacementInfos.canDestroyOrDrawCard) {
          const drawOrDestroy = this.aIManager.getFieldDrawOrDestroyDecision(activePlayer.id, field.title.en);

          if (drawOrDestroy === 'draw') {
            this.cardsService.drawPlayerCardsFromDeck(activePlayer.id, 1);
          } else {
            this.playerManager.addFocusTokens(activePlayer.id, 1);
          }
        }
        if (hasRewardOptions) {
          const aiDecision = this.aIManager.getFieldDecision(activePlayer.id, field.title.en);
          const reward = field.rewards.find((x) => x.type.includes(aiDecision));

          if (reward) {
            const aiInfo = this.addRewardToPlayer(reward);
            aiAgentPlacementInfos = this.updateAiAgentPlacementInfo(aiAgentPlacementInfos, aiInfo);
          }
        }

        if (aiAgentPlacementInfos.canBuyTech) {
          this.buyTechOrStackTechAgents(activePlayer, -1, aiAgentPlacementInfos.techAgentsGainedThisTurn);
        }

        if (aiAgentPlacementInfos.canLiftAgent) {
          const playerAgentsOnOtherFields = this.agentsOnFields.filter(
            (x) => x.playerId === activePlayer.id && x.fieldId !== field.title.en
          );
          if (playerAgentsOnOtherFields) {
            shuffle(playerAgentsOnOtherFields);
            this.removePlayerAgentFromField(activePlayer.id, playerAgentsOnOtherFields[0].fieldId);
          }
        }

        if (aiAgentPlacementInfos.canEnterCombat) {
          const playerCombatUnits = this.combatManager.getPlayerCombatUnits(activePlayer.id);
          const enemyCombatUnits = this.combatManager.getEnemyCombatUnits(activePlayer.id);
          const playerHasAgentsLeft =
            (this.availablePlayerAgents.find((x) => x.playerId === activePlayer.id)?.agentAmount ?? 0) > 1;

          const combatDecision = aiPlayer.decisions.find((x) => x.includes('conflict'));

          if (combatDecision) {
            if (this.isFinale) {
              this.combatManager.addAllPossibleUnitsToCombat(activePlayer.id, aiAgentPlacementInfos.unitsGainedThisTurn);
            } else if (combatDecision.includes('win')) {
              if (playerCombatUnits && enemyCombatUnits) {
                const addUnitsDecision = this.aIManager.getAddAdditionalUnitsToCombatDecision(
                  playerCombatUnits,
                  enemyCombatUnits,
                  aiAgentPlacementInfos.unitsGainedThisTurn + 2,
                  playerHasAgentsLeft,
                  activePlayer.intrigueCount > 2
                );

                if (addUnitsDecision === 'all') {
                  this.combatManager.addAllPossibleUnitsToCombat(activePlayer.id, aiAgentPlacementInfos.unitsGainedThisTurn);
                } else if (addUnitsDecision === 'minimum') {
                  this.addMinimumUnitsToCombat(activePlayer.id, playerCombatUnits, enemyCombatUnits, playerHasAgentsLeft);
                }
              }
            } else if (combatDecision.includes('participate')) {
              if (playerCombatUnits) {
                this.addMinimumUnitsToCombat(activePlayer.id, playerCombatUnits, enemyCombatUnits, playerHasAgentsLeft);
              }
            }
          }
        }

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

  updateAiAgentPlacementInfo(
    aiAgentPlacementInfo: AIAgentPlacementInfo,
    aiInfo: AIAgentPlacementInfo
  ): AIAgentPlacementInfo {
    return {
      unitsGainedThisTurn: aiAgentPlacementInfo.unitsGainedThisTurn + aiInfo.unitsGainedThisTurn,
      techAgentsGainedThisTurn: aiAgentPlacementInfo.techAgentsGainedThisTurn + aiInfo.techAgentsGainedThisTurn,
      canDestroyOrDrawCard: aiAgentPlacementInfo.canDestroyOrDrawCard || aiInfo.canDestroyOrDrawCard,
      canBuyTech: aiAgentPlacementInfo.canBuyTech || aiInfo.canBuyTech,
      canEnterCombat: aiAgentPlacementInfo.canEnterCombat || aiInfo.canEnterCombat,
      canLiftAgent: aiAgentPlacementInfo.canLiftAgent || aiInfo.canLiftAgent,
    };
  }

  addPlayedCardRewards(): AIAgentPlacementInfo {
    let aiAgentPlacementInfos = this.getInitialAIAgentPlacementInfos();

    const playerCard = this.cardsService.getPlayedPlayerCard(this.activePlayerId);
    if (playerCard) {
      const card = this.cardsService.getPlayerHandCard(this.activePlayerId, playerCard.cardId);
      if (card) {
        if (card.agentEffects) {
          const { hasRewardOptions, hasRewardConversion } = this.aIManager.getRewardArrayAIInfos(card.agentEffects);
          if (!hasRewardOptions && !hasRewardConversion) {
            for (const agentEffect of card.agentEffects) {
              const aiInfo = this.addRewardToPlayer(agentEffect);
              aiAgentPlacementInfos = this.updateAiAgentPlacementInfo(aiAgentPlacementInfos, aiInfo);
            }
          }
        }
      }
    }
    return aiAgentPlacementInfos;
  }

  public getAgentOnField(fieldId: string) {
    return this.agentsOnFieldsSubject.value.find((x) => x.fieldId === fieldId);
  }

  public removePlayerAgentFromField(playerId: number, fieldId: string) {
    this.agentsOnFieldsSubject.next(this.agentsOnFields.filter((x) => !(x.fieldId === fieldId && x.playerId === playerId)));

    this.addAgentToPlayer(playerId);
  }

  private setPlayerOnField(fieldId: string) {
    this.agentsOnFieldsSubject.next([...this.agentsOnFieldsSubject.value, { playerId: this.activePlayerId, fieldId }]);
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

  public setNextPlayerActive(turnPhase: TurnPhaseType) {
    if (turnPhase === 'agent-placement') {
      this.cardsService.discardPlayedPlayerCard(this.activePlayerId);

      const players = this.playerManager.getPlayers();
      const nextPlayer = players.find((x) => x.id > this.activePlayerId) ?? players[0];
      if (nextPlayer) {
        this.activePlayerIdSubject.next(nextPlayer.id);

        if (nextPlayer.isAI) {
          this.setCurrentAIPlayer(nextPlayer.id);

          this.setPreferredFieldsForAIPlayer(nextPlayer.id);
        }
      }
    }
    if (turnPhase === 'combat') {
      const nextPlayerId = this.playerManager.getNextPlayerId(this.activeCombatPlayerId);
      this.activeCombatPlayerId = nextPlayerId;
    }
  }

  public setTurnState(turnPhase: TurnPhaseType) {
    if (turnPhase === 'combat') {
      this.audioManager.playSound('conflict');
    }
    this.currentTurnStateSubject.next(turnPhase);
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

  public doAIAction(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);
    const playerAgentCount = this.getAvailableAgentCountForPlayer(playerId);

    if (!player) {
      return;
    }

    if (player.turnState === 'agent-placement' && playerAgentCount > 0) {
      const playerHandCards = this.cardsService.getPlayerHand(player.id)?.cards;
      const preferredField = this.aIManager.getPreferredFieldForPlayer(playerId);
      if (playerHandCards && preferredField) {
        const cardToPlay = this.aIManager.getCardToPlay(preferredField, playerHandCards);
        if (cardToPlay) {
          this.cardsService.setPlayedPlayerCard(playerId, cardToPlay.id);
          if (preferredField) {
            this.addAgentToField(preferredField);
          }
        }
      }
    } else if (playerAgentCount < 1) {
      this.revealPlayerCards(playerId);

      const playerPersuasionAvailable = this.playerManager.getPlayerPersuasion(playerId);
      this.chooseAndBuyCards(playerId, playerPersuasionAvailable);

      const playerFocusTokens = this.playerManager.getPlayerFocusTokens(playerId);
      this.chooseAndTrashDeckCards(playerId, playerFocusTokens);
    }
  }

  private chooseAndBuyCards(playerId: number, availablePersuasion: number) {
    const imperiumRow = this.cardsService.imperiumDeck.slice(0, 6);
    const alwaysBuyableCards = this.settingsService
      .getAlwaysBuyableCards()
      .map((x) => this.cardsService.instantiateImperiumCard(x));
    const availableCards = [...imperiumRow, ...shuffle(alwaysBuyableCards)];

    const cardToBuy = this.aIManager.getCardToBuy(availablePersuasion, availableCards);
    if (cardToBuy) {
      if (cardToBuy.persuasionCosts) {
        this.playerManager.addPersuasionSpentToPlayer(playerId, cardToBuy.persuasionCosts);
      }
      if (cardToBuy.buyEffects) {
        for (const effect of cardToBuy.buyEffects) {
          this.addRewardToPlayer(effect);
        }
      }
      this.cardsService.aquirePlayerCardFromImperiumDeck(playerId, cardToBuy);

      this.chooseAndBuyCards(playerId, availablePersuasion - (cardToBuy.persuasionCosts ?? 0));
    }
  }

  private chooseAndTrashDeckCards(playerId: number, focusTokens: number) {
    const cards: ImperiumDeckCard[] = [];
    const playerHand = this.cardsService.getPlayerHand(playerId);
    if (playerHand) {
      cards.push(...playerHand.cards);
    }
    const playerDiscardPile = this.cardsService.getPlayerDiscardPile(playerId);
    if (playerDiscardPile) {
      cards.push(...playerDiscardPile.cards);
    }

    const cardToTrash = this.aIManager.getCardToTrash(cards);
    if (cardToTrash) {
      this.cardsService.trashDiscardedPlayerCard(playerId, cardToTrash);
      this.cardsService.trashPlayerHandCard(playerId, cardToTrash);

      this.playerManager.removeFocusTokens(playerId, 1);

      if (focusTokens > 1) {
        this.chooseAndTrashDeckCards(playerId, focusTokens - 1);
      }
    }
  }

  private getGameState(player: Player): GameState {
    const playerDeckCards = this.cardsService.getPlayerDeck(player.id)?.cards;
    const playerHandCards = this.cardsService.getPlayerHand(player.id)?.cards;
    const playerDiscardPileCards = this.cardsService.getPlayerDiscardPile(player.id)?.cards;
    const playerTrashPileCards = this.cardsService.getPlayerTrashPile(player.id)?.cards;
    const playerCardsTrashed = playerTrashPileCards?.length ?? 0;

    const playerCardsBought =
      (playerDeckCards?.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerHandCards?.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerDiscardPileCards?.filter((x) => x.persuasionCosts).length ?? 0) +
      (playerTrashPileCards?.filter((x) => x.persuasionCosts).length ?? 0);

    return {
      currentRound: this.currentRound,
      accumulatedSpiceOnFields: this.accumulatedSpiceOnFields,
      playerAgentCount: this.availablePlayerAgents.find((x) => x.playerId === player.id)?.agentAmount ?? 0,
      enemyAgentCount: this.availablePlayerAgents.filter((x) => x.playerId !== player.id),
      playerScore: this.playerScoreManager.getPlayerScore(player.id)!,
      enemyScore: this.playerScoreManager.getEnemyScore(player.id)!,
      playerCombatUnits: this.combatManager.getPlayerCombatUnits(player.id)!,
      enemyCombatUnits: this.combatManager.getEnemyCombatUnits(player.id),
      agentsOnFields: this.agentsOnFields,
      playerAgentsOnFields: this.agentsOnFields.filter((x) => x.playerId === player.id),
      isOpeningTurn: this.isOpeningTurn(player.id),
      isFinale: this.isFinale,
      enemyPlayers: this.playerManager.getEnemyPlayers(player.id),
      playerLeader: this.leadersService.getLeader(player.id)!,
      conflict: this.conflictsService.currentConflict,
      availableTechTiles: this.techTilesService.availableTechTiles,
      currentEvent: this.duneEventsManager.gameEvents[this.currentRound - 1],
      playerDeckSizeTotal:
        (playerDeckCards?.length ?? 0) + (playerHandCards?.length ?? 0) + (playerDiscardPileCards?.length ?? 0),
      playerHandCards,
      playerDeckCards,
      playerDiscardPileCards,
      playerTrashPileCards,
      playerCardsBought,
      playerCardsTrashed,
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
    const spiceFieldNames = this.settingsService.spiceAccumulationFields.map((x) => x.title.en);

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

  private playerCanPayCosts(id: number, costs: Reward[]) {
    const player = this.playerManager.getPlayer(id);
    const resourcesToPay = costs.filter((x) => isResource(x));
    if (player) {
      for (let resource of resourcesToPay) {
        const resourceIndex = player.resources.findIndex((x) => x.type === resource.type);
        const currentResourceAmount = player.resources[resourceIndex].amount;
        if (currentResourceAmount && currentResourceAmount >= (resource.amount ?? 1)) {
          player.resources[resourceIndex].amount = currentResourceAmount - (resource.amount ?? 1);
        } else {
          return false;
        }
      }
    }

    return true;
  }

  private buyTechOrStackTechAgents(player: Player, techDiscount?: number, techAgentsGainedThisTurn?: number) {
    const discount = techDiscount ?? 0;
    const availableTechTiles = this.techTilesService.availableTechTiles;
    const availablePlayerSpice = player.resources.find((x) => x.type === 'spice')?.amount ?? 0;
    const availablePlayerTechAgents = player.techAgents + (techAgentsGainedThisTurn ?? 0);
    const affordableTechTiles = availableTechTiles.filter(
      (x) => x.costs - discount <= availablePlayerTechAgents + availablePlayerSpice
    );

    if (affordableTechTiles.length > 0) {
      const gameState = this.getGameState(player);
      const mostDesiredTechTile = availableTechTiles.sort(
        (a, b) => b.aiEvaluation(player, gameState) - a.aiEvaluation(this.getActivePlayer()!, gameState)
      )[0];

      const desire = mostDesiredTechTile.aiEvaluation(player, gameState);
      const effectiveCosts = mostDesiredTechTile.costs - discount - availablePlayerTechAgents;

      if (
        affordableTechTiles.some((x) => x.name.en === mostDesiredTechTile.name.en) &&
        (desire > 0.25 || effectiveCosts < 1)
      ) {
        this.buyTechTileForPlayer(player, mostDesiredTechTile, availablePlayerTechAgents, discount);
      } else if (this.isFinale) {
        this.buyTechTileForPlayer(player, affordableTechTiles[0], availablePlayerTechAgents, discount);
      } else {
        this.playerManager.addTechAgentsToPlayer(player.id, discount + 1);
      }
    } else {
      this.playerManager.addTechAgentsToPlayer(player.id, discount + 1);
    }
  }

  private buyTechTileForPlayer(player: Player, techTile: TechTile, techAgents: number, discount: number) {
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
      return playerScores.some((x) => x.victoryPoints > 8);
    } else {
      return playerScores.some((x) => x.victoryPoints > 7);
    }
  }

  public addRewardToPlayer(reward: Reward) {
    let aiInfo = this.getInitialAIAgentPlacementInfos();
    const rewardType = reward.type;
    if (isResourceType(rewardType)) {
      if (rewardType === 'solari') {
        this.audioManager.playSound('solari', reward.amount);
      } else if (rewardType === 'water') {
        this.audioManager.playSound('water', reward.amount);
      } else if (rewardType === 'spice') {
        this.audioManager.playSound('spice', reward.amount);
      }

      this.playerManager.addResourceToPlayer(this.activePlayerId, rewardType, reward.amount ?? 1);
    } else if (isFactionScoreRewardType(rewardType)) {
      const scoreType = getFactionScoreTypeFromReward(reward);

      const factionRewards = this.playerScoreManager.addFactionScore(
        this.activePlayerId,
        scoreType as PlayerFactionScoreType,
        1
      );

      for (const reward of factionRewards) {
        const ai = this.addRewardToPlayer(reward);
        aiInfo = this.updateAiAgentPlacementInfo(ai, aiInfo);

        if (reward.type === 'combat') {
          aiInfo.canEnterCombat = true;
        }
      }
    } else if (rewardType === 'faction-influence-up-choice') {
      const playerScores = this.playerScoreManager.getPlayerScore(this.activePlayerId);
      if (playerScores) {
        const desiredScoreType = this.aIManager.getDesiredFactionScoreType(playerScores);

        const factionRewards = this.playerScoreManager.addFactionScore(this.activePlayerId, desiredScoreType, 1);

        for (const reward of factionRewards) {
          const ai = this.addRewardToPlayer(reward);
          aiInfo = this.updateAiAgentPlacementInfo(ai, aiInfo);

          if (reward.type === 'combat') {
            aiInfo.canEnterCombat = true;
          }
        }
      }
    } else if (rewardType === 'faction-influence-up-twice-choice') {
      const playerScores = this.playerScoreManager.getPlayerScore(this.activePlayerId);
      if (playerScores) {
        const desiredScoreType = this.aIManager.getDesiredFactionScoreType(playerScores);

        const factionRewards = this.playerScoreManager.addFactionScore(this.activePlayerId, desiredScoreType, 2);

        for (const reward of factionRewards) {
          const ai = this.addRewardToPlayer(reward);
          aiInfo = this.updateAiAgentPlacementInfo(ai, aiInfo);

          if (reward.type === 'combat') {
            aiInfo.canEnterCombat = true;
          }
        }
      }
    } else if (
      rewardType === 'tech' ||
      rewardType === 'tech-reduced' ||
      rewardType === 'tech-reduced-two' ||
      rewardType === 'tech-reduced-three'
    ) {
      const agents =
        rewardType === 'tech'
          ? 1
          : rewardType === 'tech-reduced'
          ? 2
          : rewardType === 'tech-reduced-two'
          ? 3
          : rewardType === 'tech-reduced-three'
          ? 4
          : 0;
      this.playerManager.addTechAgentsToPlayer(this.activePlayerId, agents);
      aiInfo.canBuyTech = true;
      aiInfo.techAgentsGainedThisTurn += agents;
    } else if (rewardType === 'intrigue') {
      this.audioManager.playSound('intrigue', reward.amount);
      this.playerManager.addIntriguesToPlayer(this.activePlayerId, reward.amount ?? 1);
    } else if (rewardType === 'troop') {
      this.audioManager.playSound('troops', reward.amount);
      this.combatManager.addPlayerTroopsToGarrison(this.activePlayerId, reward.amount ?? 1);
      aiInfo.unitsGainedThisTurn += reward.amount ?? 1;
    } else if (rewardType === 'dreadnought') {
      this.audioManager.playSound('dreadnought');
      this.combatManager.addPlayerShipsToGarrison(this.activePlayerId, 1);
      aiInfo.unitsGainedThisTurn += reward.amount ?? 1;
    } else if (rewardType === 'card-draw') {
      this.cardsService.drawPlayerCardsFromDeck(this.activePlayerId, reward.amount ?? 1);
    } else if (rewardType === 'card-destroy') {
      this.playerManager.addFocusTokens(this.activePlayerId, reward.amount ?? 1);
    } else if (rewardType == 'card-draw-or-destroy') {
      aiInfo.canDestroyOrDrawCard = true;
    } else if (rewardType == 'persuasion') {
      this.playerManager.addPersuasionGainedToPlayer(this.activePlayerId, reward.amount ?? 1);
    } else if (rewardType == 'sword') {
      this.audioManager.playSound('sword');
      this.combatManager.addAdditionalCombatPowerToPlayer(this.activePlayerId, reward.amount ?? 1);
    } else if (rewardType === 'council-seat-small' || rewardType === 'council-seat-large') {
      this.audioManager.playSound('high-council');
      this.playerManager.addCouncilSeatToPlayer(this.activePlayerId);
    } else if (rewardType === 'sword-master') {
      this.audioManager.playSound('swordmaster');
      this.playerManager.addPermanentAgentToPlayer(this.activePlayerId);
      this.addAgentToPlayer(this.activePlayerId);
    } else if (rewardType === 'mentat') {
      this.addAgentToPlayer(this.activePlayerId);
    } else if (rewardType === 'victory-point') {
      this.audioManager.playSound('victory-point');
      this.playerScoreManager.addPlayerScore(this.activePlayerId, 'victoryPoints', reward.amount ?? 1);
    } else if (rewardType === 'foldspace') {
      const foldspaceCard = this.settingsService
        .getCustomCards()
        ?.find((x) => x.name.en.toLocaleLowerCase() === 'foldspace');
      if (foldspaceCard) {
        this.cardsService.addCardToPlayerHand(this.activePlayerId, this.cardsService.instantiateImperiumCard(foldspaceCard));
      }
    }

    return aiInfo;
  }

  public addMinimumUnitsToCombat(
    playerId: number,
    playerCombatUnits: PlayerCombatUnits,
    enemyCombatUnits: PlayerCombatUnits[],
    playerHasAgentsLeft: boolean
  ) {
    if (playerHasAgentsLeft) {
      const troopsToAdd =
        playerCombatUnits.troopsInGarrison > 0
          ? playerCombatUnits.troopsInGarrison > 3
            ? Math.round(Math.random()) + 1
            : 1
          : 0;

      this.combatManager.addPlayerTroopsToCombat(playerId, troopsToAdd);

      if (troopsToAdd === 0 && playerCombatUnits.shipsInGarrison > 0) {
        if (playerCombatUnits.shipsInGarrison > 1 || Math.random() > 0.66) {
          this.combatManager.addPlayerShipsToCombat(playerId, 1);
        }
      }
    } else {
      let troopsToAdd = playerCombatUnits.troopsInGarrison > 2 ? 2 : playerCombatUnits.troopsInGarrison;

      const projectedCombatStrength = this.combatManager.getPlayerCombatScore({
        ...playerCombatUnits,
        troopsInCombat: playerCombatUnits.troopsInCombat + troopsToAdd,
      });

      if (enemyCombatUnits.some((x) => projectedCombatStrength === this.combatManager.getPlayerCombatScore(x))) {
        if (troopsToAdd === 1 && playerCombatUnits.troopsInGarrison > 1) {
          troopsToAdd++;
        } else {
          troopsToAdd--;
        }
      }
      this.combatManager.addPlayerTroopsToCombat(playerId, troopsToAdd);
    }
  }

  private getInitialAIAgentPlacementInfos() {
    return {
      unitsGainedThisTurn: 0,
      techAgentsGainedThisTurn: 0,
      canEnterCombat: false,
      canDestroyOrDrawCard: false,
      canBuyTech: false,
      canLiftAgent: false,
    };
  }
}
