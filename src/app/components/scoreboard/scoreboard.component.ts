import { Component, Input, OnInit } from '@angular/core';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { PlayersService } from 'src/app/services/players.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { SettingsService } from 'src/app/services/settings.service';
import { AppMode, VictoryPointReward } from 'src/app/constants/board-settings';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
})
export class ScoreboardComponent implements OnInit {
  @Input() mode: AppMode = 'board';

  public scoreArray: number[] = [];

  public playerVictoryPoints: { playerId: number; amount: number }[] = [];

  public victoryPointBoni: VictoryPointReward[] | undefined;
  public finaleTrigger = 9;

  constructor(
    private playerManager: PlayersService,
    public playerScoreManager: PlayerScoreManager,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.playerScoreManager.playerScores$.subscribe((playerScores) => {
      this.playerVictoryPoints = playerScores.map((x) => ({
        playerId: x.playerId,
        amount: x.victoryPoints,
      }));
    });

    this.settingsService.gameContent$.subscribe((x) => {
      this.scoreArray = new Array(x.maxVictoryPoints ?? 13);
      this.victoryPointBoni = x.victoryPointBoni;
      if (x.finaleTrigger) {
        this.finaleTrigger = x.finaleTrigger;
      }
    });
  }

  public getPlayerColor(playerId: number) {
    return this.playerManager.getPlayerColor(playerId);
  }

  public scoreHasReward(score: number) {
    return this.victoryPointBoni?.some((x) => x.score === score);
  }

  public getRewardAmount(score: number) {
    return this.victoryPointBoni?.find((x) => x.score === score)?.reward.amount;
  }

  public getEffectTypePath(score: number) {
    const reward = this.victoryPointBoni?.find((x) => x.score === score);
    return reward ? getEffectTypePath(reward.reward.type) : '';
  }

  public trackPlayerScore(index: number, playerScore: { playerId: number; amount: number }) {
    return playerScore.playerId * 100 + playerScore.amount;
  }
}
