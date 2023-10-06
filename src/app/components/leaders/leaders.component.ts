import { Component } from '@angular/core';
import { Leader } from 'src/app/constants/leaders';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { FactionType, LanguageString, ResourceType, RewardType } from 'src/app/models';
import { CombatManager, PlayerCombatUnits } from 'src/app/services/combat-manager.service';
import { GameManager, PlayerAgents } from 'src/app/services/game-manager.service';
import { LeadersService, PlayerLeader } from 'src/app/services/leaders.service';
import { Player, PlayerManager } from 'src/app/services/player-manager.service';
import { PlayerScore, PlayerScoreManager, PlayerScoreType } from 'src/app/services/player-score-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss'],
})
export class LeadersComponent {
  public leaders: Leader[] = [];
  public newLeaders: Leader[] = [];

  public playerLeaders: PlayerLeader[] = [];
  public activePlayerId: number = 0;

  public activeLeader: Leader | undefined;

  public currentPlayer: Player | undefined;

  public currentPlayerScore: PlayerScore | undefined;

  public currentPlayerCombatUnits: PlayerCombatUnits | undefined;

  public currentPlayerAvailableAgents: PlayerAgents | undefined;

  public deckName: LanguageString = { de: 'deck', en: 'deck' };
  public discardName: LanguageString = { de: 'ablage', en: 'discard' };

  constructor(
    public leadersService: LeadersService,
    public translateService: TranslateService,
    public gameManager: GameManager,
    public playerManager: PlayerManager,
    public combatManager: CombatManager,
    public playerScoreManager: PlayerScoreManager
  ) {}

  ngOnInit(): void {
    this.leaders = this.leadersService.leaders;
    this.newLeaders = this.leaders.filter((x) => x.type === 'new');

    this.leadersService.playerLeaders$.subscribe((playerLeaders) => {
      this.playerLeaders = playerLeaders;

      const activeLeaderName = this.playerLeaders.find((x) => x.playerId === this.activePlayerId)?.leaderName;
      this.activeLeader = this.leaders.find((x) => x.name.en === activeLeaderName);
    });

    this.gameManager.activeAgentPlacementPlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
      const activeLeaderName = this.playerLeaders.find((x) => x.playerId === this.activePlayerId)?.leaderName;
      this.activeLeader = this.leaders.find((x) => x.name.en === activeLeaderName);

      this.currentPlayer = this.playerManager.players.find((x) => x.id === this.activePlayerId);

      this.currentPlayerScore = this.playerScoreManager.playerScores.find((x) => x.playerId === this.activePlayerId);

      this.currentPlayerCombatUnits = this.combatManager.playerCombatUnits.find((x) => x.playerId === this.activePlayerId);

      this.currentPlayerAvailableAgents = this.gameManager.availablePlayerAgents.find(
        (x) => x.playerId === this.activePlayerId
      );
    });

    this.playerManager.players$.subscribe((players) => {
      this.currentPlayer = players.find((x) => x.id === this.activePlayerId);
    });

    this.playerScoreManager.playerScores$.subscribe((playerScores) => {
      this.currentPlayerScore = playerScores.find((x) => x.playerId === this.activePlayerId);
    });

    this.combatManager.playerCombatUnits$.subscribe((playerCombatUnits) => {
      this.currentPlayerCombatUnits = playerCombatUnits.find((x) => x.playerId === this.activePlayerId);
    });

    this.gameManager.availablePlayerAgents$.subscribe((availablePlayerAgents) => {
      this.currentPlayerAvailableAgents = availablePlayerAgents.find((x) => x.playerId === this.activePlayerId);
    });
  }

  setNextLeader() {
    const leaderIndex = this.leaders.findIndex((x) => x.name === this.activeLeader?.name);
    if (leaderIndex > -1) {
      if (leaderIndex + 1 < this.leaders.length) {
        const nextLeader = this.leaders[leaderIndex + 1];
        this.leadersService.assignLeaderToPlayer(this.activePlayerId, nextLeader.name.en);
      } else {
        const nextLeader = this.leaders[0];
        this.leadersService.assignLeaderToPlayer(this.activePlayerId, nextLeader.name.en);
      }
    }
  }

  setPreviousLeader() {
    const leaderIndex = this.leaders.findIndex((x) => x.name === this.activeLeader?.name);
    if (leaderIndex > -1) {
      if (leaderIndex > 0) {
        const nextLeader = this.leaders[leaderIndex - 1];
        this.leadersService.assignLeaderToPlayer(this.activePlayerId, nextLeader.name.en);
      } else {
        const nextLeader = this.leaders[this.leaders.length - 1];
        this.leadersService.assignLeaderToPlayer(this.activePlayerId, nextLeader.name.en);
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

  public onAddTroopToGarrisonClicked(playerId: number) {
    this.combatManager.addPlayerTroopsToGarrison(playerId, 1);
  }

  public onRemoveTroopFromGarrisonClicked(playerId: number) {
    this.combatManager.removePlayerTroopsFromGarrison(playerId, 1);
  }

  public onAddShipToGarrisonClicked(playerId: number) {
    this.combatManager.addPlayerShipsToGarrison(playerId, 1);
  }

  public onRemoveShipFromGarrisonClicked(playerId: number) {
    this.combatManager.removePlayerShipsFromGarrison(playerId, 1);
  }

  onAddResourceClicked(id: number, type: ResourceType) {
    this.playerManager.addResourceToPlayer(id, type, 1);
  }

  onRemoveResourceClicked(id: number, type: ResourceType) {
    this.playerManager.removeResourceFromPlayer(id, type, 1);
  }

  public onAddPlayerScoreClicked(id: number, scoreType: PlayerScoreType) {
    this.playerScoreManager.addPlayerScore(id, scoreType, 1);
  }

  public onRemovePlayerScoreClicked(id: number, scoreType: PlayerScoreType) {
    this.playerScoreManager.removePlayerScore(id, scoreType, 1);
  }

  onAddPlayerAgentClicked(id: number) {
    this.gameManager.addAgentToPlayer(id);
  }

  onRemovePlayerAgentClicked(id: number) {
    this.gameManager.removeAgentFromPlayer(id);
  }

  public getPlayerScore(scoreType: PlayerScoreType) {
    return this.currentPlayerScore ? this.currentPlayerScore[scoreType] : 0;
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  public getFactionTypePath(rewardType: FactionType) {
    return getFactionTypePath(rewardType);
  }

  public getArrayFromNumber(length: number) {
    return new Array(length);
  }
}
