import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { cloneDeep } from 'lodash';
import { shuffle } from '../helpers/common';
import { techTiles } from '../constants/tech-tiles';
import { FactionType, LanguageString, Reward } from '../models';
import { LanguageStringAndFontSize } from '../constants/imperium-cards';
import { Player } from './players.service';
import { GameState } from './ai/models';

export interface TechTileCard {
  name: LanguageString;
  faction?: FactionType;
  costs: number;
  effects?: Reward[];
  customEffect?: LanguageStringAndFontSize;
  buyEffects?: Reward[];
  imageUrl?: string;
  aiEvaluation: (player: Player, gameState: GameState) => number;
}

export interface PlayerTechTile {
  playerId: number;
  techTileId: string;
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

  private newTechTilesSubject = new BehaviorSubject<TechTileCard[]>(techTiles);
  public newTechTiles$ = this.newTechTilesSubject.asObservable();

  constructor() {
    const availableTechTilesString = localStorage.getItem('availableTechTiles');
    if (availableTechTilesString) {
      const availableTechTiles = JSON.parse(availableTechTilesString) as TechTileCard[];

      // Workaround for local storage not being able to store functions
      const realTechTiles = availableTechTiles.map((x) => {
        const techTile = this.newTechTiles.find((y) => y.name.en === x.name.en);
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

    const newTechTilesString = localStorage.getItem('newTechTiles');
    if (newTechTilesString) {
      const newTechTiles = JSON.parse(newTechTilesString) as TechTileCard[];
      this.newTechTilesSubject.next(newTechTiles);
    }

    this.newTechTiles$.subscribe((newTechTiles) => {
      localStorage.setItem('newTechTiles', JSON.stringify(newTechTiles));
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

  public get newTechTiles() {
    return cloneDeep(this.newTechTilesSubject.value);
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
    const playerTechTiles = this.playerTechTiles.filter((x) => x.playerId === playerId).map((x) => x.techTileId);
    return this.techTiles.filter((x) => playerTechTiles.includes(x.name.en));
  }

  setPlayerTechTile(playerId: number, techTileId: string) {
    const techTileIndex = this.availableTechTiles.findIndex((x) => x.name.en === techTileId);
    const filteredAvailableTechTiles = this.availableTechTiles.filter((x) => x.name.en !== techTileId);
    const filteredAvailableTechTileIds = filteredAvailableTechTiles.map((y) => y.name.en);

    const newTakenTechTiles = [...this.playerTechTiles, { playerId, techTileId: techTileId, isFlipped: false }];

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

  flipTechTile(techTileId: string) {
    const playerTechTiles = this.playerTechTiles;
    const techTileIndex = playerTechTiles.findIndex((x) => x.techTileId === techTileId);
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
    this.playerTechTilesSubject.next(this.playerTechTiles.filter((x) => x.techTileId !== techTileId));
  }

  addTechTile(card: TechTileCard) {
    this.newTechTilesSubject.next([...this.newTechTiles, card]);
  }

  editTechTile(card: TechTileCard) {
    const cardId = card.name.en;

    const newTechTiles = this.newTechTiles;
    const cardIndex = newTechTiles.findIndex((x) => x.name.en === cardId);
    newTechTiles[cardIndex] = card;

    this.newTechTilesSubject.next(newTechTiles);
  }

  sortTechTiles(category: keyof TechTileCard, order: 'asc' | 'desc') {
    if (category === 'costs') {
      const orderedTechTiles = this.newTechTiles.sort((a, b) => {
        const aCosts = a.costs ?? 0;
        const bCosts = b.costs ?? 0;
        if (order === 'asc') {
          return aCosts - bCosts;
        } else if (order === 'desc') {
          return bCosts - aCosts;
        }
        return 0;
      });
      this.newTechTilesSubject.next(orderedTechTiles);
    }
  }

  deleteTechTile(id: string) {
    this.newTechTilesSubject.next(this.newTechTiles.filter((x) => x.name.en !== id));
  }
}
