import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
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
  Effect,
  RewardType,
  EffectWithoutSeparator,
  EffectReward,
  RewardConditionType,
  Faction,
  EffectWithoutSeparatorAndCondition,
  RewardChoiceType,
  StructuredConditionalEffect,
  StructuredChoiceEffect,
  StructuredEffects,
} from 'src/app/models';
import { getAccumulatedSpice, getDesire, getResourceAmount } from './shared/ai-goal-functions';
import { ImperiumDeckCard, ImperiumRowCard } from '../cards.service';
import { PlayerFactionScoreType, PlayerScore } from '../player-score-manager.service';
import { getCardsFactionAndFieldAccess, getCardsFieldAccess } from 'src/app/helpers/cards';
import { getPlayerdreadnoughtCount } from 'src/app/helpers/combat-units';
import { ImperiumRowModifier } from '../game-modifier.service';
import { getCardCostModifier, getModifiedCostsForField, getModifiedRewardsForField } from 'src/app/helpers/game-modifiers';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { Player } from 'src/app/models/player';
import { isFactionScoreType } from 'src/app/helpers/faction-score';
import { isConditionalEffect, isConversionEffectType, isOptionEffectType } from 'src/app/helpers/rewards';

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

interface FieldEvaluation {
  fieldId: string;
  value: number;
}

interface ViableField {
  fieldId: string;
  value: number;
  actionType: ActionType;
  requiresInfluence: FactionInfluence | undefined;
  accessTrough: 'influence' | 'game-modifiers';
  requiresInfiltration: boolean;
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
  private aiPlayersSubject = new BehaviorSubject<AIPlayer[]>([]);
  public aiPlayers$ = this.aiPlayersSubject.asObservable();

  private currentAIPlayerIdSubject = new BehaviorSubject<number>(0);
  public currentAIPlayerId$ = this.currentAIPlayerIdSubject.asObservable();

  private aiDifficultySubject = new BehaviorSubject<AIDIfficultyTypes>('medium');
  public aiDifficulty$ = this.aiDifficultySubject.asObservable();

  public aiGoals: FieldsForGoals | undefined;

