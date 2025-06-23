import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Effect, StructuredChoiceEffect, StructuredEffects } from '../models';

export interface PlayerRewardChoice<T> {
  id: string;
  choice: T;
}

export interface PlayerRewardChoices {
  playerId: number;
  rewardChoices: PlayerRewardChoice<Effect>[];
  rewardsChoices: PlayerRewardChoice<Effect[]>[];
  effectChoices: StructuredEffects;
  customChoices: PlayerRewardChoice<string>[];
}

export type PlayerScoreType = keyof Omit<PlayerRewardChoices, 'playerId'>;

export type PlayerFactionScoreType = keyof Omit<PlayerRewardChoices, 'playerId' | 'victoryPoints'>;

@Injectable({
  providedIn: 'root',
})
export class PlayerRewardChoicesService {
  private playerRewardChoicesSubject = new BehaviorSubject<PlayerRewardChoices[]>([]);
  public playerRewardChoices$ = this.playerRewardChoicesSubject.asObservable();

  constructor() {
    const playerRewardChoicesString = localStorage.getItem('playerRewardChoices');
    if (playerRewardChoicesString) {
      const playerRewardChoices = JSON.parse(playerRewardChoicesString) as PlayerRewardChoices[];
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }

    this.playerRewardChoices$.subscribe((playerRewardChoices) => {
      localStorage.setItem('playerRewardChoices', JSON.stringify(playerRewardChoices));
    });
  }

  public get playerRewardChoices() {
    return cloneDeep(this.playerRewardChoicesSubject.value);
  }

  public resetPlayerRewardChoices() {
    this.playerRewardChoicesSubject.next([]);
  }

  public addPlayerRewardChoice(playerId: number, reward: Effect) {
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

  public addPlayerRewardsChoice(playerId: number, rewards: Effect[]) {
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

  public addPlayerCustomChoice(playerId: number, customChoice: string) {
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

  public addPlayerConversionChoice(playerId: number, conversionChoice: StructuredChoiceEffect) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].effectChoices.choiceEffects.push(conversionChoice);
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    } else {
      const newPlayerRewardChoices = this.getInitialPlayerRewardChoices(playerId);
      newPlayerRewardChoices.effectChoices.choiceEffects.push(conversionChoice);
      playerRewardChoices.push(newPlayerRewardChoices);

      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  public removePlayerRewardChoice(playerId: number, id: string) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].rewardChoices = playerRewardChoices[index].rewardChoices.filter((x) => x.id !== id);
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  public removePlayerRewardsChoice(playerId: number, id: string) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].rewardsChoices = playerRewardChoices[index].rewardsChoices.filter((x) => x.id !== id);
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  public removePlayerCustomChoice(playerId: number, id: string) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].customChoices = playerRewardChoices[index].customChoices.filter((x) => x.id !== id);
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  public removePlayerConversionChoice(playerId: number, index: number) {
    const playerRewardChoices = this.playerRewardChoices;

    playerRewardChoices[index].effectChoices.choiceEffects = playerRewardChoices[index].effectChoices.choiceEffects.filter(
      (x, idx) => idx !== index
    );
    this.playerRewardChoicesSubject.next(playerRewardChoices);
  }

  public getInitialPlayerRewardChoices(playerId: number): PlayerRewardChoices {
    return {
      playerId,
      rewardChoices: [],
      rewardsChoices: [],
      customChoices: [],
      effectChoices: {
        timingEffects: [],
        conditionalEffects: [],
        choiceEffects: [],
        conversionEffects: [],
        multiplierEffects: [],
        rewards: [],
      },
    };
  }
}
