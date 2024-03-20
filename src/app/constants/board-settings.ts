import { ActionField, DuneLocation, Faction, LanguageType, Reward } from '../models';
import { gameContentCustomAdvanced } from './game-content';

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
