import { GameContent } from 'src/app/constants/board-settings';
import { DuneEvent } from 'src/app/constants/events';
import { ActionField, ActionType, ActiveFactionType, EffectRewardType, StructuredEffect } from 'src/app/models';
import { Conflict } from 'src/app/models/conflict';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { Player } from 'src/app/models/player';
import { TurnInfo } from 'src/app/models/turn-info';
import { ImperiumDeckCard, ImperiumRowCard, ImperiumRowPlot } from 'src/app/services/cards.service';
import { PlayerCombatUnits } from 'src/app/services/combat-manager.service';
import { RoundPhaseType, SpiceAccumulation } from 'src/app/services/game-manager.service';
import { PlayerGameModifiers } from 'src/app/services/game-modifier.service';
import { LeaderDeckCard } from 'src/app/services/leaders.service';
import { PlayerAgent, PlayerAgentOnField } from 'src/app/services/player-agents.service';
import { PlayerFactionScoreType, PlayerScore } from 'src/app/services/player-score-manager.service';
import { TechTileDeckCard } from 'src/app/services/tech-tiles.service';

export type PlayerGameElementRewards = { [key in EffectRewardType]: number };
export type PlayerGameElementFactions = { [key in ActiveFactionType]: number };
export type PlayerGameElementFieldAccess = { [key in ActionType]: number };

export type GameState = Readonly<{
  playersCount: number;
  playerScore: PlayerScore;
  enemyScore: PlayerScore[];
  playerCombatUnits: PlayerCombatUnits;
  currentRound: number;
  currentRoundPhase: RoundPhaseType;
  accumulatedSpiceOnFields: SpiceAccumulation[];
  enemyCombatUnits: PlayerCombatUnits[];
  agentsOnFields: PlayerAgentOnField[];
  playerAgentsOnFields: PlayerAgentOnField[];
  enemyAgentsOnFields: PlayerAgentOnField[];
  playerAgentsAvailable: number;
  enemyAgentsAvailable: PlayerAgent[];
  isOpeningTurn: boolean;
  isFinale: boolean;
  enemyPlayers: Player[];
  playerLeader: LeaderDeckCard;
  playerLeaderSignetRingEffects: StructuredEffect[] | undefined;
  playerLeaderSignetTokenValue?: number;
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
  playerCardsFieldAccess: ActionType[];
  playerCardsFieldAccessCounts: PlayerGameElementFieldAccess;
  playerCardsConnectionEffects: PlayerGameElementFactions;
  playerHandCardsFactions: PlayerGameElementFactions;
  playerHandCardsRewards: PlayerGameElementRewards;
  playerHandCardsFieldAccess: ActionType[];
  playerHandCardsFieldAccessCounts: PlayerGameElementFieldAccess;
  playerHandCardsConnectionAgentEffects: PlayerGameElementFactions;
  playerHandCardsConnectionRevealEffects: PlayerGameElementFactions;
  playerCardsFactionsInPlay: PlayerGameElementFactions;
  playerTechTiles: TechTileDeckCard[];
  playerTechTilesFactions: PlayerGameElementFactions;
  playerTechTilesRewards: PlayerGameElementRewards;
  playerTechTilesConversionCosts: PlayerGameElementRewards;
  playerGameModifiers?: PlayerGameModifiers;
  gameSettings: Pick<
    GameContent,
    | 'combatMaxDeployableUnits'
    | 'troopCombatStrength'
    | 'dreadnoughtCombatStrength'
    | 'factionInfluenceMaxScore'
    | 'factionInfluenceAllianceTreshold'
  >;
  boardSpaces: ActionField[];
  playerAgentPlacedOnFieldThisTurn?: string;
}>;
