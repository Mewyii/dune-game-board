import { Component, OnInit } from '@angular/core';
import { isActiveFactionType, isFactionType } from 'src/app/helpers/faction-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { ActionField, ActionType, EffectType, FactionType } from 'src/app/models';
import { TurnInfo } from 'src/app/models/turn-info';
import { GameManager } from 'src/app/services/game-manager.service';
import { SettingsService } from 'src/app/services/settings.service';
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
  constructor(
    private gameManager: GameManager,
    private turnInfoService: TurnInfoService,
    public t: TranslateService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;

      this.playerTurnInfo = this.turnInfoService.getPlayerTurnInfo(this.activePlayerId);
    });

    this.turnInfoService.turnInfos$.subscribe(() => {
      this.playerTurnInfo = this.turnInfoService.getPlayerTurnInfo(this.activePlayerId);
    });
  }

  public getColor(actionField: ActionField) {
    const location = this.settingsService.getBoardLocation(actionField.title.en);
    if (location) {
      return location.color;
    }
    if (isFactionType(actionField.actionType)) {
      const factionColor = this.settingsService.getFactionColor(actionField.actionType);
      if (factionColor) {
        return factionColor;
      }
    }
    return '';
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }
}
