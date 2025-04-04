import { Injectable } from '@angular/core';
import { Leader, leaders } from '../constants/leaders';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep, shuffle } from 'lodash';
import { Player } from '../models/player';

export interface PlayerLeader {
  playerId: number;
  leaderName: string;
  isLockedIn?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LeadersService {
  private leadersSubject = new BehaviorSubject<Leader[]>(leaders);
  public leaders$ = this.leadersSubject.asObservable();
  public leaders: Leader[] = [];

  private playerLeadersSubject = new BehaviorSubject<PlayerLeader[]>([]);
  public playerLeaders$ = this.playerLeadersSubject.asObservable();
  public playerLeaders: PlayerLeader[] = [];

  constructor() {
    const leadersString = localStorage.getItem('leaders');
    if (leadersString) {
      const storedLeaders = JSON.parse(leadersString) as Leader[];

      // Workaround for local storage not being able to store functions
      const realLeaders = storedLeaders.map((x) => {
        const leader = leaders.find((y) => y.name.en === x.name.en);
        return { ...leader, ...x };
      });

      this.leadersSubject.next(realLeaders);
    }

    this.leaders$.subscribe((leaders) => {
      this.leaders = cloneDeep(leaders);
      localStorage.setItem('leaders', JSON.stringify(leaders));
    });

    const playersLeadersString = localStorage.getItem('playerLeaders');
    if (playersLeadersString) {
      const playerLeaders = JSON.parse(playersLeadersString) as PlayerLeader[];
      this.playerLeadersSubject.next(playerLeaders);
    }

    this.playerLeaders$.subscribe((playerLeaders) => {
      this.playerLeaders = cloneDeep(playerLeaders);
      localStorage.setItem('playerLeaders', JSON.stringify(playerLeaders));
    });
  }

  getLeader(playerId: number) {
    const playerLeader = this.playerLeaders.find((x) => x.playerId === playerId);
    return this.leaders.find((x) => x.name.en === playerLeader?.leaderName);
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
    this.leadersSubject.next([...leaders]);
  }

  assignRandomLeadersToPlayers(players: Player[]) {
    const playerLeaders: PlayerLeader[] = [];

    const leaders = cloneDeep(this.leaders.filter((x) => x.playableByAI));
    const shuffledLeaders = shuffle(leaders);

    for (const player of players) {
      const leader = shuffledLeaders.pop();
      if (leader) {
        playerLeaders.push({ playerId: player.id, leaderName: leader?.name.en });
      }
    }

    this.playerLeadersSubject.next(playerLeaders);
  }

  assignLeaderToPlayer(playerId: number, leaderName: string) {
    const playerLeaders = this.playerLeaders;

    const leader = this.leaders.find((x) => x.name.en === leaderName);

    const playerLeaderIndex = playerLeaders.findIndex((x) => x.playerId === playerId);

    if (leader && playerLeaderIndex > -1) {
      playerLeaders[playerLeaderIndex] = { ...playerLeaders[playerLeaderIndex], leaderName: leader.name.en };
      this.playerLeadersSubject.next(playerLeaders);
    }
  }

  lockInLeader(playerId: number) {
    const playerLeaders = this.playerLeaders;
    const playerLeaderIndex = playerLeaders.findIndex((x) => x.playerId === playerId);

    if (playerLeaderIndex > -1) {
      playerLeaders[playerLeaderIndex] = { ...playerLeaders[playerLeaderIndex], isLockedIn: true };
      this.playerLeadersSubject.next(playerLeaders);
    }
  }

  resetLeaders() {
    this.playerLeadersSubject.next([]);
  }
}
