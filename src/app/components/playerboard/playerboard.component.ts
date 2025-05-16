import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { EffectType, FactionType, LanguageString } from 'src/app/models';
import { PlayerIntrigueStack } from 'src/app/models/intrigue';
import { Player } from 'src/app/models/player';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CardsService, PlayerCardStack } from 'src/app/services/cards.service';
import { GameManager, PlayerAgents } from 'src/app/services/game-manager.service';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { LeadersService } from 'src/app/services/leaders.service';
import { PlayerScore, PlayerScoreManager, PlayerScoreType } from 'src/app/services/player-score-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { TranslateService } from 'src/app/services/translate-service';
import { GameSummaryDialogComponent } from '../_common/dialogs/game-summary-dialog/game-summary-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DialogSettingsComponent } from '../dialog-settings/dialog-settings.component';

@Component({
  selector: 'app-playerboard',
  templateUrl: './playerboard.component.html',
  styleUrls: ['./playerboard.component.scss'],
})
export class PlayerboardComponent implements OnInit {
  public players: Player[] = [];
  public currentTurn = 0;
  public turnState = '';
  public canSwitchToCombatPhase = false;
  public availablePlayerAgents: PlayerAgents[] = [];

  public playerScores: PlayerScore[] = [];

  public roundString: LanguageString = { de: 'Runde', en: 'Round' };
  public playerDecks: PlayerCardStack[] = [];
  public playerDiscardPiles: PlayerCardStack[] = [];
  public playerHandCards: PlayerCardStack[] = [];
  public playerIntrigues: PlayerIntrigueStack[] = [];

  public isFinale = false;

  constructor(
    public gameManager: GameManager,
    public playerManager: PlayersService,
    public playerScoreManager: PlayerScoreManager,
    public leadersService: LeadersService,
    public cardsService: CardsService,
    public intriguesService: IntriguesService,
    public t: TranslateService,
    private audioManager: AudioManager,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.playerManager.players$.subscribe((players) => {
      this.players = players;
      this.canSwitchToCombatPhase = !players.some((x) => x.turnState === 'agent-placement');
    });

    this.gameManager.currentRound$.subscribe((currentTurn) => {
      this.currentTurn = currentTurn;
    });

    this.gameManager.currentRoundPhase$.subscribe((currentRoundPhase) => {
      this.turnState = currentRoundPhase;
    });

    this.gameManager.availablePlayerAgents$.subscribe((availablePlayerAgents) => {
      this.availablePlayerAgents = availablePlayerAgents;
    });

    this.playerScoreManager.playerScores$.subscribe((playerScores) => {
      this.playerScores = playerScores;
    });

    this.cardsService.playerDecks$.subscribe((playerDecks) => {
      this.playerDecks = playerDecks;
    });

    this.cardsService.playerDiscardPiles$.subscribe((playerDiscardPiles) => {
      this.playerDiscardPiles = playerDiscardPiles;
    });

    this.cardsService.playerHands$.subscribe((playerHandCards) => {
      this.playerHandCards = playerHandCards;
    });

    this.intriguesService.playerIntrigues$.subscribe((playerIntrigues) => {
      this.playerIntrigues = playerIntrigues;
    });

    this.gameManager.isFinale$.subscribe((isFinale) => {
      this.isFinale = isFinale;
    });
  }

  onAddPlayerClicked() {
    this.audioManager.playSound('click-soft');
    this.playerManager.addPlayer();
  }

  onRemovePlayerClicked() {
    this.audioManager.playSound('click-soft');
    this.playerManager.removePlayer();
  }

  onSetAIActiveClicked(playerId: number, event: MatSlideToggleChange) {
    this.audioManager.playSound('tech-tile');
    this.playerManager.setAIActiveForPlayer(playerId, event.checked);
    if (event.checked && this.currentTurn > 0) {
      this.gameManager.setPreferredFieldsForAIPlayer(playerId);
    }
  }

  onStartGameClicked() {
    this.gameManager.startGame();
  }

  showSettingsDialog() {
    const dialogRef = this.dialog.open(DialogSettingsComponent, {
      width: '500px',
      data: {
        title: 'Settings',
      },
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  onBeginCombatClicked() {
    const activePlayer = this.gameManager.getActivePlayer();
    if (activePlayer && activePlayer.turnState === 'reveal') {
      const playerHand = this.cardsService.getPlayerHand(activePlayer.id);
      if (playerHand && playerHand.cards) {
        this.cardsService.discardPlayerHandCards(activePlayer.id);
        this.playerManager.setTurnStateForPlayer(activePlayer.id, 'revealed');
      }
    }
    this.gameManager.setRoundStateToCombat();
  }

  onResolveCombatClicked() {
    this.gameManager.resolveConflict();
  }

  onNextRoundClicked() {
    this.gameManager.setNextRound();
  }

  onFinishGameClicked() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Are you sure you want to finish the game?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.gameManager.finishGame();
      }
    });
  }

  onShowGameSummaryClicked() {
    const dialogRef = this.dialog.open(GameSummaryDialogComponent, {
      data: {
        title: 'Are you sure you want to finish the game?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      this.gameManager.finishGame();
    });
  }

  public getAvailablePlayerAgents(playerId: number) {
    const playerAgents = this.availablePlayerAgents.find((x) => x.playerId === playerId);
    return playerAgents ? playerAgents.agentAmount : 0;
  }

  public getPlayerScore(playerId: number, scoreType: PlayerScoreType) {
    const playerScore = this.playerScores.find((x) => x.playerId === playerId);
    if (playerScore) {
      return playerScore[scoreType];
    } else {
      return 0;
    }
  }

  public getPlayerDeck(playerId: number) {
    return this.playerDecks.find((x) => x.playerId === playerId);
  }

  public getPlayerDiscardPile(playerId: number) {
    return this.playerDiscardPiles.find((x) => x.playerId === playerId);
  }

  public getPlayerHandCards(playerId: number) {
    return this.playerHandCards.find((x) => x.playerId === playerId);
  }

  public getPlayerIntrigues(playerId: number) {
    return this.playerIntrigues.find((x) => x.playerId === playerId);
  }

  getPlayerLeaderName(playerId: number) {
    const leader = this.leadersService.getLeader(playerId);
    if (leader) {
      return leader.name;
    } else {
      return { en: 'p. ' + playerId, de: 'p. ' + playerId };
    }
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public getFactionTypePath(rewardType: FactionType) {
    return getFactionTypePath(rewardType);
  }
}
