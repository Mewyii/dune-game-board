import { GameStateSnapshot } from './game-state-persistence.service';

/** JSON drops `undefined` values, so they are written as `null` to keep the information that a value was removed. */
export function convertUndefinedValuesToNull(snapshot: GameStateSnapshot) {
  const convertedSnapshot: GameStateSnapshot = {};
  for (const [key, value] of Object.entries(snapshot)) {
    convertedSnapshot[key] = value === undefined ? null : value;
  }
  return convertedSnapshot;
}

export function convertNullValuesToUndefined(snapshot: GameStateSnapshot) {
  const convertedSnapshot: GameStateSnapshot = {};
  for (const [key, value] of Object.entries(snapshot)) {
    convertedSnapshot[key] = value === null ? undefined : value;
  }
  return convertedSnapshot;
}

/** Returns the value as it looks after being sent through JSON, e.g. without properties that are `undefined`. */
export function toJsonCompatibleValue(value: unknown): unknown {
  if (value === undefined) {
    return undefined;
  }
  return JSON.parse(JSON.stringify(value));
}
