import { ActionField } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { GameState } from './game-state';

export type AIGoals =
  | 'high-council'
  | 'swordmaster'
  | 'mentat'
  | 'dreadnought'
  | 'tech'
  | 'location-control'
  | 'enter-combat'
  | 'troops'
  | 'fremen-friendship'
  | 'fremen-alliance'
  | 'bg-alliance'
  | 'guild-alliance'
  | 'emperor-alliance'
  | 'draw-cards'
  | 'discard-cards'
  | 'trim-cards'
  | 'intrigues'
  | 'intrigue-steal'
  | 'fold-space'
  | 'collect-water'
  | 'collect-spice'
  | 'collect-solari'
  | 'harvest-accumulated-spice-basin'
  | 'harvest-accumulated-spice-flat'
  | 'swordmaster-helper'
  | 'get-board-persuasion'
  | 'get-victory-points';

export interface AIGoal {
  baseDesire: number;
  desireModifier: (player: Player, gameState: GameState, goals: FieldsForGoals) => number;
  maxDesire?: number;
  goalIsReachable: (player: Player, gameState: GameState, goals: FieldsForGoals) => boolean;
  reachedGoal: (player: Player, gameState: GameState, goals: FieldsForGoals) => boolean;
  desiredFields?: (boardFields: ActionField[]) => {
    [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number;
  };
  viableFields: (boardFields: ActionField[]) => {
    [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number;
  };
}

export type FieldsForGoals = {
  [key in AIGoals]?: AIGoal;
};
