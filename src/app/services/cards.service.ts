import { inject, Injectable } from '@angular/core';
import { cloneDeep, shuffle } from 'lodash';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { CardAcquiringPlacementType } from '../constants/board-settings';
import { imperiumCardsGameAdjustments } from '../constants/imperium-cards-game-adjustments';
import { shuffleMultipleTimes } from '../helpers/common';
import { getStructuredEffectArrayInfos } from '../helpers/rewards';
import { ActionType, FactionType, StructuredEffect } from '../models';
import { ImperiumCard } from '../models/imperium-card';
import { ImperiumPlot } from '../models/imperium-plot';
import { CardConfiguratorService } from './configurators/card-configurator.service';
import { PlayersService } from './players.service';
import { SettingsService } from './settings.service';
import { GameStatePersistenceService } from './persistence/game-state-persistence.service';

export interface ImperiumDeckCard extends ImperiumCard {
  id: string;
  type: 'imperium-card';
  structuredAgentEffects?: StructuredEffect[];
  structuredRevealEffects?: StructuredEffect[];
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
  private gameStatePersistenceService = inject(GameStatePersistenceService);
  private playersService = inject(PlayersService);
  private cardConfiguratorService = inject(CardConfiguratorService);
  private settingsService = inject(SettingsService);

  private imperiumDeckSubject = new BehaviorSubject<(ImperiumDeckCard | ImperiumDeckPlot)[]>([]);
  imperiumDeck$ = this.imperiumDeckSubject.asObservable();

  private imperiumRowSubject = new BehaviorSubject<(ImperiumRowCard | ImperiumRowPlot)[]>([]);
  imperiumRow$ = this.imperiumRowSubject.asObservable();

  private playerDecksSubject = new BehaviorSubject<PlayerCardStack[]>([]);
  playerDecks$ = this.playerDecksSubject.asObservable();
  playerDeck$ = (playerId: number) =>
    this.playerDecks$.pipe(
      map((decks) => decks.find((deck) => deck.playerId === playerId)?.cards),
      distinctUntilChanged(),
    );

  private playerHandsSubject = new BehaviorSubject<PlayerCardStack[]>([]);
  playerHands$ = this.playerHandsSubject.asObservable();
  playerHand$ = (playerId: number) =>
    this.playerHands$.pipe(
      map((hands) => hands.find((hand) => hand.playerId === playerId)?.cards),
      distinctUntilChanged(),
    );

  private playerDiscardPilesSubject = new BehaviorSubject<PlayerCardStack[]>([]);
  playerDiscardPiles$ = this.playerDiscardPilesSubject.asObservable();
  playerDiscardPile$ = (playerId: number) =>
    this.playerDiscardPiles$.pipe(
      map((dps) => dps.find((dp) => dp.playerId === playerId)?.cards),
      distinctUntilChanged(),
    );

  private playerTrashPilesSubject = new BehaviorSubject<PlayerCardStack[]>([]);
  playerTrashPiles$ = this.playerTrashPilesSubject.asObservable();

  private playerPlotsSubject = new BehaviorSubject<PlayerPlotStack[]>([]);
  playerPlots$ = this.playerPlotsSubject.asObservable();

  private playedPlayerCardsSubject = new BehaviorSubject<PlayerCard[]>([]);
  playedPlayerCards$ = this.playedPlayerCardsSubject.asObservable();

  private limitedCustomCardsSubject = new BehaviorSubject<ImperiumDeckCard[]>([]);
  limitedCustomCards$ = this.limitedCustomCardsSubject.asObservable();

  private unlimitedCustomCardsSubject = new BehaviorSubject<ImperiumCard[]>([]);
  unlimitedCustomCards$ = this.unlimitedCustomCardsSubject.asObservable();

  constructor() {
    this.gameStatePersistenceService.bindSubjectToStorage('imperiumDeck', this.imperiumDeckSubject, { scope: 'game' });

    this.gameStatePersistenceService.bindSubjectToStorage('imperiumRow', this.imperiumRowSubject, { scope: 'game' });

    this.gameStatePersistenceService.bindSubjectToStorage('playerDecks', this.playerDecksSubject, { scope: 'game' });

    this.gameStatePersistenceService.bindSubjectToStorage('playerHandCards', this.playerHandsSubject, { scope: 'game' });

    this.gameStatePersistenceService.bindSubjectToStorage('playerDiscardPiles', this.playerDiscardPilesSubject, {
      scope: 'game',
    });

    this.gameStatePersistenceService.bindSubjectToStorage('playerTrashPiles', this.playerTrashPilesSubject, {
      scope: 'game',
    });

    this.gameStatePersistenceService.bindSubjectToStorage('playerPlots', this.playerPlotsSubject, { scope: 'game' });

    this.gameStatePersistenceService.bindSubjectToStorage('playedPlayerCards', this.playedPlayerCardsSubject, {
      scope: 'game',
    });

    this.gameStatePersistenceService.bindSubjectToStorage('limitedCustomCards', this.limitedCustomCardsSubject, {
      scope: 'game',
      fromStorable: (storedCards: ImperiumDeckCard[]) => restoreImperiumCardGameAdjustments(storedCards),
    });

    this.gameStatePersistenceService.bindSubjectToStorage('unlimitedCustomCards', this.unlimitedCustomCardsSubject, {
      scope: 'game',
      fromStorable: (storedCards: ImperiumCard[]) => restoreImperiumCardGameAdjustments(storedCards),
    });
  }

