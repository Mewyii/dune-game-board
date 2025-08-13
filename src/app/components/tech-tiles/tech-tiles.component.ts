import { Component } from '@angular/core';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getTechTileCostModifier } from 'src/app/helpers/game-modifiers';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { EffectType, FactionType, LanguageString } from 'src/app/models';
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
export class TechTilesComponent {
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
    private gameModifierService: GameModifiersService
  ) {}

  ngOnInit(): void {
    this.techTilesService.availableTechTiles$.subscribe((techTiles) => {
      this.availableTechTiles = techTiles;
    });

    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
      this.techTileModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'techTiles');
    });

    this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.techTileModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'techTiles');
    });
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

  getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  getFactionTypePath(rewardType: FactionType) {
    return getFactionTypePath(rewardType);
  }

  getTechTileCostModifier(card: TechTileCard) {
    return getTechTileCostModifier(card, this.techTileModifiers);
  }
}
