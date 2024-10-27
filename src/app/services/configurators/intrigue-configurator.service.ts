import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { IntrigueCard, intrigues } from 'src/app/constants/intrigues';

@Injectable({
  providedIn: 'root',
})
export class IntrigueConfiguratorService {
  private intriguesSubject = new BehaviorSubject<IntrigueCard[]>(intrigues);
  public intrigues$ = this.intriguesSubject.asObservable();

  constructor() {
    const intriguesString = localStorage.getItem('intrigues');
    if (intriguesString) {
      const intrigues = JSON.parse(intriguesString) as IntrigueCard[];
      this.intriguesSubject.next(intrigues);
    }

    this.intrigues$.subscribe((intrigues) => {
      localStorage.setItem('intrigues', JSON.stringify(intrigues));
    });
  }

  public get intrigues() {
    return cloneDeep(this.intriguesSubject.value);
  }

  addIntrigue(card: IntrigueCard) {
    this.intriguesSubject.next([...this.intrigues, card]);
  }

  editIntrigue(card: IntrigueCard) {
    const cardId = card.name.en;

    const intrigues = this.intrigues;
    const cardIndex = intrigues.findIndex((x) => x.name.en === cardId);
    intrigues[cardIndex] = card;

    this.intriguesSubject.next(intrigues);
  }

  deleteIntrigue(id: string) {
    this.intriguesSubject.next(this.intrigues.filter((x) => x.name.en !== id));
  }

  sortIntrigues(category: keyof IntrigueCard, order: 'asc' | 'desc') {
    if (category === 'name') {
      const orderedIntrigues = this.intrigues.sort((a, b) => {
        const aName = a.name.en;
        const bName = b.name.en;
        if (order === 'asc') {
          return aName.localeCompare(bName);
        } else if (order === 'desc') {
          return bName.localeCompare(aName);
        }
        return 0;
      });
      this.intriguesSubject.next(orderedIntrigues);
    }
    if (category === 'type') {
      const orderedIntrigues = this.intrigues.sort((a, b) => {
        const aType = a.type;
        const bType = b.type;
        if (order === 'asc') {
          return aType.localeCompare(bType);
        } else if (order === 'desc') {
          return bType.localeCompare(aType);
        }
        return 0;
      });
      this.intriguesSubject.next(orderedIntrigues);
    }
  }
}
