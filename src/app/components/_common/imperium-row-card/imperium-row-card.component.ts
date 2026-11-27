import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';

import { FactionType } from 'src/app/models';
import { ImperiumCard } from 'src/app/models/imperium-card';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-imperium-row-card',
  templateUrl: './imperium-row-card.component.html',
  styleUrls: ['./imperium-row-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ImperiumRowCardComponent implements OnInit, OnChanges {
  t = inject(TranslateService);
  settingsService = inject(SettingsService);

  @Input() card!: ImperiumCard;
  @Input() costModifier = 0;
  @Input() disabled = false;

  public factionName = '';
  public factionColor = '';
  public factionColorDark = '';
  public factionNameSecondary = '';
  public factionColorSecondary = '';
  public factionColorSecondaryDark = '';
  public agentEffectSize = '26px';
  public revealEffectSize = '26px';

  ngOnInit(): void {
    if (this.card.faction) {
      this.factionName = this.getFactionName(this.card.faction);
      this.factionColor = this.getFactionColor(this.card.faction);
      this.factionColorDark = this.getFactionSecondaryColor(this.card.faction);

      if (this.card.factionSecondary) {
        this.factionNameSecondary = this.getFactionName(this.card.factionSecondary);
        this.factionColorSecondary = this.getFactionColor(this.card.factionSecondary);
        this.factionColorSecondaryDark = this.getFactionSecondaryColor(this.card.factionSecondary);
      }
    }
    if (this.card.agentEffectSize) {
      this.agentEffectSize =
        this.card.agentEffectSize === 'large' ? '28px' : this.card.agentEffectSize === 'medium' ? '20px' : '18px';
    }
    if (this.card.revealEffectSize) {
      this.revealEffectSize =
        this.card.revealEffectSize === 'large' ? '28px' : this.card.revealEffectSize === 'medium' ? '20px' : '18px';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.card.faction) {
      this.factionName = this.getFactionName(this.card.faction);
      this.factionColor = this.getFactionColor(this.card.faction);
      this.factionColorDark = this.getFactionSecondaryColor(this.card.faction);

      if (this.card.factionSecondary) {
        this.factionNameSecondary = this.getFactionName(this.card.factionSecondary);
        this.factionColorSecondary = this.getFactionColor(this.card.factionSecondary);
        this.factionColorSecondaryDark = this.getFactionSecondaryColor(this.card.factionSecondary);
      }
    }
    if (this.card.agentEffectSize) {
      this.agentEffectSize =
        this.card.agentEffectSize === 'large' ? '28px' : this.card.agentEffectSize === 'medium' ? '20px' : '18px';
    }
    if (this.card.revealEffectSize) {
      this.revealEffectSize =
        this.card.revealEffectSize === 'large' ? '28px' : this.card.revealEffectSize === 'medium' ? '20px' : '18px';
    }
  }

  private getFactionColor(factionType: FactionType) {
    return this.settingsService.getFactionColor(factionType) ?? '';
  }

  private getFactionSecondaryColor(factionType: FactionType) {
    return this.settingsService.getFactionSecondaryColor(factionType) ?? '';
  }

  private getFactionName(factionType: FactionType) {
    const factionName = this.settingsService.getFactionName(factionType);
    if (factionName) {
      return this.t.translateLS(factionName);
    }
    return '';
  }
}
