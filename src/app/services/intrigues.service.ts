import { Injectable } from '@angular/core';
import { cloneDeep, shuffle } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { shuffleMultipleTimes } from '../helpers/common';
import { getStructuredEffectArrayInfos } from '../helpers/rewards';
import { IntrigueCard, IntrigueDeckCard, IntrigueType, PlayerIntrigueStack } from '../models/intrigue';
import { IntrigueConfiguratorService } from './configurators/intrigue-configurator.service';

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

  public getPlayerIntrigues(playerId: number, type?: IntrigueType) {
    const playerIntrigues = this.playerIntriguesSubject.value.find((x) => x.playerId === playerId);
    if (!playerIntrigues) {
      return undefined;
    }

    if (type) {
      return cloneDeep(playerIntrigues.intrigues.filter((y) => y.type === type));
    } else {
      return cloneDeep(playerIntrigues.intrigues);
    }
  }

  public getEnemyIntrigues(playerId: number) {
    return cloneDeep(this.playerIntriguesSubject.value.filter((x) => x.playerId !== playerId));
  }

  public getPlayerIntrigueCount(playerId: number) {
    return this.playerIntriguesSubject.value.find((x) => x.playerId === playerId)?.intrigues.length ?? 0;
  }

  public getPlayerCombatIntrigueCount(playerId: number) {
    return (
      this.playerIntriguesSubject.value.find((x) => x.playerId === playerId)?.intrigues.filter((y) => y.type === 'combat')
        .length ?? 0
    );
  }

  public createIntrigueDeck() {
    this.playerIntriguesSubject.next([]);
    const intrigueDeck: IntrigueDeckCard[] = [];
    const intriguesCards = this.intrigueConfigService.intrigues;
    for (const intriguesCard of intriguesCards) {
      for (let i = 0; i < intriguesCard.amount; i++) {
        intrigueDeck.push(this.instantiateIntrigueCard(intriguesCard));
      }
    }
    this.intrigueDeckSubject.next(shuffleMultipleTimes(intrigueDeck));
  }

  public shuffleIntrigueDeck() {
    this.intrigueDeckSubject.next(shuffle(this.intrigueDeckSubject.value));
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

  addPlayerIntrigue(playerId: number, intrigue: IntrigueDeckCard) {
    const playerIntrigues = this.playerIntrigues;
    const playerIndex = playerIntrigues.findIndex((x) => x.playerId === playerId);
    if (playerIndex > -1) {
      playerIntrigues[playerIndex].intrigues.push(intrigue);
    } else {
      playerIntrigues.push({ playerId, intrigues: [intrigue] });
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

  public instantiateIntrigueCard(card: IntrigueCard): IntrigueDeckCard {
    return {
      name: card.name,
      effects: card.effects,
      type: card.type,
      id: crypto.randomUUID(),
      structuredEffects: getStructuredEffectArrayInfos(card.effects),
    };
  }
}
