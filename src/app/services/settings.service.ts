import { Injectable } from '@angular/core';
import { Settings, boardSettings } from '../constants/board-settings';
import { factionsCustomAdvanced } from '../constants/factions-custom-advanced';
import { factionsOriginal } from '../constants/factions-original';
import { factionsCustomBeginner } from '../constants/factions-custom-beginner';
import { locationsCustom } from '../constants/locations-custom';
import { locationsOriginal } from '../constants/locations-original';
import { factionsCustomExpert } from '../constants/factions-custom-expert';
import { ActionField, FactionType, LanguageType } from '../models';
import { ixCustomAdvanced } from '../constants/ix-custom-advanced';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { ixCustomBeginner } from '../constants/ix-custom-beginner';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public factions = factionsOriginal;
  public locations = locationsOriginal;
  public ix = ixCustomAdvanced;

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

    if (boardSettings.factions === 'custom-beginner') {
      this.factions = factionsCustomBeginner;
    } else if (boardSettings.factions === 'custom-advanced') {
      this.factions = factionsCustomAdvanced;
    } else if (boardSettings.factions === 'custom-expert') {
      this.factions = factionsCustomExpert;
    }

    if (boardSettings.locations === 'custom') {
      this.locations = locationsCustom;
    }

    if (boardSettings.ix === 'custom-beginner') {
      this.ix = ixCustomBeginner;
    } else if (boardSettings.ix === 'custom-advanced') {
      this.ix === ixCustomAdvanced;
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

    result.push(ixCustomAdvanced);

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
