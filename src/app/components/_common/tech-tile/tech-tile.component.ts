import { Component, Input } from '@angular/core';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { ActionType, EffectType, FactionType, RewardType } from 'src/app/models';
import { TechTileCard } from 'src/app/models/tech-tile';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-tech-tile',
  templateUrl: './tech-tile.component.html',
  styleUrl: './tech-tile.component.scss',
})
export class TechTileComponent {
  @Input() card!: TechTileCard;
  @Input() costModifier = 0;

  constructor(public t: TranslateService, public settingsService: SettingsService) {}

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public getActionTypePath(rewardType: ActionType) {
    return getActionTypePath(rewardType);
  }

  getFactionTypePath(factionType: FactionType) {
    return getFactionTypePath(factionType);
  }
}
