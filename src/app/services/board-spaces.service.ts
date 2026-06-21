import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { ActionField } from '../models';
import { PlayerAgentsService } from './player-agents.service';
import { PlayersService } from './players.service';
import { SettingsService } from './settings.service';

export interface SpiceAccumulation {
  boardSpaceId: string;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class BoardSpacesService {
  private boardSpacesSubject = new BehaviorSubject<ActionField[]>([]);
  boardSpaces$ = this.boardSpacesSubject.asObservable();

  private accumulatedSpiceOnBoardSpacesSubject = new BehaviorSubject<SpiceAccumulation[]>([]);
  accumulatedSpiceOnBoardSpaces$ = this.accumulatedSpiceOnBoardSpacesSubject.asObservable();

  unblockableBoardSpaces: ActionField[] = [];
  spiceAccumulationBoardSpaces: string[] = [];

  get boardSpaces() {
    return cloneDeep(this.boardSpacesSubject.value);
  }

  get accumulatedSpiceOnBoardSpaces() {
    return cloneDeep(this.accumulatedSpiceOnBoardSpacesSubject.value);
  }

  getBoardSpace(id: string) {
    return this.boardSpaces.find((x) => x.title.en === id);
  }

  constructor(
    private settingsService: SettingsService,
    private playerAgentsService: PlayerAgentsService,
    private playersService: PlayersService,
  ) {
    const accumulatedSpiceOnBoardSpacesString = localStorage.getItem('accumulatedSpiceOnBoardSpaces');
    if (accumulatedSpiceOnBoardSpacesString) {
      const accumulatedSpiceOnBoardSpaces = JSON.parse(accumulatedSpiceOnBoardSpacesString) as SpiceAccumulation[];
      this.accumulatedSpiceOnBoardSpacesSubject.next(accumulatedSpiceOnBoardSpaces);
    }

    this.accumulatedSpiceOnBoardSpaces$.subscribe((accumulatedSpiceOnBoardSpaces) => {
      localStorage.setItem('accumulatedSpiceOnBoardSpaces', JSON.stringify(accumulatedSpiceOnBoardSpaces));
    });

    this.playersService.players$.subscribe((players) => {
      const gameContent = this.settingsService.gameContent;

      this.boardSpacesSubject.next([
        ...this.settingsService.gameContent.locations
          .filter((x) => x.playerCount >= players.length)
          .flatMap((x) => x.locations)
          .map((x) => x.actionField),
        ...gameContent.factions.flatMap((x) => x.actionFields),
        ...(gameContent.ix ? [gameContent.ix] : []),
      ]);

      this.unblockableBoardSpaces = this.boardSpaces.filter((x) => x.isNonBlockingField);

      this.spiceAccumulationBoardSpaces = this.boardSpaces
        .filter((x) => x.rewards.some((x) => x.type === 'spice-accumulation'))
        .map((x) => x.title.en);
    });

    this.settingsService.gameContent$.subscribe((gameContent) => {
      const players = this.playersService.getPlayers();

      this.boardSpacesSubject.next([
        ...gameContent.locations
          .filter((x) => x.playerCount >= players.length)
          .flatMap((x) => x.locations)
          .map((x) => x.actionField),
        ...gameContent.factions.flatMap((x) => x.actionFields),
        ...(gameContent.ix ? [gameContent.ix] : []),
      ]);

      this.unblockableBoardSpaces = this.boardSpaces.filter((x) => x.isNonBlockingField);
      this.spiceAccumulationBoardSpaces = this.boardSpaces
        .filter((x) => x.rewards.some((x) => x.type === 'spice-accumulation'))
        .map((x) => x.title.en);
    });
  }

  boardSpaceHasAccumulatedSpice(boardSpaceId: string) {
    return this.accumulatedSpiceOnBoardSpaces.some((x) => x.boardSpaceId === boardSpaceId);
  }

  getAccumulatedSpiceForBoardSpace(boardSpaceId: string) {
    return this.accumulatedSpiceOnBoardSpaces.find((x) => x.boardSpaceId === boardSpaceId)?.amount ?? 0;
  }

  accumulateSpiceOnBoardSpaces(amount = 1) {
    const spiceBoardSpaceNames = this.spiceAccumulationBoardSpaces;

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
