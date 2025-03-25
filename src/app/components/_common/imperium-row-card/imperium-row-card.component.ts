import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { ActionType, FactionType, RewardType } from 'src/app/models';
import { ImperiumCard } from 'src/app/models/imperium-card';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-imperium-row-card',
  templateUrl: './imperium-row-card.component.html',
  styleUrls: ['./imperium-row-card.component.scss'],
})
export class ImperiumRowCardComponent implements OnInit, OnChanges {
  @Input() card!: ImperiumCard;
  @Input() costModifier = 0;

  public factionName = '';
  public factionColor = '';
  public agentEffectSize = '32px';
  public revealEffectSize = '32px';

  constructor(public t: TranslateService, public settingsService: SettingsService) {}

  ngOnInit(): void {
    if (this.card.faction) {
      this.factionName = this.getFactionName(this.card.faction);
      this.factionColor = this.getFactionColor(this.card.faction);
    }
    if (this.card.agentEffectSize) {
      this.agentEffectSize =
        this.card.agentEffectSize === 'large' ? '32px' : this.card.agentEffectSize === 'medium' ? '22px' : '18px';
    }
    if (this.card.revealEffectSize) {
      this.revealEffectSize =
        this.card.revealEffectSize === 'large' ? '32px' : this.card.revealEffectSize === 'medium' ? '22px' : '18px';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.card.faction) {
      this.factionName = this.getFactionName(this.card.faction);
      this.factionColor = this.getFactionColor(this.card.faction);
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
