import { Injectable } from '@angular/core';
import { deLocale, enLocale, LocaleType } from '../locales';
import { LanguageString, LanguageType } from '../models';
import { SettingsService } from './settings.service';

export type Locale = { [key: string]: string };

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private en = enLocale;
  private de = deLocale;
  public language: LanguageType = 'de';

  constructor(private settingsService: SettingsService) {
    this.language = this.settingsService.language;
  }

  public translate(string: LocaleType) {
    switch (this.language) {
      case 'de':
        return this.de[string] ?? string;
      case 'en':
      default:
        return this.en[string] ?? string;
    }
  }

  public translateLS(string: LanguageString) {
    return string[this.language];
  }
}
