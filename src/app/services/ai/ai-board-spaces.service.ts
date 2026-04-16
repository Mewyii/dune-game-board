import { Injectable } from '@angular/core';
import { DuneLocation } from 'src/app/models';
import { GameState } from 'src/app/models/ai';
import { Player } from 'src/app/models/player';
import { PlayerResourcesService } from '../player-resources.service';
import { SettingsService } from '../settings.service';
import { AIPlayersService } from './ai-players.service';
import { AIEffectEvaluationService } from './ai.effect-evaluation.service';

export type AIVariableValues = 'good' | 'okay' | 'bad';

@Injectable({
  providedIn: 'root',
})
export class AIBoardSpacesService {
  constructor(
    private settingsService: SettingsService,
    private effectEvaluationService: AIEffectEvaluationService,
    private playerResourcesService: PlayerResourcesService,
    private aiPlayersService: AIPlayersService,
  ) {}

  getPreferredFieldForPlayer(playerId: number) {
    const aiPlayer = this.aiPlayersService.aiPlayers.find((x) => x.playerId === playerId);
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

  getLocationToControl(player: Player, gameState: GameState) {
    const locationsWithPlayerAgents = this.settingsService
      .getBoardLocations()
      .filter((x) => gameState.playerAgentsOnFields.some((y) => y.fieldId === x.actionField.title.en));

    const playerLocations = gameState.playerLocations;
    const enemyLocations = gameState.enemyLocations;

    const freeControllableLocations = locationsWithPlayerAgents.filter(
      (x) =>
        !playerLocations.some((y) => x.actionField.title.en === y) &&
        !enemyLocations.some((y) => x.actionField.title.en === y.locationId),
    );

    const enemyControllableLocations = locationsWithPlayerAgents.filter((x) =>
      enemyLocations.some((y) => x.actionField.title.en === y.locationId),
    );

    const locationTakeoverTroopCosts = this.settingsService.getLocationTakeoverTroopCosts();
    const playerTroopAmount = gameState.playerCombatUnits.troopsInGarrison;
    const playerCanConquerLocations = playerTroopAmount >= locationTakeoverTroopCosts;

    let controllableLocations = freeControllableLocations;

    if (playerCanConquerLocations && enemyControllableLocations.length > 0) {
      const conquerDesire = 0.2 * playerTroopAmount + 0.1 * (gameState.currentRound - 1);
      if (freeControllableLocations.length < 1 || conquerDesire > Math.random()) {
        if (gameState.rival) {
          const rivalLocations = gameState.enemyLocations.filter((x) => x.playerId === gameState.rival?.id);
          const controllableRivalLocations = locationsWithPlayerAgents.filter((x) =>
            rivalLocations.some((y) => x.actionField.title.en === y.locationId),
          );

          if (controllableRivalLocations.length > 0) {
            controllableLocations = controllableRivalLocations;
          } else {
            controllableLocations = enemyControllableLocations;
          }
        } else {
          controllableLocations = enemyControllableLocations;
        }
      }
    }

    const desiredLocation = this.getPreferredLocationForPlayer(player, controllableLocations, gameState);
    if (desiredLocation) {
      return desiredLocation;
    }
    return undefined;
  }

  getFieldDecision(playerId: number, fieldId: string): string {
    const aiPlayer = this.aiPlayersService.aiPlayers.find((x) => x.playerId === playerId);
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

  getFieldDrawOrDestroyDecision(playerId: number, fieldId: string): 'draw' | 'destroy' {
    const aiPlayer = this.aiPlayersService.aiPlayers.find((x) => x.playerId === playerId);
    if (!aiPlayer) {
      return 'draw';
    }

    const targetFields = aiPlayer.preferredFields.filter((x) => x.fieldId.includes(fieldId));
    if (targetFields[0] && targetFields[0].fieldId.toLocaleLowerCase().includes('destroy')) {
      return 'destroy';
    }

    return 'draw';
  }

  getUpgradedreadnoughtOrTechDecision(playerId: number): 'dreadnought' | 'tech' {
    const aiPlayer = this.aiPlayersService.aiPlayers.find((x) => x.playerId === playerId);
    if (!aiPlayer) {
      return 'tech';
    }

    const targetFields = aiPlayer.preferredFields.filter((x) => x.fieldId.includes('upgrade'));
    if (targetFields[0] && targetFields[0].fieldId.toLocaleLowerCase().includes('dreadnought')) {
      return 'dreadnought';
    }

    return 'tech';
  }

  getDesiredSpiceToSell(player: Player, spiceToSolariFunction: (spice: number) => number, maxAmount: number) {
    const aiPlayer = this.aiPlayersService.aiPlayers.find((x) => x.playerId === player.id);
    if (!aiPlayer) {
      return 0;
    }

    const playerSpiceAmount = this.playerResourcesService.getPlayerResourceAmount(player.id, 'spice');
    if (!playerSpiceAmount) {
      return 0;
    }

    const desiredSolariAmount = player.hasSwordmaster ? 9 : 10;
    const playerSolariAmount = this.playerResourcesService.getPlayerResourceAmount(player.id, 'solari');

    for (let spiceCount = 1; spiceCount <= playerSpiceAmount; spiceCount++) {
      if (playerSolariAmount + spiceToSolariFunction(spiceCount) > desiredSolariAmount || spiceCount >= maxAmount) {
        return spiceCount;
      }
    }

    return playerSpiceAmount;
  }

  getPreferredLocationForPlayer(player: Player, controllableLocations: DuneLocation[], gameState: GameState) {
    let preferredLocation = undefined;
    let preferredLocationValue = 0;

    for (const location of controllableLocations) {
      if (location.actionField.ownerReward) {
        const locationValue = this.effectEvaluationService.getAmountAdjustedRewardEffectEvaluation(
          location.actionField.ownerReward.type,
          location.actionField.ownerReward.amount ?? 1,
          player,
          gameState,
        );
        if (locationValue > preferredLocationValue) {
          preferredLocation = location;
          preferredLocationValue = locationValue;
        }
      }
    }

    return preferredLocation;
  }
}
