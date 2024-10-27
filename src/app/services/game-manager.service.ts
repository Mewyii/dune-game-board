import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { isResource, isResourceType } from '../helpers/resources';
import { CombatManager, PlayerCombatUnits } from './combat-manager.service';
import { LoggingService } from './log.service';
import { Player, PlayersService } from './players.service';
import { PlayerFactionScoreType, PlayerScore, PlayerScoreManager } from './player-score-manager.service';
import { LocationManager } from './location-manager.service';
import { DuneEventsManager } from './dune-events.service';
import { ActionField, Reward, RewardType } from '../models';
import { AIAgentPlacementInfo, AIManager } from './ai/ai.manager';
import { LeadersService } from './leaders.service';
import { ConflictsService } from './conflicts.service';
import { MinorHousesService } from './minor-houses.service';
import { TechTileCard, TechTilesService } from './tech-tiles.service';
import { AudioManager } from './audio-manager.service';
import { SettingsService } from './settings.service';
import { shuffle } from '../helpers/common';
import { GameState } from './ai/models';
import { CardsService, ImperiumDeckCard } from './cards.service';
import { isFactionScoreRewardType } from '../helpers/rewards';
import { getFactionScoreTypeFromReward, isFactionScoreType } from '../helpers/faction-score';
import { getPlayerdreadnoughtCount } from '../helpers/combat-units';
import { Leader } from '../constants/leaders';
import { LeaderImageOnly } from '../constants/leaders-old';
import { GameModifiersService } from './game-modifier.service';
import { getCardCostModifier, getFactionInfluenceModifier, hasFactionInfluenceModifier } from '../helpers/game-modifiers';
import { isFactionType } from '../helpers/faction-types';
import { PlayerRewardChoicesService } from './player-reward-choices.service';
import { TranslateService } from './translate-service';
import { IntriguesService } from './intrigues.service';

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

