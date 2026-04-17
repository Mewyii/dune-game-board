import { Component, Input, OnInit } from '@angular/core';
import { AppMode, VictoryPointReward } from 'src/app/constants/board-settings';
import { EFFECT_TYPE_PATHS } from 'src/app/helpers/reward-types';
import { AIManager } from 'src/app/services/ai/ai.manager';
import { EffectsService } from 'src/app/services/game-effects.service';

import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  standalone: false,
})
export class ScoreboardComponent implements OnInit {
  @Input() mode: AppMode = 'board';

  scoreArray: number[] = [];

  playerVictoryPoints: { playerId: number; amount: number }[] = [];

  victoryPointBoni: VictoryPointReward[] | undefined;
  finaleTrigger = 9;

  playerColors: { [key: number]: string } = {};

  constructor(
    private playersService: PlayersService,
    private playerScoreManager: PlayerScoreManager,
    private settingsService: SettingsService,
    private effectsService: EffectsService,
    private aiManager: AIManager,
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

    this.playersService.playerColors$.subscribe((playerColors) => {
      this.playerColors = playerColors;
    });
  }

  onIncreaseFactionScoreClicked(playerId: number) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }
    this.effectsService.addRewardToPlayer(playerId, {
      type: 'victory-point',
    });
    this.aiManager.setPreferredFieldsForAIPlayer(player);
  }

  onDecreaseFactionScoreClicked(playerId: number) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }

    this.effectsService.payCostForPlayer(playerId, {
      type: 'victory-point',
    });
    this.aiManager.setPreferredFieldsForAIPlayer(player);

    return false;
  }

  scoreHasReward(score: number) {
    return this.victoryPointBoni?.some((x) => x.score === score);
  }

  getRewardAmount(score: number) {
    return this.victoryPointBoni?.find((x) => x.score === score)?.reward.amount;
  }

  getEffectTypePath(score: number) {
    const reward = this.victoryPointBoni?.find((x) => x.score === score);
    return reward ? EFFECT_TYPE_PATHS[reward.reward.type] : '';
  }

  trackPlayerScore(playerScore: { playerId: number; amount: number }) {
    return playerScore.playerId * 100 + playerScore.amount;
  }
}
