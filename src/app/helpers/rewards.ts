import { cloneDeep } from 'lodash';
import {
  combatUnitTypes,
  Effect,
  EffectChoice,
  EffectChoiceConversionMultiplierOrReward,
  effectChoices,
  EffectChoiceType,
  EffectCondition,
  EffectConditionChoiceConversionMultiplierOrReward,
  effectConditions,
  EffectConversion,
  EffectConversionMultiplierOrReward,
  effectConversions,
  EffectConversionType,
  EffectMultiplier,
  EffectMultiplierOrReward,
  effectMultipliers,
  EffectMultiplierType,
  EffectPlayerTurnTiming,
  EffectReward,
  effectRewards,
  EffectRewardType,
  EffectTiming,
  EffectTimingConditionChoiceConversionMultiplierOrReward,
  effectTimings,
  EffectType,
  resourceTypes,
  RewardArrayInfo,
  StructuredChoiceEffect,
  StructuredConversionEffect,
  StructuredEffect,
  StructuredEffectCondition,
  StructuredEffectTiming,
  StructuredRewardEffect,
} from '../models';
import { GameState } from '../models/ai';
import { Player } from '../models/player';
import { getPlayerCombatStrength } from './ai';
import { getPlayerdreadnoughtCount } from './combat-units';
import { getFactionScoreTypeFromCost } from './faction-score';
import { isResourceType } from './resources';

export function isFactionScoreReward(reward: Effect) {
  if (
    reward.type === 'faction-influence-up-bene' ||
    reward.type === 'faction-influence-up-fremen' ||
    reward.type === 'faction-influence-up-emperor' ||
    reward.type === 'faction-influence-up-guild'
  ) {
    return true;
  }
  return false;
}

export function isFactionScoreRewardType(
  rewardType: EffectRewardType
): rewardType is
  | 'faction-influence-up-bene'
  | 'faction-influence-up-fremen'
  | 'faction-influence-up-emperor'
  | 'faction-influence-up-guild' {
  if (
    rewardType === 'faction-influence-up-bene' ||
    rewardType === 'faction-influence-up-fremen' ||
    rewardType === 'faction-influence-up-emperor' ||
    rewardType === 'faction-influence-up-guild'
  ) {
    return true;
  }
  return false;
}

export function isFactionScoreCost(reward: Effect) {
  if (
    reward.type === 'faction-influence-down-bene' ||
    reward.type === 'faction-influence-down-fremen' ||
    reward.type === 'faction-influence-down-emperor' ||
    reward.type === 'faction-influence-down-guild'
  ) {
    return true;
  }
  return false;
}

export function isFactionScoreCostType(
  rewardType: EffectRewardType
): rewardType is
  | 'faction-influence-down-bene'
  | 'faction-influence-down-fremen'
  | 'faction-influence-down-emperor'
  | 'faction-influence-down-guild' {
  if (
    rewardType === 'faction-influence-down-bene' ||
    rewardType === 'faction-influence-down-fremen' ||
    rewardType === 'faction-influence-down-emperor' ||
    rewardType === 'faction-influence-down-guild'
  ) {
    return true;
  }
  return false;
}

export function isTimingEffect(reward: Effect): reward is EffectTiming {
  return effectTimings.some((x) => x === reward.type);
}

export function isConditionalEffect(reward: Effect): reward is EffectCondition {
  return effectConditions.some((x) => x === reward.type);
}

export function isChoiceEffect(reward: Effect): reward is EffectChoice {
  return effectChoices.some((x) => x === reward.type);
}

export function isConversionEffect(reward: Effect): reward is EffectConversion {
  return effectConversions.some((x) => x === reward.type);
}

export function isMultiplierEffect(reward: Effect): reward is EffectMultiplier {
  return effectMultipliers.some((x) => x === reward.type);
}

export function isConversionEffectType(input: string): input is EffectConversionType {
  return effectConversions.some((x) => x === input);
}

export function isChoiceEffectType(input: string): input is EffectChoiceType {
  return effectChoices.some((x) => x === input);
}

export function isMultiplierEffectType(input: string): input is EffectMultiplierType {
  return effectMultipliers.some((x) => x === input);
}

export function isRewardEffect(reward: Effect): reward is EffectReward {
  return (
    effectRewards.some((x) => x === reward.type) ||
    resourceTypes.some((x) => x === reward.type) ||
    combatUnitTypes.some((x) => x === reward.type)
  );
}

