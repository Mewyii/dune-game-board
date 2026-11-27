import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GAME_STATE_STORAGE } from './game-state-storage';

/**
 * - `game`: changes during play and is synchronized between all players of a session.
 * - `host-setup`: defined by the host before the game starts (game content, configured cards) and fixed afterwards.
 * - `local`: stays on the device of each player.
 */
export type PersistenceScope = 'game' | 'host-setup' | 'local';

/** `TStored` is the JSON compatible form of `T`. Converters are only needed if `T` can't be stored as is (e.g. a Map). */
export interface PersistenceBindingOptions<T, TStored = T> {
  scope: PersistenceScope;
  toStorable?: (value: T) => TStored;
  fromStorable?: (storedValue: TStored) => T;
}

export type GameStateSnapshot = Record<string, unknown>;

export interface PersistedValueChange {
  key: string;
  scope: PersistenceScope;
}

interface PersistenceBinding {
  key: string;
  scope: PersistenceScope;
  readStorableValue: () => unknown;
  applyStoredValue: (storedValue: unknown) => void;
  subscribeToChanges: (onChange: () => void) => void;
}

@Injectable({
  providedIn: 'root',
})
export class GameStatePersistenceService {
  private readonly storage = inject(GAME_STATE_STORAGE);
  private readonly bindings = new Map<string, PersistenceBinding>();
  private isApplyingSnapshot = false;

  private localChangesSubject = new Subject<PersistedValueChange>();
  /** Emits whenever a persisted value is changed by the local game logic (not by applying a snapshot). */
  localChanges$ = this.localChangesSubject.asObservable();

  /**
   * Restores the stored value into the subject (if there is one) and persists every following change.
   * Returns whether a stored value was restored.
   */
  bindSubjectToStorage<T, TStored = T>(
    key: string,
    subject: BehaviorSubject<T>,
    options: PersistenceBindingOptions<T, TStored>,
  ) {
    if (this.bindings.has(key)) {
      throw new Error(`Persistence key "${key}" is already bound.`);
    }

    const toStorable = options.toStorable ?? ((value: T) => value as unknown as TStored);
    const fromStorable = options.fromStorable ?? ((storedValue: TStored) => storedValue as unknown as T);

    const binding: PersistenceBinding = {
      key,
      scope: options.scope,
      readStorableValue: () => toStorable(subject.value),
      // Stored values come from JSON (local storage or a session snapshot) and are trusted to match TStored.
      applyStoredValue: (storedValue) => subject.next(fromStorable(storedValue as TStored)),
      subscribeToChanges: (onChange) => subject.subscribe(onChange),
    };
    this.bindings.set(key, binding);

    const hasRestoredValue = this.restoreStoredValue(binding);
    this.persistFutureChanges(binding);

    return hasRestoredValue;
  }

  exportSnapshot(scope: PersistenceScope): GameStateSnapshot {
    const snapshot: GameStateSnapshot = {};
    for (const binding of this.bindings.values()) {
      if (binding.scope === scope) {
        snapshot[binding.key] = binding.readStorableValue();
      }
    }
    return snapshot;
  }

  /** Pushes the values of a snapshot (e.g. received from a game session) into the bound subjects. */
  applySnapshot(snapshot: GameStateSnapshot) {
    this.isApplyingSnapshot = true;
    try {
      for (const [key, storedValue] of Object.entries(snapshot)) {
        this.bindings.get(key)?.applyStoredValue(storedValue);
      }
    } finally {
      this.isApplyingSnapshot = false;
    }
  }

  private restoreStoredValue(binding: PersistenceBinding) {
    const serializedValue = this.storage.readItem(binding.key);
    if (serializedValue === null) {
      return false;
    }

    const storedValue: unknown = JSON.parse(serializedValue);
    binding.applyStoredValue(storedValue);
    return true;
  }

  private persistFutureChanges(binding: PersistenceBinding) {
    let isInitialEmission = true;

    binding.subscribeToChanges(() => {
      this.writeToStorage(binding);

      if (!isInitialEmission && !this.isApplyingSnapshot) {
        this.localChangesSubject.next({ key: binding.key, scope: binding.scope });
      }
    });

    isInitialEmission = false;
  }

  private writeToStorage(binding: PersistenceBinding) {
    const storableValue = binding.readStorableValue();
    if (storableValue === undefined) {
      this.storage.removeItem(binding.key);
      return;
    }

    this.storage.writeItem(binding.key, JSON.stringify(storableValue));
  }
}
