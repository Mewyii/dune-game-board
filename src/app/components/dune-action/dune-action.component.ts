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
    rewards: [{ type: 'troop', amount: 2 }],
    pathToImage: 'assets/images/fremen_warriors.jpeg',
  };

  @Input() backgroundColor: string = '';

  @Output() actionFieldClick = new EventEmitter<{ playerId: number }>();

  public transparentBackgroundColor: string = '';
  public pathToActionType = '';
  public boardSettings = boardSettings;

  public playerOnField: Player | undefined;
  public additionalPlayersOnField: Player[] = [];

  public accumulatedSpice = 0;

  public highCouncilSeats: string[] = [];

  constructor(public gameManager: GameManager, public playerManager: PlayerManager, public ts: TranslateService) {}

  ngOnInit(): void {
    this.pathToActionType = getActionTypePath(this.action.actionType);
    this.transparentBackgroundColor = this.backgroundColor.replace(')', ' / 50%)');

    this.gameManager.agentsOnFields$.subscribe((agentsOnFields) => {
      const playerIds = agentsOnFields.filter((x) => x.fieldId === this.action.title.en).map((x) => x.playerId);
      if (playerIds.length > 0) {
        const firstPlayerId = playerIds.shift()!;
        const players = this.playerManager.getPlayers();
        this.playerOnField = players.find((x) => x.id === firstPlayerId);

        this.additionalPlayersOnField = [];
        for (const playerId of playerIds) {
          const playerOnField = players.find((x) => x.id === playerId);
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

    if (this.action.title.en === 'high council') {
      this.playerManager.players$.subscribe((players) => {
        this.highCouncilSeats = players.filter((x) => x.hasCouncilSeat).map((x) => x.color);
      });
    }
  }

  public onActionFieldClicked() {
    const currentPlayerId = this.gameManager.activePlayerId;

    if (currentPlayerId) {
      const playerAgents =
        this.gameManager.availablePlayerAgents.find((x) => x.playerId === currentPlayerId)?.agentAmount ?? 0;

      if (playerAgents > 0) {
        this.gameManager.addAgentToField(this.action);
        this.actionFieldClick.emit({ playerId: currentPlayerId });
      }
    }
  }

  onPlayerMarkerRightClicked(playerId: number, fieldId: string) {
    this.gameManager.removePlayerAgentFromField(playerId, fieldId);
    return false;
  }

  onRewardClicked(fieldId: string, rewardType: RewardType) {
    if (rewardType === 'extra-spice') {
      this.gameManager.increaseAccumulatedSpiceOnField(fieldId);
    }
  }

  onRewardRightClicked(fieldId: string, rewardType: RewardType) {
    if (rewardType === 'extra-spice') {
      this.gameManager.decreaseAccumulatedSpiceOnField(fieldId);
    }
    return false;
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

  public trackSpiceOnField(index: number, spiceOnField: number) {
    return spiceOnField;
  }
}
