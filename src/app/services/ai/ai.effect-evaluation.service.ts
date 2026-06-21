import { Injectable } from '@angular/core';
import { min } from 'lodash';
import { AI, AIRewardEffectGameInterface } from 'src/app/constants/board-settings';
import { getPlayerdreadnoughtCount } from 'src/app/helpers/combat';
import { getModifiedLocationTakeoverTroopCosts } from 'src/app/helpers/game-modifiers';
import {
  getFlattenedEffectRewardArray,
  getMultipliedRewardEffects,
  isEffectConditionFullfilled,
  isEffectTimingFullfilled,
  isStructuredChoiceEffect,
  isStructuredConversionEffect,
  isStructuredRewardEffect,
  playerCanPayCosts,
} from 'src/app/helpers/rewards';
import {
  ActionField,
  EffectPlayerTurnTiming,
  EffectReward,
  EffectRewardType,
  StructuredChoiceEffect,
  StructuredConversionEffect,
  StructuredConversionOrRewardEffect,
  StructuredEffect,
  StructuredEffectCondition,
  StructuredRewardEffect,
} from 'src/app/models';
import { GameState } from 'src/app/models/ai';
import { Player } from 'src/app/models/player';
import { BoardSpacesService } from '../board-spaces.service';
import { SettingsService } from '../settings.service';

@Injectable({
  providedIn: 'root',
})
export class AIEffectEvaluationService {
  ai: AI | undefined;

  constructor(
    private settingsService: SettingsService,
    private boardSpacesService: BoardSpacesService,
  ) {
    this.settingsService.AI$.subscribe((x) => {
      this.ai = x;
    });
  }

  getStructuredEffectUsefulnesAndCosts(structuredEffects: StructuredEffect[], player: Player, gameState: GameState) {
    let usefullness = this.getStructuredEffectsEvaluationForTurnState(structuredEffects, player, gameState, undefined, true);
    let effectsCosts: EffectReward[] = [];

    const result = this.getStructuredEffectsRewardsAndCosts(structuredEffects, player, gameState);
    effectsCosts = result.costs;
    if (result.rewards.some((x) => x.type === 'location-control-choice')) {
      const hasAgentsOnFreeLocations = gameState.freeLocations.some((locationId) =>
        gameState.playerAgentsOnFields.some((agent) => agent.fieldId === locationId),
      );
      const agentsOnEnemyLocations = gameState.enemyLocations.filter((location) =>
        gameState.playerAgentsOnFields.some((agent) => agent.fieldId === location.locationId),
      );
      if (!hasAgentsOnFreeLocations && agentsOnEnemyLocations.length > 0) {
        const effectiveTakeOverTroopCosts = min(
          agentsOnEnemyLocations.map((x) =>
            getModifiedLocationTakeoverTroopCosts(
              this.settingsService.getLocationTakeoverTroopCosts(),
              this.boardSpacesService.getBoardSpace(x.locationId),
              gameState.playerGameModifiers?.locationTakeoverTroopCosts,
            ),
          ),
        ) as number;

        const troopCosts = effectsCosts.find((x) => x.type === 'troop' || x.type === 'loose-troop');
        if (troopCosts) {
          const baseAmount = troopCosts.amount ?? 1;
          troopCosts.amount = baseAmount + effectiveTakeOverTroopCosts;
        } else {
          effectsCosts.push({ type: 'troop', amount: effectiveTakeOverTroopCosts });
        }
      }
    }

    return { isUseful: usefullness > 0, usefullness, costs: effectsCosts };
  }

