import { LanguageType } from '../models';

export interface Settings {
  mode: 'board' | 'game';
  language: LanguageType;
  factions: 'original' | 'custom-beginner' | 'custom-advanced' | 'custom-expert';
  locations: 'original' | 'custom';
  ix: 'no' | 'original' | 'custom-beginner' | 'custom-advanced';
  techTiles: 'no' | 'yes';
}

export const boardSettings: Settings = {
  mode: 'game',
  language: 'de',
  factions: 'custom-advanced',
  locations: 'custom',
  ix: 'custom-advanced',
  techTiles: 'yes',
};
