import { Component, Input, OnInit } from '@angular/core';
import { Reward, RewardType } from 'src/app/models';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { PlayerManager } from 'src/app/services/player-manager.service';
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
    private playerManager: PlayerManager,
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

    this.settingsService.settings$.subscribe((x) => {
      this.scoreArray = new Array(x.gameContent.maxVictoryPoints ?? 14);
      this.victoryPointBoni = x.gameContent.victoryPointBoni;
      if (x.gameContent.finaleTrigger) {
        this.finaleTrigger = x.gameContent.finaleTrigger;
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

  public getRewardTypePath(score: number) {
    const reward = this.victoryPointBoni?.find((x) => x.score === score);
    return reward ? getRewardTypePath(reward.reward.type) : '';
  }

  public trackPlayerScore(index: number, playerScore: { playerId: number; amount: number }) {
    return playerScore.playerId * 100 + playerScore.amount;
  }
}
