import { Injectable } from '@angular/core';
import { getRewardArrayAIInfos } from 'src/app/helpers/rewards';
import { GameState } from 'src/app/models/ai';
import { Player } from 'src/app/models/player';
import { PlayerTechTile, TechTileDeckCard } from '../tech-tiles.service';
import { AIEffectEvaluationService } from './ai.effect-evaluation.service';

@Injectable({
  providedIn: 'root',
})
export class AITechTilesService {
  constructor(private effectEvaluationService: AIEffectEvaluationService) {}

  getTechTilePlayEvaluation(techTile: TechTileDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;

    if (techTile.structuredEffects) {
      const value = this.effectEvaluationService.getStructuredEffectsEvaluationForTurnState(
        techTile.structuredEffects,
        player,
        gameState,
      );
      evaluationValue += value;
    }

    return evaluationValue;
  }

  getTechTileBuyEvaluation(techTile: TechTileDeckCard, player: Player, gameState: GameState) {
    const techCostEvaluation =
      this.effectEvaluationService.getRewardEffectEvaluation('tech', player, gameState) * techTile.costs;
    const playerTechAmount = gameState.playerResources.tech;

    let evaluationValue = -techCostEvaluation + playerTechAmount * 0.75;

    if (techTile.buyEffects) {
      const { hasRewardChoice: hasRewardOptions, hasRewardConversion } = getRewardArrayAIInfos(techTile.buyEffects);
      if (!hasRewardOptions && !hasRewardConversion) {
        evaluationValue += this.effectEvaluationService.getRewardArrayEvaluation(techTile.buyEffects, player, gameState);
      }
    }
    if (techTile.structuredEffects) {
      const differentTechTileActivations = techTile.effects?.filter((x) => x.type === 'tech-tile-flip').length ?? 0;
      const value = this.effectEvaluationService.getStructuredEffectsEvaluation(
        techTile.structuredEffects,
        player,
        gameState,
      );
      evaluationValue +=
        (value / (differentTechTileActivations > 0 ? differentTechTileActivations : 1)) *
        ((10 - gameState.currentRound) / 1.66);
    }
    if (techTile.customEffect?.en) {
      if (techTile.aiEvaluation) {
        evaluationValue += techTile.aiEvaluation(player, gameState);
      } else {
        evaluationValue += 0.25 * techTile.costs;
      }
    }

    return evaluationValue;
  }

  getTechTileTrashEvaluation(techTile: TechTileDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;

    if (techTile.structuredEffects) {
      const value = this.effectEvaluationService.getStructuredEffectsEvaluation(
        techTile.structuredEffects,
        player,
        gameState,
      );
      evaluationValue -= value;
    }
    if (techTile.customEffect?.en) {
      if (techTile.aiEvaluation) {
        evaluationValue -= techTile.aiEvaluation(player, gameState);
      } else {
        evaluationValue -= 0.25 * techTile.costs;
      }
    }

    return evaluationValue;
  }

  getTechTileToTrash(playerTechTiles: PlayerTechTile[], player: Player, gameState: GameState) {
    if (playerTechTiles.length > 0) {
      const cardEvaluations = playerTechTiles.map((playerTechTile) => {
        const evaluation = this.getTechTileTrashEvaluation(playerTechTile.techTile, player, gameState);
        return { evaluation, card: playerTechTile };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }
}