  get imperiumDeck() {
    return cloneDeep(this.imperiumDeckSubject.value);
  }

  get imperiumRow() {
    return cloneDeep(this.imperiumRowSubject.value);
  }

  get playerDecks() {
    return cloneDeep(this.playerDecksSubject.value);
  }

  get playerHands() {
    return cloneDeep(this.playerHandsSubject.value);
  }

  get playedPlayerCards() {
    return cloneDeep(this.playedPlayerCardsSubject.value);
  }

  get playerDiscardPiles() {
    return cloneDeep(this.playerDiscardPilesSubject.value);
  }

  get playerTrashPiles() {
    return cloneDeep(this.playerTrashPilesSubject.value);
  }

  get playerPlots() {
    return cloneDeep(this.playerPlotsSubject.value);
  }

  get limitedCustomCards() {
    return cloneDeep(this.limitedCustomCardsSubject.value);
  }

  get unlimitedCustomCards() {
    return cloneDeep(this.unlimitedCustomCardsSubject.value);
  }

  getTopDeckCards(amount: number) {
    return cloneDeep(this.imperiumDeck.slice(0, amount));
  }

  getPlayerHand(playerId: number) {
    return cloneDeep(this.playerHandsSubject.value.find((x) => x.playerId === playerId));
  }

  getPlayerHandCard(playerId: number, cardId: string) {
    return cloneDeep(this.playerHandsSubject.value.find((x) => x.playerId === playerId)?.cards.find((x) => x.id === cardId));
  }

  getPlayerDiscardPile(playerId: number) {
    return cloneDeep(this.playerDiscardPilesSubject.value.find((x) => x.playerId === playerId));
  }

  getPlayerTrashPile(playerId: number) {
    return cloneDeep(this.playerTrashPilesSubject.value.find((x) => x.playerId === playerId));
  }

  getPlayerDeck(playerId: number) {
    return cloneDeep(this.playerDecksSubject.value.find((x) => x.playerId === playerId));
  }

  getPlayedPlayerCard(playerId: number) {
    return cloneDeep(this.playedPlayerCardsSubject.value.find((x) => x.playerId === playerId));
  }

  getEnemyDiscardPiles(playerId: number) {
    return cloneDeep(this.playerDiscardPilesSubject.value.filter((x) => x.playerId !== playerId));
  }

  getAllBuyableCards(factionRecruitment?: ('emperor' | 'guild' | 'bene' | 'fremen')[]) {
    const imperiumRowCards = this.imperiumRow.filter((x) => x.type === 'imperium-card') as ImperiumRowCard[];

    const alwaysBuyableCards = [
      ...this.limitedCustomCards,
      ...this.unlimitedCustomCards.map((x) => this.instantiateImperiumCard(x)),
    ];

    let recruitableCards: ImperiumDeckCard[] = [];
    if (factionRecruitment && factionRecruitment.length > 0) {
      const recruitmentCardAmount = this.settingsService.getRecruitmentCardAmount();
      recruitableCards = this.getTopDeckCards(recruitmentCardAmount).filter(
        (x) => factionRecruitment.some((y) => y === x.faction) && x.type === 'imperium-card',
      ) as ImperiumDeckCard[];
    }

    return {
      imperiumRowCards,
      recruitableCards,
      alwaysBuyableCards,
      allCards: [...imperiumRowCards, ...recruitableCards, ...shuffle(alwaysBuyableCards)],
    };
  }

