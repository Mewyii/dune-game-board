import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../players.service';
import { getNumberAverage, normalizeNumber, randomizeArray } from '../../helpers/common';
import { GameState, AIGoals, AIPersonality, FieldsForGoals, GoalModifier } from './models';
import { aiPersonalities } from './constants';
import { SettingsService } from '../settings.service';
import { PlayerCombatScore, PlayerCombatUnits } from '../combat-manager.service';
import {
  ActionField,
  ActionType,
  ActiveFactionType,
  activeFactionTypes,
  DuneLocation,
  FactionInfluence,
  Reward,
  RewardType,
} from 'src/app/models';
import { getDesire, getResourceAmount } from './shared/ai-goal-functions';
import { ImperiumDeckCard } from '../cards.service';
import { PlayerFactionScoreType, PlayerScore } from '../player-score-manager.service';
import { isFactionScoreType } from 'src/app/helpers/faction-score';
import { getCardsFactionAndFieldAccess, getCardsFieldAccess } from 'src/app/helpers/cards';
import { getPlayerdreadnoughtCount } from 'src/app/helpers/combat-units';
import { ImperiumRowModifier } from '../game-modifier.service';
import { getCardCostModifier } from 'src/app/helpers/game-modifiers';
import { IntrigueDeckCard } from '../intrigues.service';

export interface AIPlayer {
  playerId: number;
  name: string;
  personality: AIPersonality;
  preferredFields: ViableField[];
  decisions: string[];
  canAccessBlockedFields?: boolean;
}

export type AIVariableValues = 'good' | 'okay' | 'bad';

export type AIDIfficultyTypes = 'easy' | 'medium' | 'hard';

export interface AIVariables {
  imperiumRow: AIVariableValues;
}

interface FieldEvaluation {
  fieldId: string;
  value: number;
}

interface ViableField {
  fieldId: string;
  value: number;
  actionType: ActionType;
  requiresInfluence: FactionInfluence | undefined;
  accessTrough: 'card' | 'influence';
}

interface FactionInfluenceLock {
  type: ActiveFactionType;
  amount: number;
}

export interface AITurnInfo {
  unitsGainedThisTurn: number;
  techAgentsGainedThisTurn: number;
  canEnterCombat: boolean;
  canDestroyOrDrawCard: boolean;
  canBuyTech: boolean;
  canLiftAgent: boolean;
  factionInfluenceUpChoiceAmount: number;
  factionInfluenceUpChoiceTwiceAmount: number;
  factionInfluenceDownChoiceAmount: number;
  shippingAmount: number;
  locationControlAmount: number;
  signetRingAmount: number;
}

export interface AIRewardArrayInfo {
  hasRewardOptions: boolean;
  hasRewardConversion: boolean;
  rewardConversionIndex: number;
  rewardOptionIndex: number;
}

@Injectable({
  providedIn: 'root',
})
export class AIManager {
  private aiVariablesSubject = new BehaviorSubject<AIVariables>({ imperiumRow: 'okay' });
  public aiVariables$ = this.aiVariablesSubject.asObservable();

  private aiPlayersSubject = new BehaviorSubject<AIPlayer[]>([]);
  public aiPlayers$ = this.aiPlayersSubject.asObservable();

  private currentAIPlayerIdSubject = new BehaviorSubject<number>(0);
  public currentAIPlayerId$ = this.currentAIPlayerIdSubject.asObservable();

  private aiDifficultySubject = new BehaviorSubject<AIDIfficultyTypes>('medium');
  public aiDifficulty$ = this.aiDifficultySubject.asObservable();

  public aiGoals: FieldsForGoals | undefined;

  constructor(public settingsService: SettingsService) {
    const aiPlayersString = localStorage.getItem('aiPlayers');
    if (aiPlayersString) {
      const aiPlayers = JSON.parse(aiPlayersString) as AIPlayer[];
      this.aiPlayersSubject.next(aiPlayers);
    }

    this.aiPlayers$.subscribe((aiPlayers) => {
      localStorage.setItem('aiPlayers', JSON.stringify(aiPlayers));
    });

    const aiVariablesString = localStorage.getItem('aiVariables');
    if (aiVariablesString) {
      const aiVariables = JSON.parse(aiVariablesString) as AIVariables;
      this.aiVariablesSubject.next(aiVariables);
    }

    this.aiVariables$.subscribe((aiVariables) => {
      localStorage.setItem('aiVariables', JSON.stringify(aiVariables));
    });

    const currentAIPlayerIdString = localStorage.getItem('currentAIPlayerId');
    if (currentAIPlayerIdString) {
      const currentAIPlayerId = JSON.parse(currentAIPlayerIdString) as number;
      this.currentAIPlayerIdSubject.next(currentAIPlayerId);
    }

    this.currentAIPlayerId$.subscribe((currentAIPlayerId) => {
      localStorage.setItem('currentAIPlayerId', JSON.stringify(currentAIPlayerId));
    });

    const aiDifficultyString = localStorage.getItem('aiDifficulty');
    if (aiDifficultyString) {
      const aiDifficulty = JSON.parse(aiDifficultyString) as AIDIfficultyTypes;
      this.aiDifficultySubject.next(aiDifficulty);
    }

    this.aiDifficulty$.subscribe((aiDifficulty) => {
      localStorage.setItem('aiDifficulty', JSON.stringify(aiDifficulty));
    });

    this.settingsService.gameContent$.subscribe((x) => {
      this.aiGoals = x.aiGoals;
    });
  }

  public get aiPlayers() {
    return cloneDeep(this.aiPlayersSubject.value);
  }

  public get aiVariables() {
    return cloneDeep(this.aiVariablesSubject.value);
  }

  public get aiDifficulty() {
    return cloneDeep(this.aiDifficultySubject.value);
  }

  public getAIPlayer(playerId: number) {
    return this.aiPlayers.find((x) => x.playerId === playerId);
  }

  public get currentAIPlayerId() {
    return cloneDeep(this.currentAIPlayerIdSubject.value);
  }

