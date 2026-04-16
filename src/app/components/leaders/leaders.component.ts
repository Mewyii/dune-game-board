import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { shuffle } from 'lodash';
import { House } from 'src/app/constants/minor-houses';

import { EffectRewardType, LanguageString, ResourceType } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { TurnInfo } from 'src/app/models/turn-info';
import { AIManager } from 'src/app/services/ai/ai.manager';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CardsService } from 'src/app/services/cards.service';
import { CombatManager, PlayerCombatUnits } from 'src/app/services/combat-manager.service';
import { EffectsService } from 'src/app/services/game-effects.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { LeaderDeckCard, LeadersService, PlayerLeader } from 'src/app/services/leaders.service';
import { MinorHousesService, PlayerHouse } from 'src/app/services/minor-houses.service';
import { PlayerAgent, PlayerAgentsService } from 'src/app/services/player-agents.service';
import { PlayerResourcesService, Resources } from 'src/app/services/player-resources.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { RoundPhaseType, RoundService } from 'src/app/services/round.service';
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
  leaders: LeaderDeckCard[] = [];

  currentRound = 0;

  currentRoundPhase: RoundPhaseType | undefined;

  playerLeader: PlayerLeader | undefined;
  activePlayerId: number = 0;

  activeLeader: LeaderDeckCard | undefined;
  isLeaderActive = false;

  activePlayer: Player | undefined;
  activePlayerResources: Resources = this.playerResourcesService.getInitialPlayerResources();

  activePlayerCombatUnits: PlayerCombatUnits | undefined;

  activePlayerAvailableAgents: PlayerAgent[] | undefined;

  activePlayerIntrigueCount: number | undefined;

  houses: House[] = [];
  playerHouses: PlayerHouse[] = [];
  houseTitle: LanguageString = { de: 'haus', en: 'house' };

  playerTechTiles: PlayerTechTile[] = [];
  activeTechTileId = '';
  hoveredTechTileId = '';

  turnInfos: TurnInfo | undefined;

  showAIDetails = false;

  constructor(
    public t: TranslateService,
    private leadersService: LeadersService,
    private gameManager: GameManager,
    private playersService: PlayersService,
    private combatManager: CombatManager,
    private playerScoreManager: PlayerScoreManager,
    private minorHouseService: MinorHousesService,
    private techTilesService: TechTilesService,
    private cardsService: CardsService,
    private intriguesService: IntriguesService,
    private audioManager: AudioManager,
    private dialog: MatDialog,
    private turnInfoService: TurnInfoService,
    private settingsService: SettingsService,
    private playerAgentsService: PlayerAgentsService,
    private playerResourcesService: PlayerResourcesService,
    private effectsService: EffectsService,
    private roundService: RoundService,
    private aiManager: AIManager,
  ) {}

  ngOnInit(): void {
    this.leadersService.leaderDeck$.subscribe((leaderDeck) => {
      this.leaders = leaderDeck;
    });
    this.leadersService.playerLeaders$.subscribe((playerLeaders) => {
      this.playerLeader = playerLeaders.find((x) => x.playerId === this.activePlayerId);

      this.activeLeader = this.playerLeader?.leader;
    });

    this.roundService.currentRoundPhase$.subscribe((roundPhase) => {
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

    this.roundService.currentRound$.subscribe((currentTurn) => {
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

  onAddTroopToGarrisonClicked(player: Player) {
    this.effectsService.addTroopsToPlayer(player.id, 1);
    this.aiManager.setPreferredFieldsForAIPlayer(player);
  }

  onRemoveTroopFromGarrisonClicked(player: Player) {
    this.audioManager.playSound('click-reverse');
    this.combatManager.removePlayerTroopsFromGarrison(player.id, 1);

    this.aiManager.setPreferredFieldsForAIPlayer(player);
    return false;
  }

  onAddShipToGarrisonClicked(player: Player) {
    this.effectsService.addDreadnoughtToPlayer(player.id);
    this.aiManager.setPreferredFieldsForAIPlayer(player);
  }

  onRemoveShipFromGarrisonClicked(player: Player) {
    this.audioManager.playSound('click-reverse');
    this.combatManager.removePlayerShipsFromGarrison(player.id, 1);

    this.aiManager.setPreferredFieldsForAIPlayer(player);
    return false;
  }

  onAddRewardClicked(player: Player, type: EffectRewardType) {
    this.effectsService.addRewardToPlayer(player.id, { type });

    this.aiManager.setPreferredFieldsForAIPlayer(player);
    return false;
  }

  onRemoveResourceClicked(player: Player, type: ResourceType) {
    this.audioManager.playSound('click-reverse');
    this.playerResourcesService.removeResourceFromPlayer(player.id, type, 1);

    this.aiManager.setPreferredFieldsForAIPlayer(player);
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

  onAddPersuasionGainedThisRoundClicked(player: Player) {
    this.audioManager.playSound('click-soft');
    this.playersService.addPersuasionGainedToPlayer(player.id, 1);

    this.aiManager.setPreferredFieldsForAIPlayer(player);
  }

  onRemovePersuasionGainedThisRoundClicked(player: Player) {
    this.audioManager.playSound('click-reverse');
    this.playersService.removePersuasionGainedFromPlayer(player.id, 1);

    this.aiManager.setPreferredFieldsForAIPlayer(player);
    return false;
  }

  onAddAdditionalCombatPowerToPlayer(playerId: number) {
    this.audioManager.playSound('sword');
    this.combatManager.addAdditionalCombatPowerToPlayer(playerId, 1);
  }

  onRemoveAdditionalCombatPowerFromPlayer(playerId: number) {
    this.audioManager.playSound('sword');
    this.combatManager.removeAdditionalCombatPowerFromPlayer(playerId, 1);
    return false;
  }

  onPlayerCanEnterCombatClicked(playerId: number) {
    if (!this.turnInfos?.canEnterCombat) {
      let deployableUnits = this.settingsService.getCombatMaxDeployableUnits();
      this.turnInfoService.setPlayerTurnInfo(playerId, { canEnterCombat: true, deployableUnits });
    } else {
      this.turnInfoService.setPlayerTurnInfo(playerId, { canEnterCombat: false, deployableUnits: 0 });
    }
  }

  onPlayerCanBuyTechClicked(playerId: number) {
    this.turnInfoService.setPlayerTurnInfo(playerId, { canBuyTech: !this.turnInfos?.canBuyTech });
  }

  onAIIncreaseInfluenceChoiceClicked(playerId: number) {
    if (this.activePlayer) {
      this.effectsService.payCostForPlayer(playerId, { type: 'faction-influence-up-choice' });
      this.gameManager.aiResolveRewardChoices(this.activePlayer);
    }
  }

  onAIDecreaseInfluenceChoiceClicked(playerId: number) {
    if (this.activePlayer) {
      this.effectsService.payCostForPlayer(playerId, { type: 'faction-influence-down-choice' });
      this.gameManager.aiResolveRewardChoices(this.activePlayer);
    }
  }

  onRevealCardsClicked(playerId: number) {
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

  onEndTurnClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.isLeaderActive = false;
    this.gameManager.endPlayerTurn(playerId);
  }

  onAiActionClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.gameManager.executeAITurn(playerId);
  }

  onPassConflictClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.gameManager.playerPassedConflict(playerId);
  }

  onShowAdditionalPlayerActionsClicked() {
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
