import { Injectable } from '@angular/core';
import { add, cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { isResource } from '../helpers/resources';
import { CombatManager } from './combat-manager.service';
import { LoggingService } from './log.service';
import { Player, PlayerManager } from './player-manager.service';
import { PlayerScoreManager } from './player-score-manager.service';
import { LocationManager } from './location-manager.service';
import { DuneEventsManager } from './dune-events.service';
import { ActionField, ResourceType, Reward } from '../models';
import { AIManager } from './ai/ai.manager';
import { LeadersService } from './leaders.service';
import { ConflictsService } from './conflicts.service';
import { MinorHousesService } from './minor-houses.service';
import { TechTilesService } from './tech-tiles.service';
import { TechTile } from '../constants/tech-tiles';
import { AudioManager } from './audio-manager.service';

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

  private currentRoundStateSubject = new BehaviorSubject<TurnPhaseType>('none');
  public currentRoundState$ = this.currentRoundStateSubject.asObservable();

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
    private audioManager: AudioManager
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

    const currentRoundStateString = localStorage.getItem('currentTurnState');
    if (currentRoundStateString) {
      const currentRoundState = JSON.parse(currentRoundStateString) as TurnPhaseType;
      this.currentRoundStateSubject.next(currentRoundState);
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

    this.currentRoundState$.subscribe((currentTurnState) => {
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

  public get currentTurn() {
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
    return cloneDeep(this.currentRoundStateSubject.value);
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
    this.currentRoundStateSubject.next('agent-placement');
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
    this.currentRoundStateSubject.next('agent-placement');

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
    this.currentRoundStateSubject.next('none');
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
    let canEnterCombat = false;
    let canDestroyOrDrawCard = false;

    for (let reward of field.rewards) {
      if (!field.hasRewardOptions) {
        const aiInfo = this.addRewardToPlayer(reward);
        unitsGainedThisTurn += aiInfo.unitsGainedThisTurn;
        if (!canDestroyOrDrawCard) {
          canDestroyOrDrawCard = aiInfo.canDestroyOrDrawCard;
        }

        if (reward.type === 'spice' && this.fieldHasAccumulatedSpice(field.title.en)) {
          const accumulatedSpice = this.getAccumulatedSpiceForField(field.title.en);
          this.playerManager.addResourceToPlayer(activePlayer.id, reward.type, accumulatedSpice);
        }
      }
      if (reward.type === 'mentat') {
        this.addAgentToPlayer(activePlayer.id);
      }
      if (reward.type === 'combat') {
        canEnterCombat = true;
      }
    }

    const factionRewards = this.playerScoreManager.addFactionScore(activePlayer.id, field.actionType, 1);

    for (let reward of factionRewards) {
      const aiInfo = this.addRewardToPlayer(reward);
      unitsGainedThisTurn += aiInfo.unitsGainedThisTurn;
      if (!canDestroyOrDrawCard) {
        canDestroyOrDrawCard = aiInfo.canDestroyOrDrawCard;
      }

      if (reward.type === 'combat') {
        canEnterCombat = true;
      }
    }

    if (activePlayer.isAI) {
      const aiPlayer = this.aIManager.getAIPlayer(activePlayer.id);
      if (aiPlayer && activePlayer) {
        if (canDestroyOrDrawCard) {
          const drawOrTrim = this.aIManager.getFieldDrawOrTrimDecision(activePlayer.id, field.title.en);

          if (drawOrTrim === 'draw') {
            this.playerManager.playerDrawsCards(this.activePlayerId, 1);
          } else {
            this.playerManager.addFocusTokens(this.activePlayerId, 1);
          }
        }

        if (field.title.en === 'upgrade') {
          const dreadnoughtOrTech = this.aIManager.getUpgradedreadnoughtOrTechDecision(activePlayer.id);

          if (dreadnoughtOrTech === 'dreadnought') {
            this.combatManager.addPlayerShipsToGarrison(activePlayer.id, 1);
            unitsGainedThisTurn += 1;
          }
          if (dreadnoughtOrTech === 'tech') {
            this.buyTechOrStackTechAgents(activePlayer, 3);
          }
        }
        if (field.title.en === 'expedition') {
          // Techagents are added previously
          this.buyTechOrStackTechAgents(activePlayer, -1);
        }
        if (field.title.en === 'trade rights') {
          // Techagents are added previously
          this.buyTechOrStackTechAgents(activePlayer, -1);
        }

        if (canEnterCombat) {
          const combatDecision = aiPlayer.decisions.find((x) => x.includes('combat'));

          if (combatDecision) {
            if (this.isFinale) {
              this.combatManager.addAllPossibleUnitsToCombat(activePlayer.id, unitsGainedThisTurn);
            } else if (combatDecision.includes('win')) {
              const addUnitsDecision = this.aIManager.getAddAdditionalUnitsToCombatDecision(
                this.combatManager.getPlayerCombatUnits(activePlayer.id),
                this.combatManager.getEnemyCombatUnits(activePlayer.id)
              );

              if (addUnitsDecision === 'all') {
                this.combatManager.addAllPossibleUnitsToCombat(activePlayer.id, unitsGainedThisTurn);
              } else if (addUnitsDecision === 'minimum') {
                this.combatManager.addMinimumUnitsToCombat(activePlayer.id);
              }
            } else if (combatDecision.includes('participate')) {
              this.combatManager.addMinimumUnitsToCombat(activePlayer.id);
            }
          }
        }

        if (field.title.en === 'spice sale') {
          const spiceToCurrencyFunction = (spice: number) => 3 + spice * 2;
          const sellSpiceAmount = this.aIManager.getDesiredSpiceToSell(activePlayer, spiceToCurrencyFunction);
          const currencyFromSpiceSale = spiceToCurrencyFunction(sellSpiceAmount);

          this.playerManager.removeResourceFromPlayer(activePlayer.id, 'spice', sellSpiceAmount);
          this.playerManager.addResourceToPlayer(activePlayer.id, 'currency', currencyFromSpiceSale);
        }
      }
    }

    this.removeAgentFromPlayer(this.activePlayerId);

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
      this.audioManager.playSound('combat');
    }
    this.currentRoundStateSubject.next(turnPhase);
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
      currentTurn: this.currentTurn,
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
    const spiceFieldNames = ['imperial basin', 'hagga basin', 'the great flat'];

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

  private buyTechOrStackTechAgents(player: Player, techDiscount?: number) {
    const discount = techDiscount ?? 0;
    const availableTechTiles = this.techTilesService.availableTechTiles;
    const availablePlayerSpice = player.resources.find((x) => x.type === 'spice')?.amount ?? 0;
    const availablePlayerTechAgents = player.techAgents;
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
        this.buyTechTileForPlayer(player, mostDesiredTechTile, discount);
      } else if (this.isFinale) {
        this.buyTechTileForPlayer(player, affordableTechTiles[0], discount);
      } else {
        this.playerManager.addTechAgentsToPlayer(player.id, discount + 1);
      }
    } else {
      this.playerManager.addTechAgentsToPlayer(player.id, discount + 1);
    }
  }

  private buyTechTileForPlayer(player: Player, techTile: TechTile, discount: number) {
    const availablePlayerTechAgents = player.techAgents;

    const effectiveCosts = techTile.costs - discount;

    if (effectiveCosts > 0) {
      if (availablePlayerTechAgents) {
        this.playerManager.removeTechAgentsFromPlayer(
          player.id,
          effectiveCosts > availablePlayerTechAgents ? availablePlayerTechAgents : effectiveCosts
        );
      }

      if (effectiveCosts > availablePlayerTechAgents) {
        this.playerManager.removeResourceFromPlayer(player.id, 'spice', effectiveCosts - availablePlayerTechAgents);
      }
    }

    this.techTilesService.setPlayerTechTile(player.id, techTile.name.en);
  }

  private isOpeningTurn(playerId: number) {
    if (this.currentTurn === 1) {
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
    const aiInfo = { unitsGainedThisTurn: 0, canDestroyOrDrawCard: false };
    if (isResource(reward)) {
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
    }
    if (reward.type === 'intrigue') {
      this.playerManager.addIntriguesToPlayer(this.activePlayerId, reward.amount ?? 1);
    }
    if (reward.type === 'troop') {
      this.combatManager.addPlayerTroopsToGarrison(this.activePlayerId, reward.amount ?? 1);
      aiInfo.unitsGainedThisTurn += reward.amount ?? 1;
    }
    if (reward.type === 'dreadnought') {
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
      this.playerManager.addCouncilSeatToPlayer(this.activePlayerId);
    }
    if (reward.type === 'sword-master') {
      this.playerManager.addPermanentAgentToPlayer(this.activePlayerId);
      this.addAgentToPlayer(this.activePlayerId);
    }
    if (reward.type === 'mentat') {
      this.addAgentToPlayer(this.activePlayerId);
    }
    if (reward.type === 'victory-point') {
      this.playerScoreManager.addPlayerScore(this.activePlayerId, 'victoryPoints', reward.amount ?? 1);
    }

    return aiInfo;
  }
}
