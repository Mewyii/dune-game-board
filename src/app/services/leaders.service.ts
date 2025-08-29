import { Injectable } from '@angular/core';
import { cloneDeep, shuffle } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Leader } from '../constants/leaders';
import { LeaderGameAdjustments, leadersGameAdjustments } from '../constants/leaders-game-adjustments';
import { getStructuredEffectArrayInfos } from '../helpers/rewards';
import { StructuredEffect } from '../models';
import { Player } from '../models/player';
import { LeaderConfiguratorService } from './configurators/leader.service';

export interface LeaderDeckCard extends Leader, LeaderGameAdjustments {
  id: string;
  structuredPassiveEffects?: StructuredEffect[];
  structuredSignetEffects?: StructuredEffect[];
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
        const leaderGameAdjustments = leadersGameAdjustments.find((y) => y.id === x.name.en);
        return {
          ...x,
          ...leaderGameAdjustments,
        };
      });

      this.leaderDeckSubject.next(realLeaders);
    }

    this.leaderDeck$.subscribe((leaderDeck) => {
      localStorage.setItem('leaderDeck', JSON.stringify(leaderDeck));
    });

    const playersLeadersString = localStorage.getItem('playerLeaders');
    if (playersLeadersString) {
      const playerLeaders = JSON.parse(playersLeadersString) as PlayerLeader[];

      // Workaround for local storage not being able to store functions
      const realPlayerLeaders = playerLeaders.map((x) => {
        const leaderGameAdjustments = leadersGameAdjustments.find((y) => y.id === x.leader.name.en);
        return {
          ...x,
          leader: {
            ...x.leader,
            ...leaderGameAdjustments,
          },
        };
      });
      this.playerLeadersSubject.next(realPlayerLeaders);
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
    const leaders = this.leaderConfiguratorService.leaders;
    this.playerLeadersSubject.next([]);
    this.leaderDeckSubject.next(leaders.map((x) => this.instantiateLeader(x)));
  }

  assignRandomLeadersToPlayers(players: Player[]) {
    const playerLeaders: PlayerLeader[] = [];

    const leaderDeck = cloneDeep(this.leaderDeck);
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
      this.leaderDeckSubject.next(this.leaderDeck.filter((x) => x.id !== playerLeader.leader.id));
    }
  }

  resetLeaders() {
    this.playerLeadersSubject.next([]);
  }

  private instantiateLeader(leader: Leader): LeaderDeckCard {
    const leaderGameAdjustments = leadersGameAdjustments.find((y) => y.id === leader.name.en);

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
      ...leaderGameAdjustments,
    };
  }
}
