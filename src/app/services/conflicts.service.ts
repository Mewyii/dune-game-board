import { Injectable } from '@angular/core';
import { cloneDeep, shuffle } from 'lodash';
import { BehaviorSubject, map } from 'rxjs';
import { conflicts } from '../constants/conflicts';
import { Conflict } from '../models/conflict';

@Injectable({
  providedIn: 'root',
})
export class ConflictsService {
  private conflicts = conflicts;

  private conflictStackSubject = new BehaviorSubject<Conflict[]>([]);
  public conflictStack$ = this.conflictStackSubject.asObservable();

  public currentConflict$ = this.conflictStack$.pipe(map((x) => x[0]));

  constructor() {
    const conflictStackString = localStorage.getItem('conflictStack');
    if (conflictStackString) {
      const conflictStack = JSON.parse(conflictStackString) as Conflict[];

      this.conflictStackSubject.next(conflictStack);
    }

    this.conflictStack$.subscribe((conflictStack) => {
      localStorage.setItem('conflictStack', JSON.stringify(conflictStack));
    });
  }

  public get currentConflict() {
    return this.conflictStack.shift()!;
  }

  public get conflictStack() {
    return cloneDeep(this.conflictStackSubject.value);
  }

  createConflictDeck() {
    const secondLevelConflicts = this.conflicts.filter((x) => x.lvl === 1);
    const thirdLevelConflicts = this.conflicts.filter((x) => x.lvl === 2);

    const conflictStack = [...shuffle(secondLevelConflicts).slice(0, 5), ...shuffle(thirdLevelConflicts).slice(0, 5)];

    this.conflictStackSubject.next(conflictStack);
  }

  setNextConflict() {
    const conflictStack = this.conflictStack;
    conflictStack.shift();

    const nextConflict = conflictStack[0];
    if (nextConflict) {
      this.conflictStackSubject.next(conflictStack);
    }
  }

  resetConflicts() {
    this.conflictStackSubject.next([]);
  }
}
