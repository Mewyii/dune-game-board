import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { EffectType, RewardType } from 'src/app/models';
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
        if (res.last && res.last.nativeElement) {
          const parent = (res.last.nativeElement as HTMLDivElement).parentElement;
          if (parent) {
            parent.scrollTo({ top: parent.scrollHeight, behavior: 'smooth' });
          }
        }
      });
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
