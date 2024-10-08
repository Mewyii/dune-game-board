import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Leader } from 'src/app/constants/leaders';
import { LeaderImageOnly } from 'src/app/constants/leaders-old';
import { House } from 'src/app/constants/minor-houses';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { FactionType, LanguageString, ResourceType, RewardType } from 'src/app/models';
import { CombatManager, PlayerCombatUnits } from 'src/app/services/combat-manager.service';
import { GameManager, PlayerAgents } from 'src/app/services/game-manager.service';
import { LeadersService, PlayerLeader } from 'src/app/services/leaders.service';
import { MinorHousesService, PlayerHouse } from 'src/app/services/minor-houses.service';
import { Player, PlayerManager } from 'src/app/services/player-manager.service';
import { PlayerScore, PlayerScoreManager, PlayerScoreType } from 'src/app/services/player-score-manager.service';
import { PlayerTechTile, TechTileCard, TechTilesService } from 'src/app/services/tech-tiles.service';
import { TranslateService } from 'src/app/services/translate-service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CardsService } from 'src/app/services/cards.service';

@Component({
  selector: 'dune-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss'],
})
export class LeadersComponent implements OnInit {
  public leaders: (Leader | LeaderImageOnly)[] = [];
  public newLeaders: Leader[] = [];

  public currentTurn = 0;

  public playerLeader: PlayerLeader | undefined;
  public activePlayerId: number = 0;

  public activeLeader: Leader | LeaderImageOnly | undefined;

  public currentPlayer: Player | undefined;

  public currentPlayerScore: PlayerScore | undefined;

  public currentPlayerCombatUnits: PlayerCombatUnits | undefined;

  public currentPlayerAvailableAgents: PlayerAgents | undefined;

  public houses: House[] = [];
  public playerHouses: PlayerHouse[] = [];
  public houseTitle: LanguageString = { de: 'haus', en: 'house' };

  public playerTechTiles: PlayerTechTile[] = [];
  public techTiles: TechTileCard[] = [];
  public activeTechTileId = '';

