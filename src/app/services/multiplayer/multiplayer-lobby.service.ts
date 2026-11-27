import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { CombatManager } from '../combat-manager.service';
import { GameManager } from '../game-manager.service';
import { GameSessionService } from '../persistence/game-session.service';
import { PlayerRewardChoicesService } from '../player-reward-choices.service';
import { PlayerScoreManager } from '../player-score-manager.service';
import { PlayersService } from '../players.service';
import { RoundService } from '../round.service';
import { canStartMultiplayerGame, createLobbySlots, LobbySlot } from './lobby-slots';

/**
 * Manages the player slots before a game starts.
 * Without a session, all slots belong to this device (offline play).
 */
@Injectable({
  providedIn: 'root',
})
export class MultiplayerLobbyService {
  private gameSessionService = inject(GameSessionService);
  private playersService = inject(PlayersService);
  private playerScoreManager = inject(PlayerScoreManager);
  private playerRewardChoicesService = inject(PlayerRewardChoicesService);
  private combatManager = inject(CombatManager);
  private gameManager = inject(GameManager);
  private roundService = inject(RoundService);

  isLobbyOpen$ = combineLatest([this.roundService.currentRound$, this.roundService.currentRoundPhase$]).pipe(
    map(([currentRound, currentRoundPhase]) => currentRound === 0 && currentRoundPhase === 'none'),
  );

  lobbySlots$: Observable<LobbySlot[]> = this.gameSessionService.activeSession$.pipe(
    switchMap((session) => {
      if (!session) {
        return of([]);
      }
      return combineLatest([this.playersService.players$, this.gameSessionService.seats$]).pipe(
        map(([players, seats]) =>
          createLobbySlots(players, seats, {
            thisDeviceId: this.gameSessionService.deviceId,
            hostDeviceId: session.hostDeviceId,
          }),
        ),
      );
    }),
  );

  canStartGame$ = combineLatest([this.lobbySlots$, this.isLobbyOpen$, this.gameSessionService.isHost$]).pipe(
    map(([slots, isLobbyOpen, isHost]) => isLobbyOpen && isHost && canStartMultiplayerGame(slots)),
  );

  /**
   * Leftover reward choices of a previous game are cleared first. Otherwise the game manager would try to
   * resolve them as soon as a player with the same id is added, before the player has combat units.
   */
  addPlayerSlot(isAI: boolean) {
    this.playerRewardChoicesService.resetPlayerRewardChoices();

    const playerCountBefore = this.playersService.getPlayerCount();
    this.playersService.addPlayer();

    const players = this.playersService.getPlayers();
    if (players.length === playerCountBefore) {
      return;
    }

    const addedPlayer = players[players.length - 1];
    this.playersService.setAIActiveForPlayer(addedPlayer.id, isAI);
    this.resetPlayerDependentValues();
  }

  /** A seat of the removed player is released, so it doesn't block the slot when it is added again. */
  async removeLastPlayerSlot() {
    const players = this.playersService.getPlayers();
    const lastPlayer = players[players.length - 1];
    if (!lastPlayer) {
      return;
    }

    if (this.isPlayerSeated(lastPlayer.id)) {
      await this.gameSessionService.releaseSeat(lastPlayer.id);
    }
    this.playersService.removePlayer();
    this.resetPlayerDependentValues();
  }

  setPlayerSlotAI(playerId: number, isAI: boolean) {
    const player = this.playersService.getPlayer(playerId);
    if (!player) {
      return;
    }
    this.gameManager.setAIActiveForPlayer(player, isAI);
  }

  startGame() {
    this.gameManager.startGame();
  }

  private isPlayerSeated(playerId: number) {
    if (!this.gameSessionService.activeSession) {
      return false;
    }
    return this.gameSessionService.seats.some((seat) => seat.playerId === playerId);
  }

  private resetPlayerDependentValues() {
    const players = this.playersService.getPlayers();
    this.playerScoreManager.resetPlayersScores(players);
    this.combatManager.setInitialPlayerCombatUnits(players);
  }
}
