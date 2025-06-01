import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, map } from 'rxjs';
import { techTilesGameAdjustments } from '../constants/tech-tiles-game-adjustments';
import { shuffleMultipleTimes } from '../helpers/common';
import { getStructuredEffectArrayInfos } from '../helpers/rewards';
import { StructuredEffects } from '../models';
import { Player } from '../models/player';
import { TechTileCard } from '../models/tech-tile';
import { GameState } from './ai/models';
import { TechTileConfiguratorService } from './configurators/tech-tile-configurator.service';
import { GameModifiers } from './game-modifier.service';

export interface TechTileDeckCard extends TechTileCard {
  id: string;
  structuredEffects?: StructuredEffects;
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
  public techTileDeck$ = this.techTileDeckSubject.asObservable();
  public availableTechTiles$ = this.techTileDeckSubject.pipe(map((x) => x.slice(0, 3)));

  private playerTechTilesSubject = new BehaviorSubject<PlayerTechTile[]>([]);
  public playerTechTiles$ = this.playerTechTilesSubject.asObservable();

  constructor(private techTilesConfigService: TechTileConfiguratorService) {
    const techTileDeckString = localStorage.getItem('techTileDeck');
    if (techTileDeckString) {
      const techTileDeck = JSON.parse(techTileDeckString) as TechTileDeckCard[];

      // Workaround for local storage not being able to store functions
      const realTechTiles = techTileDeck.map((x) => {
        const techTileGameAdjustments = techTilesGameAdjustments.find((y) => y.id === x.name.en);
        return {
          ...x,
          gameModifiers: techTileGameAdjustments?.gameModifiers,
          aiEvaluation: techTileGameAdjustments?.aiEvaluation,
        };
      });

      this.techTileDeckSubject.next(realTechTiles);
    }

    this.techTileDeck$.subscribe((techTileDeck) => {
      localStorage.setItem('techTileDeck', JSON.stringify(techTileDeck));
    });

    const playerTechTilesString = localStorage.getItem('playerTechTiles');
    if (playerTechTilesString) {
      const playerTechTiles = JSON.parse(playerTechTilesString) as PlayerTechTile[];

      // Workaround for local storage not being able to store functions
      const realPlayerTechTiles = playerTechTiles.map((x) => {
        const leaderGameAdjustments = techTilesGameAdjustments.find((y) => y.id === x.techTile.name.en);
        return {
          ...x,
          leader: {
            ...x.techTile,
            gameModifiers: leaderGameAdjustments?.gameModifiers,
            aiEvaluation: leaderGameAdjustments?.aiEvaluation,
          },
        };
      });
      this.playerTechTilesSubject.next(realPlayerTechTiles);
    }

    this.playerTechTiles$.subscribe((playerTechTiles) => {
      localStorage.setItem('playerTechTiles', JSON.stringify(playerTechTiles));
    });
  }

  public get techTileDeck() {
    return cloneDeep(this.techTileDeckSubject.value);
  }

  public get buyableTechTiles() {
    return cloneDeep(this.techTileDeckSubject.value.slice(0, 3));
  }

  public get playerTechTiles() {
    return cloneDeep(this.playerTechTilesSubject.value);
  }

  getPlayerTechTiles(playerId: number) {
    return cloneDeep(this.playerTechTilesSubject.value.filter((x) => x.playerId === playerId));
  }

  createTechTileDeck() {
    const techTiles = this.techTilesConfigService.techTiles;
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

  trashTechTile(techTileId: string) {
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
