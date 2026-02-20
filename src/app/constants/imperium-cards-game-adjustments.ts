import { shuffle } from 'lodash';
import { getPlayerCombatStrength } from '../helpers/ai';
import { CustomEffectFunctionWithGameElement, GameServices, GameState } from '../models/ai';
import { Player } from '../models/player';
import { ImperiumDeckCard } from '../services/cards.service';

export interface ImperiumCardsGameAdjustments {
  id: string;
  aiAgentEvaluation?: (player: Player, gameState: GameState) => number; //Only for custom effect texts. Keep costs in mind, Max value should be 20, min 0
  aiRevealEvaluation?: (player: Player, gameState: GameState) => number; //Only for custom effect texts. Keep costs in mind, Max value should be 20, min 0
  customAgentFunction?: CustomEffectFunctionWithGameElement;
  customAgentAIFunction?: CustomEffectFunctionWithGameElement;
  customRevealFunction?: CustomEffectFunctionWithGameElement;
  customRevealAIFunction?: CustomEffectFunctionWithGameElement;
}

export const imperiumCardsGameAdjustments: ImperiumCardsGameAdjustments[] = [
  {
    id: 'Plans over generations',
    aiRevealEvaluation: (player: Player, gameState: GameState) =>
      getPlayerCombatStrength(gameState.playerCombatUnits, gameState) > 0 ? 0 : 5,
    customRevealFunction: (player: Player, gameState: GameState, services: GameServices) => {
      if (gameState.playerCombatUnits.troopsInCombat < 1 && gameState.playerCombatUnits.shipsInCombat < 1) {
        services.gameManager.addRewardToPlayer(player.id, { type: 'persuasion', amount: 3 });
      }
    },
  },
  {
    id: 'Insurgents',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      0 + 1 * gameState.enemyLocations.length - 0.25 * gameState.playerLocations.length,
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const enemyLocation = gameState.enemyLocations.find(
        (x) => x.locationId === gameState.playerAgentPlacedOnFieldThisTurn,
      );
      if (enemyLocation) {
        services.gameManager.addRewardToPlayer(player.id, { type: 'solari', amount: 2 });
        services.gameManager.payCostForPlayer(player.id, { type: 'solari', amount: -2 });
      }
    },
  },
  {
    id: 'Seduction',
    aiAgentEvaluation: (player: Player, gameState: GameState) => {
      const result = 0;
      const boardSpaces = gameState.boardSpaces.filter((field) => field.actionType === 'landsraad');
      const affectedPlayerIds: number[] = [];
      let playerCount = 0;
      for (const boardSpace of boardSpaces) {
        const enemyAgent = gameState.enemyAgentsOnFields.find((agent) => agent.fieldId === boardSpace.title.en);
        if (enemyAgent && !affectedPlayerIds.some((playerId) => playerId === enemyAgent.playerId)) {
          affectedPlayerIds.push(enemyAgent.playerId);
          playerCount++;
        }
      }
      return result + playerCount * 2;
    },
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const greenFieldIds = gameState.boardSpaces.filter((x) => x.actionType === 'landsraad').map((x) => x.title.en);
      const enemiesOnGreenFields = gameState.enemyAgentsOnFields.filter((x) => greenFieldIds.includes(x.fieldId));
      for (const enemyOnGreenField of enemiesOnGreenFields) {
        services.gameManager.payCostForPlayer(enemyOnGreenField.playerId, { type: 'card-destroy' });
      }
    },
  },
  {
    id: 'Sayyadinah',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      (gameState.imperiumDeckCards.some((x) => x.name.en === 'Water of Life') ? 6 : 0) +
      1 * gameState.playerFactionFriendships.filter((x) => x === 'bene' || x === 'fremen').length,
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const waterOfLifeCard = gameState.imperiumDeckCards.find((x) => x.name.en === 'Water of Life') as ImperiumDeckCard;
      if (waterOfLifeCard) {
        services.gameManager.acquireImperiumCard(player.id, waterOfLifeCard, 'deck', {
          acquireLocation: 'below-deck',
          additionalCostModifier: -8,
        });
      }
    },
  },
  {
    id: 'Imperial Assassin',
    aiAgentEvaluation: (player: Player, gameState: GameState) => 3,
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      return;
    },
  },
  {
    id: 'Provoked Hostilities',
    aiAgentEvaluation: (player: Player, gameState: GameState) => {
      const result = 0;
      const boardSpaces = gameState.boardSpaces.filter((field) => field.actionType === 'town');
      const affectedPlayerIds: number[] = [];
      let playerCount = 0;
      for (const boardSpace of boardSpaces) {
        const enemyAgent = gameState.enemyAgentsOnFields.find((agent) => agent.fieldId === boardSpace.title.en);
        if (enemyAgent && !affectedPlayerIds.some((playerId) => playerId === enemyAgent.playerId)) {
          affectedPlayerIds.push(enemyAgent.playerId);
          playerCount++;
        }
      }
      return result + playerCount * 1.25;
    },
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const townFieldIds = gameState.boardSpaces.filter((x) => x.actionType === 'town').map((x) => x.title.en);
      const enemiesOnTownFields = gameState.enemyAgentsOnFields.filter((x) => townFieldIds.includes(x.fieldId));
      for (const enemyOnTownField of enemiesOnTownFields) {
        services.gameManager.payCostForPlayer(enemyOnTownField.playerId, { type: 'loose-troop' });
      }
    },
    aiRevealEvaluation: (player: Player, gameState: GameState) =>
      0 + 1.5 * gameState.enemyCombatUnits.filter((x) => getPlayerCombatStrength(x, gameState)).length,
    customRevealFunction: (player: Player, gameState: GameState, services: GameServices) => {
      for (const enemy of gameState.enemyCombatUnits) {
        if (enemy.troopsInCombat > 0) {
          services.combatManager.removePlayerTroopsFromCombat(enemy.playerId, 1);
        }
      }
    },
  },
  {
    id: 'Embargo',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      2 + 0.1 * gameState.currentRound - 1 * gameState.playerAgentsOnFields.length,
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const blockableBoardSpaces = gameState.boardSpaces.filter(
        (field) => !gameState.agentsOnFields.some((agent) => agent.fieldId === field.title.en),
      );

      const randomizedBoardSpaces = shuffle(blockableBoardSpaces).slice(0, 3);
      for (const boardSpace of randomizedBoardSpaces) {
        services.gameModifierService.addPlayerGameModifiers(player.id, {
          fieldBlock: [{ id: 'embargo-field-block', fieldId: boardSpace.title.en, currentRoundOnly: true }],
        });
        for (const enemyPlayer of gameState.enemyPlayers) {
          services.gameModifierService.addPlayerGameModifiers(enemyPlayer.id, {
            fieldBlock: [{ id: 'embargo-field-block', fieldId: boardSpace.title.en, currentRoundOnly: true }],
          });
        }
      }
    },
  },
  {
    id: 'Betrayal',
    aiRevealEvaluation: (player: Player, gameState: GameState) =>
      0 + 4 * gameState.enemyCombatUnits.filter((x) => x.troopsInCombat > 2).length,
    customRevealFunction: (player: Player, gameState: GameState, services: GameServices) => {
      for (const enemy of gameState.enemyCombatUnits) {
        if (enemy.troopsInCombat > 0) {
          services.combatManager.removePlayerTroopsFromCombat(enemy.playerId, 3);
        }
      }
    },
  },
  {
    id: 'Destruction of the spice harvest',
    aiAgentEvaluation: (player: Player, gameState: GameState) => {
      const result = 0;
      const boardSpaces = gameState.boardSpaces.filter((field) => field.actionType === 'spice');
      const affectedPlayerIds: number[] = [];
      let playerCount = 0;
      for (const boardSpace of boardSpaces) {
        const enemyAgent = gameState.enemyAgentsOnFields.find((agent) => agent.fieldId === boardSpace.title.en);
        if (enemyAgent && !affectedPlayerIds.some((playerId) => playerId === enemyAgent.playerId)) {
          affectedPlayerIds.push(enemyAgent.playerId);
          playerCount++;
        }
      }
      return result + playerCount * 2.5;
    },
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const spiceFieldIds = gameState.boardSpaces.filter((x) => x.actionType === 'spice').map((x) => x.title.en);
      const enemiesOnSpiceFields = gameState.enemyAgentsOnFields.filter((x) => spiceFieldIds.includes(x.fieldId));
      for (const enemyOnSpiceField of enemiesOnSpiceFields) {
        services.gameManager.payCostForPlayer(enemyOnSpiceField.playerId, { type: 'spice', amount: 2 });
      }
    },
  },
  {
    id: 'Duncan Idaho, Swordmaster',
    aiAgentEvaluation: (player: Player, gameState: GameState) => 0.5 + 1 * gameState.playerAgentsOnFields.length,
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const currentField = gameState.playerAgentPlacedOnFieldThisTurn;
      if (currentField) {
        for (const enemyOnField of gameState.enemyAgentsOnFields) {
          if (enemyOnField.fieldId === currentField) {
            services.playerAgentsService.setPlayerAgentInTimeout(enemyOnField.playerId, currentField);
          }
        }
      }
    },
  },
  {
    id: 'Turncoats',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      -1 + 2 * gameState.enemyIntrigueCounts.filter((x) => x.intrigueCount > 0).length,
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      for (const enemyIntrigues of gameState.enemyIntrigues) {
        if (enemyIntrigues.intrigues.length > 0) {
          const randomIntrigue = shuffle(enemyIntrigues.intrigues)[0];
          services.intriguesService.trashPlayerIntrigue(enemyIntrigues.playerId, randomIntrigue.id);
          services.intriguesService.addPlayerIntrigue(player.id, randomIntrigue);
        }
      }
    },
  },
  {
    id: 'Guild Banker',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      0 + 1.25 * (gameState.playerScore.guild < 4 ? gameState.playerScore.guild : 4),
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const guildInfluence = gameState.playerScore.guild;
      if (guildInfluence < 2) {
        services.gameManager.addRewardToPlayer(player.id, { type: 'solari', amount: 2 });
      } else if (guildInfluence < 4) {
        services.gameManager.addRewardToPlayer(player.id, { type: 'solari', amount: 3 });
      } else {
        services.gameManager.addRewardToPlayer(player.id, { type: 'solari', amount: 4 });
      }
    },
  },
  {
    id: 'Truthsayer',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      0 + 1.5 * (gameState.playerScore.guild < 4 ? gameState.playerScore.guild : 4),
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const beneInfluence = gameState.playerScore.bene;
      if (beneInfluence < 2) {
        services.gameManager.addRewardToPlayer(player.id, { type: 'card-draw' });
      } else if (beneInfluence < 4) {
        services.gameManager.addRewardToPlayer(player.id, { type: 'agent-lift' });
      } else {
        services.gameManager.addRewardToPlayer(player.id, { type: 'card-draw' });
        services.gameManager.addRewardToPlayer(player.id, { type: 'agent-lift' });
      }
    },
  },
  {
    id: 'Guild Envoy',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      0 + 1 * (gameState.playerScore.guild < 4 ? gameState.playerScore.guild : 4),
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const guildInfluence = gameState.playerScore.guild;
      if (guildInfluence < 2) {
        services.gameManager.addRewardToPlayer(player.id, { type: 'foldspace' });
      } else if (guildInfluence < 4) {
        services.gameManager.addRewardToPlayer(player.id, { type: 'water' });
      } else {
        services.gameManager.addRewardToPlayer(player.id, { type: 'foldspace' });
        services.gameManager.addRewardToPlayer(player.id, { type: 'water' });
      }
    },
  },
];
