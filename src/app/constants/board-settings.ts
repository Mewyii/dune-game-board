import { LanguageType } from '../models';

export interface Settings {
  mode: 'board' | 'game';
  language: LanguageType;
  content: 'original' | 'custom-beginner' | 'custom-advanced' | 'custom-expert';
}

export const boardSettings: Settings = {
  mode: 'game',
  language: 'de',
  content: 'custom-advanced',
};
