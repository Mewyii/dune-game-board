import { Injectable } from '@angular/core';
import { clamp, cloneDeep, shuffle, take } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import {
  getEnemyCombatStrengthPotentialAgainstPlayer,
  getPlayerCombatStrength,
  getPlayerCombatStrengthPotentialAgainstEnemy,
  getPlayerGarrisonStrength,
  getResourceAmount,
} from 'src/app/helpers/ai';
import { hasCustomAgentEffect, hasCustomRevealEffect } from 'src/app/helpers/cards';
import { getCardCostModifier } from 'src/app/helpers/game-modifiers';
import { getRewardArrayAIInfos, isStructuredConversionEffect } from 'src/app/helpers/rewards';
import {
  ActionField,
  ActiveFactionType,
  activeFactionTypes,
  DuneLocation,
  EffectReward,
  EffectRewardType,
  StructuredConversionEffect,
} from 'src/app/models';
import { AIPersonality, GameState } from 'src/app/models/ai';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { Player } from 'src/app/models/player';
import { aiPersonalities } from '../../constants/ai';
import { getNumberAverage, normalizeNumber } from '../../helpers/common';
import { ImperiumDeckCard, ImperiumRowCard, ImperiumRowPlot } from '../cards.service';
import { PlayerCombatUnits } from '../combat-manager.service';
import { ImperiumRowModifier } from '../game-modifier.service';
import { PlayerFactionScoreType, PlayerScore } from '../player-score-manager.service';
import { SettingsService } from '../settings.service';
import { TechTileDeckCard } from '../tech-tiles.service';
import { AIEffectEvaluationService } from './ai.effect-evaluation.service';
import { AIFieldEvaluationService, ViableField } from './ai.field-evaluation.service';

export interface AIPlayer {
  playerId: number;
  name: string;
  personality: AIPersonality;
  preferredFields: ViableField[];
  canAccessBlockedFields?: boolean;
  gameStateEvaluations: { conflictEvaluation?: number; techEvaluation?: number; imperiumRowEvaluation?: number };
}

export type AIVariableValues = 'good' | 'okay' | 'bad';

export type AIDIfficultyTypes = 'easy' | 'medium' | 'hard';

@Injectable({
  providedIn: 'root',
})
export class AIManager {
  private aiPlayersSubject = new BehaviorSubject<AIPlayer[]>([]);
  public aiPlayers$ = this.aiPlayersSubject.asObservable();

  private activeAIPlayerIdSubject = new BehaviorSubject<number>(0);
  public activeAIPlayerId$ = this.activeAIPlayerIdSubject.asObservable();

  private aiDifficultySubject = new BehaviorSubject<AIDIfficultyTypes>('medium');
  public aiDifficulty$ = this.aiDifficultySubject.asObservable();

  constructor(
    private settingsService: SettingsService,
    private effectEvaluationService: AIEffectEvaluationService,
    private fieldEvaluationService: AIFieldEvaluationService
  ) {
    const aiPlayersString = localStorage.getItem('aiPlayers');
    if (aiPlayersString) {
      const aiPlayers = JSON.parse(aiPlayersString) as AIPlayer[];
      this.aiPlayersSubject.next(aiPlayers);
    }

    this.aiPlayers$.subscribe((aiPlayers) => {
      localStorage.setItem('aiPlayers', JSON.stringify(aiPlayers));
    });

    const activeAIPlayerIdString = localStorage.getItem('activeAIPlayerId');
    if (activeAIPlayerIdString) {
      const activeAIPlayerId = JSON.parse(activeAIPlayerIdString) as number;
      this.activeAIPlayerIdSubject.next(activeAIPlayerId);
    }

    this.activeAIPlayerId$.subscribe((activeAIPlayerId) => {
      localStorage.setItem('activeAIPlayerId', JSON.stringify(activeAIPlayerId));
    });

    const aiDifficultyString = localStorage.getItem('aiDifficulty');
    if (aiDifficultyString) {
      const aiDifficulty = JSON.parse(aiDifficultyString) as AIDIfficultyTypes;
      this.aiDifficultySubject.next(aiDifficulty);
    }

    this.aiDifficulty$.subscribe((aiDifficulty) => {
      localStorage.setItem('aiDifficulty', JSON.stringify(aiDifficulty));
    });
  }

  public get aiPlayers() {
    return cloneDeep(this.aiPlayersSubject.value);
  }

  public get aiDifficulty() {
    return cloneDeep(this.aiDifficultySubject.value);
  }

