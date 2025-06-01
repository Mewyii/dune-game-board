import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { ActionType, EffectType, FactionType } from 'src/app/models';
import { TechTileCard } from 'src/app/models/tech-tile';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
    selector: 'dune-tech-tile',
    templateUrl: './tech-tile.component.html',
    styleUrl: './tech-tile.component.scss',
    standalone: false
})
export class TechTileComponent implements OnInit, OnChanges {
  @Input() card!: TechTileCard;
  @Input() costModifier = 0;

  public effectSize = '26px';

  constructor(public t: TranslateService, public settingsService: SettingsService) {}

  ngOnInit(): void {
    if (this.card.effectSize) {
      this.effectSize = this.card.effectSize === 'large' ? '26px' : this.card.effectSize === 'medium' ? '22px' : '18px';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.card.effectSize) {
      this.effectSize = this.card.effectSize === 'large' ? '26px' : this.card.effectSize === 'medium' ? '22px' : '18px';
    }
  }

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
