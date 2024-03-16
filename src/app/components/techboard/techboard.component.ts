import { Component, Input, OnInit } from '@angular/core';
import { ActionField } from 'src/app/models';
import { PlayerManager } from 'src/app/services/player-manager.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';

@Component({
  selector: 'app-techboard',
  templateUrl: './techboard.component.html',
  styleUrls: ['./techboard.component.scss'],
})
export class TechboardComponent implements OnInit {
  @Input() ix: ActionField | undefined;
  @Input() useTechTiles = false;

  public playerTechAgents: { playerId: number; techAgents: number }[] = [];

  constructor(public playerManager: PlayerManager, public playerScoreManager: PlayerScoreManager) {}

  ngOnInit(): void {
    this.playerManager.players$.subscribe((players) => {
      this.playerTechAgents = players.map((x) => ({ playerId: x.id, techAgents: x.techAgents }));
    });
  }

  public getPlayerColor(playerId: number) {
    return this.playerManager.getPlayerColor(playerId);
  }
}
