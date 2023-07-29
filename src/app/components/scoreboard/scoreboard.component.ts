import { Component, OnInit } from '@angular/core';
import { Reward, RewardType } from 'src/app/models';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { PlayerManager } from 'src/app/services/player-manager.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
})
export class ScoreboardComponent implements OnInit {
  public maxScore = 14;
  public finaleTrigger = 9;

  public scoreRewards: { score: number; reward: Reward }[] = [];

  public scoreArray: number[] = [];

  public playerVictoryPoints: { playerId: number; amount: number }[] = [];

  constructor(
    public playerManager: PlayerManager,
    public playerScoreManager: PlayerScoreManager,
    public settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.scoreArray = new Array(this.maxScore);
    this.scoreRewards = [...new Array(this.maxScore)].map((x, i) => ({ score: i, reward: { type: 'troops' } }));
    this.scoreRewards.shift();

    this.playerScoreManager.playersScores$.subscribe((playerScores) => {
      this.playerVictoryPoints = playerScores.map((x) => ({
        playerId: x.playerId,
        amount: x.victoryPoints,
      }));
    });

    if (this.settingsService.board.content === 'custom-advanced') {
      this.finaleTrigger = 8;

      this.scoreRewards[1].reward = { type: 'conviction', amount: 1 };
      this.scoreRewards[3].reward = { type: 'conviction', amount: 1 };
      this.scoreRewards[5].reward = { type: 'card-round-start', amount: 1 };
      this.scoreRewards[7].reward = { type: 'conviction', amount: 1 };
      this.scoreRewards[9].reward = { type: 'conviction', amount: 1 };
      this.scoreRewards[11].reward = { type: 'card-round-start', amount: 1 };
    }
    if (this.settingsService.board.content === 'custom-expert') {
      this.finaleTrigger = 8;

      this.scoreRewards[1].reward = { type: 'conviction', amount: 1 };
      this.scoreRewards[3].reward = { type: 'card-round-start', amount: 1 };
      this.scoreRewards[5].reward = { type: 'buildup' };
      this.scoreRewards[7].reward = { type: 'conviction', amount: 1 };
      this.scoreRewards[9].reward = { type: 'card-round-start', amount: 1 };
      this.scoreRewards[11].reward = { type: 'buildup' };
    }
  }

  public getPlayerColor(playerId: number) {
    return this.playerManager.getPlayerColor(playerId);
  }

  public getArrayFromNumber(length: number) {
    return new Array(length);
  }

  public scoreHasReward(score: number) {
    return this.scoreRewards.some((x) => x.score === score);
  }

  public getRewardAmount(score: number) {
    return this.scoreRewards.find((x) => x.score === score)?.reward.amount;
  }

  public getRewardTypePath(score: number) {
    const reward = this.scoreRewards.find((x) => x.score === score);
    return reward ? getRewardTypePath(reward.reward.type) : '';
  }

  public trackPlayerScore(index: number, playerScore: { playerId: number; amount: number }) {
    return playerScore.playerId * 100 + playerScore.amount;
  }
}
