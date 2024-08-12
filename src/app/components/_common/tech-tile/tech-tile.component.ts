import { Component, Input } from '@angular/core';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { ActionType, FactionType, RewardType } from 'src/app/models';
import { SettingsService } from 'src/app/services/settings.service';
import { TechTileCard } from 'src/app/services/tech-tiles.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-tech-tile',
  templateUrl: './tech-tile.component.html',
  styleUrl: './tech-tile.component.scss',
})
export class TechTileComponent {
  @Input() card!: TechTileCard;

  constructor(public translateService: TranslateService, public settingsService: SettingsService) {}

  getFactionType(faction: FactionType) {
    return '';
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  public getActionTypePath(rewardType: ActionType) {
    return getActionTypePath(rewardType);
  }

  public getFactionColor(factionType: FactionType) {
    return this.settingsService.getFactionColor(factionType) ?? '';
  }

  public getFactionName(factionType: FactionType) {
    const factionName = this.settingsService.getFactionName(factionType);
    if (factionName) {
      return this.translateService.translate(factionName);
    }
    return '';
  }

  getFactionTypePath(factionType: FactionType) {
    return getFactionTypePath(factionType);
  }
}