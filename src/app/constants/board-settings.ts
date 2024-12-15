import { ActionField, DuneLocation, Faction, LanguageType, Reward } from '../models';
import { CustomCard } from '../models/imperium-card';
import { FieldsForGoals } from '../services/ai/models';
import { gameContentCustomExpert } from './game-content';

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
  finaleTrigger: number;
  troopCombatStrength: number;
  dreadnoughtCombatStrength: number;
  highCouncilPersuasion: number;
  startingResources: Reward[];
  aiGoals?: FieldsForGoals;
  customCards?: CustomCard[];
  recruitmentCardAmount: number;
}

export type AppMode = 'board' | 'game';

export interface Settings {
  mode: AppMode;
  language: LanguageType;
  gameContent: GameContent;
  eventsEnabled: boolean;
}

export const boardSettings: Settings = {
  mode: 'game',
  language: 'en',
  gameContent: gameContentCustomExpert,
  eventsEnabled: true,
};
