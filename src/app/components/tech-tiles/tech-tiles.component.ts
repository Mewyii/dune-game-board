import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { getTechTileCostModifier } from 'src/app/helpers/game-modifiers';

import { LanguageString } from 'src/app/models';
import { TechTileCard } from 'src/app/models/tech-tile';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService, TechTileModifier } from 'src/app/services/game-modifier.service';
import { TechTileDeckCard, TechTilesService } from 'src/app/services/tech-tiles.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-tech-tiles',
  templateUrl: './tech-tiles.component.html',
  styleUrls: ['./tech-tiles.component.scss'],
  standalone: false,
})
export class TechTilesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  public availableTechTiles: TechTileDeckCard[] = [];
  public title: LanguageString = { de: 'haus', en: 'house' };
  public activeTechTileId = '';
  public hoveredTechTileId = '';

  public activePlayerId: number = 0;
  public techTileModifiers: TechTileModifier[] | undefined;
  constructor(
    public gameManager: GameManager,
    public techTilesService: TechTilesService,
    public t: TranslateService,
    private gameModifierService: GameModifiersService,
  ) {}

  ngOnInit(): void {
    const availableTechTilesSub = this.techTilesService.availableTechTiles$.subscribe((techTiles) => {
      this.availableTechTiles = techTiles;
    });

    const activePlayerIdSub = this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
      this.techTileModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'techTiles');
    });

    const playerGameModifiersSub = this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.techTileModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'techTiles');
    });

    this.subscriptions.push(availableTechTilesSub, activePlayerIdSub, playerGameModifiersSub);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onTakeCardClicked(techTile: TechTileDeckCard) {
    this.gameManager.acquirePlayerTechTile(this.gameManager.activePlayerId, techTile);
  }

  onTrashCardClicked(techTileId: string) {
    this.techTilesService.removeAvailableTechTile(techTileId);
  }

  setTechTileActive(techTileId: string) {
    if (this.activeTechTileId !== techTileId) {
      this.activeTechTileId = techTileId;
    } else {
      this.activeTechTileId = '';
    }
  }

  setCardHover(cardId: string) {
    if (this.hoveredTechTileId !== cardId) {
      this.hoveredTechTileId = cardId;
    } else {
      this.hoveredTechTileId = '';
    }
  }

  getTechTileCostModifier(card: TechTileCard) {
    return getTechTileCostModifier(card, this.techTileModifiers);
  }
}
