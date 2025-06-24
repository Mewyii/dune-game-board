import { Injectable } from '@angular/core';
import { isArray } from 'lodash';
import { getParticipateInCombatDesire, getWinCombatDesire } from 'src/app/helpers/ai';
import { getPlayerdreadnoughtCount } from 'src/app/helpers/combat-units';
import {
  getMultipliedRewardEffects,
  isChoiceEffectType,
  isConversionEffectType,
  isStructuredChoiceEffect,
  isStructuredConditionalEffect,
  isStructuredConversionEffect,
  isTimingFullfilled,
} from 'src/app/helpers/rewards';
import {
  EffectReward,
  EffectRewardType,
  MultiplierEffectTiming,
  StructuredChoiceEffect,
  StructuredConditionalEffect,
  StructuredConversionEffect,
  StructuredEffects,
  StructuredMultiplierEffect,
} from 'src/app/models';
import { GameState } from 'src/app/models/ai';
import { Player } from 'src/app/models/player';
import {
  getResourceAmount,
  noOneHasMoreInfluence,
  playerAllianceIsContested,
  playerCanGetAllianceThisTurn,
  playerHasUncontestedAlliance,
} from '../../helpers/ai/ai-goals';
import { SettingsService } from '../settings.service';

@Injectable({
  providedIn: 'root',
})
export class AIEffectEvaluationService {
  constructor(private settingsService: SettingsService) {}

  public getStructuredEffectsEvaluation(
    effects: StructuredEffects,
    player: Player,
    gameState: GameState,
    timing: MultiplierEffectTiming = 'agent-placement'
  ) {
    let evaluationValue = 0;
    if (effects.rewards.length > 0) {
      evaluationValue += this.getRewardArrayEvaluation(effects.rewards, player, gameState);
    }
    for (const conversionEffect of effects.conversionEffects) {
      evaluationValue += this.getConversionEffectEvaluation(conversionEffect, player, gameState, timing);
    }
    for (const choiceEffect of effects.choiceEffects) {
      evaluationValue += this.getChoiceEffectEvaluation(choiceEffect, player, gameState, timing);
    }
    for (const conditionEffect of effects.conditionalEffects) {
      evaluationValue += this.getConditionEffectEvaluation(conditionEffect, player, gameState, timing);
    }
    for (const multiplierEffect of effects.multiplierEffects) {
      const rewards = this.getMultipliedRewardEffectEstimation(multiplierEffect, gameState, timing);

      for (const reward of rewards) {
        evaluationValue += this.getRewardEffectEvaluation(reward.type, player, gameState) * (reward.amount ?? 1);
      }
    }
    for (const timingEffect of effects.timingEffects) {
      if (isStructuredConditionalEffect(timingEffect.effect)) {
        evaluationValue += this.getConditionEffectEvaluation(timingEffect.effect, player, gameState, timing);
      } else if (isStructuredChoiceEffect(timingEffect.effect)) {
        evaluationValue += this.getChoiceEffectEvaluation(timingEffect.effect, player, gameState, timing);
      } else if (isStructuredConversionEffect(timingEffect.effect)) {
        evaluationValue += this.getConversionEffectEvaluation(timingEffect.effect, player, gameState, timing);
      } else {
        const rewards = this.getMultipliedRewardEffectEstimation(timingEffect.effect, gameState, timing);

        for (const reward of rewards) {
          evaluationValue += this.getRewardEffectEvaluation(reward.type, player, gameState) * (reward.amount ?? 1);
        }
      }
    }
    return evaluationValue;
  }

