import { CustomEffectFunctionWithGameElement, GameServices, GameState } from '../models/ai';
import { Player } from '../models/player';
import { ImperiumDeckCard } from '../services/cards.service';

export interface ImperiumCardsGameAdjustments {
  id: string;
  aiAgentEvaluation?: (player: Player, gameState: GameState) => number; //Keep costs in mind, Max value should be 20, min 0
  aiRevealEvaluation?: (player: Player, gameState: GameState) => number; //Keep costs in mind, Max value should be 20, min 0
  customAgentFunction?: CustomEffectFunctionWithGameElement;
  customAgentAIFunction?: CustomEffectFunctionWithGameElement;
  customRevealFunction?: CustomEffectFunctionWithGameElement;
  customRevealAIFunction?: CustomEffectFunctionWithGameElement;
}

export const techTilesGameAdjustments: ImperiumCardsGameAdjustments[] = [
  {
    id: 'Plans over generations',
    aiRevealEvaluation: (player: Player, gameState: GameState) => 6 - 3 * gameState.playerDreadnoughtCount,
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
    aiAgentEvaluation: (player: Player, gameState: GameState) =>
      0 + 1 * gameState.enemyLocations.length - 0.25 * gameState.playerLocations.length,
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
    aiAgentEvaluation: (player: Player, gameState: GameState) => 0,
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      return;
    },
  },
  {
    id: 'Provoked Hostilities',
    aiAgentEvaluation: (player: Player, gameState: GameState) => 0,
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      return;
    },
    aiRevealEvaluation: (player: Player, gameState: GameState) => 0,
    customRevealFunction: (player: Player, gameState: GameState, services: GameServices) => {
      return;
    },
  },
  {
    id: 'Embargo',
    aiAgentEvaluation: (player: Player, gameState: GameState) => 0,
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      return;
    },
  },
  {
    id: 'Betrayal',
    aiAgentEvaluation: (player: Player, gameState: GameState) => 0,
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      return;
    },
  },
  {
    id: 'Destruction of the spice harvest',
    aiAgentEvaluation: (player: Player, gameState: GameState) => 3,
    customAgentFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const spiceFieldIds = gameState.boardSpaces.filter((x) => x.actionType === 'spice').map((x) => x.title.en);
      const enemiesOnSpiceFields = gameState.enemyAgentsOnFields.filter((x) => spiceFieldIds.includes(x.fieldId));
      for (const enemyOnSpiceField of enemiesOnSpiceFields) {
        services.gameManager.payCostForPlayer(enemyOnSpiceField.playerId, { type: 'spice', amount: 2 });
      }
      services.gameManager.addRewardToPlayer(player.id, { type: 'spice', amount: 2 });
    },
  },
];
