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

  private occupiedLocationsSubject = new BehaviorSubject<OwnedLocation[]>([]);
  public occupiedLocations$ = this.occupiedLocationsSubject.asObservable();

  constructor() {
    const ownedLocationsString = localStorage.getItem('ownedLocations');
    if (ownedLocationsString) {
      const ownedLocations = JSON.parse(ownedLocationsString) as OwnedLocation[];
      this.ownedLocationsSubject.next(ownedLocations);
    }

    this.ownedLocations$.subscribe((ownedLocations) => {
      localStorage.setItem('ownedLocations', JSON.stringify(ownedLocations));
    });

    const occupiedLocationsString = localStorage.getItem('occupiedLocations');
    if (occupiedLocationsString) {
      const occupiedLocations = JSON.parse(occupiedLocationsString) as OwnedLocation[];
      this.occupiedLocationsSubject.next(occupiedLocations);
    }

    this.occupiedLocations$.subscribe((occupiedLocations) => {
      localStorage.setItem('occupiedLocations', JSON.stringify(occupiedLocations));
    });
  }

  public get ownedLocations() {
    return cloneDeep(this.ownedLocationsSubject.value);
  }

  public get occupiedLocations() {
    return cloneDeep(this.occupiedLocationsSubject.value);
  }

  public getPlayerLocations(playerId: number) {
    const nonOccupiedOwnedLocations = this.ownedLocations.filter(
      (x) => x.playerId === playerId && !this.occupiedLocations.some((y) => x.locationId === y.locationId)
    );
    return [...nonOccupiedOwnedLocations, ...this.occupiedLocations.filter((x) => x.playerId === playerId)];
  }

  public getPlayerOccupiedLocations(playerId: number) {
    return this.occupiedLocations.filter((x) => x.playerId === playerId);
  }

  public locationOwnerId$(locationId: string) {
    return this.ownedLocations$.pipe(map((data) => data.find((x) => x.locationId === locationId)?.playerId));
  }

  public locationOccupierId$(locationId: string) {
    return this.occupiedLocations$.pipe(map((data) => data.find((x) => x.locationId === locationId)?.playerId));
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
      ownedLocations.splice(ownedLocationIndex, 1);
    }

    this.ownedLocationsSubject.next(ownedLocations);
  }

  public resetLocationOwners() {
    this.ownedLocationsSubject.next([]);
  }

  public changeLocationOccupier(locationId: string, playerId: number) {
    const occupiedLocations = this.occupiedLocations;
    const occupiedLocationIndex = occupiedLocations.findIndex((x) => x.locationId === locationId);
    if (occupiedLocationIndex > -1) {
      const occupiedLocation = occupiedLocations[occupiedLocationIndex];
      occupiedLocations[occupiedLocationIndex] = { ...occupiedLocation, playerId };
    } else {
      occupiedLocations.push({ locationId, playerId });
    }

    this.occupiedLocationsSubject.next(occupiedLocations);
  }

  public resetLocationOccupier(locationId: string) {
    const occupiedLocations = this.occupiedLocations;
    const occupiedLocationIndex = occupiedLocations.findIndex((x) => x.locationId === locationId);
    if (occupiedLocationIndex > -1) {
      occupiedLocations.splice(occupiedLocationIndex, 1);
    }

    this.occupiedLocationsSubject.next(occupiedLocations);
  }

  public resetLocationOccupiers() {
    this.occupiedLocationsSubject.next([]);
  }
}
