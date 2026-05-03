import { shuffle } from 'lodash';
import { getPlayerCombatStrength } from '../helpers/ai';
import { CustomEffectFunctionWithGameElement, GameCommands, GameState } from '../models/ai';
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
    customRevealFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      if (gameState.playerCombatUnits.troopsInCombat < 1 && gameState.playerCombatUnits.shipsInCombat < 1) {
        game.addRewardToPlayer(player.id, { type: 'persuasion', amount: 3 });
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
    customAgentFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const greenFieldIds = gameState.boardSpaces.filter((x) => x.actionType === 'landsraad').map((x) => x.title.en);
      const enemiesOnGreenFields = gameState.enemyAgentsOnFields.filter((x) => greenFieldIds.includes(x.fieldId));
      for (const enemyOnGreenField of enemiesOnGreenFields) {
        game.payCostForPlayer(enemyOnGreenField.playerId, { type: 'card-destroy' });
      }
    },
  },
  {
    id: 'Sayyadinah',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      (gameState.imperiumDeckCards.some((x) => x.name.en === 'Water of Life') ? 6 : 0) +
      1 * gameState.playerFactionFriendships.filter((x) => x === 'bene' || x === 'fremen').length,
    customAgentFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const waterOfLifeCard = gameState.imperiumDeckCards.find((x) => x.name.en === 'Water of Life') as ImperiumDeckCard;
      if (waterOfLifeCard) {
        game.acquireImperiumCard(player.id, waterOfLifeCard, 'deck', {
          acquireLocation: 'below-deck',
          additionalCostModifier: -8,
        });
      }
    },
  },
  {
    id: 'Provoked Hostilities',
    aiAgentEvaluation: (player: Player, gameState: GameState) => 3,
    customAgentFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      return;
    },
    aiRevealEvaluation: (player: Player, gameState: GameState) =>
      0 + 1.5 * gameState.enemyCombatUnits.filter((x) => getPlayerCombatStrength(x, gameState)).length,
    customRevealFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      for (const enemy of gameState.enemyCombatUnits) {
        if (enemy.troopsInCombat > 0) {
          game.retreatPlayerTroopsFromCombat(enemy.playerId, 1);
        }
      }
    },
  },
  {
    id: 'Insurgents',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      0.75 + 0.1 * gameState.currentRound - 1 * gameState.playerAgentsOnFields.length,
    customAgentAIFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const blockableBoardSpaces = gameState.boardSpaces.filter(
        (field) => !gameState.agentsOnFields.some((agent) => agent.fieldId === field.title.en),
      );

      const randomizedBoardSpaces = shuffle(blockableBoardSpaces).slice(0, 1);
      for (const boardSpace of randomizedBoardSpaces) {
        game.addPlayerGameModifiers(player.id, {
          fieldBlock: [{ id: 'embargo-field-block', fieldId: boardSpace.title.en, currentRoundOnly: true }],
        });
        for (const enemyPlayer of gameState.enemyPlayers) {
          game.addPlayerGameModifiers(enemyPlayer.id, {
            fieldBlock: [{ id: 'embargo-field-block', fieldId: boardSpace.title.en, currentRoundOnly: true }],
          });
        }
      }
    },
  },
  {
    id: 'Embargo',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      2 + 0.1 * gameState.currentRound - 1 * gameState.playerAgentsOnFields.length,
    customAgentAIFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const blockableBoardSpaces = gameState.boardSpaces.filter(
        (field) => !gameState.agentsOnFields.some((agent) => agent.fieldId === field.title.en),
      );

      const randomizedBoardSpaces = shuffle(blockableBoardSpaces).slice(0, 3);
      for (const boardSpace of randomizedBoardSpaces) {
        game.addPlayerGameModifiers(player.id, {
          fieldBlock: [{ id: 'embargo-field-block', fieldId: boardSpace.title.en, currentRoundOnly: true }],
        });
        for (const enemyPlayer of gameState.enemyPlayers) {
          game.addPlayerGameModifiers(enemyPlayer.id, {
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
    customRevealFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      for (const enemy of gameState.enemyCombatUnits) {
        if (enemy.troopsInCombat > 0) {
          game.retreatPlayerTroopsFromCombat(enemy.playerId, 3);
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
    customAgentFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const spiceFieldIds = gameState.boardSpaces.filter((x) => x.actionType === 'spice').map((x) => x.title.en);
      const enemiesOnSpiceFields = gameState.enemyAgentsOnFields.filter((x) => spiceFieldIds.includes(x.fieldId));
      for (const enemyOnSpiceField of enemiesOnSpiceFields) {
        game.payCostForPlayer(enemyOnSpiceField.playerId, { type: 'spice', amount: 2 });
      }
    },
  },
  {
    id: 'Duncan Idaho, Swordmaster',
    aiAgentEvaluation: (player: Player, gameState: GameState) => 0.5 + 1 * gameState.playerAgentsOnFields.length,
    customAgentFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const currentField = gameState.playerAgentPlacedOnFieldThisTurn;
      if (currentField) {
        for (const enemyOnField of gameState.enemyAgentsOnFields) {
          if (enemyOnField.fieldId === currentField) {
            game.setPlayerAgentInTimeout(enemyOnField.playerId, currentField);
          }
        }
      }
    },
  },
  {
    id: 'Turncoats',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      -1 + 2 * gameState.enemyIntrigueCounts.filter((x) => x.intrigueCount > 0).length,
    customAgentFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      for (const enemyIntrigues of gameState.enemyIntrigues) {
        if (enemyIntrigues.intrigues.length > 0) {
          const randomIntrigue = shuffle(enemyIntrigues.intrigues)[0];
          game.trashPlayerIntrigue(enemyIntrigues.playerId, randomIntrigue.id, false);
          game.addPlayerIntrigue(player.id, randomIntrigue);
        }
      }
    },
  },
  {
    id: 'Guild Banker',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      0 + 1.25 * (gameState.playerScore.guild < 4 ? gameState.playerScore.guild : 4),
    customAgentFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const guildInfluence = gameState.playerScore.guild;
      if (guildInfluence < 2) {
        game.addRewardToPlayer(player.id, { type: 'solari', amount: 2 });
      } else if (guildInfluence < 4) {
        game.addRewardToPlayer(player.id, { type: 'solari', amount: 3 });
      } else {
        game.addRewardToPlayer(player.id, { type: 'solari', amount: 4 });
      }
    },
  },
  {
    id: 'Truthsayer',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      0 + 1.5 * (gameState.playerScore.guild < 4 ? gameState.playerScore.guild : 4),
    customAgentFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const beneInfluence = gameState.playerScore.bene;
      if (beneInfluence < 2) {
        game.payCostForPlayer(player.id, { type: 'card-discard' });
        game.addRewardToPlayer(player.id, { type: 'card-draw' });
      } else if (beneInfluence < 4) {
        game.addRewardToPlayer(player.id, { type: 'card-draw' });
      } else {
        game.addRewardToPlayer(player.id, { type: 'agent-lift' });
      }
    },
  },
  {
    id: 'Guild Envoy',
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      0 + 1 * (gameState.playerScore.guild < 4 ? gameState.playerScore.guild : 4),
    customAgentFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const guildInfluence = gameState.playerScore.guild;
      if (guildInfluence < 2) {
        game.addRewardToPlayer(player.id, { type: 'foldspace' });
      } else if (guildInfluence < 4) {
        game.addRewardToPlayer(player.id, { type: 'water' });
      } else {
        game.addRewardToPlayer(player.id, { type: 'foldspace' });
        game.addRewardToPlayer(player.id, { type: 'water' });
      }
    },
  },
  {
    id: 'Arrival of the Emperor',
    aiAgentEvaluation: (player: Player, gameState: GameState) => 5 + 0.1 * gameState.currentRound - 1,
    customAgentFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      const enemyLocation = gameState.enemyLocations.find(
        (x) => x.locationId === gameState.playerAgentPlacedOnFieldThisTurn,
      );
      if (enemyLocation) {
        game.setLocationOwner(enemyLocation.locationId, player.id);
      }
    },
  },
  {
    id: 'Mohiam, Reverend Mother',
    aiAgentEvaluation: (player: Player, gameState: GameState) => 1.5 + 0.1 * gameState.currentRound - 1,
    customAgentFunction: (player: Player, gameState: GameState, game: GameCommands) => {
      game.addPlayerGameModifiers(player.id, {
        customActions: [
          {
            id: 'mohiam-vision-intrigues',
            action: 'vision-intrigues',
            currentRoundOnly: true,
          },
          {
            id: 'mohiam-vision-deck',
            action: 'vision-deck',
            currentRoundOnly: true,
          },
        ],
      });
    },
  },
];
