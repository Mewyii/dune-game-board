import { inject, Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Leader, leaders } from 'src/app/constants/leaders';
import { GameStatePersistenceService } from '../persistence/game-state-persistence.service';

@Injectable({
  providedIn: 'root',
})
export class LeaderConfiguratorService {
  private gameStatePersistenceService = inject(GameStatePersistenceService);

  private leadersSubject = new BehaviorSubject<Leader[]>(leaders);
  leaders$ = this.leadersSubject.asObservable();

  constructor() {
    this.gameStatePersistenceService.bindSubjectToStorage('leaders', this.leadersSubject, { scope: 'host-setup' });
  }

  get leaders() {
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
