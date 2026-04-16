import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { AI, AppMode, GameContent, Settings, boardSettings } from '../constants/board-settings';
import { gameContentCustomBeginner, gameContentCustomExpert, gameContentOriginal } from '../constants/game-content';
import { aiCustomBeginner } from '../constants/game-content/custom-beginner/ai';
import { aiCustomExpert } from '../constants/game-content/custom-expert/ai';
import { aiOriginal } from '../constants/game-content/original/ai';
import { ActionField, FactionInfluenceReward, FactionType, LanguageType } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private AIs = [aiOriginal, aiCustomBeginner, aiCustomExpert];
  private AISubject = new BehaviorSubject<AI>(aiOriginal);
  AI$ = this.AISubject.asObservable();

  private gameContentsSubject = new BehaviorSubject<GameContent[]>([
    gameContentOriginal,
    gameContentCustomBeginner,
    gameContentCustomExpert,
  ]);
  gameContents$ = this.gameContentsSubject.asObservable();

  private fields: ActionField[] = [];
  spiceAccumulationFields: string[] = [];
  controllableLocations: string[] = [];
  unblockableFields: ActionField[] = [];

  factionInfluenceRewards: { factionId: FactionType; rewards: FactionInfluenceReward }[] = [];

  private settingsSubject = new BehaviorSubject<Settings>(boardSettings);
  private settings$ = this.settingsSubject.asObservable();
  gameContent$ = this.settings$.pipe(
    map((x) => x.gameContent),
    distinctUntilChanged((prev, next) => prev.name === next.name),
  );
  mode$ = this.settings$.pipe(
    map((x) => x.mode),
    distinctUntilChanged(),
  );
  language$ = this.settings$.pipe(
    map((x) => x.language),
    distinctUntilChanged(),
  );
  eventsEnabled$ = this.settings$.pipe(
    map((x) => x.eventsEnabled),
    distinctUntilChanged(),
  );
  autoplayMusic$ = this.settings$.pipe(
    map((x) => x.autoplayMusic),
    distinctUntilChanged(),
  );

  constructor() {
    const gameContentsString = localStorage.getItem('gameContents');
    if (gameContentsString) {
      let gameContents = JSON.parse(gameContentsString) as GameContent[];

      this.gameContentsSubject.next(gameContents);
    }

    const settingsString = localStorage.getItem('settings');
    if (settingsString) {
      let settings = JSON.parse(settingsString) as Settings;

      this.settingsSubject.next(settings);

      const ai = this.AIs.find((x) => x.name === settings.gameContent.aiName);
      this.AISubject.next(ai ?? aiOriginal);
    }

    this.settings$.subscribe((settings) => {
      this.setFields();
      localStorage.setItem('settings', JSON.stringify(settings));
    });
    this.gameContents$.subscribe((gameContents) => {
      localStorage.setItem('gameContents', JSON.stringify(gameContents));
    });
  }

  private get settings() {
    return cloneDeep(this.settingsSubject.value);
  }

  get gameContent() {
    return cloneDeep(this.settingsSubject.value.gameContent);
  }

  get ai() {
    return cloneDeep(this.AISubject.value);
  }

  get mode() {
    return cloneDeep(this.settingsSubject.value.mode);
  }

  get language() {
    return cloneDeep(this.settingsSubject.value.language);
  }

  get eventsEnabled() {
    return cloneDeep(this.settingsSubject.value.eventsEnabled);
  }

  get boardFields() {
    return cloneDeep(this.fields);
  }

  getFactionName(factionType: FactionType) {
    return cloneDeep(this.settingsSubject.value.gameContent.factions.find((x) => x.type === factionType)?.title);
  }

  getFactionColor(factionType: FactionType) {
    return cloneDeep(this.settingsSubject.value.gameContent.factions.find((x) => x.type === factionType)?.primaryColor);
  }

  getBoardField(id: string) {
    return this.fields.find((x) => x.title.en === id);
  }

  getBoardLocations() {
    return cloneDeep(this.settingsSubject.value.gameContent.locations);
  }

  getBoardLocation(id: string) {
    return cloneDeep(this.settingsSubject.value.gameContent.locations.find((x) => x.actionField.title.en === id));
  }

  getConflicts() {
    return cloneDeep(this.settingsSubject.value.gameContent.conflicts);
  }

  getConflictCardsPerLevel() {
    return cloneDeep(this.settingsSubject.value.gameContent.conflictCardsPerLevel);
  }

  getConflictsMode() {
    return cloneDeep(this.settingsSubject.value.gameContent.conflictsMode);
  }

  getStartingResources() {
    return cloneDeep(this.settingsSubject.value.gameContent.startingResources);
  }

  getHighCouncilPersuasionAmount() {
    return cloneDeep(this.settingsSubject.value.gameContent.highCouncilPersuasion);
  }

  getTroopStrength() {
    return cloneDeep(this.settingsSubject.value.gameContent.troopCombatStrength);
  }

  getDreadnoughtStrength() {
    return cloneDeep(this.settingsSubject.value.gameContent.dreadnoughtCombatStrength);
  }

  getMaxPlayerDreadnoughtCount() {
    return cloneDeep(this.settingsSubject.value.gameContent.maxPlayerDreadnoughtCount);
  }

  getMaxPlayerIntrigueCount() {
    return cloneDeep(this.settingsSubject.value.gameContent.maxPlayerIntrigueCount);
  }

  getLocationTakeoverTroopCosts() {
    return cloneDeep(this.settingsSubject.value.gameContent.locationTakeoverTroopCosts ?? 0);
  }

  getCombatMaxDeployableUnits() {
    return cloneDeep(this.settingsSubject.value.gameContent.combatMaxDeployableUnits);
  }

  getUseTechtiles() {
    return cloneDeep(this.settingsSubject.value.gameContent.useTechTiles);
  }

  getUseDreadnoughts() {
    return cloneDeep(this.settingsSubject.value.gameContent.useDreadnoughts);
  }

  getFactions() {
    return cloneDeep(this.settingsSubject.value.gameContent.factions);
  }

  getVictoryPointsBoni() {
    return cloneDeep(this.settingsSubject.value.gameContent.victoryPointBoni);
  }

  getFinaleTrigger() {
    return cloneDeep(this.settingsSubject.value.gameContent.finaleTrigger);
  }

  getRecruitmentCardAmount() {
    return cloneDeep(this.settingsSubject.value.gameContent.recruitmentCardAmount);
  }

  getFactionInfluenceMaxScore() {
    return cloneDeep(this.settingsSubject.value.gameContent.factionInfluenceMaxScore);
  }

  getFactionInfluenceAllianceTreshold() {
    return cloneDeep(this.settingsSubject.value.gameContent.factionInfluenceAllianceTreshold);
  }

  getImperiumRowCards() {
    return cloneDeep(this.settingsSubject.value.gameContent.imperiumRowCards);
  }

  getMaxPlayers() {
    return cloneDeep(this.settingsSubject.value.gameContent.maxPlayers);
  }

  getCustomCards() {
    return cloneDeep(this.settingsSubject.value.gameContent.customCards);
  }

  getCardAcquiringRuleFoldspace() {
    return cloneDeep(this.settingsSubject.value.gameContent.cardAcquiringRules.foldspace);
  }
  getCardAcquiringRuleImperiumRow() {
    return cloneDeep(this.settingsSubject.value.gameContent.cardAcquiringRules.imperiumRow);
  }
  getCardAcquiringRuleLimited() {
    return cloneDeep(this.settingsSubject.value.gameContent.cardAcquiringRules.limited);
  }
  getCardAcquiringRuleUnlimited() {
    return cloneDeep(this.settingsSubject.value.gameContent.cardAcquiringRules.unlimited);
  }
  getChurnRowCards() {
    return cloneDeep(this.settingsSubject.value.gameContent.churnRowCards);
  }

  setFields() {
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
    const gameContent = this.gameContentsSubject.value.find((x) => x.name === name);
    if (gameContent) {
      this.settingsSubject.next({ ...this.settings, gameContent });
      const ai = this.AIs.find((x) => x.name === gameContent.aiName);
      this.AISubject.next(ai ?? aiOriginal);
    }
  }

  setCustomGameContent(gameContent: GameContent) {
    gameContent.name = 'custom';

    const gameContents = this.gameContentsSubject.value;
    const index = gameContents.findIndex((x) => x.name === gameContent.name);
    if (index < 0) {
      this.gameContentsSubject.next([...gameContents, gameContent]);
    } else {
      gameContents[index] = gameContent;
      this.gameContentsSubject.next(gameContents);
    }
    this.setGameContent(gameContent.name);
  }

  enableEvents(value: boolean) {
    this.settingsSubject.next({ ...this.settings, eventsEnabled: value });
  }

  setMode(mode: AppMode) {
    this.settingsSubject.next({ ...this.settings, mode });
  }
}
