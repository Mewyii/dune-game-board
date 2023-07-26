import { Component, Input, OnInit } from '@angular/core';
import { Faction, RewardType } from 'src/app/models';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { PlayerManager } from 'src/app/services/player-manager.service';
import { PlayerScore, PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { TranslateService } from 'src/app/services/translate-service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-dune-faction',
  templateUrl: './dune-faction.component.html',
  styleUrls: ['./dune-faction.component.scss'],
})
export class DuneFactionComponent implements OnInit {
  @Input() faction: Faction = {
    title: { de: 'fremen', en: 'fremen' },
    type: 'fremen',
    position: {
      marginBottom: 16,
      marginLeft: 16,
      width: 600,
    },
    actionFields: [
      {
        title: { de: 'abgehärtete Krieger', en: 'hardy warriors' },
        actionType: 'fremen',
        costs: [{ type: 'water', amount: 1 }],
        rewards: [{ type: 'troops', amount: 2 }],
        pathToImage: 'assets/images/fremen_warriors.jpeg',
        isBattlefield: true,
      },
      {
        title: { de: 'destillanzüge', en: 'stillsuits' },
        actionType: 'fremen',
        rewards: [{ type: 'water', amount: 1 }],
        pathToImage: '',
        isBattlefield: true,
      },
    ],
    pathToSymbol: 'assets/images/Fremen_Symbol.png',
    primaryColor: '#63a8ff',
    secondaryColor: '#5b81df',
  };
  @Input() actions: string = 'fremen';
  @Input() marginTop: number = 2000;
  @Input() marginLeft: number = 33;

  maxFavorScore: number = 7;
  public favorScoreArray: number[] = [];

  public playerScores: { playerId: number; score: number }[] = [];

  constructor(
    public playerManager: PlayerManager,
    public playerScoreManager: PlayerScoreManager,
    public translateService: TranslateService,
    public settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.favorScoreArray = new Array(this.maxFavorScore);
    this.playerScoreManager.playersScores$.subscribe((playerScores) => {
      if (this.faction.type === 'fremen') {
        this.playerScores = playerScores.map((x) => ({
          playerId: x.playerId,
          score: x.fremen,
        }));
      }
      if (this.faction.type === 'bene') {
        this.playerScores = playerScores.map((x) => ({
          playerId: x.playerId,
          score: x.bene,
        }));
      }
      if (this.faction.type === 'guild') {
        this.playerScores = playerScores.map((x) => ({
          playerId: x.playerId,
          score: x.guild,
        }));
      }
      if (this.faction.type === 'imperium') {
        this.playerScores = playerScores.map((x) => ({
          playerId: x.playerId,
          score: x.imperium,
        }));
      }
    });
  }

  public getPlayerColor(playerId: number) {
    return this.playerManager.getPlayerColor(playerId);
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  public getTitleColor(rgbColor: string) {
    const parts = rgbColor
      .substring(4, rgbColor.length - 1)
      .split(' ')
      .map((x) => parseInt(x));
    let result = 'rgb(';
    for (let part of parts) {
      part = part + 10;
      result = result + ' ' + part;
    }
    result = result + ')';
    return result;
  }
}