export function isRewardEffectType(type: EffectType): type is EffectRewardType {
  return (
    effectRewards.some((x) => x === type) || resourceTypes.some((x) => x === type) || combatUnitTypes.some((x) => x === type)
  );
}

export function isStructuredChoiceEffect(effect: StructuredEffect): effect is StructuredChoiceEffect {
  return effectChoices.some((x) => x === effect.type);
}

export function isStructuredConversionEffect(effect: StructuredEffect): effect is StructuredConversionEffect {
  return effectConversions.some((x) => x === effect.type);
}

export function isStructuredRewardEffect(effect: StructuredEffect): effect is StructuredRewardEffect {
  return effect.type === 'reward';
}

export function isNegativeEffect(effect: Effect) {
  if (
    effect.type === 'card-discard' ||
    effect.type === 'card-destroy' ||
    effect.type === 'loose-troop' ||
    effect.type === 'intrigue-trash' ||
    effect.type === 'dreadnought-retreat' ||
    effect.type === 'troop-retreat'
  ) {
    return true;
  } else {
    return effect.amount && effect.amount < 0;
  }
}

export function getFlattenedEffectRewardArray<T extends EffectReward>(array: T[]) {
  const clonedArray = cloneDeep(array);
  const result: T[] = [];
  for (const item of clonedArray) {
    const index = result.findIndex((x) => x.type === item.type);
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

export function getStructuredEffectArrayInfos(effects: Effect[]) {
  const result: StructuredEffect[] = [];

  const flatEffects = getSeparatedEffectArrays(effects);
  for (const flatEffect of flatEffects) {
    const [nonTimingEffects, structuredEffectTiming] = getStructuredEffectTimingIfPossible(flatEffect);
    const [nonConditionalEffects, structuredEffectCondition] = getStructuredEffectConditionIfPossible(nonTimingEffects);

    const [nonChoiceEffects, structuredChoiceEffect] = getStructuredChoiceEffectIfPossible(nonConditionalEffects);
    if (structuredChoiceEffect) {
      result.push({ timing: structuredEffectTiming, condition: structuredEffectCondition, ...structuredChoiceEffect });
    } else {
      const [nonConversionEffects, structuredConversionEffect] = getStructuredConversionEffectIfPossible(nonChoiceEffects);
      if (structuredConversionEffect) {
        result.push({ timing: structuredEffectTiming, condition: structuredEffectCondition, ...structuredConversionEffect });
      } else {
        const structuredEffectRewards = getStructuredEffectReward(nonConversionEffects);
        result.push({ timing: structuredEffectTiming, condition: structuredEffectCondition, ...structuredEffectRewards });
      }
    }
  }
  return result;
}

export function getSeparatedEffectArrays(effects: Effect[]) {
  const result: EffectTimingConditionChoiceConversionMultiplierOrReward[][] = [];
  let current: EffectTimingConditionChoiceConversionMultiplierOrReward[] = [];

  for (const item of effects) {
    if (item.type === 'helper-separator') {
      result.push(current);
      current = [];
    } else {
      current.push(item);
    }
  }
  result.push(current);

  return result;
}

export function getStructuredEffectTimingIfPossible(
  effects: EffectTimingConditionChoiceConversionMultiplierOrReward[]
): [EffectConditionChoiceConversionMultiplierOrReward[], StructuredEffectTiming | undefined] {
  for (const [index, effect] of effects.entries()) {
    if (isTimingEffect(effect)) {
      const type = effect.type;
      const effectsWithoutTiming = effects.slice(index + 1) as EffectConditionChoiceConversionMultiplierOrReward[];
      return [effectsWithoutTiming, { type }];
    }
  }
  return [effects as EffectConditionChoiceConversionMultiplierOrReward[], undefined];
}

export function getStructuredEffectConditionIfPossible(
  effects: EffectConditionChoiceConversionMultiplierOrReward[]
): [EffectChoiceConversionMultiplierOrReward[], StructuredEffectCondition | undefined] {
  for (const [index, effect] of effects.entries()) {
    if (isConditionalEffect(effect)) {
      const effectsWithoutCondition = effects.slice(index + 1) as EffectChoiceConversionMultiplierOrReward[];

      if (effect.type === 'condition-connection') {
        const conditionalEffect = {
          type: effect.type,
          faction: effect.faction ?? 'emperor',
        };
        return [effectsWithoutCondition, conditionalEffect];
      } else if (effect.type === 'condition-influence') {
        const conditionalEffect = {
          type: effect.type,
          faction: effect.faction ?? 'emperor',
          amount: effect.amount ?? 0,
        };
        return [effectsWithoutCondition, conditionalEffect];
      } else if (effect.type === 'condition-high-council-seat') {
        const conditionalEffect = {
          type: effect.type,
        };
        return [effectsWithoutCondition, conditionalEffect];
      } else if (effect.type === 'condition-no-high-council-seat') {
        const conditionalEffect = {
          type: effect.type,
        };
        return [effectsWithoutCondition, conditionalEffect];
      }
    }
  }
  return [effects as EffectChoiceConversionMultiplierOrReward[], undefined];
}

export function getStructuredChoiceEffectIfPossible(
  effects: EffectChoiceConversionMultiplierOrReward[]
): [EffectConversionMultiplierOrReward[], undefined] | [undefined, StructuredChoiceEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isChoiceEffect(effect)) {
      let structuredLeftEffect = undefined;
      let structuredRightEffect = undefined;

      const leftEffects = effects.slice(0, index) as EffectConversionMultiplierOrReward[];
      const [nonConversionEffectLeft, conversionEffectLeft] = getStructuredConversionEffectIfPossible(leftEffects);
      if (conversionEffectLeft) {
        structuredLeftEffect = conversionEffectLeft;
      } else {
        structuredLeftEffect = getStructuredEffectReward(nonConversionEffectLeft);
      }

      const rightEffects = effects.slice(index + 1) as EffectConversionMultiplierOrReward[];
      const [nonConversionEffectRight, conversionEffectRight] = getStructuredConversionEffectIfPossible(rightEffects);
      if (conversionEffectRight) {
        structuredRightEffect = conversionEffectRight;
      } else {
        structuredRightEffect = getStructuredEffectReward(nonConversionEffectRight);
      }

      const choiceEffect = {
        type: effect.type,
        effectLeft: structuredLeftEffect,
        effectRight: structuredRightEffect,
      };
      return [undefined, choiceEffect];
    }
  }
  return [effects as EffectConversionMultiplierOrReward[], undefined];
}

