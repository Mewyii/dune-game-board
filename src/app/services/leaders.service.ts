import { Injectable } from '@angular/core';
import { Leader, leaders } from '../constants/leaders';
import { BehaviorSubject } from 'rxjs';
import { Player } from './player-manager.service';
import { cloneDeep } from 'lodash';
import { shuffle } from '../helpers/common';
import { LeaderImageOnly, leadersOld } from '../constants/leaders-old';

export interface PlayerLeader {
  playerId: number;
  leaderName: string;
}

@Injectable({
  providedIn: 'root',
})
export class LeadersService {
  private leadersSubject = new BehaviorSubject<(Leader | LeaderImageOnly)[]>([...leaders, ...leadersOld]);
  public leaders$ = this.leadersSubject.asObservable();

  private playerLeadersSubject = new BehaviorSubject<PlayerLeader[]>([]);
  public playerLeaders$ = this.playerLeadersSubject.asObservable();

  constructor() {
    const leadersString = localStorage.getItem('leaders');
    if (leadersString) {
      const leaders = JSON.parse(leadersString) as (Leader | LeaderImageOnly)[];
      this.leadersSubject.next(leaders);
    }

    this.leaders$.subscribe((leaders) => {
      localStorage.setItem('leaders', JSON.stringify(leaders));
    });

    const playersLeadersString = localStorage.getItem('playerLeaders');
    if (playersLeadersString) {
      const playerLeaders = JSON.parse(playersLeadersString) as PlayerLeader[];
      this.playerLeadersSubject.next(playerLeaders);
    }

    this.playerLeaders$.subscribe((playerLeaders) => {
      localStorage.setItem('playerLeaders', JSON.stringify(playerLeaders));
    });
  }

  public get leaders() {
    return cloneDeep(this.leadersSubject.value);
  }

  public get playersLeaders() {
    return cloneDeep(this.playerLeadersSubject.value);
  }

  getLeader(playerId: number) {
    const playerLeader = this.playersLeaders.find((x) => x.playerId === playerId);
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
    this.leadersSubject.next([...leaders, ...leadersOld]);
  }

  assignLeadersToPlayers(players: Player[]) {
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
    const playerLeaders = this.playersLeaders;

    const leader = this.leaders.find((x) => x.name.en === leaderName);

    const playerLeaderIndex = playerLeaders.findIndex((x) => x.playerId === playerId);

    if (leader && playerLeaderIndex > -1) {
      playerLeaders[playerLeaderIndex] = { ...playerLeaders[playerLeaderIndex], leaderName: leader.name.en };
      this.playerLeadersSubject.next(playerLeaders);
    }
  }

  resetLeaders() {
    this.playerLeadersSubject.next([]);
  }
}
