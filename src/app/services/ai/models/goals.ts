import { PlayerCombatUnits } from '../../combat-manager.service';
import { AgentOnField, PlayerAgents, SpiceAccumulation } from '../../game-manager.service';
import { Player } from '../../player-manager.service';
import { PlayerScore } from '../../player-score-manager.service';

export type AIGoals =
  | 'high-council'
  | 'swordmaster'
  | 'mentat'
  | 'warship'
  | 'tech'
  | 'enter-combat'
  | 'get-troops'
  | 'fremen-alliance'
  | 'bg-alliance'
  | 'guild-alliance'
  | 'emperor-alliance'
  | 'draw-cards'
  | 'trim-deck'
  | 'intrigues'
  | 'fold-space'
  | 'collect-water'
  | 'collect-spice'
  | 'collect-currency'
  | 'harvest-accumulated-spice-basin'
  | 'harvest-accumulated-spice-flat'
  | 'swordmaster-helper'
  | 'get-persuasion';

export interface GameState {
  playerScore: PlayerScore;
  enemyScore: PlayerScore[];
  playerCombatUnits: PlayerCombatUnits;
  currentTurn: number;
  accumulatedSpiceOnFields: SpiceAccumulation[];
  enemyCombatUnits: PlayerCombatUnits[];
  agentsOnFields: AgentOnField[];
  playerAgentCount: number;
  enemyAgentCount: PlayerAgents[];
  isOpeningTurn: boolean;
  isFinale: boolean;
}

export interface AIGoal {
  baseDesire: number;
  desireModifier: (player: Player, gameState: GameState, goals: FieldsForGoals) => number | DesireModifierDecisions;
  maxDesire?: number;
  goalIsReachable: (player: Player, gameState: GameState, goals: FieldsForGoals) => boolean;
  reachedGoal: (player: Player, gameState: GameState, goals: FieldsForGoals) => boolean;
  desiredFields?: {
    [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number;
  };
  viableFields: {
    [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals) => number;
  };
}

export type DesireModifierDecisions = { name: string; modifier: number };

export type FieldsForGoals = {
  [key in AIGoals]: AIGoal;
};