export function getStructuredConversionEffectIfPossible(
  effects: EffectConversionMultiplierOrReward[]
): [EffectMultiplierOrReward[], undefined] | [undefined, StructuredConversionEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isConversionEffect(effect)) {
      const costsEffect = effects.slice(0, index) as EffectMultiplierOrReward[];
      const rewardsEffect = effects.slice(index + 1) as EffectMultiplierOrReward[];

      const structuredCosts = getStructuredEffectReward(costsEffect);
      const structuredRewards = getStructuredEffectReward(rewardsEffect);
      const conversionEffect = {
        type: effect.type,
        effectCosts: structuredCosts,
        effectConversions: structuredRewards,
      };
      return [undefined, conversionEffect];
    }
  }
  return [effects as EffectMultiplierOrReward[], undefined];
}

export function getStructuredEffectReward(effects: EffectMultiplierOrReward[]): StructuredRewardEffect {
  for (const [index, effect] of effects.entries()) {
    if (isMultiplierEffect(effect)) {
      const multiplierEffect = {
        type: 'reward',
        multiplier: effect,
        effectRewards: effects.slice(index + 1) as EffectReward[],
      } as StructuredRewardEffect;
      return multiplierEffect;
    }
  }
  return { type: 'reward', effectRewards: effects as EffectReward[] };
}

export function isTimingFullfilled(
  timingEffect: StructuredEffectTiming,
  player: Player,
  gameState: Pick<GameState, 'currentRound' | 'playerAgentsOnFields' | 'playerTurnInfos' | 'currentRoundPhase'>
) {
  let timingFullfilled = false;
  if (timingEffect.type === 'timing-game-start') {
    if (gameState.currentRoundPhase === 'select leaders' && gameState.currentRound === 1) {
      timingFullfilled = true;
    }
  } else if (timingEffect.type === 'timing-round-start') {
    const hasPlacedAgentThisRound = gameState.playerAgentsOnFields.length > 0;
    if (player.turnState === 'agent-placement' && player.turnNumber < 2 && !hasPlacedAgentThisRound) {
      timingFullfilled = true;
    }
  } else if (timingEffect.type === 'timing-turn-start') {
    if (player.turnState === 'agent-placement' && !gameState.playerTurnInfos?.agentPlacedOnFieldId) {
      timingFullfilled = true;
    }
  } else if (timingEffect.type === 'timing-reveal-turn') {
    if (player.turnState === 'reveal') {
      timingFullfilled = true;
    }
  }
  return timingFullfilled;
}