  public getAIPlayer(playerId: number) {
    return this.aiPlayers.find((x) => x.playerId === playerId);
  }

  public get activeAIPlayerId() {
    return cloneDeep(this.activeAIPlayerIdSubject.value);
  }

  public setAIPlayers(players: Player[]) {
    const aiPlayers: AIPlayer[] = [];
    for (const player of players) {
      if (player.isAI) {
        let name = this.getRandomAIName();
        let personality = (aiPersonalities as any)[name];

        if (aiPlayers.some((x) => x.personality === personality)) {
          name = this.getRandomAIName();
          personality = (aiPersonalities as any)[name];
        }
        aiPlayers.push({ playerId: player.id, name, personality, preferredFields: [], gameStateEvaluations: {} });
      }
    }

    this.aiPlayersSubject.next(aiPlayers);
  }

  public addAIPlayer(playerId: number) {
    const aiPlayers = this.aiPlayers;
    if (!aiPlayers.some((x) => x.playerId === playerId)) {
      let name = this.getRandomAIName();
      let personality = (aiPersonalities as any)[name];

      if (aiPlayers.some((x) => x.personality === personality)) {
        name = this.getRandomAIName();
        personality = (aiPersonalities as any)[name];
      }
      this.aiPlayersSubject.next([
        ...aiPlayers,
        { playerId: playerId, name, personality, preferredFields: [], gameStateEvaluations: {} },
      ]);
    }
  }
  public removeAIPlayer(playerId: number) {
    const aiPlayers = this.aiPlayers;
    this.aiPlayersSubject.next(aiPlayers.filter((x) => x.playerId !== playerId));
  }

  public setAIPersonalityToPlayer(playerId: number, personalityName: string, personality: AIPersonality) {
    const aiPlayers = this.aiPlayers;

    const aiPlayer = aiPlayers.find((x) => x.playerId === playerId);
    if (aiPlayer) {
      aiPlayer.name = personalityName;
      aiPlayer.personality = personality;
    }

    this.aiPlayersSubject.next(aiPlayers);
  }

  public setAccessToBlockedFieldsForPlayer(playerId: number, canAccessBlockedFields: boolean) {
    const aiPlayers = this.aiPlayers;

    const aiPlayer = aiPlayers.find((x) => x.playerId === playerId);
    if (aiPlayer) {
      aiPlayer.canAccessBlockedFields = canAccessBlockedFields;
    }

    this.aiPlayersSubject.next(aiPlayers);
  }

  public setactiveAIPlayerId(id: number) {
    this.activeAIPlayerIdSubject.next(id);
  }

  public setAIDifficulty(value: AIDIfficultyTypes) {
    this.aiDifficultySubject.next(value);
  }

  public getPreferredFieldForPlayer(playerId: number) {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === playerId);
    if (!aiPlayer) {
      return undefined;
    }

    const preferredField = aiPlayer.preferredFields[0];
    if (!preferredField) {
      return undefined;
    }

