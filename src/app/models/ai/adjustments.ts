import { ActionField, EffectTimingType, Resource } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { GameElement } from 'src/app/services/game-manager.service';
import { GameServices } from './game-services';
import { GameState } from './game-state';
import { AIGoals } from './goals';

export interface GoalModifier {
  type: AIGoals;
  modifier: number;
}

export interface AIAdjustments {
  fieldAccessModifier?: Resource[];
  fieldEvaluationModifier?: (player: Player, gameState: GameState, field: ActionField) => number;
  goalEvaluationModifier?: (player: Player, gameState: GameState) => GoalModifier[];
}

export type CustomEffectFunction = (player: Player, gameState: GameState, services: GameServices) => void;
export type CustomEffectFunctionWithGameElement = (
  player: Player,
  gameState: GameState,
  services: GameServices,
  gameElement: GameElement,
) => void;

export interface TimedFunction {
  timing: EffectTimingType;
  function: CustomEffectFunction;
}

export interface TimedFunctionWithGameElement {
  timing: EffectTimingType;
  function: CustomEffectFunctionWithGameElement;
}
