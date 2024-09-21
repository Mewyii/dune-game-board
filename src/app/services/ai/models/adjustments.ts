import { ActionField, Resource } from 'src/app/models';
import { Player } from '../../player-manager.service';
import { AIGoals, GameState } from './goals';

export interface GoalModifier {
  type: AIGoals;
  modifier: number;
}

export interface AIAdjustments {
  fieldAccessModifier?: Resource[];
  fieldEvaluationModifier?: (player: Player, gameState: GameState, field: ActionField) => number;
  goalEvaluationModifier?: (player: Player, gameState: GameState) => GoalModifier[];
}
