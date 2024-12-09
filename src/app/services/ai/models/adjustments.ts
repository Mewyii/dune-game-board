import { ActionField, Resource } from 'src/app/models';
import { AIGoals, GameState } from './goals';
import { Player } from 'src/app/models/player';

export interface GoalModifier {
  type: AIGoals;
  modifier: number;
}

export interface AIAdjustments {
  fieldAccessModifier?: Resource[];
  fieldEvaluationModifier?: (player: Player, gameState: GameState, field: ActionField) => number;
  goalEvaluationModifier?: (player: Player, gameState: GameState) => GoalModifier[];
}
