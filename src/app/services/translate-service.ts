import { Injectable, inject } from '@angular/core';
import { deLocale, enLocale, LocaleType } from '../locales';
import { LanguageString, LanguageType } from '../models';
import { SettingsService } from './settings.service';

export type Locale = { [key: string]: string };

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private settingsService = inject(SettingsService);

  private en = enLocale;
  private de = deLocale;
  language: LanguageType = 'de';

  constructor() {
    this.language = this.settingsService.language;
  }

  translate(string: LocaleType, hightlightVars = false, ...vars: (string | number | undefined)[]) {
    switch (this.language) {
      case 'de':
        return this.replacePlaceholders(this.de[string] ?? string, hightlightVars, ...vars);
      case 'en':
      default:
        return this.replacePlaceholders(this.en[string] ?? string, hightlightVars, ...vars);
    }
  }

  translateLS(string: LanguageString) {
    return string[this.language];
  }

  private replacePlaceholders(str: string, hightlightVars = false, ...vars: (string | number | undefined)[]) {
    return str.replace(/{(\d+)}/g, (match, index) => {
      if (vars[index]) {
        if (!hightlightVars) {
          return vars[index]!.toString();
        } else {
          return '<b>' + vars[index]!.toString() + '</b>';
        }
      } else {
        return match;
      }
    });
  }
}