  constructor(
    public leadersService: LeadersService,
    public translateService: TranslateService,
    public gameManager: GameManager,
    public playerManager: PlayerManager,
    public combatManager: CombatManager,
    public playerScoreManager: PlayerScoreManager,
    public minorHouseService: MinorHousesService,
    public techTilesService: TechTilesService,
    public cardsService: CardsService,
    private audioManager: AudioManager,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.leaders = this.leadersService.leaders;
    this.newLeaders = this.leaders.filter((x) => x.type === 'new') as Leader[];

    this.leadersService.playerLeaders$.subscribe((playerLeaders) => {
      this.playerLeader = playerLeaders.find((x) => x.playerId === this.activePlayerId);

      const activeLeaderName = this.playerLeader?.leaderName;
      this.activeLeader = this.leaders.find((x) => x.name.en === activeLeaderName);
    });

    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
      this.playerLeader = this.leadersService.playerLeaders.find((x) => x.playerId === activePlayerId);

      const activeLeaderName = this.playerLeader?.leaderName;
      this.activeLeader = this.leaders.find((x) => x.name.en === activeLeaderName);

      this.currentPlayer = this.playerManager.getPlayer(this.activePlayerId);

      this.currentPlayerScore = this.playerScoreManager.playerScores.find((x) => x.playerId === this.activePlayerId);

      this.currentPlayerCombatUnits = this.combatManager.playerCombatUnits.find((x) => x.playerId === this.activePlayerId);

      this.houses = this.minorHouseService.getPlayerHouses(this.activePlayerId);

      this.techTiles = this.techTilesService.getPlayerTechTiles(this.activePlayerId);

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

    this.minorHouseService.playerHouses$.subscribe((playerHouses) => {
      this.playerHouses = playerHouses;
      this.houses = this.minorHouseService.getPlayerHouses(this.activePlayerId);
    });

    this.techTilesService.playerTechTiles$.subscribe((playerTechTiles) => {
      this.playerTechTiles = playerTechTiles;
      this.techTiles = this.techTilesService.getPlayerTechTiles(this.activePlayerId);
    });

    this.gameManager.currentRound$.subscribe((currentTurn) => {
      this.currentTurn = currentTurn;
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

  onLockInLeaderClicked() {
    this.gameManager.lockInLeader(this.activePlayerId, this.activeLeader);
  }

  onAddFocusTokenClicked(id: number) {
    this.audioManager.playSound('click-soft');
    this.playerManager.addFocusTokens(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onRemoveFocusTokenClicked(id: number) {
    this.audioManager.playSound('click-soft');
    this.playerManager.removeFocusTokens(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
    return false;
  }

  onAddTechAgentClicked(id: number) {
    this.audioManager.playSound('click-soft');
    this.playerManager.addTechAgentsToPlayer(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onRemoveTechAgentClicked(id: number) {
    this.audioManager.playSound('click-soft');
    this.playerManager.removeTechAgentsFromPlayer(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
    return false;
  }

  public onAddTroopToGarrisonClicked(playerId: number) {
    this.audioManager.playSound('troops');
    this.combatManager.addPlayerTroopsToGarrison(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
  }

  public onRemoveTroopFromGarrisonClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.combatManager.removePlayerTroopsFromGarrison(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
    return false;
  }

  public onAddShipToGarrisonClicked(playerId: number) {
    this.audioManager.playSound('dreadnought');
    this.combatManager.addPlayerShipsToGarrison(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
  }

  public onRemoveShipFromGarrisonClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.combatManager.removePlayerShipsFromGarrison(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
    return false;
  }

  onAddResourceClicked(id: number, type: ResourceType) {
    if (type === 'solari') {
      this.audioManager.playSound('solari');
    } else if (type === 'water') {
      this.audioManager.playSound('water');
    } else if (type === 'spice') {
      this.audioManager.playSound('spice');
    }

    this.playerManager.addResourceToPlayer(id, type, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onRemoveResourceClicked(id: number, type: ResourceType) {
    this.audioManager.playSound('click-soft');
    this.playerManager.removeResourceFromPlayer(id, type, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
    return false;
  }

  onAddIntrigueClicked(id: number) {
    this.audioManager.playSound('intrigue');
    this.playerManager.addIntriguesToPlayer(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onRemoveIntrigueClicked(id: number) {
    this.audioManager.playSound('click-soft');
    this.playerManager.removeIntriguesFromPlayer(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
    return false;
  }

  onAddSignetTokenClicked(id: number) {
    this.audioManager.playSound('intrigue');
    this.playerManager.addSignetTokensToPlayer(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  onRemoveSignetTokenClicked(id: number) {
    this.audioManager.playSound('click-soft');
    this.playerManager.removeSignetTokensFromPlayer(id, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
    return false;
  }

  public onAddPlayerScoreClicked(id: number, scoreType: PlayerScoreType) {
    this.audioManager.playSound('click-soft');

    if (scoreType === 'victoryPoints') {
      this.audioManager.playSound('victory-point');
    }
    this.playerScoreManager.addPlayerScore(id, scoreType, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
  }

  public onRemovePlayerScoreClicked(id: number, scoreType: PlayerScoreType) {
    this.audioManager.playSound('click-soft');
    this.playerScoreManager.removePlayerScore(id, scoreType, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(id);
    return false;
  }

  onAddPlayerAgentClicked(id: number) {
    this.audioManager.playSound('click-soft');
    this.gameManager.addAgentToPlayer(id);
  }

  onRemovePlayerAgentClicked(id: number) {
    this.audioManager.playSound('click-soft');
    this.gameManager.removeAgentFromPlayer(id);
    return false;
  }

  onHouseLevelUpClicked(houseId: string) {
    this.minorHouseService.addPlayerHouseLevel(this.activePlayerId, houseId);
  }

  onHouseLevelDownClicked(houseId: string) {
    this.minorHouseService.removePlayerHouseLevel(this.activePlayerId, houseId);
  }

  onFlipTechClicked(techTileId: string) {
    this.audioManager.playSound('tech-tile');
    this.techTilesService.flipTechTile(techTileId);
  }

  onTrashTechClicked(techTileId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Are you sure you want to trash this tech tile?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.techTilesService.trashTechTile(techTileId);
      }
    });
  }

  public onAddPermanentPersuasionClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.playerManager.addPermanentPersuasionToPlayer(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
  }

  public onRemovePermanentPersuasionClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.playerManager.removePermanentPersuasionFromPlayer(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
    return false;
  }

  public onAddPersuasionGainedThisRoundClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.playerManager.addPersuasionGainedToPlayer(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
  }

  public onRemovePersuasionGainedThisRoundClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.playerManager.removePersuasionGainedFromPlayer(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
    return false;
  }

  public onRevealCardsClicked(playerId: number) {
    this.gameManager.setPlayerRevealTurn(playerId);
  }

  public onNextPlayerClicked() {
    if (this.currentPlayer && this.currentPlayer.turnState === 'reveal') {
      const playerHand = this.cardsService.getPlayerHand(this.currentPlayer.id);
      if (playerHand && playerHand.cards) {
        this.cardsService.discardPlayerHandCards(this.currentPlayer.id);
        this.playerManager.setTurnStateForPlayer(this.currentPlayer.id, 'done');
      }
    }
    this.audioManager.playSound('click-soft');
    this.gameManager.setNextPlayerActive('agent-placement');
  }

  public onAiActionClicked(playerId: number) {
    this.gameManager.doAIAction(playerId);
  }

  setTechTileActive(techTileId: string) {
    if (this.activeTechTileId !== techTileId) {
      this.activeTechTileId = techTileId;
    } else {
      this.activeTechTileId = '';
    }
  }

  public getIsTechTileFlipped(techTileId: string) {
    return this.playerTechTiles.find((x) => x.techTileId === techTileId)?.isFlipped;
  }

  public getPlayerScore(scoreType: PlayerScoreType) {
    return this.currentPlayerScore ? this.currentPlayerScore[scoreType] : 0;
  }

  public getPlayerHouseLevel(houseId: string) {
    return this.playerHouses.find((x) => x.houseId === houseId)?.level ?? 0;
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  public getFactionTypePath(rewardType: FactionType) {
    return getFactionTypePath(rewardType);
  }

  getTransparentColor(color: string, opacity: number) {
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }
}
