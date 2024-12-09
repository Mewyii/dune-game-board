import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { SettingsService } from './settings.service';
import { Player } from '../models/player';

export interface PlayerCombatUnits {
  playerId: number;
  troopsInGarrison: number;
  troopsInCombat: number;
  shipsInTimeout: number;
  shipsInGarrison: number;
  shipsInCombat: number;
  additionalCombatPower: number;
}

export interface PlayerCombatScore {
  playerId: number;
  score: number;
}

@Injectable({
  providedIn: 'root',
})
export class CombatManager {
  private playerCombatUnitsSubject = new BehaviorSubject<PlayerCombatUnits[]>([]);
  public playerCombatUnits$ = this.playerCombatUnitsSubject.asObservable();
  public playerCombatUnits: PlayerCombatUnits[] = [];

  constructor(private settingsService: SettingsService) {
    const playerCombatUnitsString = localStorage.getItem('playerCombatUnits');
    if (playerCombatUnitsString) {
      const playerCombatUnits = JSON.parse(playerCombatUnitsString) as PlayerCombatUnits[];
      this.playerCombatUnitsSubject.next(playerCombatUnits);
    }

    this.playerCombatUnits$.subscribe((playerCombatUnits) => {
      this.playerCombatUnits = cloneDeep(playerCombatUnits);
      localStorage.setItem('playerCombatUnits', JSON.stringify(playerCombatUnits));
    });
  }

  public getPlayerCombatUnits(playerId: number) {
    return this.playerCombatUnits.find((x) => x.playerId === playerId);
  }

  public getEnemyCombatUnits(playerId: number) {
    return this.playerCombatUnits.filter((x) => x.playerId !== playerId);
  }

  public setInitialPlayerCombatUnits(players: Player[]) {
    for (const player of players) {
      this.setPlayerTroopsInGarrison(player.id, 3);
      this.setPlayerShipsInGarrison(player.id, 0);
    }
  }

