import { Injectable } from '@angular/core';
import { add, cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { isResource } from '../helpers/resources';
import { CombatManager, PlayerCombatUnits } from './combat-manager.service';
import { LoggingService } from './log.service';
import { Player, PlayerManager } from './player-manager.service';
import { PlayerScoreManager } from './player-score-manager.service';
import { LocationManager } from './location-manager.service';
import { DuneEventsManager } from './dune-events.service';
import { ActionField, ResourceType, Reward, RewardType } from '../models';
import { AIManager } from './ai/ai.manager';
import { LeadersService } from './leaders.service';
import { ConflictsService } from './conflicts.service';
import { MinorHousesService } from './minor-houses.service';
import { TechTilesService } from './tech-tiles.service';
import { TechTile } from '../constants/tech-tiles';
import { AudioManager } from './audio-manager.service';
import { SettingsService } from './settings.service';
import { shuffle } from '../helpers/common';

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
    private settingsService: SettingsService
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

      this.setCurrentAIPlayer(activePlayerId);

      this.setPreferredFieldsForAIPlayer(activePlayerId);

      if (this.autoPlayAI) {
        const activePlayerAgentCount = this.getAvailableAgentCountForPlayer(activePlayerId);

        if (activePlayerAgentCount > 0) {
          setTimeout(() => {
            const preferredField = this.aIManager.getPreferredFieldForPlayer(activePlayerId);
            if (preferredField) {
              this.addAgentToField(preferredField);
              this.setNextPlayerActive('agent-placement');
            }
          }, 1000);
        }
      }
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
    this.playerManager.allPlayersDrawInitialCards();
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

    this.playerManager.allPlayersDrawInitialCards();
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

    if (this.currentTurnState !== 'agent-placement' || !activePlayer) {
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

    let unitsGainedThisTurn = 0;
    let techAgentsGainedThisTurn = 0;
    let canEnterCombat = false;
    let canDestroyOrDrawCard = false;
    let canBuyTech = false;
    let canLiftAgent = false;
    const fieldOptions: Reward[] = [];
    const rewardOptionIndex = field.rewards.findIndex((x) => x.type === 'separator' || x.type === 'separator-horizontal');
    const fieldHasRewardOptions = rewardOptionIndex > -1;

    if (!field.tradeOptionField) {
      for (const [index, reward] of field.rewards.entries()) {
        const isRewardOption = fieldHasRewardOptions && (index === rewardOptionIndex - 1 || index === rewardOptionIndex + 1);

        if (!isRewardOption) {
          const aiInfo = this.addRewardToPlayer(reward);
          unitsGainedThisTurn += aiInfo.unitsGainedThisTurn;
          techAgentsGainedThisTurn += aiInfo.techAgentsGainedThisTurn;
          canDestroyOrDrawCard = canDestroyOrDrawCard || aiInfo.canDestroyOrDrawCard;
          canBuyTech = canBuyTech || aiInfo.canBuyTech;

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
          canLiftAgent = true;
        }
        if (reward.type === 'combat') {
          this.audioManager.playSound('combat');
          canEnterCombat = true;
        }
      }

      const factionRewards = this.playerScoreManager.addFactionScore(activePlayer.id, field.actionType, 1);

      for (const reward of factionRewards) {
        const aiInfo = this.addRewardToPlayer(reward);
        unitsGainedThisTurn += aiInfo.unitsGainedThisTurn;
        techAgentsGainedThisTurn += aiInfo.techAgentsGainedThisTurn;
        canDestroyOrDrawCard = canDestroyOrDrawCard || aiInfo.canDestroyOrDrawCard;
        canBuyTech = canBuyTech || aiInfo.canBuyTech;

        if (reward.type === 'combat') {
          canEnterCombat = true;
        }
      }
    }

    if (activePlayer.isAI) {
      const aiPlayer = this.aIManager.getAIPlayer(activePlayer.id);

      if (activePlayer && aiPlayer) {
        if (canDestroyOrDrawCard) {
          const drawOrDestroy = this.aIManager.getFieldDrawOrDestroyDecision(activePlayer.id, field.title.en);

          if (drawOrDestroy === 'draw') {
            this.playerManager.playerDrawsCards(activePlayer.id, 1);
          } else {
            this.playerManager.addFocusTokens(activePlayer.id, 1);
          }
        }
        if (fieldHasRewardOptions) {
          const aiDecision = this.aIManager.getFieldDecision(activePlayer.id, field.title.en);
          const reward = field.rewards.find((x) => x.type.includes(aiDecision));

          if (reward) {
            const aiInfo = this.addRewardToPlayer(reward);
            unitsGainedThisTurn += aiInfo.unitsGainedThisTurn;
            techAgentsGainedThisTurn += aiInfo.techAgentsGainedThisTurn;
            canDestroyOrDrawCard = canDestroyOrDrawCard || aiInfo.canDestroyOrDrawCard;
            canBuyTech = canBuyTech || aiInfo.canBuyTech;
            if (!canBuyTech) {
              canBuyTech = aiInfo.canBuyTech;
            }
          }
        }

        if (canBuyTech) {
          this.buyTechOrStackTechAgents(activePlayer, -1, techAgentsGainedThisTurn);
        }

        if (canLiftAgent) {
          const playerAgentsOnFields = this.agentsOnFields.filter((x) => x.playerId === activePlayer.id);
          if (playerAgentsOnFields) {
            shuffle(playerAgentsOnFields);
            this.removePlayerAgentFromField(activePlayer.id, playerAgentsOnFields[0].fieldId);
          }
        }

        if (canEnterCombat) {
          const playerCombatUnits = this.combatManager.getPlayerCombatUnits(activePlayer.id);
          const enemyCombatUnits = this.combatManager.getEnemyCombatUnits(activePlayer.id);
          const playerHasAgentsLeft =
            (this.availablePlayerAgents.find((x) => x.playerId === activePlayer.id)?.agentAmount ?? 0) > 1;

          const combatDecision = aiPlayer.decisions.find((x) => x.includes('conflict'));

          if (combatDecision) {
            if (this.isFinale) {
              this.combatManager.addAllPossibleUnitsToCombat(activePlayer.id, unitsGainedThisTurn);
            } else if (combatDecision.includes('win')) {
              if (playerCombatUnits && enemyCombatUnits) {
                const addUnitsDecision = this.aIManager.getAddAdditionalUnitsToCombatDecision(
                  playerCombatUnits,
                  enemyCombatUnits,
                  unitsGainedThisTurn + 2,
                  playerHasAgentsLeft,
                  activePlayer.intrigueCount > 2
                );

                if (addUnitsDecision === 'all') {
                  this.combatManager.addAllPossibleUnitsToCombat(activePlayer.id, unitsGainedThisTurn);
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
      const playerWithHigherId = this.availablePlayerAgents.find((x) => x.playerId > this.activePlayerId);
      if (playerWithHigherId) {
        this.activePlayerIdSubject.next(playerWithHigherId.playerId);
      } else {
        const firstPlayer = this.availablePlayerAgents[0];
        this.activePlayerIdSubject.next(firstPlayer.playerId);
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

  private getGameState(player: Player) {
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
      isOpeningTurn: this.isOpeningTurn(player.id),
      isFinale: this.isFinale,
      enemyPlayers: this.playerManager.getEnemyPlayers(player.id),
      playerLeader: this.leadersService.getLeader(player.id)!,
      conflict: this.conflictsService.currentConflict,
      availableTechTiles: this.techTilesService.availableTechTiles,
      currentEvent: this.duneEventsManager.gameEvents[this.currentRound - 1],
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

  private addRewardToPlayer(reward: Reward) {
    const aiInfo = { unitsGainedThisTurn: 0, techAgentsGainedThisTurn: 0, canDestroyOrDrawCard: false, canBuyTech: false };
    if (isResource(reward)) {
      if (reward.type === 'solari') {
        this.audioManager.playSound('solari', reward.amount);
      } else if (reward.type === 'water') {
        this.audioManager.playSound('water', reward.amount);
      } else if (reward.type === 'spice') {
        this.audioManager.playSound('spice', reward.amount);
      }

      this.playerManager.addResourceToPlayer(this.activePlayerId, reward.type, reward.amount ?? 1);
    }
    if (
      reward.type === 'tech' ||
      reward.type === 'tech-reduced' ||
      reward.type === 'tech-reduced-two' ||
      reward.type === 'tech-reduced-three'
    ) {
      const agents =
        reward.type === 'tech'
          ? 1
          : reward.type === 'tech-reduced'
          ? 2
          : reward.type === 'tech-reduced-two'
          ? 3
          : reward.type === 'tech-reduced-three'
          ? 4
          : 0;
      this.playerManager.addTechAgentsToPlayer(this.activePlayerId, agents);
      aiInfo.canBuyTech = true;
      aiInfo.techAgentsGainedThisTurn += agents;
    }
    if (reward.type === 'intrigue') {
      this.audioManager.playSound('intrigue', reward.amount);
      this.playerManager.addIntriguesToPlayer(this.activePlayerId, reward.amount ?? 1);
    }
    if (reward.type === 'troop') {
      this.audioManager.playSound('troops', reward.amount);
      this.combatManager.addPlayerTroopsToGarrison(this.activePlayerId, reward.amount ?? 1);
      aiInfo.unitsGainedThisTurn += reward.amount ?? 1;
    }
    if (reward.type === 'dreadnought') {
      this.audioManager.playSound('dreadnought');
      this.combatManager.addPlayerShipsToGarrison(this.activePlayerId, 1);
      aiInfo.unitsGainedThisTurn += reward.amount ?? 1;
    }
    if (reward.type === 'card-draw') {
      this.playerManager.playerDrawsCards(this.activePlayerId, reward.amount ?? 1);
    }
    if (reward.type === 'card-destroy') {
      this.playerManager.addFocusTokens(this.activePlayerId, reward.amount ?? 1);
    }
    if (reward.type == 'card-draw-or-destroy') {
      aiInfo.canDestroyOrDrawCard = true;
    }
    if (reward.type == 'persuasion') {
      this.playerManager.addPersuasionToPlayer(this.activePlayerId, reward.amount ?? 1);
    }
    if (reward.type === 'council-seat-small' || reward.type === 'council-seat-large') {
      this.audioManager.playSound('high-council');
      this.playerManager.addCouncilSeatToPlayer(this.activePlayerId);
    }
    if (reward.type === 'sword-master') {
      this.audioManager.playSound('swordmaster');
      this.playerManager.addPermanentAgentToPlayer(this.activePlayerId);
      this.addAgentToPlayer(this.activePlayerId);
    }
    if (reward.type === 'mentat') {
      this.addAgentToPlayer(this.activePlayerId);
    }
    if (reward.type === 'victory-point') {
      this.audioManager.playSound('victory-point');
      this.playerScoreManager.addPlayerScore(this.activePlayerId, 'victoryPoints', reward.amount ?? 1);
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
}
