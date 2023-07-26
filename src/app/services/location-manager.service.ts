import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, map } from 'rxjs';

export interface OwnedLocation {
  locationId: string;
  playerId: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationManager {
  private ownedLocationsSubject = new BehaviorSubject<OwnedLocation[]>([]);
  public ownedLocations$ = this.ownedLocationsSubject.asObservable();

  constructor() {
    const ownedLocationsString = localStorage.getItem('ownedLocations');
    if (ownedLocationsString) {
      const ownedLocations = JSON.parse(ownedLocationsString) as OwnedLocation[];
      this.ownedLocationsSubject.next(ownedLocations);
    }

    this.ownedLocations$.subscribe((ownedLocations) => {
      localStorage.setItem('ownedLocations', JSON.stringify(ownedLocations));
    });
  }

  public get ownedLocations() {
    return cloneDeep(this.ownedLocationsSubject.value);
  }

  public locationOwnerId$(locationId: string) {
    return this.ownedLocations$.pipe(map((data) => data.find((x) => x.locationId === locationId)?.playerId));
  }

  public changeLocationOwner(locationId: string, playerId: number) {
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

  public resetLocationOwner(locationId: string) {
    const ownedLocations = this.ownedLocations;
    const ownedLocationIndex = ownedLocations.findIndex((x) => x.locationId === locationId);
    if (ownedLocationIndex > -1) {
      const ownedLocation = ownedLocations[ownedLocationIndex];
      ownedLocations.splice(ownedLocationIndex, 1);
    }

    this.ownedLocationsSubject.next(ownedLocations);
  }

  public resetLocationOwners() {
    this.ownedLocationsSubject.next([]);
  }
}
