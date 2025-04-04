import { ImperiumDeckCard, ImperiumDeckPlot } from '../services/cards.service';
import { ActiveFactionType } from './faction';
import { IntrigueDeckCard } from './intrigue';
import { ActionField } from './location';
import { TechTileCard } from './tech-tile';

export interface TurnInfo {
  playerId: number;
  agentPlacedOnFieldId: string;
  canBuyTech: boolean;
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
  cardsPlayedThisTurn: ImperiumDeckCard[];
  cardsBoughtThisTurn: (ImperiumDeckCard | ImperiumDeckPlot)[];
  cardsTrashedThisTurn: ImperiumDeckCard[];
  intriguesPlayedThisTurn: IntrigueDeckCard[];
  techTilesFlippedThisTurn: TechTileCard[];
  techTilesBoughtThisTurn: TechTileCard[];
  fieldsVisitedThisTurn: ActionField[];
  isDoingAIActions: boolean;
}