export function isConditionFullfilled(
  conditionEffect: StructuredEffectCondition,
  player: Player,
  gameState: Pick<GameState, 'playerCardsFactionsInPlay' | 'playerHandCardsFactions' | 'playerScore'>,
  timing: EffectPlayerTurnTiming = 'agent-placement'
) {
  let conditionFullfilled = false;
  if (conditionEffect.type === 'condition-connection') {
    if (timing === 'agent-placement') {
      if (gameState.playerCardsFactionsInPlay[conditionEffect.faction] > 0) {
        conditionFullfilled = true;
      }
    } else {
      if (
        gameState.playerCardsFactionsInPlay[conditionEffect.faction] > 0 ||
        gameState.playerHandCardsFactions[conditionEffect.faction] > 0
      ) {
        conditionFullfilled = true;
      }
    }
  } else if (conditionEffect.type === 'condition-influence') {
    const factionScore = gameState.playerScore[conditionEffect.faction];
    if (conditionEffect.amount && factionScore >= conditionEffect.amount) {
      conditionFullfilled = true;
    }
  } else if (conditionEffect.type === 'condition-high-council-seat') {
    if (player.hasCouncilSeat) {
      conditionFullfilled = true;
    }
  } else if (conditionEffect.type === 'condition-no-high-council-seat') {
    if (!player.hasCouncilSeat) {
      conditionFullfilled = true;
    }
  }
  return conditionFullfilled;
}

export function getMultipliedRewardEffects(
  multiplierEffectOrRewardArray: StructuredRewardEffect,
  gameState: Pick<
    GameState,
    | 'playerAgentsOnFields'
    | 'playerCombatUnits'
    | 'playerHandCardsRewards'
    | 'playerHandCardsFactions'
    | 'playerCardsFactionsInPlay'
  >,
  timing: EffectPlayerTurnTiming = 'agent-placement'
): EffectReward[] {
  if (!multiplierEffectOrRewardArray.multiplier) {
    return multiplierEffectOrRewardArray.effectRewards;
  } else {
    let effectMultiplierAmount = 0;
    const result: EffectReward[] = [];

    if (multiplierEffectOrRewardArray.multiplier.type === 'multiplier-agents-on-board-spaces') {
      const agentsOnBoardSpacesCount = gameState.playerAgentsOnFields.length;
      if (agentsOnBoardSpacesCount > 0) {
        effectMultiplierAmount = agentsOnBoardSpacesCount;
      }
    } else if (multiplierEffectOrRewardArray.multiplier.type === 'multiplier-dreadnought-amount') {
      const dreadnoughtCount = getPlayerdreadnoughtCount(gameState.playerCombatUnits);
      if (dreadnoughtCount > 0) {
        effectMultiplierAmount = dreadnoughtCount;
      }
    } else if (multiplierEffectOrRewardArray.multiplier.type === 'multiplier-dreadnought-in-conflict-amount') {
      const dreadnoughtCount = gameState.playerCombatUnits.shipsInCombat;
      if (dreadnoughtCount > 0) {
        effectMultiplierAmount = dreadnoughtCount;
      }
    } else if (multiplierEffectOrRewardArray.multiplier.type === 'multiplier-dreadnought-in-garrison-amount') {
      const dreadnoughtCount = gameState.playerCombatUnits.shipsInGarrison;
      if (dreadnoughtCount > 0) {
        effectMultiplierAmount = dreadnoughtCount;
      }
    } else if (multiplierEffectOrRewardArray.multiplier.type === 'multiplier-troops-in-conflict') {
      const troopsInConflict = gameState.playerCombatUnits.troopsInCombat;
      if (troopsInConflict > 0) {
        effectMultiplierAmount = troopsInConflict;
      }
    } else if (multiplierEffectOrRewardArray.multiplier.type === 'multiplier-cards-with-sword') {
      const swordAmount = gameState.playerHandCardsRewards.sword;
      if (swordAmount > 0) {
        effectMultiplierAmount = 0.75 * swordAmount;
      }
    } else if (multiplierEffectOrRewardArray.multiplier.type === 'multiplier-connections') {
      const faction = multiplierEffectOrRewardArray.multiplier.faction;
      if (faction) {
        if (timing === 'agent-placement') {
          const handCardAmount = gameState.playerHandCardsFactions[faction];
          if (handCardAmount > 0) {
            effectMultiplierAmount = handCardAmount;
          }
        } else {
          const handCardAmount = gameState.playerHandCardsFactions[faction];
          const cardsInPlayAmount = gameState.playerCardsFactionsInPlay[faction];
          effectMultiplierAmount = handCardAmount + cardsInPlayAmount;
        }
      }
    }
    if (effectMultiplierAmount > 0) {
      for (const reward of multiplierEffectOrRewardArray.effectRewards) {
        const rewardAmount = reward.amount ?? 1;
        result.push({ type: reward.type, amount: rewardAmount * effectMultiplierAmount });
      }
    }

    return result;
  }
}

