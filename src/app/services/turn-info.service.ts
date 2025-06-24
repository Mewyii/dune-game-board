import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { mergeObjects } from '../helpers/common';
import { TurnInfo } from '../models/turn-info';

@Injectable({
  providedIn: 'root',
})
export class TurnInfoService {
  private turnInfosSubject = new BehaviorSubject<TurnInfo[]>([]);
  public turnInfos$ = this.turnInfosSubject.asObservable();

  constructor() {
    const turnInfosString = localStorage.getItem('turnInfos');
    if (turnInfosString) {
      const turnInfos = JSON.parse(turnInfosString) as TurnInfo[];
      this.turnInfosSubject.next(turnInfos);
    }

    this.turnInfos$.subscribe((turnInfos) => {
      localStorage.setItem('turnInfos', JSON.stringify(turnInfos));
    });
  }

  get turnInfos() {
    return cloneDeep(this.turnInfosSubject.value);
  }

  getPlayerTurnInfos(playerId: number) {
    return cloneDeep(this.turnInfosSubject.value.find((x) => x.playerId === playerId));
  }

  getPlayerTurnInfo<T extends keyof TurnInfo>(playerId: number, property: T) {
    const playerTurnInfo = this.turnInfosSubject.value.find((x) => x.playerId === playerId);
    if (playerTurnInfo) {
      return playerTurnInfo[property];
    }
    return undefined;
  }

  updatePlayerTurnInfo(playerId: number, turnInfo: Partial<TurnInfo>) {
    const currentTurnInfos = this.turnInfosSubject.value;
    const turnInfoIndex = currentTurnInfos.findIndex((x) => x.playerId === playerId);
    if (turnInfoIndex > -1) {
      currentTurnInfos[turnInfoIndex] = mergeObjects(currentTurnInfos[turnInfoIndex], turnInfo);
      this.turnInfosSubject.next(currentTurnInfos);
    } else {
      const newTurnInfo = { ...this.getInitialTurnInfo(playerId), ...turnInfo };
      currentTurnInfos.push(newTurnInfo);
      this.turnInfosSubject.next(currentTurnInfos);
    }
  }

  setPlayerTurnInfo(playerId: number, turnInfo: Partial<TurnInfo>) {
    const currentTurnInfos = this.turnInfosSubject.value;
    const turnInfoIndex = currentTurnInfos.findIndex((x) => x.playerId === playerId);
    if (turnInfoIndex > -1) {
      currentTurnInfos[turnInfoIndex] = { ...currentTurnInfos[turnInfoIndex], ...turnInfo };
      this.turnInfosSubject.next(currentTurnInfos);
    } else {
      const newTurnInfo = { ...this.getInitialTurnInfo(playerId), ...turnInfo };
      currentTurnInfos.push(newTurnInfo);
      this.turnInfosSubject.next(currentTurnInfos);
    }
  }

  clearPlayerTurnInfo(playerId: number) {
    this.turnInfosSubject.next(this.turnInfosSubject.value.filter((x) => x.playerId !== playerId));
  }

  resetTurnInfos() {
    this.turnInfosSubject.next([]);
  }

  getDeployablePlayerUnits(playerId: number) {
    const turnInfo = this.getPlayerTurnInfos(playerId);
    if (!turnInfo) {
      return undefined;
    } else {
      const unitAmount = turnInfo.deployableUnits - turnInfo.deployedUnits;
      const troopAmount = turnInfo.deployableTroops - turnInfo.deployedTroops;
      const dreadnoughtamount = turnInfo.deployableDreadnoughts - turnInfo.deployedDreadnoughts;

      return { unitAmount, troopAmount, dreadnoughtamount };
    }
  }

  private getInitialTurnInfo(playerId = 0): TurnInfo {
    return {
      playerId,
      agentPlacedOnFieldId: '',
      canBuyTech: false,
      canEnterCombat: false,
      deployableUnits: 0,
      troopsGained: 0,
      dreadnoughtsGained: 0,
      deployableTroops: 0,
      deployableDreadnoughts: 0,
      deployedUnits: 0,
      deployedTroops: 0,
      deployedDreadnoughts: 0,
      retreatableTroops: 0,
      retreatableDreadnoughts: 0,
      cardDrawOrDestroyAmount: 0,
      cardDiscardAmount: 0,
      canLiftAgent: false,
      factionInfluenceUpChoiceAmount: 0,
      factionInfluenceUpChoiceTwiceAmount: 0,
      factionInfluenceDownChoiceAmount: 0,
      shippingAmount: 0,
      locationControlAmount: 0,
      signetRingAmount: 0,
      intrigueTrashAmount: 0,
      factionRecruitment: [],
      cardsPlayedThisTurn: [],
      cardsBoughtThisTurn: [],
      cardsTrashedThisTurn: [],
      intriguesPlayedThisTurn: [],
      techTilesFlippedThisTurn: [],
      techTilesBoughtThisTurn: [],
      fieldsVisitedThisTurn: [],
      aiStatus: 'ready',
      effectChoices: [],
      effectConversions: [],
      enemiesEffects: [],
      cardReturnToHandAmount: 0,
      needsToPassTurn: false,
    };
  }
}
