import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { ActionField } from 'src/app/models';
import { TurnInfo } from 'src/app/models/turn-info';
import { GameManager } from 'src/app/services/game-manager.service';
import { TurnInfoService } from 'src/app/services/player-turn-info.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-turn-infos',
  templateUrl: './turn-infos.component.html',
  styleUrl: './turn-infos.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TurnInfosComponent implements OnInit, OnDestroy {
  private gameManager = inject(GameManager);
  private turnInfoService = inject(TurnInfoService);
  t = inject(TranslateService);
  private settingsService = inject(SettingsService);

  subscriptions: Subscription[] = [];

  activePlayerId = 0;
  playerTurnInfo: TurnInfo | undefined;
  showCardsPlayedThisTurn = false;
  showCardsBoughtThisTurn = false;
  showCardsTrashedThisTurn = false;
  showTechTilesFlippedThisTurn = false;
  showTechTilesBoughtThisTurn = false;
  showIntriguesPlayedThisTurn = false;

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
