import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep, shuffle } from 'lodash';
import { IntrigueConfiguratorService } from './configurators/intrigue-configurator.service';
import { IntrigueCard, IntrigueDeckCard, IntrigueType, PlayerIntrigueStack } from '../models/intrigue';

@Injectable({
  providedIn: 'root',
})
export class IntriguesService {
  private intrigueDeckSubject = new BehaviorSubject<IntrigueDeckCard[]>([]);
  public intrigueDeck$ = this.intrigueDeckSubject.asObservable();

  private playerIntriguesSubject = new BehaviorSubject<PlayerIntrigueStack[]>([]);
  public playerIntrigues$ = this.playerIntriguesSubject.asObservable();

  constructor(private intrigueConfigService: IntrigueConfiguratorService) {
    const intrigueDeckString = localStorage.getItem('intrigueDeck');
    if (intrigueDeckString) {
      const intrigueDeck = JSON.parse(intrigueDeckString) as IntrigueDeckCard[];

      this.intrigueDeckSubject.next(intrigueDeck);
    }

    this.intrigueDeck$.subscribe((intrigueDeck) => {
      localStorage.setItem('intrigueDeck', JSON.stringify(intrigueDeck));
    });

    const playerIntriguesString = localStorage.getItem('playerIntrigues');
    if (playerIntriguesString) {
      const playerIntrigues = JSON.parse(playerIntriguesString) as PlayerIntrigueStack[];
      this.playerIntriguesSubject.next(playerIntrigues);
    }

    this.playerIntrigues$.subscribe((playerIntrigues) => {
      localStorage.setItem('playerIntrigues', JSON.stringify(playerIntrigues));
    });
  }

  public get intrigueDeck() {
    return cloneDeep(this.intrigueDeckSubject.value);
  }

  public get playerIntrigues() {
    return cloneDeep(this.playerIntriguesSubject.value);
  }

  public setInitialIntrigueDeck() {
    this.playerIntriguesSubject.next([]);
    const intrigueDeck: IntrigueDeckCard[] = [];
    const intriguesCards = this.intrigueConfigService.intrigues;
    for (const intriguesCard of intriguesCards) {
      for (let i = 0; i < intriguesCard.amount; i++) {
        intrigueDeck.push(this.instantiateIntrigueCard(intriguesCard));
      }
    }
    this.intrigueDeckSubject.next(shuffle(intrigueDeck));
  }

  public drawPlayerIntriguesFromDeck(playerId: number, amount: number) {
    const intrigueDeck = this.intrigueDeck;
    const addedPlayerIntrigues: IntrigueDeckCard[] = [];
    for (let i = 0; i < amount; i++) {
      if (intrigueDeck.length > 0) {
        const intrigue = intrigueDeck.shift();
        if (intrigue) {
          addedPlayerIntrigues.push(intrigue);
        }
      }
    }

    if (addedPlayerIntrigues.length > 0) {
      const playerIntrigues = this.playerIntrigues;
      const playerIndex = playerIntrigues.findIndex((x) => x.playerId === playerId);
      if (playerIndex > -1) {
        playerIntrigues[playerIndex].intrigues = [...playerIntrigues[playerIndex].intrigues, ...addedPlayerIntrigues];

        this.playerIntriguesSubject.next(playerIntrigues);
        this.intrigueDeckSubject.next(intrigueDeck);
      } else {
        playerIntrigues.push({ playerId, intrigues: addedPlayerIntrigues });

        this.playerIntriguesSubject.next(playerIntrigues);
        this.intrigueDeckSubject.next(intrigueDeck);
      }
    }
  }

  addPlayerIntrigue(playerId: number, stolenIntrigue: IntrigueDeckCard) {
    const playerIntrigues = this.playerIntrigues;
    const playerIndex = playerIntrigues.findIndex((x) => x.playerId === playerId);
    if (playerIndex > -1) {
      playerIntrigues[playerIndex].intrigues.push(stolenIntrigue);
    } else {
      playerIntrigues.push({ playerId, intrigues: [stolenIntrigue] });
    }
    this.playerIntriguesSubject.next(playerIntrigues);
  }

  trashPlayerIntrigue(playerId: number, intrigueId: string) {
    const playerIntrigues = this.playerIntrigues;
    const playerIndex = playerIntrigues.findIndex((x) => x.playerId === playerId);
    if (playerIndex > -1) {
      playerIntrigues[playerIndex].intrigues = playerIntrigues[playerIndex].intrigues.filter((x) => x.id !== intrigueId);
      this.playerIntriguesSubject.next(playerIntrigues);
    }
  }

  removeIntrigueFromDeck(intrigueId: string) {
    this.intrigueDeckSubject.next(this.intrigueDeck.filter((x) => x.name.en !== intrigueId));
  }

  clearIntrigueDeck() {
    this.playerIntriguesSubject.next([]);
    this.intrigueDeckSubject.next([]);
  }

  getPlayerIntrigues(playerId: number, type?: IntrigueType) {
    if (type) {
      return this.playerIntrigues.find((x) => x.playerId === playerId)?.intrigues.filter((y) => y.type === type);
    } else {
      return this.playerIntrigues.find((x) => x.playerId === playerId)?.intrigues;
    }
  }

  getEnemyIntrigues(playerId: number) {
    return this.playerIntrigues.filter((x) => x.playerId !== playerId);
  }

  getPlayerIntrigueCount(playerId: number) {
    return this.playerIntrigues.find((x) => x.playerId === playerId)?.intrigues.length ?? 0;
  }

  public instantiateIntrigueCard(card: IntrigueCard): IntrigueDeckCard {
    return { name: card.name, effects: card.effects, type: card.type, id: crypto.randomUUID() };
  }
}