  getStructuredEffectRewardsAndCosts(
    structuredEffect: StructuredEffect,
    player: Player,
    gameState: GameState,
  ): { costs: EffectReward[]; rewards: EffectReward[] } {
    let costs: EffectReward[] = [];
    let rewards: EffectReward[] = [];

    let timingFullfilled = true;
    let conditionFullfilled = true;

    if (structuredEffect.timing) {
      timingFullfilled = isEffectTimingFullfilled(structuredEffect.timing.type, player, gameState);
    }
    if (structuredEffect.condition) {
      conditionFullfilled = isEffectConditionFullfilled(structuredEffect.condition, player, gameState);
    }

    if (timingFullfilled && conditionFullfilled) {
      if (isStructuredRewardEffect(structuredEffect)) {
        rewards = getMultipliedRewardEffects(structuredEffect, gameState);
      } else if (isStructuredChoiceEffect(structuredEffect)) {
        const chosenEffect = this.getEffectChoiceDecision(
          player,
          gameState,
          structuredEffect.effectLeft,
          structuredEffect.effectRight,
        );

        if (chosenEffect) {
          if (isStructuredConversionEffect(chosenEffect)) {
            costs = getMultipliedRewardEffects(chosenEffect.effectCosts, gameState);
            rewards = getMultipliedRewardEffects(chosenEffect.effectConversionRewards, gameState);
          } else {
            rewards = getMultipliedRewardEffects(chosenEffect, gameState);
          }
        }
      } else if (isStructuredConversionEffect(structuredEffect)) {
        costs = getMultipliedRewardEffects(structuredEffect.effectCosts, gameState);
        rewards = getMultipliedRewardEffects(structuredEffect.effectConversionRewards, gameState);
      }
    }

    return {
      costs: getFlattenedEffectRewardArray(costs),
      rewards: getFlattenedEffectRewardArray(rewards),
    };
  }

  getStructuredEffectsRewardsAndCosts(
    structuredEffects: StructuredEffect[],
    player: Player,
    gameState: GameState,
  ): { costs: EffectReward[]; rewards: EffectReward[] } {
    const rewards: EffectReward[] = [];
    const costs: EffectReward[] = [];

    for (const effect of structuredEffects) {
      const result = this.getStructuredEffectRewardsAndCosts(effect, player, gameState);
      rewards.push(...result.rewards);
      costs.push(...result.costs);
    }

    return {
      costs: getFlattenedEffectRewardArray(costs),
      rewards: getFlattenedEffectRewardArray(rewards),
    };
  }

  getEffectChoiceDecision(
    player: Player,
    gameState: GameState,
    leftSideEffect: StructuredConversionOrRewardEffect,
    rightSideEffect: StructuredConversionOrRewardEffect,
  ) {
    let leftSideEvaluation = 0;
    let rightSideEvaluation = 0;

    if (isStructuredConversionEffect(leftSideEffect)) {
      leftSideEvaluation = this.getConversionEffectEvaluation(leftSideEffect, player, gameState);
    } else {
      const rewards = getMultipliedRewardEffects(leftSideEffect, gameState);

      leftSideEvaluation = this.getRewardArrayEvaluationForTurnState(rewards, player, gameState);
    }
    if (isStructuredConversionEffect(rightSideEffect)) {
      rightSideEvaluation = this.getConversionEffectEvaluation(rightSideEffect, player, gameState);
    } else {
      const rewards = getMultipliedRewardEffects(rightSideEffect, gameState);

      rightSideEvaluation = this.getRewardArrayEvaluationForTurnState(rewards, player, gameState);
    }

    if (leftSideEvaluation >= rightSideEvaluation) {
      return leftSideEffect;
    } else {
      return rightSideEffect;
    }
  }

  getEffectConversionDecision(player: Player, gameState: GameState, costs: EffectReward[], rewards: EffectReward[]) {
    const costsEvaluation = this.getCostsArrayEvaluationForTurnState(costs, player, gameState);
    return this.getRewardArrayEvaluationForTurnState(rewards, player, gameState) - costsEvaluation > 0;
  }

  getDesiredRewardEffects(player: Player, rewards: EffectReward[], gameState: GameState, maxEffects = 1) {
    if (rewards.length < 1) {
      return [];
    }

    const evaluatedEffects: { reward: EffectReward; evaluation: number }[] = [];

    for (const reward of rewards) {
      const evaluation = this.getAmountAdjustedRewardEffectEvaluationForTurnState(
        reward.type,
        reward.amount ?? 1,
        player,
        gameState,
      );
      evaluatedEffects.push({ reward, evaluation });
    }

    evaluatedEffects.sort((a, b) => b.evaluation - a.evaluation);

    return evaluatedEffects.slice(0, maxEffects).map((x) => x.reward);
  }

