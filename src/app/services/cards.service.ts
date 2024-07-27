import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { shuffle } from '../helpers/common';
import { PlayerManager } from './player-manager.service';
import { CardConfiguratorService } from './configurators/card-configurator.service';
import { ImperiumCard } from '../constants/imperium-cards';

export interface ImperiumDeckCard extends ImperiumCard {
  id: string;
}
export interface PlayerCardStack {
  playerId: number;
  cards: ImperiumDeckCard[];
}

export interface PlayerCard {
  playerId: number;
  cardId: string;
}

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private imperiumDeckSubject = new BehaviorSubject<ImperiumDeckCard[]>([]);
  public imperiumDeck$ = this.imperiumDeckSubject.asObservable();

  private playerDecksSubject = new BehaviorSubject<PlayerCardStack[]>([]);
  public playerDecks$ = this.playerDecksSubject.asObservable();

  private playerHandsSubject = new BehaviorSubject<PlayerCardStack[]>([]);
  public playerHands$ = this.playerHandsSubject.asObservable();

  private playerDiscardPilesSubject = new BehaviorSubject<PlayerCardStack[]>([]);
  public playerDiscardPiles$ = this.playerDiscardPilesSubject.asObservable();

  private playerTrashPilesSubject = new BehaviorSubject<PlayerCardStack[]>([]);
  public playerTrashPiles$ = this.playerTrashPilesSubject.asObservable();

  private playedPlayerCardsSubject = new BehaviorSubject<PlayerCard[]>([]);
  public playedPlayerCards$ = this.playedPlayerCardsSubject.asObservable();

  constructor(private playerManager: PlayerManager, private cardConfiguratorService: CardConfiguratorService) {
    const imperiumDeckString = localStorage.getItem('imperiumDeck');
    if (imperiumDeckString) {
      const imperiumDeck = JSON.parse(imperiumDeckString) as ImperiumDeckCard[];

      this.imperiumDeckSubject.next(imperiumDeck);
    }

    this.imperiumDeck$.subscribe((imperiumDeck) => {
      localStorage.setItem('imperiumDeck', JSON.stringify(imperiumDeck));
    });

    const playerDecksString = localStorage.getItem('playerDecks');
    if (playerDecksString) {
      const playerDecks = JSON.parse(playerDecksString) as PlayerCardStack[];
      this.playerDecksSubject.next(playerDecks);
    }

    this.playerDecks$.subscribe((playerDecks) => {
      localStorage.setItem('playerDecks', JSON.stringify(playerDecks));
    });

    const playerHandCardsString = localStorage.getItem('playerHandCards');
    if (playerHandCardsString) {
      const playerHandCards = JSON.parse(playerHandCardsString) as PlayerCardStack[];
      this.playerHandsSubject.next(playerHandCards);
    }

    this.playerHands$.subscribe((playerHandCards) => {
      localStorage.setItem('playerHandCards', JSON.stringify(playerHandCards));
    });

    const playerDiscardPilesString = localStorage.getItem('playerDiscardPiles');
    if (playerDiscardPilesString) {
      const playerDiscardPiles = JSON.parse(playerDiscardPilesString) as PlayerCardStack[];
      this.playerDiscardPilesSubject.next(playerDiscardPiles);
    }

    this.playerDiscardPiles$.subscribe((playerDiscardPiles) => {
      localStorage.setItem('playerDiscardPiles', JSON.stringify(playerDiscardPiles));
    });

    const playerTrashPilesString = localStorage.getItem('playerTrashPiles');
    if (playerTrashPilesString) {
      const playerTrashPiles = JSON.parse(playerTrashPilesString) as PlayerCardStack[];
      this.playerTrashPilesSubject.next(playerTrashPiles);
    }

    this.playerTrashPiles$.subscribe((playerTrashPiles) => {
      localStorage.setItem('playerTrashPiles', JSON.stringify(playerTrashPiles));
    });

    const playedPlayerCardsString = localStorage.getItem('playedPlayerCards');
    if (playedPlayerCardsString) {
      const playedPlayerCards = JSON.parse(playedPlayerCardsString) as PlayerCard[];
      this.playedPlayerCardsSubject.next(playedPlayerCards);
    }

    this.playedPlayerCards$.subscribe((playedPlayerCards) => {
      localStorage.setItem('playedPlayerCards', JSON.stringify(playedPlayerCards));
    });
  }

  public get imperiumDeck() {
    return cloneDeep(this.imperiumDeckSubject.value);
  }

  public get playerDecks() {
    return cloneDeep(this.playerDecksSubject.value);
  }

  public get playerHands() {
    return cloneDeep(this.playerHandsSubject.value);
  }

  public get playedPlayerCards() {
    return cloneDeep(this.playedPlayerCardsSubject.value);
  }

  public get playerDiscardPiles() {
    return cloneDeep(this.playerDiscardPilesSubject.value);
  }

  public get playerTrashPiles() {
    return cloneDeep(this.playerTrashPilesSubject.value);
  }

  public getPlayerBoardAccess(playerId: number) {
    const playerHandCards = this.getPlayerHand(playerId);
    if (playerHandCards) {
      return playerHandCards.cards.filter((x) => x.fieldAccess).flatMap((x) => x.fieldAccess!);
    } else {
      return [];
    }
  }

  getPlayerHand(playerId: number) {
    return this.playerHands.find((x) => x.playerId === playerId);
  }

  getPlayerHandCard(playerId: number, cardId: string) {
    return this.getPlayerHand(playerId)?.cards.find((x) => x.id === cardId);
  }

  getPlayerDiscardPile(playerId: number) {
    return this.playerDiscardPiles.find((x) => x.playerId === playerId);
  }

  getPlayerTrashPile(playerId: number) {
    return this.playerTrashPiles.find((x) => x.playerId === playerId);
  }

  getPlayerDeck(playerId: number) {
    return this.playerDecks.find((x) => x.playerId === playerId);
  }

  public getPlayedPlayerCard(playerId: number) {
    return this.playedPlayerCards.find((x) => x.playerId === playerId);
  }

  setImperiumDeck() {
    const imperiumDeck: ImperiumDeckCard[] = [];
    const imperiumCards = this.cardConfiguratorService.imperiumCards;
    for (const imperiumCard of imperiumCards) {
      for (let i = 0; i < (imperiumCard.cardAmount ?? 1); i++) {
        imperiumDeck.push(this.instantiateImperiumCard(imperiumCard));
      }
    }

    this.imperiumDeckSubject.next(shuffle(imperiumDeck));
  }

  removeCardFromImperiumDeck(card: ImperiumDeckCard) {
    this.imperiumDeckSubject.next([...this.imperiumDeck.filter((x, index) => x.id !== card.id)]);
  }

  setInitialPlayerDecks() {
    this.playerDiscardPilesSubject.next([]);
    this.playerHandsSubject.next([]);

    const playerDecks: PlayerCardStack[] = [];

    const playerIds = this.playerManager.getPlayerIds();
    for (const playerId of playerIds) {
      const startingCards: ImperiumDeckCard[] = [];

      for (const startingCard of this.cardConfiguratorService.startingCards) {
        for (let i = 0; i < (startingCard.cardAmount ?? 1); i++) {
          startingCards.push(this.instantiateImperiumCard(startingCard));
        }
      }
      playerDecks.push({ playerId, cards: shuffle(startingCards) });
    }

    this.playerDecksSubject.next(playerDecks);
  }

  drawPlayerCardsFromDeck(playerId: number, amount: number) {
    const playerDeck = this.playerDecks.find((x) => x.playerId === playerId);
    const playerHand = this.getPlayerHand(playerId);

    if (playerDeck) {
      const addedPlayerCards: ImperiumDeckCard[] = [];
      for (let i = 0; i < amount; i++) {
        if (playerDeck.cards.length > 0) {
          const card = playerDeck.cards.pop();
          if (card) {
            addedPlayerCards.push(card);
          }
        }
      }
      if (playerHand && playerHand.cards) {
        playerHand.cards = [...playerHand.cards, ...addedPlayerCards];

        this.playerDecksSubject.next([...this.playerDecks.filter((x) => x.playerId !== playerId), playerDeck]);
        this.playerHandsSubject.next([...this.playerHands.filter((x) => x.playerId !== playerId), playerHand]);
      } else {
        const newHand: PlayerCardStack = { playerId, cards: addedPlayerCards };

        this.playerDecksSubject.next([...this.playerDecks.filter((x) => x.playerId !== playerId), playerDeck]);
        this.playerHandsSubject.next([...this.playerHands.filter((x) => x.playerId !== playerId), newHand]);
      }
    }
  }

  addCardToPlayerHand(playerId: number, card: ImperiumDeckCard) {
    const playerHand = this.getPlayerHand(playerId);
    if (playerHand) {
      playerHand.cards.push(card);
      this.playerHandsSubject.next([...this.playerHands.filter((x) => x.playerId !== playerId), playerHand]);
    } else {
      const newDiscardPile: PlayerCardStack = { playerId, cards: [card] };
      this.playerHandsSubject.next([...this.playerDiscardPiles, newDiscardPile]);
    }
  }

  discardAllPlayerHandCards() {
    const playerHands = this.playerHands;
    const playerDiscardPiles = this.playerDiscardPiles;
    for (const playerHand of playerHands) {
      const playerDiscardPileIndex = playerDiscardPiles.findIndex((x) => x.playerId === playerHand.playerId);
      if (playerDiscardPileIndex > -1) {
        playerDiscardPiles[playerDiscardPileIndex].cards = [
          ...playerDiscardPiles[playerDiscardPileIndex].cards,
          ...playerHand.cards,
        ];
      } else {
        playerDiscardPiles.push({ playerId: playerHand.playerId, cards: playerHand.cards });
      }
    }
    this.playerHandsSubject.next([]);
    this.playerDiscardPilesSubject.next(playerDiscardPiles);
  }

  discardPlayerHandCard(playerId: number, card: ImperiumDeckCard) {
    const playerHands = this.playerHands;
    const playerHandIndex = this.playerHands.findIndex((x) => x.playerId === playerId);
    if (playerHandIndex > -1) {
      playerHands[playerHandIndex].cards = playerHands[playerHandIndex].cards.filter((x) => x.id !== card.id);
      this.playerHandsSubject.next(playerHands);
      this.addCardToPlayerDiscardPile(playerId, card);
    }
  }

  discardPlayerHandCards(playerId: number) {
    const playerHands = this.playerHands;
    const playerHandIndex = this.playerHands.findIndex((x) => x.playerId === playerId);
    if (playerHandIndex > -1) {
      const playerHandCards = playerHands[playerHandIndex].cards;
      playerHands[playerHandIndex].cards = [];
      this.playerHandsSubject.next(playerHands);
      this.addCardsToPlayerDiscardPile(playerId, playerHandCards);
    }
  }

  resetPlayerTrashPiles() {
    this.playerTrashPilesSubject.next([]);
  }

  trashDiscardedPlayerCard(playerId: number, card: ImperiumDeckCard) {
    const playerDiscardPiles = this.playerDiscardPiles;
    const playerHandIndex = this.playerDiscardPiles.findIndex((x) => x.playerId === playerId);
    if (playerHandIndex > -1) {
      playerDiscardPiles[playerHandIndex].cards = playerDiscardPiles[playerHandIndex].cards.filter((x) => x.id !== card.id);
      this.playerDiscardPilesSubject.next(playerDiscardPiles);
      this.addCardToPlayerTrashPile(playerId, card);
    }
  }

  trashPlayerHandCard(playerId: number, card: ImperiumDeckCard) {
    const playerHands = this.playerHands;
    const playerHandIndex = this.playerHands.findIndex((x) => x.playerId === playerId);
    if (playerHandIndex > -1) {
      playerHands[playerHandIndex].cards = playerHands[playerHandIndex].cards.filter((x) => x.id !== card.id);
      this.playerHandsSubject.next(playerHands);
      this.addCardToPlayerTrashPile(playerId, card);
    }
  }

  shufflePlayerDiscardPilesUnderDecks() {
    const playerDiscardPiles = this.playerDiscardPiles;
    const playerDecks = this.playerDecks;
    for (const playerDiscardPile of playerDiscardPiles) {
      const playerDeck = playerDecks.find((x) => x.playerId === playerDiscardPile.playerId);
      if (playerDeck) {
        playerDeck.cards = [...shuffle(playerDiscardPile.cards), ...playerDeck.cards];
      } else {
        playerDecks.push({ playerId: playerDiscardPile.playerId, cards: playerDiscardPile.cards });
      }
    }
    this.playerDiscardPilesSubject.next([]);
    this.playerDecksSubject.next(playerDecks);
  }

  aquirePlayerCardFromImperiumDeck(playerId: number, card: ImperiumDeckCard) {
    this.imperiumDeckSubject.next([...this.imperiumDeck.filter((x) => x.id !== card.id)]);
    this.addCardToPlayerDiscardPile(playerId, card);
  }

  setPlayedPlayerCard(playerId: number, cardId: string) {
    this.playedPlayerCardsSubject.next([
      ...this.playedPlayerCards.filter((x) => x.playerId !== playerId),
      { playerId, cardId },
    ]);
  }

  unsetPlayedPlayerCard(playerId: number, cardId: string) {
    this.playedPlayerCardsSubject.next([...this.playedPlayerCards.filter((x) => x.playerId !== playerId)]);
  }

  discardPlayedPlayerCard(playerId: number) {
    const playedCardId = this.playedPlayerCards.find((x) => x.playerId === playerId)?.cardId;
    if (playedCardId) {
      const card = this.getPlayerHand(playerId)?.cards.find((x) => x.id === playedCardId);

      if (card) {
        this.discardPlayerHandCard(playerId, card);
      }
    }
    this.playedPlayerCardsSubject.next([...this.playedPlayerCards.filter((x) => x.playerId !== playerId)]);
  }

  addCardToPlayerDiscardPile(playerId: number, card: ImperiumDeckCard) {
    const playerDiscardPile = this.getPlayerDiscardPile(playerId);
    if (playerDiscardPile) {
      playerDiscardPile.cards.push(card);
      this.playerDiscardPilesSubject.next([
        ...this.playerDiscardPiles.filter((x) => x.playerId !== playerId),
        playerDiscardPile,
      ]);
    } else {
      const newDiscardPile: PlayerCardStack = { playerId, cards: [card] };
      this.playerDiscardPilesSubject.next([...this.playerDiscardPiles, newDiscardPile]);
    }
  }

  addCardsToPlayerDiscardPile(playerId: number, cards: ImperiumDeckCard[]) {
    const playerDiscardPile = this.getPlayerDiscardPile(playerId);
    if (playerDiscardPile) {
      playerDiscardPile.cards.push(...cards);
      this.playerDiscardPilesSubject.next([
        ...this.playerDiscardPiles.filter((x) => x.playerId !== playerId),
        playerDiscardPile,
      ]);
    } else {
      const newDiscardPile: PlayerCardStack = { playerId, cards: cards };
      this.playerDiscardPilesSubject.next([...this.playerDiscardPiles, newDiscardPile]);
    }
  }

  addCardToPlayerTrashPile(playerId: number, card: ImperiumDeckCard) {
    const playerTrashPile = this.getPlayerTrashPile(playerId);
    if (playerTrashPile) {
      playerTrashPile.cards.push(card);
      this.playerTrashPilesSubject.next([...this.playerTrashPiles.filter((x) => x.playerId !== playerId), playerTrashPile]);
    } else {
      const newTrashPile: PlayerCardStack = { playerId, cards: [card] };
      this.playerTrashPilesSubject.next([...this.playerTrashPiles, newTrashPile]);
    }
  }

  public instantiateImperiumCard(card: ImperiumCard): ImperiumDeckCard {
    return { ...card, id: crypto.randomUUID(), cardAmount: 1 };
  }
}