import { InjectionToken } from '@angular/core';

export interface GameStateStorage {
  readItem(key: string): string | null;
  writeItem(key: string, serializedValue: string): void;
  removeItem(key: string): void;
}

export const GAME_STATE_STORAGE = new InjectionToken<GameStateStorage>('GAME_STATE_STORAGE', {
  providedIn: 'root',
  factory: () => createBrowserLocalStorage(),
});

function createBrowserLocalStorage(): GameStateStorage {
  return {
    readItem: (key) => localStorage.getItem(key),
    writeItem: (key, serializedValue) => localStorage.setItem(key, serializedValue),
    removeItem: (key) => localStorage.removeItem(key),
  };
}
