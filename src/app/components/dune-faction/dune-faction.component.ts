import { Component, Input, OnInit } from '@angular/core';
import { Faction, Reward, RewardType } from 'src/app/models';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { PlayersService } from 'src/app/services/players.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { TranslateService } from 'src/app/services/translate-service';
import { AppMode } from 'src/app/constants/board-settings';
import { GameModifiersService } from 'src/app/services/game-modifier.service';
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
      marginTop: 16,
      marginLeft: 16,
      width: 600,
    },
    actionFields: [
      {
        title: { de: 'fremenKrieger', en: 'fremen warriors' },
        actionType: 'fremen',
        costs: [{ type: 'water', amount: 1 }],
        rewards: [{ type: 'troop', amount: 2 }],
        pathToImage: 'assets/images/fremen_warriors.jpeg',
      },
      {
        title: { de: 'wüstenausrüstung', en: 'desert equipment' },
        actionType: 'fremen',
        rewards: [{ type: 'water', amount: 1 }],
        pathToImage: '',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Fremen.png',
    primaryColor: '#63a8ff',
    secondaryColor: '#5b81df',
  };
  @Input() actions: string = 'fremen';
  @Input() marginTop: number = 2000;
  @Input() marginLeft: number = 33;
  @Input() mode: AppMode = 'board';

  public influenceScoreArray: number[] = [];
  public allianceTreshold = 0;

  public playerScores: { playerId: number; score: number }[] = [];

  public allianceTakenByPlayerId = 0;

  public excludedPlayers: number[] = [];

  constructor(
    public playerManager: PlayersService,
    public playerScoreManager: PlayerScoreManager,
    public t: TranslateService,
    public gameModifiersService: GameModifiersService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.influenceScoreArray = new Array(this.settingsService.getFactionInfluenceMaxScore() + 1);
    this.allianceTreshold = this.settingsService.getFactionInfluenceAllianceTreshold() - 1;

    this.playerScoreManager.playerScores$.subscribe((playerScores) => {
      const factionType = this.faction.type;
      if (factionType === 'fremen' || factionType === 'bene' || factionType === 'guild' || factionType === 'emperor') {
        this.playerScores = playerScores.map((x) => ({
          playerId: x.playerId,
          score: x[factionType],
        }));

        this.allianceTakenByPlayerId =
          this.playerScoreManager.playerAlliances.find((x) =>
            x.alliances.some((allianceType) => allianceType === factionType)
          )?.playerId ?? 0;
      }
    });

    this.playerScoreManager.playerAlliances$.subscribe((playerAlliances) => {
      const factionType = this.faction.type;
      if (factionType === 'fremen' || factionType === 'bene' || factionType === 'guild' || factionType === 'emperor') {
        this.allianceTakenByPlayerId =
          playerAlliances.find((x) => x.alliances.some((allianceType) => allianceType === factionType))?.playerId ?? 0;
      }
    });

    this.gameModifiersService.playerGameModifiers$.subscribe((gameModifiers) => {
      this.excludedPlayers = gameModifiers
        .filter(
          (x) =>
            x.factionInfluence &&
            x.factionInfluence.some((x) => x.factionType === this.faction.type && x.noInfluence === true)
        )
        .map((x) => x.playerId);
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

  public isExcluded(playerId: number) {
    return this.excludedPlayers.includes(playerId);
  }

  public trackPlayerScore(index: number, playerScore: { playerId: number; score: number }) {
    return playerScore.playerId * 100 + playerScore.score;
  }
}
