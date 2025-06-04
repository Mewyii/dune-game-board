import { GameContent } from 'src/app/constants/board-settings';
import { DuneEvent } from 'src/app/constants/events';
import { ActionField, ActionType, ActiveFactionType, EffectRewardType, StructuredEffects } from 'src/app/models';
import { Conflict } from 'src/app/models/conflict';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { Player } from 'src/app/models/player';
import { TurnInfo } from 'src/app/models/turn-info';
import { ImperiumDeckCard, ImperiumRowCard, ImperiumRowPlot } from '../../cards.service';
import { PlayerCombatUnits } from '../../combat-manager.service';
import { AgentOnField, PlayerAgents, SpiceAccumulation } from '../../game-manager.service';
import { PlayerGameModifiers } from '../../game-modifier.service';
import { LeaderDeckCard } from '../../leaders.service';
import { PlayerFactionScoreType, PlayerScore } from '../../player-score-manager.service';
import { TechTileDeckCard } from '../../tech-tiles.service';

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

export type PlayerGameElementRewards = { [key in EffectRewardType]: number };
export type PlayerGameElementFactions = { [key in ActiveFactionType]: number };
export type PlayerGameElementFieldAccess = { [key in ActionType]: number };

export type GameState = Readonly<{
  playersCount: number;
  playerScore: PlayerScore;
  enemyScore: PlayerScore[];
  playerCombatUnits: PlayerCombatUnits;
  currentRound: number;
  accumulatedSpiceOnFields: SpiceAccumulation[];
  enemyCombatUnits: PlayerCombatUnits[];
  agentsOnFields: AgentOnField[];
  playerAgentsOnFields: AgentOnField[];
  enemyAgentsOnFields: AgentOnField[];
  playerAgentsAvailable: number;
  enemyAgentsAvailable: PlayerAgents[];
  isOpeningTurn: boolean;
  isFinale: boolean;
  enemyPlayers: Player[];
  playerLeader: LeaderDeckCard;
  playerLeaderSignetRingEffects: StructuredEffects | undefined;
  conflict: Conflict;
  availableTechTiles: TechTileDeckCard[];
  currentEvent: DuneEvent | undefined;
  playerDeckSizeTotal: number;
  playerDeckCards: ImperiumDeckCard[];
  playerHandCards: ImperiumDeckCard[];
  playerDiscardPileCards?: ImperiumDeckCard[];
  playerTrashPileCards?: ImperiumDeckCard[];
  playerCardsBought: number;
  playerCardsTrashed: number;
  playerDreadnoughtCount: number;
  imperiumRowCards: (ImperiumRowCard | ImperiumRowPlot)[];
  playerFactionFriendships: PlayerFactionScoreType[];
  playerFieldUnlocksForFactions: ActiveFactionType[];
  playerFieldUnlocksForIds: string[];
  playerEnemyFieldTypeAcessTroughCards: ActionType[];
  playerEnemyFieldTypeAcessTroughGameModifiers: ActionType[];
  blockedFieldsForIds: string[];
  blockedFieldsForActionTypes: ActionType[];
  playerIntrigues: IntrigueDeckCard[];
  playerIntriguesRewards: PlayerGameElementRewards;
  playerIntriguesConversionCosts: PlayerGameElementRewards;
  playerCombatIntrigues: IntrigueDeckCard[];
  playerIntrigueCount: number;
  playerCombatIntrigueCount: number;
  playerIntrigueStealAmount: number;
  enemyIntrigueCounts: { playerId: number; intrigueCount: number }[];
  freeLocations: string[];
  playerLocations: string[];
  enemyLocations: string[];
  rival?: Player;
  playerTurnInfos?: TurnInfo;
  playerCardsFactions: PlayerGameElementFactions;
  playerCardsRewards: PlayerGameElementRewards;
  playerCardsFactionsInPlay: PlayerGameElementFactions;
  playerTechTilesFactions: PlayerGameElementFactions;
  playerTechTilesRewards: PlayerGameElementRewards;
  playerTechTilesConversionCosts: PlayerGameElementRewards;
  playerCardsFieldAccess: ActionType[];
  playerCardsFieldAccessCounts: PlayerGameElementFieldAccess;
  playerGameModifiers?: PlayerGameModifiers;
  gameSettings: Pick<GameContent, 'combatMaxDeployableUnits' | 'troopCombatStrength' | 'dreadnoughtCombatStrength'>;
}>;

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
