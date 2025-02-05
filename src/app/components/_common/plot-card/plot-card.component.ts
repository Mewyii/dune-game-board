import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { ActionType, FactionType, RewardType } from 'src/app/models';
import { ImperiumPlot } from 'src/app/models/imperium-plot';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-plot-card',
  templateUrl: './plot-card.component.html',
  styleUrl: './plot-card.component.scss',
})
export class PlotCardComponent {
  @Input() plot!: ImperiumPlot;
  @Input() costModifier = 0;

  public factionName = '';
  public factionColor = '';

  constructor(public t: TranslateService, public settingsService: SettingsService) {}

  ngOnInit(): void {
    if (this.plot.faction) {
      this.factionName = this.getFactionName(this.plot.faction);
      this.factionColor = this.getFactionColor(this.plot.faction);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.plot.faction) {
      this.factionName = this.getFactionName(this.plot.faction);
      this.factionColor = this.getFactionColor(this.plot.faction);
    }
  }

  public getActionTypePath(rewardType: ActionType) {
    return getActionTypePath(rewardType);
  }

  private getFactionColor(factionType: FactionType) {
    return this.settingsService.getFactionColor(factionType) ?? '';
  }

  private getFactionName(factionType: FactionType) {
    const factionName = this.settingsService.getFactionName(factionType);
    if (factionName) {
      return this.t.translateLS(factionName);
    }
    return '';
  }
}
