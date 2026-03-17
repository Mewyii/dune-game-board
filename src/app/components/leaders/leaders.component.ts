import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { shuffle } from 'lodash';
import { House } from 'src/app/constants/minor-houses';

import { EffectRewardType, LanguageString, ResourceType } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { TurnInfo } from 'src/app/models/turn-info';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CardsService } from 'src/app/services/cards.service';
import { CombatManager, PlayerCombatUnits } from 'src/app/services/combat-manager.service';
import { GameManager, RoundPhaseType } from 'src/app/services/game-manager.service';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { LeaderDeckCard, LeadersService, PlayerLeader } from 'src/app/services/leaders.service';
import { MinorHousesService, PlayerHouse } from 'src/app/services/minor-houses.service';
import { PlayerAgent, PlayerAgentsService } from 'src/app/services/player-agents.service';
import { PlayerResourcesService, Resources } from 'src/app/services/player-resources.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { SettingsService } from 'src/app/services/settings.service';
import { PlayerTechTile, TechTileDeckCard, TechTilesService } from 'src/app/services/tech-tiles.service';
import { TranslateService } from 'src/app/services/translate-service';
import { TurnInfoService } from 'src/app/services/turn-info.service';
import { AdditionalPlayerActionsDialogComponent } from '../_common/dialogs/additional-player-actions-dialog/additional-player-actions-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'dune-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss'],
  standalone: false,
})
export class LeadersComponent implements OnInit {
  public leaders: LeaderDeckCard[] = [];

  public currentRound = 0;

  public currentRoundPhase: RoundPhaseType | undefined;

  public playerLeader: PlayerLeader | undefined;
  public activePlayerId: number = 0;

  public activeLeader: LeaderDeckCard | undefined;
  public isLeaderActive = false;

  public activePlayer: Player | undefined;
  public activePlayerResources: Resources = this.playerResourcesService.getInitialPlayerResources();

  public activePlayerCombatUnits: PlayerCombatUnits | undefined;

  public activePlayerAvailableAgents: PlayerAgent[] | undefined;

  public activePlayerIntrigueCount: number | undefined;

  public houses: House[] = [];
  public playerHouses: PlayerHouse[] = [];
  public houseTitle: LanguageString = { de: 'haus', en: 'house' };

  public playerTechTiles: PlayerTechTile[] = [];
  public activeTechTileId = '';
  public hoveredTechTileId = '';

  public turnInfos: TurnInfo | undefined;

  public showAIDetails = false;

  constructor(
    public leadersService: LeadersService,
    public t: TranslateService,
    public gameManager: GameManager,
    public playerManager: PlayersService,
    public combatManager: CombatManager,
    public playerScoreManager: PlayerScoreManager,
    public minorHouseService: MinorHousesService,
    public techTilesService: TechTilesService,
    public cardsService: CardsService,
    private intriguesService: IntriguesService,
    private audioManager: AudioManager,
    private dialog: MatDialog,
    private turnInfoService: TurnInfoService,
    private settingsService: SettingsService,
    private playerAgentsService: PlayerAgentsService,
    private playerResourcesService: PlayerResourcesService,
  ) {}

