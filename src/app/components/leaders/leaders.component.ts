import { Component } from '@angular/core';
import { Leader } from 'src/app/constants/leaders';
import { GameManager } from 'src/app/services/game-manager.service';
import { LeadersService, PlayerLeader } from 'src/app/services/leaders.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss'],
})
export class LeadersComponent {
  public leaders: Leader[] = [];

  public playerLeaders: PlayerLeader[] = [];
  public activePlayerId: number = 0;

  public activeLeader: Leader | undefined;

  constructor(
    public leadersService: LeadersService,
    public translateService: TranslateService,
    public gameManager: GameManager
  ) {}

  ngOnInit(): void {
    this.leaders = this.leadersService.leaders;

    this.leadersService.playerLeaders$.subscribe((playerLeaders) => {
      this.playerLeaders = playerLeaders;

      const activeLeaderName = this.playerLeaders.find((x) => x.playerId === this.activePlayerId)?.leaderName;
      this.activeLeader = this.leaders.find((x) => x.name === activeLeaderName);
    });

    this.gameManager.activeAgentPlacementPlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
      const activeLeaderName = this.playerLeaders.find((x) => x.playerId === this.activePlayerId)?.leaderName;
      this.activeLeader = this.leaders.find((x) => x.name === activeLeaderName);
    });
  }

  setNextLeader() {
    const leaderIndex = this.leaders.findIndex((x) => x.name === this.activeLeader?.name);
    if (leaderIndex > -1) {
      if (leaderIndex + 1 < this.leaders.length) {
        const nextLeader = this.leaders[leaderIndex + 1];
        this.leadersService.assignLeaderToPlayer(this.activePlayerId, nextLeader.name);
      } else {
        const nextLeader = this.leaders[0];
        this.leadersService.assignLeaderToPlayer(this.activePlayerId, nextLeader.name);
      }
    }
  }

  setPreviousLeader() {
    const leaderIndex = this.leaders.findIndex((x) => x.name === this.activeLeader?.name);
    if (leaderIndex > -1) {
      if (leaderIndex > 0) {
        const nextLeader = this.leaders[leaderIndex - 1];
        this.leadersService.assignLeaderToPlayer(this.activePlayerId, nextLeader.name);
      } else {
        const nextLeader = this.leaders[this.leaders.length - 1];
        this.leadersService.assignLeaderToPlayer(this.activePlayerId, nextLeader.name);
      }
    }
  }
}
