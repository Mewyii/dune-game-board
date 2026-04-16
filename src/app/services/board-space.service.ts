import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { PlayerAgentsService } from './player-agents.service';
import { SettingsService } from './settings.service';

export interface SpiceAccumulation {
  boardSpaceId: string;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class BoardSpaceService {
  private accumulatedSpiceOnBoardSpacesSubject = new BehaviorSubject<SpiceAccumulation[]>([]);
  accumulatedSpiceOnBoardSpaces$ = this.accumulatedSpiceOnBoardSpacesSubject.asObservable();

  get accumulatedSpiceOnBoardSpaces() {
    return cloneDeep(this.accumulatedSpiceOnBoardSpacesSubject.value);
  }

  constructor(
    private settingsService: SettingsService,
    private playerAgentsService: PlayerAgentsService,
  ) {
    const accumulatedSpiceOnBoardSpacesString = localStorage.getItem('accumulatedSpiceOnBoardSpaces');
    if (accumulatedSpiceOnBoardSpacesString) {
      const accumulatedSpiceOnBoardSpaces = JSON.parse(accumulatedSpiceOnBoardSpacesString) as SpiceAccumulation[];
      this.accumulatedSpiceOnBoardSpacesSubject.next(accumulatedSpiceOnBoardSpaces);
    }

    this.accumulatedSpiceOnBoardSpaces$.subscribe((accumulatedSpiceOnBoardSpaces) => {
      localStorage.setItem('accumulatedSpiceOnBoardSpaces', JSON.stringify(accumulatedSpiceOnBoardSpaces));
    });
  }

  boardSpaceHasAccumulatedSpice(boardSpaceId: string) {
    return this.accumulatedSpiceOnBoardSpaces.some((x) => x.boardSpaceId === boardSpaceId);
  }

  getAccumulatedSpiceForBoardSpace(boardSpaceId: string) {
    return this.accumulatedSpiceOnBoardSpaces.find((x) => x.boardSpaceId === boardSpaceId)?.amount ?? 0;
  }

  accumulateSpiceOnBoardSpaces(amount = 1) {
    const spiceBoardSpaceNames = this.settingsService.spiceAccumulationFields;

    const accumulatedSpiceOnBoardSpaces = this.accumulatedSpiceOnBoardSpaces;

    for (let boardSpaceName of spiceBoardSpaceNames) {
      if (this.playerAgentsService.getPlayerAgentsOnFieldCount(boardSpaceName) < 1) {
        const index = accumulatedSpiceOnBoardSpaces.findIndex((x) => x.boardSpaceId === boardSpaceName);
        if (index > -1) {
          const element = accumulatedSpiceOnBoardSpaces[index];
          accumulatedSpiceOnBoardSpaces[index] = {
            ...element,
            amount: element.amount + amount,
          };
        } else {
          accumulatedSpiceOnBoardSpaces.push({ boardSpaceId: boardSpaceName, amount: amount });
        }
      }
    }

    this.accumulatedSpiceOnBoardSpacesSubject.next(accumulatedSpiceOnBoardSpaces);
  }

  resetAccumulatedSpiceOnBoardSpaces() {
    this.accumulatedSpiceOnBoardSpacesSubject.next([]);
  }

  increaseAccumulatedSpiceOnBoardSpace(boardSpaceId: string, amount = 1) {
    const accumulatedSpiceOnBoardSpaces = this.accumulatedSpiceOnBoardSpaces;

    const index = accumulatedSpiceOnBoardSpaces.findIndex((x) => x.boardSpaceId === boardSpaceId);
    if (index > -1) {
      const element = accumulatedSpiceOnBoardSpaces[index];
      accumulatedSpiceOnBoardSpaces[index] = {
        ...element,
        amount: element.amount + amount,
      };
    } else {
      accumulatedSpiceOnBoardSpaces.push({ boardSpaceId, amount: amount });
    }

    this.accumulatedSpiceOnBoardSpacesSubject.next(accumulatedSpiceOnBoardSpaces);
  }

  decreaseAccumulatedSpiceOnBoardSpace(boardSpaceId: string, amount = 1) {
    const accumulatedSpiceOnBoardSpaces = this.accumulatedSpiceOnBoardSpaces;

    const index = accumulatedSpiceOnBoardSpaces.findIndex((x) => x.boardSpaceId === boardSpaceId && x.amount > 0);
    if (index > -1) {
      const element = accumulatedSpiceOnBoardSpaces[index];
      accumulatedSpiceOnBoardSpaces[index] = {
        ...element,
        amount: element.amount - amount,
      };
    }

    this.accumulatedSpiceOnBoardSpacesSubject.next(accumulatedSpiceOnBoardSpaces);
  }

  resetAccumulatedSpiceOnBoardSpace(boardSpaceId: string) {
    const accumulatedSpiceOnBoardSpaces = this.accumulatedSpiceOnBoardSpaces;

    const index = accumulatedSpiceOnBoardSpaces.findIndex((x) => x.boardSpaceId === boardSpaceId && x.amount > 0);
    if (index > -1) {
      const element = accumulatedSpiceOnBoardSpaces[index];
      accumulatedSpiceOnBoardSpaces[index] = {
        ...element,
        amount: 0,
      };
    }

    this.accumulatedSpiceOnBoardSpacesSubject.next(accumulatedSpiceOnBoardSpaces);
  }
}
