import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActionField } from 'src/app/models';
import { TurnInfo } from 'src/app/models/turn-info';
import { GameManager } from 'src/app/services/game-manager.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';
import { TurnInfoService } from 'src/app/services/turn-info.service';

@Component({
  selector: 'dune-turn-infos',
  templateUrl: './turn-infos.component.html',
  styleUrl: './turn-infos.component.scss',
  standalone: false,
})
export class TurnInfosComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  activePlayerId = 0;
  playerTurnInfo: TurnInfo | undefined;
  showCardsPlayedThisTurn = false;
  showCardsBoughtThisTurn = false;
  showCardsTrashedThisTurn = false;
  showTechTilesFlippedThisTurn = false;
  showTechTilesBoughtThisTurn = false;
  showIntriguesPlayedThisTurn = false;

  constructor(
    private gameManager: GameManager,
    private turnInfoService: TurnInfoService,
    public t: TranslateService,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    const activePlayerIdSub = this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
      this.showTurnInfos();

      this.playerTurnInfo = this.turnInfoService.getPlayerTurnInfos(this.activePlayerId);
    });

    const turnInfosSub = this.turnInfoService.turnInfos$.subscribe(() => {
      this.playerTurnInfo = this.turnInfoService.getPlayerTurnInfos(this.activePlayerId);
    });

    this.subscriptions.push(activePlayerIdSub, turnInfosSub);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  public getColor(actionField: ActionField) {
    return this.settingsService.getBoardSpaceColor(actionField.actionType) ?? '';
  }

  public showTurnInfos() {
    this.showCardsPlayedThisTurn = true;
    this.showCardsBoughtThisTurn = true;
    this.showCardsTrashedThisTurn = true;
    this.showTechTilesFlippedThisTurn = true;
    this.showTechTilesBoughtThisTurn = true;
    this.showIntriguesPlayedThisTurn = true;
  }
}
