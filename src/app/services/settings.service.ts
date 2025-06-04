import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { AppMode, GameContent, Settings, boardSettings } from '../constants/board-settings';
import { gameContentCustomBeginner, gameContentCustomExpert, gameContentOriginal } from '../constants/game-content';
import { ActionField, FactionInfluenceReward, FactionType, LanguageType } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private gameContents: GameContent[] = [gameContentOriginal, gameContentCustomBeginner, gameContentCustomExpert];

  private fields: ActionField[] = [];
  public spiceAccumulationFields: string[] = [];
  public controllableLocations: string[] = [];
  public unblockableFields: ActionField[] = [];

  public factionInfluenceRewards: { factionId: FactionType; rewards: FactionInfluenceReward }[] = [];

  private settingsSubject = new BehaviorSubject<Settings>(boardSettings);
  private settings$ = this.settingsSubject.asObservable();
  public gameContent$ = this.settings$.pipe(
    map((x) => x.gameContent),
    distinctUntilChanged((prev, next) => prev.name === next.name)
  );
  public mode$ = this.settings$.pipe(
    map((x) => x.mode),
    distinctUntilChanged()
  );
  public language$ = this.settings$.pipe(
    map((x) => x.language),
    distinctUntilChanged()
  );
  public eventsEnabled$ = this.settings$.pipe(
    map((x) => x.eventsEnabled),
    distinctUntilChanged()
  );
  public autoplayMusic$ = this.settings$.pipe(
    map((x) => x.autoplayMusic),
    distinctUntilChanged()
  );

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
      this.setFields();
      localStorage.setItem('settings', JSON.stringify(settings));
    });
  }

  private get settings() {
    return cloneDeep(this.settingsSubject.value);
  }

  private get gameContent() {
    return cloneDeep(this.settingsSubject.value.gameContent);
  }

  public get mode() {
    return cloneDeep(this.settingsSubject.value.mode);
  }

  public get language() {
    return cloneDeep(this.settingsSubject.value.language);
  }

  public get eventsEnabled() {
    return cloneDeep(this.settingsSubject.value.eventsEnabled);
  }

  public get boardFields() {
    return cloneDeep(this.fields);
  }

  getFactionName(factionType: FactionType) {
    return cloneDeep(this.settingsSubject.value.gameContent.factions.find((x) => x.type === factionType)?.title);
  }

  getFactionColor(factionType: FactionType) {
    return cloneDeep(this.settingsSubject.value.gameContent.factions.find((x) => x.type === factionType)?.primaryColor);
  }

  public getBoardField(id: string) {
    return this.fields.find((x) => x.title.en === id);
  }

  public getBoardLocations() {
    return cloneDeep(this.settingsSubject.value.gameContent.locations);
  }

  public getBoardLocation(id: string) {
    return cloneDeep(this.settingsSubject.value.gameContent.locations.find((x) => x.actionField.title.en === id));
  }

  public getStartingResources() {
    return cloneDeep(this.settingsSubject.value.gameContent.startingResources);
  }

  public getHighCouncilPersuasionAmount() {
    return cloneDeep(this.settingsSubject.value.gameContent.highCouncilPersuasion);
  }

  public getTroopStrength() {
    return cloneDeep(this.settingsSubject.value.gameContent.troopCombatStrength);
  }

  public getDreadnoughtStrength() {
    return cloneDeep(this.settingsSubject.value.gameContent.dreadnoughtCombatStrength);
  }

  public getLocationTakeoverTroopCosts() {
    return cloneDeep(this.settingsSubject.value.gameContent.locationTakeoverTroopCosts);
  }

  public getCombatMaxDeployableUnits() {
    return cloneDeep(this.settingsSubject.value.gameContent.combatMaxDeployableUnits);
  }

  public getFactions() {
    return cloneDeep(this.settingsSubject.value.gameContent.factions);
  }

  public getVictoryPointsBoni() {
    return cloneDeep(this.settingsSubject.value.gameContent.victoryPointBoni);
  }

  public getFinaleTrigger() {
    return cloneDeep(this.settingsSubject.value.gameContent.finaleTrigger);
  }

  public getRecruitmentCardAmount() {
    return cloneDeep(this.settingsSubject.value.gameContent.recruitmentCardAmount);
  }

  public getFactionInfluenceMaxScore() {
    return cloneDeep(this.settingsSubject.value.gameContent.factionInfluenceMaxScore);
  }

  public getFactionInfluenceAllianceTreshold() {
    return cloneDeep(this.settingsSubject.value.gameContent.factionInfluenceAllianceTreshold);
  }

  public getImperiumRowCards() {
    return cloneDeep(this.settingsSubject.value.gameContent.imperiumRowCards);
  }

  getCustomCards() {
    return cloneDeep(this.settingsSubject.value.gameContent.customCards);
  }

  public setFields() {
    const gameContent = this.gameContent;
    const result: ActionField[] = [];
    for (const faction of gameContent.factions) {
      for (const field of faction.actionFields) {
        result.push(field);
      }
    }
    for (const location of gameContent.locations) {
      result.push(location.actionField);
    }
    if (gameContent.ix) {
      result.push(gameContent.ix);
    }

    this.fields = result;
    this.unblockableFields = this.fields.filter((x) => x.isNonBlockingField);
    this.spiceAccumulationFields = this.fields
      .filter((x) => x.rewards.some((x) => x.type === 'spice-accumulation'))
      .map((x) => x.title.en);
    this.controllableLocations = gameContent.locations
      .filter((x) => x.actionField.ownerReward)
      .map((x) => x.actionField.title.en);

    this.factionInfluenceRewards = gameContent.factions
      .filter((x) => x.influenceRewards)
      .map((x) => ({ factionId: x.type, rewards: x.influenceRewards! }));
  }

  changeLanguage(lang: LanguageType) {
    this.settingsSubject.next({ ...this.settings, language: lang });
  }

  setAutoplayMusic(autoplayMusic: boolean) {
    this.settingsSubject.next({ ...this.settings, autoplayMusic });
  }

  setGameContent(name: string) {
    const gameContent = this.gameContents.find((x) => x.name === name);
    if (gameContent) {
      this.settingsSubject.next({ ...this.settings, gameContent });
    }
  }

  enableEvents(value: boolean) {
    this.settingsSubject.next({ ...this.settings, eventsEnabled: value });
  }

  setMode(mode: AppMode) {
    this.settingsSubject.next({ ...this.settings, mode });
  }
}
