import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, map } from 'rxjs';
import { GameState } from 'src/app/models/ai';
import { techTilesGameAdjustments } from '../constants/tech-tiles-game-adjustments';
import { shuffleMultipleTimes } from '../helpers/common';
import { getStructuredEffectArrayInfos } from '../helpers/rewards';
import { StructuredEffect } from '../models';
import { Player } from '../models/player';
import { TechTileCard } from '../models/tech-tile';
import { TechTileConfiguratorService } from './configurators/tech-tile-configurator.service';
import { GameModifiers } from './game-modifier.service';

export interface TechTileDeckCard extends TechTileCard {
  id: string;
  structuredEffects?: StructuredEffect[];
  aiEvaluation?: (player: Player, gameState: GameState) => number;
  gameModifiers?: GameModifiers;
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
  private techTileDeckSubject = new BehaviorSubject<TechTileDeckCard[]>([]);
  techTileDeck$ = this.techTileDeckSubject.asObservable();
  availableTechTiles$ = this.techTileDeckSubject.pipe(map((x) => x.slice(0, 3)));

  private playerTechTilesSubject = new BehaviorSubject<PlayerTechTile[]>([]);
  playerTechTiles$ = this.playerTechTilesSubject.asObservable();

  constructor(private techTilesConfigService: TechTileConfiguratorService) {
    const techTileDeckString = localStorage.getItem('techTileDeck');
    if (techTileDeckString) {
      const techTileDeck = JSON.parse(techTileDeckString) as TechTileDeckCard[];
      this.techTileDeckSubject.next(techTileDeck);
    }

    this.techTileDeck$.subscribe((techTileDeck) => {
      localStorage.setItem('techTileDeck', JSON.stringify(techTileDeck));
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

  get techTileDeck() {
    return cloneDeep(this.techTileDeckSubject.value);
  }

  get buyableTechTiles() {
    return cloneDeep(this.techTileDeckSubject.value.slice(0, 3));
  }

  get playerTechTiles() {
    return cloneDeep(this.playerTechTilesSubject.value);
  }

  getPlayerTechTiles(playerId: number) {
    return cloneDeep(this.playerTechTilesSubject.value.filter((x) => x.playerId === playerId));
  }

  createTechTileDeck(filter: (techTileCard: TechTileCard) => boolean = () => true) {
    const techTiles = this.techTilesConfigService.techTiles.filter((x) => filter(x));
    this.playerTechTilesSubject.next([]);
    this.techTileDeckSubject.next(shuffleMultipleTimes(techTiles.map((x) => this.instantiateTechTile(x))));
  }

  removeAvailableTechTile(techTileId: string) {
    this.techTileDeckSubject.next(this.techTileDeck.filter((x) => x.name.en !== techTileId));
  }

  resetTechTileDeck() {
    this.playerTechTilesSubject.next([]);
    this.techTileDeckSubject.next([]);
  }

  setPlayerTechTile(playerId: number, techTileId: string) {
    const techTiles = this.techTileDeck;
    const techTile = techTiles.find((x) => x.name.en === techTileId);
    const techTileIndex = techTiles.findIndex((x) => x.name.en === techTileId);
    if (!techTile || techTileIndex < 0) {
      return;
    }

    this.playerTechTilesSubject.next([...this.playerTechTiles, { playerId, techTile: techTile, isFlipped: false }]);
    this.techTileDeckSubject.next(techTiles.filter((x) => x.name.en !== techTile.name.en));
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

  trashPlayerTechTile(techTileId: string) {
    this.playerTechTilesSubject.next(this.playerTechTiles.filter((x) => x.techTile.id !== techTileId));
  }

  private instantiateTechTile(card: TechTileCard): TechTileDeckCard {
    const techTileGameAdjustments = techTilesGameAdjustments.find((x) => x.id === card.name.en);
    return {
      ...card,
      id: crypto.randomUUID(),
      structuredEffects: card.effects && card.effects.length > 0 ? getStructuredEffectArrayInfos(card.effects) : undefined,
      aiEvaluation: techTileGameAdjustments?.aiEvaluation,
      gameModifiers: techTileGameAdjustments?.gameModifiers,
    };
  }
}
