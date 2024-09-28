import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { RewardType } from 'src/app/models';
import { GameManager } from 'src/app/services/game-manager.service';
import { LoggingService, PlayerActionLog } from 'src/app/services/log.service';
import { PlayerRewardChoices, PlayerRewardChoicesService } from 'src/app/services/player-reward-choices.service';

@Component({
  selector: 'dune-player-reward-choices',
  templateUrl: './player-reward-choices.component.html',
  styleUrl: './player-reward-choices.component.scss',
})
export class PlayerRewardChoicesComponent implements OnInit, AfterViewInit {
  @ViewChildren('rewardLogs') rewardLogElements!: QueryList<ElementRef>;

  public activePlayerId: number = 0;
  public playerRewardChoices: PlayerRewardChoices | undefined;
  public playerActionLog: PlayerActionLog[] = [];

  constructor(
    private gameManager: GameManager,
    private playerRewardChoicesService: PlayerRewardChoicesService,
    private logService: LoggingService
  ) {}

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

    this.logService.playerActionLog$.subscribe((playerActionLog) => {
      this.playerActionLog = playerActionLog;
    });
  }

  ngAfterViewInit() {
    this.rewardLogElements.changes.subscribe((res) => {
      setTimeout(() => {
        (res.last.nativeElement as HTMLDivElement).scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  onRewardChoiceClicked(id: string) {
    this.playerRewardChoicesService.removePlayerRewardChoice(this.activePlayerId, id);
  }

  onCustomChoiceClicked(id: string) {
    this.playerRewardChoicesService.removePlayerCustomChoice(this.activePlayerId, id);
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }
}
