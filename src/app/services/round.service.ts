import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';

export type RoundPhaseType = 'none' | 'select leaders' | 'agent-placement' | 'combat' | 'combat-resolvement' | 'done';

@Injectable({
  providedIn: 'root',
})
export class RoundService {
  private currentRoundSubject = new BehaviorSubject<number>(0);
  currentRound$ = this.currentRoundSubject.asObservable();

  private currentRoundPhaseSubject = new BehaviorSubject<RoundPhaseType>('none');
  currentRoundPhase$ = this.currentRoundPhaseSubject.asObservable();

  private isFinaleSubject = new BehaviorSubject<boolean>(false);
  isFinale$ = this.isFinaleSubject.asObservable();

  constructor() {
    const currentRoundString = localStorage.getItem('currentRound');
    if (currentRoundString) {
      const currentRound = JSON.parse(currentRoundString) as number;
      this.currentRoundSubject.next(currentRound);
    }

    this.currentRound$.subscribe((currentRound) => {
      localStorage.setItem('currentRound', JSON.stringify(currentRound));
    });

    const currentRoundPhaseString = localStorage.getItem('currentRoundPhase');
    if (currentRoundPhaseString) {
      const currentRoundPhase = JSON.parse(currentRoundPhaseString) as RoundPhaseType;
      this.currentRoundPhaseSubject.next(currentRoundPhase);
    }

    this.currentRoundPhase$.subscribe((currentRoundPhase) => {
      localStorage.setItem('currentRoundPhase', JSON.stringify(currentRoundPhase));
    });

    const isFinaleString = localStorage.getItem('isFinale');
    if (isFinaleString) {
      const isFinale = JSON.parse(isFinaleString) as boolean;
      this.isFinaleSubject.next(isFinale);
    }

    this.isFinale$.subscribe((isFinale) => {
      localStorage.setItem('isFinale', JSON.stringify(isFinale));
    });
  }

  get currentRound() {
    return cloneDeep(this.currentRoundSubject.value);
  }

  get currentRoundPhase() {
    return cloneDeep(this.currentRoundPhaseSubject.value);
  }

  get isFinale() {
    return cloneDeep(this.isFinaleSubject.value);
  }

  setFirstRound() {
    this.currentRoundSubject.next(1);
  }

  setNextRound() {
    this.currentRoundSubject.next(this.currentRound + 1);
  }

  resetRound() {
    this.currentRoundSubject.next(0);
  }

  setRoundPhase(phase: RoundPhaseType) {
    this.currentRoundPhaseSubject.next(phase);
  }

  setFinale(isFinale: boolean) {
    this.isFinaleSubject.next(isFinale);
  }
}
