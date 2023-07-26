import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { ActionField } from '../models';
import { TranslateService } from './translate-service';

export interface Log {
  fieldId: string;
  visitedAmount: number;
}

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private logSubject = new BehaviorSubject<Log[]>([]);
  public log$ = this.logSubject.asObservable();

  constructor(public translateService: TranslateService) {
    const logString = localStorage.getItem('log');
    if (logString) {
      const log = JSON.parse(logString) as Log[];
      this.logSubject.next(log);
    }

    this.log$.subscribe((log) => {
      localStorage.setItem('log', JSON.stringify(log));
    });
  }

  public get log() {
    return cloneDeep(this.logSubject.value);
  }

  public clearLog() {
    this.logSubject.next([]);
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

  public printLog() {
    console.log(this.log);
  }
}
