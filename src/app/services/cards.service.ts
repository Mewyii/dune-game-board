import { Injectable } from '@angular/core';
import { cloneDeep, shuffle } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { shuffleMultipleTimes } from '../helpers/common';
import { getStructuredEffectArrayInfos } from '../helpers/rewards';
import { ActionType, FactionType, StructuredEffects } from '../models';
import { ImperiumCard } from '../models/imperium-card';
import { ImperiumPlot } from '../models/imperium-plot';
import { CardConfiguratorService } from './configurators/card-configurator.service';
import { PlotConfiguratorService } from './configurators/plot-configurator.service';
import { PlayersService } from './players.service';
import { SettingsService } from './settings.service';

export interface ImperiumDeckCard extends ImperiumCard {
  id: string;
  type: 'imperium-card';
  structuredAgentEffects?: StructuredEffects;
  structuredRevealEffects?: StructuredEffects;
}

export interface ImperiumRowCard extends ImperiumDeckCard {
  status: 'just-arrived' | 'present' | 'leaving';
}

export interface ImperiumDeckPlot extends ImperiumPlot {
  id: string;
  type: 'plot';
}

export interface ImperiumRowPlot extends ImperiumDeckPlot {
  status: 'just-arrived' | 'present' | 'leaving';
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

export interface PlayerPlotStack {
  playerId: number;
  cards: ImperiumRowPlot[];
}

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private imperiumDeckSubject = new BehaviorSubject<(ImperiumDeckCard | ImperiumDeckPlot)[]>([]);
  public imperiumDeck$ = this.imperiumDeckSubject.asObservable();

  private imperiumRowSubject = new BehaviorSubject<(ImperiumRowCard | ImperiumRowPlot)[]>([]);
  public imperiumRow$ = this.imperiumRowSubject.asObservable();

  private playerDecksSubject = new BehaviorSubject<PlayerCardStack[]>([]);
  public playerDecks$ = this.playerDecksSubject.asObservable();

  private playerHandsSubject = new BehaviorSubject<PlayerCardStack[]>([]);
  public playerHands$ = this.playerHandsSubject.asObservable();

  private playerDiscardPilesSubject = new BehaviorSubject<PlayerCardStack[]>([]);
  public playerDiscardPiles$ = this.playerDiscardPilesSubject.asObservable();

  private playerTrashPilesSubject = new BehaviorSubject<PlayerCardStack[]>([]);
  public playerTrashPiles$ = this.playerTrashPilesSubject.asObservable();

  private playerPlotsSubject = new BehaviorSubject<PlayerPlotStack[]>([]);
  public playerPlots$ = this.playerPlotsSubject.asObservable();

  private playedPlayerCardsSubject = new BehaviorSubject<PlayerCard[]>([]);
  public playedPlayerCards$ = this.playedPlayerCardsSubject.asObservable();

  private limitedCustomCardsSubject = new BehaviorSubject<ImperiumDeckCard[]>([]);
  public limitedCustomCards$ = this.limitedCustomCardsSubject.asObservable();

  private unlimitedCustomCardsSubject = new BehaviorSubject<ImperiumCard[]>([]);
  public unlimitedCustomCards$ = this.unlimitedCustomCardsSubject.asObservable();

