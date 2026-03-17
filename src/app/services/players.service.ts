import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Player, PlayerTurnState } from '../models/player';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private playersSubject = new BehaviorSubject<Player[]>([]);
  public players$ = this.playersSubject.asObservable();

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

  public getPlayers() {
    return cloneDeep(this.playersSubject.value);
  }

  public getPlayerIds() {
    return cloneDeep(this.playersSubject.value).map((x) => x.id);
  }

  public getPlayerCount() {
    return this.playersSubject.value.length;
  }

  public getPlayer(playerId: number) {
    return cloneDeep(this.playersSubject.value.find((x) => x.id === playerId));
  }

  public getEnemyPlayers(playerId: number) {
    return cloneDeep(this.playersSubject.value.filter((x) => x.id !== playerId));
  }

  public getPlayerColor(playerId: number) {
    const player = this.playersSubject.value.find((x) => x.id === playerId);
    return player ? cloneDeep(player.color) : '';
  }

  public getPlayerPersuasion(playerId: number) {
    const player = this.playersSubject.value.find((x) => x.id === playerId);
    return player ? player.permanentPersuasion + player.persuasionGainedThisRound - player.persuasionSpentThisRound : 0;
  }

  public addPlayer() {
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

  public removePlayer() {
    const players = this.getPlayers();

    players.pop();

    this.playersSubject.next(players);
  }

  public resetPlayers() {
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

  public setTurnStateForPlayer(id: number, turnState: PlayerTurnState) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player) {
      player.turnState = turnState;
    }

    this.playersSubject.next(players);
  }

  public resetTurnStateForPlayers() {
    this.playersSubject.next(this.getPlayers().map((x) => ({ ...x, turnState: 'agent-placement' })));
  }

  public setAIActiveForPlayer(id: number, active: boolean) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player) {
      player.isAI = active;
    }

    this.playersSubject.next(players);
  }

  public increaseTurnNumberForPlayer(id: number) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player) {
      player.turnNumber++;
    }

    this.playersSubject.next(players);
  }

  public resetTurnNumberForPlayers() {
    this.playersSubject.next(this.getPlayers().map((x) => ({ ...x, turnNumber: 0 })));
  }

  public addPermanentAgentToPlayer(playerId: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, agents: player.agents + 1, hasSwordmaster: true };

    this.playersSubject.next(players);
  }

  public addCouncilSeatToPlayer(playerId: number) {
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

  public addPersuasionGainedToPlayer(playerId: number, amount: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, persuasionGainedThisRound: player.persuasionGainedThisRound + amount };

    this.playersSubject.next(players);
  }

  public removePersuasionGainedFromPlayer(playerId: number, amount: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, persuasionGainedThisRound: player.persuasionGainedThisRound - amount };

    this.playersSubject.next(players);
  }

  public addPersuasionSpentToPlayer(playerId: number, amount: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, persuasionSpentThisRound: player.persuasionSpentThisRound + amount };

    this.playersSubject.next(players);
  }

  public resetPersuasionForPlayers() {
    this.playersSubject.next(
      this.getPlayers().map((x) => ({ ...x, persuasionGainedThisRound: 0, persuasionSpentThisRound: 0 })),
    );
  }

  public addPermanentPersuasionToPlayer(playerId: number, amount: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, permanentPersuasion: player.permanentPersuasion + amount };

    this.playersSubject.next(players);
  }

  public removePermanentPersuasionFromPlayer(playerId: number, amount: number) {
    const players = this.getPlayers();

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, permanentPersuasion: player.permanentPersuasion - amount };

    this.playersSubject.next(players);
  }

  public getFirstPlayerId() {
    return cloneDeep(this.playersSubject.value[0].id);
  }

  public getNextPlayerId(activePlayerId?: number) {
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

  public isLastPlayer(activePlayerId?: number) {
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
