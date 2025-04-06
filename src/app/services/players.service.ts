import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Resource, ResourceType } from '../models';
import { Player, PlayerTurnState } from '../models/player';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  public maxPlayers = 4;
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

  public getPlayerFocusTokens(playerId: number) {
    const player = this.playersSubject.value.find((x) => x.id === playerId);
    return player ? cloneDeep(player.focusTokens) : 0;
  }

  public addPlayer() {
    const players = this.getPlayers();

    if (players.length < this.maxPlayers) {
      players.push({
        id: players.length + 1,
        agents: 2,
        turnState: 'agent-placement',
        resources: [
          { type: 'solari', amount: 0 },
          { type: 'spice', amount: 0 },
          { type: 'water', amount: 0 },
        ],
        color: this.createPlayerColor(players.length + 1),
        focusTokens: 0,
        signetTokenCount: 0,
        cardsDrawnAtRoundStart: 5,
        persuasionGainedThisRound: 0,
        persuasionSpentThisRound: 0,
        tech: 0,
        permanentPersuasion: 0,
        isAI: true,
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
    const playerStartingResources = this.settingsService.getStartingResources();
    const playerStartingSolari = playerStartingResources.find((x) => x.type === 'solari')?.amount ?? 0;
    const playerStartingSpice = playerStartingResources.find((x) => x.type === 'spice')?.amount ?? 0;
    const playerStartingWater = playerStartingResources.find((x) => x.type === 'water')?.amount ?? 0;

    const players: Player[] = this.getPlayers().map((player) => ({
      ...player,
      agents: 2,
      turnState: 'agent-placement',
      resources: [
        { type: 'solari', amount: playerStartingSolari },
        { type: 'spice', amount: playerStartingSpice },
        { type: 'water', amount: playerStartingWater },
      ] as Resource[],
      cardsBought: 0,
      focusTokens: 0,
      intrigueCount: 0,
      signetTokenCount: 0,
      cardsDrawnAtRoundStart: 5,
      tech: 0,
      persuasionGainedThisRound: 0,
      persuasionSpentThisRound: 0,
      permanentPersuasion: 0,
      hasCouncilSeat: false,
      hasSwordmaster: false,
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

  public addResourceToPlayer(id: number, type: ResourceType, amount: number) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player) {
      const resourceIndex = player.resources.findIndex((x) => x.type === type);
      const currentResourceAmount = player.resources[resourceIndex].amount;
      player.resources[resourceIndex] = {
        ...player.resources[resourceIndex],
        amount: currentResourceAmount ? currentResourceAmount + amount : amount,
      };
    }

    this.playersSubject.next(players);
  }

  public removeResourceFromPlayer(id: number, type: ResourceType, amount: number) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player) {
      const resourceIndex = player.resources.findIndex((x) => x.type === type);
      const currentResourceAmount = player.resources[resourceIndex].amount;
      player.resources[resourceIndex] = {
        ...player.resources[resourceIndex],
        amount: currentResourceAmount ? currentResourceAmount - amount : 0,
      };
    }

    this.playersSubject.next(players);
  }

  public addSignetTokensToPlayer(id: number, amount: number) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player) {
      player.signetTokenCount = player.signetTokenCount + amount;
    }

    this.playersSubject.next(players);
  }

  public removeSignetTokensFromPlayer(id: number, amount: number) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player) {
      player.signetTokenCount = player.signetTokenCount - amount;
    }

    this.playersSubject.next(players);
  }

  public addTechToPlayer(id: number, amount: number) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player) {
      player.tech = player.tech + amount;
    }

    this.playersSubject.next(players);
  }

  public removeTechFromPlayer(id: number, amount: number) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player) {
      player.tech = player.tech - amount;
    }

    this.playersSubject.next(players);
  }

  public addFocusTokens(id: number, amount: number) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player) {
      player.focusTokens = player.focusTokens + amount;
    }

    this.playersSubject.next(players);
  }

  public removeFocusTokens(id: number, amount: number) {
    const players = this.getPlayers();

    const player = players.find((x) => x.id === id);
    if (player && player.focusTokens >= amount) {
      player.focusTokens = player.focusTokens - amount;
    }

    this.playersSubject.next(players);
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
      this.getPlayers().map((x) => ({ ...x, persuasionGainedThisRound: 0, persuasionSpentThisRound: 0 }))
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

  public getNextPlayerId(currentPlayerId?: number) {
    if (currentPlayerId) {
      const nextPlayerId = currentPlayerId + 1;
      if (nextPlayerId > this.getPlayerCount()) {
        return 1;
      } else {
        return nextPlayerId;
      }
    } else {
      return this.getFirstPlayerId();
    }
  }

  public isLastPlayer(currentPlayerId?: number) {
    if (currentPlayerId) {
      const nextPlayerId = currentPlayerId + 1;
      if (nextPlayerId > this.getPlayerCount()) {
        return true;
      }
    }

    return false;
  }

  private createPlayerColor(id: number) {
    if (id === 1) {
      return 'rgb(255 202 75)';
    } else if (id === 2) {
      return 'rgb(65 79 98)';
    } else if (id === 3) {
      return 'rgb(36 203 71)';
    } else {
      return 'rgb(103 0 0)';
    }
    // const randomBetween = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
    // const r = randomBetween(0, 255);
    // const g = randomBetween(0, 255);
    // const b = randomBetween(0, 255);
    // return `rgb(${r},${g},${b})`;
  }
}
