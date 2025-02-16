import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { RewardType } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { LeadersService } from 'src/app/services/leaders.service';
import { LoggingService } from 'src/app/services/log.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { TranslateService } from 'src/app/services/translate-service';

interface PlayerSummary {
  playerId: number;
  playerName: string;
  playerImageURL: string;
  playerColor: string;
  playerRank: number;
  victoryPoints: number;
  victoryPointsGained: { round?: number; source?: string }[];
  victoryPointsLost: { round?: number; source?: string }[];
  combatsWon: (number | undefined)[];
  locationControlsGained: (number | undefined)[];
  locationControlsLost: (number | undefined)[];
  boughtCards: number;
  trashedCards: number;
  playedIntrigues: number;
  fontColor: string;
}

@Component({
  selector: 'dune-game-summary-dialog',
  templateUrl: './game-summary-dialog.component.html',
  styleUrl: './game-summary-dialog.component.scss',
})
export class GameSummaryDialogComponent implements OnInit {
  public players: Player[] = [];

  public playerSummaries: PlayerSummary[] = [];

  constructor(
    private dialogRef: MatDialogRef<GameSummaryDialogComponent>,
    public t: TranslateService,
    private playersService: PlayersService,
    private leadersService: LeadersService,
    private loggingService: LoggingService,
    private playerScoreManager: PlayerScoreManager
  ) {}

  ngOnInit(): void {
    this.players = this.playersService.getPlayers();
    const playerScores = this.playerScoreManager.playerScores;
    playerScores.sort((a, b) => b.victoryPoints - a.victoryPoints);

    this.playerSummaries = this.players.map((player) => {
      const leader = this.leadersService.getLeader(player.id);
      const playerName = leader ? this.t.translateLS(leader.name) : 'P.' + player.id;
      const playerImageURL = leader ? leader.imageUrl : '';

      const playerLogs = this.loggingService.getPlayerActionLog(player.id);
      const victoryPoints = playerScores.find((x) => x.playerId === player.id)?.victoryPoints ?? 0;
      const victoryPointsGained = playerLogs
        .filter((x) => x.type === 'victory-point-gain')
        .map((x: any) => ({ round: x.roundNumber, source: x.source }));
      const victoryPointsLost = playerLogs
        .filter((x) => x.type === 'victory-point-loss')
        .map((x: any) => ({ round: x.roundNumber, source: x.source }));
      const boughtCards = playerLogs.filter((x) => x.type === 'card-buy').length;
      const trashedCards = playerLogs.filter((x) => x.type === 'card-trash').length;
      const playedIntrigues = playerLogs.filter((x) => x.type === 'intrigue-play').length;
      const combatsWon = playerLogs.filter((x) => x.type === 'combat-win').map((x) => x.roundNumber);
      const locationControlsGained = playerLogs.filter((x) => x.type === 'location-control-gain').map((x) => x.roundNumber);
      const locationControlsLost = playerLogs.filter((x) => x.type === 'location-control-loss').map((x) => x.roundNumber);
      const playerColor = player.color;
      const fontColor = player.id === 1 || player.id == 3 ? '#101010' : '#e1e1e1';

      const playerRank = playerScores.findIndex((x) => x.playerId === player.id) + 1;

      return {
        playerId: player.id,
        playerName,
        playerImageURL,
        victoryPoints,
        victoryPointsGained,
        victoryPointsLost,
        boughtCards,
        trashedCards,
        playedIntrigues,
        combatsWon,
        locationControlsGained,
        locationControlsLost,
        playerColor,
        playerRank,
        fontColor,
      };
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }
}
