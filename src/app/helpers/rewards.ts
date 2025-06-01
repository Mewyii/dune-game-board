import { cloneDeep } from 'lodash';
import {
  combatUnitTypes,
  Effect,
  EffectChoice,
  EffectChoiceConversionOrReward,
  effectChoices,
  EffectChoiceType,
  EffectCondition,
  EffectConditionChoiceConversionOrReward,
  effectConditions,
  EffectConversion,
  EffectConversionOrReward,
  effectConversions,
  EffectConversionType,
  EffectReward,
  effectRewards,
  EffectRewardType,
  EffectTiming,
  EffectTimingConditionChoiceConversionOrReward,
  effectTimings,
  EffectType,
  resourceTypes,
  RewardArrayInfo,
  StructuredChoiceEffect,
  StructuredConditionalEffect,
  StructuredConversionEffect,
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

export function isConversionEffect(reward: Effect): reward is EffectConversion {
  return effectConversions.some((x) => x === reward.type);
}

export function isStructuredConditionalEffect(
  effect: StructuredConditionalEffect | StructuredChoiceEffect | StructuredConversionEffect | EffectReward[]
): effect is StructuredConditionalEffect {
  return effect.hasOwnProperty('condition');
}

export function isStructuredChoiceEffect(
  effect: StructuredChoiceEffect | StructuredConversionEffect | EffectReward[]
): effect is StructuredChoiceEffect {
  return effect.hasOwnProperty('choiceType') && effect.hasOwnProperty('left') && effect.hasOwnProperty('right');
}

export function isStructuredConversionEffect(
  effect: EffectReward[] | StructuredConversionEffect
): effect is StructuredConversionEffect {
  return effect.hasOwnProperty('conversionType') && effect.hasOwnProperty('costs') && effect.hasOwnProperty('rewards');
}

export function isConversionEffectType(input: string): input is EffectConversionType {
  return ['helper-trade', 'helper-trade-horizontal'].some((x) => x === input);
}

export function isChoiceEffectType(input: string): input is EffectChoiceType {
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
  const result: StructuredEffects = {
    rewards: [],
    conversionEffects: [],
    choiceEffects: [],
    conditionalEffects: [],
    timingEffects: [],
  };

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
        const [nonChoiceEffects, structuredChoiceEffect] = getStructuredChoiceEffectIfPossible(nonConditionalEffects);
        if (structuredChoiceEffect) {
          result.choiceEffects.push(structuredChoiceEffect);
        } else {
          const [effectRewards, structuredConversionEffect] = getStructuredConversionEffectIfPossible(nonChoiceEffects);
          if (structuredConversionEffect) {
            result.conversionEffects.push(structuredConversionEffect);
          } else {
            result.rewards.push(...effectRewards);
          }
        }
      }
    }
  }
  return result;
}

export function getSeparatedEffectArrays(effects: Effect[]) {
  const result: EffectTimingConditionChoiceConversionOrReward[][] = [];
  let current: EffectTimingConditionChoiceConversionOrReward[] = [];

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
  effects: EffectTimingConditionChoiceConversionOrReward[]
): [EffectConditionChoiceConversionOrReward[], undefined] | [undefined, StructuredTimingEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isTimingEffect(effect)) {
      const type = effect.type;
      const effectsWithoutTiming = effects.slice(index + 1) as EffectConditionChoiceConversionOrReward[];
      const [nonConditionalEffects, structuredConditionalEffect] =
        getStructuredConditionalEffectIfPossible(effectsWithoutTiming);
      if (structuredConditionalEffect) {
        return [undefined, { type, effect: structuredConditionalEffect }];
      } else {
        const [nonChoiceEffects, choiceEffect] = getStructuredChoiceEffectIfPossible(nonConditionalEffects);
        if (choiceEffect) {
          return [undefined, { type, effect: choiceEffect }];
        } else {
          const [effectRewards, conversionEffect] = getStructuredConversionEffectIfPossible(nonChoiceEffects);
          return [undefined, { type, effect: conversionEffect ?? effectRewards }];
        }
      }
    }
  }
  return [effects as EffectConditionChoiceConversionOrReward[], undefined];
}

