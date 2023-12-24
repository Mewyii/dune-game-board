import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActionField, FactionType, RewardType } from 'src/app/models';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { boardSettings } from 'src/app/constants/board-settings';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { GameManager } from 'src/app/services/game-manager.service';
import { Player, PlayerManager } from 'src/app/services/player-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'app-dune-action',
  templateUrl: './dune-action.component.html',
  styleUrls: ['./dune-action.component.scss'],
})
export class DuneActionComponent implements OnInit {
  @Input() action: ActionField = {
    title: { de: 'fremenkrieger', en: 'fremen warriors' },
    actionType: 'fremen',
    costs: [{ type: 'water', amount: 1 }],
    rewards: [{ type: 'troops', amount: 2 }],
    pathToImage: 'assets/images/fremen_warriors.jpeg',
    isBattlefield: true,
  };

  @Input() backgroundColor: string = '';

  @Output() actionFieldClick = new EventEmitter<{ playerId: number }>();

  public transparentBackgroundColor: string = '';
  public pathToActionType = '';
  public boardSettings = boardSettings;

  public playerOnField: Player | undefined;
  public additionalPlayersOnField: Player[] = [];

  public accumulatedSpice = 3;

  constructor(public gameManager: GameManager, public playerManager: PlayerManager, public ts: TranslateService) {}

  ngOnInit(): void {
    this.pathToActionType = getActionTypePath(this.action.actionType);
    this.transparentBackgroundColor = this.backgroundColor.replace(')', ' / 50%)');

    this.gameManager.agentsOnFields$.subscribe((agentsOnFields) => {
      const playerIds = agentsOnFields.filter((x) => x.fieldId === this.action.title.en).map((x) => x.playerId);
      if (playerIds.length > 0) {
        const firstPlayerId = playerIds.shift()!;
        this.playerOnField = this.playerManager.players.find((x) => x.id === firstPlayerId);

        this.additionalPlayersOnField = [];
        for (const playerId of playerIds) {
          const playerOnField = this.playerManager.players.find((x) => x.id === playerId);
          if (playerOnField) {
            this.additionalPlayersOnField.push(playerOnField);
          }
        }
      } else {
        this.additionalPlayersOnField = [];
        this.playerOnField = undefined;
      }
    });

    this.gameManager.accumulatedSpiceOnFields$.subscribe((accumulatedSpice) => {
      const spiceOnField = accumulatedSpice.find((x) => x.fieldId === this.action.title.en);
      this.accumulatedSpice = spiceOnField?.amount ?? 0;
    });
  }

  public onActionFieldClicked() {
    const currentPlayerId = this.gameManager.activePlayer?.id;

    if (currentPlayerId) {
      const playerAgents =
        this.gameManager.availablePlayerAgents.find((x) => x.playerId === currentPlayerId)?.agentAmount ?? 0;

      if (playerAgents > 0) {
        this.gameManager.addAgentToField(this.action);
        this.actionFieldClick.emit({ playerId: currentPlayerId });
      }
    }
  }

  public getArrayFromNumber(length: number) {
    return new Array(length);
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  public getFactionTypePath(rewardType: FactionType) {
    return getFactionTypePath(rewardType);
  }

  public trackPlayersOnField(index: number, playerOnField: Player) {
    return playerOnField.id;
  }
}
