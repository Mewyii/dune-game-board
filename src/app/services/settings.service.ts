import { Injectable } from '@angular/core';
import { boardSettings } from '../constants/board-settings';
import { factionsCustomAdvanced } from '../constants/factions-custom-advanced';
import { factionsOriginal } from '../constants/factions-original';
import { factionsCustomBeginner } from '../constants/factions-custom-beginner';
import { locationsCustom } from '../constants/locations-custom';
import { locationsOriginal } from '../constants/locations-original';
import { locationsOriginalBalanced } from '../constants/locations-original-balanced';
import { factionsCustomExpert } from '../constants/factions-custom-expert';
import { ActionField } from '../models';
import { ix } from '../constants/ix-custom';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  public board = boardSettings;
  public factions = factionsOriginal;
  public locations = locationsOriginal;
  public ix = ix;

  constructor() {
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
  }

  public getAllFields() {
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

    return result;
  }
}
