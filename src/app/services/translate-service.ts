import { Injectable } from '@angular/core';
import { SettingsService } from './settings.service';
import { LanguageString, LanguageType } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  public language: LanguageType = 'de';

  constructor(public settingsService: SettingsService) {
    this.language = this.settingsService.settings.language;
  }

  public translate(string: LanguageString) {
    return string[this.language];
  }
}
