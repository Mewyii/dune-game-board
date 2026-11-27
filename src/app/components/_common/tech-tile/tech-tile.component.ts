import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';

import { TechTileCard } from 'src/app/models/tech-tile';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-tech-tile',
  templateUrl: './tech-tile.component.html',
  styleUrl: './tech-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TechTileComponent implements OnInit, OnChanges {
  t = inject(TranslateService);
  settingsService = inject(SettingsService);

  @Input() card!: TechTileCard;
  @Input() costModifier = 0;

  public effectSize = '24px';

  ngOnInit(): void {
    if (this.card.effectSize) {
      this.effectSize = this.card.effectSize === 'large' ? '24px' : this.card.effectSize === 'medium' ? '21px' : '18px';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.card.effectSize) {
      this.effectSize = this.card.effectSize === 'large' ? '24px' : this.card.effectSize === 'medium' ? '21px' : '18px';
    }
  }
}
