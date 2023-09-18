import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Resource, ResourceType } from '../models';

export interface Player {
  id: number;
  agents: number;
  resources: Resource[];
  color: string;
  hasSwordmaster?: boolean;
  hasCouncilSeat?: boolean;
  intrigueCount: number;
  cardsInDeck: number;
  cardsBought: number;
  focusTokens: number;
  cardsTrimmed: number;
  cardsDrawnThisRound: number;
  techAgents: number;
  isAI?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerManager {
  public maxPlayers = 4;
  private playersSubject = new BehaviorSubject<Player[]>([]);
  public players$ = this.playersSubject.asObservable();

  constructor() {
    const playersString = localStorage.getItem('players');
    if (playersString) {
      const players = JSON.parse(playersString) as Player[];
      this.playersSubject.next(players);
    }

    this.players$.subscribe((players) => {
      localStorage.setItem('players', JSON.stringify(players));
    });
  }

  public get players() {
    return cloneDeep(this.playersSubject.value);
  }

  public getPlayer(playerId: number) {
    return this.players.find((x) => x.id === playerId);
  }

  public getPlayerColor(playerId: number) {
    const player = this.players.find((x) => x.id === playerId);
    return player ? player.color : '';
  }

  public addPlayer() {
    const players = this.players;

    if (players.length < this.maxPlayers) {
      players.push({
        id: players.length + 1,
        agents: 2,
        resources: [
          { type: 'currency', amount: 0 },
          { type: 'spice', amount: 0 },
          { type: 'water', amount: 1 },
        ],
        color: this.createPlayerColor(players.length + 1),
        cardsInDeck: 9,
        cardsBought: 0,
        focusTokens: 0,
        cardsTrimmed: 0,
        intrigueCount: 0,
        cardsDrawnThisRound: 0,
        techAgents: 0,
        isAI: true,
      });
    }

    this.playersSubject.next(players);
  }

  public removePlayer() {
    const players = this.players;

    players.pop();

    this.playersSubject.next(players);
  }

  public resetPlayers() {
    const players = this.players.map((player) => ({
      ...player,
      agents: 2,
      resources: [
        { type: 'currency', amount: 0 },
        { type: 'spice', amount: 0 },
        { type: 'water', amount: 1 },
      ] as Resource[],
      cardsInDeck: 9,
      cardsBought: 0,
      focusTokens: 0,
      cardsTrimmed: 0,
      intrigueCount: 0,
      cardsDrawnThisRound: 0,
      techAgents: 0,
      hasCouncilSeat: false,
      hasSwordmaster: false,
    }));
    this.playersSubject.next(players);
  }

  public setAIActiveForPlayer(id: number, active: boolean) {
    const players = this.players;

    const player = players.find((x) => x.id === id);
    if (player) {
      player.isAI = active;
    }

    this.playersSubject.next(players);
  }

  public addResourceToPlayer(id: number, type: ResourceType, amount: number) {
    const players = this.players;

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
    const players = this.players;

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

  public addIntriguesToPlayer(id: number, amount: number) {
    const players = this.players;

    const player = players.find((x) => x.id === id);
    if (player) {
      player.intrigueCount = player.intrigueCount + amount;
    }

    this.playersSubject.next(players);
  }

  public removeIntriguesFromPlayer(id: number, amount: number) {
    const players = this.players;

    const player = players.find((x) => x.id === id);
    if (player) {
      player.intrigueCount = player.intrigueCount - amount;
    }

    this.playersSubject.next(players);
  }

  public addTechAgentsToPlayer(id: number, amount: number) {
    const players = this.players;

    const player = players.find((x) => x.id === id);
    if (player) {
      player.techAgents = player.techAgents + amount;
    }

    this.playersSubject.next(players);
  }

  public removeTechAgentsFromPlayer(id: number, amount: number) {
    const players = this.players;

    const player = players.find((x) => x.id === id);
    if (player) {
      player.techAgents = player.techAgents - amount;
    }

    this.playersSubject.next(players);
  }

  public addCardsToPlayerDeck(id: number, amount: number) {
    const players = this.players;

    const player = players.find((x) => x.id === id);
    if (player) {
      player.cardsInDeck = player.cardsInDeck + amount;
    }

    this.playersSubject.next(players);
  }

  public removeCardsFromPlayerDeck(id: number, amount: number) {
    const players = this.players;

    const player = players.find((x) => x.id === id);
    if (player) {
      player.cardsInDeck = player.cardsInDeck - amount;
    }

    this.playersSubject.next(players);
  }

  public boughtCardsFromImperiumRow(id: number, amount: number) {
    const players = this.players;

    const player = players.find((x) => x.id === id);
    if (player) {
      player.cardsBought = player.cardsBought + amount;
      player.cardsInDeck = player.cardsInDeck + amount;
    }

    this.playersSubject.next(players);
  }

  public addFocusTokens(id: number, amount: number) {
    const players = this.players;

    const player = players.find((x) => x.id === id);
    if (player) {
      player.focusTokens = player.focusTokens + amount;
    }

    this.playersSubject.next(players);
  }

  public removeFocusTokens(id: number, amount: number) {
    const players = this.players;

    const player = players.find((x) => x.id === id);
    if (player && player.focusTokens >= amount) {
      player.focusTokens = player.focusTokens - amount;
    }

    this.playersSubject.next(players);
  }

  public trimCardsFromPlayerDeck(id: number, amount: number) {
    const players = this.players;

    const player = players.find((x) => x.id === id);
    if (player && player.focusTokens >= amount) {
      player.focusTokens = player.focusTokens - amount;
      player.cardsTrimmed = player.cardsTrimmed + amount;
      player.cardsInDeck = player.cardsInDeck - amount;
    }

    this.playersSubject.next(players);
  }

  public allPlayersDrawInitialCards() {
    const players = this.players;

    for (const player of players) {
      player.cardsDrawnThisRound = 5;
    }

    this.playersSubject.next(players);
  }

  public playerDrawsCards(id: number, amount: number) {
    const players = this.players;

    const player = players.find((x) => x.id === id);
    if (player) {
      player.cardsDrawnThisRound = player.cardsDrawnThisRound + amount;
    }

    this.playersSubject.next(players);
  }

  public addPermanentAgentToPlayer(playerId: number) {
    const players = this.players;

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, agents: player.agents + 1, hasSwordmaster: true };

    this.playersSubject.next(players);
  }

  public addCouncilSeatToPlayer(playerId: number) {
    const players = this.players;

    const playerIndex = players.findIndex((x) => x.id === playerId);
    const player = players[playerIndex];
    players[playerIndex] = { ...player, hasCouncilSeat: true };

    this.playersSubject.next(players);
  }

  public getNextPlayerId(currentPlayerId?: number) {
    if (currentPlayerId) {
      const nextPlayerId = currentPlayerId + 1;
      if (nextPlayerId > this.players.length) {
        return 1;
      } else {
        return nextPlayerId;
      }
    } else {
      return this.players[0].id;
    }
  }

  public isLastPlayer(currentPlayerId?: number) {
    if (currentPlayerId) {
      const nextPlayerId = currentPlayerId + 1;
      if (nextPlayerId > this.players.length) {
        return true;
      }
    }

    return false;
  }

  private createPlayerColor(id: number) {
    if (id === 1) {
      return 'rgb(25 73 255)';
    } else if (id === 2) {
      return 'rgb(200 140 0)';
    } else if (id === 3) {
      return 'rgb(0 151 32)';
    } else {
      return 'rgb(160 0 0)';
    }
    // const randomBetween = (min: number, max: number) =>
    //   min + Math.floor(Math.random() * (max - min + 1));
    // const r = randomBetween(125, 255);
    // const g = randomBetween(125, 255);
    // const b = randomBetween(125, 255);
    // return `rgb(${r},${g},${b})`;
  }
}
