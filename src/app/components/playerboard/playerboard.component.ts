import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { LanguageString } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CardsService } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { LeadersService } from 'src/app/services/leaders.service';
import { MultiplayerLobbyService } from 'src/app/services/multiplayer/multiplayer-lobby.service';
import { GameSessionService } from 'src/app/services/persistence/game-session.service';
import { PlayersService } from 'src/app/services/players.service';
import { RoundService } from 'src/app/services/round.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';
import { GameSummaryDialogComponent } from '../_common/dialogs/game-summary-dialog/game-summary-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DialogSettingsComponent } from '../dialog-settings/dialog-settings.component';
import { MultiplayerDialogComponent } from '../multiplayer-dialog/multiplayer-dialog.component';

@Component({
  selector: 'app-playerboard',
  templateUrl: './playerboard.component.html',
  styleUrls: ['./playerboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PlayerboardComponent implements OnInit, OnDestroy {
  t = inject(TranslateService);
  private gameManager = inject(GameManager);
  private playersService = inject(PlayersService);
  private lobbyService = inject(MultiplayerLobbyService);
  private gameSessionService = inject(GameSessionService);
  private leadersService = inject(LeadersService);
  private cardsService = inject(CardsService);
  private audioManager = inject(AudioManager);
  private settingsService = inject(SettingsService);
  private dialog = inject(MatDialog);
  private roundService = inject(RoundService);

  subscriptions: Subscription[] = [];

  players: Player[] = [];
  currentRound = 0;
  currentRoundPhase = '';
  canSwitchToCombatPhase = false;
  subTitle = '';

  roundString: LanguageString = { de: 'Runde', en: 'Round' };

  isFinale = false;
  maxPlayers = 0;

  allLeadersLockedIn = false;

  isSessionActive = false;
  isHost = true;

  ngOnInit(): void {
    const playersSub = this.playersService.players$.subscribe((players) => {
      this.players = players;

      this.canSwitchToCombatPhase = !players.some((x) => x.turnState === 'agent-placement');
    });

    const currentRoundSub = this.roundService.currentRound$.subscribe((currentTurn) => {
      this.currentRound = currentTurn;
    });

    const currentRoundPhaseSub = this.roundService.currentRoundPhase$.subscribe((currentRoundPhase) => {
      this.currentRoundPhase = currentRoundPhase;
    });

    const isFinaleS = this.roundService.isFinale$.subscribe((isFinale) => {
      this.isFinale = isFinale;
    });

    const gameContentSub = this.settingsService.gameContent$.subscribe((gameContent) => {
      this.maxPlayers = gameContent.maxPlayers;
      this.subTitle = gameContent.name;
    });

    const playerLeadersSub = this.leadersService.playerLeaders$.subscribe((playerLeaders) => {
      this.allLeadersLockedIn = playerLeaders.filter((x) => x.isLockedIn).length === this.players.length;
    });

    const activeSessionSub = this.gameSessionService.activeSession$.subscribe((session) => {
      this.isSessionActive = !!session;
    });

    const isHostSub = this.gameSessionService.isHost$.subscribe((isHost) => {
      this.isHost = isHost;
    });

    this.subscriptions.push(
      playersSub,
      currentRoundSub,
      currentRoundPhaseSub,
      isFinaleS,
      gameContentSub,
      playerLeadersSub,
      activeSessionSub,
      isHostSub,
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onAddPlayerClicked() {
    this.audioManager.playSound('click-soft');
    this.lobbyService.addPlayerSlot(true);
  }

  onRemovePlayerClicked() {
    this.audioManager.playSound('click-soft');
    void this.lobbyService.removeLastPlayerSlot();
  }

  onStartLocalGameClicked() {
    this.lobbyService.startGame();
  }

  onMultiplayerClicked() {
    this.dialog.open(MultiplayerDialogComponent, { width: '720px' });
  }

  onBeginPlayClicked() {
    this.gameManager.beginPlay();
  }

  showSettingsDialog() {
    const dialogRef = this.dialog.open(DialogSettingsComponent, {
      width: '600px',
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
        this.playersService.setTurnStateForPlayer(activePlayer.id, 'revealed');
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
}
