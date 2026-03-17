import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

interface PlayerAgentBase {
  playerId: number;
  state: PlayerAgentState;
}

export type PlayerAgentState = 'available' | 'placed' | 'timeout';

interface PlayerAgentAvailable extends PlayerAgentBase {
  state: 'available';
  fieldId: undefined;
}

export interface PlayerAgentOnField extends PlayerAgentBase {
  state: 'placed';
  fieldId: string;
}

interface PlayerAgentInTimeout extends PlayerAgentBase {
  state: 'timeout';
  fieldId: undefined;
}

export type PlayerAgent = PlayerAgentAvailable | PlayerAgentOnField | PlayerAgentInTimeout;

@Injectable({
  providedIn: 'root',
})
export class PlayerAgentsService {
  private playersAgentsSubject = new BehaviorSubject<PlayerAgent[]>([]);
  public playersAgents$ = this.playersAgentsSubject.asObservable();
  public availablePlayersAgents$ = this.playersAgents$.pipe(
    map((agents) => agents.filter((x) => x.state === 'available')),
    distinctUntilChanged(),
  );
  public availablePlayerAgents$ = (playerId: number) =>
    this.availablePlayersAgents$.pipe(
      map((x) => x.filter((agents) => agents.playerId === playerId)),
      distinctUntilChanged(),
    );

  public playersAgentsOnFields$ = this.playersAgents$.pipe(
    map((agents) => agents.filter((x) => x.state === 'placed')),
    distinctUntilChanged(),
  );

  constructor() {
    const playersAgentsString = localStorage.getItem('playerAgents');
    if (playersAgentsString) {
      const playerAgents = JSON.parse(playersAgentsString) as PlayerAgent[];
      this.playersAgentsSubject.next(playerAgents);
    }

    this.playersAgents$.subscribe((playerAgents) => {
      localStorage.setItem('playerAgents', JSON.stringify(playerAgents));
    });
  }

  public getPlayersAgents() {
    return cloneDeep(this.playersAgentsSubject.value);
  }

  public getPlayersAgentsOnFields() {
    return cloneDeep(this.playersAgentsSubject.value.filter((x) => x.state === 'placed'));
  }

  public getPlayerAgents(playerId: number) {
    return cloneDeep(this.playersAgentsSubject.value.filter((x) => x.playerId === playerId));
  }

  public getAvailablePlayerAgents(playerId: number) {
    return cloneDeep(this.playersAgentsSubject.value.filter((x) => x.playerId === playerId && x.state === 'available'));
  }

  public getAvailablePlayerAgentCount(playerId: number) {
    return this.playersAgentsSubject.value.filter((x) => x.playerId === playerId && x.state === 'available').length;
  }

  public getPlayerAgentsOnFields(playerId: number) {
    return cloneDeep(
      this.playersAgentsSubject.value.filter((x) => x.playerId === playerId && x.state == 'placed'),
    ) as PlayerAgentOnField[];
  }

  public getPlayerAgentsOnField(fieldId: string) {
    return cloneDeep(this.playersAgentsSubject.value.filter((x) => x.fieldId === fieldId)) as PlayerAgentOnField[];
  }

  public getPlayerAgentsOnFieldCount(fieldId: string) {
    return this.playersAgentsSubject.value.filter((x) => x.fieldId === fieldId).length;
  }

  public getEnemyPlayerAgents(playerId: number) {
    return cloneDeep(this.playersAgentsSubject.value.filter((x) => x.playerId !== playerId));
  }

  public getAvailableEnemyPlayerAgents(playerId: number) {
    return cloneDeep(this.playersAgentsSubject.value.filter((x) => x.playerId !== playerId && x.state === 'available'));
  }

  public getEnemyAgentsOnFields(playerId: number) {
    return cloneDeep(
      this.playersAgentsSubject.value.filter((x) => x.playerId !== playerId && x.state == 'placed'),
    ) as PlayerAgentOnField[];
  }

  public resetPlayerAgents() {
    const playersAgents = this.getPlayersAgents();

    this.playersAgentsSubject.next(playersAgents.map((x) => ({ ...x, state: 'available', fieldId: undefined })));
  }

  public deleteAllPlayerAgents() {
    this.playersAgentsSubject.next([]);
  }

  public addPlayerAgent(playerId: number) {
    const playersAgents = this.getPlayersAgents();
    const newPlayerAgent = { playerId, state: 'available', fieldId: undefined } as PlayerAgent;
    this.playersAgentsSubject.next([...playersAgents, newPlayerAgent]);
  }

  public removePlayerAgent(playerId: number) {
    const playersAgents = this.getPlayersAgents();
    const playerAgentIndex = playersAgents.findIndex((x) => x.playerId === playerId && x.state === 'available');
    if (playerAgentIndex > -1) {
      playersAgents.splice(playerAgentIndex, 1);
    }
    this.playersAgentsSubject.next(playersAgents);
  }

  public addPlayerAgents(playerId: number, amount = 1) {
    const playersAgents = this.getPlayersAgents();
    const newPlayerAgents = [];
    for (let i = 0; i < amount; i++) {
      newPlayerAgents.push({ playerId, state: 'available' } as PlayerAgent);
    }
    this.playersAgentsSubject.next([...playersAgents, ...newPlayerAgents]);
  }

  public setPlayerAgentOnField(playerId: number, fieldId: string) {
    const playersAgents = this.getPlayersAgents();

    const playerIndex = playersAgents.findIndex((x) => x.playerId === playerId && x.state === 'available');
    const player = playersAgents[playerIndex];
    playersAgents[playerIndex] = { ...player, state: 'placed', fieldId: fieldId };

    this.playersAgentsSubject.next(playersAgents);
  }

  public removePlayerAgentFromField(playerId: number, fieldId: string) {
    const playersAgents = this.getPlayersAgents();

    const playerIndex = playersAgents.findIndex((x) => x.playerId === playerId && x.fieldId === fieldId);
    const player = playersAgents[playerIndex];
    playersAgents[playerIndex] = { ...player, state: 'available', fieldId: undefined };

    this.playersAgentsSubject.next(playersAgents);
  }

  public setPlayerAgentInTimeout(playerId: number, fieldId: string) {
    const playersAgents = this.getPlayersAgents();

    const playerIndex = playersAgents.findIndex((x) => x.playerId === playerId && x.fieldId === fieldId);
    const player = playersAgents[playerIndex];
    playersAgents[playerIndex] = { ...player, state: 'timeout', fieldId: undefined };

    this.playersAgentsSubject.next(playersAgents);
  }
}