  getStructuredEffectsEvaluation(
    effects: StructuredEffect[],
    player: Player,
    gameState: GameState,
    timing: EffectPlayerTurnTiming = 'agent-placement',
  ) {
    let evaluationValue = 0;
    for (const effect of effects) {
      let conditionEstimationMultiplier = 1;
      if (effect.condition) {
        conditionEstimationMultiplier = this.getConditionEffectEstimation(effect.condition, player, gameState);
      }
      if (isStructuredRewardEffect(effect)) {
        const rewards = this.getMultipliedRewardEffectEstimation(effect, gameState, timing);

        for (const reward of rewards) {
          evaluationValue +=
            this.getAmountAdjustedRewardEffectEvaluation(reward.type, reward.amount ?? 1, player, gameState) *
            conditionEstimationMultiplier;
        }
      } else if (isStructuredChoiceEffect(effect)) {
        evaluationValue += this.getChoiceEffectEvaluation(effect, player, gameState, timing) * conditionEstimationMultiplier;
      } else if (isStructuredConversionEffect(effect)) {
        evaluationValue +=
          this.getConversionEffectEvaluation(effect, player, gameState, timing) * conditionEstimationMultiplier;
      }
    }

    return evaluationValue;
  }

  getStructuredEffectsEvaluationForTurnState(
    effects: StructuredEffect[],
    player: Player,
    gameState: GameState,
    timing: EffectPlayerTurnTiming = 'agent-placement',
    ignoreConversionCosts = false,
    targetBoardSpace?: ActionField,
  ) {
    let evaluationValue = 0;
    for (const effect of effects) {
      let timingFullfilled = true;
      let conditionFullfilled = true;
      if (effect.timing) {
        timingFullfilled = isEffectTimingFullfilled(effect.timing.type, player, gameState);
      }
      if (effect.condition) {
        conditionFullfilled = isEffectConditionFullfilled(effect.condition, player, gameState);
      }
      if (timingFullfilled && conditionFullfilled) {
        if (isStructuredRewardEffect(effect)) {
          const rewards = getMultipliedRewardEffects(effect, gameState, timing);

          for (const reward of rewards) {
            evaluationValue += this.getAmountAdjustedRewardEffectEvaluationForTurnState(
              reward.type,
              reward.amount ?? 1,
              player,
              gameState,
              targetBoardSpace,
            );
          }
        } else if (isStructuredChoiceEffect(effect)) {
          evaluationValue += this.getChoiceEffectEvaluationForTurnState(effect, player, gameState, timing, targetBoardSpace);
        } else if (isStructuredConversionEffect(effect)) {
          if (ignoreConversionCosts || playerCanPayCosts(effect.effectCosts.effectRewards, player, gameState)) {
            evaluationValue += this.getConversionEffectEvaluationForTurnState(
              effect,
              player,
              gameState,
              timing,
              targetBoardSpace,
            );
          }
        }
      }
    }

    return evaluationValue;
  }

  getChoiceEffectEvaluation(
    choiceEffect: StructuredChoiceEffect,
    player: Player,
    gameState: GameState,
    timing: EffectPlayerTurnTiming = 'agent-placement',
  ) {
    let evaluationValue = 0;
    const leftSideEvaluation = isStructuredConversionEffect(choiceEffect.effectLeft)
      ? this.getConversionEffectEvaluation(choiceEffect.effectLeft, player, gameState, timing)
      : this.getRewardArrayEvaluation(
          this.getMultipliedRewardEffectEstimation(choiceEffect.effectLeft, gameState, timing),
          player,
          gameState,
        );
    const rightSideEvaluation = isStructuredConversionEffect(choiceEffect.effectRight)
      ? this.getConversionEffectEvaluation(choiceEffect.effectRight, player, gameState, timing)
      : this.getRewardArrayEvaluation(
          this.getMultipliedRewardEffectEstimation(choiceEffect.effectRight, gameState, timing),
          player,
          gameState,
        );

    evaluationValue += leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;

    return evaluationValue;
  }