  public assignPersonalitiesToAIPlayers(players: Player[]) {
    const aiPlayers: AIPlayer[] = [];
    for (const player of players) {
      if (player.isAI) {
        let name = this.getRandomAIName();
        let personality = (aiPersonalities as any)[name];

        if (aiPlayers.some((x) => x.personality === personality)) {
          name = this.getRandomAIName();
          personality = (aiPersonalities as any)[name];
        }
        aiPlayers.push({ playerId: player.id, name, personality, preferredFields: [], decisions: [] });
      }
    }

    this.aiPlayersSubject.next(aiPlayers);
  }

  public setAIPersonalityToPlayer(playerId: number, personalityName: string, personality: AIPersonality) {
    const aiPlayers = this.aiPlayers;

    const aiPlayer = aiPlayers.find((x) => x.playerId === playerId);
    if (aiPlayer) {
      aiPlayer.name = personalityName;
      aiPlayer.personality = personality;
    }

    this.aiPlayersSubject.next(aiPlayers);
  }

  public setAccessToBlockedFieldsForPlayer(playerId: number, canAccessBlockedFields: boolean) {
    const aiPlayers = this.aiPlayers;

    const aiPlayer = aiPlayers.find((x) => x.playerId === playerId);
    if (aiPlayer) {
      aiPlayer.canAccessBlockedFields = canAccessBlockedFields;
    }

    this.aiPlayersSubject.next(aiPlayers);
  }

  public setCurrentAIPlayerId(id: number) {
    this.currentAIPlayerIdSubject.next(id);
  }

  public setAIVariable(type: keyof AIVariables, value: AIVariableValues) {
    const aiVariables = this.aiVariables;

    aiVariables[type] = value;

    this.aiVariablesSubject.next(aiVariables);
  }

  public setAIDifficulty(value: AIDIfficultyTypes) {
    this.aiDifficultySubject.next(value);
  }

  public setPreferredFieldsForAIPlayer(player: Player, gameState: GameState) {
    const boardFields = this.getFieldsWithCombatAdjustments(this.getFieldsWithChoices(this.settingsService.boardFields));
    const aiPlayers = this.aiPlayers;
    const aiPlayer = aiPlayers.find((x) => x.playerId === player.id);

    const gameEvent = gameState.currentEvent;
    const playerLeader = gameState.playerLeader;

    if (!aiPlayer || !this.aiGoals || !gameState.playerHandCards) {
      return;
    }

    const fieldEvaluations: FieldEvaluation[] = [];
    const decisions: string[] = [];

    const virtualResources = playerLeader.aiAdjustments?.fieldAccessModifier ?? [];

    const conflictEvaluation = this.getNormalizedRewardArrayEvaluation(gameState.conflict.rewards[0], player, gameState, 30);
    const techEvaluation = Math.max(...gameState.availableTechTiles.map((x) => x.aiEvaluation(player, gameState)));

    const evaluatedImperiumRowCards = gameState.imperiumRowCards.map((x) =>
      this.getImperiumCardBuyEvaluation(x, player, gameState)
    );
    const imperiumRowEvaluation = normalizeNumber(getNumberAverage(evaluatedImperiumRowCards), 15, 5);

    let eventGoalModifiers: GoalModifier[] = [];
    if (gameEvent && gameEvent.aiAdjustments && gameEvent.aiAdjustments.goalEvaluationModifier) {
      eventGoalModifiers = gameEvent.aiAdjustments.goalEvaluationModifier(player, gameState);
    }

    let leaderGoalModifiers: GoalModifier[] = [];
    if (playerLeader.aiAdjustments && playerLeader.aiAdjustments.goalEvaluationModifier) {
      leaderGoalModifiers = playerLeader.aiAdjustments.goalEvaluationModifier(player, gameState);
    }

    for (let [goalId, goal] of Object.entries(this.aiGoals)) {
      if (!goal.reachedGoal(player, gameState, this.aiGoals, virtualResources)) {
        const aiGoalId = goalId as AIGoals;

        const desireModifier = goal.desireModifier(player, gameState, this.aiGoals, virtualResources);
        if (typeof desireModifier !== 'number') {
          decisions.push(desireModifier.name);
        }

        const goalDesire =
          getDesire(goal, player, gameState, virtualResources, this.aiGoals) *
            (aiPlayer.personality[aiGoalId] ?? 1.0) *
            this.getGameStateModifier(aiGoalId, conflictEvaluation, techEvaluation, imperiumRowEvaluation) +
          this.getEventGoalModifier(aiGoalId, eventGoalModifiers) +
          this.getLeaderGoalModifier(goalId, leaderGoalModifiers);

        let desireCanBeFullfilled = false;

        if (goal.goalIsReachable(player, gameState, this.aiGoals, virtualResources) && goal.desiredFields) {
          for (let [fieldId, getFieldValue] of Object.entries(goal.desiredFields(boardFields))) {
            const fieldValue = getFieldValue(player, gameState, this.aiGoals, virtualResources) * goalDesire;

            if (fieldValue > 0) {
              const index = fieldEvaluations.findIndex((x) => x.fieldId === fieldId);
              if (index > -1) {
                fieldEvaluations[index].value = Math.round((fieldEvaluations[index].value + fieldValue) * 100) / 100;
              } else {
                fieldEvaluations.push({ fieldId, value: Math.round(fieldValue * 100) / 100 });
              }

              desireCanBeFullfilled = true;
            }
          }
        }

        if (!desireCanBeFullfilled) {
          for (let [fieldId, getFieldValue] of Object.entries(goal.viableFields(boardFields))) {
            const fieldValue = getFieldValue(player, gameState, this.aiGoals, virtualResources) * goalDesire;

            if (fieldValue > 0) {
              const index = fieldEvaluations.findIndex((x) => x.fieldId === fieldId);
              if (index > -1) {
                fieldEvaluations[index].value = Math.round((fieldEvaluations[index].value + fieldValue) * 100) / 100;
              } else {
                fieldEvaluations.push({ fieldId, value: Math.round(fieldValue * 100) / 100 });
              }
            }
          }
        }
      }
    }

    const blockedFieldIds = gameState.agentsOnFields.map((x) => x.fieldId);

    const nonBlockedFields = aiPlayer.canAccessBlockedFields
      ? fieldEvaluations
      : fieldEvaluations.filter((viableField) => !blockedFieldIds.some((fieldId) => viableField.fieldId.includes(fieldId)));

    const fieldAccessFromCards = getCardsFieldAccess(gameState.playerHandCards);
    const factionAndFieldAccessFromCards = getCardsFactionAndFieldAccess(gameState.playerHandCards);

    const accessibleFields = boardFields
      .map((x) => {
        let accessTrough: 'card' | 'influence' | undefined;

        const nonBlockedField = nonBlockedFields.find((y) => y.fieldId === x.title.en);
        if (nonBlockedField) {
          const hasCardActionType = fieldAccessFromCards.some((actionType) => x.actionType === actionType);
          if (hasCardActionType) {
            if (!x.requiresInfluence) {
              accessTrough = 'card';
            } else {
              const hasEnoughFactionInfluence = gameState.playerFactionFriendships.some(
                (y) => y === x.requiresInfluence!.type
              );

              const hasDirectAccess =
                gameState.playerFieldUnlocksForFactions?.some((y) => y === x.requiresInfluence!.type) ||
                gameState.playerFieldUnlocksForIds?.some((y) => y.toLocaleLowerCase() === x.title.en.toLocaleLowerCase());

              if (hasEnoughFactionInfluence || hasDirectAccess) {
                accessTrough = 'influence';
              } else {
                const hasFactionAccessViaCard = factionAndFieldAccessFromCards.some(
                  (y) => y.actionType.includes(x.actionType) && y.faction === x.requiresInfluence!.type
                );

                if (hasFactionAccessViaCard) {
                  accessTrough = 'card';
                }
              }
            }
          }
          return { ...nonBlockedField, actionType: x.actionType, requiresInfluence: x.requiresInfluence, accessTrough };
        }

        return undefined;
      })
      .filter((x) => x && x.accessTrough) as ViableField[];

    accessibleFields.sort((a, b) => b.value - a.value);

    const randomFactor = gameState.isOpeningTurn
      ? 0.66
      : this.aiDifficulty === 'hard'
      ? 0.1
      : this.aiDifficulty === 'medium'
      ? 0.2
      : 0.3;
    const slightlyRandomizedFields = randomizeArray(accessibleFields, randomFactor);

    aiPlayer.preferredFields = slightlyRandomizedFields;
    aiPlayer.decisions = decisions;

    this.aiPlayersSubject.next(aiPlayers);
  }

