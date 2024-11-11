import { Leader } from 'src/app/constants/leaders';
import { PlayerCombatUnits } from '../../combat-manager.service';
import { AgentOnField, PlayerAgents, SpiceAccumulation } from '../../game-manager.service';
import { Player } from '../../players.service';
import { PlayerFactionScoreType, PlayerScore } from '../../player-score-manager.service';
import { ActionField, ActiveFactionType, Resource } from 'src/app/models';
import { LeaderImageOnly } from 'src/app/constants/leaders-old';
import { Conflict } from 'src/app/constants/conflicts';
import { DuneEvent } from 'src/app/constants/events';
import { ImperiumDeckCard } from '../../cards.service';
import { TechTileCard } from '../../tech-tiles.service';
import { IntrigueDeckCard } from '../../intrigues.service';

export type AIGoals =
  | 'high-council'
  | 'swordmaster'
  | 'mentat'
  | 'dreadnought'
  | 'tech'
  | 'enter-combat'
  | 'troops'
  | 'fremen-friendship'
  | 'fremen-alliance'
  | 'bg-alliance'
  | 'guild-alliance'
  | 'emperor-alliance'
  | 'draw-cards'
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
  | 'get-board-persuasion';

export interface GameState {
  playerScore: PlayerScore;
  enemyScore: PlayerScore[];
  playerCombatUnits: PlayerCombatUnits;
  currentRound: number;
  accumulatedSpiceOnFields: SpiceAccumulation[];
  enemyCombatUnits: PlayerCombatUnits[];
  agentsOnFields: AgentOnField[];
  playerAgentsOnFields: AgentOnField[];
  playerAgentCount: number;
  enemyAgentCount: PlayerAgents[];
  isOpeningTurn: boolean;
  isFinale: boolean;
  enemyPlayers: Player[];
  playerLeader: Leader | LeaderImageOnly;
  conflict: Conflict;
  availableTechTiles: TechTileCard[];
  currentEvent: DuneEvent | undefined;
  playerDeckSizeTotal: number;
  playerDeckCards: ImperiumDeckCard[];
  playerHandCards: ImperiumDeckCard[];
  playerDiscardPileCards?: ImperiumDeckCard[];
  playerTrashPileCards?: ImperiumDeckCard[];
  playerCardsBought: number;
  playerCardsTrashed: number;
  playerDreadnoughtCount: number;
  imperiumRowCards: ImperiumDeckCard[];
  playerFactionFriendships: PlayerFactionScoreType[];
  playerFieldUnlocksForFactions?: ActiveFactionType[];
  playerFieldUnlocksForIds?: string[];
  playerIntrigues: IntrigueDeckCard[];
  playerCombatIntrigues: IntrigueDeckCard[];
  playerIntrigueCount: number;
  playerCombatIntrigueCount: number;
  playerCanStealIntrigues: boolean;
  freeLocations: string[];
  occupiedLocations: string[];
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
  desiredFields?: (boardFields: ActionField[]) => {
    [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals, virtualResources: Resource[]) => number;
  };
  viableFields: (boardFields: ActionField[]) => {
    [key: string]: (player: Player, gameState: GameState, goals: FieldsForGoals, virtualResources: Resource[]) => number;
  };
}

export type DesireModifierDecisions = { name: string; modifier: number };

export type FieldsForGoals = {
  [key in AIGoals]?: AIGoal;
};
