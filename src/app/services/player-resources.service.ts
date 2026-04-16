import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { ResourceType } from '../models';
import { Player } from '../models/player';
import { SettingsService } from './settings.service';

export type Resources = {
  [key in ResourceType]: number;
};

export interface PlayerResources {
  playerId: number;
  resources: Resources;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerResourcesService {
  private playersResourcesSubject = new BehaviorSubject<PlayerResources[]>([]);
  playersResources$ = this.playersResourcesSubject.asObservable();
  playerResources$ = (playerId: number) =>
    this.playersResources$.pipe(
      map((x) => x.find((resources) => resources.playerId === playerId)?.resources),
      distinctUntilChanged(),
    );

  constructor(private settingsService: SettingsService) {
    const playersResourcesString = localStorage.getItem('playerResources');
    if (playersResourcesString) {
      const playersResources = JSON.parse(playersResourcesString) as PlayerResources[];
      this.playersResourcesSubject.next(playersResources);
    }

    this.playersResources$.subscribe((playersResources) => {
      localStorage.setItem('playerResources', JSON.stringify(playersResources));
    });
  }

  getPlayersResources() {
    return cloneDeep(this.playersResourcesSubject.value);
  }

  getPlayerResources(playerId: number) {
    const resources = this.playersResourcesSubject.value.find((x) => x.playerId === playerId)?.resources;
    return resources ? cloneDeep(resources) : this.getInitialPlayerResources();
  }

  getPlayerResourceAmount(playerId: number, type: ResourceType) {
    const playerResources = this.playersResourcesSubject.value.find((x) => x.playerId === playerId);
    return playerResources ? playerResources.resources[type] : 0;
  }

  resetPlayerResources(players: Player[]) {
    const newPlayersResources = players.map((player) => ({
      playerId: player.id,
      resources: this.getInitialPlayerResources(),
    }));

    this.playersResourcesSubject.next(newPlayersResources);
  }

  addResourceToPlayer(id: number, type: ResourceType, amount: number, valuesCanGetNegative?: boolean) {
    const playersResources = this.getPlayersResources();

    const playerResources = playersResources.find((x) => x.playerId === id);
    if (playerResources) {
      const currentAmount = playerResources.resources[type] || 0;
      const newAmount = currentAmount + amount;
      if (valuesCanGetNegative || newAmount >= 0) {
        playerResources.resources[type] = newAmount;
        this.playersResourcesSubject.next(playersResources);
      }
    }
  }

  removeResourceFromPlayer(id: number, type: ResourceType, amount: number, valuesCanGetNegative?: boolean) {
    this.addResourceToPlayer(id, type, -amount, valuesCanGetNegative);
  }

  getInitialPlayerResources() {
    const initialResources: Resources = {
      water: 0,
      spice: 0,
      solari: 0,
      tech: 0,
      focus: 0,
      signet: 0,
      'leader-heal': 0,
    };
    return initialResources;
  }
}
