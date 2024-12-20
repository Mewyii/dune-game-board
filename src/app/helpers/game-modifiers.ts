import { cloneDeep, min, sum } from 'lodash';
import { ActionField, FactionType } from '../models';
import { ImperiumCard } from '../models/imperium-card';
import { TechTileCard } from '../models/tech-tile';
import { ImperiumDeckCard } from '../services/cards.service';
import {
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
    return !!playerGameModifier.factionInfluence[factionType];
  }
}

export function getFactionInfluenceModifier(
  playerGameModifier: PlayerGameModifiers | undefined,
  factionType: FactionType | undefined
) {
  if (!playerGameModifier || !playerGameModifier.factionInfluence || !factionType) {
    return false;
  } else {
    return playerGameModifier.factionInfluence[factionType];
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
  if (modifiers && actionField.costs) {
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
      let costAmount = costs.amount ?? 1;

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
  } else {
    return actionField.costs ?? [];
  }
}

export function getModifiedRewardsForField(
  actionField: ActionField,
  modifiers?: FieldRewardsModifier[]
): RewardWithModifier[] {
  if (modifiers && actionField.rewards) {
    const actionRewards = cloneDeep(actionField.rewards);
    const fieldCostsType = actionRewards[0].type;

    const rewardModifier = sum(
      modifiers
        .filter(
          (x) =>
            x.rewardType === fieldCostsType &&
            (!x.actionType || x.actionType === actionField.actionType) &&
            (!x.fieldId || x.fieldId === actionField.title.en)
        )
        .map((x) => x.amount)
    );

    let remainingReward = rewardModifier;

    for (const reward of actionRewards as RewardWithModifier[]) {
      let costAmount = reward.amount ?? 1;

      if (remainingReward > 0) {
        reward.amount = costAmount + remainingReward;
        reward.modifier = 'positive';
        break;
      } else if (remainingReward < 0) {
        if (Math.abs(remainingReward) >= costAmount) {
          actionRewards.shift();
          remainingReward -= costAmount;
        } else {
          reward.amount = costAmount - remainingReward;
          reward.modifier = 'negative';
          break;
        }
      }
    }
    return actionRewards;
  } else {
    return actionField.rewards ?? [];
  }
}
