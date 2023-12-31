import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Player, PlayerManager } from './player-manager.service';
import { SettingsService } from './settings.service';
import { ActionType, FactionType, Reward } from '../models';
import { CombatManager } from './combat-manager.service';

export interface PlayerScore {
  playerId: number;
  victoryPoints: number;
  fremen: number;
  bene: number;
  guild: number;
  imperium: number;
}

export interface PlayerAlliances {
  playerId: number;
  alliances: FactionType[];
}

export type PlayerScoreType = keyof Omit<PlayerScore, 'playerId'>;

export type PlayerFactionScoreType = keyof Omit<PlayerScore, 'playerId' | 'victoryPoints'>;

@Injectable({
  providedIn: 'root',
})
export class PlayerScoreManager {
  public maxScore = 14;
  public finaleTrigger = 9;

  public scoreRewards: { score: number; reward: Reward }[] = [];

  public factionFriendshipTreshold = 2;
  public factionAllianceTreshold = 4;

  private playerScoresSubject = new BehaviorSubject<PlayerScore[]>([]);
  public playerScores$ = this.playerScoresSubject.asObservable();

  private playerAlliancesSubject = new BehaviorSubject<PlayerAlliances[]>([]);
  public playerAlliances$ = this.playerAlliancesSubject.asObservable();

  constructor(
    public playerManager: PlayerManager,
    public combatManager: CombatManager,
    public settingsService: SettingsService
  ) {
    const playersScoresString = localStorage.getItem('playersScores');
    if (playersScoresString) {
      const playersScores = JSON.parse(playersScoresString) as PlayerScore[];
      this.playerScoresSubject.next(playersScores);
    }

    this.playerScores$.subscribe((playersScores) => {
      localStorage.setItem('playersScores', JSON.stringify(playersScores));
    });

    const playerAlliancesString = localStorage.getItem('playerAlliances');
    if (playerAlliancesString) {
      const playerAlliances = JSON.parse(playerAlliancesString) as PlayerAlliances[];
      this.playerAlliancesSubject.next(playerAlliances);
    }

    this.playerAlliances$.subscribe((playerAlliances) => {
      localStorage.setItem('playerAlliances', JSON.stringify(playerAlliances));
    });

    this.scoreRewards = [...new Array(this.maxScore)].map((x, i) => ({ score: i, reward: { type: 'troops' } }));
    this.scoreRewards.shift();

    if (this.settingsService.board.content === 'custom-advanced') {
      this.finaleTrigger = 8;

      this.scoreRewards[0].reward = { type: 'currency' };
      this.scoreRewards[2].reward = { type: 'persuasion', amount: 1 };
      this.scoreRewards[3].reward = { type: 'currency' };
      this.scoreRewards[5].reward = { type: 'card-round-start', amount: 1 };
      this.scoreRewards[6].reward = { type: 'currency' };
      this.scoreRewards[8].reward = { type: 'persuasion', amount: 1 };
      this.scoreRewards[9].reward = { type: 'currency' };
      this.scoreRewards[11].reward = { type: 'card-round-start', amount: 1 };
      this.scoreRewards[12].reward = { type: 'currency' };
    }
    if (this.settingsService.board.content === 'custom-expert') {
      this.finaleTrigger = 8;

      this.scoreRewards[0].reward = { type: 'currency' };
      this.scoreRewards[2].reward = { type: 'persuasion', amount: 1 };
      this.scoreRewards[3].reward = { type: 'currency' };
      this.scoreRewards[5].reward = { type: 'card-round-start', amount: 1 };
      this.scoreRewards[6].reward = { type: 'currency' };
      this.scoreRewards[8].reward = { type: 'persuasion', amount: 1 };
      this.scoreRewards[9].reward = { type: 'currency' };
      this.scoreRewards[11].reward = { type: 'card-round-start', amount: 1 };
      this.scoreRewards[12].reward = { type: 'currency' };
    }
  }

  public get playerScores() {
    return cloneDeep(this.playerScoresSubject.value);
  }

  public get playerAlliances() {
    return cloneDeep(this.playerAlliancesSubject.value);
  }

  public getPlayerScore(playerId: number) {
    return this.playerScores.find((x) => x.playerId === playerId);
  }

  public getEnemyScore(playerId: number) {
    return this.playerScores.filter((x) => x.playerId !== playerId);
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

    this.playerScoresSubject.next(playerScores);
  }

  public resetPlayerAlliances() {
    this.playerAlliancesSubject.next([]);
  }

