import { cloneDeep } from 'lodash';
import {
  combatUnitTypes,
  Effect,
  EffectChoice,
  EffectChoiceConversionMultiplierTargetOrReward,
  effectChoices,
  EffectChoiceType,
  EffectConditionAndTarget,
  EffectConditionChoiceConversionMultiplierTargetOrReward,
  effectConditions,
  EffectConversion,
  EffectConversionMultiplierOrReward,
  effectConversions,
  EffectConversionType,
  effectFactionConditions,
  effectFactionMultipliers,
  EffectMultiplier,
  effectMultipliers,
  EffectMultiplierTargetOrReward,
  EffectMultiplierType,
  EffectPlayerTurnTiming,
  EffectReward,
  effectRewards,
  EffectRewardType,
  EffectTarget,
  effectTargets,
  EffectTiming,
  EffectTimingConditionChoiceConversionMultiplierTargetOrReward,
  effectTimings,
  EffectTimingType,
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
import { GameElement } from '../services/game-manager.service';
import { getPlayerCombatStrength, getPlayerdreadnoughtCount } from './combat';
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
  rewardType: EffectRewardType,
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
  rewardType: EffectRewardType,
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

export function isTargetEffect(reward: Effect): reward is EffectTarget {
  return effectTargets.some((x) => x === reward.type);
}

export function isConditionalEffect(reward: Effect): reward is EffectConditionAndTarget {
  return effectConditions.some((x) => x === reward.type) || effectFactionConditions.some((x) => x === reward.type);
}

export function isDreadnoughtEffectType(type: EffectType) {
  return (
    type === 'dreadnought' ||
    type === 'dreadnought-insert' ||
    type === 'dreadnought-insert-or-retreat' ||
    type === 'dreadnought-retreat'
  );
}

export function isChoiceEffect(reward: Effect): reward is EffectChoice {
  return effectChoices.some((x) => x === reward.type);
}

export function isConversionEffect(reward: Effect): reward is EffectConversion {
  return effectConversions.some((x) => x === reward.type);
}

export function isMultiplierEffect(reward: Effect): reward is EffectMultiplier {
  return effectMultipliers.some((x) => x === reward.type) || effectFactionMultipliers.some((x) => x === reward.type);
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

export function isNegativeEffect(effect: Effect): boolean {
  if (
    effect.type === 'card-discard' ||
    effect.type === 'card-trash' ||
    effect.type === 'loose-troop' ||
    effect.type === 'intrigue-trash' ||
    effect.type === 'dreadnought-retreat' ||
    effect.type === 'troop-retreat' ||
    effect.type === 'leader-wound'
  ) {
    return true;
  } else {
    return effect.amount && effect.amount < 0 ? true : false;
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

export function getEffectRewardsAndCosts(cardEffects: Effect[]): { rewards: EffectReward[]; costs: EffectReward[] } {
  const rewardEffects: EffectReward[] = [];
  const costEffects: EffectReward[] = [];

  for (const segment of splitEffectSegments(cardEffects)) {
    const choiceIndex = segment.findIndex((x) => isChoiceEffect(x));
    if (choiceIndex > -1) {
      const leftPart = segment.slice(0, choiceIndex);
      const rightPart = segment.slice(choiceIndex + 1);

      const leftTradeIndex = leftPart.findIndex((x) => isConversionEffect(x));
      if (leftTradeIndex > -1) {
        costEffects.push(
          ...getFlattenedEffectRewardArray(leftPart.slice(0, leftTradeIndex).filter((x) => isRewardEffect(x))),
        );
        rewardEffects.push(
          ...getFlattenedEffectRewardArray(leftPart.slice(leftTradeIndex + 1).filter((x) => isRewardEffect(x))),
        );
      } else {
        rewardEffects.push(...getFlattenedEffectRewardArray(leftPart.filter((x) => isRewardEffect(x))));
      }

      const rightTradeIndex = rightPart.findIndex((x) => isConversionEffect(x));
      if (rightTradeIndex > -1) {
        costEffects.push(
          ...getFlattenedEffectRewardArray(rightPart.slice(0, rightTradeIndex).filter((x) => isRewardEffect(x))),
        );
        rewardEffects.push(
          ...getFlattenedEffectRewardArray(rightPart.slice(rightTradeIndex + 1).filter((x) => isRewardEffect(x))),
        );
      } else {
        rewardEffects.push(...getFlattenedEffectRewardArray(rightPart.filter((x) => isRewardEffect(x))));
      }
    } else {
      const tradeIndex = segment.findIndex((x) => isConversionEffect(x));
      if (tradeIndex > -1) {
        costEffects.push(...getFlattenedEffectRewardArray(segment.slice(0, tradeIndex).filter((x) => isRewardEffect(x))));
        rewardEffects.push(...getFlattenedEffectRewardArray(segment.slice(tradeIndex + 1).filter((x) => isRewardEffect(x))));
      } else {
        rewardEffects.push(...getFlattenedEffectRewardArray(segment.filter((x) => isRewardEffect(x))));
      }
    }
  }

  return {
    rewards: rewardEffects,
    costs: costEffects,
  };
}

function splitEffectSegments(cardEffects: Effect[]): Effect[][] {
  const segments: Effect[][] = [[]];
  for (const effect of cardEffects) {
    if (effect.type === 'helper-separator') {
      segments.push([]);
    } else {
      segments[segments.length - 1].push(effect);
    }
  }
  return segments;
}

export function getStructuredEffectArrayInfos(effects: Effect[]) {
  const result: StructuredEffect[] = [];

  const flatEffects = getSeparatedEffectArrays(effects);
  for (const flatEffect of flatEffects) {
    const [nonTimingEffects, structuredEffectTiming] = getStructuredEffectTimingIfPossible(flatEffect);
    const [nonConditionalEffects, structuredEffectCondition] = getStructuredEffectConditionIfPossible(nonTimingEffects);

    const [nonChoiceEffects, structuredChoiceEffect] = getStructuredChoiceEffectIfPossible(nonConditionalEffects);
    if (structuredChoiceEffect) {
      result.push({
        timing: structuredEffectTiming,
        condition: structuredEffectCondition,
        ...structuredChoiceEffect,
      });
    } else {
      const [nonConversionEffects, structuredConversionEffect] = getStructuredConversionEffectIfPossible(nonChoiceEffects);
      if (structuredConversionEffect) {
        result.push({
          timing: structuredEffectTiming,
          condition: structuredEffectCondition,
          ...structuredConversionEffect,
        });
      } else {
        const structuredEffectRewards = getStructuredEffectReward(nonConversionEffects);
        result.push({
          timing: structuredEffectTiming,
          condition: structuredEffectCondition,
          ...structuredEffectRewards,
        });
      }
    }
  }
  return result;
}

export function getSeparatedEffectArrays(effects: Effect[]) {
  const result: EffectTimingConditionChoiceConversionMultiplierTargetOrReward[][] = [];
  let current: EffectTimingConditionChoiceConversionMultiplierTargetOrReward[] = [];

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
  effects: EffectTimingConditionChoiceConversionMultiplierTargetOrReward[],
): [EffectConditionChoiceConversionMultiplierTargetOrReward[], StructuredEffectTiming | undefined] {
  for (const [index, effect] of effects.entries()) {
    if (isTimingEffect(effect)) {
      const type = effect.type;
      const effectsWithoutTiming = effects.slice(index + 1) as EffectConditionChoiceConversionMultiplierTargetOrReward[];
      return [effectsWithoutTiming, { type }];
    }
  }
  return [effects as EffectConditionChoiceConversionMultiplierTargetOrReward[], undefined];
}

export function getStructuredEffectConditionIfPossible(
  effects: EffectConditionChoiceConversionMultiplierTargetOrReward[],
): [EffectChoiceConversionMultiplierTargetOrReward[], StructuredEffectCondition | undefined] {
  for (const [index, effect] of effects.entries()) {
    if (isConditionalEffect(effect)) {
      const effectsWithoutCondition = effects.slice(index + 1) as EffectChoiceConversionMultiplierTargetOrReward[];

      if (effect.type === 'condition-connection') {
        const conditionalEffect = {
          type: effect.type,
          faction: effect.faction ?? 'emperor',
        } as StructuredEffectCondition;
        return [effectsWithoutCondition, conditionalEffect];
      } else if (effect.type === 'condition-influence') {
        const conditionalEffect = {
          type: effect.type,
          faction: effect.faction ?? 'emperor',
          amount: effect.amount ?? 0,
        } as StructuredEffectCondition;
        return [effectsWithoutCondition, conditionalEffect];
      } else if (effect.type === 'condition-high-council-seat') {
        const conditionalEffect = {
          type: effect.type,
        } as StructuredEffectCondition;
        return [effectsWithoutCondition, conditionalEffect];
      } else if (effect.type === 'condition-no-high-council-seat') {
        const conditionalEffect = {
          type: effect.type,
        } as StructuredEffectCondition;
        return [effectsWithoutCondition, conditionalEffect];
      }
    }
  }
  return [effects as EffectChoiceConversionMultiplierTargetOrReward[], undefined];
}

export function getStructuredChoiceEffectIfPossible(
  effects: EffectChoiceConversionMultiplierTargetOrReward[],
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
  effects: EffectConversionMultiplierOrReward[],
): [EffectMultiplierTargetOrReward[], undefined] | [undefined, StructuredConversionEffect] {
  for (const [index, effect] of effects.entries()) {
    if (isConversionEffect(effect)) {
      const costsEffect = effects.slice(0, index) as EffectMultiplierTargetOrReward[];
      const rewardsEffect = effects.slice(index + 1) as EffectMultiplierTargetOrReward[];

      const structuredCosts = getStructuredEffectReward(costsEffect);
      const structuredRewards = getStructuredEffectReward(rewardsEffect);
      const conversionEffect = {
        type: effect.type,
        effectCosts: structuredCosts,
        effectConversionRewards: structuredRewards,
      };
      return [undefined, conversionEffect];
    }
  }
  return [effects as EffectMultiplierTargetOrReward[], undefined];
}

export function getStructuredEffectReward(effects: EffectMultiplierTargetOrReward[]): StructuredRewardEffect {
  let multiplier: EffectMultiplier | undefined = undefined;
  let target: EffectTarget | undefined = undefined;
  let effectRewards: EffectReward[] = effects as EffectReward[];

  for (const [index, effect] of effects.entries()) {
    if (isMultiplierEffect(effect)) {
      multiplier = effect;
      effectRewards = effectRewards.slice(index + 1);
    }
    if (isTargetEffect(effect)) {
      target = effect;
      effectRewards = effectRewards.slice(index + 1);
    }
  }
  return { type: 'reward', multiplier, target, effectRewards };
}

export function isEffectTimingFullfilled(
  effectTimingType: EffectTimingType,
  player: Player,
  gameState: Pick<GameState, 'currentRound' | 'playerAgentsOnFields' | 'playerTurnInfos' | 'currentRoundPhase'>,
) {
  let timingFullfilled = false;
  if (effectTimingType === 'timing-game-start') {
    if (gameState.currentRound == 1 && player.turnNumber === 0 && !gameState.playerTurnInfos?.agentPlacedOnFieldId) {
      timingFullfilled = true;
    }
  } else if (effectTimingType === 'timing-round-start') {
    if (gameState.currentRound > 0 && player.turnNumber === 1 && !gameState.playerTurnInfos?.agentPlacedOnFieldId) {
      timingFullfilled = true;
    }
  } else if (effectTimingType === 'timing-turn-start') {
    if (player.turnState === 'agent-placement' && !gameState.playerTurnInfos?.agentPlacedOnFieldId) {
      timingFullfilled = true;
    }
  } else if (effectTimingType === 'timing-agent-placed') {
    if (player.turnState === 'agent-placement' && gameState.playerTurnInfos?.agentPlacedOnFieldId) {
      timingFullfilled = true;
    }
  } else if (effectTimingType === 'timing-reveal-turn') {
    if (player.turnState === 'reveal') {
      timingFullfilled = true;
    }
  }
  return timingFullfilled;
}

export function isEffectConditionFullfilled(
  conditionEffect: StructuredEffectCondition,
  player: Player,
  gameState: Pick<
    GameState,
    | 'playerCardsFactionsInPlay'
    | 'playerHandCardsFactions'
    | 'playerScore'
    | 'enemyAgentsOnFields'
    | 'playerAgentPlacedOnFieldThisTurn'
    | 'enemyLocations'
    | 'boardSpaces'
  >,
  timing: EffectPlayerTurnTiming = 'agent-placement',
  gameElement?: GameElement,
) {
  let conditionFullfilled = false;
  if (conditionEffect.type === 'condition-connection') {
    if (timing === 'agent-placement') {
      if (gameState.playerCardsFactionsInPlay[conditionEffect.faction] > 0) {
        conditionFullfilled = true;
      }
    } else {
      const isImperiumCardFromConnectionFaction =
        gameElement?.type === 'imperium-card' && gameElement.object.faction === conditionEffect.faction;

      // Card itself will be in hand or in play, this will handle it
      const playerFactionCardsRequired = isImperiumCardFromConnectionFaction ? 2 : 1;

      if (
        gameState.playerCardsFactionsInPlay[conditionEffect.faction] +
          gameState.playerHandCardsFactions[conditionEffect.faction] >=
        playerFactionCardsRequired
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

export function getStructuredEffectTargets(
  structuredEffectReward: StructuredRewardEffect,
  player: Player,
  gameState: Pick<
    GameState,
    'enemyAgentsOnFields' | 'playerAgentPlacedOnFieldThisTurn' | 'enemyLocations' | 'enemyPlayers' | 'boardSpaces'
  >,
): Player[] {
  const target = structuredEffectReward.target;
  let targetPlayers = [player];

  if (!target) {
    return targetPlayers;
  }

  if (target.type === 'target-enemies') {
    targetPlayers = gameState.enemyPlayers;
  } else if (target.type === 'target-enemies-on-this-field') {
    targetPlayers = gameState.enemyPlayers.filter((enemy) =>
      gameState.enemyAgentsOnFields.some(
        (x) => enemy.id === x.playerId && x.fieldId === gameState.playerAgentPlacedOnFieldThisTurn,
      ),
    );
  } else if (target.type === 'target-enemy-controlling-this-field') {
    targetPlayers = gameState.enemyPlayers.filter((enemy) =>
      gameState.enemyLocations.some(
        (x) => enemy.id === x.playerId && x.locationId === gameState.playerAgentPlacedOnFieldThisTurn,
      ),
    );
  } else if (target.type === 'target-enemies-on-field-type') {
    const actionType = target.action;
    targetPlayers = gameState.enemyPlayers.filter((enemy) => {
      return gameState.enemyAgentsOnFields
        .filter((x) => enemy.id === x.playerId)
        .some((enemyAgent) => {
          const boardSpaceType = gameState.boardSpaces.find((x) => enemyAgent.fieldId === x.title.en)?.actionType;
          if (boardSpaceType === actionType) {
            return true;
          } else {
            return false;
          }
        });
    });
  }

  return targetPlayers;
}

export function getStructuredEffectTargetEstimation(
  structuredEffectReward: StructuredRewardEffect,
  player: Player,
  gameState: Pick<GameState, 'enemyAgentsOnFields' | 'playerAgentPlacedOnFieldThisTurn' | 'enemyLocations' | 'enemyPlayers'>,
): { player: boolean; enemies: number } {
  const target = structuredEffectReward.target?.type;
  let targetEnemies = 0;

  if (!target) {
    return { player: true, enemies: 0 };
  }

  if (target === 'target-enemies') {
    targetEnemies = gameState.enemyPlayers.length;
  } else if (target === 'target-enemies-on-this-field') {
    targetEnemies = 0.5;
  } else if (target === 'target-enemy-controlling-this-field') {
    targetEnemies = 0.75;
  } else if (target === 'target-enemies-on-field-type') {
    targetEnemies = 1.5;
  }

  return { player: targetEnemies > 0 ? false : true, enemies: targetEnemies };
}

export function getMultipliedRewardEffects(
  multiplierEffectOrRewardArray: StructuredRewardEffect,
  gameState: Pick<
    GameState,
    | 'playerAgentsOnFields'
    | 'playerAgentPlacedOnFieldThisTurn'
    | 'playerCombatUnits'
    | 'playerHandCards'
    | 'playerHandCardsRewards'
    | 'playerHandCardsFactions'
    | 'playerCardsFactionsInPlay'
    | 'enemyAgentsOnFields'
    | 'boardSpaces'
  >,
  timing: EffectPlayerTurnTiming = 'agent-placement',
  gameElement?: GameElement,
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
      const swordAmount = gameState.playerHandCards.filter((x) => x.revealEffects?.some((x) => x.type === 'sword')).length;
      if (swordAmount > 0) {
        effectMultiplierAmount = 1 * swordAmount;
      }
    } else if (multiplierEffectOrRewardArray.multiplier.type === 'multiplier-enemies-on-this-field') {
      const enemyAgentsOnCurrentFieldCount = gameState.enemyAgentsOnFields.filter(
        (x) => x.fieldId === gameState.playerAgentPlacedOnFieldThisTurn,
      ).length;
      if (enemyAgentsOnCurrentFieldCount > 0) {
        effectMultiplierAmount = 1 * enemyAgentsOnCurrentFieldCount;
      }
    } else if (multiplierEffectOrRewardArray.multiplier.type === 'multiplier-connections') {
      const faction = multiplierEffectOrRewardArray.multiplier.faction;
      const isImperiumCardFromFaction = gameElement?.type === 'imperium-card' && gameElement.object.faction === faction;

      if (faction) {
        if (timing === 'agent-placement') {
          const cardsInPlayAmount = gameState.playerCardsFactionsInPlay[faction];

          if (cardsInPlayAmount > 0) {
            effectMultiplierAmount = cardsInPlayAmount;
          }
        } else {
          const handCardAmount = gameState.playerHandCardsFactions[faction];
          const cardsInPlayAmount = gameState.playerCardsFactionsInPlay[faction];
          effectMultiplierAmount = handCardAmount + cardsInPlayAmount;

          if (isImperiumCardFromFaction) {
            effectMultiplierAmount -= 1;
          }
        }
      }
    } else if (multiplierEffectOrRewardArray.multiplier.type === 'multiplier-own-agents-on-field-type') {
      const action = multiplierEffectOrRewardArray.multiplier.action;
      const actionTypeFieldIds = gameState.boardSpaces.filter((x) => x.actionType === action).map((x) => x.title.en);

      const agentsOnBoardSpacesCount = gameState.playerAgentsOnFields.filter((x) =>
        actionTypeFieldIds.includes(x.fieldId),
      ).length;

      if (agentsOnBoardSpacesCount > 0) {
        effectMultiplierAmount = agentsOnBoardSpacesCount;
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
    | 'playerTechTiles'
    | 'playerResources'
    | 'playerLeader'
  >,
) {
  let canPayCosts = true;
  const playerScore = gameState.playerScore;

  for (let cost of getFlattenedEffectRewardArray(costs)) {
    const costType = cost.type;
    const costAmount = Math.abs(cost.amount ?? 1);

    if (isResourceType(costType)) {
      const currentResourceAmount = gameState.playerResources[costType];

      if (currentResourceAmount < costAmount) {
        canPayCosts = false;
      }
    } else if (costType === 'tech-tile-trash') {
      if (gameState.playerTechTiles.length < costAmount) {
        canPayCosts = false;
      }
    } else if (costType === 'card-discard') {
      if (gameState.playerHandCards.length < costAmount) {
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
    } else if (costType === 'leader-wound') {
      if (gameState.playerLeader?.isFlipped) {
        canPayCosts = false;
      }
    }
  }

  return canPayCosts;
}
