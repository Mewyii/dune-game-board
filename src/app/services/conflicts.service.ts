import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { shuffleMultipleTimes } from '../helpers/common';
import { Conflict } from '../models/conflict';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class ConflictsService {
  private conflictStackSubject = new BehaviorSubject<Conflict[]>([]);
  conflictStack$ = this.conflictStackSubject.asObservable();

  private currentConflictSubject = new BehaviorSubject<Conflict | undefined>(undefined);
  currentConflict$ = this.currentConflictSubject.asObservable();

  constructor(private settingsService: SettingsService) {
    const conflictStackString = localStorage.getItem('conflictStack');
    if (conflictStackString) {
      const conflictStack = JSON.parse(conflictStackString) as Conflict[];

      this.conflictStackSubject.next(conflictStack);
    }

    this.conflictStack$.subscribe((conflictStack) => {
      localStorage.setItem('conflictStack', JSON.stringify(conflictStack));
    });

    const currentConflictString = localStorage.getItem('currentConflict');
    if (currentConflictString) {
      const currentConflict = JSON.parse(currentConflictString) as Conflict | undefined;

      this.currentConflictSubject.next(currentConflict);
    }

    this.currentConflict$.subscribe((currentConflict) => {
      if (currentConflict) {
        localStorage.setItem('currentConflict', JSON.stringify(currentConflict));
      }
    });
  }

  get currentConflict() {
    return cloneDeep(this.currentConflictSubject.value);
  }

  get conflictStack() {
    return cloneDeep(this.conflictStackSubject.value);
  }

  createConflictDeck() {
    const allConflicts = this.settingsService.getConflicts();
    const conflictStack: Conflict[] = [];
    for (const [index, conflictCardAmount] of this.settingsService.getConflictCardsPerLevel().entries()) {
      let conflictsOfLevel = allConflicts.filter((x) => x.lvl === index + 1);
      if (this.settingsService.getConflictsMode() === 'random') {
        conflictsOfLevel = shuffleMultipleTimes(conflictsOfLevel);
      } else {
        conflictsOfLevel = conflictsOfLevel
          .sort((a, b) => a.name.en.localeCompare(b.name.en))
          .sort((a, b) => (a?.boardSpaceId ?? '').localeCompare(b?.boardSpaceId ?? ''));
      }
      conflictStack.push(...conflictsOfLevel.slice(0, conflictCardAmount));
    }

    this.conflictStackSubject.next(conflictStack);
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

  resetConflicts() {
    this.conflictStackSubject.next([]);
    this.currentConflictSubject.next(undefined);
  }
}