  public addFactionScore(playerId: number, actionType: ActionType, score: number) {
    const playerScores = this.playerScores;
    const playerScoreIndex = playerScores.findIndex((x) => x.playerId === playerId);
    const playerScore = playerScores[playerScoreIndex];
    if (playerScore) {
      if (actionType === 'fremen' || actionType === 'bene' || actionType === 'guild' || actionType === 'imperium') {
        const newScore = playerScore[actionType] + score;

        playerScores[playerScoreIndex] = {
          ...playerScore,
          [actionType]: newScore,
        };

        this.playerScoresSubject.next(playerScores);

        if (newScore === this.factionFriendshipTreshold) {
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

        if (newScore >= this.factionAllianceTreshold) {
          this.adjustAlliancesBasedOnFactionScore(playerId, actionType, newScore);
        }
      }
    }
  }

  public addPlayerScore(playerId: number, scoreType: PlayerScoreType, amount: number) {
    const playerScores = this.playerScores;
    const playerScoreIndex = playerScores.findIndex((x) => x.playerId === playerId);
    const playerScore = playerScores[playerScoreIndex];
    const newPlayerScore = playerScore[scoreType] + amount;
    if (playerScore) {
      playerScores[playerScoreIndex] = {
        ...playerScore,
        [scoreType]: newPlayerScore,
      };

      if (scoreType === 'victoryPoints') {
        const vpReward = this.scoreRewards.find((x) => x.score === newPlayerScore)?.reward;

        if (vpReward) {
          if (vpReward.type === 'currency' || vpReward.type === 'spice' || vpReward.type === 'water') {
            this.playerManager.addResourceToPlayer(playerId, vpReward.type, vpReward.amount ?? 1);
          }
          if (vpReward.type === 'troops') {
            this.combatManager.addPlayerTroopsToGarrison(playerId, vpReward.amount ?? 1);
          }
        }
      }

      this.playerScoresSubject.next(playerScores);

      if (scoreType === 'fremen' || scoreType === 'bene' || scoreType === 'guild' || scoreType === 'imperium') {
        if (newPlayerScore >= this.factionAllianceTreshold) {
          this.adjustAlliancesBasedOnFactionScore(playerId, scoreType, newPlayerScore);
        }
      }
    }
  }

  public removePlayerScore(playerId: number, scoreType: PlayerScoreType, amount: number) {
    const playerScores = this.playerScores;
    const playerScoreIndex = playerScores.findIndex((x) => x.playerId === playerId);
    const playerScore = playerScores[playerScoreIndex];
    const newPlayerScore = playerScore[scoreType] - amount;

    if (playerScore) {
      playerScores[playerScoreIndex] = {
        ...playerScore,
        [scoreType]: newPlayerScore,
      };

      this.playerScoresSubject.next(playerScores);

      if (scoreType === 'fremen' || scoreType === 'bene' || scoreType === 'guild' || scoreType === 'imperium') {
        if (newPlayerScore >= this.factionAllianceTreshold) {
          this.adjustAlliancesBasedOnFactionScore(playerId, scoreType, newPlayerScore);
        }
      }
    }
  }

  public addAllianceToPlayer(playerId: number, factionType: PlayerFactionScoreType) {
    const playerAlliances = this.playerAlliances;
    const playerIndex = this.playerAlliances.findIndex((x) => x.playerId === playerId);
    if (playerIndex > -1) {
      playerAlliances[playerIndex] = {
        ...playerAlliances[playerIndex],
        alliances: [...playerAlliances[playerIndex].alliances, factionType],
      };
    } else {
      playerAlliances.push({ playerId, alliances: [factionType] });
    }

    this.playerAlliancesSubject.next(playerAlliances);

    this.addPlayerScore(playerId, 'victoryPoints', 1);
  }

  public removeAllianceFromPlayer(playerId: number, factionType: PlayerFactionScoreType) {
    const playerAlliances = this.playerAlliances;
    const playerIndex = this.playerAlliances.findIndex((x) => x.playerId === playerId);
    if (playerIndex > -1) {
      playerAlliances[playerIndex] = {
        ...playerAlliances[playerIndex],
        alliances: playerAlliances[playerIndex].alliances.filter((x) => x !== factionType),
      };

      this.playerAlliancesSubject.next(playerAlliances);

      this.removePlayerScore(playerId, 'victoryPoints', 1);
    }
  }

  public adjustAlliancesBasedOnFactionScore(playerId: number, factionType: PlayerFactionScoreType, score: number) {
    const playerWithAlliance = this.playerAlliances.find((x) =>
      x.alliances.some((allianceType) => allianceType === factionType)
    );
    if (playerWithAlliance) {
      if (playerWithAlliance.playerId !== playerId) {
        const enemyPlayerScores = this.playerScores.find((x) => x.playerId === playerWithAlliance.playerId);
        if (enemyPlayerScores) {
          const enemyFactionScore = enemyPlayerScores[factionType];
          if (score > enemyFactionScore) {
            this.removeAllianceFromPlayer(playerWithAlliance.playerId, factionType);
            this.addAllianceToPlayer(playerId, factionType);
          }
        }
      }
    } else {
      this.addAllianceToPlayer(playerId, factionType);
    }
  }
}