  ngOnInit(): void {
    this.leadersService.leaderDeck$.subscribe((leaderDeck) => {
      this.leaders = leaderDeck;
    });
    this.leadersService.playerLeaders$.subscribe((playerLeaders) => {
      this.playerLeader = playerLeaders.find((x) => x.playerId === this.activePlayerId);

      this.activeLeader = this.playerLeader?.leader;
    });

    this.gameManager.currentRoundPhase$.subscribe((roundPhase) => {
      this.currentRoundPhase = roundPhase;
    });

    this.gameManager.activePlayer$.subscribe((activePlayer) => {
      this.activePlayer = activePlayer;
      this.activePlayerId = activePlayer?.id ?? 0;

      this.playerLeader = this.leadersService.playerLeaders.find((x) => x.playerId === this.activePlayerId);

      this.activeLeader = this.playerLeader?.leader;

      this.activePlayerCombatUnits = this.combatManager.getPlayerCombatUnits(this.activePlayerId);

      this.houses = this.minorHouseService.getPlayerHouses(this.activePlayerId);

      this.playerTechTiles = this.techTilesService.getPlayerTechTiles(this.activePlayerId);

      this.activePlayerAvailableAgents = this.playerAgentsService.getAvailablePlayerAgents(this.activePlayerId);

      this.activePlayerIntrigueCount = this.intriguesService.getPlayerIntrigueCount(this.activePlayerId);

      this.activePlayerResources = this.playerResourcesService.getPlayerResources(this.activePlayerId);
    });

    this.combatManager.playerCombatUnits$.subscribe((playerCombatUnits) => {
      this.activePlayerCombatUnits = playerCombatUnits.find((x) => x.playerId === this.activePlayerId);
    });

    this.playerAgentsService.availablePlayersAgents$.subscribe((availablePlayerAgents) => {
      this.activePlayerAvailableAgents = availablePlayerAgents.filter((x) => x.playerId === this.activePlayerId);
    });

    this.minorHouseService.playerHouses$.subscribe((playerHouses) => {
      this.playerHouses = playerHouses;
      this.houses = this.minorHouseService.getPlayerHouses(this.activePlayerId);
    });

    this.techTilesService.playerTechTiles$.subscribe((playerTechTiles) => {
      this.playerTechTiles = this.techTilesService.getPlayerTechTiles(this.activePlayerId);
    });

    this.gameManager.currentRound$.subscribe((currentTurn) => {
      this.currentRound = currentTurn;
    });

    this.intriguesService.playersIntrigues$.subscribe(() => {
      this.activePlayerIntrigueCount = this.intriguesService.getPlayerIntrigueCount(this.activePlayerId);
    });

    this.turnInfoService.turnInfos$.subscribe(() => {
      this.turnInfos = this.turnInfoService.getPlayerTurnInfos(this.activePlayerId);
    });

    this.playerResourcesService.playersResources$.subscribe(() => {
      this.activePlayerResources = this.playerResourcesService.getPlayerResources(this.activePlayerId);
    });
  }

  setNextLeader() {
    this.audioManager.playSound('click-soft');
    const leaderIndex = this.leaders.findIndex((x) => x.id === this.activeLeader?.id);
    if (leaderIndex > -1) {
      if (leaderIndex + 1 < this.leaders.length) {
        const nextLeader = this.leaders[leaderIndex + 1];
        this.leadersService.assignLeaderToPlayer(this.activePlayerId, nextLeader.id);
      } else {
        const nextLeader = this.leaders[0];
        this.leadersService.assignLeaderToPlayer(this.activePlayerId, nextLeader.id);
      }
    }
  }

  setPreviousLeader() {
    this.audioManager.playSound('click-soft');
    const leaderIndex = this.leaders.findIndex((x) => x.id === this.activeLeader?.id);
    if (leaderIndex > -1) {
      if (leaderIndex > 0) {
        const nextLeader = this.leaders[leaderIndex - 1];
        this.leadersService.assignLeaderToPlayer(this.activePlayerId, nextLeader.id);
      } else {
        const nextLeader = this.leaders[this.leaders.length - 1];
        this.leadersService.assignLeaderToPlayer(this.activePlayerId, nextLeader.id);
      }
    }
  }

  onSelectRandomLeaderClicked() {
    const newLeader = shuffle(this.leaders);
    this.audioManager.playSound('click');
    this.leadersService.assignLeaderToPlayer(this.activePlayerId, newLeader[0].id);
  }

  onLockInLeaderClicked() {
    this.audioManager.playSound('click');
    if (this.activeLeader) {
      this.gameManager.lockInLeader(this.activePlayerId, this.activeLeader);

      if (this.activePlayer?.isAI) {
        this.gameManager.endPlayerTurn(this.activePlayerId);
      }
    }
  }

  onFlipLeaderClicked() {
    if (this.activeLeader && this.activePlayer) {
      this.audioManager.playSound('tech-tile');
      this.leadersService.flipLeader(this.activePlayer.id);
      this.isLeaderActive = false;
    }
  }

  onHealLeaderClicked() {
    if (this.activeLeader && this.activePlayer) {
      this.gameManager.healLeader(this.activePlayer.id);
      this.isLeaderActive = false;
    }
  }

  public onAddTroopToGarrisonClicked(playerId: number) {
    this.gameManager.addTroopsToPlayer(playerId, 1);
  }

