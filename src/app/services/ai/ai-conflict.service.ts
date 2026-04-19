import { Injectable } from '@angular/core';
import {
  getEnemyCombatStrengthPotentialAgainstPlayer,
  getPlayerCombatStrength,
  getPlayerCombatStrengthPotentialAgainstEnemy,
  getPlayerGarrisonStrength,
} from 'src/app/helpers/ai';
import { GameState } from 'src/app/models/ai';
import { PlayerCombatUnits } from '../combat-manager.service';

@Injectable({
  providedIn: 'root',
})
export class AIConflictService {
  constructor() {}

  getAddAdditionalUnitsToCombatDecision(
    playerCombatUnits: PlayerCombatUnits,
    gameState: GameState,
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

    const combatPowerSurplus = playerCombatStrength - highestEnemyCombatScore.combatStrength;

    if (combatPowerSurplus > 0) {
      const enemyAgentsAvailable = gameState.enemyAgentsAvailable.filter(
        (x) => x.playerId === highestEnemyCombatScore.playerId,
      ).length;
      const enemyIntrigueCount = gameState.enemyIntrigueCounts.filter(
        (x) => x.playerId === highestEnemyCombatScore.playerId,
      ).length;

      const enemyCombatStrengthPotentialAgainstPlayer = getEnemyCombatStrengthPotentialAgainstPlayer(
        playerCombatUnits,
        highestEnemyCombatScore,
        enemyAgentsAvailable,
        enemyIntrigueCount,
        gameState,
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
        gameState,
      );

      const enemyGarrisonStrength = getPlayerGarrisonStrength(highestEnemyCombatScore, gameState);

      if (playerCombatStrengthPotentialAgainstEnemy < 1) {
        if (
          (playerCombatStrength < 1 && enemyCombatScores.filter((x) => x.combatStrength > 0).length < 3) ||
          playerCombatUnits.troopsInGarrison > 4
        ) {
          return 'minimum';
        } else {
          return 'none';
        }
      } else if (
        playerCombatStrengthPotentialAgainstEnemy >= 1 &&
        playerCombatStrengthPotentialAgainstEnemy > enemyGarrisonStrength
      ) {
        return playerCombatStrengthPotentialAgainstEnemy + Math.abs(combatPowerSurplus);
      } else {
        return 'all';
      }
    }
  }
}
