import { ImperiumDeckCard, ImperiumDeckPlot } from '../services/cards.service';
import { GameElement } from '../services/game-manager.service';
import { ActiveFactionType } from './faction';
import { IntrigueDeckCard } from './intrigue';
import { ActionField } from './location';
import { StructuredChoiceEffect } from './reward';
import { TechTileCard } from './tech-tile';

export interface StructuredChoiceEffectWithGameElement extends StructuredChoiceEffect {
  element?: GameElement;
}
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
  cardDiscardAmount: number;
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
  intrigueTrashAmount: number;
  intriguesPlayedThisTurn: IntrigueDeckCard[];
  techTilesFlippedThisTurn: TechTileCard[];
  techTilesBoughtThisTurn: TechTileCard[];
  fieldsVisitedThisTurn: ActionField[];
  isDoingAIActions: boolean;
  effectOptions: StructuredChoiceEffectWithGameElement[];
  effectConversions: StructuredChoiceEffectWithGameElement[];
}