  getChoiceEffectEvaluationForTurnState(
    choiceEffect: StructuredChoiceEffect,
    player: Player,
    gameState: GameState,
    timing: EffectPlayerTurnTiming = 'agent-placement',
    targetBoardSpace?: ActionField,
  ) {
    let evaluationValue = 0;
    const leftSideEvaluation = isStructuredConversionEffect(choiceEffect.effectLeft)
      ? this.getConversionEffectEvaluationForTurnState(choiceEffect.effectLeft, player, gameState, timing)
      : this.getRewardArrayEvaluationForTurnState(
          getMultipliedRewardEffects(choiceEffect.effectLeft, gameState, timing),
          player,
          gameState,
          targetBoardSpace,
        );
    const rightSideEvaluation = isStructuredConversionEffect(choiceEffect.effectRight)
      ? this.getConversionEffectEvaluationForTurnState(choiceEffect.effectRight, player, gameState, timing)
      : this.getRewardArrayEvaluationForTurnState(
          getMultipliedRewardEffects(choiceEffect.effectRight, gameState, timing),
          player,
          gameState,
          targetBoardSpace,
        );

    evaluationValue += leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;

    return evaluationValue;
  }

  getConversionEffectEvaluation(
    conversionEffect: StructuredConversionEffect,
    player: Player,
    gameState: GameState,
    timing: EffectPlayerTurnTiming = 'agent-placement',
  ) {
    let evaluationValue = 0;
    const costs = this.getMultipliedRewardEffectEstimation(conversionEffect.effectCosts, gameState, timing);
    const rewards = this.getMultipliedRewardEffectEstimation(conversionEffect.effectConversionRewards, gameState, timing);

    const costsEvaluation = this.getCostsArrayEvaluation(costs, player, gameState);
    const rewardsEvaluation = this.getRewardArrayEvaluation(rewards, player, gameState);

    if (-costsEvaluation + rewardsEvaluation > 0) {
      evaluationValue += -costsEvaluation + rewardsEvaluation;
    }
    return evaluationValue;
  }

  getConversionEffectEvaluationForTurnState(
    conversionEffect: StructuredConversionEffect,
    player: Player,
    gameState: GameState,
    timing: EffectPlayerTurnTiming = 'agent-placement',
    targetBoardSpace?: ActionField,
  ) {
    let evaluationValue = 0;
    const costs = getMultipliedRewardEffects(conversionEffect.effectCosts, gameState, timing);
    const rewards = getMultipliedRewardEffects(conversionEffect.effectConversionRewards, gameState, timing);

    const costsEvaluation = this.getCostsArrayEvaluationForTurnState(costs, player, gameState);
    const rewardsEvaluation = this.getRewardArrayEvaluationForTurnState(rewards, player, gameState, targetBoardSpace);

    evaluationValue += -costsEvaluation + rewardsEvaluation;
    return evaluationValue;
  }

  getConditionEffectEstimation(effectCondition: StructuredEffectCondition, player: Player, gameState: GameState) {
    if (effectCondition.type === 'condition-connection') {
      return 0.15 * gameState.playerCardsFactions[effectCondition.faction];
    } else if (effectCondition.type === 'condition-influence') {
      const factionScore = gameState.playerScore[effectCondition.faction];
      if (factionScore < effectCondition.amount) {
        return factionScore / effectCondition.amount;
      } else {
        return 1;
      }
    } else if (effectCondition.type === 'condition-high-council-seat') {
      return player.hasCouncilSeat ? 1.0 : 0.25;
    } else if (effectCondition.type === 'condition-no-high-council-seat') {
      return player.hasCouncilSeat ? 0.25 : 1.0;
    } else if (effectCondition.type === 'condition-enemies-on-this-field') {
      // AI cannot estimate that here, will estimate it at field evaluation
      return 0;
    }

    return 0;
  }

