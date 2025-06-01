import { Component, Input } from '@angular/core';
import { House } from 'src/app/constants/minor-houses';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { EffectType, LanguageString, EffectRewardType } from 'src/app/models';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
    selector: 'dune-minor-house-card',
    templateUrl: './minor-house-card.component.html',
    styleUrls: ['./minor-house-card.component.scss'],
    standalone: false
})
export class MinorHouseCardComponent {
  @Input() house: House | undefined;

  public title: LanguageString = { de: 'haus', en: 'house' };

  constructor(public t: TranslateService) {}

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  getTransparentColor(color: string, opacity: number) {
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }
}
