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
  private currentTurnSubject = new BehaviorSubject<number>(0);
  public currentTurn$ = this.currentTurnSubject.asObservable();

  private currentTurnStateSubject = new BehaviorSubject<TurnPhaseType>('none');
  public currentTurnState$ = this.currentTurnStateSubject.asObservable();

  private startingPlayerIdSubject = new BehaviorSubject<number>(0);
  public startingPlayerId$ = this.startingPlayerIdSubject.asObservable();

  private activeAgentPlacementPlayerIdSubject = new BehaviorSubject<number>(0);
  public activeAgentPlacementPlayerId$ = this.activeAgentPlacementPlayerIdSubject.asObservable();

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
    public playerScoreManager: PlayerScoreManager,
    public playerManager: PlayerManager,
    public combatManager: CombatManager,
    public locationManager: LocationManager,
    public loggingService: LoggingService,
    public duneEventsManager: DuneEventsManager,
    public aIManager: AIManager,
    public leadersService: LeadersService,
    public conflictsService: ConflictsService,
    public minorHousesService: MinorHousesService,
    public techTilesService: TechTilesService
  ) {
    const currentTurnString = localStorage.getItem('currentTurn');
    if (currentTurnString) {
      const currentTurn = JSON.parse(currentTurnString) as number;
      this.currentTurnSubject.next(currentTurn);
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

    const activeAgentPlacementPlayerIdString = localStorage.getItem('activeAgentPlacementPlayerId');
    if (activeAgentPlacementPlayerIdString) {
      const activeAgentPlacementPlayerId = JSON.parse(activeAgentPlacementPlayerIdString) as number;
      this.activeAgentPlacementPlayerIdSubject.next(activeAgentPlacementPlayerId);
    }

    const isFinaleString = localStorage.getItem('isFinale');
    if (isFinaleString) {
      const isFinale = JSON.parse(isFinaleString) as boolean;
      this.isFinaleSubject.next(isFinale);
    }

    this.currentTurn$.subscribe((currentTurn) => {
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

    this.activeAgentPlacementPlayerId$.subscribe((activeAgentPlacementPlayerId) => {
      localStorage.setItem('activeAgentPlacementPlayerId', JSON.stringify(activeAgentPlacementPlayerId));

      this.setCurrentAIPlayer(activeAgentPlacementPlayerId);

      this.setPreferredFieldsForAIPlayer(activeAgentPlacementPlayerId);

      // setTimeout(() => {
      //   if (this.currentTurnState !== 'combat') {
      //     const preferredField = this.aIManager.getPreferredFieldForPlayer(activeAgentPlacementPlayerId);
      //     if (preferredField) {
      //       this.addAgentToField(preferredField);
      //       this.setNextPlayerActive('agent-placement');
      //     }
      //   }
      // }, 250);
    });

    this.isFinale$.subscribe((isFinale) => {
      localStorage.setItem('isFinale', JSON.stringify(isFinale));
    });
  }

  public get currentTurn() {
    return cloneDeep(this.currentTurnSubject.value);
  }

  public get startingPlayerId() {
    return cloneDeep(this.startingPlayerIdSubject.value);
  }

  public get activeAgentPlacementPlayerId() {
    return cloneDeep(this.activeAgentPlacementPlayerIdSubject.value);
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

  public get activePlayer() {
    return cloneDeep(this.playerManager.players.find((x) => x.id === this.activeAgentPlacementPlayerId));
  }

  public get isFinale() {
    return cloneDeep(this.isFinaleSubject.value);
  }

  public startGame() {
    this.loggingService.clearLog();
    this.playerManager.resetPlayers();
    this.combatManager.resetAdditionalCombatPower();
    this.combatManager.deleteAllPlayerTroopsFromCombat();
    this.combatManager.resetAllPlayerShips();
    this.combatManager.setInitialPlayerCombatUnits(this.playerManager.players);
    this.locationManager.resetLocationOwners();
    this.duneEventsManager.shuffleDuneEvents();
    this.playerScoreManager.resetPlayersScores(this.playerManager.players);
    this.playerScoreManager.resetPlayerAlliances();
    this.removePlayerAgentsFromBoard();
    this.resetAccumulatedSpiceOnFields();

    this.aIManager.assignPersonalitiesToAIPlayers(this.playerManager.players);
    this.leadersService.assignLeadersToPlayers(this.playerManager.players);
    this.conflictsService.setInitialConflict();
    this.minorHousesService.setInitialAvailableHouses();
    this.techTilesService.setInitialAvailableTechTiles();

    this.currentTurnSubject.next(1);
    this.currentTurnStateSubject.next('agent-placement');
    this.startingPlayerIdSubject.next(1);
    this.activeAgentPlacementPlayerIdSubject.next(1);
    this.activeCombatPlayerId = 1;
    this.playerManager.allPlayersDrawInitialCards();
  }

  public setNextTurn() {
    this.accumulateSpiceOnFields();
    this.removePlayerAgentsFromBoard();
    this.combatManager.setAllPlayerShipsFromTimeoutToGarrison();
    this.combatManager.setAllPlayerShipsFromCombatToGarrisonOrTimeout();
    this.combatManager.deleteAllPlayerTroopsFromCombat();
    this.combatManager.resetAdditionalCombatPower();
    this.playerManager.resetPersuasionForPlayers();

    this.conflictsService.setNextConflict();

    if (this.shouldTriggerFinale()) {
      this.isFinaleSubject.next(true);
    }

    this.currentTurnSubject.next(this.currentTurnSubject.value + 1);
    this.currentTurnStateSubject.next('agent-placement');

    this.startingPlayerIdSubject.next(
      this.playerManager.players.length > this.startingPlayerId ? this.startingPlayerId + 1 : 1
    );

    this.activeAgentPlacementPlayerIdSubject.next(this.startingPlayerId);
    this.activeCombatPlayerId = this.startingPlayerId;

    this.playerManager.allPlayersDrawInitialCards();
  }

  public finishGame() {
    this.removePlayerAgentsFromBoard();
    this.combatManager.resetAdditionalCombatPower();
    this.loggingService.printLog();
    this.currentTurnSubject.next(0);
    this.currentTurnStateSubject.next('none');
    this.startingPlayerIdSubject.next(0);
    this.activeAgentPlacementPlayerIdSubject.next(0);
    this.activeCombatPlayerId = 0;
    this.duneEventsManager.resetDuneEvents();
    this.leadersService.resetLeaders();
    this.conflictsService.resetConflicts();

    this.isFinaleSubject.next(false);
  }

  private removePlayerAgentsFromBoard() {
    this.agentsOnFieldsSubject.next([]);

    const playerAgents: PlayerAgents[] = [];
    for (let player of this.playerManager.players) {
      playerAgents.push({ playerId: player.id, agentAmount: player.agents });
    }

    this.availablePlayerAgentsSubject.next(playerAgents);
  }

  public addAgentToField(field: ActionField) {
    if (this.currentTurnState !== 'agent-placement' || !this.activePlayer) {
      return;
    }

    if (field.rewards.some((x) => x.type === 'sword-master') && this.activePlayer.hasSwordmaster) {
      return;
    }

    if (
      field.rewards.some((x) => x.type === 'council-seat-small' || x.type === 'council-seat-large') &&
      this.activePlayer.hasCouncilSeat
    ) {
      return;
    }

    if (field.costs) {
      if (!this.playerCanPayCosts(this.activeAgentPlacementPlayerId, field.costs)) {
        return;
      }

      for (let cost of field.costs) {
        if (isResource(cost)) {
          this.playerManager.removeResourceFromPlayer(this.activeAgentPlacementPlayerId, cost.type, cost.amount ?? 1);
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
        canDestroyOrDrawCard = aiInfo.canDestroyOrDrawCard;

        if (reward.type === 'spice' && this.fieldHasAccumulatedSpice(field.title.en)) {
          const accumulatedSpice = this.getAccumulatedSpiceForField(field.title.en);
          this.playerManager.addResourceToPlayer(this.activeAgentPlacementPlayerId, reward.type, accumulatedSpice);
        }
      }
      if (reward.type === 'mentat') {
        this.addAgentToPlayer(this.activeAgentPlacementPlayerId);
      }
      if (reward.type === 'combat') {
        canEnterCombat = true;
      }
    }

    const factionRewards = this.playerScoreManager.addFactionScore(this.activeAgentPlacementPlayerId, field.actionType, 1);

    for (let reward of factionRewards) {
      const aiInfo = this.addRewardToPlayer(reward);
      unitsGainedThisTurn += aiInfo.unitsGainedThisTurn;
      canDestroyOrDrawCard = aiInfo.canDestroyOrDrawCard;

      if (reward.type === 'combat') {
        canEnterCombat = true;
      }
    }

    if (this.activePlayer.isAI) {
      const aiPlayer = this.aIManager.getAIPlayer(this.activePlayer.id);
      if (aiPlayer && this.activePlayer) {
        if (canDestroyOrDrawCard) {
          const drawOrTrim = this.aIManager.getFieldDrawOrTrimDecision(this.activePlayer.id, field.title.en);

          if (drawOrTrim === 'draw') {
            this.playerManager.playerDrawsCards(this.activeAgentPlacementPlayerId, 1);
          } else {
            this.playerManager.addFocusTokens(this.activeAgentPlacementPlayerId, 1);
          }
        }

        if (field.title.en === 'upgrade') {
          const warshipOrTech = this.aIManager.getUpgradeWarshipOrTechDecision(this.activePlayer.id);

          if (warshipOrTech === 'warship') {
            this.combatManager.addPlayerShipsToGarrison(this.activePlayer.id, 1);
            unitsGainedThisTurn += 1;
          }
          if (warshipOrTech === 'tech') {
            this.buyTechOrStackTechAgents(this.activePlayer, 3);
          }
        }
        if (field.title.en === 'expedition') {
          // Techagents are added previously
          this.buyTechOrStackTechAgents(this.activePlayer, -1);
        }
        if (field.title.en === 'trade rights') {
          // Techagents are added previously
          this.buyTechOrStackTechAgents(this.activePlayer, -1);
        }

        if (canEnterCombat) {
          const combatDecision = aiPlayer.decisions.find((x) => x.includes('combat'));

          if (combatDecision) {
            if (this.isFinale) {
              this.combatManager.addAllPossibleUnitsToCombat(this.activePlayer.id, unitsGainedThisTurn);
            } else if (combatDecision.includes('win')) {
              const addUnitsDecision = this.aIManager.getAddAdditionalUnitsToCombatDecision(
                this.combatManager.getPlayerCombatUnits(this.activePlayer.id),
                this.combatManager.getEnemyCombatUnits(this.activePlayer.id)
              );

              if (addUnitsDecision === 'all') {
                this.combatManager.addAllPossibleUnitsToCombat(this.activePlayer.id, unitsGainedThisTurn);
              } else if (addUnitsDecision === 'minimum') {
                this.combatManager.addMinimumUnitsToCombat(this.activePlayer.id);
              }
            } else if (combatDecision.includes('participate')) {
              this.combatManager.addMinimumUnitsToCombat(this.activePlayer.id);
            }
          }
        }

        if (field.title.en === 'spice sale') {
          const spiceToCurrencyFunction = (spice: number) => 3 + spice * 2;
          const sellSpiceAmount = this.aIManager.getDesiredSpiceToSell(this.activePlayer, spiceToCurrencyFunction);
          const currencyFromSpiceSale = spiceToCurrencyFunction(sellSpiceAmount);

          this.playerManager.removeResourceFromPlayer(this.activePlayer.id, 'spice', sellSpiceAmount);
          this.playerManager.addResourceToPlayer(this.activePlayer.id, 'currency', currencyFromSpiceSale);
        }
      }
    }

    this.removeAgentFromPlayer(this.activeAgentPlacementPlayerId);

    this.loggingService.logAgentAction(field);
  }

  public getAgentOnField(fieldId: string) {
    return this.agentsOnFieldsSubject.value.find((x) => x.fieldId === fieldId);
  }

  private setPlayerOnField(fieldId: string) {
    this.agentsOnFieldsSubject.next([
      ...this.agentsOnFieldsSubject.value,
      { playerId: this.activeAgentPlacementPlayerId, fieldId },
    ]);
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
      const playerWithHigherId = this.availablePlayerAgents.find((x) => x.playerId > this.activeAgentPlacementPlayerId);
      if (playerWithHigherId) {
        this.activeAgentPlacementPlayerIdSubject.next(playerWithHigherId.playerId);
      } else {
        const firstPlayer = this.availablePlayerAgents[0];
        this.activeAgentPlacementPlayerIdSubject.next(firstPlayer.playerId);
      }
    }
    if (turnPhase === 'combat') {
      const nextPlayerId = this.playerManager.getNextPlayerId(this.activeCombatPlayerId);
      this.activeCombatPlayerId = nextPlayerId;
    }
  }

  public setTurnState(turnPhase: TurnPhaseType) {
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
      enemyPlayers: this.playerManager.players.filter((x) => x.id !== player.id),
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
    const player = this.playerManager.players.find((x) => x.id === id);
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
        (a, b) => b.aiEvaluation(player, gameState) - a.aiEvaluation(this.activePlayer!, gameState)
      )[0];

      const desire = mostDesiredTechTile.aiEvaluation(player, gameState);
      const effectiveCosts = mostDesiredTechTile.costs - discount - availablePlayerTechAgents;

      if (
        affordableTechTiles.some((x) => x.name.en === mostDesiredTechTile.name.en) &&
        (desire > 0.25 || effectiveCosts < 1)
      ) {
        this.buyTechTileForPlayer(player, mostDesiredTechTile, discount);
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
      this.playerManager.addResourceToPlayer(this.activeAgentPlacementPlayerId, reward.type, reward.amount ?? 1);
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
      this.playerManager.addTechAgentsToPlayer(this.activeAgentPlacementPlayerId, agents);
    }
    if (reward.type === 'intrigue') {
      this.playerManager.addIntriguesToPlayer(this.activeAgentPlacementPlayerId, reward.amount ?? 1);
    }
    if (reward.type === 'troop') {
      this.combatManager.addPlayerTroopsToGarrison(this.activeAgentPlacementPlayerId, reward.amount ?? 1);
      aiInfo.unitsGainedThisTurn += reward.amount ?? 1;
    }
    if (reward.type === 'card-draw') {
      this.playerManager.playerDrawsCards(this.activeAgentPlacementPlayerId, reward.amount ?? 1);
    }
    if (reward.type === 'card-destroy') {
      this.playerManager.addFocusTokens(this.activeAgentPlacementPlayerId, reward.amount ?? 1);
    }
    if (reward.type == 'card-draw-or-destroy') {
      aiInfo.canDestroyOrDrawCard = true;
    }
    if (reward.type == 'persuasion') {
      this.playerManager.addPersuasionToPlayer(this.activeAgentPlacementPlayerId, reward.amount ?? 1);
    }
    if (reward.type === 'council-seat-small' || reward.type === 'council-seat-large') {
      this.playerManager.addCouncilSeatToPlayer(this.activeAgentPlacementPlayerId);
    }
    if (reward.type === 'sword-master') {
      this.playerManager.addPermanentAgentToPlayer(this.activeAgentPlacementPlayerId);
      this.addAgentToPlayer(this.activeAgentPlacementPlayerId);
    }
    if (reward.type === 'mentat') {
      this.addAgentToPlayer(this.activeAgentPlacementPlayerId);
    }
    if (reward.type === 'victory-point') {
      this.playerScoreManager.addPlayerScore(this.activeAgentPlacementPlayerId, 'victoryPoints', reward.amount ?? 1);
    }

    return aiInfo;
  }
}
