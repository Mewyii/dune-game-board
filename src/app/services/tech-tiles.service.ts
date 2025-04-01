import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { cloneDeep, shuffle } from 'lodash';
import { techTiles } from '../constants/tech-tiles';
import { TechTileCard } from '../models/tech-tile';
import { StructuredEffects } from '../models';
import { getStructuredEffectArrayInfos } from '../helpers/rewards';
import { TechTileConfiguratorService } from './configurators/tech-tile-configurator.service';

export interface TechTileDeckCard extends TechTileCard {
  id: string;
  structuredEffects?: StructuredEffects;
}

export interface PlayerTechTile {
  playerId: number;
  techTile: TechTileDeckCard;
  isFlipped: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TechTilesService {
  private availableTechTilesSubject = new BehaviorSubject<TechTileDeckCard[]>([]);
  public availableTechTiles$ = this.availableTechTilesSubject.asObservable();
  public buyableTechTiles$ = this.availableTechTilesSubject.pipe(map((x) => x.slice(0, 3)));

  private playerTechTilesSubject = new BehaviorSubject<PlayerTechTile[]>([]);
  public playerTechTiles$ = this.playerTechTilesSubject.asObservable();

  constructor(private techTilesConfigService: TechTileConfiguratorService) {
    const availableTechTilesString = localStorage.getItem('availableTechTiles');
    if (availableTechTilesString) {
      const availableTechTiles = JSON.parse(availableTechTilesString) as TechTileDeckCard[];

      // Workaround for local storage not being able to store functions
      const realTechTiles = availableTechTiles.map((x) => {
        const techTile = techTiles.find((y) => y.name.en === x.name.en);
        return { ...techTile, ...x };
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

  public get buyableTechTiles() {
    return cloneDeep(this.availableTechTiles.slice(0, 3));
  }

  public get playerTechTiles() {
    return cloneDeep(this.playerTechTilesSubject.value);
  }

  setInitialAvailableTechTiles() {
    const techTiles = this.techTilesConfigService.techTiles;
    this.playerTechTilesSubject.next([]);
    this.availableTechTilesSubject.next(shuffle(techTiles.map((x) => this.instantiateTechTile(x))));
  }

  removeAvailableTechTile(techTileId: string) {
    this.availableTechTilesSubject.next(this.availableTechTiles.filter((x) => x.name.en !== techTileId));
  }

  resetAvailableTechTiles() {
    this.playerTechTilesSubject.next([]);
    this.availableTechTilesSubject.next([]);
  }

  getPlayerTechTiles(playerId: number) {
    return this.playerTechTiles.filter((x) => x.playerId === playerId);
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

    const availableTechTiles = this.techTilesConfigService.techTiles.filter(
      (x) =>
        !newTakenTechTiles.some((y) => y.techTile.name.en === x.name.en) && !filteredAvailableTechTileIds.includes(x.name.en)
    );

    const newAvailableTechTile = shuffle(availableTechTiles).pop();

    if (techTileIndex > -1 && newAvailableTechTile) {
      const newAvailableTechTiles = this.availableTechTiles;
      newAvailableTechTiles[techTileIndex] = this.instantiateTechTile(newAvailableTechTile);

      this.playerTechTilesSubject.next(newTakenTechTiles);
      this.availableTechTilesSubject.next(newAvailableTechTiles);
    } else {
      this.playerTechTilesSubject.next(newTakenTechTiles);
      this.availableTechTilesSubject.next([...filteredAvailableTechTiles]);
    }
  }

  flipTechTile(techTileId: string) {
    const playerTechTiles = this.playerTechTiles;
    const techTileIndex = playerTechTiles.findIndex((x) => x.techTile.id === techTileId);
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
    this.playerTechTilesSubject.next(this.playerTechTiles.filter((x) => x.techTile.id !== techTileId));
  }

  public instantiateTechTile(card: TechTileCard): TechTileDeckCard {
    return {
      ...card,
      id: crypto.randomUUID(),
      structuredEffects: card.effects ? getStructuredEffectArrayInfos(card.effects) : undefined,
    };
  }
}