  public getStructuredEffectsEvaluationForTurnState(
    effects: StructuredEffects,
    player: Player,
    gameState: GameState,
    timing: MultiplierEffectTiming = 'agent-placement'
  ) {
    let evaluationValue = 0;
    if (effects.rewards.length > 0) {
      evaluationValue += this.getRewardArrayEvaluationForTurnState(effects.rewards, player, gameState);
    }
    for (const conversionEffect of effects.conversionEffects) {
      evaluationValue += this.getConversionEffectEvaluationForTurnState(conversionEffect, player, gameState, timing);
    }
    for (const choiceEffect of effects.choiceEffects) {
      evaluationValue += this.getChoiceEffectEvaluationForTurnState(choiceEffect, player, gameState, timing);
    }
    for (const conditionEffect of effects.conditionalEffects) {
      evaluationValue += this.getConditionEffectEvaluationForTurnState(conditionEffect, player, gameState, timing);
    }
    for (const multiplierEffect of effects.multiplierEffects) {
      const rewards = getMultipliedRewardEffects(multiplierEffect, gameState, timing);

      for (const reward of rewards) {
        evaluationValue += this.getRewardEffectEvaluation(reward.type, player, gameState) * (reward.amount ?? 1);
      }
    }
    for (const timingEffect of effects.timingEffects) {
      const timingFullfilled = isTimingFullfilled(timingEffect, player, gameState);

      if (timingFullfilled) {
        if (isStructuredConditionalEffect(timingEffect.effect)) {
          evaluationValue += this.getConditionEffectEvaluationForTurnState(timingEffect.effect, player, gameState, timing);
        } else if (isStructuredChoiceEffect(timingEffect.effect)) {
          evaluationValue += this.getChoiceEffectEvaluationForTurnState(timingEffect.effect, player, gameState, timing);
        } else if (isStructuredConversionEffect(timingEffect.effect)) {
          evaluationValue += this.getConversionEffectEvaluationForTurnState(timingEffect.effect, player, gameState, timing);
        } else {
          const rewards = getMultipliedRewardEffects(timingEffect.effect, gameState, timing);

          for (const reward of rewards) {
            evaluationValue += this.getRewardEffectEvaluation(reward.type, player, gameState) * (reward.amount ?? 1);
          }
        }
      }
    }
    return evaluationValue;
  }

  public getChoiceEffectEvaluation(
    choiceEffect: StructuredChoiceEffect,
    player: Player,
    gameState: GameState,
    timing: MultiplierEffectTiming = 'agent-placement'
  ) {
    let evaluationValue = 0;
    if (isChoiceEffectType(choiceEffect.choiceType)) {
      const leftSideEvaluation = isStructuredConversionEffect(choiceEffect.left)
        ? this.getConversionEffectEvaluation(choiceEffect.left, player, gameState, timing)
        : this.getRewardArrayEvaluation(
            this.getMultipliedRewardEffectEstimation(choiceEffect.left, gameState, timing),
            player,
            gameState
          );
      const rightSideEvaluation = isStructuredConversionEffect(choiceEffect.right)
        ? this.getConversionEffectEvaluation(choiceEffect.right, player, gameState, timing)
        : this.getRewardArrayEvaluation(
            this.getMultipliedRewardEffectEstimation(choiceEffect.right, gameState, timing),
            player,
            gameState
          );

      evaluationValue += leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
    }

    return evaluationValue;
  }

  public getChoiceEffectEvaluationForTurnState(
    choiceEffect: StructuredChoiceEffect,
    player: Player,
    gameState: GameState,
    timing: MultiplierEffectTiming = 'agent-placement'
  ) {
    let evaluationValue = 0;
    if (isChoiceEffectType(choiceEffect.choiceType)) {
      const leftSideEvaluation = isStructuredConversionEffect(choiceEffect.left)
        ? this.getConversionEffectEvaluationForTurnState(choiceEffect.left, player, gameState, timing)
        : this.getRewardArrayEvaluationForTurnState(
            getMultipliedRewardEffects(choiceEffect.left, gameState, timing),
            player,
            gameState
          );
      const rightSideEvaluation = isStructuredConversionEffect(choiceEffect.right)
        ? this.getConversionEffectEvaluationForTurnState(choiceEffect.right, player, gameState, timing)
        : this.getRewardArrayEvaluationForTurnState(
            getMultipliedRewardEffects(choiceEffect.right, gameState, timing),
            player,
            gameState
          );

      evaluationValue += leftSideEvaluation > rightSideEvaluation ? leftSideEvaluation : rightSideEvaluation;
    }

    return evaluationValue;
  }

