import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActionField } from 'src/app/models';
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
export class TechboardComponent implements OnInit, OnDestroy {
  @Input() ix: ActionField | undefined;
  @Input() useTechTiles = false;

  subscriptions: Subscription[] = [];

  public activePlayerId = 0;
  public playerTech: { playerId: number; amount: number }[] = [];

  public playerCanBuyTech = false;

  constructor(
    public playersService: PlayersService,
    public playerScoreManager: PlayerScoreManager,
    private gameManager: GameManager,
    private turnInfoService: TurnInfoService,
  ) {}

  ngOnInit(): void {
    const activePlayerIdSub = this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
    });

    const turnInfosSub = this.turnInfoService.turnInfos$.subscribe((turnInfos) => {
      this.playerCanBuyTech = turnInfos.some((x) => x.canBuyTech);
    });

    this.subscriptions.push(activePlayerIdSub, turnInfosSub);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