  public setPlayerTroopsInGarrison(playerId: number, troops: number) {
    const playerCombatUnits = this.playerCombatUnits;
    const playerCombatUnitsIndex = playerCombatUnits.findIndex((x) => x.playerId === playerId);
    if (playerCombatUnitsIndex > -1) {
      const combatUnits = playerCombatUnits[playerCombatUnitsIndex];
      playerCombatUnits[playerCombatUnitsIndex] = { ...combatUnits, troopsInGarrison: troops };
    } else {
      playerCombatUnits.push({
        playerId,
        troopsInGarrison: troops,
        troopsInCombat: 0,
        shipsInTimeout: 0,
        shipsInGarrison: 0,
        shipsInCombat: 0,
        additionalCombatPower: 0,
      });
    }

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public addPlayerTroopsToGarrison(playerId: number, troops: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (combatUnits) {
      this.setPlayerTroopsInGarrison(playerId, combatUnits.troopsInGarrison + troops);
    } else {
      this.setPlayerTroopsInGarrison(playerId, troops);
    }
  }

  public removePlayerTroopsFromGarrison(playerId: number, troops: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (combatUnits) {
      if (combatUnits.troopsInGarrison - troops >= 0) {
        this.setPlayerTroopsInGarrison(playerId, combatUnits.troopsInGarrison - troops);
      } else {
        this.setPlayerTroopsInGarrison(playerId, 0);
      }
    }
  }

  public removePlayerTroopsFromGarrisonOrCombat(playerId: number, troops: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (combatUnits) {
      if (combatUnits.troopsInGarrison - troops >= 0) {
        this.setPlayerTroopsInGarrison(playerId, combatUnits.troopsInGarrison - troops);
      } else if (combatUnits.troopsInCombat - troops >= 0) {
        this.setPlayerTroopsInCombat(playerId, combatUnits.troopsInGarrison - troops);
      }
    }
  }

  public setPlayerShipsInGarrison(playerId: number, ships: number) {
    const playerCombatUnits = this.playerCombatUnits;
    const playerCombatUnitsIndex = playerCombatUnits.findIndex((x) => x.playerId === playerId);
    if (playerCombatUnitsIndex > -1) {
      const combatUnits = playerCombatUnits[playerCombatUnitsIndex];
      playerCombatUnits[playerCombatUnitsIndex] = { ...combatUnits, shipsInGarrison: ships };
    } else {
      playerCombatUnits.push({
        playerId,
        troopsInGarrison: 0,
        troopsInCombat: 0,
        shipsInTimeout: 0,
        shipsInGarrison: ships,
        shipsInCombat: 0,
        additionalCombatPower: 0,
      });
    }

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public addPlayerShipsToGarrison(playerId: number, ships: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (combatUnits) {
      this.setPlayerShipsInGarrison(playerId, combatUnits.shipsInGarrison + ships);
    } else {
      this.setPlayerShipsInGarrison(playerId, ships);
    }
  }

  public removePlayerShipsFromGarrison(playerId: number, ships: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (combatUnits) {
      if (combatUnits.shipsInGarrison - ships >= 0) {
        this.setPlayerShipsInGarrison(playerId, combatUnits.shipsInGarrison - ships);
      } else {
        this.setPlayerShipsInGarrison(playerId, 0);
      }
    }
  }

  public setPlayerTroopsInCombat(playerId: number, troops: number) {
    const playerCombatUnits = this.playerCombatUnits;
    const playerCombatUnitsIndex = playerCombatUnits.findIndex((x) => x.playerId === playerId);
    if (playerCombatUnitsIndex > -1) {
      const combatScore = playerCombatUnits[playerCombatUnitsIndex];
      const changeOfTroopsInCombat = troops - combatScore.troopsInCombat;

      if (combatScore.troopsInGarrison - changeOfTroopsInCombat >= 0) {
        playerCombatUnits[playerCombatUnitsIndex] = {
          ...combatScore,
          troopsInCombat: troops,
          troopsInGarrison: combatScore.troopsInGarrison - changeOfTroopsInCombat,
        };
      }
    } else {
      playerCombatUnits.push({
        playerId,
        troopsInGarrison: 0,
        troopsInCombat: troops,
        shipsInTimeout: 0,
        shipsInGarrison: 0,
        shipsInCombat: 0,
        additionalCombatPower: 0,
      });
    }

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public addPlayerTroopsToCombat(playerId: number, troops: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (combatUnits) {
      this.setPlayerTroopsInCombat(playerId, combatUnits.troopsInCombat + troops);
    } else {
      this.setPlayerTroopsInCombat(playerId, troops);
    }
  }

  public removePlayerTroopsFromCombat(playerId: number, troops: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (combatUnits) {
      if (combatUnits.troopsInCombat - troops >= 0) {
        this.setPlayerTroopsInCombat(playerId, combatUnits.troopsInCombat - troops);
      } else {
        this.setPlayerTroopsInCombat(playerId, 0);
      }
    }
  }

  public addAllPossibleTroopsToCombat(playerId: number, troopsGainedThisTurn: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (!combatUnits) {
      return 0;
    }

    if (combatUnits.troopsInGarrison > 0) {
      const troopsToAdd =
        combatUnits.troopsInGarrison <= troopsGainedThisTurn ? combatUnits.troopsInGarrison : troopsGainedThisTurn;

      this.addPlayerTroopsToCombat(playerId, troopsToAdd);

      return troopsToAdd;
    } else {
      return 0;
    }
  }

  public addAllPossibleDreadnoughtsToCombat(playerId: number, dreadnoughtsGainedThisTurn: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (!combatUnits) {
      return 0;
    }
    if (combatUnits.shipsInGarrison > 0) {
      const shipsToAdd =
        combatUnits.shipsInGarrison <= dreadnoughtsGainedThisTurn ? combatUnits.shipsInGarrison : dreadnoughtsGainedThisTurn;

      this.addPlayerShipsToCombat(playerId, shipsToAdd);
      return shipsToAdd;
    } else {
      return 0;
    }
  }

  public addAllPossibleUnitsToCombat(playerId: number, deployableUnitAmount: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (!combatUnits) {
      return 0;
    }
    let addedUnits = 0;

    let unitsAllowedToEnterCombat = deployableUnitAmount;
    if (combatUnits.shipsInGarrison > 0) {
      const shipsToAdd =
        combatUnits.shipsInGarrison <= unitsAllowedToEnterCombat ? combatUnits.shipsInGarrison : unitsAllowedToEnterCombat;

      this.addPlayerShipsToCombat(playerId, shipsToAdd);
      unitsAllowedToEnterCombat -= shipsToAdd;
      addedUnits += shipsToAdd;
    }
    if (combatUnits.troopsInGarrison > 0) {
      const troopsToAdd =
        combatUnits.troopsInGarrison <= unitsAllowedToEnterCombat ? combatUnits.troopsInGarrison : unitsAllowedToEnterCombat;

      this.addPlayerTroopsToCombat(playerId, troopsToAdd);
      addedUnits += troopsToAdd;
    }
    return addedUnits;
  }

  public setPlayerShipsInCombat(playerId: number, ships: number) {
    const playerCombatUnits = this.playerCombatUnits;
    const playerCombatUnitsIndex = playerCombatUnits.findIndex((x) => x.playerId === playerId);
    if (playerCombatUnitsIndex > -1) {
      const combatScore = playerCombatUnits[playerCombatUnitsIndex];
      const changeOfShipsInCombat = ships - combatScore.shipsInCombat;

      if (combatScore.shipsInGarrison - changeOfShipsInCombat >= 0) {
        playerCombatUnits[playerCombatUnitsIndex] = {
          ...combatScore,
          shipsInCombat: ships,
          shipsInGarrison: combatScore.shipsInGarrison - changeOfShipsInCombat,
        };
      }
    } else {
      playerCombatUnits.push({
        playerId,
        troopsInGarrison: 0,
        troopsInCombat: ships,
        shipsInTimeout: 0,
        shipsInGarrison: 0,
        shipsInCombat: 0,
        additionalCombatPower: 0,
      });
    }

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public addPlayerShipsToCombat(playerId: number, ships: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (combatUnits) {
      this.setPlayerShipsInCombat(playerId, combatUnits.shipsInCombat + ships);
    } else {
      this.setPlayerShipsInCombat(playerId, ships);
    }
  }

  public removePlayerShipsFromCombat(playerId: number, ships: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (combatUnits) {
      if (combatUnits.shipsInCombat - ships >= 0) {
        this.setPlayerShipsInCombat(playerId, combatUnits.shipsInCombat - ships);
      } else {
        this.setPlayerShipsInCombat(playerId, 0);
      }
    }
  }

  public destroyPlayerShipsInCombat(playerId: number, ships: number) {
    const playerCombatUnits = this.playerCombatUnits;
    const playerCombatUnitsIndex = playerCombatUnits.findIndex((x) => x.playerId === playerId);
    if (playerCombatUnitsIndex > -1) {
      const combatScore = playerCombatUnits[playerCombatUnitsIndex];

      if (combatScore.shipsInCombat - ships >= 0) {
        playerCombatUnits[playerCombatUnitsIndex] = {
          ...combatScore,
          shipsInCombat: combatScore.shipsInCombat - ships,
        };
      } else {
        playerCombatUnits[playerCombatUnitsIndex] = {
          ...combatScore,
          shipsInCombat: 0,
        };
      }
    }

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public setAllPlayerShipsFromCombatToTimeout() {
    const playerCombatUnits = this.playerCombatUnits;

    for (const combatUnits of playerCombatUnits) {
      if (combatUnits.shipsInCombat > 0) {
        combatUnits.shipsInTimeout = combatUnits.shipsInCombat;
        combatUnits.shipsInCombat = 0;
      }
    }

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public setAllPlayerShipsFromTimeoutToGarrison() {
    const playerCombatUnits = this.playerCombatUnits;

    for (const combatUnits of playerCombatUnits) {
      combatUnits.shipsInGarrison = combatUnits.shipsInGarrison + combatUnits.shipsInTimeout;
      combatUnits.shipsInTimeout = 0;
    }

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public deleteAllPlayerTroopsFromCombat() {
    const playerCombatUnits = this.playerCombatUnits;

    for (const combatUnits of playerCombatUnits) {
      combatUnits.troopsInCombat = 0;
    }

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public deleteAllPlayerShipsFromCombat() {
    const playerCombatUnits = this.playerCombatUnits;

    for (const combatUnits of playerCombatUnits) {
      combatUnits.shipsInCombat = 0;
    }

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public resetAllPlayerShips() {
    const playerCombatUnits = this.playerCombatUnits;

    for (const combatUnits of playerCombatUnits) {
      combatUnits.shipsInTimeout = 0;
      combatUnits.shipsInGarrison = 0;
      combatUnits.shipsInCombat = 0;
    }

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public resetAdditionalCombatPower() {
    const playerCombatUnits = this.playerCombatUnits;

    for (const combatUnits of playerCombatUnits) {
      combatUnits.additionalCombatPower = 0;
    }

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public addAdditionalCombatPowerToPlayer(playerId: number, amount: number) {
    const playerCombatUnits = this.playerCombatUnits;
    const combatUnitsIndex = playerCombatUnits.findIndex((x) => x.playerId === playerId);
    const combatunits = playerCombatUnits[combatUnitsIndex];
    playerCombatUnits[combatUnitsIndex] = {
      ...combatunits,
      additionalCombatPower: combatunits.additionalCombatPower + 1,
    };

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public removeAdditionalCombatPowerFromPlayer(playerId: number, amount: number) {
    const playerCombatUnits = this.playerCombatUnits;
    const combatUnitsIndex = playerCombatUnits.findIndex((x) => x.playerId === playerId);
    const combatUnits = playerCombatUnits[combatUnitsIndex];
    playerCombatUnits[combatUnitsIndex] = {
      ...combatUnits,
      additionalCombatPower: combatUnits.additionalCombatPower - 1,
    };

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public getPlayerTroopsTotal(playerId: number) {
    const playerCombatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (playerCombatUnits) {
      return playerCombatUnits.troopsInCombat + playerCombatUnits.troopsInGarrison;
    } else {
      return 0;
    }
  }

  public getPlayerTroopsInGarrison(playerId: number) {
    const playerCombatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (playerCombatUnits) {
      return playerCombatUnits.troopsInGarrison;
    } else {
      return 0;
    }
  }

  public getPlayerCombatScore(playerId: number) {
    const troopCombatStrength = this.settingsService.gameContent.troopCombatStrength;
    const dreadnoughtCombatStrength = this.settingsService.gameContent.dreadnoughtCombatStrength;

    const playerCombatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (playerCombatUnits) {
      if (playerCombatUnits.troopsInCombat > 0 || playerCombatUnits.shipsInCombat > 0) {
        return (
          playerCombatUnits.troopsInCombat * troopCombatStrength +
          playerCombatUnits.shipsInCombat * dreadnoughtCombatStrength +
          playerCombatUnits.additionalCombatPower
        );
      }
    }

    return 0;
  }

  public getPlayerCombatScores() {
    const troopCombatStrength = this.settingsService.gameContent.troopCombatStrength;
    const dreadnoughtCombatStrength = this.settingsService.gameContent.dreadnoughtCombatStrength;

    return this.playerCombatUnits.map((x) => ({
      playerId: x.playerId,
      score:
        x.troopsInCombat > 0 || x.shipsInCombat > 0
          ? x.troopsInCombat * troopCombatStrength + x.shipsInCombat * dreadnoughtCombatStrength + x.additionalCombatPower
          : 0,
    }));
  }

  public getEnemyCombatScores(playerId: number): PlayerCombatScore[] {
    const troopCombatStrength = this.settingsService.gameContent.troopCombatStrength;
    const dreadnoughtCombatStrength = this.settingsService.gameContent.dreadnoughtCombatStrength;

    return this.playerCombatUnits
      .filter((x) => x.playerId !== playerId)
      .map((x) => ({
        playerId: x.playerId,
        score:
          x.troopsInCombat > 0 || x.shipsInCombat > 0
            ? x.troopsInCombat * troopCombatStrength + x.shipsInCombat * dreadnoughtCombatStrength + x.additionalCombatPower
            : 0,
      }));
  }

  public getEnemyHighestCombatScores(playerId: number) {
    const enemyCombatScores = this.getEnemyCombatScores(playerId);
    if (enemyCombatScores.length > 0) {
      enemyCombatScores.sort((a, b) => b.score - a.score);
      return enemyCombatScores[0].score;
    } else {
      return 0;
    }
  }

  public getCombatScore(troopAmount: number, dreadnoughtAmount: number) {
    const troopCombatStrength = this.settingsService.gameContent.troopCombatStrength;
    const dreadnoughtCombatStrength = this.settingsService.gameContent.dreadnoughtCombatStrength;

    return troopAmount * troopCombatStrength + dreadnoughtAmount * dreadnoughtCombatStrength;
  }
}
