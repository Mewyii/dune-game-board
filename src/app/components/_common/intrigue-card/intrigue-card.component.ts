import { Component, Input } from '@angular/core';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { ActionType, FactionType, RewardType } from 'src/app/models';
import { IntrigueCard, IntrigueDeckCard } from 'src/app/models/intrigue';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-intrigue-card',
  templateUrl: './intrigue-card.component.html',
  styleUrl: './intrigue-card.component.scss',
})
export class IntrigueCardComponent {
  @Input() card!: IntrigueCard | IntrigueDeckCard;

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