  createImperiumDeck(filter: (imperiumCard: ImperiumCard) => boolean = () => true) {
    const imperiumDeckCards: (ImperiumDeckCard | ImperiumDeckPlot)[] = [];
    const imperiumCards = this.cardConfiguratorService.imperiumCards.filter((x) => filter(x));

    for (const imperiumCard of imperiumCards) {
      for (let i = 0; i < (imperiumCard.cardAmount ?? 1); i++) {
        imperiumDeckCards.push(this.instantiateImperiumCard(imperiumCard));
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

    const playerIds = this.playersService.getPlayerIds();
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
          (x) => x.id !== card.id,
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
          (x) => x.id !== card.id,
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

  shuffleCardsOnTopOfPlayerDeck(playerId: number, cards: ImperiumDeckCard[]) {
    const playerDecks = this.playerDecks;
    const playerDeckIndex = playerDecks.findIndex((x) => x.playerId === playerId);
    if (playerDeckIndex > -1) {
      const playerDeckCards = playerDecks[playerDeckIndex].cards;
      playerDecks[playerDeckIndex].cards = [...shuffle(cards), ...playerDeckCards];
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

  aquirePlayerCardFromImperiumRow(
    playerId: number,
    card: ImperiumDeckCard,
    acquireLocation: CardAcquiringPlacementType = this.settingsService.getCardAcquiringRuleImperiumRow(),
  ) {
    const imperiumDeck = this.imperiumDeck;
    const nextCard = imperiumDeck.shift();
    if (nextCard) {
      const imperiumRow = this.imperiumRow.filter((x) => x.id !== card.id);
      imperiumRow.push({ ...nextCard, status: 'just-arrived' });
      this.imperiumRowSubject.next(imperiumRow);
      this.imperiumDeckSubject.next(imperiumDeck);
    }

    if (acquireLocation === 'discard-pile') {
      this.addCardToPlayerDiscardPile(playerId, card);
    } else if (acquireLocation === 'below-deck') {
      this.addCardUnderPlayerDeck(playerId, card);
    } else if (acquireLocation === 'above-deck') {
      this.addCardOnTopOfPlayerDeck(playerId, card);
    } else {
      this.addCardToPlayerHand(playerId, card);
    }
  }

  addCardsToImperiumRow(amount = 1) {
    const imperiumDeck = this.imperiumDeck;
    const addedCards = imperiumDeck.splice(0, amount);
    if (addedCards.length > 0) {
      const imperiumRow = this.imperiumRow;
      imperiumRow.push(...addedCards.map((x) => ({ ...x, status: 'just-arrived' }) as ImperiumRowPlot));
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

  aquirePlayerCardFromImperiumDeck(
    playerId: number,
    card: ImperiumDeckCard,
    acquireLocation: CardAcquiringPlacementType = this.settingsService.getCardAcquiringRuleImperiumRow(),
  ) {
    this.imperiumDeckSubject.next([...this.imperiumDeck.filter((x) => x.id !== card.id)]);

    if (acquireLocation === 'discard-pile') {
      this.addCardToPlayerDiscardPile(playerId, card);
    } else if (acquireLocation === 'below-deck') {
      this.addCardUnderPlayerDeck(playerId, card);
    } else if (acquireLocation === 'above-deck') {
      this.addCardOnTopOfPlayerDeck(playerId, card);
    } else {
      this.addCardToPlayerHand(playerId, card);
    }
  }

  aquirePlayerCardFromLimitedCustomCards(
    playerId: number,
    card: ImperiumDeckCard,
    acquireLocation: CardAcquiringPlacementType = this.settingsService.getCardAcquiringRuleImperiumRow(),
  ) {
    this.limitedCustomCardsSubject.next([...this.limitedCustomCards.filter((x) => x.id !== card.id)]);

    if (acquireLocation === 'discard-pile') {
      this.addCardToPlayerDiscardPile(playerId, card);
    } else if (acquireLocation === 'below-deck') {
      this.addCardUnderPlayerDeck(playerId, card);
    } else if (acquireLocation === 'above-deck') {
      this.addCardOnTopOfPlayerDeck(playerId, card);
    } else {
      this.addCardToPlayerHand(playerId, card);
    }
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

  addCardUnderPlayerDeck(playerId: number, card: ImperiumDeckCard) {
    this.shuffleCardsUnderPlayerDeck(playerId, [card]);
  }

  addCardOnTopOfPlayerDeck(playerId: number, card: ImperiumDeckCard) {
    this.shuffleCardsOnTopOfPlayerDeck(playerId, [card]);
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

  instantiateImperiumCard(card: ImperiumCard): ImperiumDeckCard {
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

  instantiateImperiumPlot(card: ImperiumPlot): ImperiumDeckPlot {
    return { ...card, type: 'plot', id: crypto.randomUUID(), cardAmount: 1 };
  }
}

// Game adjustments contain functions, which cannot be serialized and have to be re-attached after loading.
function restoreImperiumCardGameAdjustments<T extends ImperiumCard>(storedCards: T[]): T[] {
  return storedCards.map((storedCard) => {
    const imperiumCardGameAdjustments = imperiumCardsGameAdjustments.find(
      (adjustment) => adjustment.id === storedCard.name.en,
    );
    return {
      ...imperiumCardGameAdjustments,
      ...storedCard,
    };
  });
}