  public onRemoveTroopFromGarrisonClicked(playerId: number) {
    this.audioManager.playSound('click-reverse');
    this.combatManager.removePlayerTroopsFromGarrison(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
    return false;
  }

  public onAddShipToGarrisonClicked(playerId: number) {
    this.gameManager.addDreadnoughtToPlayer(playerId);
  }

  public onRemoveShipFromGarrisonClicked(playerId: number) {
    this.audioManager.playSound('click-reverse');
    this.combatManager.removePlayerShipsFromGarrison(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
    return false;
  }

  onAddRewardClicked(player: Player, type: EffectRewardType) {
    this.gameManager.addRewardToPlayer(player.id, { type });

    this.gameManager.setPreferredFieldsForAIPlayer(player.id);
    return false;
  }

  onRemoveResourceClicked(player: Player, type: ResourceType) {
    this.audioManager.playSound('click-reverse');
    this.playerResourcesService.removeResourceFromPlayer(player.id, type, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(player.id);
    return false;
  }

  onAddPlayerAgentClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.playerAgentsService.addPlayerAgent(playerId);
  }

  onRemovePlayerAgentClicked(playerId: number) {
    this.audioManager.playSound('click-reverse');
    this.playerAgentsService.removePlayerAgent(playerId);
    return false;
  }

  onHouseLevelUpClicked(houseId: string) {
    this.minorHouseService.addPlayerHouseLevel(this.activePlayerId, houseId);
  }

  onHouseLevelDownClicked(houseId: string) {
    this.minorHouseService.removePlayerHouseLevel(this.activePlayerId, houseId);
  }

  onActivateTechClicked(techTile: TechTileDeckCard) {
    this.gameManager.activatePlayerTechtile(this.activePlayerId, techTile);
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
        this.techTilesService.trashPlayerTechTile(techTileId);
      }
    });
  }

  public onAddPersuasionGainedThisRoundClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.playerManager.addPersuasionGainedToPlayer(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
  }

  public onRemovePersuasionGainedThisRoundClicked(playerId: number) {
    this.audioManager.playSound('click-reverse');
    this.playerManager.removePersuasionGainedFromPlayer(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
    return false;
  }

  public onAddAdditionalCombatPowerToPlayer(playerId: number) {
    this.audioManager.playSound('sword');
    this.combatManager.addAdditionalCombatPowerToPlayer(playerId, 1);
  }

  public onRemoveAdditionalCombatPowerFromPlayer(playerId: number) {
    this.audioManager.playSound('sword');
    this.combatManager.removeAdditionalCombatPowerFromPlayer(playerId, 1);
    return false;
  }

  public onPlayerCanEnterCombatClicked(playerId: number) {
    if (!this.turnInfos?.canEnterCombat) {
      let deployableUnits = this.settingsService.getCombatMaxDeployableUnits();
      this.turnInfoService.setPlayerTurnInfo(playerId, { canEnterCombat: true, deployableUnits });
    } else {
      this.turnInfoService.setPlayerTurnInfo(playerId, { canEnterCombat: false, deployableUnits: 0 });
    }
  }

  public onPlayerCanBuyTechClicked(playerId: number) {
    this.turnInfoService.setPlayerTurnInfo(playerId, { canBuyTech: !this.turnInfos?.canBuyTech });
  }

  public onAIIncreaseInfluenceChoiceClicked(playerId: number) {
    this.gameManager.aiIncreaseInfluenceChoice(playerId);
  }

  public onAIDecreaseInfluenceChoiceClicked(playerId: number) {
    this.gameManager.aiDecreaseInfluenceChoice(playerId);
  }

  public onRevealCardsClicked(playerId: number) {
    this.audioManager.playSound('click-soft');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Revealing Cards',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.gameManager.setPlayerRevealTurn(playerId);
      }
    });
  }

  public onEndTurnClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.isLeaderActive = false;
    this.gameManager.endPlayerTurn(playerId);
  }

  public onAiActionClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.gameManager.doAIAction(playerId);
  }

  public onPassConflictClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.gameManager.playerPassedConflict(playerId);
  }

  public onShowAdditionalPlayerActionsClicked() {
    const dialogRef = this.dialog.open(AdditionalPlayerActionsDialogComponent);

    dialogRef.afterClosed().subscribe(() => {});
  }

  setTechTileActive(techTileId: string) {
    if (this.activeTechTileId !== techTileId) {
      this.activeTechTileId = techTileId;
    } else {
      this.activeTechTileId = '';
    }
  }

  setCardHover(cardId: string) {
    if (this.hoveredTechTileId !== cardId) {
      this.hoveredTechTileId = cardId;
    } else {
      this.hoveredTechTileId = '';
    }
  }

  getTransparentColor(color: string, opacity: number) {
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }
}
