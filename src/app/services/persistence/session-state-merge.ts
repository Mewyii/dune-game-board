import { isEqual, isPlainObject } from 'lodash';

type PlainRecord = Record<string, unknown>;

/**
 * Three-way merge of a persisted value that was changed locally and remotely since the last synchronized (base) value.
 * - Objects are merged property by property.
 * - Arrays whose elements are identifiable (unique `id`, unique `playerId` or Map entries) are merged element by element.
 * - Other arrays that only got new entries on both sides (e.g. logs) keep the new entries of both sides.
 * - If the same value was changed differently on both sides, the local change wins.
 */
export function mergeConcurrentChanges(baseValue: unknown, localValue: unknown, remoteValue: unknown): unknown {
  if (isEqual(localValue, remoteValue) || isEqual(remoteValue, baseValue)) {
    return localValue;
  }
  if (isEqual(localValue, baseValue)) {
    return remoteValue;
  }

  if (isPlainRecord(localValue) && isPlainRecord(remoteValue)) {
    const baseRecord = isPlainRecord(baseValue) ? baseValue : {};
    return mergeRecords(baseRecord, localValue, remoteValue);
  }

  if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
    const baseArray = Array.isArray(baseValue) ? baseValue : [];
    return mergeArrays(baseArray, localValue, remoteValue);
  }

  return localValue;
}

function isPlainRecord(value: unknown): value is PlainRecord {
  return isPlainObject(value);
}

function mergeRecords(baseRecord: PlainRecord, localRecord: PlainRecord, remoteRecord: PlainRecord) {
  const mergedRecord: PlainRecord = {};
  const propertyNames = new Set([...Object.keys(baseRecord), ...Object.keys(localRecord), ...Object.keys(remoteRecord)]);

  for (const propertyName of propertyNames) {
    const mergedValue = mergeConcurrentChanges(
      baseRecord[propertyName],
      localRecord[propertyName],
      remoteRecord[propertyName],
    );
    if (mergedValue !== undefined) {
      mergedRecord[propertyName] = mergedValue;
    }
  }

  return mergedRecord;
}

function mergeArrays(baseArray: unknown[], localArray: unknown[], remoteArray: unknown[]): unknown[] {
  const baseIdentities = getUniqueElementIdentities(baseArray);
  const localIdentities = getUniqueElementIdentities(localArray);
  const remoteIdentities = getUniqueElementIdentities(remoteArray);

  if (baseIdentities && localIdentities && remoteIdentities) {
    return mergeIdentifiedElements(
      { elements: baseArray, identities: baseIdentities },
      { elements: localArray, identities: localIdentities },
      { elements: remoteArray, identities: remoteIdentities },
    );
  }

  if (startsWithElements(localArray, baseArray) && startsWithElements(remoteArray, baseArray)) {
    const locallyAppendedElements = localArray.slice(baseArray.length);
    return [...remoteArray, ...locallyAppendedElements];
  }

  return localArray;
}

interface IdentifiedArray {
  elements: unknown[];
  identities: string[];
}

function mergeIdentifiedElements(base: IdentifiedArray, local: IdentifiedArray, remote: IdentifiedArray) {
  const baseElements = mapElementsByIdentity(base);
  const localElements = mapElementsByIdentity(local);
  const remoteElements = mapElementsByIdentity(remote);

  const mergedElements: unknown[] = [];
  for (const identity of getMergedIdentityOrder(base.identities, local.identities, remote.identities)) {
    const baseElement = baseElements.get(identity);
    const isInBase = baseElements.has(identity);

    if (localElements.has(identity) && remoteElements.has(identity)) {
      mergedElements.push(mergeConcurrentChanges(baseElement, localElements.get(identity), remoteElements.get(identity)));
    } else if (localElements.has(identity)) {
      const localElement = localElements.get(identity);
      if (!isInBase || !isEqual(localElement, baseElement)) {
        mergedElements.push(localElement);
      }
    } else if (remoteElements.has(identity)) {
      const remoteElement = remoteElements.get(identity);
      if (!isInBase || !isEqual(remoteElement, baseElement)) {
        mergedElements.push(remoteElement);
      }
    }
  }

  return mergedElements;
}

function mapElementsByIdentity(array: IdentifiedArray) {
  const elementsByIdentity = new Map<string, unknown>();
  array.identities.forEach((identity, index) => elementsByIdentity.set(identity, array.elements[index]));
  return elementsByIdentity;
}

/**
 * Keeps the order of the side that reordered the elements (e.g. shuffled a deck). New elements of the other side are appended.
 */
function getMergedIdentityOrder(baseIdentities: string[], localIdentities: string[], remoteIdentities: string[]) {
  const hasRemoteChangedOrder = !haveSameRelativeOrder(baseIdentities, remoteIdentities);
  const leadingIdentities = hasRemoteChangedOrder ? remoteIdentities : localIdentities;
  const followingIdentities = hasRemoteChangedOrder ? localIdentities : remoteIdentities;

  const leadingIdentitySet = new Set(leadingIdentities);
  const additionalIdentities = followingIdentities.filter((identity) => !leadingIdentitySet.has(identity));
  return [...leadingIdentities, ...additionalIdentities];
}

function haveSameRelativeOrder(firstIdentities: string[], secondIdentities: string[]) {
  const firstIdentitySet = new Set(firstIdentities);
  const secondIdentitySet = new Set(secondIdentities);
  const sharedIdentitiesInFirstOrder = firstIdentities.filter((identity) => secondIdentitySet.has(identity));
  const sharedIdentitiesInSecondOrder = secondIdentities.filter((identity) => firstIdentitySet.has(identity));
  return isEqual(sharedIdentitiesInFirstOrder, sharedIdentitiesInSecondOrder);
}

function getUniqueElementIdentities(elements: unknown[]) {
  const identities: string[] = [];
  for (const element of elements) {
    const identity = getElementIdentity(element);
    if (identity === undefined) {
      return undefined;
    }
    identities.push(identity);
  }

  const hasDuplicateIdentities = new Set(identities).size !== identities.length;
  return hasDuplicateIdentities ? undefined : identities;
}

function getElementIdentity(element: unknown) {
  if (isMapEntry(element)) {
    return `entry:${String(element[0])}`;
  }
  if (!isPlainRecord(element)) {
    return undefined;
  }

  const id = element['id'];
  if (typeof id === 'string' || typeof id === 'number') {
    return `id:${id}`;
  }

  const playerId = element['playerId'];
  if (typeof playerId === 'number') {
    return `playerId:${playerId}`;
  }

  return undefined;
}

/** Maps are persisted as arrays of [key, value] entries. */
function isMapEntry(element: unknown): element is [string | number, unknown] {
  if (!Array.isArray(element) || element.length !== 2) {
    return false;
  }
  const entryKey: unknown = element[0];
  return typeof entryKey === 'string' || typeof entryKey === 'number';
}

function startsWithElements(array: unknown[], prefixElements: unknown[]) {
  if (array.length < prefixElements.length) {
    return false;
  }
  return prefixElements.every((element, index) => isEqual(element, array[index]));
}
