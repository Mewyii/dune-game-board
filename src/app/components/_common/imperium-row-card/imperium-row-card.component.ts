import { Component, Input } from '@angular/core';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { ActionType, FactionType, RewardType } from 'src/app/models';
import { ImperiumCard } from 'src/app/models/imperium-card';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-imperium-row-card',
  templateUrl: './imperium-row-card.component.html',
  styleUrls: ['./imperium-row-card.component.scss'],
})
export class ImperiumRowCardComponent {
  @Input() card!: ImperiumCard;
  @Input() costModifier = 0;

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
}
