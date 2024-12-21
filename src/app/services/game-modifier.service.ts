import { Injectable } from '@angular/core';
import { cloneDeep, compact, flatten, isArray, min, sum } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { ActionField, ActionType, ActiveFactionType, FactionType, ResourceType, Reward } from '../models';
import { mergeObjects } from '../helpers/common';
import { Player } from '../models/player';

export interface GameModifier {
  id: string;
  currentRoundOnly?: boolean;
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
  minCosts?: number;
}

export interface TechTileModifier extends GameModifier {
  techTileId?: string;
  spiceAmount: number;
  minCosts?: number;
}

export interface LocationChangeModifier extends GameModifier {
  locationId: string;
  changeAmount: number;
}

export interface FieldHistoryModifier extends GameModifier {
  fieldId: string;
  changeAmount: number;
}

export type CustomGameActionType =
  | 'charm'
  | 'vision-conflict'
  | 'vision-deck'
  | 'vision-intrigues'
  | 'location-change-buildup'
  | 'field-history';

export interface CustomGameActionModifier extends GameModifier {
  action: CustomGameActionType;
}

export interface FieldFactionAccessModifier extends GameModifier {
  fieldId?: string;
  factionType?: ActiveFactionType;
}

export interface FieldEnemyAgentsAccessModifier extends GameModifier {
  fieldId?: string;
  actionTypes?: ActionType[];
}
export interface FieldAccessModifier extends GameModifier {
  fieldId?: string;
  factionType?: ActiveFactionType;
  type: 'faction-requirement' | 'enemy-agents';
}

export interface FieldCostsModifier extends GameModifier {
  fieldId?: string;
  actionType?: ActionType;
  costType: ResourceType;
  amount: number;
  minCosts?: number;
}

export interface FieldRewardsModifier extends GameModifier {
  fieldId?: string;
  actionType?: ActionType;
  rewardType: ResourceType;
  amount: number;
}

export interface FieldBlockModifier extends GameModifier {
  fieldId?: string;
  actionType?: ActionType;
}

export interface GameModifiers {
  factionInfluence?: FactionInfluenceModifiers;
  imperiumRow?: ImperiumRowModifier[];
  techTiles?: TechTileModifier[];
  customActions?: CustomGameActionModifier[];
  fieldFactionAccess?: FieldFactionAccessModifier[];
  fieldEnemyAgentAccess?: FieldEnemyAgentsAccessModifier[];
  locationChange?: LocationChangeModifier[];
  fieldHistory?: FieldHistoryModifier[];
  fieldCost?: FieldCostsModifier[];
  fieldReward?: FieldRewardsModifier[];
  fieldBlock?: FieldBlockModifier[];
}

export interface PlayerGameModifiers extends GameModifiers {
  playerId: number;
}

export interface RewardWithModifier extends Reward {
  modifier?: 'positive' | 'negative';
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
    const modifiers = this.getPlayerGameModifiers(playerId);
    if (modifiers && modifiers.fieldFactionAccess) {
      return compact(modifiers.fieldFactionAccess.map((x) => x.factionType));
    } else {
      return undefined;
    }
  }

  public getPlayerFieldUnlocksForIds(playerId: number): string[] | undefined {
    const modifiers = this.getPlayerGameModifiers(playerId);
    if (modifiers && modifiers.fieldFactionAccess) {
      return compact(modifiers.fieldFactionAccess.map((x) => x.fieldId));
    } else {
      return undefined;
    }
  }

  public getPlayerFieldEnemyAcessForActionTypes(playerId: number): ActionType[] | undefined {
    const modifiers = this.getPlayerGameModifiers(playerId);
    if (modifiers && modifiers.fieldEnemyAgentAccess) {
      return compact(flatten(modifiers.fieldEnemyAgentAccess.map((x) => x.actionTypes)));
    } else {
      return undefined;
    }
  }

  public getPlayerBlockedFieldsForActionTypes(playerId: number): ActionType[] | undefined {
    const modifiers = this.getPlayerGameModifiers(playerId);
    if (modifiers && modifiers.fieldBlock) {
      return compact(modifiers.fieldBlock.map((x) => x.actionType));
    } else {
      return undefined;
    }
  }

  public getPlayerBlockedFieldsForIds(playerId: number): string[] | undefined {
    const modifiers = this.getPlayerGameModifiers(playerId);
    if (modifiers && modifiers.fieldBlock) {
      return compact(modifiers.fieldBlock.map((x) => x.fieldId));
    } else {
      return undefined;
    }
  }

  public getPlayerCustomActionModifiers(playerId: number) {
    return this.playerGameModifiers.find((x) => x.playerId === playerId)?.customActions;
  }

  public getPlayerLocationChangeBuildupModifier(playerId: number, locationId: string) {
    return this.getPlayerGameModifiers(playerId)?.locationChange?.find((x) => x.locationId === locationId);
  }

  public getPlayerFieldHistoryModifier(playerId: number, fieldId: string) {
    return this.getPlayerGameModifiers(playerId)?.fieldHistory?.find((x) => x.fieldId === fieldId);
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

  public changeFieldHistoryModifier(playerId: number, fieldId: string, changeAmount = 1) {
    const playerGameModifiers = this.playerGameModifiers;
    const playerGameModifierIndex = playerGameModifiers.findIndex((x) => x.playerId === playerId);
    if (playerGameModifierIndex > -1) {
      const playerModifiers = playerGameModifiers[playerGameModifierIndex];
      const fieldHistoryModifiers = playerModifiers.fieldHistory;
      if (fieldHistoryModifiers) {
        const currentFieldModifierIndex = fieldHistoryModifiers.findIndex((x) => x.fieldId === fieldId);
        if (currentFieldModifierIndex > -1) {
          const currentValue = fieldHistoryModifiers[currentFieldModifierIndex];
          fieldHistoryModifiers[currentFieldModifierIndex] = {
            ...currentValue,
            changeAmount: currentValue.changeAmount + changeAmount,
          };
        } else {
          fieldHistoryModifiers.push({ id: crypto.randomUUID(), fieldId: fieldId, changeAmount });
        }
      } else {
        playerModifiers.fieldHistory = [{ id: crypto.randomUUID(), fieldId: fieldId, changeAmount }];
      }
    } else {
      playerGameModifiers.push({
        playerId,
        fieldHistory: [{ id: crypto.randomUUID(), fieldId: fieldId, changeAmount }],
      });
    }

    this.playerGameModifiersSubject.next(playerGameModifiers);
  }

  public removeTemporaryGameModifiers() {
    const playerModifiers = this.playerGameModifiers;
    for (const modifiers of playerModifiers) {
      for (const keyString in modifiers) {
        const key = keyString as keyof GameModifiers;

        let modifier = modifiers[key];
        if (isArray(modifier)) {
          modifiers[key] = modifier.filter((x) => !x.currentRoundOnly) as any;
        }
      }
    }

    this.playerGameModifiersSubject.next(playerModifiers);
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
}
