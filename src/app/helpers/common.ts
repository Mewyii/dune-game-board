import { cloneDeep, isArray, isBoolean, isNumber, isObject, max, shuffle } from 'lodash';

export function shuffleMultipleTimes<T extends object>(array: T[]): T[] {
  return shuffle(shuffle(shuffle(array)));
}

export function randomizeArray<T>(a: Array<T>, randomizeFactor: number) {
  const currentArray = cloneDeep(a);
  const resultArray: Array<T> = [];

  for (let io = 0; io < a.length; io++) {
    for (let i = 0; i < currentArray.length; i++) {
      if (Math.random() > randomizeFactor) {
        const element = currentArray.splice(i, 1)[0];
        if (element) {
          resultArray.push(element);
          break;
        }
      } else if (i === currentArray.length - 1) {
        const element = currentArray.splice(i, 1)[0];
        if (element) {
          resultArray.push(element);
          break;
        }
      }
    }
  }
  return resultArray;
}

export function getRandomElementFromArray<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function mergeObjects<T>(existingObject: T, newObject: Partial<T>): T {
  let result: T = existingObject;
  for (const index in existingObject) {
    const key = index as keyof T;

    if (isArray(result[key]) && isArray(newObject[key])) {
      result[key] = [...(result[key] as any), ...(newObject[key] as any)] as any;
    } else if (isNumber(result[key]) && isNumber(newObject[key])) {
      result[key] = ((result[key] as any) + newObject[key]) as any as any;
    } else if (isBoolean(result[key]) && isBoolean(newObject[key])) {
      result[key] = (result[key] || newObject[key]) as any;
    } else if (isObject(result[key]) && isObject(newObject[key])) {
      result[key] = { ...result[key], ...newObject[key] } as any;
    }
  }
  for (const index in newObject) {
    const key = index as keyof T;

    if (result[key] === undefined) {
      result[key] = newObject[key] as any;
    }
  }
  return result;
}

export const normalizeNumber = (value: number, max: number, min: number) => (value - min) / (max - min);

export const getNumberAverage = (arr: number[]) => (arr.length > 0 ? sum(arr) / arr.length : 0);

export const getNumberMax = (arr: number[]) => max(arr) ?? 0;

export const sum = (arr: number[]) => arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