  constructor(private settingsService: SettingsService) {
    const aiPlayersString = localStorage.getItem('aiPlayers');
    if (aiPlayersString) {
      const aiPlayers = JSON.parse(aiPlayersString) as AIPlayer[];
      this.aiPlayersSubject.next(aiPlayers);
    }

    this.aiPlayers$.subscribe((aiPlayers) => {
      localStorage.setItem('aiPlayers', JSON.stringify(aiPlayers));
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

  public setAIDifficulty(value: AIDIfficultyTypes) {
    this.aiDifficultySubject.next(value);
  }

  public setPreferredFieldsForAIPlayer(player: Player, gameState: GameState) {
    const boardFields = this.getFieldsWithAdjustedRewardsAndCosts(
      gameState,
      this.getFieldsWithChoices(this.settingsService.boardFields)
    );
    const aiPlayers = this.aiPlayers;
    const aiPlayer = aiPlayers.find((x) => x.playerId === player.id);

    const gameEvent = gameState.currentEvent;
    const playerLeader = gameState.playerLeader;

    if (!aiPlayer || !this.aiGoals || !gameState.playerHandCards) {
      return;
    }

    const fieldEvaluations: FieldEvaluation[] = [];
    const decisions: string[] = [];

    const conflictEvaluation = this.getNormalizedRewardArrayEvaluation(gameState.conflict.rewards[0], player, gameState, 24);
    const techEvaluation = Math.max(...gameState.availableTechTiles.map((x) => x.aiEvaluation(player, gameState)));

    const evaluatedImperiumRowCards = (
      gameState.imperiumRowCards.filter((x) => x.type === 'imperium-card') as ImperiumRowCard[]
    ).map((x) => this.getImperiumCardBuyEvaluation(x, player, gameState));
    const imperiumRowEvaluation = normalizeNumber(getNumberAverage(evaluatedImperiumRowCards), 16, 5);

    let eventGoalModifiers: GoalModifier[] = [];
    if (gameEvent && gameEvent.aiAdjustments && gameEvent.aiAdjustments.goalEvaluationModifier) {
      eventGoalModifiers = gameEvent.aiAdjustments.goalEvaluationModifier(player, gameState);
    }

    let leaderGoalModifiers: GoalModifier[] = [];
    if (playerLeader.aiAdjustments && playerLeader.aiAdjustments.goalEvaluationModifier) {
      leaderGoalModifiers = playerLeader.aiAdjustments.goalEvaluationModifier(player, gameState);
    }

    for (let [goalId, goal] of Object.entries(this.aiGoals)) {
      if (!goal.reachedGoal(player, gameState, this.aiGoals)) {
        const aiGoalId = goalId as AIGoals;

        const desireModifier = goal.desireModifier(player, gameState, this.aiGoals);
        if (typeof desireModifier !== 'number') {
          decisions.push(desireModifier.name);
        }

        const goalDesire =
          getDesire(goal, player, gameState, this.aiGoals) *
            (aiPlayer.personality[aiGoalId] ?? 1.0) *
            this.getGameStateModifier(aiGoalId, conflictEvaluation, techEvaluation, imperiumRowEvaluation) +
          this.getEventGoalModifier(aiGoalId, eventGoalModifiers) +
          this.getLeaderGoalModifier(goalId, leaderGoalModifiers);

        let desireCanBeFullfilled = false;

        if (goal.goalIsReachable(player, gameState, this.aiGoals) && goal.desiredFields) {
          for (let [fieldId, getFieldValue] of Object.entries(goal.desiredFields(boardFields))) {
            const fieldValue = getFieldValue(player, gameState, this.aiGoals) * goalDesire;

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
            const fieldValue = getFieldValue(player, gameState, this.aiGoals) * goalDesire;

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

    const accessibleFields = this.getAccessibleFields(boardFields, fieldEvaluations, gameState, aiPlayer);

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

  private getAccessibleFields(
    boardFields: ActionField[],
    fieldEvaluations: FieldEvaluation[],
    gameState: GameState,
    aiPlayer: AIPlayer
  ) {
    const fieldAccessFromCards = getCardsFieldAccess(gameState.playerHandCards);

    const accessibleFields = boardFields
      .map((x) => {
        const isBlockedField =
          gameState.blockedFieldsForActionTypes.some((y) => y === x.actionType) ||
          gameState.blockedFieldsForIds.some((y) => y.includes(x.title.en));

        if (isBlockedField) {
          return undefined;
        }

        const hasOwnAgentOnField = gameState.agentsOnFields.some(
          (y) => x.title.en.includes(y.fieldId) && y.playerId === aiPlayer.playerId
        );
        const hasEnemyAgentOnField = gameState.agentsOnFields.some(
          (y) => x.title.en.includes(y.fieldId) && y.playerId !== aiPlayer.playerId
        );

        const playerFieldEnemyAccessForActionTypes = [
          ...gameState.playerEnemyFieldTypeAcessTroughCards,
          ...gameState.playerEnemyFieldTypeAcessTroughGameModifiers,
        ];
        const hasEnemyAcess = playerFieldEnemyAccessForActionTypes.some((y) => y === x.actionType);

        if (hasOwnAgentOnField || (hasEnemyAgentOnField && !hasEnemyAcess)) {
          return undefined;
        }

        const requiresInfiltration = hasEnemyAgentOnField && hasEnemyAcess;

        const fieldEvaluation = fieldEvaluations.find((y) => y.fieldId === x.title.en);
        if (fieldEvaluation) {
          let accessTrough: 'influence' | 'game-modifiers' | undefined;

          const hasCardActionType = fieldAccessFromCards.some((actionType) => x.actionType === actionType);
          if (hasCardActionType) {
            if (x.requiresInfluence) {
              const hasEnoughFactionInfluence = gameState.playerFactionFriendships.some(
                (y) => y === x.requiresInfluence!.type
              );

              if (hasEnoughFactionInfluence) {
                accessTrough = 'influence';
              } else {
                const hasOtherAccess =
                  gameState.playerFieldUnlocksForFactions.some((y) => y === x.requiresInfluence!.type) ||
                  gameState.playerFieldUnlocksForIds.some((y) => x.title.en.includes(y));

                if (hasOtherAccess) {
                  accessTrough = 'game-modifiers';
                }
              }
            }
          }
          return {
            ...fieldEvaluation,
            actionType: x.actionType,
            requiresInfluence: x.requiresInfluence,
            requiresInfiltration,
            accessTrough,
          };
        }

        return undefined;
      })
      .filter((x) => x && x.accessTrough) as ViableField[];

    accessibleFields.sort((a, b) => b.value - a.value);

    return accessibleFields;
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

    const playerCombatPower = this.getPlayerCombatPower(playerCombatUnits);
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

    let cardEvaluations: { field: ViableField; evaluation: number; card: ImperiumDeckCard }[] = [];
    for (const [fieldIndex, preferredField] of preferredFields.entries()) {
      const usableCards = playerHandCards.filter(
        (card) =>
          (preferredField.requiresInfiltration ? card.canInfiltrate : true) &&
          card.fieldAccess?.some((x) => x === preferredField.actionType)
      );

      if (usableCards.length > 0) {
        const evaluations = usableCards.map((card) => {
          const cardEvaluation = this.getImperiumCardPlayEvaluation(card, player, gameState);

          const evaluation = cardEvaluation - fieldIndex * 1.5;
          return { field: preferredField, evaluation, card };
        });

        cardEvaluations.push(...evaluations);
      }
    }

    if (cardEvaluations.length > 0) {
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);

      return { cardToPlay: cardEvaluations[0].card, preferredField: cardEvaluations[0].field };
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
    combatPower += playerCombatUnits.shipsInGarrison * this.settingsService.getDreadnoughtStrength();

    if (addableUnits > 0) {
      if (addableUnits < playerCombatUnits.troopsInGarrison) {
        combatPower += addableUnits * this.settingsService.getTroopStrength();
      } else {
        combatPower += playerCombatUnits.troopsInGarrison * this.settingsService.getTroopStrength();
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
        } as ActionField;

        const cardDestroyOption = {
          ...field,
          title: { ...field.title, en: field.title.en + ' (card-destroy)' },
          rewards: field.rewards.map((x) => ({ ...x, type: x.type === 'card-draw-or-destroy' ? 'card-destroy' : x.type })),
        } as ActionField;

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
      } else if (field.conversionOptions) {
        for (const conversionOption of field.conversionOptions) {
          const { hasRewardConversion, rewardConversionIndex } = this.getRewardArrayAIInfos(conversionOption);
          if (hasRewardConversion) {
            const costs = conversionOption.slice(0, rewardConversionIndex);
            const rewards = conversionOption.slice(rewardConversionIndex + 1);

            const conversionField = {
              ...field,
              title: { ...field.title, en: field.title.en + ' (' + costs[0].amount + ')' },
              costs: costs as EffectReward[],
              rewards: rewards,
            };
            result.push(cloneDeep(conversionField));
          }
        }
      } else {
        result.push(cloneDeep(field));
      }
    }
    return result;
  }

  getFieldsWithAdjustedRewardsAndCosts(gameState: GameState, fields: ActionField[]) {
    return fields.map((field) => {
      // Game Modifier Reward Adjustments
      const fieldRewards = getModifiedRewardsForField(field, gameState.playerGameModifiers?.fieldReward);

      // Faction Reward Adjustments
      if (isFactionScoreType(field.actionType)) {
        const factionInfluenceRewards = this.settingsService.factionInfluenceRewards.find(
          (x) => x.factionId === field.actionType
        )?.rewards;
        if (factionInfluenceRewards) {
          const nextFactionScore = gameState.playerScore[field.actionType] + 1;
          const nextFactionInfluenceRewards = factionInfluenceRewards[nextFactionScore];
          if (nextFactionInfluenceRewards) {
            for (const reward of nextFactionInfluenceRewards) {
              fieldRewards.push(reward);
            }
          }
        }
      }

      // Spice Reward Adjustments
      if (fieldRewards.some((x) => x.type === 'spice-accumulation')) {
        const accumulatedSpice = getAccumulatedSpice(gameState, field.title.en);
        if (accumulatedSpice > 0) {
          const spiceIndex = fieldRewards.findIndex((x) => x.type === 'spice');
          if (spiceIndex > -1) {
            const spiceAmount = fieldRewards[spiceIndex].amount ?? 1;
            fieldRewards[spiceIndex].amount = spiceAmount + accumulatedSpice;
          } else {
            fieldRewards.push({ type: 'spice', amount: accumulatedSpice });
          }
        }
      }

      // Combat Reward Adjustments
      const combatRewardIndex = fieldRewards.findIndex((x) => x.type === 'combat');

      if (combatRewardIndex > -1) {
        let modifier = 0.4;

        const troopRewards = fieldRewards.find((x) => x.type === 'troop');
        if (troopRewards) {
          modifier = modifier + 0.15 * (troopRewards.amount ?? 1);
        }
        const dreadnoughtRewards = fieldRewards.find((x) => x.type === 'dreadnought');
        if (dreadnoughtRewards) {
          modifier = modifier + 0.3 * (dreadnoughtRewards.amount ?? 1);
        }
        const intrigueRewards = fieldRewards.find((x) => x.type === 'intrigue');
        if (intrigueRewards) {
          modifier = modifier + 0.075 * (intrigueRewards.amount ?? 1);
        }

        fieldRewards[combatRewardIndex].amount = modifier;
      }
      // Game Modifier Cost Adjustments
      const fieldCosts = getModifiedCostsForField(field, gameState.playerGameModifiers?.fieldCost);

      return { ...field, rewards: fieldRewards, costs: fieldCosts };
    });
  }

  getMostDesiredFactionScoreType(
    playerId: number,
    playerScores: PlayerScore[],
    influenceGainAmount: number,
    exclusions?: PlayerFactionScoreType[]
  ): PlayerFactionScoreType | undefined {
    const playerScore = playerScores.find((x) => x.playerId === playerId);
    if (!playerScore) {
      return;
    }

    const enemyScores = playerScores.filter((x) => x.playerId !== playerId);
    const factionAllianceTreshold = this.settingsService.getFactionInfluenceAllianceTreshold();
    const maxFactionInfluence = this.settingsService.getFactionInfluenceMaxScore();

    const factionDesires = {
      emperor: 0,
      guild: 0,
      bene: 0,
      fremen: 0,
    };

    for (const factionType of activeFactionTypes) {
      if (!exclusions?.includes(factionType)) {
        const playerFactionScore = playerScore[factionType];
        if (playerFactionScore < maxFactionInfluence) {
          factionDesires[factionType] += 1;

          if (playerFactionScore >= factionAllianceTreshold) {
            if (
              enemyScores.some(
                (x) =>
                  x[factionType] > playerFactionScore &&
                  x[factionType] < maxFactionInfluence &&
                  playerFactionScore + influenceGainAmount === x[factionType]
              )
            ) {
              factionDesires[factionType] += 5;
            }
            if (
              enemyScores.some(
                (x) =>
                  x[factionType] >= playerFactionScore &&
                  x[factionType] < maxFactionInfluence &&
                  playerFactionScore + influenceGainAmount > x[factionType]
              )
            ) {
              factionDesires[factionType] += 10;
            }
          } else if (playerFactionScore < factionAllianceTreshold) {
            factionDesires[factionType] += 1 + playerFactionScore + influenceGainAmount;

            if (enemyScores.some((x) => x[factionType] >= factionAllianceTreshold)) {
              factionDesires[factionType] -= 1;
            }
            if (playerFactionScore + influenceGainAmount > factionAllianceTreshold) {
              factionDesires[factionType] += 5;
            }
          }
        }
      }
    }

    return Object.entries(factionDesires).reduce(
      (maxKey: any, [key, value]) => (factionDesires[maxKey as ActiveFactionType] < value ? key : maxKey),
      Object.keys(factionDesires)[0]
    );
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
    if (card.faction) {
      evaluationValue +=
        0.5 * (gameState.playerCardsFactions[card.faction] + gameState.playerTechTilesFactions[card.faction]);
    }
    if (card.fieldAccess) {
      evaluationValue -= card.fieldAccess.length * 0.1;
    }
    if (card.canInfiltrate) {
      const totalAgents = gameState.playerAgentsOnFields.length + gameState.playerAgentsAvailable;
      const agentsPlaced = gameState.playerAgentsOnFields.length;
      evaluationValue += 4 * (agentsPlaced / (totalAgents - 1)) - 2;
    }
    if (card.structuredAgentEffects) {
      const agentEffects = card.structuredAgentEffects;
      if (agentEffects.rewards) {
        evaluationValue += this.getRewardArrayEvaluationForTurnState(agentEffects.rewards, player, gameState);
      }
      for (const choiceEffect of agentEffects.choiceEffects) {
        if (isOptionEffectType(choiceEffect.choiceType)) {
          const leftSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rightSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue += leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
        } else if (isConversionEffectType(choiceEffect.choiceType)) {
          const costsEvaluation = this.getCostsArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rewardsEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue += -costsEvaluation + rewardsEvaluation;
        }
      }
    }
    if (card.customAgentEffect) {
      evaluationValue += 1 + 0.5 * (card.persuasionCosts ?? 0);
    }

    if (card.structuredRevealEffects) {
      const revealEffects = card.structuredRevealEffects;
      if (revealEffects.rewards) {
        evaluationValue -= this.getRewardArrayEvaluationForTurnState(revealEffects.rewards, player, gameState);
      }
      for (const choiceEffect of revealEffects.choiceEffects) {
        if (isOptionEffectType(choiceEffect.choiceType)) {
          const leftSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rightSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue -= leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
        } else if (isConversionEffectType(choiceEffect.choiceType)) {
          const costsEvaluation = this.getCostsArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rewardsEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue -= -costsEvaluation + rewardsEvaluation;
        }
      }
    }
    if (card.customRevealEffect) {
      evaluationValue -= 2 + 0.5 * (card.persuasionCosts ?? 0);
    }

    return evaluationValue;
  }

  private getImperiumCardBuyEvaluation(card: ImperiumDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;
    if (card.faction) {
      evaluationValue += 1 * (gameState.playerCardsFactions[card.faction] + gameState.playerTechTilesFactions[card.faction]);
    }
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
      for (const access of card.fieldAccess) {
        evaluationValue += gameState.playerCardsFieldAccess[access] < 2 ? 1.5 : 0.75;
      }
    }
    if (card.canInfiltrate) {
      evaluationValue += 0.5 * (card.fieldAccess?.length ?? 0);
    }

    if (card.structuredAgentEffects) {
      const agentEffects = card.structuredAgentEffects;
      if (agentEffects.rewards) {
        evaluationValue += this.getRewardArrayEvaluationForTurnState(agentEffects.rewards, player, gameState);
      }
      for (const choiceEffect of agentEffects.choiceEffects) {
        if (isOptionEffectType(choiceEffect.choiceType)) {
          const leftSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rightSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue += leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
        } else if (isConversionEffectType(choiceEffect.choiceType)) {
          const costsEvaluation = this.getCostsArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rewardsEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue += -costsEvaluation + rewardsEvaluation;
        }
      }
    }
    if (card.customAgentEffect) {
      evaluationValue += 1 + 0.5 * (card.persuasionCosts ?? 0);
    }

    if (card.structuredRevealEffects) {
      const revealEffects = card.structuredRevealEffects;
      if (revealEffects.rewards) {
        evaluationValue += this.getRewardArrayEvaluationForTurnState(revealEffects.rewards, player, gameState);
      }
      for (const choiceEffect of revealEffects.choiceEffects) {
        if (isOptionEffectType(choiceEffect.choiceType)) {
          const leftSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rightSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue += leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
        } else if (isConversionEffectType(choiceEffect.choiceType)) {
          const costsEvaluation = this.getCostsArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rewardsEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue += -costsEvaluation + rewardsEvaluation;
        }
      }
    }
    if (card.customRevealEffect) {
      evaluationValue += 2 + 0.5 * (card.persuasionCosts ?? 0);
    }

    return evaluationValue;
  }

  private getImperiumCardTrashEvaluation(card: ImperiumDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;
    if (card.faction) {
      evaluationValue -=
        0.5 * (gameState.playerCardsFactions[card.faction] + gameState.playerTechTilesFactions[card.faction]);
    }
    if (card.persuasionCosts) {
      evaluationValue -= card.persuasionCosts * 0.1;
    }
    if (card.fieldAccess) {
      for (const access of card.fieldAccess) {
        evaluationValue -= gameState.playerCardsFieldAccess[access] < 2 ? 1.5 : 0.75;
      }
    }
    if (card.canInfiltrate) {
      evaluationValue -= 0.5 * (card.fieldAccess?.length ?? 0);
    }

    if (card.structuredAgentEffects) {
      const agentEffects = card.structuredAgentEffects;
      if (agentEffects.rewards) {
        evaluationValue -= this.getRewardArrayEvaluationForTurnState(agentEffects.rewards, player, gameState);
      }
      for (const choiceEffect of agentEffects.choiceEffects) {
        if (isOptionEffectType(choiceEffect.choiceType)) {
          const leftSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rightSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue -= leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
        } else if (isConversionEffectType(choiceEffect.choiceType)) {
          const costsEvaluation = this.getCostsArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rewardsEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue -= -costsEvaluation + rewardsEvaluation;
        }
      }
    }
    if (card.customAgentEffect) {
      evaluationValue -= 1 + 0.5 * (card.persuasionCosts ?? 0);
    }

    if (card.structuredRevealEffects) {
      const revealEffects = card.structuredRevealEffects;
      if (revealEffects.rewards) {
        evaluationValue -= this.getRewardArrayEvaluationForTurnState(revealEffects.rewards, player, gameState);
      }
      for (const choiceEffect of revealEffects.choiceEffects) {
        if (isOptionEffectType(choiceEffect.choiceType)) {
          const leftSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rightSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue -= leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
        } else if (isConversionEffectType(choiceEffect.choiceType)) {
          const costsEvaluation = this.getCostsArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rewardsEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue -= -costsEvaluation + rewardsEvaluation;
        }
      }
    }
    if (card.customRevealEffect) {
      evaluationValue -= 2 + 0.5 * (card.persuasionCosts ?? 0);
    }

    return evaluationValue;
  }

  private getIntrigueCardTrashEvaluation(card: IntrigueDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;

    if (card.structuredEffects) {
      const effects = card.structuredEffects;
      if (effects.rewards) {
        evaluationValue -= this.getRewardArrayEvaluationForTurnState(effects.rewards, player, gameState);
      }
      for (const choiceEffect of effects.choiceEffects) {
        if (isOptionEffectType(choiceEffect.choiceType)) {
          const leftSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rightSideEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue -= leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
        } else if (isConversionEffectType(choiceEffect.choiceType)) {
          const costsEvaluation = this.getCostsArrayEvaluationForTurnState(choiceEffect.left, player, gameState);
          const rewardsEvaluation = this.getRewardArrayEvaluationForTurnState(choiceEffect.right, player, gameState);

          evaluationValue -= -costsEvaluation + rewardsEvaluation;
        }
      }
    }

    return evaluationValue;
  }

  public getRewardArrayEvaluation(rewards: EffectReward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += this.getEffectEvaluation(reward.type, player, gameState) * (reward.amount ?? 1);
    }
    return evaluationValue;
  }

  public getCostsArrayEvaluation(rewards: EffectReward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += Math.abs(this.getEffectEvaluation(reward.type, player, gameState) * (reward.amount ?? 1));
    }
    return evaluationValue;
  }

  public getRewardArrayEvaluationForTurnState(rewards: EffectReward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += this.getEffectEvaluationForTurnState(reward.type, player, gameState) * (reward.amount ?? 1);
    }
    return evaluationValue;
  }

  public getCostsArrayEvaluationForTurnState(rewards: EffectReward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += Math.abs(
        this.getEffectEvaluationForTurnState(reward.type, player, gameState) * (reward.amount ?? 1)
      );
    }
    return evaluationValue;
  }

  public getNormalizedRewardArrayEvaluation(
    rewards: EffectReward[],
    player: Player,
    gameState: GameState,
    normalizeMax = 10
  ) {
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
        return 1.75;
      case 'dreadnought':
        return (getPlayerdreadnoughtCount(gameState.playerCombatUnits) < 2 ? 7 : 0) + 0.25 * (gameState.currentRound - 1);
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
        return 2.0 - 0.15 * (gameState.currentRound - 1);
      case 'foldspace':
        return 2.25 - 0.1 * gameState.playerCardsBought - 0.1 * gameState.playerCardsTrashed;
      case 'council-seat-small':
      case 'council-seat-large':
        return !player.hasCouncilSeat ? 12 - 1 * (gameState.currentRound - 1) : 0;
      case 'sword-master':
      case 'agent':
        return !player.hasSwordmaster ? 15 - 1 * (gameState.currentRound - 1) : 0;
      case 'mentat':
        return 3.5;
      case 'spice-accumulation':
        return 0;
      case 'victory-point':
        return 9 + 1.25 * (gameState.currentRound - 1);
      case 'sword':
        return 1;
      case 'combat':
        return 1 + 0.2 * (gameState.currentRound - 1);
      case 'intrigue-trash':
        return -1;
      case 'intrigue-draw':
        return 0.25;
      case 'tech':
        return 1.5;
      case 'card-round-start':
        return 1.5;
      case 'shipping':
        return 2.5 - 0.1 * getResourceAmount(player, 'water') - 0.1 * getResourceAmount(player, 'spice');
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
      case 'agent-lift':
        return 3 + 0.25 * (gameState.currentRound - 1);
      case 'buildup':
        return 0;
      case 'signet-token':
        return 0;
      case 'signet-ring':
        return 3 - 0.1 * (gameState.currentRound - 1);
      case 'location-control':
        return 6 + 0.25 * (gameState.currentRound - 1);
      case 'loose-troop':
        return -1.5 + 0.1 * (gameState.currentRound - 1);
      case 'trash-self':
        return -1;
      default:
        return 0;
    }
  }

  public getEffectEvaluationForTurnState(rewardType: RewardType, player: Player, gameState: GameState) {
    const hasPlacedAgents = gameState.playerAgentsOnFields.length > 1;
    const hasAgentsLeftToPlace = player.agents - gameState.playerAgentsOnFields.length > 0;

    const value = this.getEffectEvaluation(rewardType, player, gameState);

    switch (rewardType) {
      case 'water':
        return value - 0.4 * getResourceAmount(player, 'water');
      case 'spice':
        return value - 0.2 * getResourceAmount(player, 'spice');
      case 'solari':
        return value - 0.1 * getResourceAmount(player, 'solari');
      case 'troop':
        return value - 0.1 * gameState.playerCombatUnits.troopsInGarrison;
      case 'dreadnought':
        return value + 0.1 * gameState.playerCombatUnits.troopsInGarrison;
      case 'card-draw':
        return gameState.playerDeckCards.length > 0 ? value : 0;
      case 'card-discard':
        return value;
      case 'card-destroy':
      case 'focus':
        return gameState.playerDeckSizeTotal > 7 ? value : 0;
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
      case 'agent':
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
        return (
          value + 0.5 * gameState.playerCombatUnits.troopsInGarrison + 0.5 * gameState.playerCombatUnits.shipsInGarrison
        );
      case 'intrigue-trash':
        return value;
      case 'intrigue-draw':
        return value + 2 * gameState.playerIntrigueStealAmount;
      case 'tech':
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
      case 'agent-lift':
        return hasPlacedAgents ? value : 0;
      case 'buildup':
        return value;
      case 'signet-token':
        return value;
      case 'signet-ring':
        return value;
      case 'location-control':
        const controllableFreeLocations = gameState.playerAgentsOnFields.some((x) =>
          gameState.freeLocations.some((y) => x.fieldId === y)
        );
        const controllableEnemyLocations =
          gameState.playerAgentsOnFields.some((x) => gameState.occupiedLocations.some((y) => x.fieldId === y)) &&
          gameState.playerCombatUnits.troopsInGarrison >= (this.settingsService.getLocationTakeoverTroopCosts() ?? 0);

        return controllableFreeLocations || controllableEnemyLocations ? value : value / 3;
      case 'loose-troop':
        return value + 0.33 * gameState.playerCombatUnits.troopsInGarrison;
      case 'trash-self':
        return value;
      default:
        return value;
    }
  }

  public getRewardArrayAIInfos(rewards: Effect[]): AIRewardArrayInfo {
    const rewardOptionIndex = rewards.findIndex((x) => x.type === 'helper-or' || x.type === 'helper-or-horizontal');
    const hasRewardOptions = rewardOptionIndex > -1;

    const rewardConversionIndex = rewards.findIndex(
      (x) => x.type === 'helper-trade' || x.type === 'helper-trade-horizontal'
    );
    const hasRewardConversion = rewardConversionIndex > -1;
    return { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex };
  }

  private getPlayerCombatPower(player: PlayerCombatUnits) {
    return (
      player.troopsInCombat * this.settingsService.getTroopStrength() +
      player.shipsInCombat * this.settingsService.getDreadnoughtStrength()
    );
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
