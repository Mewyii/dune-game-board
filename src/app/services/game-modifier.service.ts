import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, filter, map } from 'rxjs';
import { Player } from './player-manager.service';
import { FactionType, Reward } from '../models';

export interface FactionInfluenceModifier {
  noInfluence: boolean;
  alternateReward: Reward;
}

export type FactionInfluenceModifiers = {
  [key in FactionType]?: FactionInfluenceModifier;
};

export interface GameModifiers {
  factionInfluenceModifier?: FactionInfluenceModifiers;
}

export interface PlayerGameModifiers extends GameModifiers {
  playerId: number;
}

@Injectable({
  providedIn: 'root',
})
export class GameModifiersService {
  private playerGameModifiersSubject = new BehaviorSubject<PlayerGameModifiers[]>([]);
  public playerGameModifiers$ = this.playerGameModifiersSubject.asObservable();
  constructor() {
    const playerGameModifiersString = localStorage.getItem('playerGameModifiers');
    if (playerGameModifiersString) {
      const playerGameModifiers = JSON.parse(playerGameModifiersString) as PlayerGameModifiers[];
      this.playerGameModifiersSubject.next(playerGameModifiers);
    }

    this.playerGameModifiers$.subscribe((playerGameModifiers) => {
      localStorage.setItem('playerGameModifiers', JSON.stringify(playerGameModifiers));
    });
  }

  public get playerGameModifiers() {
    return cloneDeep(this.playerGameModifiersSubject.value);
  }

  public getPlayerGameModifier(playerId: number) {
    return this.playerGameModifiers.find((x) => x.playerId === playerId);
  }

  addPlayerGameModifier(playerId: number, gameModifiers: GameModifiers) {
    const playerGameModifiers = this.playerGameModifiers;
    const playerGameModifierIndex = playerGameModifiers.findIndex((x) => x.playerId === playerId);
    if (playerGameModifierIndex > -1) {
      playerGameModifiers[playerGameModifierIndex] = { ...playerGameModifiers[playerGameModifierIndex], ...gameModifiers };
    } else {
      playerGameModifiers.push({ playerId, ...gameModifiers });
    }

    this.playerGameModifiersSubject.next(playerGameModifiers);
  }

  public resetplayerGameModifiers(players: Player[]) {
    const playerGameModifiers: PlayerGameModifiers[] = [];
    for (let player of players) {
      playerGameModifiers.push({
        playerId: player.id,
        factionInfluenceModifier: undefined,
      });
    }

    this.playerGameModifiersSubject.next(playerGameModifiers);
  }

  public resetAllPlayerGameModifiers() {
    this.playerGameModifiersSubject.next([]);
  }
}
