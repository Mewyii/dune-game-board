import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { ActionField, RewardType } from '../models';

export interface FieldLog {
  fieldId: string;
  visitedAmount: number;
}

export interface playerRewardLog {
  playerId: number;
  type: 'reward';
  rewardType: RewardType;
  amount: number;
}

export interface PlayerFieldLog {
  playerId: number;
  type: 'field-visit';
  fieldName: string;
}

export interface PlayerCardBuyLog {
  playerId: number;
  type: 'card-buy';
  cardName: string;
}

export interface PlayerCardPlayLog {
  playerId: number;
  type: 'card-play';
  cardName: string;
}

export interface PlayerCardDiscardLog {
  playerId: number;
  type: 'card-discard';
  cardName: string;
}

export interface PlayerCardTrashLog {
  playerId: number;
  type: 'card-trash';
  cardName: string;
}

export type PlayerActionLog =
  | playerRewardLog
  | PlayerFieldLog
  | PlayerCardBuyLog
  | PlayerCardPlayLog
  | PlayerCardTrashLog
  | PlayerCardDiscardLog;

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private logSubject = new BehaviorSubject<FieldLog[]>([]);
  public log$ = this.logSubject.asObservable();

  private playerActionLogSubject = new BehaviorSubject<PlayerActionLog[]>([]);
  public playerActionLog$ = this.playerActionLogSubject.asObservable();

  constructor() {
    const logString = localStorage.getItem('log');
    if (logString) {
      const log = JSON.parse(logString) as FieldLog[];
      this.logSubject.next(log);
    }

    this.log$.subscribe((log) => {
      localStorage.setItem('log', JSON.stringify(log));
    });

    const playerActionLogString = localStorage.getItem('playerActionLog');
    if (playerActionLogString) {
      const log = JSON.parse(playerActionLogString) as PlayerActionLog[];
      this.playerActionLogSubject.next(log);
    }

    this.playerActionLog$.subscribe((log) => {
      localStorage.setItem('playerActionLog', JSON.stringify(log));
    });
  }

  public get log() {
    return cloneDeep(this.logSubject.value);
  }

  public get playerActionLog() {
    return cloneDeep(this.playerActionLogSubject.value);
  }

  public clearLogs() {
    this.logSubject.next([]);
    this.playerActionLogSubject.next([]);
  }

  logAgentAction(actionField: ActionField) {
    const log = this.log;

    const logIndex = log.findIndex((x) => x.fieldId === actionField.title.en);
    if (logIndex >= 0) {
      const logEntry = log[logIndex];
      log[logIndex] = {
        ...logEntry,
        visitedAmount: logEntry.visitedAmount + 1,
      };
    } else {
      log.push({ fieldId: actionField.title.en, visitedAmount: 1 });
    }

    this.logSubject.next(log);
  }

  logPlayerResourceGained(playerId: number, rewardType: RewardType, amount: number | undefined) {
    this.playerActionLogSubject.next([
      ...this.playerActionLog,
      { playerId, type: 'reward', rewardType: rewardType, amount: amount ?? 1 },
    ]);
  }

  logPlayerSentAgentToField(playerId: number, fieldName: string) {
    this.playerActionLogSubject.next([...this.playerActionLog, { playerId, type: 'field-visit', fieldName: fieldName }]);
  }

  logPlayerBoughtCard(playerId: number, cardName: string) {
    this.playerActionLogSubject.next([...this.playerActionLog, { playerId, type: 'card-buy', cardName: cardName }]);
  }

  logPlayerPlayedCard(playerId: number, cardName: string) {
    this.playerActionLogSubject.next([...this.playerActionLog, { playerId, type: 'card-play', cardName: cardName }]);
  }

  logPlayerDiscardedCard(playerId: number, cardName: string) {
    this.playerActionLogSubject.next([...this.playerActionLog, { playerId, type: 'card-discard', cardName: cardName }]);
  }

  logPlayerTrashedCard(playerId: number, cardName: string) {
    this.playerActionLogSubject.next([...this.playerActionLog, { playerId, type: 'card-trash', cardName: cardName }]);
  }

  public printLogs() {
    console.log(this.log);
    console.log(this.playerActionLog);
  }
}
