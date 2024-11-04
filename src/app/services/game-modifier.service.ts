import { Injectable } from '@angular/core';
import { cloneDeep, isArray } from 'lodash';
import { BehaviorSubject, map } from 'rxjs';
import { Player } from './players.service';
import { ActiveFactionType, FactionType, Reward } from '../models';

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

export interface LocationChangeModifier extends GameModifier {
  locationId: string;
  changeAmount: number;
}

export type CustomGameActionType =
  | 'charm'
  | 'vision-conflict'
  | 'vision-deck'
  | 'vision-intrigues'
  | 'location-change-buildup';

export interface CustomGameActionModifier extends GameModifier {
  action: CustomGameActionType;
}

export interface FieldAccessModifier extends GameModifier {
  fieldId?: string;
  factionType?: ActiveFactionType;
}

export interface GameModifiers {
  factionInfluenceModifiers?: FactionInfluenceModifiers;
  imperiumRowModifiers?: ImperiumRowModifier[];
  customActions?: CustomGameActionModifier[];
  fieldAccessModifiers?: FieldAccessModifier[];
  locationChangeModifiers?: LocationChangeModifier[];
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
    return cloneDeep(this.playerGameModifiersSubject.value.find((x) => x.playerId === playerId));
  }

  public getPlayerImperiumRowModifiers(playerId: number) {
    return this.playerGameModifiers.find((x) => x.playerId === playerId)?.imperiumRowModifiers;
  }

  public getPlayerFieldUnlocksForFactions(playerId: number): ActiveFactionType[] | undefined {
    return this.getPlayerGameModifiers(playerId)
      ?.fieldAccessModifiers?.map((x) => x.factionType)
      .filter((x) => x !== undefined) as ActiveFactionType[] | undefined;
  }

  public getPlayerFieldUnlocksForIds(playerId: number): string[] | undefined {
    return this.getPlayerGameModifiers(playerId)
      ?.fieldAccessModifiers?.map((x) => x.fieldId)
      .filter((x) => x !== undefined) as string[] | undefined;
  }

  public getPlayerCustomActionModifiers(playerId: number) {
    return this.playerGameModifiers.find((x) => x.playerId === playerId)?.customActions;
  }

  public getPlayerLocationChangeBuildupModifier(playerId: number, locationId: string) {
    return this.getPlayerGameModifiers(playerId)?.locationChangeModifiers?.find((x) => x.locationId === locationId);
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

  public increaseLocationChangeModifier(playerId: number, locationId: string, changeAmount = 1) {
    const playerGameModifiers = this.playerGameModifiers;
    const playerGameModifierIndex = playerGameModifiers.findIndex((x) => x.playerId === playerId);
    if (playerGameModifierIndex > -1) {
      const playerModifiers = playerGameModifiers[playerGameModifierIndex];
      const locationChangeModifiers = playerModifiers.locationChangeModifiers;
      if (locationChangeModifiers) {
        const currentLocationModifierIndex = locationChangeModifiers.findIndex((x) => x.locationId === locationId);
        if (currentLocationModifierIndex > -1) {
          const currentValue = locationChangeModifiers[currentLocationModifierIndex];
          locationChangeModifiers[currentLocationModifierIndex] = {
            ...currentValue,
            changeAmount: currentValue.changeAmount + changeAmount,
          };
        } else {
          locationChangeModifiers.push({ id: crypto.randomUUID(), locationId, changeAmount });
        }
      } else {
        playerModifiers.locationChangeModifiers = [{ id: crypto.randomUUID(), locationId, changeAmount }];
      }
    } else {
      playerGameModifiers.push({
        playerId,
        locationChangeModifiers: [{ id: crypto.randomUUID(), locationId, changeAmount }],
      });
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
