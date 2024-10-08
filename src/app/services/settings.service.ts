import { Injectable } from '@angular/core';
import { AppMode, GameContent, Settings, boardSettings } from '../constants/board-settings';
import { ActionField, FactionType, LanguageType } from '../models';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import {
  gameContentCustomAdvanced,
  gameContentCustomBeginner,
  gameContentCustomExpert,
  gameContentOriginal,
} from '../constants/game-content';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private gameContents: GameContent[] = [
    gameContentOriginal,
    gameContentCustomAdvanced,
    gameContentCustomBeginner,
    gameContentCustomExpert,
  ];

  private fields: ActionField[] = [];
  public spiceAccumulationFields: ActionField[] = [];
  public unblockableFields: ActionField[] = [];

  private settingsSubject = new BehaviorSubject<Settings>(boardSettings);
  public settings$ = this.settingsSubject.asObservable();
  public settings: Settings = boardSettings;

  constructor() {
    const settingsString = localStorage.getItem('settings');
    if (settingsString) {
      let settings = JSON.parse(settingsString) as Settings;

      // Workaround for local storage not being able to store functions
      const gameContent = this.gameContents.find((x) => x.name === settings.gameContent.name);
      if (gameContent) {
        settings.gameContent = gameContent;
      }

      this.settingsSubject.next(settings);
    }

    this.settings$.subscribe((settings) => {
      this.settings = cloneDeep(settings);
      this.setFields();
      localStorage.setItem('settings', JSON.stringify(settings));
    });
  }

  public get gameContent() {
    return this.settings.gameContent;
  }

  public get boardFields() {
    return cloneDeep(this.fields);
  }

  public getBoardField(id: string) {
    return this.fields.find((x) => x.title.en === id);
  }

  public getBoardLocations() {
    return cloneDeep(this.gameContent.locations);
  }

  public getBoardLocation(id: string) {
    return cloneDeep(this.gameContent.locations.find((x) => x.actionField.title.en === id));
  }

  public setFields() {
    const result: ActionField[] = [];
    for (const faction of this.gameContent.factions) {
      for (const field of faction.actionFields) {
        result.push(field);
      }
    }
    for (const location of this.gameContent.locations) {
      result.push(location.actionField);
    }
    if (this.gameContent.ix) {
      result.push(this.gameContent.ix);
    }

    this.fields = result;
    this.unblockableFields = this.fields.filter((x) => x.isNonBlockingField);
    this.spiceAccumulationFields = this.fields.filter((x) => x.rewards.some((x) => x.type === 'spice-accumulation'));
  }

  getFactionName(factionType: FactionType) {
    return this.gameContent.factions.find((x) => x.type === factionType)?.title;
  }

  getFactionColor(factionType: FactionType) {
    return this.gameContent.factions.find((x) => x.type === factionType)?.primaryColor;
  }

  changeLanguage(lang: LanguageType) {
    this.settingsSubject.next({ ...this.settings, language: lang });
  }

  getCustomCards() {
    return this.gameContent.customCards;
  }

  setGameContent(name: string) {
    const gameContent = this.gameContents.find((x) => x.name === name);
    if (gameContent) {
      this.settingsSubject.next({ ...this.settings, gameContent });
    }
  }

  setMode(mode: AppMode) {
    this.settingsSubject.next({ ...this.settings, mode });
  }
}
