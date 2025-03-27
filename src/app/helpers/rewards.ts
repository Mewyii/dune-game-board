import {
  Effect,
  EffectChoice,
  EffectCondition,
  EffectReward,
  EffectWithoutSeparator,
  EffectWithoutSeparatorAndCondition,
  rewardChoices,
  RewardChoiceType,
  rewardConditions,
  RewardType,
  rewardTypes,
  StructuredChoiceEffect,
  StructuredConditionalEffect,
  StructuredEffects,
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
  rewardType: RewardType
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
  rewardType: RewardType
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

export function isConditionalEffect(reward: Effect): reward is EffectCondition {
  return rewardConditions.some((x) => x === reward.type);
}

export function isChoiceEffect(reward: Effect): reward is EffectChoice {
  return rewardChoices.some((x) => x === reward.type);
}

export function isStructuredChoiceEffect(effect: any): effect is StructuredChoiceEffect {
  return !!effect.choiceType && !!effect.left && !!effect.right;
}

export function isConversionEffectType(input: string): input is RewardChoiceType {
  return ['helper-trade', 'helper-trade-horizontal'].some((x) => x === input);
}

export function isOptionEffectType(input: string): input is RewardChoiceType {
  return ['helper-or', 'helper-or-horizontal'].some((x) => x === input);
}

export function isRewardEffect(reward: Effect): reward is EffectReward {
  return rewardTypes.some((x) => x === reward.type);
}

export function getStructuredEffectArrayInfos(effects: Effect[]) {
  const result: StructuredEffects = { rewards: [], conditionalEffects: [], choiceEffects: [] };

  const flatEffects = getSeparatedEffectArrays(effects);
  for (const flatEffect of flatEffects) {
    const [nonConditionalEffects, structuredConditionalEffect] = getStructuredConditionalEffectIfPossible(flatEffect);
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
  return result;
}

export function getSeparatedEffectArrays(effects: Effect[]) {
  const result: EffectWithoutSeparator[][] = [];
  let current: EffectWithoutSeparator[] = [];

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

export function getStructuredConditionalEffectIfPossible(
  effects: EffectWithoutSeparator[]
): [EffectWithoutSeparatorAndCondition[], undefined] | [undefined, StructuredConditionalEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isConditionalEffect(effect)) {
      const effectsWithoutCondition = effects.slice(index + 1) as EffectWithoutSeparatorAndCondition[];
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
  return [effects as EffectWithoutSeparatorAndCondition[], undefined];
}

export function getStructuredChoiceEffectIfPossible(
  effects: EffectWithoutSeparatorAndCondition[]
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
