import { cloneDeep, min, sum } from 'lodash';
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
  if (!modifiers || !actionField.costs || actionField.costs.length < 1) {
    return actionField.costs ?? [];
  }

  const actionCosts = cloneDeep(actionField.costs);
  const fieldCostsType = actionCosts[0].type;

  const filteredModifiers = modifiers.filter(
    (x) =>
      x.costType === fieldCostsType &&
      (!x.actionType || x.actionType === actionField.actionType) &&
      (!x.fieldId || x.fieldId === actionField.title.en)
  );

  const costsModifier = sum(filteredModifiers.map((x) => x.amount));
  const minCostAmount = min(filteredModifiers.filter((x) => x.minCosts !== undefined).map((x) => x.minCosts));

  let remainingCostModifier = costsModifier;

  for (const costs of actionCosts as RewardWithModifier[]) {
    const costAmount = costs.amount ?? 1;

    if (remainingCostModifier > 0) {
      costs.amount = costAmount + remainingCostModifier;
      costs.modifier = 'negative';
      break;
    } else if (remainingCostModifier < 0) {
      if (Math.abs(remainingCostModifier) >= costAmount) {
        if (!minCostAmount) {
          actionCosts.shift();
          remainingCostModifier -= costAmount;
        }
      } else {
        if (minCostAmount && minCostAmount >= costAmount + remainingCostModifier) {
          costs.amount = minCostAmount;
        } else {
          costs.amount = costAmount + remainingCostModifier;
          costs.modifier = 'positive';
        }
        break;
      }
    }
  }
  return actionCosts;
}

export function getModifiedRewardsForField(
  actionField: ActionField,
  modifiers?: FieldRewardsModifier[]
): EffectWithModifier[] {
  if (!modifiers || actionField.rewards.length < 1) {
    return actionField.rewards;
  }

  const actionRewards = cloneDeep(actionField.rewards);

  const filteredModifiers = modifiers.filter(
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
