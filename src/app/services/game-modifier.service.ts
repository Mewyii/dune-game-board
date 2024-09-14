import { Injectable } from '@angular/core';
import { cloneDeep, isArray } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Player } from './player-manager.service';
import { FactionType, Reward } from '../models';

export interface GameModifier {
  id: string;
}

export interface FactionInfluenceModifier extends GameModifier {
  noInfluence: boolean;
  alternateReward: Reward;
}

export type FactionInfluenceModifiers = {
  [key in FactionType]?: FactionInfluenceModifier;
};

export interface ImperiumRowModifier extends GameModifier {
  cardId?: string;
  factionType?: FactionType;
  persuasionAmount: number;
}

export type CustomGameActionType = 'charm' | 'vision-conflict' | 'vision-deck' | 'vision-intrigues';

export interface CustomGameActionModifier extends GameModifier {
  action: CustomGameActionType;
}

export interface GameModifiers {
  factionInfluenceModifiers?: FactionInfluenceModifiers;
  imperiumRowModifiers?: ImperiumRowModifier[];
  customActions?: CustomGameActionModifier[];
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

  public getPlayerGameModifiers(playerId: number) {
    return this.playerGameModifiers.find((x) => x.playerId === playerId);
  }

  public getPlayerImperiumRowModifiers(playerId: number) {
    return this.playerGameModifiers.find((x) => x.playerId === playerId)?.imperiumRowModifiers;
  }

  public getPlayerCustomActionModifiers(playerId: number) {
    return this.playerGameModifiers.find((x) => x.playerId === playerId)?.customActions;
  }

  addPlayerGameModifiers(playerId: number, gameModifiers: GameModifiers) {
    const playerGameModifiers = this.playerGameModifiers;
    const playerGameModifierIndex = playerGameModifiers.findIndex((x) => x.playerId === playerId);
    if (playerGameModifierIndex > -1) {
      playerGameModifiers[playerGameModifierIndex] = { ...playerGameModifiers[playerGameModifierIndex], ...gameModifiers };
    } else {
      playerGameModifiers.push({ playerId, ...gameModifiers });
    }

    this.playerGameModifiersSubject.next(playerGameModifiers);
  }

  addPlayerImperiumRowModifier(playerId: number, content: Omit<ImperiumRowModifier, 'id'>) {
    const playerGameModifiers = this.playerGameModifiers;
    const playerGameModifierIndex = playerGameModifiers.findIndex((x) => x.playerId === playerId);
    if (playerGameModifierIndex > -1) {
      const playerModifiers = playerGameModifiers[playerGameModifierIndex];
      const imperiumRowModifiers = playerModifiers.imperiumRowModifiers;
      if (imperiumRowModifiers) {
        imperiumRowModifiers.push({ id: crypto.randomUUID(), ...content });
      } else {
        playerModifiers.imperiumRowModifiers = [{ id: crypto.randomUUID(), ...content }];
      }
    } else {
      playerGameModifiers.push({ playerId, imperiumRowModifiers: [{ id: crypto.randomUUID(), ...content }] });
    }

    this.playerGameModifiersSubject.next(playerGameModifiers);
  }

  public resetplayerGameModifiers(players: Player[]) {
    const playerGameModifiers: PlayerGameModifiers[] = [];
    for (let player of players) {
      playerGameModifiers.push({
        playerId: player.id,
        factionInfluenceModifiers: undefined,
      });
    }

    this.playerGameModifiersSubject.next(playerGameModifiers);
  }

  public resetAllPlayerGameModifiers() {
    this.playerGameModifiersSubject.next([]);
  }

  public playerHasCustomActionAvailable(playerId: number, actionType: CustomGameActionType) {
    return !!this.playerGameModifiers
      .find((x) => x.playerId === playerId)
      ?.customActions?.some((x) => x.action === actionType);
  }
}
