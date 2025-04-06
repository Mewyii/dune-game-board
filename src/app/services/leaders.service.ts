import { Injectable } from '@angular/core';
import { cloneDeep, shuffle } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Leader, leaders } from '../constants/leaders';
import { getStructuredEffectArrayInfos } from '../helpers/rewards';
import { StructuredEffects } from '../models';
import { Player } from '../models/player';
import { LeaderConfiguratorService } from './configurators/leader.service';

export interface LeaderDeckCard extends Leader {
  id: string;
  structuredPassiveEffects?: StructuredEffects;
  structuredSignetEffects?: StructuredEffects;
}

export interface PlayerLeader {
  playerId: number;
  leader: LeaderDeckCard;
  isLockedIn?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LeadersService {
  private leaderDeckSubject = new BehaviorSubject<LeaderDeckCard[]>([]);
  public leaderDeck$ = this.leaderDeckSubject.asObservable();

  private playerLeadersSubject = new BehaviorSubject<PlayerLeader[]>([]);
  public playerLeaders$ = this.playerLeadersSubject.asObservable();
  public playerLeaders: PlayerLeader[] = [];

  constructor(private leaderConfiguratorService: LeaderConfiguratorService) {
    const leaderDeckString = localStorage.getItem('leaderDeck');
    if (leaderDeckString) {
      const storedLeaders = JSON.parse(leaderDeckString) as LeaderDeckCard[];

      // Workaround for local storage not being able to store functions
      const realLeaders = storedLeaders.map((x) => {
        const leader = leaders.find((y) => y.name.en === x.name.en);
        return { ...leader, ...x };
      });

      this.leaderDeckSubject.next(realLeaders);
    }

    this.leaderDeck$.subscribe((leaderDeck) => {
      localStorage.setItem('leaderDeck', JSON.stringify(leaderDeck));
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

  private get leaderDeck() {
    return cloneDeep(this.leaderDeckSubject.value);
  }

  getLeader(playerId: number) {
    return cloneDeep(this.playerLeaders.find((x) => x.playerId === playerId)?.leader);
  }

  createLeaderDeck() {
    const techTiles = this.leaderConfiguratorService.leaders;
    this.playerLeadersSubject.next([]);
    this.leaderDeckSubject.next(techTiles.map((x) => this.instantiateLeader(x)));
  }

  assignRandomLeadersToPlayers(players: Player[]) {
    const playerLeaders: PlayerLeader[] = [];

    const leaderDeck = cloneDeep(this.leaderDeck.filter((x) => x.playableByAI));
    const shuffledLeaders = shuffle(leaderDeck);

    for (const player of players) {
      const leader = shuffledLeaders.pop();
      if (leader) {
        playerLeaders.push({ playerId: player.id, leader: leader });
      }
    }

    this.playerLeadersSubject.next(playerLeaders);
  }

  assignLeaderToPlayer(playerId: number, leaderId: string) {
    const playerLeaders = this.playerLeaders;

    const leader = this.leaderDeck.find((x) => x.id === leaderId);

    const playerLeaderIndex = playerLeaders.findIndex((x) => x.playerId === playerId);

    if (leader && playerLeaderIndex > -1) {
      playerLeaders[playerLeaderIndex] = { ...playerLeaders[playerLeaderIndex], leader: leader };
      this.playerLeadersSubject.next(playerLeaders);
    }
  }

  lockInLeader(playerId: number) {
    const playerLeaders = this.playerLeaders;
    const playerLeaderIndex = playerLeaders.findIndex((x) => x.playerId === playerId);

    if (playerLeaderIndex > -1) {
      const playerLeader = playerLeaders[playerLeaderIndex];
      playerLeaders[playerLeaderIndex] = { ...playerLeader, isLockedIn: true };

      this.playerLeadersSubject.next(playerLeaders);
      this.leaderDeckSubject.next(shuffle(this.leaderDeck.filter((x) => x.id !== playerLeader.leader.id)));
    }
  }

  resetLeaders() {
    this.playerLeadersSubject.next([]);
  }

  private instantiateLeader(leader: Leader): LeaderDeckCard {
    return {
      ...leader,
      id: crypto.randomUUID(),
      structuredPassiveEffects:
        leader.passiveEffects && leader.passiveEffects.length > 0
          ? getStructuredEffectArrayInfos(leader.passiveEffects)
          : undefined,
      structuredSignetEffects:
        leader.signetEffects && leader.signetEffects.length > 0
          ? getStructuredEffectArrayInfos(leader.signetEffects)
          : undefined,
    };
  }
}
