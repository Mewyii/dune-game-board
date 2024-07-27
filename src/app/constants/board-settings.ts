import { ActionField, DuneLocation, Faction, LanguageType, Reward } from '../models';
import { FieldsForGoals } from '../services/ai/models';
import { gameContentCustomAdvanced } from './game-content';
import { ImperiumCard } from './imperium-cards';

export interface VictoryPointReward {
  score: number;
  reward: Reward;
}

export interface GameContent {
  name: string;
  factions: Faction[];
  locations: DuneLocation[];
  ix?: ActionField;
  useTechTiles: boolean;
  victoryPointBoni?: VictoryPointReward[];
  maxVictoryPoints?: number;
  finaleTrigger?: number;
  troopCombatStrength: number;
  dreadnoughtCombatStrength: number;
  highCouncilPersuasion: number;
  startingResources: Reward[];
  aiGoals?: FieldsForGoals;
  alwaysBuyableCards?: ImperiumCard[];
  customCards?: ImperiumCard[];
}

export type AppMode = 'board' | 'game';

export interface Settings {
  mode: AppMode;
  language: LanguageType;
  gameContent: GameContent;
}

export const boardSettings: Settings = {
  mode: 'game',
  language: 'de',
  gameContent: gameContentCustomAdvanced,
};
