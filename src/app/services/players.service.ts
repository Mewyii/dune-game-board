import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { Player, PlayerTurnState } from '../models/player';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private playersSubject = new BehaviorSubject<Player[]>([]);
  players$ = this.playersSubject.asObservable();
  playerColors$ = this.players$.pipe(
    map((players) => {
      const playerColors: { [key: number]: string } = {};
      for (const player of players) {
        playerColors[player.id] = player.color;
      }
      return playerColors;
    }),
    distinctUntilChanged(),
  );

  constructor(private settingsService: SettingsService) {
    const playersString = localStorage.getItem('players');
    if (playersString) {
      const players = JSON.parse(playersString) as Player[];
      this.playersSubject.next(players);
    }

    this.players$.subscribe((players) => {
      localStorage.setItem('players', JSON.stringify(players));
    });
  }

  getPlayers() {
    return cloneDeep(this.playersSubject.value);
  }

  getPlayerIds() {
    return cloneDeep(this.playersSubject.value).map((x) => x.id);
  }

  getPlayerCount() {
    return this.playersSubject.value.length;
  }

  getPlayer(playerId: number) {
    return cloneDeep(this.playersSubject.value.find((x) => x.id === playerId));
  }

  getEnemyPlayers(playerId: number) {
    return cloneDeep(this.playersSubject.value.filter((x) => x.id !== playerId));
  }

  getPlayerColor(playerId: number) {
    const player = this.playersSubject.value.find((x) => x.id === playerId);
    return player ? cloneDeep(player.color) : '';
  }

  getPlayerPersuasion(playerId: number) {
    const player = this.playersSubject.value.find((x) => x.id === playerId);
    return player ? player.permanentPersuasion + player.persuasionGainedThisRound - player.persuasionSpentThisRound : 0;
  }

  addPlayer() {
    const players = this.getPlayers();

    if (players.length < this.settingsService.getMaxPlayers()) {
      players.push({
        id: players.length + 1,
        agents: 2,
        turnState: 'agent-placement',
        color: this.createPlayerColor(players.length + 1),
        cardsDrawnAtRoundStart: 5,
        persuasionGainedThisRound: 0,
        persuasionSpentThisRound: 0,
        permanentPersuasion: 0,
        isAI: true,
        turnNumber: 0,
      });
    }

    this.playersSubject.next(players);
  }

  removePlayer() {
    const players = this.getPlayers();

    players.pop();

    this.playersSubject.next(players);
  }

  resetPlayers() {
    const players: Player[] = this.getPlayers().map((player) => ({
      ...player,
      agents: 2,
      turnState: 'agent-placement',
      cardsBought: 0,
      cardsDrawnAtRoundStart: 5,
      persuasionGainedThisRound: 0,
      persuasionSpentThisRound: 0,
      permanentPersuasion: 0,
      hasCouncilSeat: false,
      hasSwordmaster: false,
      turnNumber: 0,
    }));
    this.playersSubject.next(players);

    return players;
  }

  setTurnStateForPlayer(id: number, turnState: PlayerTurnState) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player) {
      player.turnState = turnState;
    }

    this.playersSubject.next(players);
  }

  resetTurnStateForPlayers() {
    this.playersSubject.next(this.getPlayers().map((x) => ({ ...x, turnState: 'agent-placement' })));
  }

  setAIActiveForPlayer(playerId: number, active: boolean) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === playerId);
    if (player) {
      player.isAI = active;
    }

    this.playersSubject.next(players);
  }

  increaseTurnNumberForPlayer(id: number) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player) {
      player.turnNumber++;
    }

    this.playersSubject.next(players);
  }

  resetTurnNumberForPlayers() {
    this.playersSubject.next(this.getPlayers().map((x) => ({ ...x, turnNumber: 0 })));
  }

  addPermanentAgentToPlayer(playerId: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, agents: player.agents + 1, hasSwordmaster: true };

    this.playersSubject.next(players);
  }

  addCouncilSeatToPlayer(playerId: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = {
      ...player,
      hasCouncilSeat: true,
      permanentPersuasion: player.permanentPersuasion + this.settingsService.getHighCouncilPersuasionAmount(),
    };

    this.playersSubject.next(players);
  }

  addPersuasionGainedToPlayer(playerId: number, amount: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, persuasionGainedThisRound: player.persuasionGainedThisRound + amount };

    this.playersSubject.next(players);
  }

  removePersuasionGainedFromPlayer(playerId: number, amount: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, persuasionGainedThisRound: player.persuasionGainedThisRound - amount };

    this.playersSubject.next(players);
  }

  addPersuasionSpentToPlayer(playerId: number, amount: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, persuasionSpentThisRound: player.persuasionSpentThisRound + amount };

    this.playersSubject.next(players);
  }

  resetPersuasionForPlayers() {
    this.playersSubject.next(
      this.getPlayers().map((x) => ({ ...x, persuasionGainedThisRound: 0, persuasionSpentThisRound: 0 })),
    );
  }

  addPermanentPersuasionToPlayer(playerId: number, amount: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, permanentPersuasion: player.permanentPersuasion + amount };

    this.playersSubject.next(players);
  }

  removePermanentPersuasionFromPlayer(playerId: number, amount: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, permanentPersuasion: player.permanentPersuasion - amount };

    this.playersSubject.next(players);
  }

  getFirstPlayerId() {
    return cloneDeep(this.playersSubject.value[0].id);
  }

  getNextPlayerId(activePlayerId?: number) {
    if (activePlayerId) {
      const nextPlayerId = activePlayerId + 1;
      if (nextPlayerId > this.getPlayerCount()) {
        return 1;
      } else {
        return nextPlayerId;
      }
    } else {
      return this.getFirstPlayerId();
    }
  }

  isLastPlayer(activePlayerId?: number) {
    if (activePlayerId) {
      const nextPlayerId = activePlayerId + 1;
      if (nextPlayerId > this.getPlayerCount()) {
        return true;
      }
    }

    return false;
  }

  private createPlayerColor(id: number) {
    if (id === 1) {
      return 'rgb(255, 206, 92)';
    } else if (id === 2) {
      return 'rgb(107, 128, 139)';
    } else if (id === 3) {
      return 'rgb(59, 215, 93)';
    } else if (id === 4) {
      return 'rgb(120, 0, 0)';
    } else if (id === 5) {
      return 'rgb(68, 43, 255)';
    } else {
      return 'rgb(0, 230, 214)';
    }
  }
}
