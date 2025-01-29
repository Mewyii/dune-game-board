import { ImperiumDeckCard } from '../services/cards.service';
import { ActiveFactionType } from './faction';
import { IntrigueDeckCard } from './intrigue';
import { ActionField } from './location';
import { TechTileCard } from './tech-tile';

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
  cardsBoughtThisTurn: ImperiumDeckCard[];
  cardsTrashedThisTurn: ImperiumDeckCard[];
  intriguesPlayedThisTurn: IntrigueDeckCard[];
  techTilesBoughtThisTurn: TechTileCard[];
  fieldsVisitedThisTurn: ActionField[];
  isDoingAIActions: boolean;
}
