import { cloneDeep, result } from 'lodash';

export function shuffle(a: Array<any>) {
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
