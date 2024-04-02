import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, first } from 'rxjs';
import { cloneDeep, random } from 'lodash';
import { Conflict, conflicts } from '../constants/conflicts';
import { shuffle } from '../helpers/common';

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

  private playedConflictsSubject = new BehaviorSubject<string[]>([]);
  public playedConflicts$ = this.playedConflictsSubject.asObservable();

  private currentConflictSubject = new BehaviorSubject<Conflict>({
    name: { de: 'Wüstenkraft', en: 'desert power' },
    aiEvaluation: () => 0.5,
    lvl: 2,
    row: 1,
    column: 1,
  });
  public currentConflict$ = this.currentConflictSubject.asObservable();

  constructor() {
    const currentConflictSetString = localStorage.getItem('currentConflictSet');
    if (currentConflictSetString) {
      const currentConflictSet = JSON.parse(currentConflictSetString) as ConflictSet;
      this.currentConflictSetSubject.next(currentConflictSet);
    }

    this.currentConflictSet$.subscribe((currentConflictSet) => {
      localStorage.setItem('currentConflictSet', JSON.stringify(currentConflictSet));
    });

    const playedConflictsString = localStorage.getItem('playedConflicts');
    if (playedConflictsString) {
      const playedConflicts = JSON.parse(playedConflictsString) as string[];
      this.playedConflictsSubject.next(playedConflicts);
    }

    this.playedConflicts$.subscribe((playedConflicts) => {
      localStorage.setItem('playedConflicts', JSON.stringify(playedConflicts));
    });

    const currentConflictString = localStorage.getItem('currentConflict');
    if (currentConflictString) {
      const currentConflict = JSON.parse(currentConflictString) as Conflict;

      // Workaround for local storage not being able to store functions
      const realConflict = this.conflicts.find((x) => x.name.en === currentConflict.name.en);
      if (realConflict) {
        this.currentConflictSubject.next(realConflict);
      }

      this.currentCardCoordinatesSubject.next(this.getCardCoordinates(currentConflict.column, currentConflict.row));
    }

    this.currentConflict$.subscribe((currentConflict) => {
      localStorage.setItem('currentConflict', JSON.stringify(currentConflict));
    });
  }

  public get currentConflictSet() {
    return cloneDeep(this.currentConflictSetSubject.value);
  }

  public get currentConflict() {
    return cloneDeep(this.currentConflictSubject.value);
  }

  public get playedConflicts() {
    return cloneDeep(this.playedConflictsSubject.value);
  }

  setInitialConflict() {
    this.setNextConflictSet();

    const shuffledConflicts = shuffle(this.conflicts.filter((x) => x.lvl === this.currentConflictSet.id));
    const firstConflict = shuffledConflicts[0];

    this.currentConflictSubject.next(firstConflict);

    this.currentCardCoordinatesSubject.next(this.getCardCoordinates(firstConflict.column, firstConflict.row));
    this.playedConflictsSubject.next([...this.playedConflicts, firstConflict.name.en]);
  }

  setNextConflict() {
    if (this.playedConflicts.length >= this.currentConflictSet.roundTreshold) {
      this.setNextConflictSet();
    }

    const shuffledConflicts = shuffle(
      this.conflicts.filter((x) => x.lvl === this.currentConflictSet.id && !this.playedConflicts.includes(x.name.en))
    );

    const nextConflict = shuffledConflicts[0];

    this.currentConflictSubject.next(nextConflict);
    this.currentCardCoordinatesSubject.next(this.getCardCoordinates(nextConflict.column, nextConflict.row));
    this.playedConflictsSubject.next([...this.playedConflicts, nextConflict.name.en]);
  }

  setNextConflictSet() {
    const currentIndex = conflictSets.findIndex((x) => x.id === this.currentConflictSet?.id);
    if (currentIndex > -1) {
      this.currentConflictSetSubject.next(conflictSets[currentIndex + 1]);
    } else {
      this.currentConflictSetSubject.next(conflictSets[0]);
    }
  }

  getCardCoordinates(column: number, row: number) {
    return { x: (column - 1) * -167, y: (row - 1) * -255 };
  }

  resetConflicts() {
    this.currentConflictSetSubject.next({ id: 0, columns: 0, rows: 0, roundTreshold: 0, imageSize: 0, imagePath: '' });
    this.currentCardCoordinatesSubject.next({ x: 0, y: 0 });
    this.playedConflictsSubject.next([]);
  }
}
