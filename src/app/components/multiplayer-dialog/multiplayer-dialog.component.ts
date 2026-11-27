import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';
import { appVersion } from 'src/app/constants/version';
import { LocaleType } from 'src/app/locales';
import { LobbySlot } from 'src/app/services/multiplayer/lobby-slots';
import { MultiplayerLobbyService } from 'src/app/services/multiplayer/multiplayer-lobby.service';
import { SessionSyncStatus } from 'src/app/services/persistence/game-session-synchronizer.service';
import { ActiveGameSession, GameSessionService } from 'src/app/services/persistence/game-session.service';
import { SessionApiError } from 'src/app/services/persistence/session-api.client';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

export interface MultiplayerDialogData {
  sessionCodeFromInviteLink?: string;
}

const syncStatusTexts: Record<SessionSyncStatus, LocaleType> = {
  inactive: 'multiplayerStatusConnecting',
  synchronized: 'multiplayerStatusSynchronized',
  'connection-error': 'multiplayerStatusConnectionError',
  'session-not-found': 'multiplayerStatusSessionNotFound',
};

@Component({
  selector: 'dune-multiplayer-dialog',
  templateUrl: './multiplayer-dialog.component.html',
  styleUrls: ['./multiplayer-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class MultiplayerDialogComponent implements OnInit, OnDestroy {
  t = inject(TranslateService);
  private dialogRef = inject<MatDialogRef<MultiplayerDialogComponent>>(MatDialogRef);
  private data = inject<MultiplayerDialogData | null>(MAT_DIALOG_DATA, { optional: true });
  private gameSessionService = inject(GameSessionService);
  private lobbyService = inject(MultiplayerLobbyService);
  private settingsService = inject(SettingsService);

  activeSession: ActiveGameSession | undefined;
  isHost = true;
  syncStatus: SessionSyncStatus = 'inactive';
  lobbySlots: LobbySlot[] = [];
  isLobbyOpen = false;
  canStartGame = false;
  maxPlayers = 0;

  sessionCodeInput = '';
  errorMessage = '';
  isRequestRunning = false;
  isInviteLinkCopied = false;

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.sessionCodeInput = this.data?.sessionCodeFromInviteLink ?? '';

    this.subscriptions.push(
      this.gameSessionService.activeSession$.subscribe((session) => (this.activeSession = session)),
      this.gameSessionService.isHost$.subscribe((isHost) => (this.isHost = isHost)),
      this.gameSessionService.syncStatus$.subscribe((syncStatus) => (this.syncStatus = syncStatus)),
      this.lobbyService.lobbySlots$.subscribe((lobbySlots) => (this.lobbySlots = lobbySlots)),
      this.lobbyService.isLobbyOpen$.subscribe((isLobbyOpen) => (this.isLobbyOpen = isLobbyOpen)),
      this.lobbyService.canStartGame$.subscribe((canStartGame) => (this.canStartGame = canStartGame)),
      this.settingsService.gameContent$.subscribe((gameContent) => (this.maxPlayers = gameContent.maxPlayers)),
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  get syncStatusText() {
    return this.t.translate(syncStatusTexts[this.syncStatus]);
  }

  getSlotOccupantText(slot: LobbySlot) {
    switch (slot.occupant) {
      case 'ai':
        return this.t.translate('multiplayerSlotAI');
      case 'free':
        return this.t.translate('multiplayerSlotFree');
      case 'this-device':
        return this.t.translate('multiplayerSlotThisDevice');
      case 'other-device':
        return this.t.translate(slot.isHostSeat ? 'multiplayerSlotHost' : 'multiplayerSlotOtherDevice');
    }
  }

  canChangeReadyState(slot: LobbySlot) {
    return this.isLobbyOpen && slot.occupant === 'this-device' && !slot.isHostSeat;
  }

  canReleaseSeat(slot: LobbySlot) {
    const isSeated = slot.occupant === 'this-device' || slot.occupant === 'other-device';
    return isSeated && (slot.occupant === 'this-device' || this.isHost);
  }

  canToggleAI(slot: LobbySlot) {
    return this.isHost && this.isLobbyOpen && (slot.occupant === 'ai' || slot.occupant === 'free');
  }

  onCreateSessionClicked() {
    void this.runSessionRequest(() => this.gameSessionService.createSession());
  }

  onJoinSessionClicked() {
    void this.runSessionRequest(() => this.gameSessionService.joinSession(this.sessionCodeInput));
  }

  onLeaveSessionClicked() {
    this.isInviteLinkCopied = false;
    void this.runSessionRequest(() => this.gameSessionService.leaveSession());
  }

  onClaimSeatClicked(playerId: number) {
    void this.runSessionRequest(() => this.gameSessionService.claimSeat(playerId));
  }

  onReleaseSeatClicked(playerId: number) {
    void this.runSessionRequest(() => this.gameSessionService.releaseSeat(playerId));
  }

  onReadyChanged(playerId: number, isReady: boolean) {
    void this.runSessionRequest(() => this.gameSessionService.setSeatReady(playerId, isReady));
  }

  onSlotAIChanged(playerId: number, event: MatSlideToggleChange) {
    this.lobbyService.setPlayerSlotAI(playerId, event.checked);
  }

  onAddPlayerSlotClicked(isAI: boolean) {
    this.lobbyService.addPlayerSlot(isAI);
  }

  onRemoveLastPlayerSlotClicked() {
    void this.runSessionRequest(() => this.lobbyService.removeLastPlayerSlot());
  }

  onStartGameClicked() {
    this.lobbyService.startGame();
    this.dialogRef.close();
  }

  async onCopyInviteLinkClicked() {
    if (!this.activeSession) {
      return;
    }
    const inviteLink = this.gameSessionService.createInviteLink(this.activeSession.sessionCode);
    await navigator.clipboard.writeText(inviteLink);
    this.isInviteLinkCopied = true;
  }

  onCloseClicked() {
    this.dialogRef.close();
  }

  private async runSessionRequest(request: () => Promise<unknown>) {
    this.errorMessage = '';
    this.isRequestRunning = true;
    try {
      await request();
    } catch (error) {
      this.errorMessage = this.describeSessionError(error);
    } finally {
      this.isRequestRunning = false;
    }
  }

  private describeSessionError(error: unknown) {
    if (!(error instanceof SessionApiError)) {
      return this.t.translate('multiplayerErrorConnection');
    }

    switch (error.errorCode) {
      case 'session-not-found':
      case 'invalid-session-code':
        return this.t.translate('multiplayerErrorSessionNotFound');
      case 'app-version-mismatch':
        return this.t.translate('multiplayerErrorAppVersionMismatch', false, readSessionAppVersion(error), appVersion);
      case 'seat-taken':
        return this.t.translate('multiplayerErrorSeatTaken');
      default:
        return this.t.translate('multiplayerErrorUnknown', false, error.errorCode);
    }
  }
}

function readSessionAppVersion(error: SessionApiError) {
  const responseBody = error.responseBody as { sessionAppVersion?: string } | undefined;
  return responseBody?.sessionAppVersion ?? '?';
}
