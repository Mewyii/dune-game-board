import { cloneDeep, isArray } from 'lodash';
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
  StructuredConditionalEffect,
  StructuredConversionEffect,
  StructuredEffects,
  StructuredMultiplierEffect,
  StructuredTimingEffect,
} from '../models';
import { GameState } from '../models/ai';
import { Player } from '../models/player';
import { getPlayerdreadnoughtCount } from './combat-units';

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

export function isStructuredConditionalEffect(
  effect:
    | StructuredConditionalEffect
    | StructuredChoiceEffect
    | StructuredConversionEffect
    | StructuredMultiplierEffect
    | EffectReward[]
): effect is StructuredConditionalEffect {
  return effect.hasOwnProperty('condition');
}

export function isStructuredChoiceEffect(
  effect: StructuredChoiceEffect | StructuredConversionEffect | StructuredMultiplierEffect | EffectReward[]
): effect is StructuredChoiceEffect {
  return effect.hasOwnProperty('choiceType') && effect.hasOwnProperty('left') && effect.hasOwnProperty('right');
}

export function isStructuredConversionEffect(
  effect: StructuredConversionEffect | StructuredMultiplierEffect | EffectReward[]
): effect is StructuredConversionEffect {
  return effect.hasOwnProperty('conversionType') && effect.hasOwnProperty('costs') && effect.hasOwnProperty('rewards');
}

export function isStructuredMultiplierEffect(
  effect: StructuredMultiplierEffect | EffectReward[]
): effect is StructuredMultiplierEffect {
  return effect.hasOwnProperty('multiplier') && effect.hasOwnProperty('rewards');
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
    multiplierEffects: [],
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
          const [nonConversionEffects, structuredConversionEffect] =
            getStructuredConversionEffectIfPossible(nonChoiceEffects);
          if (structuredConversionEffect) {
            result.conversionEffects.push(structuredConversionEffect);
          } else {
            const [effectRewards, multiplierEffect] = getStructuredMultiplierEffectIfPossible(nonConversionEffects);
            if (multiplierEffect) {
              result.multiplierEffects.push(multiplierEffect);
            } else {
              result.rewards.push(...effectRewards);
            }
          }
        }
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

export function getStructuredTimingEffectIfPossible(
  effects: EffectTimingConditionChoiceConversionMultiplierOrReward[]
): [EffectConditionChoiceConversionMultiplierOrReward[], undefined] | [undefined, StructuredTimingEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isTimingEffect(effect)) {
      const type = effect.type;
      const effectsWithoutTiming = effects.slice(index + 1) as EffectConditionChoiceConversionMultiplierOrReward[];
      const [nonConditionalEffects, structuredConditionalEffect] =
        getStructuredConditionalEffectIfPossible(effectsWithoutTiming);
      if (structuredConditionalEffect) {
        return [undefined, { type, effect: structuredConditionalEffect }];
      } else {
        const [nonChoiceEffects, choiceEffect] = getStructuredChoiceEffectIfPossible(nonConditionalEffects);
        if (choiceEffect) {
          return [undefined, { type, effect: choiceEffect }];
        } else {
          const [nonConversionEffects, conversionEffect] = getStructuredConversionEffectIfPossible(nonChoiceEffects);
          if (conversionEffect) {
            return [undefined, { type, effect: conversionEffect }];
          } else {
            const [effectRewards, multiplierEffect] = getStructuredMultiplierEffectIfPossible(nonConversionEffects);
            return [undefined, { type, effect: multiplierEffect ?? effectRewards }];
          }
        }
      }
    }
  }
  return [effects as EffectConditionChoiceConversionMultiplierOrReward[], undefined];
}

export function getStructuredConditionalEffectIfPossible(
  effects: EffectConditionChoiceConversionMultiplierOrReward[]
): [EffectChoiceConversionMultiplierOrReward[], undefined] | [undefined, StructuredConditionalEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isConditionalEffect(effect)) {
      const effectsWithoutCondition = effects.slice(index + 1) as EffectChoiceConversionMultiplierOrReward[];

      let conditionFullfilledEffect = undefined;
      const [nonChoiceEffect, choiceEffect] = getStructuredChoiceEffectIfPossible(effectsWithoutCondition);
      if (choiceEffect) {
        conditionFullfilledEffect = choiceEffect;
      } else {
        const [nonConversionEffect, conversionEffect] = getStructuredConversionEffectIfPossible(nonChoiceEffect);
        if (conversionEffect) {
          conditionFullfilledEffect = conversionEffect;
        } else {
          const [effectRewards, multiplierEffect] = getStructuredMultiplierEffectIfPossible(nonConversionEffect);
          conditionFullfilledEffect = multiplierEffect || effectRewards;
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
        const [effectRewardsLeft, multiplierEffectLeft] = getStructuredMultiplierEffectIfPossible(nonConversionEffectLeft);
        structuredLeftEffect = multiplierEffectLeft || effectRewardsLeft;
      }

      const rightEffects = effects.slice(index + 1) as EffectConversionMultiplierOrReward[];
      const [nonConversionEffectRight, conversionEffectRight] = getStructuredConversionEffectIfPossible(rightEffects);
      if (conversionEffectRight) {
        structuredRightEffect = conversionEffectRight;
      } else {
        const [effectRewardsRight, multiplierEffectRight] =
          getStructuredMultiplierEffectIfPossible(nonConversionEffectRight);
        structuredRightEffect = multiplierEffectRight || effectRewardsRight;
      }

      const choiceEffect = {
        choiceType: effect.type,
        left: structuredLeftEffect,
        right: structuredRightEffect,
      };
      return [undefined, choiceEffect];
    }
  }
  return [effects as EffectReward[], undefined];
}

