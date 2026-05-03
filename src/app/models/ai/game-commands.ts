import { MatDialog } from '@angular/material/dialog';
import { CardAcquiringPlacementType } from 'src/app/constants/board-settings';
import { SoundType } from 'src/app/services/audio-manager.service';
import { ImperiumDeckCard, ImperiumRowCard, ImperiumRowPlot } from 'src/app/services/cards.service';
import { GameElement } from 'src/app/services/game-manager.service';
import { GameModifiers, ImperiumRowModifier } from 'src/app/services/game-modifier.service';
import { TechTileDeckCard } from 'src/app/services/tech-tiles.service';
import { TranslateService } from 'src/app/services/translate-service';
import { EffectReward, StructuredEffect } from '../effect';
import { IntrigueDeckCard } from '../intrigue';
import { ActionType } from '../location';
import { Player } from '../player';
import { EffectPlayerTurnTiming } from '../reward';
import { TurnInfo } from '../turn-info';
import { GameState } from './game-state';

export interface GameCommands {
  // Cards
  acquireImperiumCard: (
    playerId: number,
    card: ImperiumRowCard | ImperiumDeckCard | ImperiumRowPlot,
    source: 'deck' | 'row' | 'always-buyable',
    options?: { additionalCostModifier?: number; acquireLocation: CardAcquiringPlacementType },
  ) => void;
  getAllBuyableCards: (factionRecruitment?: ('emperor' | 'guild' | 'bene' | 'fremen')[]) => {
    imperiumRowCards: ImperiumRowCard[];
    recruitableCards: ImperiumDeckCard[];
    alwaysBuyableCards: ImperiumDeckCard[];
    allCards: ImperiumDeckCard[];
  };
  trashImperiumCard: (playerId: number, card: ImperiumDeckCard, source: 'hand' | 'discard-pile') => void;
  returnDiscardedPlayerCardToHand: (playerId: number, card: ImperiumDeckCard) => void;

  // Intrigues
  addPlayerIntrigue: (playerId: number, intrigue: IntrigueDeckCard) => void;
  trashPlayerIntrigue: (playerId: number, intrigueId: string, addToDiscardPile?: boolean) => void;

  // Tech Tiles
  trashPlayerTechTile: (playerId: number, techTile: TechTileDeckCard) => void;

  // Locations
  setLocationOwner: (locationId: string, playerId: number) => void;

  // Agents
  setPlayerAgentInTimeout: (playerId: number, fieldId: string) => void;

  // Effects
  addRewardToPlayer: (
    playerId: number,
    reward: EffectReward,
    additionalInfos?: { gameElement?: GameElement; source?: string; valuesCanBeNegative?: boolean },
  ) => void;
  payCostForPlayer: (
    playerId: number,
    cost: EffectReward,
    additionalInfos?: { gameElement?: GameElement; source?: string },
  ) => void;
  resolveRewardChoices: (player: Player) => void;
  resolveStructuredEffect: (
    structuredEffect: StructuredEffect,
    player: Player,
    gameState: GameState,
    gameElement?: GameElement,
    timing?: EffectPlayerTurnTiming,
  ) => void;
  resolveStructuredEffects: (
    structuredEffects: StructuredEffect[],
    player: Player,
    gameState: GameState,
    gameElement?: GameElement,
    timing?: EffectPlayerTurnTiming,
  ) => void;
  increaseAccumulatedSpiceOnBoardSpace: (boardSpaceId: string) => void;
  removePersuasionFromPlayer: (playerId: number, amount: number) => void;
  updatePlayerTurnInfo: (playerId: number, turnInfo: Partial<TurnInfo>) => void;

  // Game Modifiers
  addPlayerGameModifiers: (playerId: number, gameModifiers: GameModifiers) => void;
  addPlayerImperiumRowModifier: (playerId: number, content: Omit<ImperiumRowModifier, 'id'>) => void;
  changeFieldMarkerModifier: (playerId: number, fieldId: string, changeAmount?: number) => void;
  removeGameModifier: (playerId: number, modifierType: keyof GameModifiers, modifierId: string) => void;

  // Combat
  removePlayerShipsFromCombat: (playerId: number, amount: number) => void;
  retreatPlayerTroopsFromCombat: (playerId: number, troops: number) => void;
  getPlayableCombatIntrigues: (
    player: Player,
    gameState: GameState,
    playerCombatIntrigues: IntrigueDeckCard[],
  ) => {
    playableIntriguesWithSwords: {
      intrigue: IntrigueDeckCard;
      addedScore: number;
    }[];
    playableIntriguesWithoutSwords: {
      intrigue: IntrigueDeckCard;
      subtractedScore: number;
    }[];
  };

  // Settings
  getBoardSpaceColor: (actionType: ActionType) => string | undefined;

  // Logging
  logPlayerGainedLocationControl: (playerId: number, roundNumber: number, locationId: string) => void;

  // Audio
  playSound: (sound: SoundType, chorusAmount?: number) => void;

  // AI
  ai: {
    getImperiumCardToBuy<T extends ImperiumDeckCard>(
      availablePersuasion: number,
      cards: T[],
      player: Player,
      gameState: GameState,
      imperiumRowModifiers?: ImperiumRowModifier[],
    ): T | undefined;
    getDesiredRewardEffects(
      player: Player,
      rewards: EffectReward[],
      gameState: GameState,
      maxEffects?: number,
    ): EffectReward[];
    getStructuredEffectUsefulnesAndCosts(
      structuredEffects: StructuredEffect[],
      player: Player,
      gameState: GameState,
    ): {
      isUseful: boolean;
      usefullness: number;
      costs: EffectReward[];
    };
  };

  // Dialog
  dialog: MatDialog;
  translation: TranslateService;
}
