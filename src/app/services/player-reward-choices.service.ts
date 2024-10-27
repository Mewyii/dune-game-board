import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Reward } from '../models';

export interface PlayerRewardChoice<T> {
  id: string;
  choice: T;
}

export interface PlayerRewardChoices {
  playerId: number;
  rewardChoices: PlayerRewardChoice<Reward>[];
  rewardsChoices: PlayerRewardChoice<Reward[]>[];
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

  public addPlayerRewardChoice(playerId: number, reward: Reward) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].rewardChoices.push({ id: crypto.randomUUID(), choice: reward });
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    } else {
      playerRewardChoices.push({
        playerId,
        rewardChoices: [{ id: crypto.randomUUID(), choice: reward }],
        rewardsChoices: [],
        customChoices: [],
      });
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    }
  }

  public addPlayerRewardsChoice(playerId: number, rewards: Reward[]) {
    const playerRewardChoices = this.playerRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].rewardsChoices.push({ id: crypto.randomUUID(), choice: rewards });
      this.playerRewardChoicesSubject.next(playerRewardChoices);
    } else {
      playerRewardChoices.push({
        playerId,
        rewardChoices: [],
        rewardsChoices: [{ id: crypto.randomUUID(), choice: rewards }],
        customChoices: [],
      });
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
      playerRewardChoices.push({
        playerId,
        rewardChoices: [],
        rewardsChoices: [],
        customChoices: [{ id: crypto.randomUUID(), choice: customChoice }],
      });
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
}
