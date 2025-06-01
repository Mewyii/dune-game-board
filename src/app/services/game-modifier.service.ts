import { Injectable } from '@angular/core';
import { cloneDeep, compact, flatten, isArray, sum } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { mergeObjects } from '../helpers/common';
import {
  ActionType,
  ActiveFactionType,
  EffectChoiceConversionOrReward,
  EffectReward,
  EffectRewardType,
  FactionType,
  ResourceType,
} from '../models';
import { Player } from '../models/player';

export interface GameModifier {
  id: string;
  currentRoundOnly?: boolean;
}

export interface FactionInfluenceModifier extends GameModifier {
  factionType: FactionType;
  noInfluence: boolean;
  alternateReward: EffectReward;
}

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

export interface FieldMarkerModifier extends GameModifier {
  fieldId: string;
  amount: number;
}

export type CustomGameActionType = 'charm' | 'vision-conflict' | 'vision-deck' | 'vision-intrigues' | 'field-marker';

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
  rewardType: EffectRewardType;
  amount: number;
}

export interface FieldBlockModifier extends GameModifier {
  fieldId?: string;
  actionType?: ActionType;
}

export interface CombatModifier extends GameModifier {
  combatMaxDeployableUnits?: number;
}

export interface GameModifiers {
  factionInfluence?: FactionInfluenceModifier[];
  imperiumRow?: ImperiumRowModifier[];
  techTiles?: TechTileModifier[];
  customActions?: CustomGameActionModifier[];
  fieldFactionAccess?: FieldFactionAccessModifier[];
  fieldEnemyAgentAccess?: FieldEnemyAgentsAccessModifier[];
  fieldMarkers?: FieldMarkerModifier[];
  fieldCost?: FieldCostsModifier[];
  fieldReward?: FieldRewardsModifier[];
  fieldBlock?: FieldBlockModifier[];
  combat?: CombatModifier;
}

export interface PlayerGameModifiers extends GameModifiers {
  playerId: number;
}

export type RewardWithModifier = EffectReward & {
  modifier?: 'positive' | 'negative';
};

export type EffectWithModifier = EffectChoiceConversionOrReward & {
  modifier?: 'positive' | 'negative';
};

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

  public getPlayerFieldMarkers(fieldId: string) {
    return this.playerGameModifiers
      .filter((x) => x.fieldMarkers)
      .map((x) => ({
        playerId: x.playerId,
        amount: sum(x.fieldMarkers?.filter((y) => y.fieldId === fieldId).map((y) => y.amount)),
      }))
      .filter((x) => x.amount > 0);
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

  public changeFieldMarkerModifier(playerId: number, fieldId: string, changeAmount = 1) {
    const playerGameModifiers = this.playerGameModifiers;
    const playerGameModifierIndex = playerGameModifiers.findIndex((x) => x.playerId === playerId);
    if (playerGameModifierIndex > -1) {
      const playerModifiers = playerGameModifiers[playerGameModifierIndex];
      const fieldHistoryModifiers = playerModifiers.fieldMarkers;
      if (fieldHistoryModifiers) {
        const currentFieldModifierIndex = fieldHistoryModifiers.findIndex((x) => x.fieldId === fieldId);
        if (currentFieldModifierIndex > -1) {
          const currentValue = fieldHistoryModifiers[currentFieldModifierIndex];
          fieldHistoryModifiers[currentFieldModifierIndex] = {
            ...currentValue,
            amount: currentValue.amount + changeAmount,
          };
        } else {
          fieldHistoryModifiers.push({ id: crypto.randomUUID(), fieldId: fieldId, amount: changeAmount });
        }
      } else {
        playerModifiers.fieldMarkers = [{ id: crypto.randomUUID(), fieldId: fieldId, amount: changeAmount }];
      }
    } else {
      playerGameModifiers.push({
        playerId,
        fieldMarkers: [{ id: crypto.randomUUID(), fieldId: fieldId, amount: changeAmount }],
      });
    }

    this.playerGameModifiersSubject.next(playerGameModifiers);
  }

  public removePlayerGameModifier(playerId: number, modifierType: keyof GameModifiers, modifierId: string) {
    const playerGameModifiers = this.playerGameModifiers;
    const playerGameModifierIndex = playerGameModifiers.findIndex((x) => x.playerId === playerId);
    if (playerGameModifierIndex > -1) {
      const playerModifiers = playerGameModifiers[playerGameModifierIndex];
      let modifier = playerModifiers[modifierType];
      if (isArray(modifier)) {
        playerModifiers[modifierType] = modifier.filter((x) => x.id !== modifierId) as any;
      }
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
        } else if (modifier) {
          if (modifier.currentRoundOnly) {
            modifiers[key] = undefined;
          }
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
