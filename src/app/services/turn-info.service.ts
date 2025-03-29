import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { mergeObjects } from '../helpers/common';
import { cloneDeep } from 'lodash';
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

  getPlayerTurnInfo(playerId: number) {
    return cloneDeep(this.turnInfosSubject.value.find((x) => x.playerId === playerId));
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
    const turnInfo = this.getPlayerTurnInfo(playerId);
    if (!turnInfo || !turnInfo.canEnterCombat) {
      return undefined;
    } else {
      const unitAmount = turnInfo.deployableUnits - turnInfo.deployedUnitsThisTurn;
      const troopAmount = turnInfo.troopsGainedThisTurn - turnInfo.deployedTroopsThisTurn;
      const dreadnoughtamount = turnInfo.dreadnoughtsGainedThisTurn - turnInfo.deployedDreadnoughtsThisTurn;

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
      troopsGainedThisTurn: 0,
      dreadnoughtsGainedThisTurn: 0,
      deployedUnitsThisTurn: 0,
      deployedTroopsThisTurn: 0,
      deployedDreadnoughtsThisTurn: 0,
      cardDrawOrDestroyAmount: 0,
      canLiftAgent: false,
      factionInfluenceUpChoiceAmount: 0,
      factionInfluenceUpChoiceTwiceAmount: 0,
      factionInfluenceDownChoiceAmount: 0,
      shippingAmount: 0,
      locationControlAmount: 0,
      signetRingAmount: 0,
      factionRecruitment: [],
      cardsBoughtThisTurn: [],
      cardsTrashedThisTurn: [],
      intriguesPlayedThisTurn: [],
      techTilesBoughtThisTurn: [],
      fieldsVisitedThisTurn: [],
      isDoingAIActions: false,
    };
  }
}