  public getConversionEffectEvaluation(
    conversionEffect: StructuredConversionEffect,
    player: Player,
    gameState: GameState,
    timing: MultiplierEffectTiming = 'agent-placement'
  ) {
    let evaluationValue = 0;
    if (isConversionEffectType(conversionEffect.conversionType)) {
      const costs = this.getMultipliedRewardEffectEstimation(conversionEffect.costs, gameState, timing);
      const rewards = this.getMultipliedRewardEffectEstimation(conversionEffect.rewards, gameState, timing);

      const costsEvaluation = this.getCostsArrayEvaluation(costs, player, gameState);
      const rewardsEvaluation = this.getRewardArrayEvaluation(rewards, player, gameState);

      if (-costsEvaluation + rewardsEvaluation > 0) {
        evaluationValue += -costsEvaluation + rewardsEvaluation;
      }
    }
    return evaluationValue;
  }

  public getConversionEffectEvaluationForTurnState(
    conversionEffect: StructuredConversionEffect,
    player: Player,
    gameState: GameState,
    timing: MultiplierEffectTiming = 'agent-placement'
  ) {
    let evaluationValue = 0;
    if (isConversionEffectType(conversionEffect.conversionType)) {
      const costs = getMultipliedRewardEffects(conversionEffect.costs, gameState, timing);
      const rewards = getMultipliedRewardEffects(conversionEffect.rewards, gameState, timing);

      const costsEvaluation = this.getCostsArrayEvaluationForTurnState(costs, player, gameState);
      const rewardsEvaluation = this.getRewardArrayEvaluationForTurnState(rewards, player, gameState);

      evaluationValue += -costsEvaluation + rewardsEvaluation;
    }
    return evaluationValue;
  }

  public getConditionEffectEvaluation(
    conditionEffect: StructuredConditionalEffect,
    player: Player,
    gameState: GameState,
    timing: MultiplierEffectTiming = 'agent-placement'
  ) {
    let evaluationValue = 0;
    if (isStructuredChoiceEffect(conditionEffect.effect)) {
      evaluationValue += this.getChoiceEffectEvaluation(conditionEffect.effect, player, gameState, timing);
    } else if (isStructuredConversionEffect(conditionEffect.effect)) {
      evaluationValue += this.getConversionEffectEvaluation(conditionEffect.effect, player, gameState, timing);
    } else {
      const rewards = this.getMultipliedRewardEffectEstimation(conditionEffect.effect, gameState, timing);

      evaluationValue += this.getRewardArrayEvaluation(rewards, player, gameState);
    }

    if (conditionEffect.condition === 'condition-connection') {
      evaluationValue = 0.25 * evaluationValue + 0.15 * gameState.playerCardsFactions[conditionEffect.faction];
    } else if (conditionEffect.condition === 'condition-influence') {
      const factionScore = gameState.playerScore[conditionEffect.faction];
      if (conditionEffect.amount && factionScore < conditionEffect.amount) {
        evaluationValue = (evaluationValue * factionScore) / conditionEffect.amount;
      }
    } else if (conditionEffect.condition === 'condition-high-council-seat') {
      evaluationValue = evaluationValue * (player.hasCouncilSeat ? 1.0 : 0.25);
    }

    return evaluationValue;
  }

  public getConditionEffectEvaluationForTurnState(
    conditionEffect: StructuredConditionalEffect,
    player: Player,
    gameState: GameState,
    timing: MultiplierEffectTiming = 'agent-placement'
  ) {
    let evaluationValue = 0;
    if (isStructuredChoiceEffect(conditionEffect.effect)) {
      evaluationValue += this.getChoiceEffectEvaluationForTurnState(conditionEffect.effect, player, gameState, timing);
    } else if (isStructuredConversionEffect(conditionEffect.effect)) {
      evaluationValue += this.getConversionEffectEvaluationForTurnState(conditionEffect.effect, player, gameState, timing);
    } else {
      const rewards = getMultipliedRewardEffects(conditionEffect.effect, gameState, timing);

      evaluationValue += this.getRewardArrayEvaluationForTurnState(rewards, player, gameState);
    }

    if (conditionEffect.condition === 'condition-connection') {
      if (gameState.playerCardsFactionsInPlay[conditionEffect.faction] > 0) {
        return evaluationValue;
      }
    } else if (conditionEffect.condition === 'condition-influence') {
      const factionScore = gameState.playerScore[conditionEffect.faction];
      if (conditionEffect.amount && factionScore >= conditionEffect.amount) {
        return evaluationValue;
      }
    } else if (conditionEffect.condition === 'condition-high-council-seat') {
      if (player.hasCouncilSeat) {
        return evaluationValue;
      }
    }

    return 0;
  }

