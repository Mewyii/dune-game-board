import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppMode, VictoryPointReward } from 'src/app/constants/board-settings';
import { EffectReward } from 'src/app/models';
import { AIManager } from 'src/app/services/ai/ai.manager';
import { EffectsService } from 'src/app/services/game-effects.service';

import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { SettingsService } from 'src/app/services/settings.service';

interface VictoryPointScore {
  amount: number;
  reward?: EffectReward;
}

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss'],
  standalone: false,
})
export class ScoreboardComponent implements OnInit, OnDestroy {
  @Input() mode: AppMode = 'board';

  subscriptions: Subscription[] = [];

  scoreArray: VictoryPointScore[] = [];

  playerVictoryPoints: { playerId: number; amount: number }[] = [];

  victoryPointBoni: VictoryPointReward[] | undefined;
  finaleTriggerLow: number | undefined;
  finaleTriggerMedium: number | undefined;
  finaleTriggerHigh: number | undefined;

  playerColors: { [key: number]: string } = {};

  constructor(
    private playersService: PlayersService,
    private playerScoreManager: PlayerScoreManager,
    private settingsService: SettingsService,
    private effectsService: EffectsService,
    private aiManager: AIManager,
  ) {}

  ngOnInit(): void {
    const playerScoresSub = this.playerScoreManager.playerScores$.subscribe((playerScores) => {
      this.playerVictoryPoints = playerScores.map((x) => ({
        playerId: x.playerId,
        amount: x.victoryPoints,
      }));
    });

    const gameContentSub = this.settingsService.gameContent$.subscribe((x) => {
      this.scoreArray = [];
      const maxVictoryPoints = x.maxVictoryPoints ?? 13;
      for (let i = 0; i < maxVictoryPoints; i++) {
        const victoryPointReward = x.victoryPointBoni?.find((x) => x.score === i)?.reward;
        if (!victoryPointReward) {
          this.scoreArray.push({ amount: i });
        } else {
          this.scoreArray.push({ amount: i, reward: victoryPointReward });
        }
      }
      this.victoryPointBoni = x.victoryPointBoni;

      const finaleTriggers = x.finaleTrigger;
      if (finaleTriggers && finaleTriggers.length > 0) {
        finaleTriggers.sort((a, b) => a.trigger - b.trigger);
        this.finaleTriggerLow = finaleTriggers[0]?.trigger;
        this.finaleTriggerMedium = finaleTriggers[1]?.trigger;
        this.finaleTriggerHigh = finaleTriggers[2]?.trigger;
      }
    });

    const playerColorsSub = this.playersService.playerColors$.subscribe((playerColors) => {
      this.playerColors = playerColors;
    });

    this.subscriptions.push(playerScoresSub, gameContentSub, playerColorsSub);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onIncreaseFactionScoreClicked(playerId: number, currentScore: number) {
    if (currentScore === this.scoreArray.length) {
      return;
    }

    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }
    this.effectsService.addRewardToPlayer(playerId, {
      type: 'victory-point',
    });
    this.aiManager.setPreferredFieldsForAIPlayer(player.id);
  }

  onDecreaseFactionScoreClicked(playerId: number, currentScore: number) {
    if (currentScore === 0) {
      return false;
    }

    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return false;
    }

    this.effectsService.payCostForPlayer(playerId, {
      type: 'victory-point',
    });
    this.aiManager.setPreferredFieldsForAIPlayer(player.id);

    return false;
  }

  trackPlayerScore(playerScore: { playerId: number; amount: number }) {
    return playerScore.playerId * 100 + playerScore.amount;
  }
}
