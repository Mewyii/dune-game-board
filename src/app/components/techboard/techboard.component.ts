import { Component, Input, OnInit } from '@angular/core';
import { ActionField } from 'src/app/models';
import { PlayersService } from 'src/app/services/players.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { TurnInfoService } from 'src/app/services/turn-info.service';

@Component({
    selector: 'app-techboard',
    templateUrl: './techboard.component.html',
    styleUrls: ['./techboard.component.scss'],
    standalone: false
})
export class TechboardComponent implements OnInit {
  @Input() ix: ActionField | undefined;
  @Input() useTechTiles = false;

  public activePlayerId = 0;
  public playerTech: { playerId: number; amount: number }[] = [];

  public playerCanBuyTech = false;

  constructor(
    public playerManager: PlayersService,
    public playerScoreManager: PlayerScoreManager,
    private gameManager: GameManager,
    private audioManager: AudioManager,
    private turnInfoService: TurnInfoService
  ) {}

  ngOnInit(): void {
    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
    });

    this.playerManager.players$.subscribe((players) => {
      this.playerTech = players.map((x) => ({ playerId: x.id, amount: x.tech }));
    });

    this.turnInfoService.turnInfos$.subscribe((turnInfos) => {
      this.playerCanBuyTech = turnInfos.some((x) => x.canBuyTech);
    });
  }

  onAddTechAgentClicked() {
    this.audioManager.playSound('tech-agent');
    this.playerManager.addTechToPlayer(this.activePlayerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onRemoveTechAgentClicked() {
    this.audioManager.playSound('click-reverse');
    this.playerManager.removeTechFromPlayer(this.activePlayerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
    return false;
  }

  public getPlayerColor(playerId: number) {
    return this.playerManager.getPlayerColor(playerId);
  }
}
