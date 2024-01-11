import { Injectable } from '@angular/core';
import { Settings, boardSettings } from '../constants/board-settings';
import { factionsCustomAdvanced } from '../constants/factions-custom-advanced';
import { factionsOriginal } from '../constants/factions-original';
import { factionsCustomBeginner } from '../constants/factions-custom-beginner';
import { locationsCustom } from '../constants/locations-custom';
import { locationsOriginal } from '../constants/locations-original';
import { locationsOriginalBalanced } from '../constants/locations-original-balanced';
import { factionsCustomExpert } from '../constants/factions-custom-expert';
import { ActionField, FactionType, LanguageType } from '../models';
import { ix } from '../constants/ix-custom';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public factions = factionsOriginal;
  public locations = locationsOriginal;
  public ix = ix;

  public maxSellableSpice = 3;
  public fields: ActionField[] = [];
  public unblockableFields: ActionField[] = [];

  private settingsSubject = new BehaviorSubject<Settings>(boardSettings);
  public settings$ = this.settingsSubject.asObservable();

  constructor() {
    const settingsString = localStorage.getItem('settings');
    if (settingsString) {
      const settings = JSON.parse(settingsString) as Settings;
      this.settingsSubject.next(settings);
    }

    this.settings$.subscribe((settings) => {
      localStorage.setItem('settings', JSON.stringify(settings));
    });

    if (boardSettings.content === 'custom-beginner') {
      this.factions = factionsCustomBeginner;
      this.locations = locationsOriginalBalanced;
    } else if (boardSettings.content === 'custom-advanced') {
      this.factions = factionsCustomAdvanced;
      this.locations = locationsCustom;
    } else if (boardSettings.content === 'custom-expert') {
      this.factions = factionsCustomExpert;
      this.locations = locationsCustom;
    }

    this.setFields();
  }

  public get settings() {
    return cloneDeep(this.settingsSubject.value);
  }

  public setFields() {
    const result: ActionField[] = [];
    for (const faction of this.factions) {
      for (const field of faction.actionFields) {
        result.push(field);
      }
    }
    for (const location of this.locations) {
      result.push(location.actionField);
    }

    result.push(ix);

    this.fields = result;
    this.unblockableFields = this.fields.filter((x) => x.isNonBlockingField);
  }

  getFactionName(factionType: FactionType) {
    return this.factions.find((x) => x.type === factionType)?.title;
  }

  getFactionColor(factionType: FactionType) {
    return this.factions.find((x) => x.type === factionType)?.primaryColor;
  }

  changeLanguage(lang: LanguageType) {
    this.settingsSubject.next({ ...this.settings, language: lang });
  }
}
