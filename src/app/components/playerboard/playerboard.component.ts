import { Component, OnInit } from '@angular/core';
import { FactionType, LanguageString, ResourceType, RewardType } from 'src/app/models';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { GameManager, PlayerAgents } from 'src/app/services/game-manager.service';
import { cloneDeep } from 'lodash';
import { Player, PlayerManager } from 'src/app/services/player-manager.service';
import { PlayerScore, PlayerScoreManager, PlayerScoreType } from 'src/app/services/player-score-manager.service';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { LeadersService } from 'src/app/services/leaders.service';
import { TranslateService } from 'src/app/services/translate-service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AudioManager } from 'src/app/services/audio-manager.service';

@Component({
  selector: 'app-playerboard',
  templateUrl: './playerboard.component.html',
  styleUrls: ['./playerboard.component.scss'],
})
export class PlayerboardComponent implements OnInit {
  public players: Player[] = [];
  public currentTurn = 0;
  public turnState = '';
  public availablePlayerAgents: PlayerAgents[] = [];

  public playerScores: PlayerScore[] = [];

  public playersString: LanguageString = { de: 'Spieler', en: 'Players' };
  public roundString: LanguageString = { de: 'Runde', en: 'Round' };

  constructor(
    public gameManager: GameManager,
    public playerManager: PlayerManager,
    public playerScoreManager: PlayerScoreManager,
    public leadersService: LeadersService,
    public translateService: TranslateService,
    private audioManager: AudioManager,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.playerManager.players$.subscribe((players) => {
      this.players = players;
    });

    this.gameManager.currentRound$.subscribe((currentTurn) => {
      this.currentTurn = currentTurn;
    });

    this.gameManager.currentRoundState$.subscribe((currentTurnState) => {
      this.turnState = currentTurnState;
    });

    this.gameManager.availablePlayerAgents$.subscribe((availablePlayerAgents) => {
      this.availablePlayerAgents = availablePlayerAgents;
    });

    this.playerScoreManager.playerScores$.subscribe((playerScores) => {
      this.playerScores = playerScores;
    });
  }

  onAddPlayerClicked() {
    this.playerManager.addPlayer();
  }

  onRemovePlayerClicked() {
    this.playerManager.removePlayer();
  }

  onSetAIActiveClicked(id: number, event: MatSlideToggleChange) {
    this.playerManager.setAIActiveForPlayer(id, event.checked);
  }

  onSetCurrentAIPlayerClicked(id: number) {
    this.gameManager.setCurrentAIPlayer(id);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onAddResourceClicked(id: number, type: ResourceType) {
    this.playerManager.addResourceToPlayer(id, type, 1);
  }

  onRemoveResourceClicked(id: number, type: ResourceType) {
    this.playerManager.removeResourceFromPlayer(id, type, 1);
  }

  onAddPlayerScoreClicked(id: number, scoreType: PlayerScoreType) {
    this.playerScoreManager.addPlayerScore(id, scoreType, 1);
  }

  onRemovePlayerScoreClicked(id: number, scoreType: PlayerScoreType) {
    this.playerScoreManager.removePlayerScore(id, scoreType, 1);
  }

  onAddPlayerAgentClicked(id: number) {
    this.gameManager.addAgentToPlayer(id);
  }

  onRemovePlayerAgentClicked(id: number) {
    this.gameManager.removeAgentFromPlayer(id);
  }

  onStartGameClicked() {
    this.gameManager.startGame();
  }

  onNextPlayerClicked() {
    this.audioManager.playSound('click-soft');
    this.gameManager.setNextPlayerActive('agent-placement');
  }

  onBeginCombatClicked() {
    this.gameManager.setTurnState('combat');
  }

  onNextRoundClicked() {
    this.gameManager.setNextRound();
  }

  onFinishGameClicked() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Are you sure you want to finish the game?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.gameManager.finishGame();
      }
    });
  }

  public getAvailablePlayerAgents(playerId: number) {
    const playerAgents = this.availablePlayerAgents.find((x) => x.playerId === playerId);
    return playerAgents ? playerAgents.agentAmount : 0;
  }

  public getPlayerScore(playerId: number, scoreType: PlayerScoreType) {
    const playerScore = this.playerScores.find((x) => x.playerId === playerId);
    if (playerScore) {
      return playerScore[scoreType];
    } else {
      return 0;
    }
  }

  getPlayerLeaderName(playerId: number) {
    const playerLeader = this.leadersService.playerLeaders.find((x) => x.playerId === playerId);
    if (playerLeader) {
      return playerLeader.leaderName;
    } else {
      return 'p. ' + playerId;
    }
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  public getFactionTypePath(rewardType: FactionType) {
    return getFactionTypePath(rewardType);
  }
}
