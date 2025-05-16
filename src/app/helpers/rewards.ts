import { cloneDeep } from 'lodash';
import {
  combatUnitTypes,
  Effect,
  EffectChoice,
  effectChoices,
  EffectChoiceType,
  EffectCondition,
  effectConditions,
  EffectReward,
  EffectRewardChoiceOrCondition,
  EffectRewardOrChoice,
  effectRewards,
  EffectRewardType,
  EffectTiming,
  EffectTimingRewardChoiceOrCondition,
  effectTimings,
  EffectType,
  resourceTypes,
  RewardArrayInfo,
  StructuredChoiceEffect,
  StructuredConditionalEffect,
  StructuredEffects,
  StructuredTimingEffect,
} from '../models';

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

export function isStructuredConditionalEffect(
  effect: EffectReward[] | StructuredChoiceEffect | StructuredConditionalEffect
): effect is StructuredConditionalEffect {
  return effect.hasOwnProperty('condition');
}

export function isStructuredChoiceEffect(effect: EffectReward[] | StructuredChoiceEffect): effect is StructuredChoiceEffect {
  return effect.hasOwnProperty('choiceType') && effect.hasOwnProperty('left') && effect.hasOwnProperty('right');
}

export function isConversionEffectType(input: string): input is EffectChoiceType {
  return ['helper-trade', 'helper-trade-horizontal'].some((x) => x === input);
}

export function isOptionEffectType(input: string): input is EffectChoiceType {
  return ['helper-or', 'helper-or-horizontal'].some((x) => x === input);
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
  const result: StructuredEffects = { rewards: [], conditionalEffects: [], choiceEffects: [], timingEffects: [] };

  const flatEffects = getSeparatedEffectArrays(effects);
  for (const flatEffect of flatEffects) {
    const [nonTimingEffects, structuredTimingEffect] = getStructuredTimingEffectIfPossible(flatEffect);
    if (structuredTimingEffect) {
      result.timingEffects.push(structuredTimingEffect);
    } else {
      const [nonConditionalEffects, structuredConditionalEffect] =
        getStructuredConditionalEffectIfPossible(nonTimingEffects);
      if (structuredConditionalEffect) {
        result.conditionalEffects.push(structuredConditionalEffect);
      } else {
        const [rewardEffects, structuredChoiceEffect] = getStructuredChoiceEffectIfPossible(nonConditionalEffects);
        if (structuredChoiceEffect) {
          result.choiceEffects.push(structuredChoiceEffect);
        } else {
          result.rewards.push(...rewardEffects);
        }
      }
    }
  }
  return result;
}

export function getSeparatedEffectArrays(effects: Effect[]) {
  const result: EffectTimingRewardChoiceOrCondition[][] = [];
  let current: EffectTimingRewardChoiceOrCondition[] = [];

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

export function getStructuredTimingEffectIfPossible(
  effects: EffectTimingRewardChoiceOrCondition[]
): [EffectRewardChoiceOrCondition[], undefined] | [undefined, StructuredTimingEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isTimingEffect(effect)) {
      const type = effect.type;
      const effectsWithoutTiming = effects.slice(index + 1) as EffectRewardChoiceOrCondition[];
      const [nonConditionalEffects, structuredConditionalEffect] =
        getStructuredConditionalEffectIfPossible(effectsWithoutTiming);
      if (structuredConditionalEffect) {
        return [undefined, { type, effect: structuredConditionalEffect }];
      } else {
        const [effectRewards, choiceEffect] = getStructuredChoiceEffectIfPossible(nonConditionalEffects);
        return [undefined, { type, effect: choiceEffect ?? effectRewards }];
      }
    }
  }
  return [effects as EffectRewardChoiceOrCondition[], undefined];
}

export function getStructuredConditionalEffectIfPossible(
  effects: EffectRewardChoiceOrCondition[]
): [EffectRewardOrChoice[], undefined] | [undefined, StructuredConditionalEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isConditionalEffect(effect)) {
      const effectsWithoutCondition = effects.slice(index + 1) as EffectRewardOrChoice[];
      const [effectRewards, choiceEffect] = getStructuredChoiceEffectIfPossible(effectsWithoutCondition);
      const conditionalEffect = {
        condition: effect.type,
        faction: effect.faction,
        effect: choiceEffect || effectRewards,
        amount: effect.amount,
      };
      return [undefined, conditionalEffect];
    }
  }
  return [effects as EffectRewardOrChoice[], undefined];
}

export function getStructuredChoiceEffectIfPossible(
  effects: EffectRewardOrChoice[]
): [EffectReward[], undefined] | [undefined, StructuredChoiceEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isChoiceEffect(effect)) {
      const choiceEffect = {
        choiceType: effect.type,
        left: effects.slice(0, index) as EffectReward[],
        right: effects.slice(index + 1) as EffectReward[],
      };
      return [undefined, choiceEffect];
    }
  }
  return [effects as EffectReward[], undefined];
}

export function getRewardArrayAIInfos(rewards: Effect[]): RewardArrayInfo {
  const rewardOptionIndex = rewards.findIndex((x) => x.type === 'helper-or' || x.type === 'helper-or-horizontal');
  const hasRewardOptions = rewardOptionIndex > -1;

  const rewardConversionIndex = rewards.findIndex((x) => x.type === 'helper-trade' || x.type === 'helper-trade-horizontal');
  const hasRewardConversion = rewardConversionIndex > -1;
  return { hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex };
}
