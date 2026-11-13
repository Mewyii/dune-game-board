import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { Effect, EffectRewardType, EffectType } from '../models';
import { StructuredChoiceEffectWithGameElement, StructuredConversionEffectWithGameElement } from '../models/turn-info';

export interface PlayerRewardChoice<T> {
  id: string;
  choice: T;
}

export interface PlayerRewardChoices {
  playerId: number;
  rewardChoices: PlayerRewardChoice<Effect>[];
  rewardsChoices: PlayerRewardChoice<Effect[]>[];
  conversionEffectChoices: PlayerRewardChoice<StructuredConversionEffectWithGameElement>[];
  eitherOrEffectChoices: PlayerRewardChoice<StructuredChoiceEffectWithGameElement>[];
  customChoices: PlayerRewardChoice<string>[];
  conflictChoice: PlayerRewardChoice<boolean> | undefined;
}

export type PlayerScoreType = keyof Omit<PlayerRewardChoices, 'playerId'>;

export type PlayerFactionScoreType = keyof Omit<PlayerRewardChoices, 'playerId' | 'victoryPoints'>;

export interface ImmediateEffect {
  id: string;
  playerId: number;
  choice: EffectType | 'conflict-pick';
}

@Injectable({
  providedIn: 'root',
})
export class PlayerRewardChoicesService {
  private playersRewardChoicesSubject = new BehaviorSubject<PlayerRewardChoices[]>([]);
  playersRewardChoices$ = this.playersRewardChoicesSubject.asObservable();

  private playersRewardChoicesNeedingProcessingSubject = new BehaviorSubject<Map<number, string[]>>(
    new Map<number, string[]>(),
  );
  playersRewardChoicesNeedingProcessing$ = this.playersRewardChoicesNeedingProcessingSubject.asObservable();
  playerRewardChoicesNeedingProcessing$ = (playerId: number) =>
    this.playersRewardChoicesNeedingProcessing$.pipe(
      map((x) => x.get(playerId)),
      distinctUntilChanged(),
    );

  private playersRewardChoicesBeingProcessedSubject = new BehaviorSubject<Map<number, boolean>>(new Map<number, boolean>());
  playersRewardChoicesBeingProcessed$ = this.playersRewardChoicesBeingProcessedSubject.asObservable();

  constructor() {
    const playerRewardChoicesString = localStorage.getItem('playerRewardChoices');
    if (playerRewardChoicesString) {
      const playerRewardChoices = JSON.parse(playerRewardChoicesString) as PlayerRewardChoices[];
      this.playersRewardChoicesSubject.next(playerRewardChoices);
    }

    this.playersRewardChoices$.subscribe((playerRewardChoices) => {
      localStorage.setItem('playerRewardChoices', JSON.stringify(playerRewardChoices));
    });

    const playerRewardChoicesNeedingProcessingString = localStorage.getItem('playerRewardChoicesNeedingProcessing');
    if (playerRewardChoicesNeedingProcessingString) {
      const playerRewardChoicesNeedingProcessing: [number, string[]][] = JSON.parse(
        playerRewardChoicesNeedingProcessingString,
      );
      this.playersRewardChoicesNeedingProcessingSubject.next(
        new Map<number, string[]>(playerRewardChoicesNeedingProcessing),
      );
    }

    this.playersRewardChoicesNeedingProcessing$.subscribe((playerRewardChoicesNeedingProcessing) => {
      localStorage.setItem(
        'playerRewardChoicesNeedingProcessing',
        JSON.stringify(Array.from(playerRewardChoicesNeedingProcessing.entries())),
      );
    });
  }

  get playersRewardChoices() {
    return cloneDeep(this.playersRewardChoicesSubject.value);
  }

  get playersRewardChoicesBeingProcessed() {
    return cloneDeep(this.playersRewardChoicesBeingProcessedSubject.value);
  }

  get playersRewardChoicesNeedingProcessing() {
    return cloneDeep(this.playersRewardChoicesNeedingProcessingSubject.value);
  }

  resetPlayerRewardChoices() {
    this.playersRewardChoicesSubject.next([]);
  }

  getPlayerRewardChoices(playerId: number) {
    return cloneDeep(this.playersRewardChoicesSubject.value.find((x) => x.playerId === playerId));
  }

  getPlayerRewardChoicesBeingProcessed(playerId: number) {
    return cloneDeep(this.playersRewardChoicesBeingProcessedSubject.value.get(playerId)) ?? false;
  }

  addPlayerRewardChoice(playerId: number, reward: Effect) {
    const playerRewardChoices = this.playersRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);
    const id = crypto.randomUUID();

