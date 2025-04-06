import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Leader, leaders } from 'src/app/constants/leaders';

@Injectable({
  providedIn: 'root',
})
export class LeaderConfiguratorService {
  private leadersSubject = new BehaviorSubject<Leader[]>(leaders);
  public leaders$ = this.leadersSubject.asObservable();

  constructor() {
    const leadersString = localStorage.getItem('leaders');
    if (leadersString) {
      const leaders = JSON.parse(leadersString) as Leader[];
      this.leadersSubject.next(leaders);
    }

    this.leaders$.subscribe((leaders) => {
      localStorage.setItem('leaders', JSON.stringify(leaders));
    });
  }

  public get leaders() {
    return cloneDeep(this.leadersSubject.value);
  }

  addLeader(card: Leader) {
    this.leadersSubject.next([...this.leaders, card]);
  }

  editLeader(card: Leader) {
    const cardId = card.name.en;

    const leaders = this.leaders;
    const cardIndex = leaders.findIndex((x) => x.name.en === cardId);
    leaders[cardIndex] = card;

    this.leadersSubject.next(leaders);
  }

  deleteLeader(id: string) {
    this.leadersSubject.next(this.leaders.filter((x) => x.name.en !== id));
  }

  setLeaders(leaders: Leader[]) {
    this.leadersSubject.next(leaders);
  }
}
