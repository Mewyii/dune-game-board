import { Leader } from 'src/app/constants/leaders';
import { PlayerCombatUnits } from '../../combat-manager.service';
import { AgentOnField, PlayerAgents, SpiceAccumulation } from '../../game-manager.service';
import { Player } from '../../player-manager.service';
import { PlayerScore } from '../../player-score-manager.service';
import { Resource } from 'src/app/models';
import { LeaderImageOnly } from 'src/app/constants/leaders-old';
import { Conflict } from 'src/app/constants/conflicts';
import { TechTile } from 'src/app/constants/tech-tiles';

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
  | 'intrigue-steal'
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
  enemyPlayers: Player[];
  playerLeader: Leader | LeaderImageOnly;
  conflict: Conflict;
  availableTechTiles: TechTile[];
}

export interface AIGoal {
  baseDesire: number;
  desireModifier: (
    player: Player,
    gameState: GameState,
    goals: FieldsForGoals,
    virtualResources: Resource[]
  ) => number | DesireModifierDecisions;
  maxDesire?: number;
  goalIsReachable: (player: Player, gameState: GameState, goals: FieldsForGoals, virtualResources: Resource[]) => boolean;
  reachedGoal: (player: Player, gameState: GameState, goals: FieldsForGoals, virtualResources: Resource[]) => boolean;
  desiredFields?: {
    [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals, virtualResources: Resource[]) => number;
  };
  viableFields: {
    [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals, virtualResources: Resource[]) => number;
  };
}

export type DesireModifierDecisions = { name: string; modifier: number };

export type FieldsForGoals = {
  [key in AIGoals]: AIGoal;
};
