import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { ActionField, EffectRewardType } from '../models';

export interface FieldLog {
  fieldId: string;
  visitedAmount: number;
}

interface LogBase {
  playerId: number;
  roundNumber?: number;
}

export interface playerRewardGainLog extends LogBase {
  type: 'reward-gain';
  rewardType: EffectRewardType;
  amount: number;
}

export interface playerRewardPayLog extends LogBase {
  type: 'reward-pay';
  rewardType: EffectRewardType;
  amount: number;
}

export interface PlayerFieldLog extends LogBase {
  type: 'field-visit';
  fieldName: string;
}

export interface PlayerCardBuyLog extends LogBase {
  type: 'card-buy';
  cardName: string;
}

export interface PlayerCardPlayLog extends LogBase {
  type: 'card-play';
  cardName: string;
}

export interface PlayerCardDiscardLog extends LogBase {
  type: 'card-discard';
  cardName: string;
}

export interface PlayerCardTrashLog extends LogBase {
  type: 'card-trash';
  cardName: string;
}

export interface PlayerIntriguePlayLog extends LogBase {
  type: 'intrigue-play';
  cardName: string;
}

export interface PlayerIntrigueTrashLog extends LogBase {
  type: 'intrigue-trash';
  cardName: string;
}

export interface PlayerIntrigueStealLog extends LogBase {
  type: 'intrigue-steal';
  enemyPlayerId: number;
}

export interface PlayerVictoryPointGainLog extends LogBase {
  type: 'victory-point-gain';
  source?: string;
}

export interface PlayerVictoryPointLossLog extends LogBase {
  type: 'victory-point-loss';
  source?: string;
}

export interface PlayerCombatWinLog extends LogBase {
  type: 'combat-win';
}

export interface PlayerLocationControlGainLog extends LogBase {
  type: 'location-control-gain';
}

export interface PlayerLocationControlLossLog extends LogBase {
  type: 'location-control-loss';
}

export interface PlayerTechTileBuyLog extends LogBase {
  type: 'tech-tile-buy';
  techTileName: string;
}

export interface PlayerTechTilePlayLog extends LogBase {
  type: 'tech-tile-play';
  techTileName: string;
}

export interface PlayerTechTileTrashLog extends LogBase {
  type: 'tech-tile-trash';
  techTileName: string;
}

export type PlayerActionLog =
  | playerRewardGainLog
  | playerRewardPayLog
  | PlayerFieldLog
  | PlayerCardBuyLog
  | PlayerCardPlayLog
  | PlayerCardTrashLog
  | PlayerCardDiscardLog
  | PlayerIntriguePlayLog
  | PlayerIntrigueTrashLog
  | PlayerIntrigueStealLog
  | PlayerCombatWinLog
  | PlayerLocationControlGainLog
  | PlayerLocationControlLossLog
  | PlayerVictoryPointGainLog
  | PlayerVictoryPointLossLog
  | PlayerTechTilePlayLog
  | PlayerTechTileTrashLog
  | PlayerTechTileBuyLog;

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

  public get playerActionLogs() {
    return cloneDeep(this.playerActionLogSubject.value);
  }

  public getPlayerActionLog(playerId: number) {
    return cloneDeep(this.playerActionLogSubject.value.filter((x) => x.playerId === playerId));
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

  logPlayerResourceGained(playerId: number, rewardType: EffectRewardType, amount: number | undefined) {
    this.playerActionLogSubject.next([
      ...this.playerActionLogs,
      { playerId, type: 'reward-gain', rewardType: rewardType, amount: amount ?? 1 },
    ]);
  }

  logPlayerResourcePaid(playerId: number, rewardType: EffectRewardType, amount: number | undefined) {
    this.playerActionLogSubject.next([
      ...this.playerActionLogs,
      { playerId, type: 'reward-pay', rewardType: rewardType, amount: amount ?? 1 },
    ]);
  }

  logPlayerSentAgentToField(playerId: number, fieldName: string) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'field-visit', fieldName: fieldName }]);
  }

  logPlayerBoughtCard(playerId: number, cardName: string) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'card-buy', cardName: cardName }]);
  }

  logPlayerPlayedCard(playerId: number, cardName: string) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'card-play', cardName: cardName }]);
  }

  logPlayerDiscardedCard(playerId: number, cardName: string) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'card-discard', cardName: cardName }]);
  }

  logPlayerTrashedCard(playerId: number, cardName: string) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'card-trash', cardName: cardName }]);
  }

  logPlayerTrashedIntrigue(playerId: number, cardName: string) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'intrigue-trash', cardName: cardName }]);
  }

  logPlayerStoleIntrigue(playerId: number, enemyPlayerId: number) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'intrigue-steal', enemyPlayerId }]);
  }

  logPlayerPlayedIntrigue(playerId: number, cardName: string) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'intrigue-play', cardName: cardName }]);
  }

  logPlayerWonCombat(playerId: number, roundNumber: number) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'combat-win', roundNumber }]);
  }

  logPlayerGainedLocationControl(playerId: number, roundNumber: number) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'location-control-gain', roundNumber }]);
  }

  logPlayerLostLocationControl(playerId: number, roundNumber: number) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'location-control-loss', roundNumber }]);
  }

  logPlayerBoughtTechTile(playerId: number, techTileName: string) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'tech-tile-buy', techTileName }]);
  }

  logPlayerPlayedTechTile(playerId: number, techTileName: string) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'tech-tile-play', techTileName }]);
  }

  logPlayerTrashedTechTile(playerId: number, techTileName: string) {
    this.playerActionLogSubject.next([...this.playerActionLogs, { playerId, type: 'tech-tile-trash', techTileName }]);
  }

  logPlayerGainedVictoryPoint(playerId: number, roundNumber: number, source?: string) {
    this.playerActionLogSubject.next([
      ...this.playerActionLogs,
      { playerId, type: 'victory-point-gain', roundNumber, source },
    ]);
  }

  logPlayerLostVictoryPoint(playerId: number, roundNumber: number, source?: string) {
    this.playerActionLogSubject.next([
      ...this.playerActionLogs,
      { playerId, type: 'victory-point-loss', roundNumber, source },
    ]);
  }

  public printLogs() {
    console.log(this.log);
    console.log(this.playerActionLogs);
  }
}
