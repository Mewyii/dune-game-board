import { inject, Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { AIPersonality } from 'src/app/models/ai';
import { Player } from 'src/app/models/player';
import { aiPersonalities } from '../../constants/ai';
import { ViableField } from './ai.field-evaluation.service';
import { GameStatePersistenceService } from '../persistence/game-state-persistence.service';

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
export class AIPlayersService {
  private gameStatePersistenceService = inject(GameStatePersistenceService);

  private aiPlayersSubject = new BehaviorSubject<AIPlayer[]>([]);
  aiPlayers$ = this.aiPlayersSubject.asObservable();

  private activeAIPlayerIdSubject = new BehaviorSubject<number>(0);
  activeAIPlayerId$ = this.activeAIPlayerIdSubject.asObservable();

  private aiDifficultySubject = new BehaviorSubject<AIDIfficultyTypes>('medium');
  aiDifficulty$ = this.aiDifficultySubject.asObservable();

  constructor() {
    this.gameStatePersistenceService.bindSubjectToStorage('aiPlayers', this.aiPlayersSubject, { scope: 'game' });

    this.gameStatePersistenceService.bindSubjectToStorage('activeAIPlayerId', this.activeAIPlayerIdSubject, {
      scope: 'game',
    });

    this.gameStatePersistenceService.bindSubjectToStorage('aiDifficulty', this.aiDifficultySubject, { scope: 'game' });
  }

  get aiPlayers() {
    return cloneDeep(this.aiPlayersSubject.value);
  }

  get aiDifficulty() {
    return cloneDeep(this.aiDifficultySubject.value);
  }

  getAIPlayer(playerId: number) {
    return cloneDeep(this.aiPlayers.find((x) => x.playerId === playerId));
  }

  get activeAIPlayerId() {
    return cloneDeep(this.activeAIPlayerIdSubject.value);
  }

  setAIPlayers(players: Player[]) {
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

  addAIPlayer(playerId: number) {
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
  removeAIPlayer(playerId: number) {
    const aiPlayers = this.aiPlayers;
    this.aiPlayersSubject.next(aiPlayers.filter((x) => x.playerId !== playerId));
  }

  setAIPersonalityToPlayer(playerId: number, personalityName: string, personality: AIPersonality) {
    const aiPlayers = this.aiPlayers;

    const aiPlayer = aiPlayers.find((x) => x.playerId === playerId);
    if (aiPlayer) {
      aiPlayer.name = personalityName;
      aiPlayer.personality = personality;
    }

    this.aiPlayersSubject.next(aiPlayers);
  }

  setAccessToBlockedFieldsForPlayer(playerId: number, canAccessBlockedFields: boolean) {
    const aiPlayers = this.aiPlayers;

    const aiPlayer = aiPlayers.find((x) => x.playerId === playerId);
    if (aiPlayer) {
      aiPlayer.canAccessBlockedFields = canAccessBlockedFields;
    }

    this.aiPlayersSubject.next(aiPlayers);
  }

  setActiveAIPlayerId(id: number) {
    this.activeAIPlayerIdSubject.next(id);
  }

  setAIDifficulty(value: AIDIfficultyTypes) {
    this.aiDifficultySubject.next(value);
  }

  setPreferredFieldsForAIPlayer(
    player: Player,
    preferredFields: ViableField[],
    gameStateEvaluations: { conflictEvaluation?: number; techEvaluation?: number; imperiumRowEvaluation?: number },
  ) {
    if (!player.isAI) {
      return;
    }

    const aiPlayers = this.aiPlayers;
    const aiPlayer = aiPlayers.find((x) => x.playerId === player.id);
    if (!aiPlayer) {
      return;
    }

    aiPlayer.preferredFields = preferredFields;
    aiPlayer.gameStateEvaluations = gameStateEvaluations;

    this.aiPlayersSubject.next(aiPlayers);
  }

  private getRandomAIName() {
    const randomIndex = Math.floor(Math.random() * Object.keys(aiPersonalities).length);
    return Object.keys(aiPersonalities)[randomIndex];
  }
}
