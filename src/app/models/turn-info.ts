import { ActiveFactionType } from './faction';

export interface TurnInfo {
  playerId: number;
  agentPlacedOnFieldId: string;
  techBuyOptionsWithAgents: number[];
  canEnterCombat: boolean;
  deployableUnits: number;
  troopsGainedThisTurn: number;
  dreadnoughtsGainedThisTurn: number;
  deployedUnitsThisTurn: number;
  deployedTroopsThisTurn: number;
  deployedDreadnoughtsThisTurn: number;
  cardDrawOrDestroyAmount: number;
  canLiftAgent: boolean;
  factionInfluenceUpChoiceAmount: number;
  factionInfluenceUpChoiceTwiceAmount: number;
  factionInfluenceDownChoiceAmount: number;
  shippingAmount: number;
  locationControlAmount: number;
  signetRingAmount: number;
  factionRecruitment: ActiveFactionType[];
}
