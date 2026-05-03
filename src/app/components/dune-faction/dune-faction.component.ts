import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppMode } from 'src/app/constants/board-settings';

import { Faction } from 'src/app/models';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService } from 'src/app/services/game-modifier.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'app-dune-faction',
  templateUrl: './dune-faction.component.html',
  styleUrls: ['./dune-faction.component.scss'],
  standalone: false,
})
export class DuneFactionComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

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

  influenceScoreArray: number[] = [];
  allianceTreshold = 0;

  playerScores: { playerId: number; score: number }[] = [];

  allianceTakenByPlayerId = 0;

  excludedPlayers: number[] = [];

  titleColor = '';

  playerColors: { [key: number]: string } = {};

  constructor(
    public t: TranslateService,
    private playersService: PlayersService,
    private playerScoreManager: PlayerScoreManager,
    private gameModifiersService: GameModifiersService,
    private settingsService: SettingsService,
    private gameManager: GameManager,
  ) {}

  ngOnInit(): void {
    this.influenceScoreArray = new Array(this.settingsService.getFactionInfluenceMaxScore() + 1);
    this.allianceTreshold = this.settingsService.getFactionInfluenceAllianceTreshold() - 1;

    const playerScoresSub = this.playerScoreManager.playerScores$.subscribe((playerScores) => {
      const factionType = this.faction.type;
      if (factionType === 'fremen' || factionType === 'bene' || factionType === 'guild' || factionType === 'emperor') {
        this.playerScores = playerScores.map((x) => ({
          playerId: x.playerId,
          score: x[factionType],
        }));

        this.allianceTakenByPlayerId =
          this.playerScoreManager.playerAlliances.find((x) =>
            x.alliances.some((allianceType) => allianceType === factionType),
          )?.playerId ?? 0;
      }
    });

    const playerAlliancesSub = this.playerScoreManager.playerAlliances$.subscribe((playerAlliances) => {
      const factionType = this.faction.type;
      if (factionType === 'fremen' || factionType === 'bene' || factionType === 'guild' || factionType === 'emperor') {
        this.allianceTakenByPlayerId =
          playerAlliances.find((x) => x.alliances.some((allianceType) => allianceType === factionType))?.playerId ?? 0;
      }
    });

    const playerGameModifiersSub = this.gameModifiersService.playerGameModifiers$.subscribe((gameModifiers) => {
      this.excludedPlayers = gameModifiers
        .filter(
          (x) =>
            x.factionInfluence &&
            x.factionInfluence.some((x) => x.factionType === this.faction.type && x.noInfluence === true),
        )
        .map((x) => x.playerId);
    });

    const playerColorsSub = this.playersService.playerColors$.subscribe((playerColors) => {
      this.playerColors = playerColors;
    });

    this.subscriptions.push(playerScoresSub, playerAlliancesSub, playerGameModifiersSub, playerColorsSub);

    this.titleColor = this.getTitleColor(this.faction.primaryColor);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onIncreaseFactionScoreClicked(playerId: number) {
    this.gameManager.increasePlayerFactionScore(playerId, this.faction.type);
  }

  onDecreaseFactionScoreClicked(playerId: number) {
    this.gameManager.decreasePlayerFactionScore(playerId, this.faction.type);

    return false;
  }

  getTitleColor(rgbColor: string) {
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

  isExcluded(playerId: number) {
    return this.excludedPlayers.includes(playerId);
  }

  trackPlayerScore(playerScore: { playerId: number; score: number }) {
    return playerScore.playerId * 100 + playerScore.score;
  }
}
