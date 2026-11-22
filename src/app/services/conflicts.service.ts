import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { shuffleMultipleTimes } from '../helpers/common';
import { Conflict } from '../models/conflict';
import { SettingsService } from './settings.service';

export interface ConflictDeckCard extends Conflict {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConflictsService {
  private conflictStackSubject = new BehaviorSubject<ConflictDeckCard[]>([]);
  conflictStack$ = this.conflictStackSubject.asObservable();

  private currentConflictSubject = new BehaviorSubject<ConflictDeckCard | undefined>(undefined);
  currentConflict$ = this.currentConflictSubject.asObservable();

  private conflictDiscardPileSubject = new BehaviorSubject<ConflictDeckCard[]>([]);
  conflictDiscardPile$ = this.conflictDiscardPileSubject.asObservable();

  constructor(private settingsService: SettingsService) {
    const conflictStackString = localStorage.getItem('conflictStack');
    if (conflictStackString) {
      const conflictStack = JSON.parse(conflictStackString) as ConflictDeckCard[];

      this.conflictStackSubject.next(conflictStack);
    }

    this.conflictStack$.subscribe((conflictStack) => {
      localStorage.setItem('conflictStack', JSON.stringify(conflictStack));
    });

    const currentConflictString = localStorage.getItem('currentConflict');
    if (currentConflictString) {
      const currentConflict = JSON.parse(currentConflictString) as ConflictDeckCard | undefined;

      this.currentConflictSubject.next(currentConflict);
    }

    this.currentConflict$.subscribe((currentConflict) => {
      if (currentConflict) {
        localStorage.setItem('currentConflict', JSON.stringify(currentConflict));
      } else {
        localStorage.removeItem('currentConflict');
      }
    });
  }

  get currentConflict() {
    return cloneDeep(this.currentConflictSubject.value);
  }

  get conflictStack() {
    return cloneDeep(this.conflictStackSubject.value);
  }
  get conflictDiscardPile() {
    return cloneDeep(this.conflictDiscardPileSubject.value);
  }

  createConflictDeck() {
    const allConflicts = this.settingsService.getConflicts();
    const conflictStack: ConflictDeckCard[] = [];
    for (const [index, conflictCardAmount] of this.settingsService.getConflictCardsPerLevel().entries()) {
      let conflictsOfLevel = allConflicts.filter((x) => x.lvl === index + 1).map((x) => this.instantiateConflict(x));
      if (this.settingsService.getConflictsMode() === 'random') {
        conflictsOfLevel = shuffleMultipleTimes(conflictsOfLevel);
      } else {
        conflictsOfLevel = conflictsOfLevel
          .sort((a, b) => a.id.localeCompare(b.id))
          .sort((a, b) => (a?.boardSpaceId ?? '').localeCompare(b?.boardSpaceId ?? ''));
      }
      conflictStack.push(...conflictsOfLevel.slice(0, conflictCardAmount));
    }

    this.conflictStackSubject.next(conflictStack);
    this.currentConflictSubject.next(undefined);
  }

  addConflictsToConflictStack(conflicts: ConflictDeckCard[]) {
    const conflictStack = this.conflictStack;
    this.conflictStackSubject.next([...conflictStack, ...conflicts]);
  }

  setNextConflict() {
    const conflictStack = this.conflictStack;
    conflictStack.shift();

    const nextConflict = conflictStack[0];
    if (nextConflict) {
      this.conflictStackSubject.next(conflictStack);
      this.currentConflictSubject.next(nextConflict);
    }
  }

  setCurrentConflict(conflictId: string) {
    const conflictStack = this.conflictStack;
    const newCurrentConflict = conflictStack.find((x) => x.id === conflictId);
    if (newCurrentConflict) {
      this.currentConflictSubject.next(newCurrentConflict);
      this.conflictStackSubject.next(conflictStack.filter((x) => x.id !== conflictId));
    }
  }

  putCurrentConflictToDiscardPile() {
    const currentConflict = this.currentConflict;
    if (currentConflict) {
      const conflictDiscardPile = this.conflictDiscardPile;
      conflictDiscardPile.push(currentConflict);
      this.conflictDiscardPileSubject.next(conflictDiscardPile);
    }
  }

  removeConflictsFromDiscardPile(conflictIds: string[]) {
    const conflictDiscardPile = this.conflictDiscardPile;
    const newConflictDiscardPile = conflictDiscardPile.filter((x) => !conflictIds.includes(x.id));
    this.conflictDiscardPileSubject.next(newConflictDiscardPile);
  }

  resetCurrentConflict() {
    this.currentConflictSubject.next(undefined);
  }

  resetConflicts() {
    this.conflictStackSubject.next([]);
    this.conflictDiscardPileSubject.next([]);
    this.currentConflictSubject.next(undefined);
  }

  private instantiateConflict(conflict: Conflict): ConflictDeckCard {
    return { id: crypto.randomUUID(), ...conflict };
  }
}