export function getStructuredConditionalEffectIfPossible(
  effects: EffectConditionChoiceConversionOrReward[]
): [EffectChoiceConversionOrReward[], undefined] | [undefined, StructuredConditionalEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isConditionalEffect(effect)) {
      const effectsWithoutCondition = effects.slice(index + 1) as EffectChoiceConversionOrReward[];

      let conditionFullfilledEffect = undefined;
      const [nonChoiceEffect, choiceEffect] = getStructuredChoiceEffectIfPossible(effectsWithoutCondition);
      if (choiceEffect) {
        conditionFullfilledEffect = choiceEffect;
      } else {
        const [effectRewards, conversionEffect] = getStructuredConversionEffectIfPossible(nonChoiceEffect);
        if (conversionEffect) {
          conditionFullfilledEffect = conversionEffect;
        } else {
          conditionFullfilledEffect = effectRewards;
        }
      }

      if (effect.type === 'condition-connection') {
        const conditionalEffect = {
          condition: effect.type,
          faction: effect.faction ?? 'emperor',
          effect: conditionFullfilledEffect,
        };
        return [undefined, conditionalEffect];
      } else if (effect.type === 'condition-influence') {
        const conditionalEffect = {
          condition: effect.type,
          faction: effect.faction ?? 'emperor',
          effect: conditionFullfilledEffect,
          amount: effect.amount ?? 0,
        };
        return [undefined, conditionalEffect];
      } else if (effect.type === 'condition-high-council-seat') {
        const conditionalEffect = {
          condition: effect.type,
          effect: conditionFullfilledEffect,
        };
        return [undefined, conditionalEffect];
      }
    }
  }
  return [effects as EffectChoiceConversionOrReward[], undefined];
}

export function getStructuredChoiceEffectIfPossible(
  effects: EffectChoiceConversionOrReward[]
): [EffectConversionOrReward[], undefined] | [undefined, StructuredChoiceEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isChoiceEffect(effect)) {
      const leftEffect = effects.slice(0, index) as EffectConversionOrReward[];
      const rightEffect = effects.slice(index + 1) as EffectConversionOrReward[];
      const [effectRewardsLeft, conversionEffectLeft] = getStructuredConversionEffectIfPossible(leftEffect);
      const [effectRewardsRight, conversionEffectRight] = getStructuredConversionEffectIfPossible(rightEffect);
      const choiceEffect = {
        choiceType: effect.type,
        left: conversionEffectLeft || effectRewardsLeft,
        right: conversionEffectRight || effectRewardsRight,
      };
      return [undefined, choiceEffect];
    }
  }
  return [effects as EffectReward[], undefined];
}

export function getStructuredConversionEffectIfPossible(
  effects: EffectConversionOrReward[]
): [EffectReward[], undefined] | [undefined, StructuredConversionEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isConversionEffect(effect)) {
      const conversionEffect = {
        conversionType: effect.type,
        costs: effects.slice(0, index) as EffectReward[],
        rewards: effects.slice(index + 1) as EffectReward[],
      };
      return [undefined, conversionEffect];
    }
  }
  return [effects as EffectReward[], undefined];
}

export function getRewardArrayAIInfos(rewards: Effect[]): RewardArrayInfo {
  const rewardOptionIndex = rewards.findIndex((x) => x.type === 'helper-or' || x.type === 'helper-or-horizontal');
  const hasRewardOptions = rewardOptionIndex > -1;

  const rewardConversionIndex = rewards.findIndex((x) => x.type === 'helper-trade' || x.type === 'helper-trade-horizontal');
  const hasRewardConversion = rewardConversionIndex > -1;
  return { hasRewardChoice: hasRewardOptions, hasRewardConversion, rewardOptionIndex, rewardConversionIndex };
}