    if (index > -1) {
      playerRewardChoices[index].rewardChoices.push({ id: id, choice: reward });
      this.playersRewardChoicesSubject.next(playerRewardChoices);
    } else {
      const newPlayerRewardChoices = this.getInitialPlayerRewardChoices(playerId);
      newPlayerRewardChoices.rewardChoices.push({ id: id, choice: reward });
      playerRewardChoices.push(newPlayerRewardChoices);

      this.playersRewardChoicesSubject.next(playerRewardChoices);
    }

    this.addPlayerChoiceNeedsProcessing(playerId, id);
  }

  addPlayerRewardsChoice(playerId: number, rewards: Effect[]) {
    const playerRewardChoices = this.playersRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);
    const id = crypto.randomUUID();

    if (index > -1) {
      playerRewardChoices[index].rewardsChoices.push({ id: id, choice: rewards });
      this.playersRewardChoicesSubject.next(playerRewardChoices);
    } else {
      const newPlayerRewardChoices = this.getInitialPlayerRewardChoices(playerId);
      newPlayerRewardChoices.rewardsChoices.push({ id: id, choice: rewards });
      playerRewardChoices.push(newPlayerRewardChoices);

      this.playersRewardChoicesSubject.next(playerRewardChoices);
    }

    this.addPlayerChoiceNeedsProcessing(playerId, id);
  }

  addPlayerCustomChoice(playerId: number, customChoice: string) {
    const playerRewardChoices = this.playersRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);
    const id = crypto.randomUUID();

    if (index > -1) {
      playerRewardChoices[index].customChoices.push({ id: id, choice: customChoice });
      this.playersRewardChoicesSubject.next(playerRewardChoices);
    } else {
      const newPlayerRewardChoices = this.getInitialPlayerRewardChoices(playerId);
      newPlayerRewardChoices.customChoices.push({ id: id, choice: customChoice });
      playerRewardChoices.push(newPlayerRewardChoices);

      this.playersRewardChoicesSubject.next(playerRewardChoices);
    }

    this.addPlayerChoiceNeedsProcessing(playerId, id);
  }

  addPlayerConversionChoice(playerId: number, conversionChoice: StructuredConversionEffectWithGameElement) {
    const playerRewardChoices = this.playersRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);
    const id = crypto.randomUUID();

    if (index > -1) {
      playerRewardChoices[index].conversionEffectChoices.push({ id: id, choice: conversionChoice });
      this.playersRewardChoicesSubject.next(playerRewardChoices);
    } else {
      const newPlayerRewardChoices = this.getInitialPlayerRewardChoices(playerId);
      newPlayerRewardChoices.conversionEffectChoices.push({ id: id, choice: conversionChoice });
      playerRewardChoices.push(newPlayerRewardChoices);

      this.playersRewardChoicesSubject.next(playerRewardChoices);
    }

    this.addPlayerChoiceNeedsProcessing(playerId, id);
  }

  addPlayerEitherOrChoice(playerId: number, choiceCoice: StructuredChoiceEffectWithGameElement) {
    const playerRewardChoices = this.playersRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);
    const id = crypto.randomUUID();

    if (index > -1) {
      playerRewardChoices[index].eitherOrEffectChoices.push({ id: id, choice: choiceCoice });
      this.playersRewardChoicesSubject.next(playerRewardChoices);
    } else {
      const newPlayerRewardChoices = this.getInitialPlayerRewardChoices(playerId);
      newPlayerRewardChoices.eitherOrEffectChoices.push({ id: id, choice: choiceCoice });
      playerRewardChoices.push(newPlayerRewardChoices);

      this.playersRewardChoicesSubject.next(playerRewardChoices);
    }

    this.addPlayerChoiceNeedsProcessing(playerId, id);
  }

  setPlayerConflictChoice(playerId: number, choice: boolean) {
    const playerRewardChoices = this.playersRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);
    const id = crypto.randomUUID();

    if (index > -1) {
      playerRewardChoices[index].conflictChoice = { id: id, choice };
      this.playersRewardChoicesSubject.next(playerRewardChoices);
    } else {
      const newPlayerRewardChoices = this.getInitialPlayerRewardChoices(playerId);
      newPlayerRewardChoices.conflictChoice = { id: id, choice };
      playerRewardChoices.push(newPlayerRewardChoices);

      this.playersRewardChoicesSubject.next(playerRewardChoices);
    }

    this.addPlayerChoiceNeedsProcessing(playerId, id);
  }

  removePlayerRewardChoice(playerId: number, id: string) {
    const playerRewardChoices = this.playersRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].rewardChoices = playerRewardChoices[index].rewardChoices.filter((x) => x.id !== id);
      this.playersRewardChoicesSubject.next(playerRewardChoices);
      this.removePlayerChoiceNeedsProcessing(playerId, id);
    }
  }

  removePlayerRewardsChoice(playerId: number, id: string) {
    const playerRewardChoices = this.playersRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].rewardsChoices = playerRewardChoices[index].rewardsChoices.filter((x) => x.id !== id);
      this.playersRewardChoicesSubject.next(playerRewardChoices);
      this.removePlayerChoiceNeedsProcessing(playerId, id);
    }
  }

  removePlayerCustomChoice(playerId: number, id: string) {
    const playerRewardChoices = this.playersRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].customChoices = playerRewardChoices[index].customChoices.filter((x) => x.id !== id);
      this.playersRewardChoicesSubject.next(playerRewardChoices);
      this.removePlayerChoiceNeedsProcessing(playerId, id);
    }
  }

  removePlayerConversionChoice(playerId: number, id: string, exlusiveChoiceOfMultipleEffectsId?: string) {
    const playerRewardChoices = this.playersRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].conversionEffectChoices = playerRewardChoices[index].conversionEffectChoices.filter(
        (x) =>
          x.id !== id &&
          (exlusiveChoiceOfMultipleEffectsId
            ? x.choice.exlusiveChoiceOfMultipleEffectsId !== exlusiveChoiceOfMultipleEffectsId
            : true),
      );
      this.playersRewardChoicesSubject.next(playerRewardChoices);
      this.removePlayerChoiceNeedsProcessing(playerId, id);
    }
  }

  removePlayerEitherOrChoice(playerId: number, id: string, exlusiveChoiceOfMultipleEffectsId?: string) {
    const playerRewardChoices = this.playersRewardChoices;

    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].eitherOrEffectChoices = playerRewardChoices[index].eitherOrEffectChoices.filter(
        (x) =>
          x.id !== id &&
          (exlusiveChoiceOfMultipleEffectsId
            ? x.choice.exlusiveChoiceOfMultipleEffectsId !== exlusiveChoiceOfMultipleEffectsId
            : true),
      );
      this.playersRewardChoicesSubject.next(playerRewardChoices);
      this.removePlayerChoiceNeedsProcessing(playerId, id);
    }
  }

  removePlayerConflictChoice(playerId: number, id: string) {
    const playerRewardChoices = this.playersRewardChoices;
    const index = playerRewardChoices.findIndex((x) => x.playerId === playerId);

    if (index > -1) {
      playerRewardChoices[index].conflictChoice = undefined;
      this.playersRewardChoicesSubject.next(playerRewardChoices);
      this.removePlayerChoiceNeedsProcessing(playerId, id);
    }
  }

  getPlayerRewardChoice(playerId: number, rewardType: EffectRewardType) {
    const playerRewardChoices = this.playersRewardChoices;
    const playerRewardChoice = playerRewardChoices.find((x) => x.playerId === playerId);

    if (playerRewardChoice) {
      return playerRewardChoice.rewardChoices.find((x) => x.choice.type === rewardType);
    } else {
      return undefined;
    }
  }

  setPlayerRewardChoiceProcessing(playerId: number, processing: boolean) {
    const playerRewardChoicesBeingProcessed = this.playersRewardChoicesBeingProcessed;
    playerRewardChoicesBeingProcessed.set(playerId, processing);

    this.playersRewardChoicesBeingProcessedSubject.next(playerRewardChoicesBeingProcessed);
  }

  private addPlayerChoiceNeedsProcessing(playerId: number, id: string) {
    const playersRewardChoicesNeedingProcessing = this.playersRewardChoicesNeedingProcessing;
    const playerEntry = playersRewardChoicesNeedingProcessing.get(playerId);

    if (playerEntry) {
      playersRewardChoicesNeedingProcessing.set(playerId, [...playerEntry, id]);
    } else {
      playersRewardChoicesNeedingProcessing.set(playerId, [id]);
    }

    this.playersRewardChoicesNeedingProcessingSubject.next(playersRewardChoicesNeedingProcessing);
  }

  private removePlayerChoiceNeedsProcessing(playerId: number, id: string) {
    const playersRewardChoicesNeedingProcessing = this.playersRewardChoicesNeedingProcessing;
    const playerEntry = playersRewardChoicesNeedingProcessing.get(playerId);
    if (playerEntry) {
      playersRewardChoicesNeedingProcessing.set(
        playerId,
        playerEntry.filter((x) => x !== id),
      );
      this.playersRewardChoicesNeedingProcessingSubject.next(playersRewardChoicesNeedingProcessing);
    }
  }

  private getInitialPlayerRewardChoices(playerId: number): PlayerRewardChoices {
    return {
      playerId,
      rewardChoices: [],
      rewardsChoices: [],
      customChoices: [],
      conversionEffectChoices: [],
      eitherOrEffectChoices: [],
      conflictChoice: undefined,
    };
  }
}
