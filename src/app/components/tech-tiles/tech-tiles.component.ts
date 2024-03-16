import { Component } from '@angular/core';
import { TechTile } from 'src/app/constants/tech-tiles';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { FactionType, LanguageString, RewardType } from 'src/app/models';
import { GameManager } from 'src/app/services/game-manager.service';
import { TechTilesService } from 'src/app/services/tech-tiles.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-tech-tiles',
  templateUrl: './tech-tiles.component.html',
  styleUrls: ['./tech-tiles.component.scss'],
})
export class TechTilesComponent {
  public availableTechTiles: TechTile[] = [];
  public title: LanguageString = { de: 'haus', en: 'house' };

  constructor(
    public gameManager: GameManager,
    public techTilesService: TechTilesService,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.techTilesService.availableTechTiles$.subscribe((techTiles) => {
      this.availableTechTiles = techTiles;
    });
  }

  onTakeCardClicked(techTileId: string) {
    this.techTilesService.setPlayerTechTile(this.gameManager.activeAgentPlacementPlayerId, techTileId);
  }

  getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  getFactionTypePath(rewardType: FactionType) {
    return getFactionTypePath(rewardType);
  }
}
