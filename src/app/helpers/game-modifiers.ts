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
  PlayerGameModifiers,
  RewardWithModifier,
  TechTileModifier,
} from '../services/game-modifier.service';
import { isImperiumDeckCard } from './cards';
import { getFlattenedEffectRewardArray } from './rewards';

export function hasFactionInfluenceModifier(
  playerGameModifier: PlayerGameModifiers | undefined,
  factionType: FactionType | undefined
) {
  if (!playerGameModifier || !playerGameModifier.factionInfluence || !factionType) {
    return false;
  } else {
    return !!playerGameModifier.factionInfluence.some((x) => x.factionType === factionType);
  }
}

export function getFactionInfluenceModifier(
  playerGameModifier: PlayerGameModifiers | undefined,
  factionType: FactionType | undefined
) {
  if (!playerGameModifier || !playerGameModifier.factionInfluence || !factionType) {
    return false;
  } else {
    return playerGameModifier.factionInfluence.find((x) => x.factionType === factionType);
  }
}

export function getCardCostModifier(card: ImperiumCard | ImperiumDeckCard, modifiers?: ImperiumRowModifier[]) {
  let result = 0;
  let minCostAmount: number | undefined;

  if (!modifiers || !card.persuasionCosts) {
    return result;
  }

  for (const modifier of modifiers) {
    if (card.faction && modifier.factionType === card.faction) {
      result += modifier.persuasionAmount;
    } else if (isImperiumDeckCard(card) && modifier.cardId === card.id) {
      result += modifier.persuasionAmount;
    }
    if (modifier.minCosts && (minCostAmount === undefined || modifier.minCosts < minCostAmount)) {
      minCostAmount = modifier.minCosts;
    }
  }

  return minCostAmount && card.persuasionCosts + result < minCostAmount ? 0 : result;
}

export function getTechTileCostModifier(card: TechTileCard, modifiers?: TechTileModifier[]) {
  let result = 0;
  let minCostAmount: number | undefined;

  if (!modifiers) {
    return result;
  }

  for (const modifier of modifiers) {
    if (modifier.techTileId === card.name.en) {
      result += modifier.spiceAmount;
    } else {
      result += modifier.spiceAmount;
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

  const flattenedModifiers = getFlattenedCostModifiers(modifiers);

  const actionCosts: RewardWithModifier[] = (cloneDeep(actionField.costs) as RewardWithModifier[]) ?? [];
  const filteredModifiers = flattenedModifiers.filter(
    (x) => (!x.actionType || x.actionType === actionField.actionType) && (!x.fieldId || x.fieldId === actionField.title.en)
  );
  if (actionCosts.length < 1) {
    for (const modifier of filteredModifiers) {
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
  const existingCostModifiers = filteredModifiers.filter((x) => actionCosts.some((y) => y.type === x.costType));

  if (existingCostModifiers.length > 0) {
    for (const costs of flattenedCostsArray) {
      const fieldCostsAmount = costs.amount ?? 1;
      const fieldCostsModifier = existingCostModifiers.find((x) => x.costType === costs.type);
      if (fieldCostsModifier) {
        if (fieldCostsModifier.amount > 0) {
          costs.amount = fieldCostsAmount + fieldCostsModifier.amount;
          costs.modifier = 'negative';
        } else {
          const newFieldCostsAmount = fieldCostsAmount + fieldCostsModifier.amount;

          if (newFieldCostsAmount > (fieldCostsModifier.minCosts ?? 0)) {
            costs.amount = newFieldCostsAmount > 1 ? newFieldCostsAmount : undefined;
            costs.modifier = 'positive';
          } else {
            flattenedCostsArray.shift();
          }
        }
      }
    }
  }

  const newCostModifiers = filteredModifiers.filter((x) => !actionCosts.some((y) => y.type === x.costType));
  for (const modifier of newCostModifiers) {
    if (modifier.amount > 0) {
      flattenedCostsArray.push({
        type: modifier.costType,
        amount: modifier.amount > 1 ? modifier.amount : undefined,
        modifier: 'negative',
      });
    }
  }

  return flattenedCostsArray;
}

export function getModifiedRewardsForField(
  actionField: ActionField,
  modifiers?: FieldRewardsModifier[]
): EffectWithModifier[] {
  if (!modifiers || actionField.rewards.length < 1) {
    return actionField.rewards;
  }

  const flattenedModifiers = getFlattenedRewardModifiers(modifiers);

  const actionRewards = cloneDeep(actionField.rewards);

  const filteredModifiers = flattenedModifiers.filter(
    (x) => (!x.actionType || x.actionType === actionField.actionType) && (!x.fieldId || x.fieldId === actionField.title.en)
  );

  for (const modifier of filteredModifiers) {
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

export function getFieldIsBlocked(actionField: ActionField, modifiers?: FieldBlockModifier[]) {
  if (!modifiers) {
    return false;
  }

  const filteredModifiers = modifiers.filter(
    (x) => (!x.actionType || x.actionType === actionField.actionType) && (!x.fieldId || x.fieldId === actionField.title.en)
  );

  return filteredModifiers.length > 0;
}

function getFlattenedCostModifiers<T extends FieldCostsModifier>(array: T[]) {
  const clonedArray = cloneDeep(array);
  const result: T[] = [];
  for (const item of clonedArray) {
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
