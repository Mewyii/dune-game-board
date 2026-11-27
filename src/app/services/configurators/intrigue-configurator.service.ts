import { inject, Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { intrigues } from 'src/app/constants/intrigues';
import { IntrigueCard } from 'src/app/models/intrigue';
import { GameStatePersistenceService } from '../persistence/game-state-persistence.service';

@Injectable({
  providedIn: 'root',
})
export class IntrigueConfiguratorService {
  private gameStatePersistenceService = inject(GameStatePersistenceService);

  private intriguesSubject = new BehaviorSubject<IntrigueCard[]>(intrigues);
  intrigues$ = this.intriguesSubject.asObservable();

  constructor() {
    this.gameStatePersistenceService.bindSubjectToStorage('intrigues', this.intriguesSubject, { scope: 'host-setup' });
  }

  get intrigues() {
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

  setIntrigues(intrigues: IntrigueCard[]) {
    this.intriguesSubject.next(intrigues);
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
