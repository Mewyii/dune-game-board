import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { cloneDeep } from 'lodash';
import { shuffle } from 'lodash';
import { PlayersService } from './players.service';
import { CardConfiguratorService } from './configurators/card-configurator.service';
import { ImperiumCard } from '../constants/imperium-cards';
import { ActionType, FactionType } from '../models';
import { SettingsService } from './settings.service';

export type CustomCardType = 'other' | 'unlimited' | 'limited';

export interface CustomCard extends ImperiumCard {
  type: CustomCardType;
}

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

export interface CardFactionAndFieldAccess {
  faction: FactionType;
  actionType: ActionType[];
}

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private imperiumDeckSubject = new BehaviorSubject<ImperiumDeckCard[]>([]);
  public imperiumDeck$ = this.imperiumDeckSubject.asObservable();
  public imperiumRow$ = this.imperiumDeck$.pipe(map((x) => x.slice(0, 6)));

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

  private limitedCustomCardsSubject = new BehaviorSubject<ImperiumDeckCard[]>([]);
  public limitedCustomCards$ = this.limitedCustomCardsSubject.asObservable();

  private unlimitedCustomCardsSubject = new BehaviorSubject<ImperiumCard[]>([]);
  public unlimitedCustomCards$ = this.unlimitedCustomCardsSubject.asObservable();

  constructor(
    private playerManager: PlayersService,
    private cardConfiguratorService: CardConfiguratorService,
    private settingsService: SettingsService
  ) {
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

    const limitedCustomCardsString = localStorage.getItem('limitedCustomCards');
    if (limitedCustomCardsString) {
      const limitedCustomCards = JSON.parse(limitedCustomCardsString) as ImperiumDeckCard[];
      this.limitedCustomCardsSubject.next(limitedCustomCards);
    }

    this.limitedCustomCards$.subscribe((limitedCustomCards) => {
      localStorage.setItem('limitedCustomCards', JSON.stringify(limitedCustomCards));
    });

    const unlimitedCustomCardsString = localStorage.getItem('unlimitedCustomCards');
    if (unlimitedCustomCardsString) {
      const unlimitedCustomCards = JSON.parse(unlimitedCustomCardsString) as ImperiumDeckCard[];
      this.unlimitedCustomCardsSubject.next(unlimitedCustomCards);
    }

    this.unlimitedCustomCards$.subscribe((unlimitedCustomCards) => {
      localStorage.setItem('unlimitedCustomCards', JSON.stringify(unlimitedCustomCards));
    });
  }

  public get imperiumDeck() {
    return cloneDeep(this.imperiumDeckSubject.value);
  }

  public get imperiumRow() {
    return cloneDeep(this.imperiumDeck.slice(0, 6));
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

  public get limitedCustomCards() {
    return cloneDeep(this.limitedCustomCardsSubject.value);
  }

  public get unlimitedCustomCards() {
    return cloneDeep(this.unlimitedCustomCardsSubject.value);
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

  setLimitedCustomCards() {
    const customCardStack: ImperiumDeckCard[] = [];
    const customCards = this.settingsService.getCustomCards();
    if (customCards) {
      for (const customCard of customCards) {
        if (customCard.type === 'limited') {
          for (let i = 0; i < (customCard.cardAmount ?? 1); i++) {
            customCardStack.push(this.instantiateImperiumCard(customCard));
          }
        }
      }
    }

    this.limitedCustomCardsSubject.next(customCardStack);
  }

  setUnlimitedCustomCards() {
    const customCardStack: ImperiumCard[] = [];
    const customCards = this.settingsService.getCustomCards();
    if (customCards) {
      for (const customCard of customCards) {
        if (customCard.type === 'unlimited') {
          for (let i = 0; i < (customCard.cardAmount ?? 1); i++) {
            customCardStack.push(customCard);
          }
        }
      }
    }

    this.unlimitedCustomCardsSubject.next(customCardStack);
  }

  removeCardFromImperiumDeck(card: ImperiumDeckCard) {
    this.imperiumDeckSubject.next([...this.imperiumDeck.filter((x, index) => x.id !== card.id)]);
  }

  removeCardFromLimitedCustomCards(card: ImperiumDeckCard) {
    this.limitedCustomCardsSubject.next([...this.limitedCustomCards.filter((x, index) => x.id !== card.id)]);
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
          const card = playerDeck.cards.shift();
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
      const newPlayerHand: PlayerCardStack = { playerId, cards: [card] };
      this.playerHandsSubject.next([...this.playerHands, newPlayerHand]);
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

  returnDiscardedPlayerCardToHand(playerId: number, card: ImperiumDeckCard) {
    const playerDiscardPiles = this.playerDiscardPiles;
    const playerHandIndex = playerDiscardPiles.findIndex((x) => x.playerId === playerId);
    if (playerHandIndex > -1) {
      playerDiscardPiles[playerHandIndex].cards = playerDiscardPiles[playerHandIndex].cards.filter((x) => x.id !== card.id);
      this.playerDiscardPilesSubject.next(playerDiscardPiles);
      this.addCardToPlayerHand(playerId, card);
    }
  }

  removeCardFromDiscardPile(playerId: number, card: ImperiumDeckCard) {
    const playerDiscardPiles = this.playerDiscardPiles;
    const playerDiscardPileIndex = playerDiscardPiles.findIndex((x) => x.playerId === playerId);
    if (playerDiscardPileIndex > -1) {
      const cardIndex = playerDiscardPiles[playerDiscardPileIndex].cards.findIndex((x) => x.id === card.id);
      if (cardIndex > -1) {
        playerDiscardPiles[playerDiscardPileIndex].cards = playerDiscardPiles[playerDiscardPileIndex].cards.filter(
          (x) => x.id !== card.id
        );
        this.playerDiscardPilesSubject.next(playerDiscardPiles);
      }
    }
  }

  trashDiscardedPlayerCard(playerId: number, card: ImperiumDeckCard) {
    const playerDiscardPiles = this.playerDiscardPiles;
    const playerDiscardPileIndex = playerDiscardPiles.findIndex((x) => x.playerId === playerId);
    if (playerDiscardPileIndex > -1) {
      const cardIndex = playerDiscardPiles[playerDiscardPileIndex].cards.findIndex((x) => x.id === card.id);
      if (cardIndex > -1) {
        playerDiscardPiles[playerDiscardPileIndex].cards = playerDiscardPiles[playerDiscardPileIndex].cards.filter(
          (x) => x.id !== card.id
        );
        this.playerDiscardPilesSubject.next(playerDiscardPiles);
        this.addCardToPlayerTrashPile(playerId, card);
      }
    }
  }

  trashPlayerHandCard(playerId: number, card: ImperiumDeckCard) {
    const playerHands = this.playerHands;
    const playerHandIndex = this.playerHands.findIndex((x) => x.playerId === playerId);
    if (playerHandIndex > -1) {
      const cardIndex = playerHands[playerHandIndex].cards.findIndex((x) => x.id === card.id);
      if (cardIndex > -1) {
        playerHands[playerHandIndex].cards = playerHands[playerHandIndex].cards.filter((x) => x.id !== card.id);
        this.playerHandsSubject.next(playerHands);
        this.addCardToPlayerTrashPile(playerId, card);
      }
    }
  }

  shufflePlayerDiscardPilesUnderDecks() {
    const playerDiscardPiles = this.playerDiscardPiles;
    const playerDecks = this.playerDecks;
    for (const playerDiscardPile of playerDiscardPiles) {
      const playerDeck = playerDecks.find((x) => x.playerId === playerDiscardPile.playerId);
      if (playerDeck) {
        playerDeck.cards = [...playerDeck.cards, ...shuffle(playerDiscardPile.cards)];
      } else {
        playerDecks.push({ playerId: playerDiscardPile.playerId, cards: playerDiscardPile.cards });
      }
    }
    this.playerDiscardPilesSubject.next([]);
    this.playerDecksSubject.next(playerDecks);
  }

  shufflePlayerDiscardPileUnderDeck(playerId: number) {
    const playerDiscardPiles = this.playerDiscardPiles;
    const playerDiscardPileIndex = playerDiscardPiles.findIndex((x) => x.playerId === playerId);
    if (playerDiscardPileIndex > -1) {
      const playerDiscardPileCards = playerDiscardPiles[playerDiscardPileIndex].cards;
      playerDiscardPiles[playerDiscardPileIndex].cards = [];
      this.playerDiscardPilesSubject.next(playerDiscardPiles);
      this.shuffleCardsUnderPlayerDeck(playerId, playerDiscardPileCards);
    }
  }

  shuffleCardsUnderPlayerDeck(playerId: number, cards: ImperiumDeckCard[]) {
    const playerDecks = this.playerDecks;
    const playerDeckIndex = playerDecks.findIndex((x) => x.playerId === playerId);
    if (playerDeckIndex > -1) {
      const playerDeckCards = playerDecks[playerDeckIndex].cards;
      playerDecks[playerDeckIndex].cards = [...playerDeckCards, ...shuffle(cards)];
      this.playerDecksSubject.next(playerDecks);
    }
  }

  shufflePlayerDeck(playerId: number) {
    const playerDecks = this.playerDecks;
    const playerDeckIndex = playerDecks.findIndex((x) => x.playerId === playerId);
    if (playerDeckIndex > -1) {
      const playerDeckCards = playerDecks[playerDeckIndex].cards;
      playerDecks[playerDeckIndex].cards = [...shuffle(playerDeckCards)];
      this.playerDecksSubject.next(playerDecks);
    }
  }

  aquirePlayerCardFromImperiumDeck(playerId: number, card: ImperiumDeckCard) {
    this.imperiumDeckSubject.next([...this.imperiumDeck.filter((x) => x.id !== card.id)]);
    this.addCardToPlayerDiscardPile(playerId, card);
  }

  aquirePlayerCardFromLimitedCustomCards(playerId: number, card: ImperiumDeckCard) {
    this.limitedCustomCardsSubject.next([...this.limitedCustomCards.filter((x) => x.id !== card.id)]);
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
