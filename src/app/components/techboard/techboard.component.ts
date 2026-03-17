import { Component, Input, OnInit } from '@angular/core';
import { ActionField } from 'src/app/models';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { TurnInfoService } from 'src/app/services/turn-info.service';

@Component({
  selector: 'app-techboard',
  templateUrl: './techboard.component.html',
  styleUrls: ['./techboard.component.scss'],
  standalone: false,
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
    private turnInfoService: TurnInfoService,
  ) {}

  ngOnInit(): void {
    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
    });

    this.turnInfoService.turnInfos$.subscribe((turnInfos) => {
      this.playerCanBuyTech = turnInfos.some((x) => x.canBuyTech);
    });
  }
}
