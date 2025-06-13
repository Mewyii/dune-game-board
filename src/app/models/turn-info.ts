import { ImperiumDeckCard, ImperiumDeckPlot } from '../services/cards.service';
import { GameElement } from '../services/game-manager.service';
import { ActiveFactionType } from './faction';
import { IntrigueDeckCard } from './intrigue';
import { ActionField } from './location';
import { EffectReward, StructuredChoiceEffect, StructuredConversionEffect } from './reward';
import { TechTileCard } from './tech-tile';

export interface StructuredChoiceEffectWithGameElement extends StructuredChoiceEffect {
  element?: GameElement;
}

export interface StructuredConversionEffectWithGameElement extends StructuredConversionEffect {
  element?: GameElement;
}

export interface TurnInfo {
  playerId: number;
  agentPlacedOnFieldId: string;
  canBuyTech: boolean;
  canEnterCombat: boolean;
  troopsGained: number;
  dreadnoughtsGained: number;
  deployableUnits: number;
  deployableTroops: number;
  deployableDreadnoughts: number;
  deployedUnits: number;
  deployedTroops: number;
  deployedDreadnoughts: number;
  retreatableTroops: number;
  retreatableDreadnoughts: number;
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
  cardReturnToHandAmount: number;
  intrigueTrashAmount: number;
  intriguesPlayedThisTurn: IntrigueDeckCard[];
  techTilesFlippedThisTurn: TechTileCard[];
  techTilesBoughtThisTurn: TechTileCard[];
  fieldsVisitedThisTurn: ActionField[];
  isDoingAIActions: boolean;
  effectChoices: StructuredChoiceEffectWithGameElement[];
  effectConversions: StructuredConversionEffectWithGameElement[];
  enemiesEffects: EffectReward[];
}