export function getStructuredConversionEffectIfPossible(
  effects: EffectConversionMultiplierOrReward[]
): [EffectMultiplierOrReward[], undefined] | [undefined, StructuredConversionEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isConversionEffect(effect)) {
      const costsEffect = effects.slice(0, index) as EffectMultiplierOrReward[];
      const rewardsEffect = effects.slice(index + 1) as EffectMultiplierOrReward[];

      const [costs, multiplierEffectCosts] = getStructuredMultiplierEffectIfPossible(costsEffect);
      const [rewards, multiplierEffectRewards] = getStructuredMultiplierEffectIfPossible(rewardsEffect);
      const conversionEffect = {
        conversionType: effect.type,
        costs: multiplierEffectCosts || costs,
        rewards: multiplierEffectRewards || rewards,
      };
      return [undefined, conversionEffect];
    }
  }
  return [effects as EffectReward[], undefined];
}

export function getStructuredMultiplierEffectIfPossible(
  effects: EffectMultiplierOrReward[]
): [EffectReward[], undefined] | [undefined, StructuredMultiplierEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isMultiplierEffect(effect)) {
      const multiplierEffect = {
        multiplier: effect.type,
        rewards: effects.slice(index + 1) as EffectReward[],
      };
      return [undefined, multiplierEffect];
    }
  }
  return [effects as EffectReward[], undefined];
}

export function isTimingFullfilled(timingEffect: StructuredTimingEffect, player: Player, gameState: GameState) {
  let timingFullfilled = false;
  if (timingEffect.type === 'timing-game-start') {
    const hasPlacedAgentThisRound = gameState.playerAgentsOnFields.length > 0;
    if (gameState.currentRound === 1 && player.turnState === 'agent-placement' && !hasPlacedAgentThisRound) {
      timingFullfilled = true;
    }
  } else if (timingEffect.type === 'timing-round-start') {
    const hasPlacedAgentThisRound = gameState.playerAgentsOnFields.length > 0;
    if (player.turnState === 'agent-placement' && !hasPlacedAgentThisRound) {
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
  conditionEffect: StructuredConditionalEffect,
  player: Player,
  gameState: GameState,
  timing: EffectPlayerTurnTiming = 'agent-placement'
) {
  let conditionFullfilled = false;
  if (conditionEffect.condition === 'condition-connection') {
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
  } else if (conditionEffect.condition === 'condition-influence') {
    const factionScore = gameState.playerScore[conditionEffect.faction];
    if (conditionEffect.amount && factionScore >= conditionEffect.amount) {
      conditionFullfilled = true;
    }
  } else if (conditionEffect.condition === 'condition-high-council-seat') {
    if (player.hasCouncilSeat) {
      conditionFullfilled = true;
    }
  }
  return conditionFullfilled;
}

export function getMultipliedRewardEffects(
  multiplierEffectOrRewardArray: StructuredMultiplierEffect | EffectReward[],
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
  if (isArray(multiplierEffectOrRewardArray)) {
    return multiplierEffectOrRewardArray;
  } else {
    let effectMultiplierAmount = 0;
    const result: EffectReward[] = [];

    if (multiplierEffectOrRewardArray.multiplier === 'multiplier-agents-on-board-spaces') {
      const agentsOnBoardSpacesCount = gameState.playerAgentsOnFields.length;
      if (agentsOnBoardSpacesCount > 0) {
        effectMultiplierAmount = agentsOnBoardSpacesCount;
      }
    } else if (multiplierEffectOrRewardArray.multiplier === 'multiplier-dreadnought-amount') {
      const dreadnoughtCount = getPlayerdreadnoughtCount(gameState.playerCombatUnits);
      if (dreadnoughtCount > 0) {
        effectMultiplierAmount = dreadnoughtCount;
      }
    } else if (multiplierEffectOrRewardArray.multiplier === 'multiplier-dreadnought-in-conflict-amount') {
      const dreadnoughtCount = gameState.playerCombatUnits.shipsInCombat;
      if (dreadnoughtCount > 0) {
        effectMultiplierAmount = dreadnoughtCount;
      }
    } else if (multiplierEffectOrRewardArray.multiplier === 'multiplier-dreadnought-in-garrison-amount') {
      const dreadnoughtCount = gameState.playerCombatUnits.shipsInGarrison;
      if (dreadnoughtCount > 0) {
        effectMultiplierAmount = dreadnoughtCount;
      }
    } else if (multiplierEffectOrRewardArray.multiplier === 'multiplier-troops-in-conflict') {
      const troopsInConflict = gameState.playerCombatUnits.troopsInCombat;
      if (troopsInConflict > 0) {
        effectMultiplierAmount = troopsInConflict;
      }
    } else if (multiplierEffectOrRewardArray.multiplier === 'multiplier-cards-with-sword') {
      const swordAmount = gameState.playerHandCardsRewards.sword;
      if (swordAmount > 0) {
        effectMultiplierAmount = 0.75 * swordAmount;
      }
    } else if (multiplierEffectOrRewardArray.multiplier === 'multiplier-connections') {
      const faction = multiplierEffectOrRewardArray.faction;
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
      for (const reward of multiplierEffectOrRewardArray.rewards) {
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
