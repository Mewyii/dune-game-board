import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Player } from '../player-manager.service';
import { randomizeArray } from '../../helpers/common';
import { GameState, AIGoals, AIPersonality, FieldsForGoals } from './models';
import { aiPersonalities } from './constants';
import { SettingsService } from '../settings.service';
import { PlayerCombatUnits } from '../combat-manager.service';
import { ActiveFactionType } from 'src/app/models';
import { getDesire } from './shared/ai-goal-functions';

export interface AIPlayer {
  playerId: number;
  name: string;
  personality: AIPersonality;
  preferredFields: ViableField[];
  decisions: string[];
  canAccessBlockedFields?: boolean;
}

export type AIVariableValues = 'good' | 'okay' | 'bad';

export type AIDIfficultyTypes = 'easy' | 'medium' | 'hard';
export interface AIVariables {
  imperiumRow: AIVariableValues;
}

interface ViableField {
  fieldId: string;
  value: number;
}

interface FieldLock {
  fieldId: string;
  lock: FactionInfluenceLock;
}

interface FactionInfluenceLock {
  type: ActiveFactionType;
  amount: number;
}

@Injectable({
  providedIn: 'root',
})
export class AIManager {
  private aiVariablesSubject = new BehaviorSubject<AIVariables>({ imperiumRow: 'okay' });
  public aiVariables$ = this.aiVariablesSubject.asObservable();

  private aiPlayersSubject = new BehaviorSubject<AIPlayer[]>([]);
  public aiPlayers$ = this.aiPlayersSubject.asObservable();

  private currentAIPlayerIdSubject = new BehaviorSubject<number>(0);
  public currentAIPlayerId$ = this.currentAIPlayerIdSubject.asObservable();

  private aiDifficultySubject = new BehaviorSubject<AIDIfficultyTypes>('medium');
  public aiDifficulty$ = this.aiDifficultySubject.asObservable();

  public aiGoals: FieldsForGoals | undefined;

  constructor(public settingsService: SettingsService) {
    const aiPlayersString = localStorage.getItem('aiPlayers');
    if (aiPlayersString) {
      const aiPlayers = JSON.parse(aiPlayersString) as AIPlayer[];
      this.aiPlayersSubject.next(aiPlayers);
    }

    this.aiPlayers$.subscribe((aiPlayers) => {
      localStorage.setItem('aiPlayers', JSON.stringify(aiPlayers));
    });

    const aiVariablesString = localStorage.getItem('aiVariables');
    if (aiVariablesString) {
      const aiVariables = JSON.parse(aiVariablesString) as AIVariables;
      this.aiVariablesSubject.next(aiVariables);
    }

    this.aiVariables$.subscribe((aiVariables) => {
      localStorage.setItem('aiVariables', JSON.stringify(aiVariables));
    });

    const currentAIPlayerIdString = localStorage.getItem('currentAIPlayerId');
    if (currentAIPlayerIdString) {
      const currentAIPlayerId = JSON.parse(currentAIPlayerIdString) as number;
      this.currentAIPlayerIdSubject.next(currentAIPlayerId);
    }

    this.currentAIPlayerId$.subscribe((currentAIPlayerId) => {
      localStorage.setItem('currentAIPlayerId', JSON.stringify(currentAIPlayerId));
    });

    const aiDifficultyString = localStorage.getItem('aiDifficulty');
    if (aiDifficultyString) {
      const aiDifficulty = JSON.parse(aiDifficultyString) as AIDIfficultyTypes;
      this.aiDifficultySubject.next(aiDifficulty);
    }

    this.aiDifficulty$.subscribe((aiDifficulty) => {
      localStorage.setItem('aiDifficulty', JSON.stringify(aiDifficulty));
    });

    this.settingsService.settings$.subscribe((x) => {
      this.aiGoals = x.gameContent.aiGoals;
    });
  }

  public get aiPlayers() {
    return cloneDeep(this.aiPlayersSubject.value);
  }

  public get aiVariables() {
    return cloneDeep(this.aiVariablesSubject.value);
  }

  public get aiDifficulty() {
    return cloneDeep(this.aiDifficultySubject.value);
  }

  public getAIPlayer(playerId: number) {
    return this.aiPlayers.find((x) => x.playerId === playerId);
  }

  public get currentAIPlayerId() {
    return cloneDeep(this.currentAIPlayerIdSubject.value);
  }