export function getRewardArrayAIInfos(rewards: Effect[]): RewardArrayInfo {
  const rewardOptionIndex = rewards.findIndex((x) => x.type === 'helper-or' || x.type === 'helper-or-horizontal');
  const hasRewardOptions = rewardOptionIndex > -1;

  const rewardConversionIndex = rewards.findIndex((x) => x.type === 'helper-trade' || x.type === 'helper-trade-horizontal');
  const hasRewardConversion = rewardConversionIndex > -1;
  return { hasRewardChoice: hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex };
}

export function playerCanPayCosts(
  costs: EffectReward[],
  player: Player,
  gameState: Pick<
    GameState,
    | 'playerScore'
    | 'playerHandCards'
    | 'playerCombatUnits'
    | 'playerIntrigueCount'
    | 'playerCardsFactionsInPlay'
    | 'gameSettings'
  >
) {
  let canPayCosts = true;
  const playerScore = gameState.playerScore;

  for (let cost of getFlattenedEffectRewardArray(costs)) {
    const costType = cost.type;
    const costAmount = Math.abs(cost.amount ?? 1);

    if (isResourceType(costType)) {
      const resourceIndex = player.resources.findIndex((x) => x.type === cost.type);
      const currentResourceAmount = player.resources[resourceIndex].amount ?? 0;

      if (currentResourceAmount < costAmount) {
        canPayCosts = false;
      }
    } else if (costType === 'signet-token') {
      if (player.signetTokenCount < costAmount) {
        canPayCosts = false;
      }
    } else if (costType === 'focus') {
      if (player.focusTokens < costAmount) {
        canPayCosts = false;
      }
    } else if (costType === 'tech') {
      if (player.tech < costAmount) {
        canPayCosts = false;
      }
    } else if (costType === 'card-discard') {
      if (gameState.playerHandCards.length < costAmount) {
        canPayCosts = false;
      }
    } else if (costType === 'persuasion') {
      player.persuasionSpentThisRound += costAmount;
      if (player.persuasionSpentThisRound > player.permanentPersuasion + player.persuasionGainedThisRound) {
        canPayCosts = false;
      }
    } else if (costType === 'sword') {
      const playerCombatStrength = getPlayerCombatStrength(gameState.playerCombatUnits, gameState);

      if (playerCombatStrength < costAmount) {
        canPayCosts = false;
      }
    } else if (costType === 'troop' || costType === 'loose-troop') {
      if (gameState.playerCombatUnits.troopsInGarrison < costAmount) {
        canPayCosts = false;
      }
    } else if (costType === 'dreadnought-retreat') {
      if (gameState.playerCombatUnits.shipsInCombat < costAmount) {
        canPayCosts = false;
      }
    } else if (costType === 'intrigue-trash') {
      if (gameState.playerIntrigueCount < costAmount) {
        canPayCosts = false;
      }
    } else if (isFactionScoreCostType(costType)) {
      const scoreType = getFactionScoreTypeFromCost(cost);
      if (scoreType && playerScore && playerScore[scoreType] >= costAmount) {
        playerScore[scoreType] -= 1;
      } else {
        canPayCosts = false;
      }
    } else if (costType === 'faction-influence-down-choice') {
      if (playerScore) {
        let counter = 0;
        counter += playerScore.bene > 0 ? 1 : 0;
        counter += playerScore.fremen > 0 ? 1 : 0;
        counter += playerScore.emperor > 0 ? 1 : 0;
        counter += playerScore.guild > 0 ? 1 : 0;

        if (counter < 1) {
          canPayCosts = false;
        }
      } else {
        canPayCosts = false;
      }
    }
  }

  return canPayCosts;
}
