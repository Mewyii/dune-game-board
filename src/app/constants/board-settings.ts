import { ActionField, DuneLocation, Effect, EffectReward, Faction, LanguageType } from '../models';
import { FieldsForGoals } from '../models/ai';
import { Conflict } from '../models/conflict';
import { CustomCard } from '../models/imperium-card';
import { gameContentCustomExpert } from './game-content';

export interface VictoryPointReward {
  score: number;
  reward: Effect;
}

export interface AI {
  name: string;
  aiGoals: FieldsForGoals;
}

export type CardAcquiringPlacementType = 'hand' | 'below-deck' | 'above-deck' | 'discard-pile';

export interface CardAcquiringRules {
  imperiumRow: CardAcquiringPlacementType;
  limited: CardAcquiringPlacementType;
  unlimited: CardAcquiringPlacementType;
  foldspace: CardAcquiringPlacementType;
}

export interface GameContent {
  name: string;
  factions: Faction[];
  locations: DuneLocation[];
  conflicts: Conflict[];
  conflictsMode: 'random' | 'pick';
  ix?: ActionField;
  useTechTiles: boolean;
  useDreadnoughts: boolean;
  victoryPointBoni?: VictoryPointReward[];
  maxVictoryPoints?: number;
  finaleTrigger: number;
  troopCombatStrength: number;
  dreadnoughtCombatStrength: number;
  maxPlayerDreadnoughtCount: number;
  maxPlayerIntrigueCount?: number;
  highCouncilPersuasion: number;
  startingResources: EffectReward[];
  customCards?: CustomCard[];
  recruitmentCardAmount: number;
  locationTakeoverTroopCosts?: number;
  combatMaxDeployableUnits: number;
  factionInfluenceMaxScore: number;
  factionInfluenceAllianceTreshold: number;
  imperiumRowCards: number;
  aiName: string;
  maxPlayers: number;
  cardAcquiringRules: CardAcquiringRules;
  churnRowCards: boolean;
  leaderCombatStrength?: number;
  conflictCardsPerLevel: number[];
}

export type AppMode = 'board' | 'game';

export interface Settings {
  mode: AppMode;
  language: LanguageType;
  gameContent: GameContent;
  eventsEnabled: boolean;
  autoplayMusic: boolean;
}

export const boardSettings: Settings = {
  mode: 'game',
  language: 'en',
  gameContent: gameContentCustomExpert,
  eventsEnabled: true,
  autoplayMusic: true,
};
