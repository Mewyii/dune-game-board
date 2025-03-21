import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { cloneDeep, shuffle } from 'lodash';
import { techTiles } from '../constants/tech-tiles';
import { TechTileCard } from '../models/tech-tile';

export interface PlayerTechTile {
  playerId: number;
  techTile: TechTileCard;
  isFlipped: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TechTilesService {
  private techTiles: TechTileCard[] = techTiles;
  private availableTechTilesSubject = new BehaviorSubject<TechTileCard[]>([]);
  public availableTechTiles$ = this.availableTechTilesSubject.asObservable();
  public buyableTechTiles$ = this.availableTechTilesSubject.pipe(map((x) => x.slice(0, 3)));

  private playerTechTilesSubject = new BehaviorSubject<PlayerTechTile[]>([]);
  public playerTechTiles$ = this.playerTechTilesSubject.asObservable();

  private techTilesSubject = new BehaviorSubject<TechTileCard[]>(techTiles);
  public techTiles$ = this.techTilesSubject.asObservable();

  constructor() {
    const availableTechTilesString = localStorage.getItem('availableTechTiles');
    if (availableTechTilesString) {
      const availableTechTiles = JSON.parse(availableTechTilesString) as TechTileCard[];

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

    const techTilesString = localStorage.getItem('techTiles');
    if (techTilesString) {
      const techTiles = JSON.parse(techTilesString) as TechTileCard[];
      this.techTilesSubject.next(techTiles);
    }

    this.techTiles$.subscribe((techTiles) => {
      localStorage.setItem('techTiles', JSON.stringify(techTiles));
    });
  }

  public get availableTechTiles() {
    return cloneDeep(this.availableTechTilesSubject.value);
  }

  public get buyableTechTiles() {
    return cloneDeep(this.availableTechTiles.slice(0, 3));
  }

  public get playerTechTiles() {
    return cloneDeep(this.playerTechTilesSubject.value);
  }

  public getTechTiles() {
    return cloneDeep(this.techTilesSubject.value);
  }

  setInitialAvailableTechTiles() {
    this.techTiles = techTiles;
    this.playerTechTilesSubject.next([]);
    this.availableTechTilesSubject.next(shuffle(this.techTiles));
  }

  removeAvailableTechTile(techTileId: string) {
    this.availableTechTilesSubject.next(this.availableTechTiles.filter((x) => x.name.en !== techTileId));
  }

  resetAvailableTechTiles() {
    this.techTiles = techTiles;
    this.playerTechTilesSubject.next([]);
    this.availableTechTilesSubject.next([]);
  }

  getPlayerTechTiles(playerId: number) {
    return this.playerTechTiles.filter((x) => x.playerId === playerId).map((x) => x.techTile);
  }

  setPlayerTechTile(playerId: number, techTileId: string) {
    const techTile = this.availableTechTiles.find((x) => x.name.en === techTileId);
    const techTileIndex = this.availableTechTiles.findIndex((x) => x.name.en === techTileId);
    if (!techTile || techTileIndex < 0) {
      return;
    }

    const filteredAvailableTechTiles = this.availableTechTiles.filter((x) => x.name.en !== techTile.name.en);
    const filteredAvailableTechTileIds = filteredAvailableTechTiles.map((y) => y.name.en);

    const newTakenTechTiles = [...this.playerTechTiles, { playerId, techTile: techTile, isFlipped: false }];

    const availableTechTiles = this.techTiles.filter(
      (x) =>
        !newTakenTechTiles.some((y) => y.techTile.name.en === x.name.en) && !filteredAvailableTechTileIds.includes(x.name.en)
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

  flipTechTile(techTileId: string) {
    const playerTechTiles = this.playerTechTiles;
    const techTileIndex = playerTechTiles.findIndex((x) => x.techTile.name.en === techTileId);
    if (techTileIndex > -1) {
      playerTechTiles[techTileIndex] = {
        ...playerTechTiles[techTileIndex],
        isFlipped: !playerTechTiles[techTileIndex].isFlipped,
      };

      this.playerTechTilesSubject.next(playerTechTiles);
    }
  }

  unFlipTechTiles() {
    this.playerTechTilesSubject.next(this.playerTechTiles.map((x) => ({ ...x, isFlipped: false })));
  }

  trashTechTile(techTileId: string) {
    this.techTiles = this.techTiles.filter((x) => x.name.en !== techTileId);
    this.playerTechTilesSubject.next(this.playerTechTiles.filter((x) => x.techTile.name.en !== techTileId));
  }

  addTechTile(card: TechTileCard) {
    this.techTilesSubject.next([...this.techTiles, card]);
  }

  editTechTile(card: TechTileCard) {
    const cardId = card.name.en;

    const techTiles = this.techTiles;
    const cardIndex = techTiles.findIndex((x) => x.name.en === cardId);
    techTiles[cardIndex] = card;

    this.techTilesSubject.next(techTiles);
  }

  sortTechTiles(category: keyof TechTileCard, order: 'asc' | 'desc') {
    if (category === 'costs') {
      const orderedTechTiles = this.techTiles.sort((a, b) => {
        const aCosts = a.costs ?? 0;
        const bCosts = b.costs ?? 0;
        if (order === 'asc') {
          return aCosts - bCosts;
        } else if (order === 'desc') {
          return bCosts - aCosts;
        }
        return 0;
      });
      this.techTilesSubject.next(orderedTechTiles);
    }
  }

  deleteTechTile(id: string) {
    this.techTilesSubject.next(this.techTiles.filter((x) => x.name.en !== id));
  }
}