    const fields = this.settingsService.boardFields;
    return fields.find((x) => preferredField.fieldId.includes(x.title.en));
  }

  public getFieldDecision(playerId: number, fieldId: string): string {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === playerId);
    if (!aiPlayer) {
      return '';
    }

    const targetFields = aiPlayer.preferredFields.filter((x) => x.fieldId.includes(fieldId));
    if (targetFields[0]) {
      const regex = /\((.*)\)/; // Matches anything within parentheses
      const match = targetFields[0].fieldId.match(regex);
      return match && match[1] ? match[1] : '';
    }
    return '';
  }

  public setPreferredFieldsForAIPlayer(player: Player, gameState: GameState) {
    const aiPlayers = this.aiPlayers;
    const aiPlayer = aiPlayers.find((x) => x.playerId === player.id);

    const playerLeader = gameState.playerLeader;

    if (!aiPlayer || !gameState.playerHandCards) {
      return;
    }

    const conflictEvaluation = this.effectEvaluationService.getNormalizedRewardArrayEvaluation(
      gameState.conflict.rewards[0],
      player,
      gameState,
      30
    );
    const techEvaluation = clamp(
      normalizeNumber(
        Math.max(...gameState.availableTechTiles.map((x) => this.getTechTileBuyEvaluation(x, player, gameState))),
        15,
        0
      ),
      0,
      1
    );

    const evaluatedImperiumRowCards = (
      gameState.imperiumRowCards.filter((x) => x.type === 'imperium-card') as ImperiumRowCard[]
    ).map((x) => this.getImperiumCardBuyEvaluation(x, player, gameState));
    evaluatedImperiumRowCards.sort((a, b) => b - a);
    const topThreeImperiumRowCardEvaluations = take(evaluatedImperiumRowCards, 3);
    const imperiumRowEvaluation = clamp(normalizeNumber(getNumberAverage(topThreeImperiumRowCardEvaluations), 20, 4), 0, 1);

    const { preferredFields } = this.fieldEvaluationService.getPreferredFieldsForAIPlayer(
      player,
      gameState,
      playerLeader,
      aiPlayer,
      conflictEvaluation,
      techEvaluation,
      imperiumRowEvaluation,
      this.aiDifficulty
    );

    aiPlayer.preferredFields = preferredFields;
    aiPlayer.gameStateEvaluations = { conflictEvaluation, techEvaluation, imperiumRowEvaluation };

    this.aiPlayersSubject.next(aiPlayers);
  }

  public getFieldDrawOrDestroyDecision(playerId: number, fieldId: string): 'draw' | 'destroy' {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === playerId);
    if (!aiPlayer) {
      return 'draw';
    }

    const targetFields = aiPlayer.preferredFields.filter((x) => x.fieldId.includes(fieldId));
    if (targetFields[0] && targetFields[0].fieldId.toLocaleLowerCase().includes('destroy')) {
      return 'destroy';
    }

    return 'draw';
  }

  public getUpgradedreadnoughtOrTechDecision(playerId: number): 'dreadnought' | 'tech' {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === playerId);
    if (!aiPlayer) {
      return 'tech';
    }

    const targetFields = aiPlayer.preferredFields.filter((x) => x.fieldId.includes('upgrade'));
    if (targetFields[0] && targetFields[0].fieldId.toLocaleLowerCase().includes('dreadnought')) {
      return 'dreadnought';
    }

    return 'tech';
  }

  public getDesiredSpiceToSell(player: Player, spiceToSolariFunction: (spice: number) => number, maxAmount: number) {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === player.id);
    if (!aiPlayer) {
      return 0;
    }

    const playerSpiceAmount = player.resources.find((x) => x.type === 'spice')?.amount;
    if (!playerSpiceAmount) {
      return 0;
    }

    const desiredSolariAmount = player.hasSwordmaster ? 9 : 10;
    const playerSolariAmount = player.resources.find((x) => x.type === 'solari')?.amount ?? 0;

    for (let spiceCount = 1; spiceCount <= playerSpiceAmount; spiceCount++) {
      if (playerSolariAmount + spiceToSolariFunction(spiceCount) > desiredSolariAmount || spiceCount >= maxAmount) {
        return spiceCount;
      }
    }

    return playerSpiceAmount;
  }

  public getAddAdditionalUnitsToCombatDecision(
    playerCombatUnits: PlayerCombatUnits,
    gameState: GameState
  ): 'none' | 'minimum' | 'all' | number {
    if (!playerCombatUnits || !gameState.enemyCombatUnits) {
      return 'none';
    }

    const playerCombatStrength = getPlayerCombatStrength(playerCombatUnits, gameState);
    const playerGarrisonStrength = getPlayerGarrisonStrength(playerCombatUnits, gameState);

    const enemyCombatScores = gameState.enemyCombatUnits.map((x) => ({
      ...x,
      combatStrength: getPlayerCombatStrength(x, gameState),
    }));
    enemyCombatScores.sort((a, b) => b.combatStrength - a.combatStrength);
    const highestEnemyCombatScore = enemyCombatScores[0];

    const combatPowerDifference = playerCombatStrength - highestEnemyCombatScore.combatStrength;

    if (combatPowerDifference > 0) {
      const enemyAgentsAvailable =
        gameState.enemyAgentsAvailable.find((x) => x.playerId === highestEnemyCombatScore.playerId)?.agentAmount ?? 0;
      const enemyIntrigueCount =
        gameState.enemyIntrigueCounts.find((x) => x.playerId === highestEnemyCombatScore.playerId)?.intrigueCount ?? 0;

      const enemyCombatStrengthPotentialAgainstPlayer = getEnemyCombatStrengthPotentialAgainstPlayer(
        playerCombatUnits,
        highestEnemyCombatScore,
        enemyAgentsAvailable,
        enemyIntrigueCount,
        gameState
      );

      if (enemyCombatStrengthPotentialAgainstPlayer < 1) {
        return 'none';
      } else if (
        enemyCombatStrengthPotentialAgainstPlayer >= 1 &&
        playerGarrisonStrength > enemyCombatStrengthPotentialAgainstPlayer
      ) {
        return enemyCombatStrengthPotentialAgainstPlayer;
      } else {
        return 'all';
      }
    } else {
      const playerCombatStrengthPotentialAgainstEnemy = getPlayerCombatStrengthPotentialAgainstEnemy(
        playerCombatUnits,
        gameState.playerAgentsAvailable + 1,
        gameState.playerIntrigueCount,
        highestEnemyCombatScore,
        gameState
      );

      const enemyGarrisonStrength = getPlayerGarrisonStrength(highestEnemyCombatScore, gameState);

      if (playerCombatStrengthPotentialAgainstEnemy < 1) {
        if (enemyCombatScores.filter((x) => x.combatStrength > 0).length < 3 || playerCombatUnits.troopsInGarrison > 4) {
          return 'minimum';
        } else {
          return 'none';
        }
      } else if (
        playerCombatStrengthPotentialAgainstEnemy >= 1 &&
        playerCombatStrengthPotentialAgainstEnemy > enemyGarrisonStrength
      ) {
        return playerCombatStrengthPotentialAgainstEnemy + Math.abs(combatPowerDifference);
      } else {
        return 'all';
      }
    }
  }

  getPreferredLocationForPlayer(player: Player, controllableLocations: DuneLocation[], gameState: GameState) {
    let preferredLocation = undefined;
    let preferredLocationValue = 0;

    for (const location of controllableLocations) {
      if (location.actionField.ownerReward) {
        const locationValue =
          (location.actionField.ownerReward.amount ?? 1) *
          this.effectEvaluationService.getRewardEffectEvaluation(location.actionField.ownerReward.type, player, gameState);
        if (locationValue > preferredLocationValue) {
          preferredLocation = location;
          preferredLocationValue = locationValue;
        }
      }
    }

    return preferredLocation;
  }

  getCardToPlay(playerHandCards: ImperiumDeckCard[], player: Player, gameState: GameState, preferredField?: ActionField) {
    let usableCards = playerHandCards;
    if (preferredField) {
      usableCards = usableCards.filter((x) => x.fieldAccess?.some((accessType) => accessType === preferredField.actionType));
    }

    if (usableCards.length > 0) {
      const cardEvaluations = usableCards.map((card) => {
        const evaluation = this.getImperiumCardPlayEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  getCardAndFieldToPlay(playerHandCards: ImperiumDeckCard[], player: Player, gameState: GameState) {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === player.id);
    if (!aiPlayer) {
      return undefined;
    }

    const preferredFields = aiPlayer.preferredFields;

    const cardEvaluations = playerHandCards.map((card) => ({
      card,
      evaluationValue: this.getImperiumCardPlayEvaluation(card, player, gameState),
    }));
    const cardAndFieldEvaluations: { field: ViableField; evaluation: number; card: ImperiumDeckCard }[] = [];
    for (const [fieldIndex, preferredField] of preferredFields.entries()) {
      const usableCards = cardEvaluations.filter(
        (cardEvaluation) =>
          (preferredField.requiresInfiltration ? cardEvaluation.card.canInfiltrate : true) &&
          cardEvaluation.card.fieldAccess?.some((x) => x === preferredField.actionType)
      );

      if (usableCards.length > 0) {
        const evaluations = usableCards.map((cardEvaluation) => {
          const evaluation = cardEvaluation.evaluationValue - fieldIndex - fieldIndex * (1 - preferredField.value) * 3;
          return { field: preferredField, evaluation, card: cardEvaluation.card };
        });

        cardAndFieldEvaluations.push(...evaluations);
      }
    }

    if (cardAndFieldEvaluations.length > 0) {
      cardAndFieldEvaluations.sort((a, b) => b.evaluation - a.evaluation);

      return { cardToPlay: cardAndFieldEvaluations[0].card, preferredField: cardAndFieldEvaluations[0].field };
    }
    return undefined;
  }

  getImperiumCardToBuy(
    availablePersuasion: number,
    cards: ImperiumDeckCard[],
    player: Player,
    gameState: GameState,
    imperiumRowModifiers?: ImperiumRowModifier[]
  ) {
    const buyableCards = cards.filter(
      (x) => (x.persuasionCosts ?? 0) + getCardCostModifier(x, imperiumRowModifiers) <= availablePersuasion
    );
    if (buyableCards.length > 0) {
      const cardEvaluations = buyableCards.map((card) => {
        const evaluation = this.getImperiumCardBuyEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  getPlotToBuy(
    availablePersuasion: number,
    cards: ImperiumRowPlot[],
    player: Player,
    imperiumRowModifiers?: ImperiumRowModifier[]
  ) {
    const buyableCards = cards.filter(
      (x) => (x.persuasionCosts ?? 0) + getCardCostModifier(x, imperiumRowModifiers) <= availablePersuasion
    );
    if (buyableCards.length > 0) {
      return shuffle(buyableCards)[0];
    }
    return undefined;
  }

  getCardToDiscard(playerHandCards: ImperiumDeckCard[], player: Player, gameState: GameState) {
    if (playerHandCards.length > 0) {
      const cardEvaluations = playerHandCards.map((card) => {
        const evaluation = this.getImperiumCardTrashEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  getCardToTrash(cards: ImperiumDeckCard[], player: Player, gameState: GameState) {
    if (cards.length > 0) {
      const cardEvaluations = cards.map((card) => {
        const evaluation = this.getImperiumCardTrashEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  getIntrigueToTrash(playerIntrigueCards: IntrigueDeckCard[], player: Player, gameState: GameState) {
    if (playerIntrigueCards.length > 0) {
      const cardEvaluations = playerIntrigueCards.map((card) => {
        const evaluation = this.getIntrigueCardTrashEvaluation(card, player, gameState);
        return { evaluation, card };
      });
      cardEvaluations.sort((a, b) => b.evaluation - a.evaluation);
      return cardEvaluations[0].card;
    }
    return undefined;
  }

  private getRandomAIName() {
    const randomIndex = Math.floor(Math.random() * Object.keys(aiPersonalities).length);
    return Object.keys(aiPersonalities)[randomIndex];
  }

  private getMaxAddableCombatPower(playerCombatUnits: PlayerCombatUnits, maxAddableUnits: number) {
    let addableUnits = maxAddableUnits;
    let combatPower = 0;

    addableUnits -= playerCombatUnits.shipsInGarrison;
    combatPower += playerCombatUnits.shipsInGarrison * this.settingsService.getDreadnoughtStrength();

    if (addableUnits > 0) {
      if (addableUnits < playerCombatUnits.troopsInGarrison) {
        combatPower += addableUnits * this.settingsService.getTroopStrength();
      } else {
        combatPower += playerCombatUnits.troopsInGarrison * this.settingsService.getTroopStrength();
      }
    }
    return combatPower;
  }

  getMostDesiredFactionScoreType(
    playerId: number,
    playerScores: PlayerScore[],
    influenceGainAmount: number,
    exclusions?: PlayerFactionScoreType[]
  ): PlayerFactionScoreType | undefined {
    const playerScore = playerScores.find((x) => x.playerId === playerId);
    if (!playerScore) {
      return;
    }

    const enemyScores = playerScores.filter((x) => x.playerId !== playerId);
    const factionAllianceTreshold = this.settingsService.getFactionInfluenceAllianceTreshold();
    const maxFactionInfluence = this.settingsService.getFactionInfluenceMaxScore();

    const factionDesires = {
      emperor: 0,
      guild: 0,
      bene: 0,
      fremen: 0,
    };

    for (const factionType of activeFactionTypes) {
      if (!exclusions?.includes(factionType)) {
        const playerFactionScore = playerScore[factionType];
        if (playerFactionScore < maxFactionInfluence) {
          factionDesires[factionType] += 1;

          if (playerFactionScore >= factionAllianceTreshold) {
            if (
              enemyScores.some(
                (x) =>
                  x[factionType] > playerFactionScore &&
                  x[factionType] < maxFactionInfluence &&
                  playerFactionScore + influenceGainAmount === x[factionType]
              )
            ) {
              factionDesires[factionType] += 5;
            }
            if (
              enemyScores.some(
                (x) =>
                  x[factionType] >= playerFactionScore &&
                  x[factionType] < maxFactionInfluence &&
                  playerFactionScore + influenceGainAmount > x[factionType]
              )
            ) {
              factionDesires[factionType] += 10;
            }
          } else if (playerFactionScore < factionAllianceTreshold) {
            factionDesires[factionType] += 1 + playerFactionScore + influenceGainAmount;

            if (enemyScores.some((x) => x[factionType] >= factionAllianceTreshold)) {
              factionDesires[factionType] -= 1;
            }
            if (playerFactionScore + influenceGainAmount > factionAllianceTreshold) {
              factionDesires[factionType] += 5;
            }
          }
        }
      }
    }

    let mostDesiredFaction: PlayerFactionScoreType | undefined = undefined;
    let highestFactionValue = -1;
    for (const [faction, value] of Object.entries(factionDesires)) {
      if (value > highestFactionValue || (value === highestFactionValue && Math.random() > 0.66)) {
        highestFactionValue = value;
        mostDesiredFaction = faction as ActiveFactionType;
      }
    }

    return mostDesiredFaction;
  }

  getLeastDesiredFactionScoreType(
    playerScores: PlayerScore,
    exclusions?: PlayerFactionScoreType[]
  ): PlayerFactionScoreType | undefined {
    let desiredFactionScoreType: PlayerFactionScoreType | undefined;
    let desiredFactionScoreAmount = 100;

    for (const factionType of activeFactionTypes) {
      if (!exclusions?.includes(factionType)) {
        if (playerScores[factionType] < desiredFactionScoreAmount && playerScores[factionType] > 0) {
          desiredFactionScoreType = factionType;
          desiredFactionScoreAmount = playerScores[factionType];
        }
      }
    }

    return desiredFactionScoreType;
  }

  getChoiceEffectDecision(
    player: Player,
    gameState: GameState,
    leftSideEffect: StructuredConversionEffect | EffectReward[],
    rightSideEffect: StructuredConversionEffect | EffectReward[]
  ) {
    let leftSideEvaluation = 0;
    let rightSideEvaluation = 0;

    if (isStructuredConversionEffect(leftSideEffect)) {
      leftSideEvaluation = this.getEffectConversionValue(player, gameState, leftSideEffect.costs, leftSideEffect.rewards);
    } else {
      leftSideEvaluation = this.effectEvaluationService.getRewardArrayEvaluationForTurnState(
        leftSideEffect,
        player,
        gameState
      );
    }
    if (isStructuredConversionEffect(rightSideEffect)) {
      rightSideEvaluation = this.getEffectConversionValue(player, gameState, rightSideEffect.costs, rightSideEffect.rewards);
    } else {
      rightSideEvaluation = this.effectEvaluationService.getRewardArrayEvaluationForTurnState(
        rightSideEffect,
        player,
        gameState
      );
    }

    if (leftSideEvaluation >= rightSideEvaluation) {
      return leftSideEffect;
    } else {
      return rightSideEffect;
    }
  }

  getEffectConversionDecision(player: Player, gameState: GameState, costs: EffectReward[], rewards: EffectReward[]) {
    const costsEvaluation = this.effectEvaluationService.getCostsArrayEvaluationForTurnState(costs, player, gameState);
    return (
      this.effectEvaluationService.getRewardArrayEvaluationForTurnState(rewards, player, gameState) - costsEvaluation > 0
    );
  }

  getEffectConversionValue(player: Player, gameState: GameState, costs: EffectReward[], rewards: EffectReward[]) {
    const costsEvaluation = this.effectEvaluationService.getCostsArrayEvaluationForTurnState(costs, player, gameState);
    return this.effectEvaluationService.getRewardArrayEvaluationForTurnState(rewards, player, gameState) - costsEvaluation;
  }

  getEffectTypesDecision(player: Player, gameState: GameState, rewardTypes: EffectRewardType[]) {
    let decision: EffectRewardType | undefined = undefined;
    let evaluationValue = 0;
    for (const rewardType of rewardTypes) {
      const value = this.effectEvaluationService.getRewardEffectEvaluationForTurnState(rewardType, player, gameState);
      if (value > evaluationValue) {
        evaluationValue = value;
        decision = rewardType;
      }
    }

    return decision;
  }

  private getImperiumCardPlayEvaluation(card: ImperiumDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;
    if (card.faction) {
      evaluationValue +=
        1 * gameState.playerHandCardsConnectionEffects[card.faction] +
        0.1 * gameState.playerCardsConnectionEffects[card.faction] +
        0.33 * gameState.playerHandCardsFactions[card.faction] +
        0.1 * gameState.playerCardsFactions[card.faction];
    }
    if (card.fieldAccess) {
      evaluationValue -= card.fieldAccess.length * 0.1;
    }
    if (card.canInfiltrate) {
      const totalAgents = gameState.playerAgentsOnFields.length + gameState.playerAgentsAvailable;
      const agentsPlaced = gameState.playerAgentsOnFields.length;
      evaluationValue += 4 * (agentsPlaced / (totalAgents - 1)) - 3;
    }
    if (card.structuredAgentEffects) {
      evaluationValue += this.effectEvaluationService.getStructuredEffectsEvaluationForTurnState(
        card.structuredAgentEffects,
        player,
        gameState
      );
    }
    if (hasCustomAgentEffect(card)) {
      let evaluationEstimation = 0.5;
      if (card.structuredAgentEffects) {
        evaluationEstimation = 0.33;
      }
      evaluationValue += 1 + evaluationEstimation * (card.persuasionCosts ?? 0);
    }

    if (card.structuredRevealEffects) {
      const revealEffects = card.structuredRevealEffects;
      if (revealEffects.rewards) {
        evaluationValue -=
          this.effectEvaluationService.getRewardArrayEvaluationForTurnState(revealEffects.rewards, player, gameState) * 0.75;
      }
      for (const choiceEffect of revealEffects.choiceEffects) {
        evaluationValue -=
          this.effectEvaluationService.getChoiceEffectEvaluationForTurnState(choiceEffect, player, gameState) * 0.75;
      }
      for (const conditionEffect of revealEffects.conditionalEffects) {
        evaluationValue -=
          this.effectEvaluationService.getConditionEffectEvaluation(conditionEffect, player, gameState) * 0.75;
      }
    }
    if (hasCustomRevealEffect(card)) {
      let evaluationEstimation = 0.5;
      if (card.structuredRevealEffects) {
        evaluationEstimation = 0.33;
      }
      evaluationValue += 2 + evaluationEstimation * (card.persuasionCosts ?? 0);
    }

    return evaluationValue;
  }

  private getImperiumCardBuyEvaluation(card: ImperiumDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;
    if (card.faction) {
      evaluationValue +=
        1 * gameState.playerCardsConnectionEffects[card.faction] +
        0.5 * gameState.playerCardsFactions[card.faction] +
        0.5 * gameState.playerTechTilesFactions[card.faction];
    }
    if (card.persuasionCosts) {
      evaluationValue += card.persuasionCosts * 0.1;
    }
    if (card.buyEffects) {
      const { hasRewardChoice: hasRewardOptions, hasRewardConversion } = getRewardArrayAIInfos(card.buyEffects);
      if (!hasRewardOptions && !hasRewardConversion) {
        evaluationValue +=
          this.effectEvaluationService.getRewardArrayEvaluation(card.buyEffects, player, gameState) * 0.75 +
          0.05 * (gameState.currentRound - 1);
      }
    }
    if (card.fieldAccess) {
      for (const access of card.fieldAccess) {
        evaluationValue += gameState.playerCardsFieldAccessCounts[access] < 2 ? 2 : 0.5;
      }
    }
    if (card.canInfiltrate) {
      evaluationValue += 0.5 * (card.fieldAccess?.length ?? 0);
    }

    if (card.structuredAgentEffects) {
      evaluationValue += this.effectEvaluationService.getStructuredEffectsEvaluation(
        card.structuredAgentEffects,
        player,
        gameState
      );
    }
    if (hasCustomAgentEffect(card)) {
      let evaluationEstimation = 0.5;
      if (card.structuredAgentEffects) {
        evaluationEstimation = 0.33;
      }
      evaluationValue += 1 + evaluationEstimation * (card.persuasionCosts ?? 0);
    }

    if (card.structuredRevealEffects) {
      evaluationValue += this.effectEvaluationService.getStructuredEffectsEvaluation(
        card.structuredRevealEffects,
        player,
        gameState
      );
    }
    if (hasCustomRevealEffect(card)) {
      let evaluationEstimation = 0.5;
      if (card.structuredRevealEffects) {
        evaluationEstimation = 0.33;
      }
      evaluationValue += 2 + evaluationEstimation * (card.persuasionCosts ?? 0);
    }

    return evaluationValue;
  }

  private getImperiumCardTrashEvaluation(card: ImperiumDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;
    if (card.faction) {
      evaluationValue -=
        0.75 * gameState.playerCardsConnectionEffects[card.faction] +
        0.25 * gameState.playerCardsFactions[card.faction] +
        0.25 * gameState.playerTechTilesFactions[card.faction];
    }
    if (card.persuasionCosts) {
      evaluationValue -= card.persuasionCosts * 0.1;
    }
    if (card.fieldAccess) {
      for (const access of card.fieldAccess) {
        evaluationValue -= gameState.playerCardsFieldAccessCounts[access] < 2 ? 1.5 : 0.75;
      }
    }
    if (card.canInfiltrate) {
      evaluationValue -= 0.5 * (card.fieldAccess?.length ?? 0);
    }

    if (card.structuredAgentEffects) {
      evaluationValue -= this.effectEvaluationService.getStructuredEffectsEvaluation(
        card.structuredAgentEffects,
        player,
        gameState
      );
    }
    if (hasCustomAgentEffect(card)) {
      let evaluationEstimation = 0.5;
      if (card.structuredAgentEffects) {
        evaluationEstimation = 0.33;
      }
      evaluationValue -= 1 + evaluationEstimation * (card.persuasionCosts ?? 0);
    }

    if (card.structuredRevealEffects) {
      evaluationValue -= this.effectEvaluationService.getStructuredEffectsEvaluation(
        card.structuredRevealEffects,
        player,
        gameState
      );
    }
    if (hasCustomRevealEffect(card)) {
      let evaluationEstimation = 0.5;
      if (card.structuredRevealEffects) {
        evaluationEstimation = 0.33;
      }
      evaluationValue -= 2 + evaluationEstimation * (card.persuasionCosts ?? 0);
    }

    return evaluationValue;
  }

  private getIntrigueCardTrashEvaluation(card: IntrigueDeckCard, player: Player, gameState: GameState) {
    let evaluationValue = 0;

    if (card.structuredEffects) {
      evaluationValue -= this.effectEvaluationService.getStructuredEffectsEvaluation(
        card.structuredEffects,
        player,
        gameState
      );
    }

    return evaluationValue;
  }

  public getTechTileBuyEvaluation(techTile: TechTileDeckCard, player: Player, gameState: GameState) {
    const techCostEvaluation =
      this.effectEvaluationService.getRewardEffectEvaluation('tech', player, gameState) * techTile.costs;
    const playerTechAmount = getResourceAmount(player, 'tech');

    let evaluationValue = -techCostEvaluation + playerTechAmount * 0.75;

    if (techTile.buyEffects) {
      const { hasRewardChoice: hasRewardOptions, hasRewardConversion } = getRewardArrayAIInfos(techTile.buyEffects);
      if (!hasRewardOptions && !hasRewardConversion) {
        evaluationValue += this.effectEvaluationService.getRewardArrayEvaluation(techTile.buyEffects, player, gameState);
      }
    }
    if (techTile.structuredEffects) {
      const differentTechTileActivations = techTile.effects?.filter((x) => x.type === 'tech-tile-flip').length ?? 0;
      const value = this.effectEvaluationService.getStructuredEffectsEvaluation(
        techTile.structuredEffects,
        player,
        gameState
      );
      evaluationValue +=
        (value / (differentTechTileActivations > 0 ? differentTechTileActivations : 1)) *
        ((10 - gameState.currentRound) / 1.66);
    }
    if (techTile.customEffect?.en) {
      if (techTile.aiEvaluation) {
        evaluationValue += techTile.aiEvaluation(player, gameState);
      } else {
        evaluationValue += 0.25 * techTile.costs;
      }
    }

    return evaluationValue;
  }

  public getIntrigueEvaluation(intrigue: IntrigueDeckCard, player: Player, gameState: GameState) {
    const intrigueEffects = intrigue.structuredEffects;

    if (intrigueEffects) {
      let isUseful =
        this.effectEvaluationService.getRewardArrayEvaluationForTurnState(intrigueEffects.rewards, player, gameState) > 0;
      let intrigueCosts: EffectReward[][] = [];
      for (const choiceEffect of intrigueEffects.conversionEffects) {
        const costs = choiceEffect.costs;
        const rewards = choiceEffect.rewards;
        if (rewards.some((x) => x.type === 'location-control')) {
          if (gameState.freeLocations.length < 1) {
            costs.push({ type: 'troop', amount: this.settingsService.getLocationTakeoverTroopCosts() });
          }
        }

        const conversionIsUseful = this.getEffectConversionDecision(player, gameState, costs, rewards);

        if (conversionIsUseful) {
          isUseful = true;
          intrigueCosts.push(costs);
        }
      }

      return { isUseful, costs: intrigueCosts };
    }
    return { isUseful: false, costs: [] };
  }

  private getPlayerCombatPower(player: PlayerCombatUnits) {
    return (
      player.troopsInCombat * this.settingsService.getTroopStrength() +
      player.shipsInCombat * this.settingsService.getDreadnoughtStrength()
    );
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