  private getMultipliedRewardEffectEstimation(
    rewardEffect: StructuredRewardEffect,
    gameState: GameState,
    timing: 'agent-placement' | 'reveal' = 'agent-placement',
  ): EffectReward[] {
    if (!rewardEffect.multiplier) {
      return rewardEffect.effectRewards;
    } else {
      let effectMultiplierAmount = 0;
      const result: EffectReward[] = [];

      if (rewardEffect.multiplier.type === 'multiplier-agents-on-board-spaces') {
        const totalAgentCount = gameState.playerAgentsAvailable + gameState.playerAgentsOnFields.length;
        effectMultiplierAmount = 0.8 * totalAgentCount;
      } else if (rewardEffect.multiplier.type === 'multiplier-dreadnought-amount') {
        const dreadnoughtCount = getPlayerdreadnoughtCount(gameState.playerCombatUnits);
        effectMultiplierAmount = 0.2 + 0.8 * dreadnoughtCount;
      } else if (rewardEffect.multiplier.type === 'multiplier-dreadnought-in-conflict-amount') {
        const dreadnoughtCount = getPlayerdreadnoughtCount(gameState.playerCombatUnits);
        effectMultiplierAmount = 0.2 + 0.6 * dreadnoughtCount;
      } else if (rewardEffect.multiplier.type === 'multiplier-dreadnought-in-garrison-amount') {
        const dreadnoughtCount = getPlayerdreadnoughtCount(gameState.playerCombatUnits);
        effectMultiplierAmount = 0.2 + 0.4 * dreadnoughtCount;
      } else if (rewardEffect.multiplier.type === 'multiplier-troops-in-conflict') {
        const troops = gameState.playerCombatUnits.troopsInGarrison;
        effectMultiplierAmount = 0.8 * gameState.playerCombatUnits.troopsInCombat + 0.5 * troops;
      } else if (rewardEffect.multiplier.type === 'multiplier-enemies-on-this-field') {
        // AI cannot estimate that here, will estimate it at field evaluation
        effectMultiplierAmount = 0;
      } else if (rewardEffect.multiplier.type === 'multiplier-cards-with-sword') {
        const cardSwordAmount = gameState.playerCardsRewards.sword;
        effectMultiplierAmount = 0.1 + 0.33 * cardSwordAmount;
      } else if (rewardEffect.multiplier.type === 'multiplier-connections') {
        const faction = rewardEffect.multiplier.faction;
        if (faction) {
          if (timing === 'agent-placement') {
            const cardAmount = gameState.playerCardsFactions[faction];
            effectMultiplierAmount = 0.25 * cardAmount;
          } else {
            const cardAmount = gameState.playerCardsFactions[faction];
            effectMultiplierAmount = 0.5 * cardAmount;
          }
        }
      } else if (rewardEffect.multiplier.type === 'multiplier-own-agents-on-field-type') {
        const totalAgentCount = gameState.playerAgentsAvailable + gameState.playerAgentsOnFields.length;
        effectMultiplierAmount = 0.4 * totalAgentCount;
      }

      if (effectMultiplierAmount > 0) {
        for (const reward of rewardEffect.effectRewards) {
          const rewardAmount = reward.amount ?? 1;
          result.push({ type: reward.type, amount: rewardAmount * effectMultiplierAmount });
        }
      }

      return result;
    }
  }

