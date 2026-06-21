import { ActionField, EffectRewardType, EffectTimingType, Resource } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { GameElement } from 'src/app/services/game-manager.service';
import { CardGameAdjustmentsGameInterface } from './game-commands';
import { GameState } from './game-state';

export interface RewardModifier {
  type: EffectRewardType;
  modifier: number;
}

export interface AIAdjustments {
  fieldAccessModifier?: Resource[];
  fieldEvaluationModifier?: (player: Player, gameState: GameState, field: ActionField) => number;
  rewardEvaluationModifier?: (player: Player, gameState: GameState) => RewardModifier[];
}

export type CustomEffectFunction = (
  player: Player,
  gameState: GameState,
  services: CardGameAdjustmentsGameInterface,
) => void;
export type CustomEffectFunctionWithGameElement = (
  player: Player,
  gameState: GameState,
  services: CardGameAdjustmentsGameInterface,
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
