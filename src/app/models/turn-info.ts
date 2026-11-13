import { ImperiumDeckCard, ImperiumDeckPlot } from '../services/cards.service';
import { GameElement } from '../services/game-manager.service';
import { StructuredChoiceEffect, StructuredConversionEffect } from './effect';
import { ActiveFactionType } from './faction';
import { IntrigueDeckCard } from './intrigue';
import { ActionField } from './location';
import { TechTileCard } from './tech-tile';

export interface StructuredChoiceEffectWithGameElement extends StructuredChoiceEffect {
  exlusiveChoiceOfMultipleEffectsId?: string;
  element?: GameElement;
}

export interface StructuredConversionEffectWithGameElement extends StructuredConversionEffect {
  exlusiveChoiceOfMultipleEffectsId?: string;
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
  canRetreatUnits: boolean;
  factionRecruitment: ActiveFactionType[];
  cardsPlayedThisTurn: ImperiumDeckCard[];
  cardsBoughtThisTurn: (ImperiumDeckCard | ImperiumDeckPlot)[];
  cardsTrashedThisTurn: ImperiumDeckCard[];
  intriguesPlayedThisTurn: IntrigueDeckCard[];
  techTilesFlippedThisTurn: TechTileCard[];
  techTilesBoughtThisTurn: TechTileCard[];
  fieldsVisitedThisTurn: ActionField[];
  boardSpaceMarkersPlacedThisTurn: string[];
  aiStatus: 'ready' | 'working' | 'done';
  needsToPassTurn: boolean;
  resolvingRewardChoices: boolean;
}