  constructor(
    private playerManager: PlayersService,
    private cardConfiguratorService: CardConfiguratorService,
    private plotConfiguratorService: PlotConfiguratorService,
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

    const imperiumRowString = localStorage.getItem('imperiumRow');
    if (imperiumRowString) {
      const imperiumRow = JSON.parse(imperiumRowString) as ImperiumRowCard[];

      this.imperiumRowSubject.next(imperiumRow);
    }

    this.imperiumRow$.subscribe((imperiumRow) => {
      localStorage.setItem('imperiumRow', JSON.stringify(imperiumRow));
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

    const playerPlotsString = localStorage.getItem('playerPlots');
    if (playerPlotsString) {
      const playerPlots = JSON.parse(playerPlotsString) as PlayerPlotStack[];
      this.playerPlotsSubject.next(playerPlots);
    }

    this.playerPlots$.subscribe((playerPlots) => {
      localStorage.setItem('playerPlots', JSON.stringify(playerPlots));
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
    return cloneDeep(this.imperiumRowSubject.value);
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

  public get playerPlots() {
    return cloneDeep(this.playerPlotsSubject.value);
  }

  public get limitedCustomCards() {
    return cloneDeep(this.limitedCustomCardsSubject.value);
  }

  public get unlimitedCustomCards() {
    return cloneDeep(this.unlimitedCustomCardsSubject.value);
  }

  getTopDeckCards(amount: number) {
    return cloneDeep(this.imperiumDeck.slice(0, amount));
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

  createImperiumDeck() {
    const imperiumDeckCards: (ImperiumDeckCard | ImperiumDeckPlot)[] = [];
    const imperiumCards = this.cardConfiguratorService.imperiumCards;
    const plotCards = this.plotConfiguratorService.imperiumPlots;

    for (const imperiumCard of imperiumCards) {
      for (let i = 0; i < (imperiumCard.cardAmount ?? 1); i++) {
        imperiumDeckCards.push(this.instantiateImperiumCard(imperiumCard));
      }
    }

    for (const plotCard of plotCards) {
      for (let i = 0; i < (plotCard.cardAmount ?? 1); i++) {
        imperiumDeckCards.push(this.instantiateImperiumPlot(plotCard));
      }
    }

    const imperiumDeck = shuffleMultipleTimes(imperiumDeckCards);
    const imperiumRowCardAmount = this.settingsService.getImperiumRowCards();
    const imperiumRow: (ImperiumRowCard | ImperiumRowPlot)[] = imperiumDeck
      .slice(0, imperiumRowCardAmount)
      .map((x) => ({ ...x, status: 'present' }));

    this.imperiumRowSubject.next(imperiumRow);
    this.imperiumDeckSubject.next(imperiumDeck.splice(imperiumRowCardAmount));
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

  shuffleImperiumDeck() {
    this.imperiumDeckSubject.next(shuffle(this.imperiumDeck));
  }

  removeCardFromImperiumDeck(card: ImperiumDeckCard) {
    this.imperiumDeckSubject.next([...this.imperiumDeck.filter((x) => x.id !== card.id)]);
  }

  removeCardFromImperiumRow(card: ImperiumRowCard | ImperiumRowPlot) {
    const imperiumDeck = this.imperiumDeck;
    const nextCard = imperiumDeck.shift();
    if (nextCard) {
      const imperiumRow = this.imperiumRow.filter((x) => x.id !== card.id);
      imperiumRow.push({ ...nextCard, status: 'just-arrived' });
      this.imperiumRowSubject.next(imperiumRow);
      this.imperiumDeckSubject.next(imperiumDeck);
    }
  }

  resetImperiumRowCards() {
    this.imperiumRowSubject.next([]);
  }

  removeCardFromLimitedCustomCards(card: ImperiumDeckCard) {
    this.limitedCustomCardsSubject.next([...this.limitedCustomCards.filter((x) => x.id !== card.id)]);
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
      playerDecks.push({ playerId, cards: shuffleMultipleTimes(startingCards) });
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

  resetPlayerHandCards() {
    this.playerHandsSubject.next([]);
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

  churnAndClearImperiumRow() {
    const imperiumRowCardAmount = this.settingsService.getImperiumRowCards();

    const imperiumRow = this.imperiumRow;
    const imperiumDeck = this.imperiumDeck;

    imperiumRow.splice(imperiumRowCardAmount);

    const newImperiumRow: (ImperiumRowCard | ImperiumRowPlot)[] = [];
    for (const imperiumCard of imperiumRow) {
      if (imperiumCard.status === 'just-arrived') {
        imperiumCard.status = 'present';
        newImperiumRow.push(imperiumCard);
      } else if (imperiumCard.status === 'present') {
        imperiumCard.status = 'leaving';
        newImperiumRow.push(imperiumCard);
      } else if (imperiumCard.status === 'leaving') {
        const nextCard = imperiumDeck.shift();
        if (nextCard) {
          newImperiumRow.push({ ...nextCard, status: 'present' });
        }
      }
    }

    this.imperiumRowSubject.next(newImperiumRow);
    this.imperiumDeckSubject.next(imperiumDeck);
  }

  aquirePlayerCardFromImperiumRow(playerId: number, card: ImperiumDeckCard) {
    const imperiumDeck = this.imperiumDeck;
    const nextCard = imperiumDeck.shift();
    if (nextCard) {
      const imperiumRow = this.imperiumRow.filter((x) => x.id !== card.id);
      imperiumRow.push({ ...nextCard, status: 'just-arrived' });
      this.imperiumRowSubject.next(imperiumRow);
      this.imperiumDeckSubject.next(imperiumDeck);
    }
    this.shuffleCardsUnderPlayerDeck(playerId, [card]);
  }

  addCardsToImperiumRow(amount = 1) {
    const imperiumDeck = this.imperiumDeck;
    const addedCards = imperiumDeck.splice(0, amount);
    if (addedCards.length > 0) {
      const imperiumRow = this.imperiumRow;
      imperiumRow.push(...addedCards.map((x) => ({ ...x, status: 'just-arrived' } as ImperiumRowPlot)));
      this.imperiumRowSubject.next(imperiumRow);
      this.imperiumDeckSubject.next(imperiumDeck);
    }
  }

  aquirePlayerPlotFromImperiumRow(playerId: number, card: ImperiumRowPlot) {
    const imperiumDeck = this.imperiumDeck;
    const nextCard = imperiumDeck.shift();
    if (nextCard) {
      const imperiumRow = this.imperiumRow.filter((x) => x.id !== card.id);
      imperiumRow.push({ ...nextCard, status: 'just-arrived' });
      this.imperiumRowSubject.next(imperiumRow);
      this.imperiumDeckSubject.next(imperiumDeck);
    }
    this.addCardsToPlayerPlots(playerId, [card]);
  }

  aquirePlayerCardFromImperiumDeck(playerId: number, card: ImperiumDeckCard) {
    this.imperiumDeckSubject.next([...this.imperiumDeck.filter((x) => x.id !== card.id)]);
    this.shuffleCardsUnderPlayerDeck(playerId, [card]);
  }

  aquirePlayerCardFromLimitedCustomCards(playerId: number, card: ImperiumDeckCard) {
    this.limitedCustomCardsSubject.next([...this.limitedCustomCards.filter((x) => x.id !== card.id)]);
    this.shuffleCardsUnderPlayerDeck(playerId, [card]);
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

  addCardsToPlayerPlots(playerId: number, cards: ImperiumRowPlot[]) {
    const playerPlots = this.playerPlots;
    const playerPlotStackIndex = playerPlots.findIndex((x) => x.playerId === playerId);
    if (playerPlotStackIndex > -1) {
      const playerPlotCards = playerPlots[playerPlotStackIndex].cards;
      playerPlots[playerPlotStackIndex].cards = [...playerPlotCards, ...cards];
      this.playerPlotsSubject.next(playerPlots);
    } else {
      playerPlots.push({ playerId, cards });
      this.playerPlotsSubject.next(playerPlots);
    }
  }

  resetPlayerPlots() {
    this.playerPlotsSubject.next([]);
  }

  public instantiateImperiumCard(card: ImperiumCard): ImperiumDeckCard {
    return {
      ...card,
      type: 'imperium-card',
      id: crypto.randomUUID(),
      cardAmount: 1,
      structuredAgentEffects:
        card.agentEffects && card.agentEffects.length > 0 ? getStructuredEffectArrayInfos(card.agentEffects) : undefined,
      structuredRevealEffects:
        card.revealEffects && card.revealEffects.length > 0 ? getStructuredEffectArrayInfos(card.revealEffects) : undefined,
    };
  }

  public instantiateImperiumPlot(card: ImperiumPlot): ImperiumDeckPlot {
    return { ...card, type: 'plot', id: crypto.randomUUID(), cardAmount: 1 };
  }
}
