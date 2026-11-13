import { cloneDeep } from 'lodash';
import { ActionField, FactionType } from '../models';
import { ImperiumCard } from '../models/imperium-card';
import { TechTileCard } from '../models/tech-tile';
import { ImperiumDeckCard } from '../services/cards.service';
import {
  EffectWithModifier,
  FieldBlockModifier,
  FieldCostsModifier,
  FieldRewardsModifier,
  ImperiumRowModifier,
  LocationTakeoverTroopCostsModifier,
  PlayerGameModifiers,
  RewardWithModifier,
  TechTileModifier,
} from '../services/game-modifier.service';
import { isImperiumDeckCard } from './cards';
import { isNonStackableResourceType } from './resources';
import { getFlattenedEffectRewardArray } from './rewards';

export function hasFactionInfluenceModifier(
  playerGameModifier: PlayerGameModifiers | undefined,
  factionType: FactionType | undefined,
) {
  if (!playerGameModifier || !playerGameModifier.factionInfluence || !factionType) {
    return false;
  } else {
    return !!playerGameModifier.factionInfluence.some((x) => x.factionType === factionType);
  }
}

export function getFactionInfluenceModifier(
  playerGameModifier: PlayerGameModifiers | undefined,
  factionType: FactionType | undefined,
) {
  if (!playerGameModifier || !playerGameModifier.factionInfluence || !factionType) {
    return false;
  } else {
    return playerGameModifier.factionInfluence.find((x) => x.factionType === factionType);
  }
}

export function getImperiumCardModifier(
  card: ImperiumCard | ImperiumDeckCard,
  modifiers?: ImperiumRowModifier[],
): { costModifier: number; isBlocked: boolean } {
  let result = { costModifier: 0, isBlocked: false };
  let minCostAmount: number | undefined;

  if (!modifiers || !card.persuasionCosts) {
    return result;
  }

  for (const modifier of modifiers) {
    if (
      (!modifier.factionType && !modifier.cardId) ||
      (card.faction && modifier.factionType === card.faction) ||
      (isImperiumDeckCard(card) && modifier.cardId === card.id)
    ) {
      result.costModifier += modifier.persuasionAmount ?? 0;
      if (!result.isBlocked) {
        result.isBlocked = modifier.isBlocked ?? false;
      }
    }
    if (modifier.minCosts && (minCostAmount === undefined || modifier.minCosts < minCostAmount)) {
      minCostAmount = modifier.minCosts;
    }
  }

  return {
    costModifier: minCostAmount && card.persuasionCosts + result.costModifier < minCostAmount ? 0 : result.costModifier,
    isBlocked: result.isBlocked,
  };
}

export function getTechTileCostModifier(card: TechTileCard, modifiers?: TechTileModifier[]) {
  let result = 0;
  let minCostAmount: number | undefined;

  if (!modifiers) {
    return result;
  }

  for (const modifier of modifiers) {
    if (modifier.techTileId === card.name.en) {
      result += modifier.techAmount;
    } else {
      result += modifier.techAmount;
    }
    if (modifier.minCosts && (minCostAmount === undefined || modifier.minCosts < minCostAmount)) {
      minCostAmount = modifier.minCosts;
    }
  }

  return minCostAmount && card.costs + result < minCostAmount ? 0 : result;
}

export function getModifiedCostsForField(actionField: ActionField, modifiers?: FieldCostsModifier[]): RewardWithModifier[] {
  if (!modifiers) {
    return actionField.costs ?? [];
  }

  const actionCosts: RewardWithModifier[] = (cloneDeep(actionField.costs) as RewardWithModifier[]) ?? [];

  const flattenedModifiers = getFlattenedCostModifiersForBoardSpace(modifiers, actionField);

  if (actionCosts.length < 1) {
    for (const modifier of flattenedModifiers) {
      if (modifier.amount > 0) {
        actionCosts.push({
          type: modifier.costType,
          amount: modifier.amount > 1 ? modifier.amount : undefined,
          modifier: 'negative',
        });
      }
    }
    return actionCosts;
  }

  const flattenedCostsArray = getFlattenedEffectRewardArray(actionCosts);
  const existingCostModifiers = flattenedModifiers.filter((x) => actionCosts.some((y) => y.type === x.costType));

  if (existingCostModifiers.length > 0) {
    for (const costs of flattenedCostsArray) {
      const fieldCostsAmount = costs.amount ?? 1;
      const fieldCostsModifier = existingCostModifiers.find((x) => x.costType === costs.type);
      if (fieldCostsModifier) {
        if (fieldCostsModifier.amount > 0) {
          costs.amount = fieldCostsAmount + fieldCostsModifier.amount;
          costs.modifier = 'negative';
        } else {
          const newCostAmount = fieldCostsAmount + fieldCostsModifier.amount;
          const minCosts = fieldCostsModifier.minCosts ?? 0;
          const newFieldCostsAmount = newCostAmount < minCosts ? minCosts : newCostAmount;

          if (newFieldCostsAmount >= 1) {
            costs.amount = newFieldCostsAmount > 1 ? newFieldCostsAmount : undefined;
            costs.modifier = newFieldCostsAmount < fieldCostsAmount ? 'positive' : undefined;
          } else {
            flattenedCostsArray.shift();
          }
        }
      }
    }
  }

  const newCostModifiers = flattenedModifiers.filter((x) => !actionCosts.some((y) => y.type === x.costType));
  for (const modifier of newCostModifiers) {
    if (modifier.amount > 0) {
      flattenedCostsArray.push({
        type: modifier.costType,
        amount: modifier.amount > 1 ? modifier.amount : undefined,
        modifier: 'negative',
      });
    }
  }

  const result: RewardWithModifier[] = [];
  for (const flattenedCosts of flattenedCostsArray) {
    if (isNonStackableResourceType(flattenedCosts.type)) {
      result.push(...splitNonStackableResource(flattenedCosts));
    } else {
      result.push(flattenedCosts);
    }
  }
  return result;
}

