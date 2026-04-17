import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Effect, EffectRewardType, EffectType, StructuredChoiceEffect, StructuredEffect } from '../models';

export interface PlayerRewardChoice<T> {
  id: string;
  choice: T;
}

export interface PlayerRewardChoices {
  playerId: number;
  rewardChoices: PlayerRewardChoice<Effect>[];
  rewardsChoices: PlayerRewardChoice<Effect[]>[];
  effectChoices: StructuredEffect[];
  customChoices: PlayerRewardChoice<string>[];
  conflictChoice: PlayerRewardChoice<boolean> | undefined;
}

export type PlayerScoreType = keyof Omit<PlayerRewardChoices, 'playerId'>;

export type PlayerFactionScoreType = keyof Omit<PlayerRewardChoices, 'playerId' | 'victoryPoints'>;

interface ImmediateEffect {
  id: string;
  playerId: number;
  choice: EffectType | 'conflict-pick';
}

@Injectable({
  providedIn: 'root',
})
export class PlayerRewardChoicesService {
  private playerRewardChoicesSubject = new BehaviorSubject<PlayerRewardChoices[]>([]);
  playerRewardChoices$ = this.playerRewardChoicesSubject.asObservable();

  immediateEffectStackSubject = new BehaviorSubject<ImmediateEffect[]>([]);
  immediateEffectStack$ = this.immediateEffectStackSubject.asObservable();

  immediateEffects: EffectType[] = [
    'card-discard',
    'intrigue-trash',
    'faction-influence-up-choice',
    'faction-influence-up-twice-choice',
    'faction-influence-down-choice',
  ];

  constructor() {
    const playerRewardChoicesString = localStorage.getItem('playerRewardChoices');
    if (playerRewardChoicesString) {
      const playerRewardChoices = JSON.parse(playerRewardChoicesString) as PlayerRewardChoices[];
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }

    this.playerRewardChoices$.subscribe((playerRewardChoices) => {
      localStorage.setItem('playerRewardChoices', JSON.stringify(playerRewardChoices));

      const immediateEffectStack: ImmediateEffect[] = playerRewardChoices.flatMap((x) => {
        return x.rewardChoices
          .filter((x) => this.immediateEffects.includes(x.choice.type))
          .map((y) => ({ id: y.id, playerId: x.playerId, choice: y.choice.type }));
      });
      const conflictRewardChoice = playerRewardChoices.find((x) => x.conflictChoice?.choice);
      if (conflictRewardChoice && conflictRewardChoice.conflictChoice) {
        immediateEffectStack.push({
          id: conflictRewardChoice.conflictChoice.id,
          playerId: conflictRewardChoice.playerId,
          choice: 'conflict-pick',
        });
      }
      for (const immediateEffect of immediateEffectStack) {
        if (!this.immediateEffectStackSubject.value.some((x) => x.id === immediateEffect.id)) {
          this.immediateEffectStackSubject.next([...this.immediateEffectStackSubject.value, immediateEffect]);
        }
      }
    });
  }

  get playerRewardChoices() {
    return cloneDeep(this.playerRewardChoicesSubject.value);
  }

  resetPlayerRewardChoices() {
    this.playerRewardChoicesSubject.next([]);
  }

  getPlayerRewardChoices(playerId: number) {
    return cloneDeep(this.playerRewardChoicesSubject.value.find((x) => x.playerId === playerId));
  }

  addPlayerRewardChoice(playerId: number, reward: Effect) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].rewardChoices.push({ id: crypto.randomUUID(), choice: reward });
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    } else {
      const newPlayerRewardChoices = this.getInitialPlayerRewardChoices(playerId);
      newPlayerRewardChoices.rewardChoices.push({ id: crypto.randomUUID(), choice: reward });
      playerRewardChoices.push(newPlayerRewardChoices);

      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  addPlayerRewardsChoice(playerId: number, rewards: Effect[]) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].rewardsChoices.push({ id: crypto.randomUUID(), choice: rewards });
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    } else {
      const newPlayerRewardChoices = this.getInitialPlayerRewardChoices(playerId);
      newPlayerRewardChoices.rewardsChoices.push({ id: crypto.randomUUID(), choice: rewards });
      playerRewardChoices.push(newPlayerRewardChoices);

      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  addPlayerCustomChoice(playerId: number, customChoice: string) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].customChoices.push({ id: crypto.randomUUID(), choice: customChoice });
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    } else {
      const newPlayerRewardChoices = this.getInitialPlayerRewardChoices(playerId);
      newPlayerRewardChoices.customChoices.push({ id: crypto.randomUUID(), choice: customChoice });
      playerRewardChoices.push(newPlayerRewardChoices);

      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  addPlayerConversionChoice(playerId: number, conversionChoice: StructuredChoiceEffect) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].effectChoices.push(conversionChoice);
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    } else {
      const newPlayerRewardChoices = this.getInitialPlayerRewardChoices(playerId);
      newPlayerRewardChoices.effectChoices.push(conversionChoice);
      playerRewardChoices.push(newPlayerRewardChoices);

      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  setPlayerConflictChoice(playerId: number, choice: boolean) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].conflictChoice = { id: crypto.randomUUID(), choice };
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    } else {
      const newPlayerRewardChoices = this.getInitialPlayerRewardChoices(playerId);
      newPlayerRewardChoices.conflictChoice = { id: crypto.randomUUID(), choice };
      playerRewardChoices.push(newPlayerRewardChoices);

      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  removePlayerRewardChoice(playerId: number, id: string) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].rewardChoices = playerRewardChoices[index].rewardChoices.filter((x) => x.id !== id);
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  removePlayerRewardsChoice(playerId: number, id: string) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].rewardsChoices = playerRewardChoices[index].rewardsChoices.filter((x) => x.id !== id);
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  removePlayerCustomChoice(playerId: number, id: string) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].customChoices = playerRewardChoices[index].customChoices.filter((x) => x.id !== id);
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  removePlayerConversionChoice(playerId: number, index: number) {
    const playerRewardChoices = this.playerRewardChoices;

    playerRewardChoices[index].effectChoices = playerRewardChoices[index].effectChoices.filter((x, idx) => idx !== index);
    this.playerRewardChoicesSubject.next(playerRewardChoices);
  }

  removePlayerConflictChoice(playerId: number) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].conflictChoice = undefined;
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  removeImmediateEffect(id: string) {
    this.immediateEffectStackSubject.next(this.immediateEffectStackSubject.value.filter((x) => x.id !== id));
  }

  getPlayerRewardChoice(playerId: number, rewardType: EffectRewardType) {
    const playerRewardChoices = this.playerRewardChoices;

    const playerRewardChoice = playerRewardChoices.find((x) => x.playerId === playerId);

    if (playerRewardChoice) {
      return playerRewardChoice.rewardChoices.find((x) => x.choice.type === rewardType);
    } else {
      return undefined;
    }
  }

  getInitialPlayerRewardChoices(playerId: number): PlayerRewardChoices {
    return {
      playerId,
      rewardChoices: [],
      rewardsChoices: [],
      customChoices: [],
      effectChoices: [],
      conflictChoice: undefined,
    };
  }
}
