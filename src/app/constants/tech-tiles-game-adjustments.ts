import { getResourceAmount } from '../helpers/ai';
import { getPlayerdreadnoughtCount } from '../helpers/combat-units';
import { getFlattenedEffectRewardArray } from '../helpers/rewards';
import { GameServices, GameState, TimedFunctionWithGameElement } from '../models/ai';
import { Player } from '../models/player';
import { GameModifiers } from '../services/game-modifier.service';

export interface TechTileGameAdjustments {
  id: string;
  aiEvaluation?: (player: Player, gameState: GameState) => number; //Keep costs in mind, Max value should be 20, min 0
  gameModifiers?: GameModifiers;
  customTimedFunction?: TimedFunctionWithGameElement;
  customTimedAIFunction?: TimedFunctionWithGameElement;
}

export const techTilesGameAdjustments: TechTileGameAdjustments[] = [
  {
    id: 'Spice transport modules',
    aiEvaluation: (player, gameState) => 0.0 + 5 * gameState.playerDreadnoughtCount + (player.hasSwordmaster ? 3 : 0),
  },
  {
    id: 'Spy modules',
    aiEvaluation: (player, gameState) => 0.0 + 5 * gameState.playerDreadnoughtCount + (player.hasSwordmaster ? 3 : 0),
  },
  {
    id: 'Maula Pistol Works',
    aiEvaluation: (player, gameState) => 6 + 1.25 * (gameState.currentRound - 1) + 0.5 * gameState.playerCardsRewards.solari,
  },
  {
    id: 'Upgraded Carryall Suspensors',
    aiEvaluation: (player, gameState) => 16 - 1.25 * (gameState.currentRound - 1),
    gameModifiers: {
      fieldCost: [
        {
          id: 'carryall-suspensors',
          actionType: 'spice',
          costType: 'water',
          amount: -1,
        },
      ],
    },
  },
  {
    id: 'Spy Network',
    aiEvaluation: (player, gameState) =>
      10 +
      0.5 * gameState.playerCardsRewards['card-draw'] -
      0.1 * (gameState.currentRound - 1) -
      (player.hasSwordmaster ? 0 : 1),
  },
  {
    id: 'Heavy Lasguns',
    aiEvaluation: (player, gameState) => 0.0 + 8 * gameState.playerDreadnoughtCount + (player.hasSwordmaster ? 2 : 0),
  },
  {
    id: 'Enhanced Sandcrawler Engines',
    aiEvaluation: (player, gameState) => 18 - 1 * (gameState.currentRound - 1),
    gameModifiers: {
      fieldReward: [
        {
          id: 'sandcrawler-engines',
          actionType: 'spice',
          rewardType: 'spice',
          amount: 1,
        },
      ],
    },
  },
  {
    id: 'Trade Port',
    aiEvaluation: (player, gameState) =>
      0 + 1.5 * gameState.playerCardsFactions.guild + 0.5 * gameState.playerCardsRewards['card-draw'],
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player: Player, gameState: GameState, services: GameServices, gameElement) => {
        const playerGuildCardAmount =
          gameState.playerHandCards.filter((x) => x.faction === 'guild').length +
          (gameState.playerDiscardPileCards?.filter((x) => x.faction === 'guild').length ?? 0);

        if (playerGuildCardAmount > 2) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'tech', amount: 2 });
          services.gameManager.addRewardToPlayer(player.id, { type: 'solari' });
        } else if (playerGuildCardAmount > 1) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'tech' });
        } else if (playerGuildCardAmount > 0) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'solari' });
        }
      },
    },
  },
  {
    id: 'Botanical Research Station',
    aiEvaluation: (player, gameState) =>
      0 + 1.5 * gameState.playerCardsFactions.fremen + 0.5 * gameState.playerCardsRewards['card-draw'],
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player: Player, gameState: GameState, services: GameServices, gameElement) => {
        const playerFremenCardAmount =
          gameState.playerHandCards.filter((x) => x.faction === 'fremen').length +
          (gameState.playerDiscardPileCards?.filter((x) => x.faction === 'fremen').length ?? 0);

        if (playerFremenCardAmount > 2) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'focus' });
          services.gameManager.addRewardToPlayer(player.id, { type: 'persuasion' });
        } else if (playerFremenCardAmount > 1) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'focus' });
        } else if (playerFremenCardAmount > 0) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'persuasion' });
        }
      },
    },
  },
  {
    id: 'Sardaukar Commando Post',
    aiEvaluation: (player, gameState) =>
      0 + 1.5 * gameState.playerCardsFactions.emperor + 0.5 * gameState.playerCardsRewards['card-draw'],
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player: Player, gameState: GameState, services: GameServices, gameElement) => {
        const playerEmperorCardAmount =
          gameState.playerHandCards.filter((x) => x.faction === 'emperor').length +
          (gameState.playerDiscardPileCards?.filter((x) => x.faction === 'emperor').length ?? 0);

        if (playerEmperorCardAmount > 2) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'sword', amount: 2 });
          services.gameManager.addRewardToPlayer(player.id, { type: 'intrigue' });
        } else if (playerEmperorCardAmount > 1) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'sword', amount: 2 });
        } else if (playerEmperorCardAmount > 0) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'sword' });
        }
      },
    },
  },
  {
    id: 'Missionaria Protectiva',
    aiEvaluation: (player, gameState) =>
      0 + 1.5 * gameState.playerCardsFactions.bene + 0.5 * gameState.playerCardsRewards['card-draw'],
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player: Player, gameState: GameState, services: GameServices, gameElement) => {
        const playerBeneCardAmount =
          gameState.playerHandCards.filter((x) => x.faction === 'bene').length +
          (gameState.playerDiscardPileCards?.filter((x) => x.faction === 'bene').length ?? 0);

        if (playerBeneCardAmount > 2) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'faction-influence-up-choice' });
        } else if (playerBeneCardAmount > 1) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'intrigue' });
        } else if (playerBeneCardAmount > 0) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'intrigue-trash' });
          services.gameManager.addRewardToPlayer(player.id, { type: 'intrigue' });
        }
      },
    },
  },
  {
    id: 'Upgraded Ornithoper Engines',
    aiEvaluation: (player, gameState) => 11 + 0.75 * gameState.playerCardsBought + 0.25 * gameState.playerCardsTrashed,
  },
  {
    id: 'Spice Refineries',
    aiEvaluation: (player, gameState) => 15 - 0.33 * (gameState.currentRound - 1),
    gameModifiers: {
      fieldCost: [
        {
          id: 'spice-refineries',
          costType: 'spice',
          amount: -1,
          minCosts: 1,
        },
      ],
    },
  },
  { id: 'Planetary Surveillance', aiEvaluation: (player, gameState) => 0 + 0.5 * (gameState.currentRound - 1) },
  { id: 'Improved Projectile Rifles', aiEvaluation: (player, gameState) => 0 + 0.5 * gameState.playerCardsRewards.sword },
  {
    id: 'Deployment Ship',
    aiEvaluation: (player, gameState) => 5 + 1.5 * (gameState.currentRound - 1),
    customTimedAIFunction: {
      timing: 'timing-reveal-turn',
      function: (player: Player, gameState: GameState, services: GameServices, gameElement) => {
        const availablePersuasion = services.playersService.getPlayerPersuasion(player.id);
        const { allCards, imperiumRowCards, recruitableCards } = services.gameManager.getAllBuyableCards(player.id);

        const reducedCards = allCards.map((x) => {
          return {
            ...x,
            persuasionCosts: x.persuasionCosts ? x.persuasionCosts - 1 : undefined,
          };
        });

        const cardToBuy = services.aiManager.getImperiumCardToBuy(availablePersuasion, reducedCards, player, gameState, []);
        if (cardToBuy) {
          let source: 'always-buyable' | 'deck' | 'row' = 'always-buyable';
          if (imperiumRowCards.some((x) => x.id === cardToBuy.id)) {
            source = 'row';
          } else if (recruitableCards.some((x) => x.id === cardToBuy.id)) {
            source = 'deck';
          }

          services.gameManager.acquireImperiumCard(player.id, cardToBuy, source);
          if (cardToBuy.structuredRevealEffects) {
            services.gameManager.resolveStructuredEffects(cardToBuy.structuredRevealEffects, player, gameState);
          } else if (cardToBuy.customRevealEffect) {
            // TODO
          }

          services.gameManager.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
        }
      },
    },
  },
  {
    id: 'Recruitment Hub',
    aiEvaluation: (player, gameState) =>
      15 - 1.5 * (gameState.currentRound - 1) + 1 * gameState.playerHandCardsRewards.solari,
    customTimedAIFunction: {
      timing: 'timing-reveal-turn',
      function: (player: Player, gameState: GameState, services: GameServices, gameElement) => {
        const playerSolariAmount = getResourceAmount(player, 'solari');
        if (playerSolariAmount < 1) {
          return;
        }
        const availablePersuasion = services.playersService.getPlayerPersuasion(player.id);
        const { allCards, imperiumRowCards, recruitableCards } = services.gameManager.getAllBuyableCards(player.id);

        const reducedCards = allCards.map((x) => {
          return {
            ...x,
            persuasionCosts: x.persuasionCosts ? (x.persuasionCosts > 2 ? x.persuasionCosts - 2 : 0) : undefined,
          };
        });

        const cardToBuy = services.aiManager.getImperiumCardToBuy(availablePersuasion, reducedCards, player, gameState, []);
        if (cardToBuy) {
          let source: 'always-buyable' | 'deck' | 'row' = 'always-buyable';
          if (imperiumRowCards.some((x) => x.id === cardToBuy.id)) {
            source = 'row';
          } else if (recruitableCards.some((x) => x.id === cardToBuy.id)) {
            source = 'deck';
          }

          services.gameManager.acquireImperiumCard(player.id, cardToBuy, source, { acquireLocation: 'above-deck' });

          services.gameManager.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
          services.gameManager.payCostForPlayer(player.id, { type: 'solari' }, { gameElement });
        }
      },
    },
  },
  {
    id: 'Controlled Spice Explosions',
    aiEvaluation: (player, gameState) => 5 - 1 * gameState.playerHandCardsRewards.spice,
    customTimedAIFunction: {
      timing: 'timing-reveal-turn',
      function: (player: Player, gameState: GameState, services: GameServices, gameElement) => {
        const spiceSpaces = gameState.boardSpaces.filter((x) => x.actionType === 'spice');
        const waterAmount = getResourceAmount(player, 'water');

        let targetSpace = undefined;
        let targetSpaceWaterCosts = 0;

        for (const spiceSpace of spiceSpaces) {
          let waterCostAmount = 0;
          if (spiceSpace.costs) {
            const waterCosts = spiceSpace.costs.filter((x) => x.type === 'water');
            if (waterCosts.length > 0) {
              const combinedWaterCosts = getFlattenedEffectRewardArray(waterCosts);
              waterCostAmount = combinedWaterCosts[0].amount ?? 1;
            }
          }

          if (waterCostAmount <= waterAmount && waterCostAmount >= targetSpaceWaterCosts) {
            targetSpace = spiceSpace;
            targetSpaceWaterCosts = waterCostAmount;
          }
        }

        if (targetSpace) {
          services.gameManager.addAccumulatedSpiceToField(targetSpace.title.en, 1);
          services.gameManager.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
        }
      },
    },
  },
  {
    id: 'Barrage Rockets',
    aiEvaluation: (player, gameState) =>
      6 + 0.25 * (gameState.currentRound - 1) + 3 * gameState.playerDreadnoughtCount + 2 * gameState.playerLocations.length,
    customTimedAIFunction: {
      timing: 'timing-turn-start',
      function: (player: Player, gameState: GameState, services: GameServices, gameElement) => {
        const playerLocations = gameState.playerLocations;

        if (playerLocations.length < 1) {
          return;
        }

        let activatedEffect = false;
        for (const location of playerLocations) {
          if (activatedEffect) {
            break;
          }

          const locationHasAgentOnIt = gameState.agentsOnFields.some((x) => x.fieldId === location);
          if (!locationHasAgentOnIt) {
            const playerHasAvailableShips =
              gameState.playerCombatUnits.shipsInCombat > 0 || gameState.playerCombatUnits.shipsInGarrison > 0;
            if (!playerHasAvailableShips || Math.random() > 0.5) {
              services.gameModifierService.addPlayerGameModifiers(player.id, {
                fieldBlock: [{ id: 'barrage-rockets-field-block', fieldId: location, currentRoundOnly: true }],
              });
              for (const enemyPlayer of gameState.enemyPlayers) {
                services.gameModifierService.addPlayerGameModifiers(enemyPlayer.id, {
                  fieldBlock: [{ id: 'barrage-rockets-field-block', fieldId: location, currentRoundOnly: true }],
                });
              }
              services.gameManager.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
              activatedEffect = true;
            }
          }
        }
      },
    },
  },
  {
    id: 'Shieldbreakers',
    aiEvaluation: (player, gameState) =>
      2 +
      0.25 * (gameState.currentRound - 1) +
      4 * gameState.playerDreadnoughtCount +
      2 * gameState.enemyCombatUnits.filter((x) => getPlayerdreadnoughtCount(x) > 0).length,
    customTimedAIFunction: {
      timing: 'timing-turn-start',
      function: (player: Player, gameState: GameState, services: GameServices, gameElement) => {
        const enemiesWithDreadnoughtsInCombat = gameState.enemyCombatUnits.filter((x) => x.shipsInCombat > 0).length;
        if (
          enemiesWithDreadnoughtsInCombat < 1 ||
          getResourceAmount(player, 'tech') < 1 ||
          gameState.playerAgentsAvailable > 0
        ) {
          return;
        }

        if (Math.random() + 0.075 * (gameState.currentRound - 1) > 0.5) {
          for (const enemy of gameState.enemyPlayers) {
            services.combatManager.removePlayerShipsFromCombat(enemy.id, 1);
          }
          services.gameManager.payCostForPlayer(player.id, { type: 'tech' });
          services.gameManager.payCostForPlayer(player.id, { type: 'tech-tile-flip' }, { gameElement });
        }
      },
    },
  },
  {
    id: 'Gunship',
    aiEvaluation: (player, gameState) =>
      2 +
      0.25 * (gameState.currentRound - 1) +
      4 * gameState.playerDreadnoughtCount +
      2 * gameState.enemyCombatUnits.filter((x) => getPlayerdreadnoughtCount(x) > 0).length,
    customTimedAIFunction: {
      timing: 'timing-turn-start',
      function: (player: Player, gameState: GameState, services: GameServices, gameElement) => {
        gameState.playerAgentsOnFields.length < 1;
        return;
      },
    },
  },
];