function splitNonStackableResource(reward: RewardWithModifier): RewardWithModifier[] {
  const amount = reward.amount ?? 1;
  return Array.from({ length: amount }, () => ({ ...reward, amount: undefined }));
}

export function getModifiedRewardsForField(
  actionField: ActionField,
  modifiers?: FieldRewardsModifier[],
): EffectWithModifier[] {
  if (!modifiers || modifiers.length < 1) {
    return actionField.rewards;
  }

  const filteredModifiers = modifiers.filter(
    (x) => (!x.actionType || x.actionType === actionField.actionType) && (!x.fieldId || x.fieldId === actionField.title.en),
  );

  const flattenedModifiers = getFlattenedRewardModifiers(filteredModifiers);

  const actionRewards = cloneDeep(actionField.rewards);

  for (const modifier of flattenedModifiers) {
    let remainingRewardModifier = modifier.amount;

    for (const reward of actionRewards as RewardWithModifier[]) {
      if (reward.type === modifier.rewardType) {
        const rewardAmount = reward.amount ?? 1;

        if (remainingRewardModifier > 0) {
          reward.amount = rewardAmount + remainingRewardModifier;
          reward.modifier = 'positive';
          remainingRewardModifier -= rewardAmount;
          break;
        } else if (remainingRewardModifier < 0) {
          if (Math.abs(remainingRewardModifier) >= rewardAmount) {
            actionRewards.shift();
            remainingRewardModifier += rewardAmount;
          } else {
            reward.amount = rewardAmount + remainingRewardModifier;
            reward.modifier = 'negative';
            remainingRewardModifier = 0;
            break;
          }
        }
      }
    }

    if (remainingRewardModifier > 0) {
      actionRewards.push({
        type: modifier.rewardType,
        amount: remainingRewardModifier !== 1 ? remainingRewardModifier : undefined,
      });
    }
  }

  return actionRewards;
}

export function getModifiedLocationTakeoverTroopCosts(
  defaultLocationTakeoverTroopCosts: number,
  boardSpace?: ActionField,
  modifiers?: LocationTakeoverTroopCostsModifier[],
) {
  if (!modifiers || modifiers.length < 1 || !boardSpace) {
    return defaultLocationTakeoverTroopCosts;
  }

  const filteredModifiers = modifiers.filter(
    (x) => x.locationType === boardSpace.actionType || x.locationId === boardSpace.title.en,
  );

  const totalModifier = filteredModifiers.reduce((sum, modifier) => sum + modifier.amount, 0);
  return Math.max(0, defaultLocationTakeoverTroopCosts + totalModifier);
}

export function getFieldIsBlocked(actionField: ActionField, modifiers?: FieldBlockModifier[]) {
  if (!modifiers) {
    return false;
  }

  const filteredModifiers = modifiers.filter(
    (x) => (!x.actionType || x.actionType === actionField.actionType) && (!x.fieldId || x.fieldId === actionField.title.en),
  );

  return filteredModifiers.length > 0;
}

function getFlattenedCostModifiersForBoardSpace<T extends FieldCostsModifier>(array: T[], targetBoardSpace: ActionField) {
  const clonedArray = cloneDeep(array);

  const result: T[] = [];
  for (const item of clonedArray) {
    const affectsBoardSpace =
      (!item.actionType && !item.fieldId) ||
      (item.actionType && item.actionType === targetBoardSpace.actionType) ||
      (item.fieldId && item.fieldId === targetBoardSpace.title.en);

    if (affectsBoardSpace) {
      const index = result.findIndex((x) => x.costType === item.costType);
      const resultItem = result[index];
      if (resultItem) {
        if (resultItem.amount) {
          resultItem.amount += item.amount ?? 1;
        } else {
          resultItem.amount = 1 + (item.amount ?? 1);
        }
        if (item.minCosts) {
          if (!resultItem.minCosts || item.minCosts < resultItem.minCosts) {
            resultItem.minCosts = item.minCosts;
          }
        }
      } else {
        result.push(item);
      }
    }
  }
  return result;
}

function getFlattenedRewardModifiers<T extends FieldRewardsModifier>(array: T[]) {
  const clonedArray = cloneDeep(array);
  const result: T[] = [];
  for (const item of clonedArray) {
    const index = result.findIndex((x) => x.rewardType === item.rewardType);
    const resultItem = result[index];
    if (resultItem) {
      if (resultItem.amount) {
        resultItem.amount += item.amount ?? 1;
      } else {
        resultItem.amount = 1 + (item.amount ?? 1);
      }
    } else {
      result.push(item);
    }
  }
  return result;
}
