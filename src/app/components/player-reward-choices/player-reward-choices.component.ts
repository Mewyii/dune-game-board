import { Component, OnInit } from '@angular/core';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { EffectType } from 'src/app/models';
import { GameManager } from 'src/app/services/game-manager.service';
import { PlayerActionLog } from 'src/app/services/log.service';
import { PlayerRewardChoices, PlayerRewardChoicesService } from 'src/app/services/player-reward-choices.service';

@Component({
  selector: 'dune-player-reward-choices',
  templateUrl: './player-reward-choices.component.html',
  styleUrl: './player-reward-choices.component.scss',
})
export class PlayerRewardChoicesComponent implements OnInit {
  public activePlayerId: number = 0;
  public playerRewardChoices: PlayerRewardChoices | undefined;
  public playerActionLog: PlayerActionLog[] = [];

  constructor(private gameManager: GameManager, private playerRewardChoicesService: PlayerRewardChoicesService) {}

  ngOnInit(): void {
    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
      this.playerRewardChoices = this.playerRewardChoicesService.playerRewardChoices.find(
        (x) => x.playerId === this.activePlayerId
      );
    });

    this.playerRewardChoicesService.playerRewardChoices$.subscribe((playerRewardChoices) => {
      this.playerRewardChoices = playerRewardChoices.find((x) => x.playerId === this.activePlayerId);
    });
  }

  onRewardChoiceClicked(id: string) {
    this.playerRewardChoicesService.removePlayerRewardChoice(this.activePlayerId, id);
  }

  onRewardsChoiceClicked(id: string) {
    this.playerRewardChoicesService.removePlayerRewardsChoice(this.activePlayerId, id);
  }

  onCustomChoiceClicked(id: string) {
    this.playerRewardChoicesService.removePlayerCustomChoice(this.activePlayerId, id);
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }
}
