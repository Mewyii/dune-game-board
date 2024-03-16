import { Component, Input, OnInit } from '@angular/core';
import { Reward, RewardType } from 'src/app/models';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { PlayerManager } from 'src/app/services/player-manager.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { SettingsService } from 'src/app/services/settings.service';
import { AppMode } from 'src/app/constants/board-settings';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
})
export class ScoreboardComponent implements OnInit {
  @Input() mode: AppMode = 'board';
  @Input() useVictoryPointBoni? = false;

  public scoreArray: number[] = [];

  public playerVictoryPoints: { playerId: number; amount: number }[] = [];

  constructor(public playerManager: PlayerManager, public playerScoreManager: PlayerScoreManager) {}

  ngOnInit(): void {
    this.scoreArray = new Array(this.playerScoreManager.maxScore);

    this.playerScoreManager.playerScores$.subscribe((playerScores) => {
      this.playerVictoryPoints = playerScores.map((x) => ({
        playerId: x.playerId,
        amount: x.victoryPoints,
      }));
    });
  }

  public getPlayerColor(playerId: number) {
    return this.playerManager.getPlayerColor(playerId);
  }

  public scoreHasReward(score: number) {
    return this.playerScoreManager.scoreRewards.some((x) => x.score === score);
  }

  public getRewardAmount(score: number) {
    return this.playerScoreManager.scoreRewards.find((x) => x.score === score)?.reward.amount;
  }

  public getRewardTypePath(score: number) {
    const reward = this.playerScoreManager.scoreRewards.find((x) => x.score === score);
    return reward ? getRewardTypePath(reward.reward.type) : '';
  }

  public trackPlayerScore(index: number, playerScore: { playerId: number; amount: number }) {
    return playerScore.playerId * 100 + playerScore.amount;
  }
}
