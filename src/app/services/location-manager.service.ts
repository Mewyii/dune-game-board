import { inject, Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { DuneLocation } from '../models';
import { PlayersService } from './players.service';
import { SettingsService } from './settings.service';
import { GameStatePersistenceService } from './persistence/game-state-persistence.service';

export interface OwnedLocation {
  locationId: string;
  playerId: number;
  isShielded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  private gameStatePersistenceService = inject(GameStatePersistenceService);
  private playersService = inject(PlayersService);
  private settingsService = inject(SettingsService);

  private locationsSubject = new BehaviorSubject<DuneLocation[]>([]);
  locations$ = this.locationsSubject.asObservable();

  private ownedLocationsSubject = new BehaviorSubject<OwnedLocation[]>([]);
  ownedLocations$ = this.ownedLocationsSubject.asObservable();

  constructor() {
    this.gameStatePersistenceService.bindSubjectToStorage('ownedLocations', this.ownedLocationsSubject, { scope: 'game' });

    this.playersService.players$.subscribe((players) => {
      this.locationsSubject.next(this.settingsService.gameContent.locations);
    });

    this.settingsService.gameContent$.subscribe((gameContent) => {
      this.locationsSubject.next(gameContent.locations);
    });
  }

  get locations() {
    return cloneDeep(this.locationsSubject.value);
  }

  get ownedLocations() {
    return cloneDeep(this.ownedLocationsSubject.value);
  }

  getLocation(locationId: string) {
    return this.locations.find((x) => x.actionField.title.en === locationId);
  }

  getPlayerLocations(playerId: number) {
    return this.ownedLocations.filter((x) => x.playerId === playerId);
  }

  getPlayerLocation(locationId: string) {
    return this.ownedLocations.find((x) => x.locationId === locationId);
  }

  getEnemyLocations(playerId: number) {
    return this.ownedLocations.filter((x) => x.playerId !== playerId);
  }

  locationOwner$(locationId: string) {
    return this.ownedLocations$.pipe(
      map((data) => data.find((x) => x.locationId === locationId)),
      distinctUntilChanged(),
    );
  }

  setLocationOwner(locationId: string, playerId: number) {
    const ownedLocations = this.ownedLocations;
    const ownedLocationIndex = ownedLocations.findIndex((x) => x.locationId === locationId);
    if (ownedLocationIndex > -1) {
      const ownedLocation = ownedLocations[ownedLocationIndex];
      ownedLocations[ownedLocationIndex] = { ...ownedLocation, playerId };
    } else {
      ownedLocations.push({ locationId, playerId, isShielded: false });
    }

    this.ownedLocationsSubject.next(ownedLocations);
  }

  setLocationIsShielded(locationId: string) {
    const ownedLocations = this.ownedLocations;
    const ownedLocationIndex = ownedLocations.findIndex((x) => x.locationId === locationId);
    if (ownedLocationIndex > -1) {
      const ownedLocation = ownedLocations[ownedLocationIndex];
      ownedLocations[ownedLocationIndex] = { ...ownedLocation, isShielded: true };
      this.ownedLocationsSubject.next(ownedLocations);
    }
  }

  resetLocationOwner(locationId: string) {
    const ownedLocations = this.ownedLocations;
    const ownedLocationIndex = ownedLocations.findIndex((x) => x.locationId === locationId);
    if (ownedLocationIndex > -1) {
      ownedLocations.splice(ownedLocationIndex, 1);
    }

    this.ownedLocationsSubject.next(ownedLocations);
  }

  resetLocationOwners() {
    this.ownedLocationsSubject.next([]);
  }
}
