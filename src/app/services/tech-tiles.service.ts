import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { shuffle } from '../helpers/common';
import { TechTile, techTiles } from '../constants/tech-tiles';

export interface PlayerTechTile {
  playerId: number;
  techTileId: string;
}

@Injectable({
  providedIn: 'root',
})
export class TechTilesService {
  private techTiles = techTiles;
  private availableTechTilesSubject = new BehaviorSubject<TechTile[]>([]);
  public availableTechTiles$ = this.availableTechTilesSubject.asObservable();

  private playerTechTilesSubject = new BehaviorSubject<PlayerTechTile[]>([]);
  public playerTechTiles$ = this.playerTechTilesSubject.asObservable();

  constructor() {
    const availableTechTilesString = localStorage.getItem('availableTechTiles');
    if (availableTechTilesString) {
      const availableTechTiles = JSON.parse(availableTechTilesString) as TechTile[];

      // Workaround for local storage not being able to store functions
      const realTechTiles = availableTechTiles.map((x) => {
        const techTile = this.techTiles.find((y) => y.name.en === x.name.en);
        return techTile ?? x;
      });

      this.availableTechTilesSubject.next(realTechTiles);
    }

    this.availableTechTiles$.subscribe((availableTechTiles) => {
      localStorage.setItem('availableTechTiles', JSON.stringify(availableTechTiles));
    });

    const playerTechTilesString = localStorage.getItem('playerTechTiles');
    if (playerTechTilesString) {
      const playerTechTiles = JSON.parse(playerTechTilesString) as PlayerTechTile[];
      this.playerTechTilesSubject.next(playerTechTiles);
    }

    this.playerTechTiles$.subscribe((playerTechTiles) => {
      localStorage.setItem('playerTechTiles', JSON.stringify(playerTechTiles));
    });
  }

  public get availableTechTiles() {
    return cloneDeep(this.availableTechTilesSubject.value);
  }

  public get playerTechTiles() {
    return cloneDeep(this.playerTechTilesSubject.value);
  }

  setInitialAvailableTechTiles() {
    this.playerTechTilesSubject.next([]);
    this.availableTechTilesSubject.next(shuffle(this.techTiles).slice(0, 3));
  }

  resetAvailableTechTiles() {
    this.playerTechTilesSubject.next([]);
    this.availableTechTilesSubject.next([]);
  }

  getPlayerTechTiles(playerId: number) {
    const playerTechTiles = this.playerTechTiles.filter((x) => x.playerId === playerId).map((x) => x.techTileId);
    return this.techTiles.filter((x) => playerTechTiles.includes(x.name.en));
  }

  setPlayerTechTile(playerId: number, techTileId: string) {
    const techTileIndex = this.availableTechTiles.findIndex((x) => x.name.en === techTileId);
    const filteredAvailableTechTiles = this.availableTechTiles.filter((x) => x.name.en !== techTileId);
    const filteredAvailableTechTileIds = filteredAvailableTechTiles.map((y) => y.name.en);

    const newTakenTechTiles = [...this.playerTechTiles, { playerId, techTileId: techTileId }];

    const availableTechTiles = this.techTiles.filter(
      (x) => !newTakenTechTiles.some((y) => y.techTileId === x.name.en) && !filteredAvailableTechTileIds.includes(x.name.en)
    );

    const newAvailableTechTile = shuffle(availableTechTiles).pop();

    if (techTileIndex > -1 && newAvailableTechTile) {
      const newAvailableTechTiles = this.availableTechTiles;
      newAvailableTechTiles[techTileIndex] = newAvailableTechTile;

      this.playerTechTilesSubject.next(newTakenTechTiles);
      this.availableTechTilesSubject.next(newAvailableTechTiles);
    } else {
      this.playerTechTilesSubject.next(newTakenTechTiles);
      this.availableTechTilesSubject.next([...filteredAvailableTechTiles]);
    }
  }
}
