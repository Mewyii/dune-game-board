import { Leader } from 'src/app/constants/leaders';
import { PlayerCombatUnits } from '../../combat-manager.service';
import { AgentOnField, PlayerAgents, SpiceAccumulation } from '../../game-manager.service';
import { PlayerFactionScoreType, PlayerScore } from '../../player-score-manager.service';
import { ActionField, ActionType, ActiveFactionType, RewardType } from 'src/app/models';
import { DuneEvent } from 'src/app/constants/events';
import { ImperiumDeckCard } from '../../cards.service';
import { TurnInfo } from 'src/app/models/turn-info';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { Player } from 'src/app/models/player';
import { TechTileCard } from 'src/app/models/tech-tile';
import { Conflict } from 'src/app/models/conflict';
import { PlayerGameModifiers } from '../../game-modifier.service';

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
  | 'get-board-persuasion'
  | 'get-victory-points';

export type PlayerCardsRewards = { [key in RewardType]: number };
export type PlayerCardsFactions = { [key in ActiveFactionType]: number };
export type PlayerCardsFieldAccess = { [key in ActionType]: number };

export type GameState = Readonly<{
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
  playerLeader: Leader;
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
  playerFieldUnlocksForFactions: ActiveFactionType[];
  playerFieldUnlocksForIds: string[];
  playerFieldEnemyAccessForActionTypes: ActionType[];
  blockedFieldsForIds: string[];
  blockedFieldsForActionTypes: ActionType[];
  playerIntrigues: IntrigueDeckCard[];
  playerCombatIntrigues: IntrigueDeckCard[];
  playerIntrigueCount: number;
  playerCombatIntrigueCount: number;
  playerIntrigueStealAmount: number;
  freeLocations: string[];
  occupiedLocations: string[];
  rival?: Player;
  playerTurnInfos?: TurnInfo;
  playerCardsFactions: PlayerCardsFactions;
  playerCardsRewards: PlayerCardsRewards;
  playerTechTilesFactions: PlayerCardsFactions;
  playerCardsFieldAccess: PlayerCardsFieldAccess;
  playerGameModifiers?: PlayerGameModifiers;
}>;

export interface AIGoal {
  baseDesire: number;
  desireModifier: (player: Player, gameState: GameState, goals: FieldsForGoals) => number | DesireModifierDecisions;
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

export type DesireModifierDecisions = { name: string; modifier: number };

export type FieldsForGoals = {
  [key in AIGoals]?: AIGoal;
};
