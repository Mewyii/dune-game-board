import { ChangeDetectionStrategy, Component, Input, SimpleChanges, inject } from '@angular/core';

import { FactionType } from 'src/app/models';
import { ImperiumPlot } from 'src/app/models/imperium-plot';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-plot-card',
  templateUrl: './plot-card.component.html',
  styleUrl: './plot-card.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PlotCardComponent {
  t = inject(TranslateService);
  settingsService = inject(SettingsService);

  @Input() plot!: ImperiumPlot;
  @Input() costModifier = 0;

  public factionName = '';
  public factionColor = '';

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
