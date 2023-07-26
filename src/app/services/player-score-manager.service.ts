import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Player, PlayerManager } from './player-manager.service';
import { SettingsService } from './settings.service';
import { ActionType } from '../models';
import { CombatManager } from './combat-manager.service';

export interface PlayerScore {
  playerId: number;
  victoryPoints: number;
  fremen: number;
  bene: number;
  guild: number;
  imperium: number;
}

export type PlayerScoreType = keyof Omit<PlayerScore, 'playerId'>;

@Injectable({
  providedIn: 'root',
})
export class PlayerScoreManager {
  public factionConnectionTreshold = 2;
  public factionAllianceTreshold = 4;

  private playersScoresSubject = new BehaviorSubject<PlayerScore[]>([]);
  public playersScores$ = this.playersScoresSubject.asObservable();

  constructor(
    public playerManager: PlayerManager,
    public combatManager: CombatManager,
    public settingsService: SettingsService
  ) {
    const playersScoresString = localStorage.getItem('playersScores');
    if (playersScoresString) {
      const playersScores = JSON.parse(playersScoresString) as PlayerScore[];
      this.playersScoresSubject.next(playersScores);
    }

    this.playersScores$.subscribe((playersScores) => {
      localStorage.setItem('playersScores', JSON.stringify(playersScores));
    });
  }

  public get playersScores() {
    return cloneDeep(this.playersScoresSubject.value);
  }

  public getPlayerScore(playerId: number) {
    return this.playersScores.find((x) => x.playerId === playerId);
  }

  public getEnemyScore(playerId: number) {
    return this.playersScores.filter((x) => x.playerId !== playerId);
  }

  public resetPlayersScores(players: Player[]) {
    const playerScores: PlayerScore[] = [];
    for (let player of players) {
      playerScores.push({
        playerId: player.id,
        victoryPoints: 0,
        fremen: 0,
        bene: 0,
        guild: 0,
        imperium: 0,
      });
    }

    this.playersScoresSubject.next(playerScores);
  }

  public addFactionScore(playerId: number, actionType: ActionType, score: number) {
    const playerScores = this.playersScores;
    const playerScoreIndex = playerScores.findIndex((x) => x.playerId === playerId);
    const playerScore = playerScores[playerScoreIndex];
    if (playerScore) {
      if (actionType === 'fremen' || actionType === 'bene' || actionType === 'guild' || actionType === 'imperium') {
        const newScore = playerScore[actionType] + score;

        playerScores[playerScoreIndex] = {
          ...playerScore,
          [actionType]: newScore,
        };

        this.playersScoresSubject.next(playerScores);

        if (newScore === this.factionConnectionTreshold) {
          const faction = this.settingsService.factions.find((x) => x.type === actionType);
          if (faction && faction.levelTwoReward) {
            for (let reward of faction.levelTwoReward) {
              if (reward.type === 'currency' || reward.type === 'spice' || reward.type === 'water') {
                this.playerManager.addResourceToPlayer(playerId, reward.type, reward.amount ?? 1);
              }
              if (reward.type === 'troops') {
                this.combatManager.addPlayerTroopsToGarrison(playerId, reward.amount ?? 1);
              }
              if (reward.type === 'victory-point') {
                this.addPlayerScore(playerId, 'victoryPoints', reward.amount ?? 1);
              }
            }
          }
        }

        if (newScore === this.factionAllianceTreshold) {
          const faction = this.settingsService.factions.find((x) => x.type === actionType);
          if (faction && faction.levelFourReward) {
            for (let reward of faction.levelFourReward) {
              if (reward.type === 'currency' || reward.type === 'spice' || reward.type === 'water') {
                this.playerManager.addResourceToPlayer(playerId, reward.type, reward.amount ?? 1);
              }
              if (reward.type === 'victory-point') {
                this.addPlayerScore(playerId, 'victoryPoints', reward.amount ?? 1);
              }
            }
          }
        }
      }
    }
  }

  public addPlayerScore(playerId: number, scoreType: PlayerScoreType, amount: number) {
    const playerScores = this.playersScores;
    const playerScoreIndex = playerScores.findIndex((x) => x.playerId === playerId);
    const playerScore = playerScores[playerScoreIndex];
    if (playerScore) {
      playerScores[playerScoreIndex] = {
        ...playerScore,
        [scoreType]: playerScore[scoreType] + amount,
      };

      this.playersScoresSubject.next(playerScores);
    }
  }

  public removePlayerScore(playerId: number, scoreType: PlayerScoreType, amount: number) {
    const playerScores = this.playersScores;
    const playerScoreIndex = playerScores.findIndex((x) => x.playerId === playerId);
    const playerScore = playerScores[playerScoreIndex];
    if (playerScore) {
      playerScores[playerScoreIndex] = {
        ...playerScore,
        [scoreType]: playerScore[scoreType] - amount,
      };

      this.playersScoresSubject.next(playerScores);
    }
  }

  public addFactionConnectionScore(playerId: number, faction: ActionType, score: number) {
    const playerScores = this.playersScores;
    const playerScoreIndex = playerScores.findIndex((x) => x.playerId === playerId);
    const playerScore = playerScores[playerScoreIndex];
    if (playerScore) {
      if (faction === 'fremen') {
        playerScores[playerScoreIndex] = {
          ...playerScore,
          fremen: playerScore.fremen + score,
        };
      }
      if (faction === 'bene') {
        playerScores[playerScoreIndex] = {
          ...playerScore,
          bene: playerScore.bene + score,
        };
      }
      if (faction === 'guild') {
        playerScores[playerScoreIndex] = {
          ...playerScore,
          guild: playerScore.guild + score,
        };
      }
      if (faction === 'imperium') {
        playerScores[playerScoreIndex] = {
          ...playerScore,
          imperium: playerScore.imperium + score,
        };
      }

      this.playersScoresSubject.next(playerScores);
    }
  }
}
