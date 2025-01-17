import { Component, OnInit } from '@angular/core';
import { TurnInfo } from 'src/app/models/turn-info';
import { GameManager } from 'src/app/services/game-manager.service';
import { TranslateService } from 'src/app/services/translate-service';
import { TurnInfoService } from 'src/app/services/turn-info.service';

@Component({
  selector: 'dune-turn-infos',
  templateUrl: './turn-infos.component.html',
  styleUrl: './turn-infos.component.scss',
})
export class TurnInfosComponent implements OnInit {
  activePlayerId = 0;
  playerTurnInfo: TurnInfo | undefined;
  constructor(private gameManager: GameManager, private turnInfoService: TurnInfoService, public t: TranslateService) {}

  ngOnInit(): void {
    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;

      this.playerTurnInfo = this.turnInfoService.getPlayerTurnInfo(this.activePlayerId);
    });

    this.turnInfoService.turnInfos$.subscribe(() => {
      this.playerTurnInfo = this.turnInfoService.getPlayerTurnInfo(this.activePlayerId);
    });
  }
}