  private getMultipliedRewardEffectEstimation(
    multiplierEffectOrRewardArray: StructuredMultiplierEffect | EffectReward[],
    gameState: GameState,
    timing: 'agent-placement' | 'reveal' = 'agent-placement'
  ): EffectReward[] {
    if (isArray(multiplierEffectOrRewardArray)) {
      return multiplierEffectOrRewardArray;
    } else {
      let effectMultiplierAmount = 0;
      const result: EffectReward[] = [];

      if (multiplierEffectOrRewardArray.multiplier === 'multiplier-agents-on-board-spaces') {
        const totalAgentCount = gameState.playerAgentsAvailable + gameState.playerAgentsOnFields.length;
        effectMultiplierAmount = 0.8 * totalAgentCount;
      } else if (multiplierEffectOrRewardArray.multiplier === 'multiplier-dreadnought-amount') {
        const dreadnoughtCount = getPlayerdreadnoughtCount(gameState.playerCombatUnits);
        effectMultiplierAmount = 0.2 + 0.8 * dreadnoughtCount;
      } else if (multiplierEffectOrRewardArray.multiplier === 'multiplier-dreadnought-in-conflict-amount') {
        const dreadnoughtCount = getPlayerdreadnoughtCount(gameState.playerCombatUnits);
        effectMultiplierAmount = 0.2 + 0.6 * dreadnoughtCount;
      } else if (multiplierEffectOrRewardArray.multiplier === 'multiplier-dreadnought-in-garrison-amount') {
        const dreadnoughtCount = getPlayerdreadnoughtCount(gameState.playerCombatUnits);
        effectMultiplierAmount = 0.2 + 0.4 * dreadnoughtCount;
      } else if (multiplierEffectOrRewardArray.multiplier === 'multiplier-troops-in-conflict') {
        const troops = gameState.playerCombatUnits.troopsInGarrison;
        effectMultiplierAmount = 2 + 0.5 * troops;
      } else if (multiplierEffectOrRewardArray.multiplier === 'multiplier-cards-with-sword') {
        const cardSwordAmount = gameState.playerCardsRewards.sword;
        effectMultiplierAmount = 0.1 + 0.33 * cardSwordAmount;
      } else if (multiplierEffectOrRewardArray.multiplier === 'multiplier-connections') {
        const faction = multiplierEffectOrRewardArray.faction;
        if (faction) {
          if (timing === 'agent-placement') {
            const cardAmount = gameState.playerCardsFactions[faction];
            effectMultiplierAmount = 0.25 * cardAmount;
          } else {
            const cardAmount = gameState.playerCardsFactions[faction];
            effectMultiplierAmount = 0.5 * cardAmount;
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

  public getRewardArrayEvaluation(rewards: EffectReward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += this.getRewardEffectEvaluation(reward.type, player, gameState) * (reward.amount ?? 1);
    }
    return evaluationValue;
  }

  public getCostsArrayEvaluation(rewards: EffectReward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += Math.abs(this.getRewardEffectEvaluation(reward.type, player, gameState) * (reward.amount ?? 1));
    }
    return evaluationValue;
  }

  public getRewardArrayEvaluationForTurnState(rewards: EffectReward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += this.getRewardEffectEvaluationForTurnState(reward.type, player, gameState) * (reward.amount ?? 1);
    }
    return evaluationValue;
  }

  public getCostsArrayEvaluationForTurnState(rewards: EffectReward[], player: Player, gameState: GameState) {
    let evaluationValue = 0;
    for (const reward of rewards) {
      evaluationValue += Math.abs(
        this.getRewardEffectEvaluationForTurnState(reward.type, player, gameState) * (reward.amount ?? 1)
      );
    }
    return evaluationValue;
  }

  public getRewardEffectEvaluation(rewardType: EffectRewardType, player: Player, gameState: GameState) {
    switch (rewardType) {
      case 'water':
        return (
          2.9 +
          0.02 * gameState.playerTechTilesConversionCosts.water -
          (player.hasSwordmaster ? 0.15 : 0) -
          (player.hasCouncilSeat ? 0.15 : 0) -
          0.05 * getPlayerdreadnoughtCount(gameState.playerCombatUnits) -
          0.01 * (gameState.currentRound - 1) -
          0.02 * gameState.playerCardsRewards.water -
          0.02 * gameState.playerTechTilesRewards.water
        );
      case 'spice':
        return (
          2.4 +
          0.015 * gameState.playerTechTilesConversionCosts.spice -
          (player.hasSwordmaster ? 0.225 : 0) -
          (player.hasCouncilSeat ? 0.225 : 0) -
          0.1 * getPlayerdreadnoughtCount(gameState.playerCombatUnits) -
          0.025 * (gameState.currentRound - 1) -
          0.015 * gameState.playerCardsRewards.spice -
          0.015 * gameState.playerTechTilesRewards.spice
        );
      case 'solari':
        return (
          1.4 +
          0.01 * gameState.playerTechTilesConversionCosts.solari -
          (player.hasSwordmaster ? 0.3 : 0) -
          (player.hasCouncilSeat ? 0.3 : 0) -
          0.15 * getPlayerdreadnoughtCount(gameState.playerCombatUnits) -
          0.05 * (gameState.currentRound - 1) -
          0.01 * gameState.playerCardsRewards.solari -
          0.01 * gameState.playerTechTilesRewards.solari
        );
      case 'tech':
        return (
          2 +
          0.01 * gameState.playerTechTilesConversionCosts.tech -
          0.025 * (gameState.currentRound - 1) -
          0.01 * gameState.playerCardsRewards.tech -
          0.01 * gameState.playerTechTilesRewards.tech
        );
      case 'troop':
        return (
          1.75 + 0.015 * gameState.playerTechTilesConversionCosts['loose-troop'] - 0.015 * gameState.playerCardsRewards.troop
        );
      case 'dreadnought':
        return (getPlayerdreadnoughtCount(gameState.playerCombatUnits) < 2 ? 7 : 0) + 0.25 * (gameState.currentRound - 1);
      case 'card-draw':
        return (
          1.75 +
          0.1 * gameState.playerCardsBought +
          0.1 * gameState.playerCardsTrashed +
          0.033 * (7 - gameState.playerCardsFieldAccess.length) -
          0.015 * gameState.playerCardsRewards['card-draw']
        );
      case 'card-discard':
        return -1.66 - 0.075 * gameState.playerCardsBought - 0.075 * gameState.playerCardsTrashed;
      case 'card-destroy':
      case 'focus':
        return (
          2 +
          0.15 * gameState.playerCardsBought -
          0.3 * gameState.playerCardsTrashed -
          0.02 * gameState.playerCardsRewards.focus
        );
      case 'card-draw-or-destroy':
        return 2 + 0.05 * gameState.playerCardsBought + 0.05 * gameState.playerCardsTrashed;
      case 'intrigue':
        return 1.75 + 0.1 * (gameState.currentRound - 1) - 0.015 * gameState.playerCardsRewards.focus;
      case 'persuasion':
        return 2.5 - 0.15 * (gameState.currentRound - 1);
      case 'foldspace':
        return (
          2.5 -
          0.1 * gameState.playerCardsBought -
          0.1 * gameState.playerCardsTrashed +
          0.1 * (7 - gameState.playerCardsFieldAccess.length)
        );
      case 'council-seat-small':
      case 'council-seat-large':
        return !player.hasCouncilSeat ? 12 - 1 * (gameState.currentRound - 1) : 0;
      case 'sword-master':
      case 'agent':
        return !player.hasSwordmaster ? 15 - 1 * (gameState.currentRound - 1) : 0;
      case 'mentat':
        return 3.5;
      case 'spice-accumulation':
        return 0;
      case 'victory-point':
        return 8 + 1.66 * (gameState.currentRound - 1);
      case 'sword':
        return 1 + 0.05 * (gameState.currentRound - 1);
      case 'combat':
        return 1 + 0.2 * (gameState.currentRound - 1);
      case 'intrigue-trash':
        return -1;
      case 'intrigue-draw':
        return 0.25;
      case 'shipping':
        return 2.5 - 0.1 * getResourceAmount(player, 'water') - 0.1 * getResourceAmount(player, 'spice');
      case 'faction-influence-up-choice':
        return 4;
      case 'faction-influence-up-emperor':
        return gameState.playerScore.emperor < gameState.gameSettings.factionInfluenceMaxScore
          ? 3 - 0.1 * gameState.playerScore.emperor - (playerHasUncontestedAlliance(gameState, 'emperor') ? 1 : 0)
          : 0;
      case 'faction-influence-up-guild':
        return gameState.playerScore.guild < gameState.gameSettings.factionInfluenceMaxScore
          ? 3 - 0.1 * gameState.playerScore.guild - (playerHasUncontestedAlliance(gameState, 'guild') ? 1 : 0)
          : 0;
      case 'faction-influence-up-bene':
        return gameState.playerScore.bene < gameState.gameSettings.factionInfluenceMaxScore
          ? 3 - 0.1 * gameState.playerScore.bene - (playerHasUncontestedAlliance(gameState, 'bene') ? 1 : 0)
          : 0;
      case 'faction-influence-up-fremen':
        return gameState.playerScore.fremen < gameState.gameSettings.factionInfluenceMaxScore
          ? 3 - 0.1 * gameState.playerScore.fremen - (playerHasUncontestedAlliance(gameState, 'fremen') ? 1 : 0)
          : 0;
      case 'faction-influence-up-twice-choice':
        return 6;
      case 'faction-influence-down-choice':
        return -2.5;
      case 'faction-influence-down-emperor':
      case 'faction-influence-down-guild':
      case 'faction-influence-down-bene':
      case 'faction-influence-down-fremen':
        return -3;
      case 'agent-lift':
        return 3 + 0.25 * (gameState.currentRound - 1);
      case 'signet-token':
        return 0;
      case 'signet-ring':
        return gameState.playerLeaderSignetRingEffects
          ? this.getStructuredEffectsEvaluation(gameState.playerLeaderSignetRingEffects, player, gameState)
          : 3;
      case 'location-control':
        return 6 + 0.25 * (gameState.currentRound - 1);
      case 'loose-troop':
        return -1.5 + 0.1 * (gameState.currentRound - 1);
      case 'trash-self':
        return -1.25;
      case 'troop-insert':
      case 'troop-insert-or-retreat':
      case 'troop-retreat':
        return 1.0 + 0.125 * (gameState.currentRound - 1);
      case 'dreadnought-insert':
      case 'dreadnought-insert-or-retreat':
        return getPlayerdreadnoughtCount(gameState.playerCombatUnits) > 0 ? 2 : 1;
      case 'dreadnought-retreat':
        return getPlayerdreadnoughtCount(gameState.playerCombatUnits) > 0 ? -1 : -3;
      case 'enemies-card-discard':
        return 2 + 0.2 * (gameState.currentRound - 1);
      case 'enemies-troop-destroy':
        return 2.5 - 0.1 * (gameState.currentRound - 1);
      case 'enemies-intrigue-trash':
        return 2.75;
      case 'card-return-to-hand':
        return 2 + 0.1 * gameState.playerCardsBought - 0.1 * gameState.playerCardsTrashed;
      default:
        return 0;
    }
  }

  public getRewardEffectEvaluationForTurnState(rewardType: EffectRewardType, player: Player, gameState: GameState) {
    const hasPlacedAgents = gameState.playerAgentsOnFields.length > 0;
    const hasAgentsLeftToPlace = player.agents - gameState.playerAgentsOnFields.length > 0;

    const value = this.getRewardEffectEvaluation(rewardType, player, gameState);

    switch (rewardType) {
      case 'water':
        return (
          value -
          0.4 * getResourceAmount(player, 'water') +
          0.3 * gameState.playerIntriguesConversionCosts.water +
          0.3 * gameState.playerTechTilesConversionCosts.water
        );
      case 'spice':
        return (
          value -
          0.2 * getResourceAmount(player, 'spice') +
          0.2 * gameState.playerIntriguesConversionCosts.spice +
          0.2 * gameState.playerTechTilesConversionCosts.spice
        );
      case 'solari':
        return (
          value -
          0.1 * getResourceAmount(player, 'solari') +
          0.1 * gameState.playerIntriguesConversionCosts.solari +
          0.1 * gameState.playerTechTilesConversionCosts.solari
        );
      case 'tech':
        return (
          value +
          0.2 * player.tech +
          0.2 * gameState.playerIntriguesConversionCosts.tech +
          0.2 * gameState.playerTechTilesConversionCosts.tech
        );
      case 'troop':
        return (
          value +
          0.2 * (3 - gameState.playerCombatUnits.troopsInGarrison) +
          0.2 * gameState.playerIntriguesConversionCosts['loose-troop'] +
          0.2 * gameState.playerTechTilesConversionCosts['loose-troop']
        );
      case 'dreadnought':
        return value + 0.1 * gameState.playerCombatUnits.troopsInGarrison;
      case 'card-draw':
        if (player.turnState === 'reveal') {
          return -5;
        } else {
          return gameState.playerDeckCards.length > 0 ? value : 0;
        }
      case 'card-discard':
        return value;
      case 'card-destroy':
      case 'focus':
        return gameState.playerDeckSizeTotal > 7 ? value : 0;
      case 'card-draw-or-destroy':
        return gameState.playerDeckCards.length > 0 || gameState.playerDeckSizeTotal > 6 ? value : 0;
      case 'intrigue':
        return value - 0.33 * gameState.playerIntrigueCount;
      case 'persuasion':
        return value;
      case 'foldspace':
        return (hasAgentsLeftToPlace ? value : 0.33 * value) + 0.1 * (7 - gameState.playerCardsFieldAccess.length);
      case 'council-seat-small':
      case 'council-seat-large':
        return value;
      case 'sword-master':
      case 'agent':
        return value;
      case 'mentat':
        return value;
      case 'spice-accumulation':
        return value;
      case 'victory-point':
        return value;
      case 'sword':
        return gameState.playerCombatUnits.troopsInCombat > 0 || gameState.playerCombatUnits.shipsInCombat > 0
          ? hasAgentsLeftToPlace || gameState.currentRoundPhase === 'combat'
            ? value
            : 0.75 * value
          : 0;
      case 'combat':
        const participateDesire = getParticipateInCombatDesire(gameState);
        const winDesire = getWinCombatDesire(gameState);
        return (winDesire > participateDesire ? winDesire : participateDesire) * 2.5;
      case 'intrigue-trash':
        return value;
      case 'intrigue-draw':
        return value + 2 * gameState.playerIntrigueStealAmount;
      case 'shipping':
        return value;
      case 'faction-influence-up-choice':
        return value;
      case 'faction-influence-up-emperor':
        return (
          value +
          0.15 * gameState.playerScore.emperor +
          (noOneHasMoreInfluence(player, gameState, 'emperor') ? 0.05 * gameState.currentRound : 0) +
          (playerCanGetAllianceThisTurn(player, gameState, 'emperor') ? 1 : 0) +
          (playerAllianceIsContested(gameState, 'emperor') ? 1 : 0) -
          (gameState.enemyScore.some((x) => x.emperor >= gameState.gameSettings.factionInfluenceMaxScore) ? 2 : 0)
        );
      case 'faction-influence-up-guild':
        return (
          value +
          0.15 * gameState.playerScore.guild +
          (noOneHasMoreInfluence(player, gameState, 'guild') ? 0.05 * gameState.currentRound : 0) +
          (playerCanGetAllianceThisTurn(player, gameState, 'guild') ? 1 : 0) +
          (playerAllianceIsContested(gameState, 'guild') ? 1 : 0) -
          (gameState.enemyScore.some((x) => x.guild >= gameState.gameSettings.factionInfluenceMaxScore) ? 2 : 0)
        );
      case 'faction-influence-up-bene':
        return (
          value +
          0.15 * gameState.playerScore.bene +
          (noOneHasMoreInfluence(player, gameState, 'bene') ? 0.05 * gameState.currentRound : 0) +
          (playerCanGetAllianceThisTurn(player, gameState, 'bene') ? 1 : 0) +
          (playerAllianceIsContested(gameState, 'bene') ? 1 : 0) -
          (gameState.enemyScore.some((x) => x.bene >= gameState.gameSettings.factionInfluenceMaxScore) ? 2 : 0)
        );
      case 'faction-influence-up-fremen':
        return (
          value +
          0.15 * gameState.playerScore.fremen +
          (noOneHasMoreInfluence(player, gameState, 'fremen') ? 0.05 * gameState.currentRound : 0) +
          (playerCanGetAllianceThisTurn(player, gameState, 'fremen') ? 1 : 0) +
          (playerAllianceIsContested(gameState, 'fremen') ? 1 : 0) -
          (gameState.enemyScore.some((x) => x.fremen >= gameState.gameSettings.factionInfluenceMaxScore) ? 2 : 0)
        );
      case 'faction-influence-up-twice-choice':
        return value;
      case 'faction-influence-down-choice':
        return value;
      case 'faction-influence-down-emperor':
      case 'faction-influence-down-guild':
      case 'faction-influence-down-bene':
      case 'faction-influence-down-fremen':
        return value;
      case 'agent-lift':
        if (player.turnState === 'reveal') {
          return -5;
        } else {
          return hasPlacedAgents && hasAgentsLeftToPlace ? value : 0;
        }
      case 'signet-token':
        return value;
      case 'signet-ring':
        return gameState.playerLeaderSignetRingEffects
          ? this.getStructuredEffectsEvaluationForTurnState(gameState.playerLeaderSignetRingEffects, player, gameState)
          : value;
      case 'location-control':
        const controllableFreeLocations = gameState.playerAgentsOnFields.some((x) =>
          gameState.freeLocations.some((y) => x.fieldId === y)
        );
        const controllableEnemyLocations =
          gameState.playerAgentsOnFields.some((x) => gameState.enemyLocations.some((y) => x.fieldId === y)) &&
          gameState.playerCombatUnits.troopsInGarrison >= (this.settingsService.getLocationTakeoverTroopCosts() ?? 0);

        return controllableFreeLocations ? value : controllableEnemyLocations ? value * 0.8 : -5;
      case 'loose-troop':
        return value + 0.33 * gameState.playerCombatUnits.troopsInGarrison;
      case 'trash-self':
        return value;
      case 'troop-insert':
      case 'troop-insert-or-retreat':
      case 'troop-retreat':
        return gameState.playerCombatUnits.troopsInGarrison > 0 ? value : 0;
      case 'dreadnought-insert':
      case 'dreadnought-insert-or-retreat':
        return gameState.playerCombatUnits.shipsInGarrison > 0 ? value : 0;
      case 'dreadnought-retreat':
        const unitsInCombat = gameState.playerCombatUnits.shipsInCombat + gameState.playerCombatUnits.troopsInCombat;
        return value * (4 - gameState.playerAgentsAvailable / 2) - (unitsInCombat < 2 ? 2 : 0);
      case 'enemies-card-discard':
        return (
          (value * gameState.enemyAgentsAvailable.filter((x) => x.agentAmount > 0).length) / (gameState.playersCount - 1)
        );
      case 'enemies-troop-destroy':
        return (
          (value * gameState.enemyCombatUnits.filter((x) => x.troopsInCombat > 0 || x.troopsInGarrison > 0).length) /
          (gameState.playersCount - 1)
        );
      case 'enemies-intrigue-trash':
        return (
          (value * gameState.enemyIntrigueCounts.filter((x) => x.intrigueCount > 0).length) / (gameState.playersCount - 1)
        );
      case 'card-return-to-hand':
        const playerDiscardPileCount = gameState.playerDiscardPileCards?.length ?? 0;
        return playerDiscardPileCount > 0 ? value : 0;
      default:
        return value;
    }
  }
}
