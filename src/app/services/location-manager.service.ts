import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, map } from 'rxjs';
import { DuneLocation } from '../models';
import { PlayersService } from './players.service';
import { SettingsService } from './settings.service';

export interface OwnedLocation {
  locationId: string;
  playerId: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  private locationsSubject = new BehaviorSubject<DuneLocation[]>([]);
  locations$ = this.locationsSubject.asObservable();

  private ownedLocationsSubject = new BehaviorSubject<OwnedLocation[]>([]);
  ownedLocations$ = this.ownedLocationsSubject.asObservable();

  constructor(
    private playersService: PlayersService,
    private settingsService: SettingsService,
  ) {
    const ownedLocationsString = localStorage.getItem('ownedLocations');
    if (ownedLocationsString) {
      const ownedLocations = JSON.parse(ownedLocationsString) as OwnedLocation[];
      this.ownedLocationsSubject.next(ownedLocations);
    }

    this.ownedLocations$.subscribe((ownedLocations) => {
      localStorage.setItem('ownedLocations', JSON.stringify(ownedLocations));
    });

    this.playersService.players$.subscribe((players) => {
      this.locationsSubject.next(
        this.settingsService.gameContent.locations
          .filter((x) => x.playerCount <= players.length)
          .flatMap((x) => x.locations),
      );
    });

    this.settingsService.gameContent$.subscribe((gameContent) => {
      this.locationsSubject.next(
        gameContent.locations
          .filter((x) => x.playerCount <= this.playersService.getPlayerCount())
          .flatMap((x) => x.locations),
      );
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

  locationOwnerId$(locationId: string) {
    return this.ownedLocations$.pipe(map((data) => data.find((x) => x.locationId === locationId)?.playerId));
  }

  setLocationOwner(locationId: string, playerId: number) {
    const ownedLocations = this.ownedLocations;
    const ownedLocationIndex = ownedLocations.findIndex((x) => x.locationId === locationId);
    if (ownedLocationIndex > -1) {
      const ownedLocation = ownedLocations[ownedLocationIndex];
      ownedLocations[ownedLocationIndex] = { ...ownedLocation, playerId };
    } else {
      ownedLocations.push({ locationId, playerId });
    }

    this.ownedLocationsSubject.next(ownedLocations);
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
