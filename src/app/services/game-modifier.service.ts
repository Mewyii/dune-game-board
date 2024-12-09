import { Injectable } from '@angular/core';
import { cloneDeep, isArray, sum } from 'lodash';
import { BehaviorSubject, map } from 'rxjs';
import { ActionField, ActionType, ActiveFactionType, FactionType, Resource, ResourceType, Reward } from '../models';
import { mergeObjects } from '../helpers/common';
import { Player } from '../models/player';

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

export interface FieldCostsModifier extends GameModifier {
  fieldId?: string;
  actionType?: ActionType;
  costType: ResourceType;
  amount: number;
}

export interface GameModifiers {
  factionInfluence?: FactionInfluenceModifiers;
  imperiumRow?: ImperiumRowModifier[];
  customActions?: CustomGameActionModifier[];
  fieldAccess?: FieldAccessModifier[];
  locationChange?: LocationChangeModifier[];
  fieldCost?: FieldCostsModifier[];
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

  public getPlayerGameModifier<T extends keyof GameModifiers>(playerId: number, type: T) {
    const playerModifiers = this.playerGameModifiersSubject.value.find((x) => x.playerId === playerId);
    if (!playerModifiers) {
      return undefined;
    }

    return cloneDeep(playerModifiers[type]);
  }

  public getPlayerFieldUnlocksForFactions(playerId: number): ActiveFactionType[] | undefined {
    return this.getPlayerGameModifiers(playerId)
      ?.fieldAccess?.map((x) => x.factionType)
      .filter((x) => x !== undefined) as ActiveFactionType[] | undefined;
  }

  public getPlayerFieldUnlocksForIds(playerId: number): string[] | undefined {
    return this.getPlayerGameModifiers(playerId)
      ?.fieldAccess?.map((x) => x.fieldId)
      .filter((x) => x !== undefined) as string[] | undefined;
  }

  public getPlayerCustomActionModifiers(playerId: number) {
    return this.playerGameModifiers.find((x) => x.playerId === playerId)?.customActions;
  }

  public getPlayerLocationChangeBuildupModifier(playerId: number, locationId: string) {
    return this.getPlayerGameModifiers(playerId)?.locationChange?.find((x) => x.locationId === locationId);
  }

  addPlayerGameModifiers(playerId: number, gameModifiers: GameModifiers) {
    const playerGameModifiers = this.playerGameModifiers;
    const playerGameModifierIndex = playerGameModifiers.findIndex((x) => x.playerId === playerId);
    if (playerGameModifierIndex > -1) {
      playerGameModifiers[playerGameModifierIndex] = mergeObjects(
        playerGameModifiers[playerGameModifierIndex],
        gameModifiers
      );
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
      const imperiumRowModifiers = playerModifiers.imperiumRow;
      if (imperiumRowModifiers) {
        imperiumRowModifiers.push({ id: crypto.randomUUID(), ...content });
      } else {
        playerModifiers.imperiumRow = [{ id: crypto.randomUUID(), ...content }];
      }
    } else {
      playerGameModifiers.push({ playerId, imperiumRow: [{ id: crypto.randomUUID(), ...content }] });
    }

    this.playerGameModifiersSubject.next(playerGameModifiers);
  }

  public increaseLocationChangeModifier(playerId: number, locationId: string, changeAmount = 1) {
    const playerGameModifiers = this.playerGameModifiers;
    const playerGameModifierIndex = playerGameModifiers.findIndex((x) => x.playerId === playerId);
    if (playerGameModifierIndex > -1) {
      const playerModifiers = playerGameModifiers[playerGameModifierIndex];
      const locationChangeModifiers = playerModifiers.locationChange;
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
        playerModifiers.locationChange = [{ id: crypto.randomUUID(), locationId, changeAmount }];
      }
    } else {
      playerGameModifiers.push({
        playerId,
        locationChange: [{ id: crypto.randomUUID(), locationId, changeAmount }],
      });
    }

    this.playerGameModifiersSubject.next(playerGameModifiers);
  }

  public resetplayerGameModifiers(players: Player[]) {
    const playerGameModifiers: PlayerGameModifiers[] = [];
    for (let player of players) {
      playerGameModifiers.push({
        playerId: player.id,
        factionInfluence: undefined,
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

  public getCostModifierForField(playerId: number, actionField: ActionField) {
    const fieldCostModifiers = this.getPlayerGameModifier(playerId, 'fieldCost');
    if (fieldCostModifiers && actionField.costs) {
      const actionCosts = cloneDeep(actionField.costs);
      const fieldCostsType = actionCosts[0].type;

      return sum(
        fieldCostModifiers
          .filter(
            (x) =>
              x.costType === fieldCostsType &&
              (!x.actionType || x.actionType === actionField.actionType) &&
              (!x.fieldId || x.fieldId === actionField.title.en)
          )
          .map((x) => x.amount)
      );
    } else {
      return 0;
    }
  }

  public getModifiedCostsForField(playerId: number, actionField: ActionField) {
    const fieldCostModifiers = this.getPlayerGameModifier(playerId, 'fieldCost');
    if (fieldCostModifiers && actionField.costs) {
      const actionCosts = cloneDeep(actionField.costs);
      const fieldCostsType = actionCosts[0].type;

      const costsModifier = sum(
        fieldCostModifiers
          .filter(
            (x) =>
              x.costType === fieldCostsType &&
              (!x.actionType || x.actionType === actionField.actionType) &&
              (!x.fieldId || x.fieldId === actionField.title.en)
          )
          .map((x) => x.amount)
      );

      let remainingCostModifier = costsModifier;

      for (const costs of actionCosts) {
        let costAmount = costs.amount ?? 1;

        if (remainingCostModifier > 0) {
          costs.amount = costAmount + remainingCostModifier;
          break;
        } else if (remainingCostModifier < 0) {
          if (Math.abs(remainingCostModifier) >= costAmount) {
            actionCosts.shift();
            remainingCostModifier -= costAmount;
          } else {
            costs.amount = costAmount - remainingCostModifier;
            break;
          }
        }
      }
      return actionCosts;
    } else {
      return actionField.costs ?? [];
    }
  }
}
