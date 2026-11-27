import { inject, Injectable } from '@angular/core';
import { cloneDeep, shuffle } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Leader } from '../constants/leaders';
import { LeaderGameAdjustments, leadersGameAdjustments } from '../constants/leaders-game-adjustments';
import { getStructuredEffectArrayInfos } from '../helpers/rewards';
import { StructuredEffect } from '../models';
import { Player } from '../models/player';
import { LeaderConfiguratorService } from './configurators/leader.service';
import { GameStatePersistenceService } from './persistence/game-state-persistence.service';

export interface LeaderDeckCard extends Leader, LeaderGameAdjustments {
  id: string;
  structuredPassiveEffects?: StructuredEffect[];
  structuredSignetEffects?: StructuredEffect[];
}

export interface PlayerLeader {
  playerId: number;
  leader: LeaderDeckCard;
  isLockedIn: boolean;
  isFlipped: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LeadersService {
  private gameStatePersistenceService = inject(GameStatePersistenceService);
  private leaderConfiguratorService = inject(LeaderConfiguratorService);

  private leaderDeckSubject = new BehaviorSubject<LeaderDeckCard[]>([]);
  leaderDeck$ = this.leaderDeckSubject.asObservable();

  private playerLeadersSubject = new BehaviorSubject<PlayerLeader[]>([]);
  playerLeaders$ = this.playerLeadersSubject.asObservable();
  playerLeaders: PlayerLeader[] = [];

  constructor() {
    this.gameStatePersistenceService.bindSubjectToStorage('leaderDeck', this.leaderDeckSubject, {
      scope: 'game',
      fromStorable: (storedLeaders: LeaderDeckCard[]) => storedLeaders.map((leader) => restoreLeaderGameAdjustments(leader)),
    });

    this.gameStatePersistenceService.bindSubjectToStorage('playerLeaders', this.playerLeadersSubject, {
      scope: 'game',
      fromStorable: (storedPlayerLeaders: PlayerLeader[]) =>
        storedPlayerLeaders.map((playerLeader) => ({
          ...playerLeader,
          leader: restoreLeaderGameAdjustments(playerLeader.leader),
        })),
    });

    this.playerLeaders$.subscribe((playerLeaders) => {
      this.playerLeaders = cloneDeep(playerLeaders);
    });
  }

  private get leaderDeck() {
    return cloneDeep(this.leaderDeckSubject.value);
  }

  getLeader(playerId: number) {
    return cloneDeep(this.playerLeaders.find((x) => x.playerId === playerId)?.leader);
  }

  getPlayerLeader(playerId: number) {
    return cloneDeep(this.playerLeaders.find((x) => x.playerId === playerId));
  }

  getEnemyPlayerLeaders(playerId: number) {
    return cloneDeep(this.playerLeaders.filter((x) => x.playerId !== playerId));
  }

  getPlayerLeaderName(playerId: number) {
    return cloneDeep(this.playerLeaders.find((x) => x.playerId === playerId)?.leader.name);
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
        playerLeaders.push({ playerId: player.id, leader: leader, isLockedIn: false, isFlipped: false });
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

  flipLeader(playerId: number) {
    const playerLeaders = this.playerLeaders;
    const playerLeaderIndex = playerLeaders.findIndex((x) => x.playerId === playerId);

    if (playerLeaderIndex > -1) {
      const playerLeader = playerLeaders[playerLeaderIndex];
      playerLeaders[playerLeaderIndex] = { ...playerLeader, isFlipped: true };

      this.playerLeadersSubject.next(playerLeaders);
      this.leaderDeckSubject.next(this.leaderDeck.filter((x) => x.id !== playerLeader.leader.id));
    }
  }

  unflipLeader(playerId: number) {
    const playerLeaders = this.playerLeaders;
    const playerLeaderIndex = playerLeaders.findIndex((x) => x.playerId === playerId);

    if (playerLeaderIndex > -1) {
      const playerLeader = playerLeaders[playerLeaderIndex];
      playerLeaders[playerLeaderIndex] = { ...playerLeader, isFlipped: false };

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

// Game adjustments contain functions, which cannot be serialized and have to be re-attached after loading.
function restoreLeaderGameAdjustments(storedLeader: LeaderDeckCard): LeaderDeckCard {
  const leaderGameAdjustments = leadersGameAdjustments.find((adjustment) => adjustment.id === storedLeader.name.en);
  return {
    ...storedLeader,
    ...leaderGameAdjustments,
  };
}
