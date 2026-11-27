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
  convertFromStorable: (storedValue: unknown) => unknown;
  emitValue: (value: unknown) => void;
  subscribeToChanges: (onChange: (value: unknown) => void) => void;
}

@Injectable({
  providedIn: 'root',
})
export class GameStatePersistenceService {
  private readonly storage = inject(GAME_STATE_STORAGE);
  private readonly bindings = new Map<string, PersistenceBinding>();
  private readonly valuesBeingApplied = new Map<string, unknown>();

  private localChangesSubject = new Subject<PersistedValueChange>();
  /**
   * Emits whenever a persisted value is changed by the local game logic.
   * Applying a snapshot is not reported, but changes the game logic makes in reaction to it are.
   */
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
      convertFromStorable: (storedValue) => fromStorable(storedValue as TStored),
      emitValue: (value) => subject.next(value as T),
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

  /** Returns the storable values of the given keys. Unknown keys are skipped. */
  exportValues(keys: Iterable<string>): GameStateSnapshot {
    const values: GameStateSnapshot = {};
    for (const key of keys) {
      const binding = this.bindings.get(key);
      if (binding) {
        values[key] = binding.readStorableValue();
      }
    }
    return values;
  }

  /**
   * Pushes the values of a snapshot (e.g. received from a game session) into the bound subjects.
   * Values of keys that aren't bound yet are written to the storage, so the service restores them once it is created.
   */
  applySnapshot(snapshot: GameStateSnapshot) {
    for (const [key, storedValue] of Object.entries(snapshot)) {
      const binding = this.bindings.get(key);
      if (!binding) {
        this.writeStorableValueToStorage(key, storedValue);
        continue;
      }

      const value = binding.convertFromStorable(storedValue);
      this.valuesBeingApplied.set(key, value);
      try {
        binding.emitValue(value);
      } finally {
        this.valuesBeingApplied.delete(key);
      }
    }
  }

  private restoreStoredValue(binding: PersistenceBinding) {
    const serializedValue = this.storage.readItem(binding.key);
    if (serializedValue === null) {
      return false;
    }

    const storedValue: unknown = JSON.parse(serializedValue);
    binding.emitValue(binding.convertFromStorable(storedValue));
    return true;
  }

  private persistFutureChanges(binding: PersistenceBinding) {
    let isInitialEmission = true;

    binding.subscribeToChanges((value) => {
      this.writeToStorage(binding);

      if (!isInitialEmission && !this.isValueBeingApplied(binding.key, value)) {
        this.localChangesSubject.next({ key: binding.key, scope: binding.scope });
      }
    });

    isInitialEmission = false;
  }

  /** Compares by reference, so a new value set by the game logic while a snapshot is applied still counts as a local change. */
  private isValueBeingApplied(key: string, value: unknown) {
    return this.valuesBeingApplied.has(key) && this.valuesBeingApplied.get(key) === value;
  }

  private writeToStorage(binding: PersistenceBinding) {
    this.writeStorableValueToStorage(binding.key, binding.readStorableValue());
  }

  private writeStorableValueToStorage(key: string, storableValue: unknown) {
    if (storableValue === undefined) {
      this.storage.removeItem(key);
      return;
    }

    this.storage.writeItem(key, JSON.stringify(storableValue));
  }
}
