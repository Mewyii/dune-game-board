import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TranslateService } from '../translate-service';
import { ImperiumCard, imperiumCards } from 'src/app/constants/imperium-cards';

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

  constructor(public translateService: TranslateService) {
    const imperiumCardsString = localStorage.getItem('imperiumCards');
    if (imperiumCardsString) {
      const imperiumCards = JSON.parse(imperiumCardsString) as ImperiumCard[];
      this.imperiumCardsSubject.next(imperiumCards);
    }

    this.imperiumCards$.subscribe((imperiumCards) => {
      localStorage.setItem('imperiumCards', JSON.stringify(imperiumCards));
    });
  }

  public get imperiumCards() {
    return cloneDeep(this.imperiumCardsSubject.value);
  }

  addCard(card: ImperiumCard) {
    this.imperiumCardsSubject.next([...this.imperiumCards, card]);
  }

  editCard(card: ImperiumCard) {
    const cardId = card.name.en;

    const imperiumCards = this.imperiumCards;
    const cardIndex = imperiumCards.findIndex((x) => x.name.en === cardId);
    imperiumCards[cardIndex] = card;

    this.imperiumCardsSubject.next(imperiumCards);
  }

  deleteCard(id: string) {
    this.imperiumCardsSubject.next(this.imperiumCards.filter((x) => x.name.en !== id));
  }

  setCards(imperiumCards: ImperiumCard[]) {
    this.imperiumCardsSubject.next(imperiumCards);
  }
}