export type TurnPhaseType = 'none' | 'agent-placement' | 'combat' | 'combat-resolvement' | 'done';

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
    private intriguesService: IntriguesService
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
    this.duneEventsManager.setGameEvents();
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
          let combatAiInfo = this.getInitialAIAgentPlacementInfos();
          for (const reward of conflictReward) {
            const aiInfo = this.addRewardToPlayer(playerScore.playerId, reward);
            combatAiInfo = this.updateAiAgentPlacementInfo(combatAiInfo, aiInfo);
          }

          const player = this.playerManager.getPlayer(playerScore.playerId);
          if (player && player.isAI) {
            this.aiResolveRewardChoices(combatAiInfo, player);
          }

          playerCombatScores = playerCombatScores.filter((x) => x.playerId !== playerScore.playerId);
        }

        previousWasTie = false;
      } else if (!isTie) {
        let combatAiInfo = this.getInitialAIAgentPlacementInfos();
        for (const reward of conflictReward) {
          const aiInfo = this.addRewardToPlayer(firstPlayer.playerId, reward);
          combatAiInfo = this.updateAiAgentPlacementInfo(combatAiInfo, aiInfo);
        }

        const player = this.playerManager.getPlayer(firstPlayer.playerId);
        if (player && player.isAI) {
          this.aiResolveRewardChoices(combatAiInfo, player);

          if (isFirstCycle) {
            const dreadnoughtCount = this.combatManager.getPlayerCombatUnits(player.id)?.shipsInCombat;
            if (dreadnoughtCount && dreadnoughtCount > 0) {
              this.aiControlLocations(player, dreadnoughtCount);
            }
          }
        }

        playerCombatScores = playerCombatScores.filter((x) => x.playerId !== firstPlayer.playerId);
      } else {
        previousWasTie = true;
      }
      isFirstCycle = false;
    }

    this.currentTurnStateSubject.next('combat-resolvement');
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
    this.currentTurnStateSubject.next('none');
    this.startingPlayerIdSubject.next(0);
    this.activePlayerIdSubject.next(0);
    this.activeCombatPlayerId = 0;
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
        this.addRewardToPlayer(playerId, location.ownerReward);
      }
    }

    const playerHand = this.cardsService.getPlayerHand(playerId);
    if (playerHand) {
      let revealAiInfo = this.getInitialAIAgentPlacementInfos();
      const gameState = this.getGameState(player);

      for (const card of playerHand.cards) {
        if (card.revealEffects) {
          const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } =
            this.aIManager.getRewardArrayAIInfos(card.revealEffects);

          if (!hasRewardOptions && !hasRewardConversion) {
            for (const reward of card.revealEffects) {
              const aiInfo = this.addRewardToPlayer(playerId, reward, card);
              revealAiInfo = this.updateAiAgentPlacementInfo(revealAiInfo, aiInfo);
            }
          } else if (player.isAI && hasRewardOptions) {
            const leftSideRewards = card.revealEffects.slice(0, rewardOptionIndex);
            const rightSideRewards = card.revealEffects.slice(rewardOptionIndex + 1);
            const leftSideEvaluation = this.aIManager.getRewardArrayEvaluation(leftSideRewards, player, gameState);
            const rightSideEvaluation = this.aIManager.getRewardArrayEvaluation(rightSideRewards, player, gameState);

            if (leftSideEvaluation >= rightSideEvaluation) {
              for (const reward of leftSideRewards) {
                const aiInfo = this.addRewardToPlayer(playerId, reward, card);
                revealAiInfo = this.updateAiAgentPlacementInfo(revealAiInfo, aiInfo);
              }
            } else {
              for (const reward of rightSideRewards) {
                const aiInfo = this.addRewardToPlayer(playerId, reward, card);
                revealAiInfo = this.updateAiAgentPlacementInfo(revealAiInfo, aiInfo);
              }
            }
          } else if (player.isAI && hasRewardConversion) {
            const costs = card.revealEffects.slice(0, rewardConversionIndex);
            const rewards = card.revealEffects.slice(rewardConversionIndex + 1);
            if (this.playerCanPayCosts(playerId, costs)) {
              for (const cost of costs) {
                const aiInfo = this.payCostForPlayer(playerId, cost);
                revealAiInfo = this.updateAiAgentPlacementInfo(revealAiInfo, aiInfo);
              }
              for (const reward of rewards) {
                const aiInfo = this.addRewardToPlayer(playerId, reward, card);
                revealAiInfo = this.updateAiAgentPlacementInfo(revealAiInfo, aiInfo);
              }
            }
          }
        }
        if (card.customRevealEffect) {
          const localizedString = this.translateService.translate(card.customRevealEffect);
          const { rewards, restString } = this.getExtractedRewardsFromCustomAgentEffect(localizedString);
          for (const reward of rewards) {
            const aiInfo = this.addRewardToPlayer(playerId, reward);
            revealAiInfo = this.updateAiAgentPlacementInfo(revealAiInfo, aiInfo);
          }

          if (restString && player.isAI) {
            this.playerRewardChoicesService.addPlayerCustomChoice(playerId, restString);
          }
        }
      }

      if (player.isAI) {
        this.aiResolveRewardChoices(revealAiInfo, player);
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

    const gameModifiers = this.gameModifiersService.getPlayerGameModifiers(activePlayer.id);

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

    this.setPlayerOnField(activePlayer.id, field);

    let aiAgentPlacementInfos = this.getInitialAIAgentPlacementInfos();

    const fieldOptions: Reward[] = [];
    const { rewardOptionIndex, hasRewardOptions } = this.aIManager.getRewardArrayAIInfos(field.rewards);

    if (!field.tradeOptionField) {
      for (const [index, reward] of field.rewards.entries()) {
        const isRewardOption = hasRewardOptions && (index === rewardOptionIndex - 1 || index === rewardOptionIndex + 1);

        if (!isRewardOption) {
          const aiInfo = this.addRewardToPlayer(activePlayer.id, reward);
          aiAgentPlacementInfos = this.updateAiAgentPlacementInfo(aiAgentPlacementInfos, aiInfo);

          if (reward.type === 'spice-accumulation' && this.fieldHasAccumulatedSpice(field.title.en)) {
            const accumulatedSpice = this.getAccumulatedSpiceForField(field.title.en);
            this.audioManager.playSound('spice', accumulatedSpice);
            this.playerManager.addResourceToPlayer(activePlayer.id, 'spice', accumulatedSpice);
          }
        } else {
          fieldOptions.push(reward);
        }
        if (reward.type === 'combat') {
          this.audioManager.playSound('combat');
          aiAgentPlacementInfos.canEnterCombat = true;
        }
      }

      if (isFactionType(field.actionType)) {
        if (hasFactionInfluenceModifier(gameModifiers, field.actionType)) {
          const factionInfluenceModifier = getFactionInfluenceModifier(gameModifiers, field.actionType);
          if (factionInfluenceModifier) {
            if (factionInfluenceModifier.noInfluence) {
              if (factionInfluenceModifier.alternateReward) {
                const aiInfo = this.addRewardToPlayer(activePlayer.id, factionInfluenceModifier.alternateReward);
                aiAgentPlacementInfos = this.updateAiAgentPlacementInfo(aiAgentPlacementInfos, aiInfo);
              }
            }
          }
        } else {
          const factionRewards = this.playerScoreManager.addFactionScore(activePlayer.id, field.actionType, 1);

          for (const reward of factionRewards) {
            const aiInfo = this.addRewardToPlayer(activePlayer.id, reward);
            aiAgentPlacementInfos = this.updateAiAgentPlacementInfo(aiAgentPlacementInfos, aiInfo);

            if (reward.type === 'combat') {
              aiAgentPlacementInfos.canEnterCombat = true;
            }
          }
        }
      }
    }

    const playedCardsAiInfo = this.addPlayedCardRewards(activePlayer.id, activePlayer.isAI);
    aiAgentPlacementInfos = this.updateAiAgentPlacementInfo(aiAgentPlacementInfos, playedCardsAiInfo);

    if (activePlayer.isAI) {
      const aiPlayer = this.aIManager.getAIPlayer(activePlayer.id);

      if (activePlayer && aiPlayer) {
        if (aiAgentPlacementInfos.canDestroyOrDrawCard) {
          const drawOrDestroy = this.aIManager.getFieldDrawOrDestroyDecision(activePlayer.id, field.title.en);

          if (drawOrDestroy === 'draw') {
            this.audioManager.playSound('card-draw');
            this.cardsService.drawPlayerCardsFromDeck(activePlayer.id, 1);
          } else {
            this.playerManager.addFocusTokens(activePlayer.id, 1);
          }
        }
        if (hasRewardOptions) {
          const aiDecision = this.aIManager.getFieldDecision(activePlayer.id, field.title.en);
          const reward = field.rewards.find((x) => x.type.includes(aiDecision));

          if (reward) {
            const aiInfo = this.addRewardToPlayer(activePlayer.id, reward);
            aiAgentPlacementInfos = this.updateAiAgentPlacementInfo(aiAgentPlacementInfos, aiInfo);
          }
        }
        this.aiResolveRewardChoices(aiAgentPlacementInfos, activePlayer);

        if (aiAgentPlacementInfos.canLiftAgent) {
          const playerAgentsOnOtherFields = this.agentsOnFields.filter(
            (x) => x.playerId === activePlayer.id && x.fieldId !== field.title.en
          );
          if (playerAgentsOnOtherFields.length > 0) {
            shuffle(playerAgentsOnOtherFields);
            this.removePlayerAgentFromField(activePlayer.id, playerAgentsOnOtherFields[0].fieldId);
          }
        }

        if (aiAgentPlacementInfos.canEnterCombat) {
          const playerCombatUnits = this.combatManager.getPlayerCombatUnits(activePlayer.id);
          const enemyCombatUnits = this.combatManager.getEnemyCombatUnits(activePlayer.id);
          const playerIntrigueCount = this.intriguesService.getPlayerIntrigueCount(activePlayer.id);
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
                  playerIntrigueCount > 2
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
      factionInfluenceUpChoiceAmount:
        aiAgentPlacementInfo.factionInfluenceUpChoiceAmount + aiInfo.factionInfluenceUpChoiceAmount,
      factionInfluenceUpChoiceTwiceAmount:
        aiAgentPlacementInfo.factionInfluenceUpChoiceTwiceAmount + aiInfo.factionInfluenceUpChoiceTwiceAmount,
      shippingAmount: aiAgentPlacementInfo.shippingAmount + aiInfo.shippingAmount,
      factionInfluenceDownChoiceAmount:
        aiAgentPlacementInfo.factionInfluenceDownChoiceAmount + aiInfo.factionInfluenceDownChoiceAmount,
      locationControlAmount: aiAgentPlacementInfo.locationControlAmount + aiInfo.locationControlAmount,
      signetRingAmount: aiAgentPlacementInfo.signetRingAmount + aiInfo.signetRingAmount,
    };
  }

  addPlayedCardRewards(playerId: number, isAI?: boolean): AIAgentPlacementInfo {
    let agentEffectsAIInfo = this.getInitialAIAgentPlacementInfos();

    const playerCard = this.cardsService.getPlayedPlayerCard(playerId);
    if (playerCard) {
      const card = this.cardsService.getPlayerHandCard(playerId, playerCard.cardId);
      if (card) {
        if (card.agentEffects) {
          const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } =
            this.aIManager.getRewardArrayAIInfos(card.agentEffects);
          if (!hasRewardOptions && !hasRewardConversion) {
            for (const agentEffect of card.agentEffects) {
              const aiInfo = this.addRewardToPlayer(playerId, agentEffect, card);
              agentEffectsAIInfo = this.updateAiAgentPlacementInfo(agentEffectsAIInfo, aiInfo);
            }
          } else if (isAI && hasRewardOptions) {
            const player = this.playerManager.getPlayer(playerId);
            if (!player) {
              return agentEffectsAIInfo;
            }

            const gameState = this.getGameState(player);

            const leftSideRewards = card.agentEffects.slice(0, rewardOptionIndex);
            const rightSideRewards = card.agentEffects.slice(rewardOptionIndex + 1);
            const leftSideEvaluation = this.aIManager.getRewardArrayEvaluation(leftSideRewards, player, gameState);
            const rightSideEvaluation = this.aIManager.getRewardArrayEvaluation(rightSideRewards, player, gameState);

            if (leftSideEvaluation >= rightSideEvaluation) {
              for (const reward of leftSideRewards) {
                const aiInfo = this.addRewardToPlayer(playerId, reward, card);
                agentEffectsAIInfo = this.updateAiAgentPlacementInfo(agentEffectsAIInfo, aiInfo);
              }
            } else {
              for (const reward of rightSideRewards) {
                const aiInfo = this.addRewardToPlayer(playerId, reward, card);
                agentEffectsAIInfo = this.updateAiAgentPlacementInfo(agentEffectsAIInfo, aiInfo);
              }
            }
          } else if (isAI && hasRewardConversion) {
            const costs = card.agentEffects.slice(0, rewardConversionIndex);
            const rewards = card.agentEffects.slice(rewardConversionIndex + 1);
            if (this.playerCanPayCosts(playerId, costs)) {
              for (const cost of costs) {
                const aiInfo = this.payCostForPlayer(playerId, cost);
                agentEffectsAIInfo = this.updateAiAgentPlacementInfo(agentEffectsAIInfo, aiInfo);
              }
              for (const reward of rewards) {
                const aiInfo = this.addRewardToPlayer(playerId, reward, card);
                agentEffectsAIInfo = this.updateAiAgentPlacementInfo(agentEffectsAIInfo, aiInfo);
              }
            }
          }
        }
        if (card.customAgentEffect) {
          const localizedString = this.translateService.translate(card.customAgentEffect);
          const { rewards, restString } = this.getExtractedRewardsFromCustomAgentEffect(localizedString);
          for (const reward of rewards) {
            const aiInfo = this.addRewardToPlayer(playerId, reward);
            agentEffectsAIInfo = this.updateAiAgentPlacementInfo(agentEffectsAIInfo, aiInfo);
          }

          if (restString && isAI) {
            this.playerRewardChoicesService.addPlayerCustomChoice(playerId, restString);
          }
        }
      }
    }
    return agentEffectsAIInfo;
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

  public setNextPlayerActive(turnPhase: TurnPhaseType) {
    if (turnPhase === 'agent-placement') {
      this.cardsService.discardPlayedPlayerCard(this.activePlayerId);

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
    if (turnPhase === 'combat') {
      const nextPlayerId = this.playerManager.getNextPlayerId(this.activeCombatPlayerId);
      this.activeCombatPlayerId = nextPlayerId;
    }
  }

  public setRoundState(turnPhase: TurnPhaseType) {
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

  public changeLocationOwner(locationId: string, playerId?: number) {
    const playerLocation = this.locationManager.getPlayerLocation(locationId);
    if (playerLocation) {
      if (playerId) {
        if (playerLocation.playerId !== playerId) {
          this.locationManager.setLocationOwner(locationId, playerId);
          this.payCostForPlayer(playerLocation.playerId, { type: 'victory-point' });
          this.addRewardToPlayer(playerId, { type: 'victory-point' });
        } else {
          this.locationManager.setLocationOwner(locationId, playerId);
          this.addRewardToPlayer(playerId, { type: 'victory-point' });
        }
      } else {
        this.locationManager.resetLocationOwner(locationId);
        this.payCostForPlayer(playerLocation.playerId, { type: 'victory-point' });
      }
    } else {
      if (playerId) {
        this.locationManager.setLocationOwner(locationId, playerId);
        this.addRewardToPlayer(playerId, { type: 'victory-point' });
      }
    }
  }

  public doAIAction(playerId: number) {
    const player = this.playerManager.getPlayer(playerId);
    const playerAgentCount = this.getAvailableAgentCountForPlayer(playerId);
    let couldPlaceAgent = false;

    if (!player || player.turnState === 'done') {
      return;
    }

    const gameState = this.getGameState(player);

    if (player.turnState === 'agent-placement' && playerAgentCount > 0) {
      const playerHandCards = this.cardsService.getPlayerHand(player.id)?.cards;
      if (playerHandCards && playerHandCards.length > 0) {
        const cardAndField = this.aIManager.getCardAndFieldToPlay(playerHandCards, player, gameState, 3);

        const boardField = this.settingsService.boardFields.find((x) =>
          cardAndField?.preferredField.fieldId.includes(x.title.en)
        );
        if (boardField && cardAndField) {
          this.cardsService.setPlayedPlayerCard(playerId, cardAndField.cardToPlay.id);
          this.loggingService.logPlayerPlayedCard(playerId, this.translateService.translate(cardAndField.cardToPlay.name));
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
      this.aiChooseAndBuyCards(playerId, playerPersuasionAvailable);

      const playerFocusTokens = this.playerManager.getPlayerFocusTokens(playerId);
      this.chooseAndTrashDeckCards(playerId, playerFocusTokens);

      this.playerManager.setTurnStateForPlayer(playerId, 'done');
    }
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

  private aiResolveRewardChoices(aiInfo: AIAgentPlacementInfo, player: Player) {
    if (aiInfo.shippingAmount > 0) {
      this.addRewardToPlayer(player.id, { type: 'water', amount: aiInfo.shippingAmount });
    }
    if (aiInfo.locationControlAmount > 0) {
      const gameState = this.getGameState(player);

      for (let i = 0; i < aiInfo.locationControlAmount; i++) {
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
    if (aiInfo.factionInfluenceUpChoiceAmount > 0) {
      this.addFactionInfluenceUpChoiceForAI(player.id, aiInfo.factionInfluenceUpChoiceAmount);
    }
    if (aiInfo.factionInfluenceUpChoiceTwiceAmount > 0) {
      this.addFactionInfluenceUpChoiceTwiceForAI(player.id, aiInfo.factionInfluenceUpChoiceTwiceAmount);
    }
    if (aiInfo.factionInfluenceDownChoiceAmount > 0) {
      this.addFactionInfluenceDownChoiceForAI(player.id, aiInfo.factionInfluenceDownChoiceAmount);
    }
    if (aiInfo.signetRingAmount > 0) {
      for (let i = 0; i < aiInfo.signetRingAmount; i++) {
        this.playerRewardChoicesService.addPlayerRewardChoice(player.id, {
          type: 'signet-ring',
        });
      }
    }
    if (aiInfo.canBuyTech) {
      this.buyTechOrStackTechAgents(player, -1, aiInfo.techAgentsGainedThisTurn);
    }
  }

  private aiChooseAndBuyCards(playerId: number, availablePersuasion: number) {
    let buyAiInfo = this.getInitialAIAgentPlacementInfos();
    const player = this.playerManager.getPlayer(playerId);
    if (!player) {
      return;
    }

    const gameState = this.getGameState(player);

    const imperiumRow = this.cardsService.imperiumDeck.slice(0, 6);
    const imperiumRowModifiers = this.gameModifiersService.getPlayerImperiumRowModifiers(playerId);

    const alwaysBuyableCards = [
      ...this.cardsService.limitedCustomCards,
      ...this.cardsService.unlimitedCustomCards.map((x) => this.cardsService.instantiateImperiumCard(x)),
    ];

    const availableCards = [...imperiumRow, ...shuffle(alwaysBuyableCards)];

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
          const aiInfo = this.addRewardToPlayer(playerId, effect);
          buyAiInfo = this.updateAiAgentPlacementInfo(buyAiInfo, aiInfo);
        }
      }

      this.aiResolveRewardChoices(buyAiInfo, player);

      if (this.cardsService.limitedCustomCards.some((x) => x.id === cardToBuy.id)) {
        this.cardsService.aquirePlayerCardFromLimitedCustomCards(playerId, cardToBuy);
      } else {
        this.cardsService.aquirePlayerCardFromImperiumDeck(playerId, cardToBuy);
      }

      this.loggingService.logPlayerBoughtCard(playerId, this.translateService.translate(cardToBuy.name));

      this.aiChooseAndBuyCards(playerId, availablePersuasion - ((cardToBuy.persuasionCosts ?? 0) + costModifier));
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

    const playerCombatUnits = this.combatManager.getPlayerCombatUnits(player.id)!;
    const playerDreadnoughtCount = getPlayerdreadnoughtCount(playerCombatUnits);

    const playerScore = this.playerScoreManager.getPlayerScore(player.id)!;
    const playerFactionFriendships = this.getFactionFriendships(playerScore);
    const playerFieldUnlocksForFactions = this.gameModifiersService.getPlayerFieldUnlocksForFactions(player.id);
    const playerFieldUnlocksForIds = this.gameModifiersService.getPlayerFieldUnlocksForIds(player.id);

    const playerIntrigueCount = this.intriguesService.getPlayerIntrigueCount(player.id);
    const playerCanStealIntrigues = this.intriguesService.getEnemyIntrigues(player.id).some((x) => x.intrigues.length > 3);

    return {
      currentRound: this.currentRound,
      accumulatedSpiceOnFields: this.accumulatedSpiceOnFields,
      playerAgentCount: this.availablePlayerAgents.find((x) => x.playerId === player.id)?.agentAmount ?? 0,
      enemyAgentCount: this.availablePlayerAgents.filter((x) => x.playerId !== player.id),
      playerScore: playerScore,
      enemyScore: this.playerScoreManager.getEnemyScore(player.id)!,
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
      playerIntrigueCount,
      playerCanStealIntrigues,
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

  private playerCanPayCosts(playerId: number, costs: Reward[]) {
    let canPayCosts = true;
    const player = this.playerManager.getPlayer(playerId);
    let playerIntrigueCount = this.intriguesService.getPlayerIntrigueCount(playerId);
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
        } else if (costType === 'loose-troop') {
          const playerCombatUnits = this.combatManager.getPlayerCombatUnits(playerId);
          if ((playerCombatUnits?.troopsInGarrison ?? 0) + (playerCombatUnits?.troopsInCombat ?? 0) < 1) {
            canPayCosts = false;
          }
        } else if (costType === 'intrigue-trash') {
          playerIntrigueCount -= 1;
          if (playerIntrigueCount < 0) {
            canPayCosts = false;
          }
        }
      }
    }

    return canPayCosts;
  }

  private buyTechOrStackTechAgents(player: Player, techDiscount?: number, techAgentsGainedThisTurn?: number) {
    const discount = techDiscount ?? 0;
    const buyableTechTiles = this.techTilesService.buyableTechTiles;
    const availablePlayerSpice = player.resources.find((x) => x.type === 'spice')?.amount ?? 0;
    const availablePlayerTechAgents = player.techAgents + (techAgentsGainedThisTurn ?? 0);
    const affordableTechTiles = buyableTechTiles.filter(
      (x) => x.costs - discount <= availablePlayerTechAgents + availablePlayerSpice
    );

    if (affordableTechTiles.length > 0) {
      const gameState = this.getGameState(player);
      const mostDesiredTechTile = buyableTechTiles.sort(
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
      let techBuyAIInfo = this.getInitialAIAgentPlacementInfos();

      for (const reward of techTile.buyEffects) {
        const aiInfo = this.addRewardToPlayer(player.id, reward);
        techBuyAIInfo = this.updateAiAgentPlacementInfo(techBuyAIInfo, aiInfo);
      }

      this.aiResolveRewardChoices(techBuyAIInfo, player);
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
      return playerScores.some((x) => x.victoryPoints > 8);
    } else {
      return playerScores.some((x) => x.victoryPoints > 7);
    }
  }

  public addRewardToPlayer(playerId: number, reward: Reward, card?: ImperiumDeckCard) {
    const playerGameModifier = this.gameModifiersService.getPlayerGameModifiers(playerId);

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

      this.playerManager.addResourceToPlayer(playerId, rewardType, reward.amount ?? 1);
    } else if (rewardType === 'shipping') {
      aiInfo.shippingAmount = 1;
    } else if (isFactionScoreRewardType(rewardType)) {
      const scoreType = getFactionScoreTypeFromReward(reward);
      const factionInfluenceModifier = getFactionInfluenceModifier(playerGameModifier, scoreType);
      if (factionInfluenceModifier) {
        if (factionInfluenceModifier.noInfluence) {
          if (factionInfluenceModifier.alternateReward) {
            aiInfo = this.addRewardToPlayer(playerId, factionInfluenceModifier.alternateReward);
          }
        }
      } else {
        const factionRewards = this.playerScoreManager.addFactionScore(playerId, scoreType as PlayerFactionScoreType, 1);

        for (const reward of factionRewards) {
          const ai = this.addRewardToPlayer(playerId, reward);
          aiInfo = this.updateAiAgentPlacementInfo(ai, aiInfo);

          if (reward.type === 'combat') {
            aiInfo.canEnterCombat = true;
          }
        }
      }
    } else if (rewardType === 'faction-influence-up-choice') {
      aiInfo.factionInfluenceUpChoiceAmount = 1;
    } else if (rewardType === 'faction-influence-up-twice-choice') {
      aiInfo.factionInfluenceUpChoiceTwiceAmount = 1;
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
      this.playerManager.addTechAgentsToPlayer(playerId, agents);
      aiInfo.canBuyTech = true;
      aiInfo.techAgentsGainedThisTurn += agents;
    } else if (rewardType === 'intrigue') {
      this.audioManager.playSound('intrigue', reward.amount);
      this.intriguesService.drawPlayerIntriguesFromDeck(playerId, reward.amount ?? 1);
    } else if (rewardType === 'troop') {
      this.audioManager.playSound('troops', reward.amount);
      this.combatManager.addPlayerTroopsToGarrison(playerId, reward.amount ?? 1);
      aiInfo.unitsGainedThisTurn += reward.amount ?? 1;
    } else if (rewardType === 'dreadnought') {
      this.audioManager.playSound('dreadnought');
      this.combatManager.addPlayerShipsToGarrison(playerId, 1);
      aiInfo.unitsGainedThisTurn += reward.amount ?? 1;
    } else if (rewardType === 'card-draw') {
      this.audioManager.playSound('card-draw');
      this.cardsService.drawPlayerCardsFromDeck(playerId, reward.amount ?? 1);
    } else if (rewardType === 'card-destroy') {
      this.playerManager.addFocusTokens(playerId, reward.amount ?? 1);
    } else if (rewardType == 'card-draw-or-destroy') {
      aiInfo.canDestroyOrDrawCard = true;
    } else if (rewardType === 'focus') {
      this.playerManager.addFocusTokens(playerId, reward.amount ?? 1);
    } else if (rewardType == 'persuasion') {
      this.playerManager.addPersuasionGainedToPlayer(playerId, reward.amount ?? 1);
    } else if (rewardType == 'sword') {
      this.audioManager.playSound('sword');
      this.combatManager.addAdditionalCombatPowerToPlayer(playerId, reward.amount ?? 1);
    } else if (rewardType === 'council-seat-small' || rewardType === 'council-seat-large') {
      this.audioManager.playSound('high-council');
      this.playerManager.addCouncilSeatToPlayer(playerId);
    } else if (rewardType === 'sword-master') {
      this.audioManager.playSound('swordmaster');
      this.playerManager.addPermanentAgentToPlayer(playerId);
      this.addAgentToPlayer(playerId);
    } else if (rewardType === 'mentat') {
      this.addAgentToPlayer(playerId);
    } else if (rewardType === 'agent-lift') {
      aiInfo.canLiftAgent = true;
    } else if (rewardType === 'victory-point') {
      this.audioManager.playSound('victory-point');
      this.playerScoreManager.addPlayerScore(playerId, 'victoryPoints', reward.amount ?? 1);
    } else if (rewardType === 'foldspace') {
      const foldspaceCard = this.settingsService
        .getCustomCards()
        ?.find((x) => x.name.en.toLocaleLowerCase() === 'foldspace');
      if (foldspaceCard) {
        this.cardsService.addCardToPlayerHand(playerId, this.cardsService.instantiateImperiumCard(foldspaceCard));
      }
    } else if (rewardType === 'location-control') {
      aiInfo.locationControlAmount++;
    } else if (rewardType === 'signet-ring') {
      aiInfo.signetRingAmount++;
    } else if (rewardType === 'trash-self' && card) {
      this.cardsService.trashPlayerHandCard(playerId, card);
      this.loggingService.logPlayerTrashedCard(playerId, this.translateService.translate(card.name));
    }

    this.loggingService.logPlayerResourceGained(playerId, rewardType, reward.amount);

    return aiInfo;
  }

  public payCostForPlayer(playerId: number, cost: Reward) {
    let aiInfo = this.getInitialAIAgentPlacementInfos();
    const costType = cost.type;
    if (isResourceType(costType)) {
      this.playerManager.removeResourceFromPlayer(playerId, costType, cost.amount ?? 1);
    } else if (costType === 'shipping') {
      this.playerManager.removeResourceFromPlayer(playerId, 'water', cost.amount ?? 1);
    } else if (isFactionScoreRewardType(costType)) {
      const scoreType = getFactionScoreTypeFromReward(cost);

      this.playerScoreManager.removePlayerScore(playerId, scoreType as PlayerFactionScoreType, 1);
    } else if (costType === 'faction-influence-down-choice') {
      aiInfo.factionInfluenceDownChoiceAmount = 1;
    } else if (costType === 'intrigue' || costType === 'intrigue-trash') {
      const playerIntrigues = this.intriguesService.getPlayerIntrigues(playerId);
      if (playerIntrigues && playerIntrigues.length > 0) {
        const player = this.playerManager.getPlayer(playerId);
        if (!player) {
          return aiInfo;
        }

        const gameState = this.getGameState(player);

        const intrigueToTrash = this.aIManager.getIntrigueToTrash(playerIntrigues, player, gameState);
        if (intrigueToTrash) {
          this.intriguesService.trashPlayerIntrigue(playerId, intrigueToTrash.id);
        }
      }
    } else if (costType === 'troop' || costType === 'loose-troop') {
      this.combatManager.removePlayerTroopsFromGarrisonOrCombat(playerId, cost.amount ?? 1);
    } else if (costType === 'dreadnought') {
      this.combatManager.removePlayerShipsFromGarrison(playerId, 1);
      aiInfo.unitsGainedThisTurn += cost.amount ?? 1;
    } else if (costType === 'card-discard') {
      const playerHandCards = this.cardsService.getPlayerHand(playerId)?.cards;
      if (playerHandCards) {
        const player = this.playerManager.getPlayer(playerId);
        if (!player) {
          return aiInfo;
        }

        const gameState = this.getGameState(player);

        const activeCards = this.cardsService.playedPlayerCards;
        const discardableCards = playerHandCards.filter((x) => !activeCards.some((y) => x.id === y.cardId));

        const cardToDiscard = this.aIManager.getCardToDiscard(discardableCards, player, gameState);
        if (cardToDiscard) {
          this.cardsService.discardPlayerHandCard(playerId, cardToDiscard);
        }
      }
    } else if (costType === 'card-destroy' || costType === 'focus') {
      this.playerManager.addFocusTokens(playerId, cost.amount ?? 1);
    } else if (costType === 'persuasion') {
      this.playerManager.addPersuasionSpentToPlayer(playerId, cost.amount ?? 1);
    } else if (costType === 'victory-point') {
      this.playerScoreManager.removePlayerScore(playerId, 'victoryPoints', cost.amount ?? 1);
    }

    return aiInfo;
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

  private getInitialAIAgentPlacementInfos(): AIAgentPlacementInfo {
    return {
      unitsGainedThisTurn: 0,
      techAgentsGainedThisTurn: 0,
      canEnterCombat: false,
      canDestroyOrDrawCard: false,
      canBuyTech: false,
      canLiftAgent: false,
      factionInfluenceUpChoiceAmount: 0,
      factionInfluenceUpChoiceTwiceAmount: 0,
      factionInfluenceDownChoiceAmount: 0,
      shippingAmount: 0,
      locationControlAmount: 0,
      signetRingAmount: 0,
    };
  }

  private addFactionInfluenceUpChoiceForAI(playerId: number, amount: number) {
    let aiInfo = this.getInitialAIAgentPlacementInfos();

    const increasedFactionScoreTypes: PlayerFactionScoreType[] = [];
    for (let i = amount; i > 0; i--) {
      const playerScores = this.playerScoreManager.getPlayerScore(playerId);
      if (playerScores) {
        const desiredScoreType = this.aIManager.getMostDesiredFactionScoreType(playerScores, increasedFactionScoreTypes);

        if (desiredScoreType) {
          const factionRewards = this.playerScoreManager.addFactionScore(playerId, desiredScoreType, 1);
          increasedFactionScoreTypes.push(desiredScoreType);

          for (const reward of factionRewards) {
            const ai = this.addRewardToPlayer(playerId, reward);
            aiInfo = this.updateAiAgentPlacementInfo(ai, aiInfo);

            if (reward.type === 'combat') {
              aiInfo.canEnterCombat = true;
            }
          }
        }
      }
    }
    return aiInfo;
  }

  private addFactionInfluenceUpChoiceTwiceForAI(playerId: number, amount: number) {
    let aiInfo = this.getInitialAIAgentPlacementInfos();

    const increasedFactionScoreTypes: PlayerFactionScoreType[] = [];
    for (let i = amount; i > 0; i--) {
      const playerScores = this.playerScoreManager.getPlayerScore(playerId);
      if (playerScores) {
        const desiredScoreType = this.aIManager.getMostDesiredFactionScoreType(playerScores, increasedFactionScoreTypes);

        if (desiredScoreType) {
          const factionRewards = this.playerScoreManager.addFactionScore(playerId, desiredScoreType, 2);
          increasedFactionScoreTypes.push(desiredScoreType);

          for (const reward of factionRewards) {
            const ai = this.addRewardToPlayer(playerId, reward);
            aiInfo = this.updateAiAgentPlacementInfo(ai, aiInfo);

            if (reward.type === 'combat') {
              aiInfo.canEnterCombat = true;
            }
          }
        }
      }
    }
    return aiInfo;
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
