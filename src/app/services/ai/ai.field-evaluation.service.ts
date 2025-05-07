import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { getCardsFieldAccess } from 'src/app/helpers/cards';
import { randomizeArray } from 'src/app/helpers/common';
import { isFactionScoreType } from 'src/app/helpers/faction-score';
import { getModifiedCostsForField, getModifiedRewardsForField } from 'src/app/helpers/game-modifiers';
import { getRewardArrayAIInfos } from 'src/app/helpers/rewards';
import { ActionField, ActionType, EffectReward, FactionInfluence } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { LeaderDeckCard } from '../leaders.service';
import { SettingsService } from '../settings.service';
import { AIPlayer } from './ai.manager';
import { AIGoals, FieldsForGoals, GameState, GoalModifier } from './models';
import { getAccumulatedSpice, getDesire } from './shared';

interface FieldEvaluation {
  fieldId: string;
  value: number;
}

export interface ViableField {
  fieldId: string;
  value: number;
  actionType: ActionType;
  requiresInfluence?: FactionInfluence;
  accessTrough?: 'influence' | 'game-modifiers' | undefined;
  requiresInfiltration: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AIFieldEvaluationService {
  public aiGoals: FieldsForGoals | undefined;

  constructor(private settingsService: SettingsService) {
    this.settingsService.gameContent$.subscribe((x) => {
      this.aiGoals = x.aiGoals;
    });
  }

  public getPreferredFieldsForAIPlayer(
    player: Player,
    gameState: GameState,
    playerLeader: LeaderDeckCard,
    aiPlayer: AIPlayer,
    conflictEvaluation: number,
    techEvaluation: number,
    imperiumRowEvaluation: number,
    aiDifficulty: 'easy' | 'medium' | 'hard'
  ) {
    const boardFields = this.getFieldsWithAdjustedRewardsAndCosts(
      gameState,
      this.getFieldsSplitByRewardChoices(this.settingsService.boardFields)
    );

    let leaderGoalModifiers: GoalModifier[] = [];
    if (playerLeader.aiAdjustments && playerLeader.aiAdjustments.goalEvaluationModifier) {
      leaderGoalModifiers = playerLeader.aiAdjustments.goalEvaluationModifier(player, gameState);
    }

    const fieldEvaluations = this.getEvaluatedFieldsByGoals(
      player,
      aiPlayer,
      gameState,
      leaderGoalModifiers,
      boardFields,
      conflictEvaluation,
      techEvaluation,
      imperiumRowEvaluation
    );

    const adjustedFieldEvaluations = fieldEvaluations.map((x) => ({
      ...x,
      value: gameState.playerGameModifiers?.fieldMarkers?.some((y) => x.fieldId.includes(y.fieldId) && y.amount > 0)
        ? x.value + 0.1
        : x.value,
    }));

    const accessibleFields = this.getAccessibleFields(boardFields, adjustedFieldEvaluations, gameState, aiPlayer);

    const randomFactor = gameState.isOpeningTurn
      ? 0.66
      : aiDifficulty === 'hard'
      ? 0.1
      : aiDifficulty === 'medium'
      ? 0.2
      : 0.3;
    const slightlyRandomizedFields = randomizeArray(accessibleFields, randomFactor);

    return { preferredFields: slightlyRandomizedFields };
  }

  private getEvaluatedFieldsByGoals(
    player: Player,
    aiPlayer: AIPlayer,
    gameState: GameState,
    leaderGoalModifiers: GoalModifier[],
    boardFields: ActionField[],
    conflictEvaluation: number,
    techEvaluation: number,
    imperiumRowEvaluation: number
  ) {
    const fieldEvaluations: FieldEvaluation[] = [];

    if (!this.aiGoals) {
      return fieldEvaluations;
    }

    for (let [goalId, goal] of Object.entries(this.aiGoals)) {
      if (!goal.reachedGoal(player, gameState, this.aiGoals)) {
        const aiGoalId = goalId as AIGoals;

        const goalDesire =
          getDesire(goal, player, gameState, this.aiGoals) *
            (aiPlayer.personality[aiGoalId] ?? 1.0) *
            this.getGameStateModifier(aiGoalId, conflictEvaluation, techEvaluation, imperiumRowEvaluation) +
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
    return fieldEvaluations;
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

              if (accessTrough) {
                return {
                  ...fieldEvaluation,
                  actionType: x.actionType,
                  requiresInfluence: x.requiresInfluence,
                  requiresInfiltration,
                  accessTrough,
                };
              } else {
                return undefined;
              }
            }
          }
          return {
            ...fieldEvaluation,
            actionType: x.actionType,
            requiresInfiltration,
          };
        }

        return undefined;
      })
      .filter((x) => !!x) as ViableField[];

    accessibleFields.sort((a, b) => b.value - a.value);

    return accessibleFields;
  }

  getFieldsSplitByRewardChoices(fields: ActionField[]) {
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
          const { hasRewardConversion, rewardConversionIndex } = getRewardArrayAIInfos(conversionOption);
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

  getFieldsWithAdjustedRewardsAndCosts(gameState: GameState, fields: ActionField[]): ActionField[] {
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
          modifier = modifier + 0.1 * (troopRewards.amount ?? 1);
        }
        const dreadnoughtRewards = fieldRewards.find((x) => x.type === 'dreadnought');
        if (dreadnoughtRewards) {
          modifier = modifier + 0.2 * (dreadnoughtRewards.amount ?? 1);
        }
        const intrigueRewards = fieldRewards.find((x) => x.type === 'intrigue');
        if (intrigueRewards) {
          modifier = modifier + 0.05 * (intrigueRewards.amount ?? 1);
        }

        fieldRewards[combatRewardIndex].amount = modifier;
      }
      // Game Modifier Cost Adjustments
      const fieldCosts = getModifiedCostsForField(field, gameState.playerGameModifiers?.fieldCost);

      return { ...field, rewards: fieldRewards, costs: fieldCosts };
    });
  }

  private getLeaderGoalModifier(goalId: string, goalModifiers: GoalModifier[]) {
    return goalModifiers.find((x) => x.type === goalId)?.modifier ?? 0.0;
  }

  private getEventGoalModifier(goalId: AIGoals, goalModifiers: GoalModifier[]) {
    return goalModifiers.find((x) => x.type === goalId)?.modifier ?? 0.0;
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
}
