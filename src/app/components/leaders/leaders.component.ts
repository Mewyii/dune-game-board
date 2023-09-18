import { Component } from '@angular/core';
import { Leader } from 'src/app/constants/leaders';
import { GameManager } from 'src/app/services/game-manager.service';
import { LeadersService, PlayerLeader } from 'src/app/services/leaders.service';
import { Player, PlayerManager } from 'src/app/services/player-manager.service';
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

  public currentPlayer: Player | undefined;

  constructor(
    public leadersService: LeadersService,
    public translateService: TranslateService,
    public gameManager: GameManager,
    public playerManager: PlayerManager
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

    this.playerManager.players$.subscribe((players) => {
      this.currentPlayer = players.find((x) => x.id === this.activePlayerId);
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

  onAddFocusTokenClicked(id: number) {
    this.playerManager.addFocusTokens(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onRemoveFocusTokenClicked(id: number) {
    this.playerManager.removeFocusTokens(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onAddTechAgentClicked(id: number) {
    this.playerManager.addTechAgentsToPlayer(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onRemoveTechAgentClicked(id: number) {
    this.playerManager.removeTechAgentsFromPlayer(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  public getArrayFromNumber(length: number) {
    return new Array(length);
  }
}
