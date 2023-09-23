import { Injectable } from '@angular/core';
import { leaders } from '../constants/leaders';
import { BehaviorSubject } from 'rxjs';
import { Player } from './player-manager.service';
import { cloneDeep } from 'lodash';
import { shuffle } from '../helpers/common';

export interface PlayerLeader {
  playerId: number;
  leaderName: string;
}

@Injectable({
  providedIn: 'root',
})
export class LeadersService {
  public leaders = leaders;

  private playerLeadersSubject = new BehaviorSubject<PlayerLeader[]>([]);
  public playerLeaders$ = this.playerLeadersSubject.asObservable();

  constructor() {
    const playersLeadersString = localStorage.getItem('playerLeaders');
    if (playersLeadersString) {
      const playerLeaders = JSON.parse(playersLeadersString) as PlayerLeader[];
      this.playerLeadersSubject.next(playerLeaders);
    }

    this.playerLeaders$.subscribe((playerLeaders) => {
      localStorage.setItem('playerLeaders', JSON.stringify(playerLeaders));
    });
  }

  public get playersLeaders() {
    return cloneDeep(this.playerLeadersSubject.value);
  }

  assignLeadersToPlayers(players: Player[]) {
    const playerLeaders: PlayerLeader[] = [];

    const leaders = cloneDeep(this.leaders);
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
