import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TranslateService } from '../translate-service';
import { ImperiumCard, imperiumCards } from 'src/app/constants/imperium-cards';
import { startingCards } from 'src/app/constants/starting-cards';

export interface Log {
  fieldId: string;
  visitedAmount: number;
}

@Injectable({
  providedIn: 'root',
})
export class CardConfiguratorService {
  private imperiumCardsSubject = new BehaviorSubject<ImperiumCard[]>(imperiumCards);
  public imperiumCards$ = this.imperiumCardsSubject.asObservable();

  private startingCardsSubject = new BehaviorSubject<ImperiumCard[]>(startingCards);
  public startingCards$ = this.startingCardsSubject.asObservable();

  constructor(public translateService: TranslateService) {
    const imperiumCardsString = localStorage.getItem('imperiumCards');
    if (imperiumCardsString) {
      const imperiumCards = JSON.parse(imperiumCardsString) as ImperiumCard[];
      this.imperiumCardsSubject.next(imperiumCards);
    }

    this.imperiumCards$.subscribe((imperiumCards) => {
      localStorage.setItem('imperiumCards', JSON.stringify(imperiumCards));
    });

    const startingCardsString = localStorage.getItem('startingCards');
    if (startingCardsString) {
      const startingCards = JSON.parse(startingCardsString) as ImperiumCard[];
      this.startingCardsSubject.next(startingCards);
    }

    this.startingCards$.subscribe((startingCards) => {
      localStorage.setItem('startingCards', JSON.stringify(startingCards));
    });
  }

  public get imperiumCards() {
    return cloneDeep(this.imperiumCardsSubject.value);
  }

  public get startingCards() {
    return cloneDeep(this.startingCardsSubject.value);
  }

  addImperiumCard(card: ImperiumCard) {
    this.imperiumCardsSubject.next([...this.imperiumCards, card]);
  }

  editImperiumCard(card: ImperiumCard) {
    const cardId = card.name.en;

    const imperiumCards = this.imperiumCards;
    const cardIndex = imperiumCards.findIndex((x) => x.name.en === cardId);
    imperiumCards[cardIndex] = card;

    this.imperiumCardsSubject.next(imperiumCards);
  }

  deleteImperiumCard(id: string) {
    this.imperiumCardsSubject.next(this.imperiumCards.filter((x) => x.name.en !== id));
  }

  setImperiumCards(imperiumCards: ImperiumCard[]) {
    this.imperiumCardsSubject.next(imperiumCards);
  }

  sortImperiumCards(category: keyof ImperiumCard, order: 'asc' | 'desc') {
    if (category === 'faction') {
      const orderedCards = this.imperiumCards.sort((a, b) => {
        const aFaction = a.faction ?? '';
        const bFaction = b.faction ?? '';
        if (order === 'asc') {
          return aFaction.localeCompare(bFaction);
        } else if (order === 'desc') {
          return bFaction.localeCompare(aFaction);
        }
        return 0;
      });
      this.imperiumCardsSubject.next(orderedCards);
    }
    if (category === 'persuasionCosts') {
      const orderedCards = this.imperiumCards.sort((a, b) => {
        const aCosts = a.persuasionCosts ?? 0;
        const bCosts = b.persuasionCosts ?? 0;
        if (order === 'asc') {
          return aCosts - bCosts;
        } else if (order === 'desc') {
          return bCosts - aCosts;
        }
        return 0;
      });
      this.imperiumCardsSubject.next(orderedCards);
    }
  }

  addImperiumCards(imperiumCards: ImperiumCard[]) {
    const newCards = imperiumCards.filter((x) => !this.imperiumCards.some((y) => y.name.en === x.name.en));
    this.imperiumCardsSubject.next([...this.imperiumCards, ...newCards]);
  }

  addStartingCard(card: ImperiumCard) {
    this.startingCardsSubject.next([...this.imperiumCards, card]);
  }

  editStartingCard(card: ImperiumCard) {
    const cardId = card.name.en;

    const startingCards = this.startingCards;
    const cardIndex = startingCards.findIndex((x) => x.name.en === cardId);
    startingCards[cardIndex] = card;

    this.startingCardsSubject.next(startingCards);
  }

  deleteStartingCard(id: string) {
    this.startingCardsSubject.next(this.startingCards.filter((x) => x.name.en !== id));
  }

  setStartingCards(startingCards: ImperiumCard[]) {
    this.startingCardsSubject.next(startingCards);
  }

  addStartingCards(startingCards: ImperiumCard[]) {
    const newCards = startingCards.filter((x) => !this.startingCards.some((y) => y.name.en === x.name.en));
    this.startingCardsSubject.next([...this.startingCards, ...newCards]);
  }
}
