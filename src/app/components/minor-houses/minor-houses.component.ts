import { Component, OnInit } from '@angular/core';
import { shuffle } from 'lodash';
import { imperiumCards } from 'src/app/constants/imperium-cards';
import { House, minorHouses } from 'src/app/constants/minor-houses';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { EffectType, FactionType, LanguageString, EffectRewardType } from 'src/app/models';
import { GameManager } from 'src/app/services/game-manager.service';
import { MinorHousesService } from 'src/app/services/minor-houses.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
    selector: 'dune-minor-houses',
    templateUrl: './minor-houses.component.html',
    styleUrls: ['./minor-houses.component.scss'],
    standalone: false
})
export class MinorHousesComponent implements OnInit {
  public activeMinorHouses: House[] = [];
  public title: LanguageString = { de: 'haus', en: 'house' };

  constructor(public gameManager: GameManager, public minorHousesService: MinorHousesService, public t: TranslateService) {}

  ngOnInit(): void {
    this.minorHousesService.currentAvailableHouses$.subscribe((houses) => {
      this.activeMinorHouses = houses;
    });
  }

  onTakeCardClicked(houseId: string) {
    this.minorHousesService.setPlayerHouse(this.gameManager.activePlayerId, houseId);
  }

  getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  getFactionTypePath(rewardType: FactionType) {
    return getFactionTypePath(rewardType);
  }

  getTransparentColor(color: string, opacity: number) {
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }
}
