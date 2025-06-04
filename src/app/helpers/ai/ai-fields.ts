import { FieldsForGoals, GameState } from 'src/app/models/ai';
import { FactionType } from '../../models/faction';
import { ActionField } from '../../models/location';
import { Player } from '../../models/player';
import { Resource } from '../../models/resource';
import { EffectRewardType } from '../../models/reward';
import { getNumberAverage, getNumberMax, normalizeNumber } from '../common';
import { isResourceArray } from '../resources';
import { isChoiceEffect, isConversionEffect } from '../rewards';
import { getCostAdjustedDesire, getRewardAmountFromArray } from './ai-goals';

export function getViableBoardFieldsForFaction(
  fields: ActionField[],
  factionType: FactionType
): { [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number } {
  const factionFields = fields.filter((x) => x.actionType === factionType);
  const viableFields: {
    [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number;
  } = {};

  for (const field of factionFields) {
    const baseFieldDesire = 0.5;

    if (field.costs && isResourceArray(field.costs)) {
      viableFields[field.title.en] = (player, gameState, goals) =>
        getCostAdjustedDesire(player, field.costs as Resource[], baseFieldDesire);
    } else {
      viableFields[field.title.en] = () => baseFieldDesire;
    }
  }

  return viableFields;
}

export function getViableBoardFields(
  fields: ActionField[],
  rewardType: EffectRewardType,
  adjustForCosts = true,
  maxRewardAmountOverride?: number
): { [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number } {
  const fieldsWithReward = fields.filter((x) => x.rewards.some((y) => y.type === rewardType));
  const viableFields: {
    [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number;
  } = {};

  const fieldsRewards = fieldsWithReward.map((x) => x.rewards.filter((x) => x.type === rewardType));
  let maxRewardAmount = 0;

  if (!maxRewardAmountOverride) {
    const fieldRewardAmounts: number[] = [];
    for (const fieldRewards of fieldsRewards) {
      let fieldRewardAmount = 0;
      for (const fieldReward of fieldRewards) {
        if (!isChoiceEffect(fieldReward) && !isConversionEffect(fieldReward)) {
          fieldRewardAmount += fieldReward.amount ?? 1;
        }
      }

      fieldRewardAmounts.push(fieldRewardAmount);
    }

    const max = getNumberMax(fieldRewardAmounts);
    const avg = getNumberAverage(fieldRewardAmounts);
    maxRewardAmount = (max * 2 + avg) / 3;
  } else {
    maxRewardAmount = maxRewardAmountOverride;
  }

  for (const field of fieldsWithReward) {
    const baseFieldDesire = normalizeNumber(getRewardAmountFromArray(field.rewards, rewardType), maxRewardAmount, 0);

    if (adjustForCosts && field.costs && isResourceArray(field.costs)) {
      viableFields[field.title.en] = (player, gameState, goals) =>
        getCostAdjustedDesire(player, field.costs as Resource[], baseFieldDesire);
    } else {
      viableFields[field.title.en] = () => baseFieldDesire;
    }
  }

  return viableFields;
}
