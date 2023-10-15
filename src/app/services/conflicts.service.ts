import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep, random } from 'lodash';

export interface ConflictSet {
  id: number;
  columns: number;
  rows: number;
  rounds: number;
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
    rounds: 5,
    imageSize: 1000,
    imagePath: 'assets/images/conflicts/lvl2.jpg',
  },
  {
    id: 3,
    columns: 3,
    rows: 2,
    rounds: 5,
    imageSize: 500,
    imagePath: 'assets/images/conflicts/lvl3.jpg',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ConflictsService {
  private currentConflictSetSubject = new BehaviorSubject<ConflictSet>({
    id: 0,
    columns: 0,
    rows: 0,
    rounds: 0,
    imageSize: 0,
    imagePath: '',
  });
  public currentConflictSet$ = this.currentConflictSetSubject.asObservable();

  private currentCardCoordinatesSubject = new BehaviorSubject<CardCoordinates>({ x: 0, y: 0 });
  public currentCardCoordinates$ = this.currentCardCoordinatesSubject.asObservable();

  private cardCellExlusionsSubject = new BehaviorSubject<CardCell[]>([]);
  public cardCellExlusions$ = this.cardCellExlusionsSubject.asObservable();

  constructor() {
    const currentConflictSetString = localStorage.getItem('currentConflictSet');
    if (currentConflictSetString) {
      const currentConflictSet = JSON.parse(currentConflictSetString) as ConflictSet;
      this.currentConflictSetSubject.next(currentConflictSet);
    }

    this.currentConflictSet$.subscribe((currentConflictSet) => {
      localStorage.setItem('currentConflictSet', JSON.stringify(currentConflictSet));
    });

    const currentCardCoordinatesString = localStorage.getItem('currentCardCoordinates');
    if (currentCardCoordinatesString) {
      const currentCardCoordinates = JSON.parse(currentCardCoordinatesString) as CardCoordinates;
      this.currentCardCoordinatesSubject.next(currentCardCoordinates);
    }

    this.currentCardCoordinates$.subscribe((currentCardCoordinates) => {
      localStorage.setItem('currentCardCoordinates', JSON.stringify(currentCardCoordinates));
    });

    const cardCellExlusionsString = localStorage.getItem('cardCellExlusions');
    if (cardCellExlusionsString) {
      const cardCellExlusions = JSON.parse(cardCellExlusionsString) as CardCell[];
      this.cardCellExlusionsSubject.next(cardCellExlusions);
    }

    this.cardCellExlusions$.subscribe((cardCellExlusions) => {
      localStorage.setItem('cardCellExlusions', JSON.stringify(cardCellExlusions));
    });
  }

  public get currentConflictSet() {
    return cloneDeep(this.currentConflictSetSubject.value);
  }

  public get currentCardCoordinates() {
    return cloneDeep(this.currentCardCoordinatesSubject.value);
  }

  public get cardCellExlusions() {
    return cloneDeep(this.cardCellExlusionsSubject.value);
  }

  setInitialConflict() {
    this.setNextConflictSet();

    const cardCell = this.getRandomCardCell(this.currentConflictSet);
    this.currentCardCoordinatesSubject.next(this.getCardCoordinates(cardCell.column, cardCell.row));
    this.cardCellExlusionsSubject.next([...this.cardCellExlusions, cardCell]);
  }

  setNextConflict() {
    const playedConflictsInThisSet =
      this.cardCellExlusions.filter((x) => x.conflictSetId === this.currentConflictSet.id).length - 1;
    if (playedConflictsInThisSet >= this.currentConflictSet.rounds) {
      this.setNextConflictSet();
    }

    const cardCell = this.getRandomCardCell(this.currentConflictSet);
    this.currentCardCoordinatesSubject.next(this.getCardCoordinates(cardCell.column, cardCell.row));
    this.cardCellExlusionsSubject.next([...this.cardCellExlusions, cardCell]);
  }

  setNextConflictSet() {
    const currentIndex = conflictSets.findIndex((x) => x.id === this.currentConflictSet?.id);
    if (currentIndex > -1) {
      this.currentConflictSetSubject.next(conflictSets[currentIndex + 1]);
    } else {
      this.currentConflictSetSubject.next(conflictSets[0]);
    }

    this.cardCellExlusionsSubject.next([
      ...this.cardCellExlusions,
      {
        conflictSetId: this.currentConflictSet.id,
        column: this.currentConflictSet.columns - 1,
        row: this.currentConflictSet.rows - 1,
      },
    ]);
  }

  getRandomCardCell(conflictSet: ConflictSet): CardCell {
    let randomColumn = 0;
    let randomRow = 0;

    for (let i = 0; i <= 20; i++) {
      randomColumn = random(conflictSet.columns - 1);
      randomRow = random(conflictSet.rows - 1);

      if (
        !this.cardCellExlusions.some(
          (element) =>
            element.conflictSetId === conflictSet.id && element.column === randomColumn && element.row === randomRow
        )
      ) {
        break;
      }
    }

    return { conflictSetId: conflictSet.id, column: randomColumn, row: randomRow };
  }

  getCardCoordinates(column: number, row: number) {
    return { x: column * -167, y: row * -255 };
  }

  resetConflicts() {
    this.currentConflictSetSubject.next({ id: 0, columns: 0, rows: 0, rounds: 0, imageSize: 0, imagePath: '' });
    this.currentCardCoordinatesSubject.next({ x: 0, y: 0 });
    this.cardCellExlusionsSubject.next([]);
  }
}
