import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, first, map } from 'rxjs';
import { cloneDeep, random } from 'lodash';
import { Conflict, conflicts } from '../constants/conflicts';
import { shuffle } from '../helpers/common';
import { Reward } from '../models';

export interface ConflictSet {
  id: number;
  columns: number;
  rows: number;
  roundTreshold: number;
  imageSize: number;
  imagePath: string;
}

export interface CardCell {
  conflictSetId: number;
  column: number;
  row: number;
}

export interface CardCoordinates {
  x: number;
  y: number;
}

const conflictSets: ConflictSet[] = [
  {
    id: 2,
    columns: 6,
    rows: 2,
    roundTreshold: 5,
    imageSize: 1000,
    imagePath: 'assets/images/conflicts/lvl2.jpg',
  },
  {
    id: 3,
    columns: 3,
    rows: 2,
    roundTreshold: 10,
    imageSize: 500,
    imagePath: 'assets/images/conflicts/lvl3.jpg',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ConflictsService {
  private conflicts = conflicts;
  private currentConflictSetSubject = new BehaviorSubject<ConflictSet>({
    id: 0,
    columns: 0,
    rows: 0,
    roundTreshold: 0,
    imageSize: 0,
    imagePath: '',
  });
  public currentConflictSet$ = this.currentConflictSetSubject.asObservable();

  private currentCardCoordinatesSubject = new BehaviorSubject<CardCoordinates>({ x: 0, y: 0 });
  public currentCardCoordinates$ = this.currentCardCoordinatesSubject.asObservable();

  private conflictStackSubject = new BehaviorSubject<Conflict[]>([]);
  public conflictStack$ = this.conflictStackSubject.asObservable();

  public currentConflict$ = this.conflictStack$.pipe(map((x) => x[0]));

  constructor() {
    const currentConflictSetString = localStorage.getItem('currentConflictSet');
    if (currentConflictSetString) {
      const currentConflictSet = JSON.parse(currentConflictSetString) as ConflictSet;
      this.currentConflictSetSubject.next(currentConflictSet);
    }

    this.currentConflictSet$.subscribe((currentConflictSet) => {
      localStorage.setItem('currentConflictSet', JSON.stringify(currentConflictSet));
    });

    const conflictStackString = localStorage.getItem('conflictStack');
    if (conflictStackString) {
      const conflictStack = JSON.parse(conflictStackString) as Conflict[];

      // Workaround for local storage not being able to store functions
      const realConflictStack = conflictStack.map((conflict) => {
        const realConflict = this.conflicts.find((x) => x.name.en === conflict.name.en);
        return realConflict ?? conflict;
      });
      this.conflictStackSubject.next(realConflictStack);

      this.currentCardCoordinatesSubject.next(
        this.getCardCoordinates(realConflictStack[0].column, realConflictStack[0].row)
      );
    }

    this.conflictStack$.subscribe((conflictStack) => {
      localStorage.setItem('conflictStack', JSON.stringify(conflictStack));
    });
  }

  public get currentConflictSet() {
    return cloneDeep(this.currentConflictSetSubject.value);
  }

  public get currentConflict() {
    return this.conflictStack.shift()!;
  }

  public get conflictStack() {
    return cloneDeep(this.conflictStackSubject.value);
  }

  setInitialConflictStack() {
    this.setConflictSet(2);

    const secondLevelConflicts = this.conflicts.filter((x) => x.lvl === 2);
    const thirdLevelConflicts = this.conflicts.filter((x) => x.lvl === 3);

    const conflictStack = [...shuffle(secondLevelConflicts).slice(0, 5), ...shuffle(thirdLevelConflicts).slice(0, 5)];

    this.conflictStackSubject.next(conflictStack);

    this.currentCardCoordinatesSubject.next(this.getCardCoordinates(conflictStack[0].column, conflictStack[0].row));
  }

  setNextConflict() {
    const conflictStack = this.conflictStack;
    conflictStack.shift();

    const nextConflict = conflictStack[0];
    if (nextConflict) {
      if (nextConflict.lvl !== this.currentConflictSet.id) {
        this.setConflictSet(nextConflict.lvl);
      }
      this.currentCardCoordinatesSubject.next(this.getCardCoordinates(nextConflict.column, nextConflict.row));
      this.conflictStackSubject.next(conflictStack);
    }
  }

  setConflictSet(id: number) {
    const currentIndex = conflictSets.findIndex((x) => x.id === id);
    if (currentIndex > -1) {
      this.currentConflictSetSubject.next(conflictSets[currentIndex]);
    }
  }

  getCardCoordinates(column: number, row: number) {
    return { x: (column - 1) * -167, y: (row - 1) * -255 };
  }

  resetConflicts() {
    this.currentConflictSetSubject.next({ id: 0, columns: 0, rows: 0, roundTreshold: 0, imageSize: 0, imagePath: '' });
    this.currentCardCoordinatesSubject.next({ x: 0, y: 0 });
  }
}