  public assignPersonalitiesToAIPlayers(players: Player[]) {
    const aiPlayers: AIPlayer[] = [];
    for (const player of players) {
      if (player.isAI) {
        let name = this.getRandomAIName();
        let personality = (aiPersonalities as any)[name];

        if (aiPlayers.some((x) => x.personality === personality)) {
          name = this.getRandomAIName();
          personality = (aiPersonalities as any)[name];
        }
        aiPlayers.push({ playerId: player.id, name, personality, preferredFields: [], decisions: [] });
      }
    }

    this.aiPlayersSubject.next(aiPlayers);
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

  public setCurrentAIPlayerId(id: number) {
    this.currentAIPlayerIdSubject.next(id);
  }

  public setAIVariable(type: keyof AIVariables, value: AIVariableValues) {
    const aiVariables = this.aiVariables;

    aiVariables[type] = value;

    this.aiVariablesSubject.next(aiVariables);
  }

  public setAIDifficulty(value: AIDIfficultyTypes) {
    this.aiDifficultySubject.next(value);
  }

  public setPreferredFieldsForAIPlayer(player: Player, gameState: GameState) {
    const aiPlayers = this.aiPlayers;
    const aiPlayer = aiPlayers.find((x) => x.playerId === player.id);

    if (!aiPlayer || !this.aiGoals) {
      return;
    }

    const viableFields: ViableField[] = [];
    const decisions: string[] = [];

    const virtualResources = gameState.playerLeader.aiFieldAccessModifier?.resources ?? [];

    const conflictEvaluation = gameState.conflict.aiEvaluation(player, gameState);
    const techEvaluation = Math.max(...gameState.availableTechTiles.map((x) => x.aiEvaluation(player, gameState)));
    const imperiumRowEvaluation = this.getImperiumRowEvaluation();

    for (let [goalId, goal] of Object.entries(this.aiGoals)) {
      if (!goal.reachedGoal(player, gameState, this.aiGoals, virtualResources)) {
        const aiGoalId = goalId as AIGoals;

        const desireModifier = goal.desireModifier(player, gameState, this.aiGoals, virtualResources);
        if (typeof desireModifier !== 'number') {
          decisions.push(desireModifier.name);
        }

        const goalDesire =
          getDesire(goal, player, gameState, virtualResources, this.aiGoals) *
          (aiPlayer.personality[aiGoalId] ?? 1.0) *
          this.getGameStateModifier(aiGoalId, conflictEvaluation, techEvaluation, imperiumRowEvaluation);
        let desireCanBeFullfilled = false;

        if (goal.goalIsReachable(player, gameState, this.aiGoals, virtualResources) && goal.desiredFields) {
          for (let [fieldId, getFieldValue] of Object.entries(goal.desiredFields)) {
            const fieldValue = getFieldValue(player, gameState, this.aiGoals, virtualResources) * goalDesire;

            if (fieldValue > 0) {
              const index = viableFields.findIndex((x) => x.fieldId === fieldId);
              if (index > -1) {
                viableFields[index].value = Math.round((viableFields[index].value + fieldValue) * 100) / 100;
              } else {
                viableFields.push({ fieldId, value: Math.round(fieldValue * 100) / 100 });
              }

              desireCanBeFullfilled = true;
            }
          }
        }

        if (!desireCanBeFullfilled) {
          for (let [fieldId, getFieldValue] of Object.entries(goal.viableFields)) {
            const fieldValue = getFieldValue(player, gameState, this.aiGoals, virtualResources) * goalDesire;

            if (fieldValue > 0) {
              const index = viableFields.findIndex((x) => x.fieldId === fieldId);
              if (index > -1) {
                viableFields[index].value = Math.round((viableFields[index].value + fieldValue) * 100) / 100;
              } else {
                viableFields.push({ fieldId, value: Math.round(fieldValue * 100) / 100 });
              }
            }
          }
        }
      }
    }

    const blockedFields = gameState.agentsOnFields
      .map((x) => x.fieldId)
      .filter((fieldId) => !this.settingsService.unblockableFields.some((field) => field.title.en === fieldId));

    const conditionalFields: FieldLock[] = [
      {
        fieldId: 'Sietch Tabr',
        lock: {
          type: 'fremen',
          amount: 2,
        },
      },
    ];

    const lockedFields = this.getLockedFields(player, gameState, conditionalFields);

    const possibleFields = aiPlayer.canAccessBlockedFields
      ? viableFields
      : viableFields.filter(
          (viableField) =>
            !lockedFields.includes(viableField.fieldId) &&
            !blockedFields.some((fieldId) => viableField.fieldId.includes(fieldId))
        );

    possibleFields.sort((a, b) => b.value - a.value);

    const randomFactor = gameState.isOpeningTurn
      ? 0.66
      : this.aiDifficulty === 'hard'
      ? 0.1
      : this.aiDifficulty === 'medium'
      ? 0.2
      : 0.3;
    const slightlyRandomizedFields = randomizeArray(possibleFields, randomFactor);

    aiPlayer.preferredFields = slightlyRandomizedFields;
    aiPlayer.decisions = decisions;

    this.aiPlayersSubject.next(aiPlayers);
  }

  getLockedFields(player: Player, gameState: GameState, conditionalFields: FieldLock[]) {
    const unlockedFields = gameState.playerLeader.aiFieldAccessModifier?.directFieldAccess ?? [];
    return conditionalFields
      .filter((x) => !unlockedFields.includes(x.fieldId) && !this.hasFieldAccess(player, gameState, x.lock))
      .map((x) => x.fieldId);
  }

  private hasFieldAccess(player: Player, gameState: GameState, lock: FactionInfluenceLock) {
    return gameState.playerScore[lock.type] >= lock.amount;
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

    const fields = this.settingsService.fields;
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

  public getFieldDrawOrTrimDecision(playerId: number, fieldId: string): 'draw' | 'trim' {
    const aiPlayer = this.aiPlayers.find((x) => x.playerId === playerId);
    if (!aiPlayer) {
      return 'draw';
    }

    const targetFields = aiPlayer.preferredFields.filter((x) => x.fieldId.includes(fieldId));
    if (targetFields[0] && targetFields[0].fieldId.toLocaleLowerCase().includes('trim')) {
      return 'trim';
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
    playerCombatUnits?: PlayerCombatUnits,
    enemyCombatUnits?: PlayerCombatUnits[]
  ) {
    if (!playerCombatUnits || !enemyCombatUnits) {
      return 'none';
    }

    const playerCombatPower = getPlayerCombatPower(playerCombatUnits);

    const enemyCombatPowers = enemyCombatUnits.map((x) => getPlayerCombatPower(x));
    const highestEnemyCombatPower = Math.max(...enemyCombatPowers);

    if (playerCombatPower <= highestEnemyCombatPower) {
      return 'all';
    } else {
      const maxCombatPowerDifference = 10;
      const combatPowerDifference = playerCombatPower - highestEnemyCombatPower;

      if (combatPowerDifference > maxCombatPowerDifference) {
        return 'none';
      }

      const randomNumber = getRandomInt(maxCombatPowerDifference);
      if (randomNumber - combatPowerDifference <= 0) {
        return 'minimum';
      } else if (randomNumber - combatPowerDifference <= 5) {
        return 'all';
      }
    }

    return 'none';
  }

  private getImperiumRowEvaluation() {
    if (this.aiVariables.imperiumRow === 'good') {
      return 1.2;
    } else if (this.aiVariables.imperiumRow === 'bad') {
      return 0.8;
    }
    return 1.0;
  }

  private getGameStateModifier(
    goal: AIGoals,
    conflictEvaluation: number,
    techEvaluation: number,
    imperiumRowEvaluation: number
  ) {
    let modifier = 1.0;

    if (goal === 'enter-combat' || goal === 'troops' || goal === 'dreadnought') {
      modifier = 0.5 + conflictEvaluation;
    } else if (goal === 'tech' || goal === 'harvest-accumulated-spice-basin') {
      modifier = 0.5 + techEvaluation;
    } else if (goal === 'draw-cards' || goal === 'get-board-persuasion' || goal === 'high-council') {
      modifier = imperiumRowEvaluation;
    }

    return modifier;
  }

  private getRandomAIName() {
    const randomIndex = Math.floor(Math.random() * Object.keys(aiPersonalities).length);
    return Object.keys(aiPersonalities)[randomIndex];
  }
}

function getPlayerCombatPower(player: PlayerCombatUnits) {
  return player.troopsInCombat * 2 + player.shipsInCombat * 3;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
