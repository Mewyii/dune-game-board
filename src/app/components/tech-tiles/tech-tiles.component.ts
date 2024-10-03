import { Component } from '@angular/core';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { FactionType, LanguageString, RewardType } from 'src/app/models';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { TechTileCard, TechTilesService } from 'src/app/services/tech-tiles.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-tech-tiles',
  templateUrl: './tech-tiles.component.html',
  styleUrls: ['./tech-tiles.component.scss'],
})
export class TechTilesComponent {
  public availableTechTiles: TechTileCard[] = [];
  public title: LanguageString = { de: 'haus', en: 'house' };
  public activeTechTileId = '';

  constructor(
    public gameManager: GameManager,
    public techTilesService: TechTilesService,
    public translateService: TranslateService,
    private audioManager: AudioManager
  ) {}

  ngOnInit(): void {
    this.techTilesService.buyableTechTiles$.subscribe((techTiles) => {
      this.availableTechTiles = techTiles;
    });
  }

  onTakeCardClicked(techTileId: string) {
    this.audioManager.playSound('aquire-tech');
    this.techTilesService.setPlayerTechTile(this.gameManager.activePlayerId, techTileId);
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

  getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  getFactionTypePath(rewardType: FactionType) {
    return getFactionTypePath(rewardType);
  }
}
