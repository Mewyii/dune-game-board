import { inject, Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { GameStatePersistenceService } from './persistence/game-state-persistence.service';

export type RoundPhaseType = 'none' | 'select leaders' | 'agent-placement' | 'combat' | 'combat-resolvement' | 'done';

@Injectable({
  providedIn: 'root',
})
export class RoundService {
  private gameStatePersistenceService = inject(GameStatePersistenceService);

  private currentRoundSubject = new BehaviorSubject<number>(0);
  currentRound$ = this.currentRoundSubject.asObservable();

  private currentRoundPhaseSubject = new BehaviorSubject<RoundPhaseType>('none');
  currentRoundPhase$ = this.currentRoundPhaseSubject.asObservable();

  private isFinaleSubject = new BehaviorSubject<boolean>(false);
  isFinale$ = this.isFinaleSubject.asObservable();

  constructor() {
    this.gameStatePersistenceService.bindSubjectToStorage('currentRound', this.currentRoundSubject, { scope: 'game' });
    this.gameStatePersistenceService.bindSubjectToStorage('currentRoundPhase', this.currentRoundPhaseSubject, {
      scope: 'game',
    });
    this.gameStatePersistenceService.bindSubjectToStorage('isFinale', this.isFinaleSubject, { scope: 'game' });
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
