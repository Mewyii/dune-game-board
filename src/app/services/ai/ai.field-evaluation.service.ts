import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { AI } from 'src/app/constants/board-settings';
import { getAccumulatedSpice } from 'src/app/helpers/ai';
import { getCardsFieldAccess } from 'src/app/helpers/cards';
import { randomizeArray } from 'src/app/helpers/common';
import { isFactionScoreType } from 'src/app/helpers/faction-score';
import { getModifiedCostsForField, getModifiedRewardsForField } from 'src/app/helpers/game-modifiers';
import { isResourceType } from 'src/app/helpers/resources';
import {
  getFlattenedEffectRewardArray,
  getRewardArrayAIInfos,
  isRewardEffect,
  playerCanPayCosts,
} from 'src/app/helpers/rewards';
import { ActionField, ActionType, EffectReward, FactionInfluence } from 'src/app/models';
import { GameState, RewardModifier } from 'src/app/models/ai';
import { Player } from 'src/app/models/player';
import { BoardSpacesService } from '../board-spaces.service';
import { LeaderDeckCard } from '../leaders.service';
import { Resources } from '../player-resources.service';
import { SettingsService } from '../settings.service';
import { AIPlayer } from './ai-players.service';
import { AIEffectEvaluationService } from './ai.effect-evaluation.service';

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
  ai: AI | undefined;

  constructor(
    private settingsService: SettingsService,
    private boardSpacesService: BoardSpacesService,
    private aiEffectEvaluationService: AIEffectEvaluationService,
  ) {
    this.settingsService.AI$.subscribe((x) => {
      this.ai = x;
    });
  }

  getPreferredFieldsForAIPlayer(
    player: Player,
    gameState: GameState,
    playerLeader: LeaderDeckCard,
    aiPlayer: AIPlayer,
    conflictEvaluation: number,
    techEvaluation: number,
    imperiumRowEvaluation: number,
    aiDifficulty: 'easy' | 'medium' | 'hard',
  ) {
    const boardFields = this.getFieldsWithAdjustedRewardsAndCosts(
      gameState,
      this.getFieldsSplitByRewardChoices(this.boardSpacesService.boardSpaces),
    );

    let leaderGoalModifiers: RewardModifier[] = [];
    if (playerLeader.aiAdjustments && playerLeader.aiAdjustments.rewardEvaluationModifier) {
      leaderGoalModifiers = playerLeader.aiAdjustments.rewardEvaluationModifier(player, gameState);
    }

    const fieldEvaluations = this.getEvaluatedFieldsByGoals(
      player,
      aiPlayer,
      gameState,
      leaderGoalModifiers,
      boardFields,
      conflictEvaluation,
      techEvaluation,
      imperiumRowEvaluation,
    );

    const accessibleFields = this.getAccessibleFields(
      boardFields,
      fieldEvaluations,
      gameState,
      aiPlayer,
      gameState.playerResources,
    );

    accessibleFields.sort((a, b) => b.value - a.value);

    const randomFactor = gameState.isOpeningTurn
      ? 0.3
      : aiDifficulty === 'hard'
        ? 0.025
        : aiDifficulty === 'medium'
          ? 0.075
          : 0.15;
    const slightlyRandomizedFields = randomizeArray(accessibleFields, randomFactor);

    return { preferredFields: slightlyRandomizedFields };
  }

  private getEvaluatedFieldsByGoals(
    player: Player,
    aiPlayer: AIPlayer,
    gameState: GameState,
    leaderGoalModifiers: RewardModifier[],
    boardSpaces: ActionField[],
    conflictEvaluation: number,
    techEvaluation: number,
    imperiumRowEvaluation: number,
  ) {
    const fieldEvaluations: FieldEvaluation[] = [];

    if (!this.ai) {
      return fieldEvaluations;
    }

    for (const boardSpace of boardSpaces) {
      const boardSpaceId = boardSpace.title.en;

      let boardSpaceEvaluation = 0;
      for (const reward of boardSpace.rewards) {
        if (isRewardEffect(reward)) {
          const rewardEvaluation = this.aiEffectEvaluationService.getRewardEffectEvaluationForTurnState(
            reward.type,
            reward.amount ?? 1,
            player,
            gameState,
            boardSpace,
          );
          boardSpaceEvaluation += rewardEvaluation;
        }
      }
      if (boardSpace.costs) {
        if (playerCanPayCosts(boardSpace.costs, player, gameState)) {
          for (const cost of boardSpace.costs) {
            const rewardEvaluation = this.aiEffectEvaluationService.getRewardEffectEvaluationForTurnState(
              cost.type,
              cost.amount ?? 1,
              player,
              gameState,
              boardSpace,
            );
            boardSpaceEvaluation -= rewardEvaluation;
          }
        } else {
          boardSpaceEvaluation = 0;
        }
      }

      boardSpaceEvaluation = Math.round(boardSpaceEvaluation * 100) / 100;

      if (boardSpaceEvaluation > 0) {
        const fieldEvaluation = fieldEvaluations.find((x) => x.fieldId === boardSpaceId);
        if (fieldEvaluation) {
          if (fieldEvaluation.value < boardSpaceEvaluation) {
            fieldEvaluation.value = boardSpaceEvaluation;
          }
        } else {
          fieldEvaluations.push({ fieldId: boardSpaceId, value: boardSpaceEvaluation });
        }
      }
    }

    // for (let [goalId, goal] of Object.entries(this.aiGoals)) {
    //   if (!goal.reachedGoal(player, gameState, this.aiGoals)) {
    //     const aiGoalId = goalId as AIGoals;

    //     const goalDesire =
    //       getDesire(goal, player, gameState, this.aiGoals) *
    //         (aiPlayer.personality[aiGoalId] ?? 1.0) *
    //         this.getGameStateModifier(aiGoalId, conflictEvaluation, techEvaluation, imperiumRowEvaluation) +
    //       this.getLeaderGoalModifier(goalId, leaderGoalModifiers);

    //     let desireCanBeFullfilled = false;

    //     if (goal.goalIsReachable(player, gameState, this.aiGoals) && goal.desiredFields) {
    //       for (let [fieldId, getFieldValue] of Object.entries(goal.desiredFields(boardSpaces))) {
    //         const fieldValue = getFieldValue(player, gameState, this.aiGoals) * goalDesire;

    //         const index = fieldEvaluations.findIndex((x) => x.fieldId === fieldId);
    //         if (index > -1) {
    //           fieldEvaluations[index].value = Math.round((fieldEvaluations[index].value + fieldValue) * 100) / 100;
    //         } else {
    //           fieldEvaluations.push({ fieldId, value: Math.round(fieldValue * 100) / 100 });
    //         }

    //         desireCanBeFullfilled = true;
    //       }
    //     }

    //     if (!desireCanBeFullfilled) {
    //       for (let [fieldId, getFieldValue] of Object.entries(goal.viableFields(boardSpaces))) {
    //         const fieldValue = getFieldValue(player, gameState, this.aiGoals) * goalDesire;

    //         const index = fieldEvaluations.findIndex((x) => x.fieldId === fieldId);
    //         if (index > -1) {
    //           fieldEvaluations[index].value = Math.round((fieldEvaluations[index].value + fieldValue) * 100) / 100;
    //         } else {
    //           fieldEvaluations.push({ fieldId, value: Math.round(fieldValue * 100) / 100 });
    //         }
    //       }
    //     }
    //   }
    // }
    return fieldEvaluations;
  }

  private getAccessibleFields(
    boardFields: ActionField[],
    fieldEvaluations: FieldEvaluation[],
    gameState: GameState,
    aiPlayer: AIPlayer,
    playerResources: Resources,
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

        if (x.costs) {
          let canPayCosts = true;
          for (const cost of getFlattenedEffectRewardArray(x.costs)) {
            if (isResourceType(cost.type)) {
              const costAmount = cost.amount ?? 1;
              const playerResourceAmount = playerResources[cost.type] ?? 0;
              if (playerResourceAmount < costAmount) {
                canPayCosts = false;
                break;
              }
            }
          }
          if (!canPayCosts) {
            return undefined;
          }
        }

        const hasOwnAgentOnField = gameState.agentsOnFields.some(
          (y) => x.title.en.includes(y.fieldId) && y.playerId === aiPlayer.playerId,
        );
        const hasEnemyAgentOnField = gameState.agentsOnFields.some(
          (y) => x.title.en.includes(y.fieldId) && y.playerId !== aiPlayer.playerId,
        );

        const hasEnemyAcessTroughGameModidifers = gameState.playerEnemyFieldTypeAcessTroughGameModifiers.some(
          (y) => y === x.actionType,
        );
        const hasEnemyAcessTroughInfiltration = gameState.playerEnemyFieldTypeAcessTroughCards.some(
          (y) => y === x.actionType,
        );

        if (
          hasOwnAgentOnField ||
          (hasEnemyAgentOnField && !hasEnemyAcessTroughGameModidifers && !hasEnemyAcessTroughInfiltration)
        ) {
          return undefined;
        }

        const requiresInfiltration = hasEnemyAgentOnField && hasEnemyAcessTroughInfiltration;

        const fieldEvaluation = fieldEvaluations.find((y) => y.fieldId === x.title.en);
        if (fieldEvaluation) {
          let accessTrough: 'influence' | 'game-modifiers' | undefined;
          const hasCardActionType = fieldAccessFromCards.some((actionType) => x.actionType === actionType);

          if (x.requiresInfluence) {
            const hasEnoughFactionInfluence = gameState.playerFactionFriendships.some(
              (y) => y === x.requiresInfluence!.type,
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

            if (hasCardActionType && accessTrough) {
              return {
                ...fieldEvaluation,
                actionType: x.actionType,
                requiresInfluence: x.requiresInfluence,
                requiresInfiltration,
                accessTrough,
              };
            }
          } else if (hasCardActionType) {
            return {
              ...fieldEvaluation,
              actionType: x.actionType,
              requiresInfluence: x.requiresInfluence,
              requiresInfiltration,
            };
          }
        }
        return undefined;
      })
      .filter((x) => !!x) as ViableField[];

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
          title: { ...field.title, en: field.title.en + ' (card-trash)' },
          rewards: field.rewards.map((x) => ({ ...x, type: x.type === 'card-draw-or-destroy' ? 'card-trash' : x.type })),
        } as ActionField;

        result.push(cardDrawOption);
        result.push(cardDestroyOption);
      } else if (field.rewards.some((x) => x.type === 'helper-or' || x.type === 'helper-or-horizontal')) {
        const separatorIndex = field.rewards.findIndex((x) => x.type === 'helper-or' || x.type === 'helper-or-horizontal');

        const leftOptionRewardType = field.rewards[separatorIndex - 1].type.toLocaleLowerCase();
        const leftOptionField = {
          ...field,
          title: { ...field.title, en: field.title.en + ' (' + leftOptionRewardType + ')' },
          rewards: field.rewards.filter((x, index) => index !== separatorIndex && index !== separatorIndex + 1),
        };

        const rightOptionRewardType = field.rewards[separatorIndex + 1].type.toLocaleLowerCase();
        const rightOptionField = {
          ...field,
          title: { ...field.title, en: field.title.en + ' (' + rightOptionRewardType + ')' },
          rewards: field.rewards.filter((x, index) => index !== separatorIndex && index !== separatorIndex - 1),
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

      // Field Marker Adjustments
      const playerFieldMarker = gameState.playerGameModifiers?.fieldMarkers?.find(
        (marker) => field.title.en.includes(marker.fieldId) && marker.amount > 0,
      );
      if (playerFieldMarker) {
        fieldRewards.push({ type: 'signet', amount: playerFieldMarker.amount });
      }

      // Faction Reward Adjustments
      if (isFactionScoreType(field.actionType)) {
        fieldRewards.push({ type: `faction-influence-up-${field.actionType}` });

        const factionInfluenceRewards = this.settingsService.factionInfluenceRewards.find(
          (x) => x.factionId === field.actionType,
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
        let modifier = 0.3;

        const playerGarrisonUnits =
          gameState.playerCombatUnits.troopsInGarrison + gameState.playerCombatUnits.shipsInGarrison;

        const troopRewards = fieldRewards.find((x) => x.type === 'troop')?.amount ?? 0;
        const dreadnoughtRewards = fieldRewards.find((x) => x.type === 'dreadnought')?.amount ?? 0;

        const deployableUnits = playerGarrisonUnits + troopRewards + dreadnoughtRewards;
        const limitedDeployableUnits =
          deployableUnits > gameState.gameSettings.combatMaxDeployableUnits
            ? gameState.gameSettings.combatMaxDeployableUnits
            : deployableUnits;

        modifier = modifier + 0.1 * limitedDeployableUnits;

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

  // private getLeaderGoalModifier(goalId: string, goalModifiers: GoalModifier[]) {
  //   return goalModifiers.find((x) => x.type === goalId)?.modifier ?? 0.0;
  // }

  // private getGameStateModifier(
  //   goal: AIGoals,
  //   conflictEvaluation: number,
  //   techEvaluation: number,
  //   imperiumRowEvaluation: number,
  // ) {
  //   let modifier = 1.0;

  //   if (goal === 'enter-combat') {
  //     modifier = 0.5 + conflictEvaluation;
  //   } else if (goal === 'troops') {
  //     modifier = (0.5 + conflictEvaluation + 2) / 3;
  //   } else if (goal === 'dreadnought') {
  //     modifier = (1.5 - conflictEvaluation + 1) / 2;
  //   } else if (goal === 'tech') {
  //     modifier = 0.5 + techEvaluation;
  //   } else if (goal === 'draw-cards' || goal === 'get-board-persuasion') {
  //     modifier = 0.5 + imperiumRowEvaluation;
  //   } else if (goal === 'high-council') {
  //     modifier = (0.5 + imperiumRowEvaluation + 1) / 2;
  //   }

  //   return modifier;
  // }
}
