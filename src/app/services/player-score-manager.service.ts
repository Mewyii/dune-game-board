import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { ActionType, EffectReward, FactionType } from '../models';
import { Player } from '../models/player';
import { CombatManager } from './combat-manager.service';
import { LoggingService } from './log.service';
import { PlayersService } from './players.service';
import { SettingsService } from './settings.service';

export interface PlayerScore {
  playerId: number;
  victoryPoints: number;
  fremen: number;
  bene: number;
  guild: number;
  emperor: number;
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
  private playerScoresSubject = new BehaviorSubject<PlayerScore[]>([]);
  public playerScores$ = this.playerScoresSubject.asObservable();

  private playerAlliancesSubject = new BehaviorSubject<PlayerAlliances[]>([]);
  public playerAlliances$ = this.playerAlliancesSubject.asObservable();

  constructor(
    private playerManager: PlayersService,
    private combatManager: CombatManager,
    private settingsService: SettingsService,
    private loggingService: LoggingService
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
        emperor: 0,
      });
    }

    this.playerScoresSubject.next(playerScores);
  }

  public resetPlayerAlliances() {
    this.playerAlliancesSubject.next([]);
  }

  public addFactionScore(playerId: number, actionType: ActionType, score: number, roundNumber: number) {
    let factionRewards: EffectReward[] = [];
    const playerScores = this.playerScores;
    const playerScoreIndex = playerScores.findIndex((x) => x.playerId === playerId);
    const playerScore = playerScores[playerScoreIndex];

    if (playerScore) {
      if (actionType === 'fremen' || actionType === 'bene' || actionType === 'guild' || actionType === 'emperor') {
        const maxFactionScore = this.settingsService.getFactionInfluenceMaxScore();
        let newScore = playerScore[actionType] + score;

        if (playerScore[actionType] + score > maxFactionScore) {
          newScore = maxFactionScore;
        }

        playerScores[playerScoreIndex] = {
          ...playerScore,
          [actionType]: newScore,
        };

        this.playerScoresSubject.next(playerScores);

        const factionInfluenceRewards = this.settingsService.factionInfluenceRewards.find(
          (x) => x.factionId === actionType
        )?.rewards;
        if (factionInfluenceRewards) {
          const factionScoreRewards = factionInfluenceRewards[newScore];
          if (factionScoreRewards) {
            factionRewards = factionScoreRewards;
          }
        }

        if (newScore >= this.settingsService.getFactionInfluenceAllianceTreshold()) {
          this.adjustAlliancesBasedOnFactionScore(playerId, actionType, newScore, roundNumber);
        }
      }
    }

    return factionRewards;
  }

  public addPlayerScore(playerId: number, scoreType: PlayerScoreType, amount: number, roundNumber: number) {
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
        const vpReward = this.settingsService.getVictoryPointsBoni()?.find((x) => x.score === newPlayerScore)?.reward;

        if (vpReward) {
          if (vpReward.type === 'solari' || vpReward.type === 'spice' || vpReward.type === 'water') {
            this.playerManager.addResourceToPlayer(playerId, vpReward.type, vpReward.amount ?? 1);
          }
          if (vpReward.type === 'troop') {
            this.combatManager.addPlayerTroopsToGarrison(playerId, vpReward.amount ?? 1);
          }
          if (vpReward.type === 'persuasion') {
            this.playerManager.addPermanentPersuasionToPlayer(playerId, vpReward.amount ?? 1);
          }
        }
      }

      this.playerScoresSubject.next(playerScores);

      if (scoreType === 'fremen' || scoreType === 'bene' || scoreType === 'guild' || scoreType === 'emperor') {
        if (newPlayerScore >= this.settingsService.getFactionInfluenceAllianceTreshold()) {
          this.adjustAlliancesBasedOnFactionScore(playerId, scoreType, newPlayerScore, roundNumber);
        }
      }
    }
  }

  public removePlayerScore(playerId: number, scoreType: PlayerScoreType, amount: number, roundNumber: number) {
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

      if (scoreType === 'fremen' || scoreType === 'bene' || scoreType === 'guild' || scoreType === 'emperor') {
        if (newPlayerScore >= this.settingsService.getFactionInfluenceAllianceTreshold()) {
          this.adjustAlliancesBasedOnFactionScore(playerId, scoreType, newPlayerScore, roundNumber);
        }
      }

      if (scoreType === 'victoryPoints') {
        const vpReward = this.settingsService
          .getVictoryPointsBoni()
          ?.find((x) => x.score === playerScore[scoreType])?.reward;

        if (vpReward) {
          if (vpReward.type === 'persuasion') {
            this.playerManager.removePermanentPersuasionFromPlayer(playerId, vpReward.amount ?? 1);
          }
        }
      }
    }
  }

  public addAllianceToPlayer(playerId: number, factionType: PlayerFactionScoreType, roundNumber: number) {
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

    this.addPlayerScore(playerId, 'victoryPoints', 1, roundNumber);
    this.loggingService.logPlayerGainedVictoryPoint(playerId, roundNumber, 'Alliance');
  }

  public removeAllianceFromPlayer(playerId: number, factionType: PlayerFactionScoreType, roundNumber: number) {
    const playerAlliances = this.playerAlliances;
    const playerIndex = this.playerAlliances.findIndex((x) => x.playerId === playerId);
    if (playerIndex > -1) {
      playerAlliances[playerIndex] = {
        ...playerAlliances[playerIndex],
        alliances: playerAlliances[playerIndex].alliances.filter((x) => x !== factionType),
      };

      this.playerAlliancesSubject.next(playerAlliances);

      this.removePlayerScore(playerId, 'victoryPoints', 1, roundNumber);
      this.loggingService.logPlayerLostVictoryPoint(playerId, roundNumber, 'Alliance');
    }
  }

  public adjustAlliancesBasedOnFactionScore(
    playerId: number,
    factionType: PlayerFactionScoreType,
    score: number,
    roundNumber: number
  ) {
    const playerWithAlliance = this.playerAlliances.find((x) =>
      x.alliances.some((allianceType) => allianceType === factionType)
    );
    if (playerWithAlliance) {
      if (playerWithAlliance.playerId !== playerId) {
        const enemyPlayerScores = this.playerScores.find((x) => x.playerId === playerWithAlliance.playerId);
        if (enemyPlayerScores) {
          const enemyFactionScore = enemyPlayerScores[factionType];
          if (score > enemyFactionScore) {
            this.removeAllianceFromPlayer(playerWithAlliance.playerId, factionType, roundNumber);
            this.addAllianceToPlayer(playerId, factionType, roundNumber);
          }
        }
      }
    } else {
      this.addAllianceToPlayer(playerId, factionType, roundNumber);
    }
  }
}
