import { inject, Injectable } from '@angular/core';
import { cloneDeep, shuffle } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { House, minorHouses } from '../constants/minor-houses';
import { GameStatePersistenceService } from './persistence/game-state-persistence.service';

export interface PlayerHouse {
  playerId: number;
  houseId: string;
  level: number;
}

@Injectable({
  providedIn: 'root',
})
export class MinorHousesService {
  private gameStatePersistenceService = inject(GameStatePersistenceService);

  houses = minorHouses;

  private currentAvailableHousesSubject = new BehaviorSubject<House[]>([]);
  currentAvailableHouses$ = this.currentAvailableHousesSubject.asObservable();

  private playerHousesSubject = new BehaviorSubject<PlayerHouse[]>([]);
  playerHouses$ = this.playerHousesSubject.asObservable();

  maxHouseLevel = 2;

  constructor() {
    this.gameStatePersistenceService.bindSubjectToStorage('currentAvailableHouses', this.currentAvailableHousesSubject, {
      scope: 'game',
    });

    this.gameStatePersistenceService.bindSubjectToStorage('playerHouses', this.playerHousesSubject, { scope: 'game' });
  }

  get currentAvailableHouses() {
    return cloneDeep(this.currentAvailableHousesSubject.value);
  }

  get playerHouses() {
    return cloneDeep(this.playerHousesSubject.value);
  }

  setInitialAvailableHouses() {
    this.playerHousesSubject.next([]);
    this.currentAvailableHousesSubject.next(shuffle(this.houses).slice(0, 3));
  }

  resetAvailableHouses() {
    this.currentAvailableHousesSubject.next([]);
    this.playerHousesSubject.next([]);
  }

  getPlayerHouses(playerId: number) {
    const playerHouses = this.playerHouses.filter((x) => x.playerId === playerId).map((x) => x.houseId);
    return this.houses.filter((x) => playerHouses.includes(x.name.en));
  }

  setPlayerHouse(playerId: number, houseId: string) {
    const houseIndex = this.currentAvailableHouses.findIndex((x) => x.name.en === houseId);
    const filteredAvailableHouses = this.currentAvailableHouses.filter((x) => x.name.en !== houseId);
    const filteredAvailableHouseIds = filteredAvailableHouses.map((y) => y.name.en);

    const newTakenHouses = [...this.playerHouses, { playerId, houseId, level: 0 }];

    const availableHouses = this.houses.filter(
      (x) => !newTakenHouses.some((y) => y.houseId === x.name.en) && !filteredAvailableHouseIds.includes(x.name.en),
    );

    const newAvailableHouse = shuffle(availableHouses).pop();

    if (houseIndex > -1 && newAvailableHouse) {
      const newAvailableHouses = this.currentAvailableHouses;
      newAvailableHouses[houseIndex] = newAvailableHouse;

      this.playerHousesSubject.next(newTakenHouses);
      this.currentAvailableHousesSubject.next(newAvailableHouses);
    } else {
      this.playerHousesSubject.next(newTakenHouses);
      this.currentAvailableHousesSubject.next([...filteredAvailableHouses]);
    }
  }

  addPlayerHouseLevel(playerId: number, houseId: string) {
    const playerHouses = this.playerHouses;
    const house = playerHouses.find((x) => x.houseId === houseId);
    if (house && house.level < this.maxHouseLevel) {
      house.level += 1;

      this.playerHousesSubject.next(playerHouses);
    }
  }

  removePlayerHouseLevel(playerId: number, houseId: string) {
    const playerHouses = this.playerHouses;
    const house = playerHouses.find((x) => x.houseId === houseId);
    if (house && house.level > 0) {
      house.level -= 1;

      this.playerHousesSubject.next(playerHouses);
    }
  }
}
