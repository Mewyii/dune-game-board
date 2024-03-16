import { ActionField, DuneLocation, Faction, LanguageType } from '../models';
import { gameContentCustomAdvanced, gameContentCustomBeginner, gameContentOriginal } from './game-content';

export interface GameContent {
  factions: Faction[];
  locations: DuneLocation[];
  ix?: ActionField;
  useTechTiles: boolean;
  useVictoryPointBoni?: boolean;
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
