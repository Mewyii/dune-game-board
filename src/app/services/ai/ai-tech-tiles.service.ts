import { Injectable } from '@angular/core';
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
    return this.effectEvaluationService.ai?.techTileBuyEvaluation
      ? this.effectEvaluationService.ai?.techTileBuyEvaluation(
          techTile,
          player,
          gameState,
          this.effectEvaluationService.getRewardEffectGameInterface(),
        )
      : 0;
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
