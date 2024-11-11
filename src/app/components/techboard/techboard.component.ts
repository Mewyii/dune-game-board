import { Component, Input, OnInit } from '@angular/core';
import { ActionField } from 'src/app/models';
import { PlayersService } from 'src/app/services/players.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { GameManager } from 'src/app/services/game-manager.service';

@Component({
  selector: 'app-techboard',
  templateUrl: './techboard.component.html',
  styleUrls: ['./techboard.component.scss'],
})
export class TechboardComponent implements OnInit {
  @Input() ix: ActionField | undefined;
  @Input() useTechTiles = false;

  public activePlayerId = 0;
  public playerTechAgents: { playerId: number; techAgents: number }[] = [];

  constructor(
    public playerManager: PlayersService,
    public playerScoreManager: PlayerScoreManager,
    private gameManager: GameManager,
    private audioManager: AudioManager
  ) {}

  ngOnInit(): void {
    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
    });

    this.playerManager.players$.subscribe((players) => {
      this.playerTechAgents = players.map((x) => ({ playerId: x.id, techAgents: x.techAgents }));
    });
  }

  onAddTechAgentClicked() {
    this.audioManager.playSound('click-soft');
    this.playerManager.addTechAgentsToPlayer(this.activePlayerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onRemoveTechAgentClicked() {
    this.audioManager.playSound('click-soft');
    this.playerManager.removeTechAgentsFromPlayer(this.activePlayerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
    return false;
  }

  public getPlayerColor(playerId: number) {
    return this.playerManager.getPlayerColor(playerId);
  }
}
