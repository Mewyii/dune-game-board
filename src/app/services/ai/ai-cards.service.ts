import { Injectable } from '@angular/core';
import { shuffle } from 'lodash';
import { hasCustomAgentEffect, hasCustomRevealEffect } from 'src/app/helpers/cards';
import { getCardCostModifier } from 'src/app/helpers/game-modifiers';
import {
  getMultipliedRewardEffects,
  getRewardArrayAIInfos,
  isStructuredChoiceEffect,
  isStructuredConversionEffect,
  isStructuredRewardEffect,
  playerCanPayCosts,
} from 'src/app/helpers/rewards';
import { ActionField, EffectReward } from 'src/app/models';
import { GameState } from 'src/app/models/ai';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { Player } from 'src/app/models/player';
import { ImperiumDeckCard, ImperiumRowPlot } from '../cards.service';
import { ImperiumRowModifier } from '../game-modifier.service';
import { AIEffectEvaluationService } from './ai.effect-evaluation.service';

@Injectable({
  providedIn: 'root',
})
export class AICardsService {
  constructor(private effectEvaluationService: AIEffectEvaluationService) {}

  getCardToPlay(playerHandCards: ImperiumDeckCard[], player: Player, gameState: GameState, preferredField?: ActionField) {
    let usableCards = playerHandCards;
    if (preferredField) {
      usableCards = usableCards.filter((x) => x.fieldAccess?.some((accessType) => accessType === preferredField.actionType));
    }

    if (usableCards.length > 0) {
      const cardEvaluations = usableCards.map((card) => {
        const evaluation = this.getImperiumCardPlayEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  getImperiumCardToBuy<T extends ImperiumDeckCard>(
    availablePersuasion: number,
    cards: T[],
    player: Player,
    gameState: GameState,
    imperiumRowModifiers?: ImperiumRowModifier[],
  ): T | undefined {
    const buyableCards = cards.filter(
      (x) => (x.persuasionCosts ?? 0) + getCardCostModifier(x, imperiumRowModifiers) <= availablePersuasion,
    );
    if (buyableCards.length > 0) {
      const cardEvaluations = buyableCards.map((card) => {
        const evaluation = this.getImperiumCardBuyEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  getPlotToBuy(
    availablePersuasion: number,
    cards: ImperiumRowPlot[],
    player: Player,
    imperiumRowModifiers?: ImperiumRowModifier[],
  ) {
    const buyableCards = cards.filter(
      (x) => (x.persuasionCosts ?? 0) + getCardCostModifier(x, imperiumRowModifiers) <= availablePersuasion,
    );
    if (buyableCards.length > 0) {
      return shuffle(buyableCards)[0];
    }
    return undefined;
  }

  getCardToDiscard(playerHandCards: ImperiumDeckCard[], player: Player, gameState: GameState) {
    if (playerHandCards.length > 0) {
      const cardEvaluations = playerHandCards.map((card) => {
        const evaluation = this.getImperiumCardTrashEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  getCardToTrash(cards: ImperiumDeckCard[], player: Player, gameState: GameState) {
    if (cards.length > 0) {
      const cardEvaluations = cards.map((card) => {
        const evaluation = this.getImperiumCardTrashEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  aiGetPlayableAndUsefulIntrigues(player: Player, intrigues: IntrigueDeckCard[] | undefined, gameState: GameState) {
    const playableAndUsefulIntrigues: IntrigueDeckCard[] = [];
    if (!intrigues) {
      return playableAndUsefulIntrigues;
    }
    for (const intrigue of intrigues) {
      let { isUseful, costs } = this.getIntriguePlayEvaluation(intrigue, player, gameState);

      if (isUseful && playerCanPayCosts(costs, player, gameState)) {
        playableAndUsefulIntrigues.push(intrigue);
      }
    }

    return playableAndUsefulIntrigues;
  }

  aiIsPlayableAndUsefulIntrigue(player: Player, intrigue: IntrigueDeckCard, gameState: GameState) {
    let { isUseful, costs } = this.getIntriguePlayEvaluation(intrigue, player, gameState);

    // Fix so the AI recognizes it can't trash the intrigue it's about to play
    if (costs.some((x) => x.type === 'intrigue-trash')) {
      costs.push({ type: 'intrigue-trash' });
    }
    if (isUseful && playerCanPayCosts(costs, player, gameState)) {
      return true;
    }

    return false;
  }

  getIntriguePlayEvaluation(
    intrigue: IntrigueDeckCard,
    player: Player,
    gameState: GameState,
  ): { isUseful: boolean; costs: EffectReward[] } {
    const intrigueEffects =
      gameState.currentRoundPhase === 'agent-placement' ? intrigue.structuredPlotEffects : intrigue.structuredCombatEffects;

    if (intrigueEffects) {
      return this.effectEvaluationService.getStructuredEffectUsefulnesAndCosts(intrigueEffects, player, gameState);
    }
    return { isUseful: false, costs: [] };
  }

  getIntrigueToTrash(playerIntrigueCards: IntrigueDeckCard[], player: Player, gameState: GameState) {
    if (playerIntrigueCards.length > 0) {
      const cardEvaluations = playerIntrigueCards.map((card) => {
        const evaluation = this.getIntrigueCardTrashEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  getImperiumCardPlayEvaluation(
    card: ImperiumDeckCard,
    player: Player,
    gameState: GameState,
    targetBoardSpace?: ActionField,
  ) {
    let evaluationValue = 0;
    if (card.faction) {
      evaluationValue +=
        1 * gameState.playerHandCardsConnectionAgentEffects[card.faction] +
        0.1 * gameState.playerCardsConnectionEffects[card.faction] +
        0.33 * gameState.playerHandCardsFactions[card.faction] +
        0.1 * gameState.playerCardsFactions[card.faction];
    }
    if (card.fieldAccess) {
      evaluationValue -= card.fieldAccess.length * 0.1;
    }
    if (card.canInfiltrate) {
      const totalAgents = gameState.playerAgentsOnFields.length + gameState.playerAgentsAvailable;
      const agentsPlaced = gameState.playerAgentsOnFields.length;
      evaluationValue += 4 * (agentsPlaced / (totalAgents - 1)) - 3;
    }
    if (card.structuredAgentEffects) {
      evaluationValue += this.effectEvaluationService.getStructuredEffectsEvaluationForTurnState(
        card.structuredAgentEffects,
        player,
        gameState,
        'agent-placement',
        false,
        targetBoardSpace,
      );
    }
    if (hasCustomAgentEffect(card)) {
      if (card.aiAgentEvaluation) {
        evaluationValue += card.aiAgentEvaluation(player, gameState);
      } else {
        let evaluationEstimation = 0.5;
        if (card.structuredAgentEffects) {
          evaluationEstimation = 0.33;
        }
        evaluationValue += 1 + evaluationEstimation * (card.persuasionCosts ?? 0);
      }
    }

    if (card.structuredRevealEffects) {
      const revealEffects = card.structuredRevealEffects;
      for (const revealEffect of revealEffects) {
        const conditionMultiplier = revealEffect.condition ? 0.8 : 1;
        if (isStructuredRewardEffect(revealEffect)) {
          const rewards = getMultipliedRewardEffects(revealEffect, gameState, 'reveal');
          evaluationValue -=
            this.effectEvaluationService.getRewardArrayEvaluationForTurnState(rewards, player, gameState) *
            0.8 *
            conditionMultiplier;
        } else if (isStructuredChoiceEffect(revealEffect)) {
          evaluationValue -=
            this.effectEvaluationService.getChoiceEffectEvaluationForTurnState(revealEffect, player, gameState, 'reveal') *
            0.8 *
            conditionMultiplier;
        } else if (isStructuredConversionEffect(revealEffect)) {
          evaluationValue -=
            this.effectEvaluationService.getConversionEffectEvaluationForTurnState(
              revealEffect,
              player,
              gameState,
              'reveal',
            ) *
            0.7 *
            conditionMultiplier;
        }
      }
    }
    if (hasCustomRevealEffect(card)) {
      if (card.aiRevealEvaluation) {
        evaluationValue += card.aiRevealEvaluation(player, gameState);
      } else {
        let evaluationEstimation = 0.5;
        if (card.structuredRevealEffects) {
          evaluationEstimation = 0.33;
        }
        evaluationValue += 1 + evaluationEstimation * (card.persuasionCosts ?? 0);
      }
    }

    return evaluationValue;
  }

  getImperiumCardBuyEvaluation(card: ImperiumDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;
    if (card.faction) {
      evaluationValue +=
        1 * gameState.playerCardsConnectionEffects[card.faction] +
        0.5 * gameState.playerCardsFactions[card.faction] +
        0.5 * gameState.playerTechTilesFactions[card.faction];
    }
    if (card.persuasionCosts) {
      evaluationValue += card.persuasionCosts * 0.1;
    }
    if (card.buyEffects) {
      const { hasRewardChoice: hasRewardOptions, hasRewardConversion } = getRewardArrayAIInfos(card.buyEffects);
      if (!hasRewardOptions && !hasRewardConversion) {
        evaluationValue +=
          this.effectEvaluationService.getRewardArrayEvaluationForTurnState(card.buyEffects, player, gameState) * 0.75 +
          0.05 * (gameState.currentRound - 1);
      }
    }
    if (card.fieldAccess) {
      for (const access of card.fieldAccess) {
        evaluationValue += gameState.playerCardsFieldAccessCounts[access] < 2 ? 2 : 0.5;
      }
    }
    if (card.canInfiltrate) {
      evaluationValue += 0.5 * (card.fieldAccess?.length ?? 0);
    }

    if (card.structuredAgentEffects) {
      evaluationValue += this.effectEvaluationService.getStructuredEffectsEvaluation(
        card.structuredAgentEffects,
        player,
        gameState,
      );
    }
    if (hasCustomAgentEffect(card)) {
      if (card.aiAgentEvaluation) {
        evaluationValue += card.aiAgentEvaluation(player, gameState);
      } else {
        let evaluationEstimation = 0.5;
        if (card.structuredAgentEffects) {
          evaluationEstimation = 0.33;
        }
        evaluationValue += 1 + evaluationEstimation * (card.persuasionCosts ?? 0);
      }
    }

    if (card.structuredRevealEffects) {
      evaluationValue += this.effectEvaluationService.getStructuredEffectsEvaluation(
        card.structuredRevealEffects,
        player,
        gameState,
        'reveal',
      );
    }
    if (hasCustomRevealEffect(card)) {
      if (card.aiRevealEvaluation) {
        evaluationValue += card.aiRevealEvaluation(player, gameState);
      } else {
        let evaluationEstimation = 0.5;
        if (card.structuredRevealEffects) {
          evaluationEstimation = 0.33;
        }
        evaluationValue += 1 + evaluationEstimation * (card.persuasionCosts ?? 0);
      }
    }

    return evaluationValue;
  }

  private getImperiumCardTrashEvaluation(card: ImperiumDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;
    if (card.faction) {
      evaluationValue -=
        0.75 * gameState.playerCardsConnectionEffects[card.faction] +
        0.25 * gameState.playerCardsFactions[card.faction] +
        0.25 * gameState.playerTechTilesFactions[card.faction];
    }
    if (card.persuasionCosts) {
      evaluationValue -= card.persuasionCosts * 0.1;
    }
    if (card.fieldAccess) {
      for (const access of card.fieldAccess) {
        evaluationValue -= gameState.playerCardsFieldAccessCounts[access] < 3 ? 3.0 : 0.75;
      }
    }
    if (card.canInfiltrate) {
      evaluationValue -= 0.5 * (card.fieldAccess?.length ?? 0);
    }

    if (card.structuredAgentEffects) {
      evaluationValue -= this.effectEvaluationService.getStructuredEffectsEvaluation(
        card.structuredAgentEffects,
        player,
        gameState,
      );
    }
    if (hasCustomAgentEffect(card)) {
      if (card.aiAgentEvaluation) {
        evaluationValue += card.aiAgentEvaluation(player, gameState);
      } else {
        let evaluationEstimation = 0.5;
        if (card.structuredAgentEffects) {
          evaluationEstimation = 0.33;
        }
        evaluationValue += 1 + evaluationEstimation * (card.persuasionCosts ?? 0);
      }
    }

    if (card.structuredRevealEffects) {
      evaluationValue -= this.effectEvaluationService.getStructuredEffectsEvaluation(
        card.structuredRevealEffects,
        player,
        gameState,
        'reveal',
      );
    }
    if (hasCustomRevealEffect(card)) {
      if (card.aiRevealEvaluation) {
        evaluationValue += card.aiRevealEvaluation(player, gameState);
      } else {
        let evaluationEstimation = 0.5;
        if (card.structuredRevealEffects) {
          evaluationEstimation = 0.33;
        }
        evaluationValue += 1 + evaluationEstimation * (card.persuasionCosts ?? 0);
      }
    }

    return evaluationValue;
  }

  private getIntrigueCardTrashEvaluation(card: IntrigueDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;

    evaluationValue -= this.effectEvaluationService.getStructuredEffectsEvaluation(
      card.structuredPlotEffects,
      player,
      gameState,
    );

    evaluationValue -= this.effectEvaluationService.getStructuredEffectsEvaluation(
      card.structuredCombatEffects,
      player,
      gameState,
    );

    return evaluationValue;
  }
}