  public getPreferredFieldForPlayer(playerId: number) {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === playerId);
    if (!aiPlayer) {
      return undefined;
    }

    const preferredField = aiPlayer.preferredFields[0];
    if (!preferredField) {
      return undefined;
    }

    const fields = this.settingsService.boardFields;
    return fields.find((x) => preferredField.fieldId.includes(x.title.en));
  }

  public getFieldDecision(playerId: number, fieldId: string): string {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === playerId);
    if (!aiPlayer) {
      return '';
    }

    const targetFields = aiPlayer.preferredFields.filter((x) => x.fieldId.includes(fieldId));
    if (targetFields[0]) {
      const regex = /\((.*)\)/; // Matches anything within parentheses
      const match = targetFields[0].fieldId.match(regex);
      return match && match[1] ? match[1] : '';
    }
    return '';
  }

  public getFieldDrawOrDestroyDecision(playerId: number, fieldId: string): 'draw' | 'destroy' {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === playerId);
    if (!aiPlayer) {
      return 'draw';
    }

    const targetFields = aiPlayer.preferredFields.filter((x) => x.fieldId.includes(fieldId));
    if (targetFields[0] && targetFields[0].fieldId.toLocaleLowerCase().includes('destroy')) {
      return 'destroy';
    }

    return 'draw';
  }

  public getUpgradedreadnoughtOrTechDecision(playerId: number): 'dreadnought' | 'tech' {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === playerId);
    if (!aiPlayer) {
      return 'tech';
    }

    const targetFields = aiPlayer.preferredFields.filter((x) => x.fieldId.includes('upgrade'));
    if (targetFields[0] && targetFields[0].fieldId.toLocaleLowerCase().includes('dreadnought')) {
      return 'dreadnought';
    }

    return 'tech';
  }

  public getDesiredSpiceToSell(player: Player, spiceToSolariFunction: (spice: number) => number, maxAmount: number) {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === player.id);
    if (!aiPlayer) {
      return 0;
    }

    const playerSpiceAmount = player.resources.find((x) => x.type === 'spice')?.amount;
    if (!playerSpiceAmount) {
      return 0;
    }

    const desiredSolariAmount = player.hasSwordmaster ? 9 : 10;
    const playerSolariAmount = player.resources.find((x) => x.type === 'solari')?.amount ?? 0;

    for (let spiceCount = 1; spiceCount <= playerSpiceAmount; spiceCount++) {
      if (playerSolariAmount + spiceToSolariFunction(spiceCount) > desiredSolariAmount || spiceCount >= maxAmount) {
        return spiceCount;
      }
    }

    return playerSpiceAmount;
  }

  public getAddAdditionalUnitsToCombatDecision(
    playerCombatUnits: PlayerCombatUnits,
    enemyCombatScores: PlayerCombatScore[],
    maxAddableUnits: number,
    playerHasAgentsLeft: boolean,
    playerHasIntrigues: boolean
  ) {
    if (!playerCombatUnits || !enemyCombatScores) {
      return 'none';
    }

    const playerCombatPower = getPlayerCombatPower(playerCombatUnits);
    const possibleAddedCombatPower = this.getMaxAddableCombatPower(playerCombatUnits, maxAddableUnits);

    const highestEnemyCombatPower = Math.max(...enemyCombatScores.map((x) => x.score));

    if (playerCombatPower <= highestEnemyCombatPower) {
      if (
        playerHasAgentsLeft ||
        playerHasIntrigues ||
        playerCombatPower + possibleAddedCombatPower > highestEnemyCombatPower
      ) {
        return 'all';
      } else {
        return 'minimum';
      }
    } else {
      const maxCombatPowerDifference = 10;
      const combatPowerDifference = playerCombatPower - highestEnemyCombatPower;

      if (combatPowerDifference > maxCombatPowerDifference) {
        return 'none';
      }

      const randomNumber = getRandomInt(maxCombatPowerDifference);
      if (randomNumber - combatPowerDifference <= 0) {
        return 'minimum';
      } else if (randomNumber - combatPowerDifference <= 5) {
        return 'all';
      }
    }

    return 'none';
  }

  getPreferredLocationForPlayer(player: Player, controllableLocations: DuneLocation[], gameState: GameState) {
    let preferredLocation = undefined;
    let preferredLocationValue = 0;

    for (const location of controllableLocations) {
      if (location.ownerReward) {
        const locationValue =
          (location.ownerReward.amount ?? 1) * this.getEffectEvaluation(location.ownerReward.type, player, gameState);
        if (locationValue > preferredLocationValue) {
          preferredLocation = location;
          preferredLocationValue = locationValue;
        }
      }
    }

    return preferredLocation;
  }

  getCardToPlay(playerHandCards: ImperiumDeckCard[], player: Player, gameState: GameState, preferredField?: ActionField) {
    let usableCards = playerHandCards;
    if (preferredField) {
      usableCards = usableCards.filter((x) => x.fieldAccess?.some((accessType) => accessType === preferredField.actionType));
    }

    if (usableCards.length > 0) {
      const cardEvaluations = usableCards.map((card) => {
        const evaluation = this.getImperiumCardPlayEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  getCardAndFieldToPlay(
    playerHandCards: ImperiumDeckCard[],
    player: Player,
    gameState: GameState,
    preferredFieldAmount = 1
  ) {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === player.id);
    if (!aiPlayer) {
      return undefined;
    }

    const preferredFields = aiPlayer.preferredFields.slice(0, preferredFieldAmount);

    const usableCards = playerHandCards.filter((x) =>
      x.fieldAccess?.some((accessType) => preferredFields.some((y) => y.actionType === accessType))
    );

    if (usableCards.length > 0) {
      const cardEvaluations = usableCards
        .map((card) => {
          const cardEvaluation = this.getImperiumCardPlayEvaluation(card, player, gameState);
          const fieldIndex = preferredFields.findIndex((x) =>
            x.accessTrough === 'card' && x.requiresInfluence
              ? card.fieldAccess?.includes(x.actionType) && card.faction === x.requiresInfluence.type
              : card.fieldAccess?.includes(x.actionType)
          );
          const evaluation = cardEvaluation - fieldIndex * 1.5;
          return { evaluation, card, fieldIndex };
        })
        .filter((x) => x.fieldIndex > -1);
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);

      return { cardToPlay: cardEvaluations[0].card, preferredField: preferredFields[cardEvaluations[0].fieldIndex] };
    }
    return undefined;
  }

  getCardToBuy(
    availablePersuasion: number,
    cards: ImperiumDeckCard[],
    player: Player,
    gameState: GameState,
    imperiumRowModifiers?: ImperiumRowModifier[]
  ) {
    const buyableCards = cards.filter(
      (x) => (x.persuasionCosts ?? 0) + getCardCostModifier(x, imperiumRowModifiers) <= availablePersuasion
    );
    if (buyableCards.length > 0) {
      const cardEvaluations = buyableCards.map((card) => {
        const evaluation = this.getImperiumCardBuyEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  getCardToDiscard(playerHandCards: ImperiumDeckCard[], player: Player, gameState: GameState) {
    if (playerHandCards.length > 0) {
      const cardEvaluations = playerHandCards.map((card) => {
        const evaluation = this.getImperiumCardTrashEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  getCardToTrash(cards: ImperiumDeckCard[], player: Player, gameState: GameState) {
    if (cards.length > 0) {
      const cardEvaluations = cards.map((card) => {
        const evaluation = this.getImperiumCardTrashEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  getIntrigueToTrash(playerIntrigueCards: IntrigueDeckCard[], player: Player, gameState: GameState) {
    if (playerIntrigueCards.length > 0) {
      const cardEvaluations = playerIntrigueCards.map((card) => {
        const evaluation = this.getIntrigueCardTrashEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  private getGameStateModifier(
    goal: AIGoals,
    conflictEvaluation: number,
    techEvaluation: number,
    imperiumRowEvaluation: number
  ) {
    let modifier = 1.0;

    if (goal === 'enter-combat') {
      modifier = 0.5 + conflictEvaluation;
    } else if (goal === 'troops') {
      modifier = (0.5 + conflictEvaluation + 2) / 3;
    } else if (goal === 'dreadnought') {
      modifier = (1.5 - conflictEvaluation + 1) / 2;
    } else if (goal === 'tech') {
      modifier = 0.5 + techEvaluation;
    } else if (goal === 'draw-cards' || goal === 'get-board-persuasion') {
      modifier = 0.5 + imperiumRowEvaluation;
    } else if (goal === 'high-council') {
      modifier = (0.5 + imperiumRowEvaluation + 1) / 2;
    }

    return modifier;
  }

  private getLeaderGoalModifier(goalId: string, goalModifiers: GoalModifier[]) {
    return goalModifiers.find((x) => x.type === goalId)?.modifier ?? 0.0;
  }

  private getEventGoalModifier(goalId: AIGoals, goalModifiers: GoalModifier[]) {
    return goalModifiers.find((x) => x.type === goalId)?.modifier ?? 0.0;
  }

  private getRandomAIName() {
    const randomIndex = Math.floor(Math.random() * Object.keys(aiPersonalities).length);
    return Object.keys(aiPersonalities)[randomIndex];
  }

  private getMaxAddableCombatPower(playerCombatUnits: PlayerCombatUnits, maxAddableUnits: number) {
    let addableUnits = maxAddableUnits;
    let combatPower = 0;

    addableUnits -= playerCombatUnits.shipsInGarrison;
    combatPower += playerCombatUnits.shipsInGarrison * this.settingsService.gameContent.dreadnoughtCombatStrength;

    if (addableUnits > 0) {
      if (addableUnits < playerCombatUnits.troopsInGarrison) {
        combatPower += addableUnits * this.settingsService.gameContent.troopCombatStrength;
      } else {
        combatPower += playerCombatUnits.troopsInGarrison * this.settingsService.gameContent.troopCombatStrength;
      }
    }
    return combatPower;
  }

  getFieldsWithChoices(fields: ActionField[]) {
    const result: ActionField[] = [];
    for (const field of fields) {
      if (field.rewards.some((x) => x.type === 'card-draw-or-destroy')) {
        const cardDrawOption = {
          ...field,
          title: { ...field.title, en: field.title.en + ' (card-draw)' },
          rewards: field.rewards.map((x) => ({ ...x, type: x.type === 'card-draw-or-destroy' ? 'card-draw' : x.type })),
        };

        const cardDestroyOption = {
          ...field,
          title: { ...field.title, en: field.title.en + ' (card-destroy)' },
          rewards: field.rewards.map((x) => ({ ...x, type: x.type === 'card-draw-or-destroy' ? 'card-destroy' : x.type })),
        };

        result.push(cardDrawOption);
        result.push(cardDestroyOption);
      } else if (field.rewards.some((x) => x.type === 'helper-or' || x.type === 'helper-or-horizontal')) {
        const separatorIndex = field.rewards.findIndex((x) => x.type === 'helper-or' || x.type === 'helper-or-horizontal');

        const leftOptionRewardType = field.rewards[separatorIndex - 1].type.toLocaleLowerCase();
        const leftOptionField = {
          ...field,
          title: { ...field.title, en: field.title.en + ' (' + leftOptionRewardType + ')' },
          rewards: field.rewards.filter((x, index) => index !== separatorIndex + 1),
        };

        const rightOptionRewardType = field.rewards[separatorIndex + 1].type.toLocaleLowerCase();
        const rightOptionField = {
          ...field,
          title: { ...field.title, en: field.title.en + ' (' + rightOptionRewardType + ')' },
          rewards: field.rewards.filter((x, index) => index !== separatorIndex - 1),
        };

        result.push(cloneDeep(leftOptionField));
        result.push(cloneDeep(rightOptionField));
      } else {
        result.push(cloneDeep(field));
      }
    }
    return result;
  }

  getFieldsWithCombatAdjustments(fields: ActionField[]) {
    return fields.map((field) => {
      const combatRewardIndex = field.rewards.findIndex((x) => x.type === 'combat');

      if (combatRewardIndex > -1) {
        let modifier = 0.4;

        const troopRewards = field.rewards.find((x) => x.type === 'troop');
        if (troopRewards) {
          modifier = modifier + 0.15 * (troopRewards.amount ?? 1);
        }
        const dreadnoughtRewards = field.rewards.find((x) => x.type === 'dreadnought');
        if (dreadnoughtRewards) {
          modifier = modifier + 0.35 * (dreadnoughtRewards.amount ?? 1);
        }
        const intrigueRewards = field.rewards.find((x) => x.type === 'intrigue');
        if (intrigueRewards) {
          modifier = modifier + 0.075 * (intrigueRewards.amount ?? 1);
        }

        field.rewards[combatRewardIndex].amount = modifier;
        return field;
      } else {
        return field;
      }
    });
  }

  getMostDesiredFactionScoreType(
    playerScores: PlayerScore,
    exclusions?: PlayerFactionScoreType[]
  ): PlayerFactionScoreType | undefined {
    let desiredFactionScoreType: PlayerFactionScoreType | undefined;
    let desiredFactionScoreAmount = -1;

    for (const factionType of activeFactionTypes) {
      if (!exclusions?.includes(factionType)) {
        if (playerScores[factionType] > desiredFactionScoreAmount && playerScores[factionType] < 4) {
          desiredFactionScoreType = factionType;
          desiredFactionScoreAmount = playerScores[factionType];
        }
      }
    }

    return desiredFactionScoreType;
  }

  getLeastDesiredFactionScoreType(
    playerScores: PlayerScore,
    exclusions?: PlayerFactionScoreType[]
  ): PlayerFactionScoreType | undefined {
    let desiredFactionScoreType: PlayerFactionScoreType | undefined;
    let desiredFactionScoreAmount = 100;

    for (const factionType of activeFactionTypes) {
      if (!exclusions?.includes(factionType)) {
        if (playerScores[factionType] < desiredFactionScoreAmount && playerScores[factionType] > 0) {
          desiredFactionScoreType = factionType;
          desiredFactionScoreAmount = playerScores[factionType];
        }
      }
    }

    return desiredFactionScoreType;
  }

  private getImperiumCardPlayEvaluation(card: ImperiumDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;
    if (card.fieldAccess) {
      evaluationValue -= card.fieldAccess.length * 0.1;
    }
    if (card.agentEffects) {
      const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } = this.getRewardArrayAIInfos(
        card.agentEffects
      );
      if (!hasRewardOptions && !hasRewardConversion) {
        evaluationValue += this.getRewardArrayEvaluationForTurnState(card.agentEffects, player, gameState);
      } else if (hasRewardOptions) {
        const leftSideRewards = card.agentEffects.slice(0, rewardOptionIndex);
        const rightSideRewards = card.agentEffects.slice(rewardOptionIndex + 1);
        const leftSideEvaluation = this.getRewardArrayEvaluationForTurnState(leftSideRewards, player, gameState);
        const rightSideEvaluation = this.getRewardArrayEvaluationForTurnState(rightSideRewards, player, gameState);

        evaluationValue += leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
      } else if (hasRewardConversion) {
        const costs = card.agentEffects.slice(0, rewardConversionIndex);
        const rewards = card.agentEffects.slice(rewardConversionIndex + 1);
        const costsEvaluation = this.getCostsArrayEvaluationForTurnState(costs, player, gameState);
        const rewardsEvaluation = this.getRewardArrayEvaluationForTurnState(rewards, player, gameState);

        evaluationValue += -costsEvaluation + rewardsEvaluation;
      }
    }
    if (card.customAgentEffect) {
      evaluationValue += 1 + 0.5 * (card.persuasionCosts ?? 0);
    }

    if (card.revealEffects) {
      const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } = this.getRewardArrayAIInfos(
        card.revealEffects
      );
      if (!hasRewardOptions && !hasRewardConversion) {
        evaluationValue -= this.getRewardArrayEvaluationForTurnState(card.revealEffects, player, gameState);
      } else if (hasRewardOptions) {
        const leftSideRewards = card.revealEffects.slice(0, rewardOptionIndex);
        const rightSideRewards = card.revealEffects.slice(rewardOptionIndex + 1);
        const leftSideEvaluation = this.getRewardArrayEvaluationForTurnState(leftSideRewards, player, gameState);
        const rightSideEvaluation = this.getRewardArrayEvaluationForTurnState(rightSideRewards, player, gameState);

        evaluationValue -= leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
      } else if (hasRewardConversion) {
        const costs = card.revealEffects.slice(0, rewardConversionIndex);
        const rewards = card.revealEffects.slice(rewardConversionIndex + 1);
        const costsEvaluation = this.getCostsArrayEvaluationForTurnState(costs, player, gameState);
        const rewardsEvaluation = this.getRewardArrayEvaluationForTurnState(rewards, player, gameState);

        evaluationValue -= -costsEvaluation + rewardsEvaluation;
      }
    }
    if (card.customRevealEffect) {
      evaluationValue -= 2 + 0.5 * (card.persuasionCosts ?? 0);
    }

    return evaluationValue;
  }

  private getImperiumCardBuyEvaluation(card: ImperiumDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;
    if (card.persuasionCosts) {
      evaluationValue += card.persuasionCosts * 0.1;
    }
    if (card.buyEffects) {
      const { hasRewardOptions, hasRewardConversion } = this.getRewardArrayAIInfos(card.buyEffects);
      if (!hasRewardOptions && !hasRewardConversion) {
        evaluationValue += this.getRewardArrayEvaluation(card.buyEffects, player, gameState);
      }
    }
    if (card.fieldAccess) {
      evaluationValue += card.fieldAccess.length * 1;
    }
    if (card.agentEffects) {
      const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } = this.getRewardArrayAIInfos(
        card.agentEffects
      );
      if (!hasRewardOptions && !hasRewardConversion) {
        evaluationValue += this.getRewardArrayEvaluation(card.agentEffects, player, gameState);
      } else if (hasRewardOptions) {
        const leftSideRewards = card.agentEffects.slice(0, rewardOptionIndex);
        const rightSideRewards = card.agentEffects.slice(rewardOptionIndex + 1);
        const leftSideEvaluation = this.getRewardArrayEvaluation(leftSideRewards, player, gameState);
        const rightSideEvaluation = this.getRewardArrayEvaluation(rightSideRewards, player, gameState);

        evaluationValue += leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
      } else if (hasRewardConversion) {
        const costs = card.agentEffects.slice(0, rewardConversionIndex);
        const rewards = card.agentEffects.slice(rewardConversionIndex + 1);
        const costsEvaluation = this.getCostsArrayEvaluation(costs, player, gameState);
        const rewardsEvaluation = this.getRewardArrayEvaluation(rewards, player, gameState);

        evaluationValue += -costsEvaluation + rewardsEvaluation;
      }
    }
    if (card.customAgentEffect) {
      evaluationValue += 1 + 0.5 * (card.persuasionCosts ?? 0);
    }
    if (card.revealEffects) {
      const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } = this.getRewardArrayAIInfos(
        card.revealEffects
      );
      if (!hasRewardOptions && !hasRewardConversion) {
        evaluationValue += this.getRewardArrayEvaluation(card.revealEffects, player, gameState);
      } else if (hasRewardOptions) {
        const leftSideRewards = card.revealEffects.slice(0, rewardOptionIndex);
        const rightSideRewards = card.revealEffects.slice(rewardOptionIndex + 1);
        const leftSideEvaluation = this.getRewardArrayEvaluation(leftSideRewards, player, gameState);
        const rightSideEvaluation = this.getRewardArrayEvaluation(rightSideRewards, player, gameState);

        evaluationValue += leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
      } else if (hasRewardConversion) {
        const costs = card.revealEffects.slice(0, rewardConversionIndex);
        const rewards = card.revealEffects.slice(rewardConversionIndex + 1);
        const costsEvaluation = this.getCostsArrayEvaluation(costs, player, gameState);
        const rewardsEvaluation = this.getRewardArrayEvaluation(rewards, player, gameState);

        evaluationValue += -costsEvaluation + rewardsEvaluation;
      }
    }
    if (card.customRevealEffect) {
      evaluationValue += 2 + 0.5 * (card.persuasionCosts ?? 0);
    }

    return evaluationValue;
  }

  private getImperiumCardTrashEvaluation(card: ImperiumDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;
    if (card.persuasionCosts) {
      evaluationValue -= card.persuasionCosts * 0.1;
    }
    if (card.fieldAccess) {
      evaluationValue -= card.fieldAccess.length * 1;
    }
    if (card.agentEffects) {
      const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } = this.getRewardArrayAIInfos(
        card.agentEffects
      );
      if (!hasRewardOptions && !hasRewardConversion) {
        evaluationValue -= this.getRewardArrayEvaluation(card.agentEffects, player, gameState);
      } else if (hasRewardOptions) {
        const leftSideRewards = card.agentEffects.slice(0, rewardOptionIndex);
        const rightSideRewards = card.agentEffects.slice(rewardOptionIndex + 1);
        const leftSideEvaluation = this.getRewardArrayEvaluation(leftSideRewards, player, gameState);
        const rightSideEvaluation = this.getRewardArrayEvaluation(rightSideRewards, player, gameState);

        evaluationValue -= leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
      } else if (hasRewardConversion) {
        const costs = card.agentEffects.slice(0, rewardConversionIndex);
        const rewards = card.agentEffects.slice(rewardConversionIndex + 1);
        const costsEvaluation = this.getCostsArrayEvaluation(costs, player, gameState);
        const rewardsEvaluation = this.getRewardArrayEvaluation(rewards, player, gameState);

        evaluationValue -= -costsEvaluation + rewardsEvaluation;
      }
    }
    if (card.customAgentEffect) {
      evaluationValue -= 1 + 0.5 * (card.persuasionCosts ?? 0);
    }

    if (card.revealEffects) {
      const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } = this.getRewardArrayAIInfos(
        card.revealEffects
      );
      if (!hasRewardOptions && !hasRewardConversion) {
        evaluationValue -= this.getRewardArrayEvaluation(card.revealEffects, player, gameState);
      } else if (hasRewardOptions) {
        const leftSideRewards = card.revealEffects.slice(0, rewardOptionIndex);
        const rightSideRewards = card.revealEffects.slice(rewardOptionIndex + 1);
        const leftSideEvaluation = this.getRewardArrayEvaluation(leftSideRewards, player, gameState);
        const rightSideEvaluation = this.getRewardArrayEvaluation(rightSideRewards, player, gameState);

        evaluationValue -= leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
      } else if (hasRewardConversion) {
        const costs = card.revealEffects.slice(0, rewardConversionIndex);
        const rewards = card.revealEffects.slice(rewardConversionIndex + 1);
        const costsEvaluation = this.getCostsArrayEvaluation(costs, player, gameState);
        const rewardsEvaluation = this.getRewardArrayEvaluation(rewards, player, gameState);

        evaluationValue -= -costsEvaluation + rewardsEvaluation;
      }
    }
    if (card.customRevealEffect) {
      evaluationValue -= 2 + 0.5 * (card.persuasionCosts ?? 0);
    }

    return evaluationValue;
  }

  private getIntrigueCardTrashEvaluation(card: IntrigueDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;
    if (card.effects) {
      const { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex } = this.getRewardArrayAIInfos(
        card.effects
      );
      if (!hasRewardOptions && !hasRewardConversion) {
        evaluationValue -= this.getRewardArrayEvaluation(card.effects, player, gameState);
      } else if (hasRewardOptions) {
        const leftSideRewards = card.effects.slice(0, rewardOptionIndex);
        const rightSideRewards = card.effects.slice(rewardOptionIndex + 1);
        const leftSideEvaluation = this.getRewardArrayEvaluation(leftSideRewards, player, gameState);
        const rightSideEvaluation = this.getRewardArrayEvaluation(rightSideRewards, player, gameState);

        evaluationValue -= leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
      } else if (hasRewardConversion) {
        const costs = card.effects.slice(0, rewardConversionIndex);
        const rewards = card.effects.slice(rewardConversionIndex + 1);
        const costsEvaluation = this.getCostsArrayEvaluation(costs, player, gameState);
        const rewardsEvaluation = this.getRewardArrayEvaluation(rewards, player, gameState);

        evaluationValue -= -costsEvaluation + rewardsEvaluation;
      }
    }

    return evaluationValue;
  }

  public getRewardArrayEvaluation(rewards: Reward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += this.getEffectEvaluation(reward.type, player, gameState) * (reward.amount ?? 1);
    }
    return evaluationValue;
  }

  public getCostsArrayEvaluation(rewards: Reward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += Math.abs(this.getEffectEvaluation(reward.type, player, gameState) * (reward.amount ?? 1));
    }
    return evaluationValue;
  }

  public getRewardArrayEvaluationForTurnState(rewards: Reward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += this.getEffectEvaluationForTurnState(reward.type, player, gameState) * (reward.amount ?? 1);
    }
    return evaluationValue;
  }

  public getCostsArrayEvaluationForTurnState(rewards: Reward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += Math.abs(
        this.getEffectEvaluationForTurnState(reward.type, player, gameState) * (reward.amount ?? 1)
      );
    }
    return evaluationValue;
  }

  public getNormalizedRewardArrayEvaluation(rewards: Reward[], player: Player, gameState: GameState, normalizeMax = 10) {
    return normalizeNumber(this.getRewardArrayEvaluation(rewards, player, gameState), normalizeMax, 0);
  }

  private getEffectEvaluation(rewardType: RewardType, player: Player, gameState: GameState) {
    switch (rewardType) {
      case 'water':
        return (
          3 -
          (player.hasSwordmaster ? 0.1 : 0) -
          (player.hasCouncilSeat ? 0.1 : 0) -
          0.05 * getPlayerdreadnoughtCount(gameState.playerCombatUnits)
        );
      case 'spice':
        return (
          2.5 -
          (player.hasSwordmaster ? 0.2 : 0) -
          (player.hasCouncilSeat ? 0.2 : 0) -
          0.1 * getPlayerdreadnoughtCount(gameState.playerCombatUnits)
        );
      case 'solari':
        return (
          1.5 -
          (player.hasSwordmaster ? 0.3 : 0) -
          (player.hasCouncilSeat ? 0.3 : 0) -
          0.15 * getPlayerdreadnoughtCount(gameState.playerCombatUnits) -
          0.05 * (gameState.currentRound - 1)
        );
      case 'troop':
        return 1.5;
      case 'dreadnought':
        return getPlayerdreadnoughtCount(gameState.playerCombatUnits) < 2 ? 6 : 0;
      case 'card-draw':
        return 1.5 + 0.1 * gameState.playerCardsBought + 0.1 * gameState.playerCardsTrashed;
      case 'card-discard':
        return -1.0 - 0.1 * gameState.playerCardsBought - 0.1 * gameState.playerCardsTrashed;
      case 'card-destroy':
      case 'focus':
        return 2 + 0.15 * gameState.playerCardsBought - 0.3 * gameState.playerCardsTrashed;
      case 'card-draw-or-destroy':
        return 2 + 0.05 * gameState.playerCardsBought + 0.05 * gameState.playerCardsTrashed;
      case 'intrigue':
        return 1.75 + 0.1 * (gameState.currentRound - 1);
      case 'persuasion':
        return 2.0 - 0.1 * (gameState.currentRound - 1);
      case 'foldspace':
        return 2.0 - 0.05 * gameState.playerCardsBought - 0.05 * gameState.playerCardsTrashed;
      case 'council-seat-small':
      case 'council-seat-large':
        return !player.hasCouncilSeat ? 3.5 : 0;
      case 'sword-master':
        return !player.hasSwordmaster ? 15 : 0;
      case 'mentat':
        return 3.5;
      case 'spice-accumulation':
        return 0;
      case 'victory-point':
        return 9 + 1.0 * (gameState.currentRound - 1);
      case 'sword':
        return 1;
      case 'combat':
        return 1 + 0.25 * (gameState.currentRound - 1);
      case 'intrigue-trash':
        return -1;
      case 'intrigue-draw':
        return 1.5;
      case 'helper-trade-horizontal':
        return 0;
      case 'helper-trade':
        return 0;
      case 'placeholder':
        return 0;
      case 'helper-or':
        return 0;
      case 'helper-or-horizontal':
        return 0;
      case 'tech':
        return 1;
      case 'tech-reduced':
        return 2.25;
      case 'tech-reduced-two':
        return 4.5;
      case 'tech-reduced-three':
        return 6.75;
      case 'card-round-start':
        return 1.5;
      case 'shipping':
        return 2.5 - 0.1 * getResourceAmount(player, 'water', []) - 0.1 * getResourceAmount(player, 'spice', []);
      case 'faction-influence-up-choice':
        return 4;
      case 'faction-influence-up-emperor':
      case 'faction-influence-up-guild':
      case 'faction-influence-up-bene':
      case 'faction-influence-up-fremen':
        return 3;
      case 'faction-influence-up-twice-choice':
        return 6;
      case 'faction-influence-down-choice':
        return -2;
      case 'faction-influence-down-emperor':
      case 'faction-influence-down-guild':
      case 'faction-influence-down-bene':
      case 'faction-influence-down-fremen':
        return -3;
      case 'agent':
        return 0;
      case 'agent-lift':
        return 3 + 0.25 * (gameState.currentRound - 1);
      case 'buildup':
        return 0;
      case 'signet-token':
        return 0;
      case 'signet-ring':
        return 2 - 0.1 * (gameState.currentRound - 1);
      case 'location-control':
        return 6 + 0.25 * (gameState.currentRound - 1);
      case 'loose-troop':
        return -1 + 0.1 * (gameState.currentRound - 1);
      case 'trash-self':
        return -1;
      default:
        return 0;
    }
  }

  private getEffectEvaluationForTurnState(rewardType: RewardType, player: Player, gameState: GameState) {
    const hasPlacedAgents = gameState.playerAgentsOnFields.length > 1;
    const hasAgentsLeftToPlace = player.agents - gameState.playerAgentsOnFields.length > 0;

    const value = this.getEffectEvaluation(rewardType, player, gameState);

    switch (rewardType) {
      case 'water':
        return value - 0.4 * getResourceAmount(player, 'water', []);
      case 'spice':
        return value - 0.2 * getResourceAmount(player, 'spice', []);
      case 'solari':
        return value - 0.1 * getResourceAmount(player, 'solari', []);
      case 'troop':
        return value - 0.1 * gameState.playerCombatUnits.troopsInGarrison;
      case 'dreadnought':
        return value;
      case 'card-draw':
        return gameState.playerDeckCards.length > 0 ? value : 0;
      case 'card-discard':
        return value;
      case 'card-destroy':
      case 'focus':
        return gameState.playerDeckSizeTotal > 6 ? value : 0;
      case 'card-draw-or-destroy':
        return gameState.playerDeckCards.length > 0 || gameState.playerDeckSizeTotal > 6 ? value : 0;
      case 'intrigue':
        return value - 0.25 * gameState.playerIntrigueCount;
      case 'persuasion':
        return value;
      case 'foldspace':
        return hasAgentsLeftToPlace ? value : 0.5 * value;
      case 'council-seat-small':
      case 'council-seat-large':
        return value;
      case 'sword-master':
        return value;
      case 'mentat':
        return value;
      case 'spice-accumulation':
        return value;
      case 'victory-point':
        return value;
      case 'sword':
        return gameState.playerCombatUnits.troopsInCombat > 0 ? (hasAgentsLeftToPlace ? value : 0.66 * value) : 0;
      case 'combat':
        return value;
      case 'intrigue-trash':
        return value;
      case 'intrigue-draw':
        return value;
      case 'helper-trade-horizontal':
        return value;
      case 'helper-trade':
        return value;
      case 'placeholder':
        return value;
      case 'helper-or':
        return value;
      case 'helper-or-horizontal':
        return value;
      case 'tech':
        return value + 0.33 * player.techAgents;
      case 'tech-reduced':
        return value + 0.33 * player.techAgents;
      case 'tech-reduced-two':
        return value + 0.33 * player.techAgents;
      case 'tech-reduced-three':
        return value + 0.33 * player.techAgents;
      case 'card-round-start':
        return value;
      case 'shipping':
        return value;
      case 'faction-influence-up-choice':
        return value;
      case 'faction-influence-up-emperor':
      case 'faction-influence-up-guild':
      case 'faction-influence-up-bene':
      case 'faction-influence-up-fremen':
        return value;
      case 'faction-influence-up-twice-choice':
        return value;
      case 'faction-influence-down-choice':
        return value;
      case 'faction-influence-down-emperor':
      case 'faction-influence-down-guild':
      case 'faction-influence-down-bene':
      case 'faction-influence-down-fremen':
        return value;
      case 'agent':
        return value;
      case 'agent-lift':
        return hasPlacedAgents ? value : 0;
      case 'buildup':
        return value;
      case 'signet-token':
        return value;
      case 'signet-ring':
        return value;
      case 'location-control':
        return gameState.freeLocations.length > 0 || gameState.playerCombatUnits.troopsInGarrison > 0
          ? 6 + 0.25 * (gameState.currentRound - 1)
          : 0;
      case 'loose-troop':
        return value;
      case 'trash-self':
        return value;
      default:
        return value;
    }
  }

  public getRewardArrayAIInfos(rewards: Reward[]): AIRewardArrayInfo {
    const rewardOptionIndex = rewards.findIndex((x) => x.type === 'helper-or' || x.type === 'helper-or-horizontal');
    const hasRewardOptions = rewardOptionIndex > -1;

    const rewardConversionIndex = rewards.findIndex(
      (x) => x.type === 'helper-trade' || x.type === 'helper-trade-horizontal'
    );
    const hasRewardConversion = rewardConversionIndex > -1;
    return { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex };
  }
}

function getPlayerCombatPower(player: PlayerCombatUnits) {
  return player.troopsInCombat * 2 + player.shipsInCombat * 3;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
