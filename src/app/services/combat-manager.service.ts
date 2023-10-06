import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Player, PlayerManager } from './player-manager.service';

export interface PlayerCombatUnits {
  playerId: number;
  troopsInGarrison: number;
  troopsInCombat: number;
  shipsInTimeout: number;
  shipsInGarrison: number;
  shipsInCombat: number;
  additionalCombatPower: number;
}

@Injectable({
  providedIn: 'root',
})
export class CombatManager {
  private playerCombatUnitsSubject = new BehaviorSubject<PlayerCombatUnits[]>([]);
  public playerCombatUnits$ = this.playerCombatUnitsSubject.asObservable();

  constructor(public playerManager: PlayerManager) {
    const playerCombatUnitsString = localStorage.getItem('playerCombatUnits');
    if (playerCombatUnitsString) {
      const playerCombatUnits = JSON.parse(playerCombatUnitsString) as PlayerCombatUnits[];
      this.playerCombatUnitsSubject.next(playerCombatUnits);
    }

    this.playerCombatUnits$.subscribe((playerCombatUnits) => {
      localStorage.setItem('playerCombatUnits', JSON.stringify(playerCombatUnits));
    });
  }

  public get playerCombatUnits() {
    return cloneDeep(this.playerCombatUnitsSubject.value);
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

  public addAllPossibleUnitsToCombat(playerId: number, unitsGainedThisTurn: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (!combatUnits) {
      return;
    }
    let unitsAllowedToEnterCombat = 2 + unitsGainedThisTurn;
    if (combatUnits.shipsInGarrison > 0) {
      this.addPlayerShipsToCombat(playerId, 1);
      unitsAllowedToEnterCombat -= 1;
    }
    const troopsToAdd =
      combatUnits.troopsInGarrison <= unitsAllowedToEnterCombat ? combatUnits.troopsInGarrison : unitsAllowedToEnterCombat;

    this.addPlayerTroopsToCombat(playerId, troopsToAdd);
  }

  public addMinimumUnitsToCombat(playerId: number) {
    const combatUnits = this.playerCombatUnits.find((x) => x.playerId === playerId);
    if (!combatUnits || combatUnits.troopsInCombat > 0 || combatUnits.shipsInCombat > 0) {
      return;
    }
    if (combatUnits.shipsInGarrison > 0) {
      this.addPlayerShipsToCombat(playerId, 1);
    } else {
      const troopsToAdd =
        combatUnits.troopsInGarrison > 0 ? (combatUnits.troopsInGarrison > 1 ? Math.round(Math.random()) + 1 : 1) : 0;

      this.addPlayerTroopsToCombat(playerId, troopsToAdd);
    }
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

  public setAllPlayerShipsFromCombatToGarrisonOrTimeout() {
    const playerCombatUnits = this.playerCombatUnits;
    const winningPlayer = playerCombatUnits.sort((a, b) => this.getPlayerCombatScore(b) - this.getPlayerCombatScore(a))[0];

    for (const combatUnits of playerCombatUnits) {
      if (combatUnits.playerId === winningPlayer.playerId) {
        if (combatUnits.shipsInCombat > 0) {
          combatUnits.shipsInTimeout = 1;
          combatUnits.shipsInGarrison = combatUnits.shipsInGarrison + combatUnits.shipsInCombat - 1;
          combatUnits.shipsInCombat = 0;
        }
      } else {
        combatUnits.shipsInGarrison = combatUnits.shipsInGarrison + combatUnits.shipsInCombat;
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
      additionalCombatPower: combatUnits.additionalCombatPower > 0 ? combatUnits.additionalCombatPower - 1 : 0,
    };

    this.playerCombatUnitsSubject.next(playerCombatUnits);
  }

  public getPlayerCombatScore(playerCombatUnits: PlayerCombatUnits) {
    return (
      playerCombatUnits.troopsInCombat * 2 + playerCombatUnits.shipsInCombat * 3 + playerCombatUnits.additionalCombatPower
    );
  }
}