  getRewardArrayEvaluation(rewards: EffectReward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += this.getAmountAdjustedRewardEffectEvaluation(reward.type, reward.amount ?? 1, player, gameState);
    }
    return evaluationValue;
  }

  getCostsArrayEvaluation(rewards: EffectReward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += Math.abs(this.getRewardEffectEvaluation(reward.type, player, gameState) * (reward.amount ?? 1));
    }
    return evaluationValue;
  }

  getRewardArrayEvaluationForTurnState(
    rewards: EffectReward[],
    player: Player,
    gameState: GameState,
    targetBoardSpace?: ActionField,
  ) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      const rewardAmount = reward.amount ?? 1;
      evaluationValue += this.getAmountAdjustedRewardEffectEvaluationForTurnState(
        reward.type,
        rewardAmount,
        player,
        gameState,
        targetBoardSpace,
      );
    }
    return evaluationValue;
  }

  getCostsArrayEvaluationForTurnState(rewards: EffectReward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      const rewardAmount = reward.amount ?? 1;

      evaluationValue += Math.abs(
        this.getAmountAdjustedRewardEffectEvaluationForTurnState(reward.type, rewardAmount, player, gameState),
      );
    }
    return evaluationValue;
  }

  getAmountAdjustedRewardEffectEvaluation(
    rewardType: EffectRewardType,
    rewardAmount: number,
    player: Player,
    gameState: GameState,
  ) {
    const amountValueAdjustion = 1 + rewardAmount / 25;
    return this.getRewardEffectEvaluation(rewardType, player, gameState) * rewardAmount * amountValueAdjustion;
  }

  getAmountAdjustedRewardEffectEvaluationForTurnState(
    rewardType: EffectRewardType,
    rewardAmount: number,
    player: Player,
    gameState: GameState,
    targetBoardSpace?: ActionField,
  ) {
    const amountValueAdjustion = 1 + rewardAmount / 25;
    return (
      this.getRewardEffectEvaluationForTurnState(rewardType, rewardAmount, player, gameState, targetBoardSpace) *
      rewardAmount *
      amountValueAdjustion
    );
  }

  getRewardEffectEvaluation(rewardType: EffectRewardType, player: Player, gameState: GameState) {
    if (!this.ai) {
      return 0;
    }

    const game: AIRewardEffectGameInterface = {
      settings: {
        maxPlayerIntrigueCount: this.settingsService.getMaxPlayerIntrigueCount(),
        locationTakeoverTroopCosts: this.settingsService.getLocationTakeoverTroopCosts(),
        maxPlayerDreadnoughtCount: this.settingsService.getMaxPlayerDreadnoughtCount(),
        getBoardSpace: (id) => this.boardSpacesService.getBoardSpace(id),
      },
      getStructuredEffectsEvaluation: (effects, player, gameState, timing) =>
        this.getStructuredEffectsEvaluation(effects, player, gameState, timing),
      getStructuredEffectsEvaluationForTurnState: this.getStructuredEffectsEvaluationForTurnState,
    };

    return this.ai.rewardEffectEvaluation(rewardType, player, gameState, game);
  }

  getRewardEffectEvaluationForTurnState(
    rewardType: EffectRewardType,
    rewardAmount: number,
    player: Player,
    gameState: GameState,
    targetBoardSpace?: ActionField,
  ) {
    if (!this.ai) {
      return 0;
    }

    const game: AIRewardEffectGameInterface = {
      settings: {
        maxPlayerIntrigueCount: this.settingsService.getMaxPlayerIntrigueCount(),
        locationTakeoverTroopCosts: this.settingsService.getLocationTakeoverTroopCosts(),
        maxPlayerDreadnoughtCount: this.settingsService.getMaxPlayerDreadnoughtCount(),
        getBoardSpace: (id) => this.boardSpacesService.getBoardSpace(id),
      },
      getStructuredEffectsEvaluation: (effects, player, gameState, timing) =>
        this.getStructuredEffectsEvaluation(effects, player, gameState, timing),
      getStructuredEffectsEvaluationForTurnState: (
        effects,
        player,
        gameState,
        timing,
        ignoreConversionCosts,
        targetBoardSpace,
      ) =>
        this.getStructuredEffectsEvaluationForTurnState(
          effects,
          player,
          gameState,
          timing,
          ignoreConversionCosts,
          targetBoardSpace,
        ),
    };

    return this.ai.rewardEffectEvaluationForTurnState(rewardType, rewardAmount, player, gameState, game, targetBoardSpace);
  }
}
