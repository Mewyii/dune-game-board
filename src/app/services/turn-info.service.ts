import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { mergeObjects } from '../helpers/common';
import { cloneDeep } from 'lodash';

export interface TurnInfo {
  playerId: number;
  unitsGainedThisTurn: number;
  agentPlacedOnFieldId: string;
  techBuyOptionsWithAgents: number[];
  canEnterCombat: boolean;
  cardDrawOrDestroyAmount: number;
  canLiftAgent: boolean;
  factionInfluenceUpChoiceAmount: number;
  factionInfluenceUpChoiceTwiceAmount: number;
  factionInfluenceDownChoiceAmount: number;
  shippingAmount: number;
  locationControlAmount: number;
  signetRingAmount: number;
}

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

  clearPlayerTurnInfo(playerId: number) {
    this.turnInfosSubject.next(this.turnInfosSubject.value.filter((x) => x.playerId !== playerId));
  }

  resetTurnInfos() {
    this.turnInfosSubject.next([]);
  }

  // mergeTurnInfos(aiAgentPlacementInfo: TurnInfo, aiInfo: Partial<TurnInfo>): TurnInfo {
  //   return {
  //     playerId: aiAgentPlacementInfo.playerId,
  //     unitsGainedThisTurn: aiAgentPlacementInfo.unitsGainedThisTurn + aiInfo.unitsGainedThisTurn,
  //     techAgentsGainedThisTurn: aiAgentPlacementInfo.techAgentsGainedThisTurn + aiInfo.techAgentsGainedThisTurn,
  //     canDestroyOrDrawCard: aiAgentPlacementInfo.canDestroyOrDrawCard || aiInfo.canDestroyOrDrawCard,
  //     canBuyTech: aiAgentPlacementInfo.canBuyTech || aiInfo.canBuyTech,
  //     canEnterCombat: aiAgentPlacementInfo.canEnterCombat || aiInfo.canEnterCombat,
  //     canLiftAgent: aiAgentPlacementInfo.canLiftAgent || aiInfo.canLiftAgent,
  //     factionInfluenceUpChoiceAmount:
  //       aiAgentPlacementInfo.factionInfluenceUpChoiceAmount + aiInfo.factionInfluenceUpChoiceAmount,
  //     factionInfluenceUpChoiceTwiceAmount:
  //       aiAgentPlacementInfo.factionInfluenceUpChoiceTwiceAmount + aiInfo.factionInfluenceUpChoiceTwiceAmount,
  //     shippingAmount: aiAgentPlacementInfo.shippingAmount + aiInfo.shippingAmount,
  //     factionInfluenceDownChoiceAmount:
  //       aiAgentPlacementInfo.factionInfluenceDownChoiceAmount + aiInfo.factionInfluenceDownChoiceAmount,
  //     locationControlAmount: aiAgentPlacementInfo.locationControlAmount + aiInfo.locationControlAmount,
  //     signetRingAmount: aiAgentPlacementInfo.signetRingAmount + aiInfo.signetRingAmount,
  //   };
  // }

  private getInitialTurnInfo(playerId = 0): TurnInfo {
    return {
      playerId,
      unitsGainedThisTurn: 0,
      agentPlacedOnFieldId: '',
      techBuyOptionsWithAgents: [],
      canEnterCombat: false,
      cardDrawOrDestroyAmount: 0,
      canLiftAgent: false,
      factionInfluenceUpChoiceAmount: 0,
      factionInfluenceUpChoiceTwiceAmount: 0,
      factionInfluenceDownChoiceAmount: 0,
      shippingAmount: 0,
      locationControlAmount: 0,
      signetRingAmount: 0,
    };
  }
}
