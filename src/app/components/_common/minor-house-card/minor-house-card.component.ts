import { Component, Input } from '@angular/core';
import { House } from 'src/app/constants/minor-houses';
import { LanguageString } from 'src/app/models';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-minor-house-card',
  templateUrl: './minor-house-card.component.html',
  styleUrls: ['./minor-house-card.component.scss'],
})
export class MinorHouseCardComponent {
  @Input() house: House | undefined;

  public title: LanguageString = { de: 'haus', en: 'house' };

  constructor(public translateService: TranslateService) {}

  getTransparentColor(color: string, opacity: number) {
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }
}
