import { cloneDeep, result } from 'lodash';

export function shuffle<T>(a: Array<T>) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

export const normalizeNumber = (value: number, max: number, min: number) => (value - min) / (max - min);

export const getNumberAverage = (arr: number[]) => sum(arr) / arr.length;

export const sum = (arr: number[]) => arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
