import { playerCanPayCosts } from '../helpers/rewards';
import { ActionField, StructuredEffect } from '../models';
import { AIAdjustments, GameServices, GameState, TimedFunction } from '../models/ai';
import { Player } from '../models/player';
import { ImperiumDeckCard, ImperiumRowCard } from '../services/cards.service';
import { GameModifiers } from '../services/game-modifier.service';

export interface LeaderGameAdjustments {
  id: string;
  aiAdjustments?: AIAdjustments;
  gameModifiers?: GameModifiers;
  customSignetEffects?: StructuredEffect[];
  customSignetFunction?: (player: Player, gameState: GameState, services: GameServices) => void;
  customSignetAIFunction?: (player: Player, gameState: GameState, services: GameServices) => void;
  customTimedFunction?: TimedFunction;
  customTimedAIFunction?: TimedFunction;
  customEffects?: StructuredEffect[];
  signetRingValue?: (player: Player, gameState: GameState, targetBoardSpace?: ActionField) => number;
  signetTokenOrFieldMarkerValue?: (player: Player, gameState: GameState, targetBoardSpace?: ActionField) => number;
}

export const leadersGameAdjustments: LeaderGameAdjustments[] = [
  {
    id: 'Paul Atreides',
    gameModifiers: {
      fieldBlock: [{ id: 'paul-fremen-access', actionType: 'fremen' }],
    },
    customSignetFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const fremenInfluence = gameState.playerScore['fremen'];
      if (fremenInfluence > 3) {
        services.effectsService.addRewardToPlayer(player.id, { type: 'card-draw' });
        services.effectsService.addRewardToPlayer(player.id, { type: 'troop' });
      } else if (fremenInfluence > 1) {
        services.effectsService.addRewardToPlayer(player.id, { type: 'card-draw' });
        services.effectsService.addRewardToPlayer(player.id, { type: 'agent-lift' });
      }
      services.gameModifierService.addPlayerGameModifiers(player.id, {
        customActions: [
          {
            id: 'paul-vision-intrigues',
            action: 'vision-intrigues',
            currentRoundOnly: true,
          },
          {
            id: 'paul-vision-conflict',
            action: 'vision-conflict',
            currentRoundOnly: true,
          },
        ],
      });
    },
    signetRingValue: (player, gameState) => {
      let value = 1;
      const fremenInfluence = gameState.playerScore['fremen'];
      if (fremenInfluence > 3) {
        if (gameState.playerAgentsOnFields.length > 0) {
          value += 5.0;
        }
      } else if (fremenInfluence > 1) {
        value += 3.5;
      }
      return value;
    },
  },
  {
    id: 'Alia Atreides',
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, services) => {
        if (gameState.playerHandCards.some((card) => card.agentEffects?.some((x) => x.type === 'signet-ring'))) {
          services.effectsService.addRewardToPlayer(player.id, { type: 'faction-influence-down-choice' });
        }
      },
    },
    signetRingValue: (player, gameState) => 5,
  },
  {
    id: 'Duke Leto Atreides',
    gameModifiers: {
      customActions: [
        {
          id: 'leto-inspiring-loyalty',
          action: 'field-marker',
        },
      ],
    },
    customSignetAIFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const possibleNewMarkerLocations = gameState.boardSpaces.filter(
        (x) => x.ownerReward && gameState.playerAgentsOnFields.some((agent) => agent.fieldId === x.title.en),
      );
      const playerOwnedLocations = services.locationManager.getPlayerLocations(player.id);
      const fieldMarkers = services.gameModifierService.getPlayerGameModifier(player.id, 'fieldMarkers');

      if (fieldMarkers) {
        fieldMarkers.sort((a, b) => a.amount - b.amount);
        for (const fieldMarker of fieldMarkers) {
          if (fieldMarker.amount > 1 && !playerOwnedLocations.some((x) => x.locationId === fieldMarker.fieldId)) {
            services.audioManager.playSound('location-control');
            services.gameModifierService.changeFieldMarkerModifier(player.id, fieldMarker.fieldId, -2);
            services.locationManager.setLocationOwner(fieldMarker.fieldId, player.id);
            services.loggingService.logPlayerGainedLocationControl(player.id, gameState.currentRound, fieldMarker.fieldId);
          } else {
            if (possibleNewMarkerLocations.some((x) => x.title.en === fieldMarker.fieldId)) {
              services.gameModifierService.changeFieldMarkerModifier(player.id, fieldMarker.fieldId, 1);
            }
          }
        }
      } else if (possibleNewMarkerLocations.length > 0) {
        services.gameModifierService.changeFieldMarkerModifier(player.id, possibleNewMarkerLocations[0].title.en, 1);
      }
    },
    signetRingValue: (player, gameState, targetBoardSpace) => {
      const playerAgentsOnFields = gameState.playerAgentsOnFields;
      if (targetBoardSpace) {
        playerAgentsOnFields.push({ playerId: player.id, fieldId: targetBoardSpace.title.en, state: 'placed' });
      }
      let value = 0;
      if (gameState.playerGameModifiers?.fieldMarkers?.some((x) => x.amount > 1)) {
        value += 6;
      } else if (playerAgentsOnFields.length > 0) {
        value += 3;
      }
      return value;
    },
    signetTokenOrFieldMarkerValue: (player, gameState) => 3,
  },
  {
    id: 'Feyd-Rautha Harkonnen',
    customSignetEffects: [{ type: 'reward', effectRewards: [{ type: 'signet' }] }],
    customTimedAIFunction: {
      timing: 'timing-round-start',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        if (
          gameState.playerDeckCards.length + gameState.playerHandCards.length > 8 &&
          gameState.playerIntrigueCount < 2 &&
          Math.random() > 0.33
        ) {
          services.effectsService.addRewardToPlayer(player.id, { type: 'card-destroy' });
          services.effectsService.addRewardToPlayer(player.id, { type: 'intrigue' });
          services.effectsService.addRewardToPlayer(player.id, { type: 'intrigue' });
          services.effectsService.payCostForPlayer(player.id, { type: 'intrigue-trash' });
        }
      },
    },
    customEffects: [
      {
        type: 'helper-trade',
        timing: { type: 'timing-combat' },
        effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
        effectConversions: { type: 'reward', effectRewards: [{ type: 'sword' }] },
      },
    ],
    signetTokenOrFieldMarkerValue: (player, gameState) => 0.75,
  },
  {
    id: 'Count Glossu Rabban',
    customEffects: [{ type: 'reward', timing: { type: 'timing-round-start' }, effectRewards: [{ type: 'card-destroy' }] }],
    customSignetAIFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const resourceOptions = gameState.boardSpaces
        .filter((bs) => gameState.playerLocations.includes(bs.title.en))
        .map((x) => x.ownerReward)
        .filter((x) => x !== undefined);

      const resourceChoices = services.aiEffectEvaluationService.getDesiredRewardEffects(player, resourceOptions, gameState);
      for (const choice of resourceChoices) {
        services.effectsService.addRewardToPlayer(player.id, choice);
      }
    },
    customTimedAIFunction: {
      timing: 'timing-game-start',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        const possibleLocations = ['Arrakeen', 'Carthag', 'Imperial Basin'];
        const randomIndex = Math.floor(Math.random() * possibleLocations.length);
        const chosenLocation = possibleLocations[randomIndex];

        services.loggingService.logPlayerGainedLocationControl(player.id, 1, chosenLocation);
        services.locationManager.setLocationOwner(chosenLocation, player.id);
      },
    },
    signetRingValue: (player, gameState) => {
      return gameState.playerLocations.length * 2;
    },
  },
  {
    id: 'Chani Kynes',
    gameModifiers: {
      fieldCost: [{ id: 'chani-spice-field-costs', actionType: 'spice', costType: 'water', amount: -1 }],
      fieldReward: [{ id: 'chani-spice-field-rewards', actionType: 'spice', rewardType: 'spice', amount: -1 }],
    },
    customTimedAIFunction: {
      timing: 'timing-reveal-turn',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        const availableSignetTokens = gameState.playerResources.signet;
        if (availableSignetTokens < 1) {
          return;
        }

        const availablePersuasion = services.playersService.getPlayerPersuasion(player.id);
        const { allCards, imperiumRowCards, recruitableCards } = services.cardsService.getAllBuyableCards(
          services.turnInfoService.getPlayerTurnInfo(player.id, 'factionRecruitment'),
        );

        const reducedFremenCards: (ImperiumDeckCard & { originalPersuasionCosts?: number })[] = allCards.map((x) => {
          if (x.faction !== 'fremen') {
            return x;
          } else {
            return {
              ...x,
              persuasionCosts: x.persuasionCosts
                ? x.persuasionCosts >= availableSignetTokens
                  ? x.persuasionCosts - availableSignetTokens
                  : 0
                : 0,
              originalPersuasionCosts: x.persuasionCosts ?? 0,
            };
          }
        });

        const cardToBuy = services.aiCardsService.getImperiumCardToBuy(
          availablePersuasion,
          reducedFremenCards,
          player,
          gameState,
          [],
        );
        if (cardToBuy?.faction === 'fremen' && cardToBuy.originalPersuasionCosts) {
          let source: 'always-buyable' | 'deck' | 'row' = 'always-buyable';
          if (imperiumRowCards.some((x) => x.id === cardToBuy.id)) {
            source = 'row';
          } else if (recruitableCards.some((x) => x.id === cardToBuy.id)) {
            source = 'deck';
          }

          const usedSignetTokens =
            cardToBuy.originalPersuasionCosts < availableSignetTokens
              ? cardToBuy.originalPersuasionCosts
              : availableSignetTokens;

          services.gameManager.acquireImperiumCard(player.id, cardToBuy, source);
          services.effectsService.payCostForPlayer(player.id, { type: 'signet', amount: usedSignetTokens });
        }
      },
    },
    signetTokenOrFieldMarkerValue: (player, gameState) => 1.75,
  },
  {
    id: 'Stilgar',
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => {
        if (gameState.playerResources.signet < 1 || gameState.playerCombatUnits.troopsInGarrison < 1) {
          return 0;
        } else {
          return field.rewards.some((x) => x.type === 'combat') ? 0.05 : 0;
        }
      },
    },
    customEffects: [
      {
        timing: { type: 'timing-combat' },
        type: 'helper-trade',
        effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
        effectConversions: { type: 'reward', effectRewards: [{ type: 'sword', amount: 3 }] },
      },
    ],
    gameModifiers: {
      fieldFactionAccess: [
        {
          id: 'liet-fremen',
          fieldId: 'Sietch Tabr',
        },
      ],
    },
    signetTokenOrFieldMarkerValue: (player, gameState) => 3,
  },
  {
    id: 'Liet Kynes',
    gameModifiers: {
      factionInfluence: [
        {
          id: 'liet',
          factionType: 'fremen',
          noInfluence: true,
          alternateReward: {
            type: 'water',
          },
        },
      ],
      fieldFactionAccess: [
        {
          id: 'liet-fremen',
          factionType: 'fremen',
        },
      ],
    },
    customSignetAIFunction(player, gameState, services) {
      if (gameState.playerResources.signet > 2) {
        services.effectsService.addRewardToPlayer(player.id, { type: 'victory-point' });
        services.effectsService.payCostForPlayer(player.id, { type: 'signet', amount: 3 });
      } else if (gameState.playerResources.water > 1) {
        services.effectsService.payCostForPlayer(player.id, { type: 'water', amount: 2 });
        services.effectsService.addRewardToPlayer(player.id, { type: 'signet', amount: 3 });
      } else {
        services.effectsService.addRewardToPlayer(player.id, { type: 'signet' });
      }
    },
    signetRingValue: (player, gameState) => {
      let value = 2.5;
      if (gameState.playerResources.signet > 2) {
        value += 10;
      } else {
        value += 1 * gameState.playerResources.signet;
      }
      return value;
    },
  },
  {
    id: 'Princess Irulan Corrino',
    gameModifiers: {
      factionInfluence: [
        {
          id: 'irulan',
          factionType: 'emperor',
          noInfluence: true,
          alternateReward: {
            type: 'solari',
          },
        },
      ],
      fieldFactionAccess: [
        {
          id: 'irulan-emperor',
          factionType: 'emperor',
        },
      ],
      customActions: [
        {
          id: 'irulan-field-history',
          action: 'field-marker',
        },
      ],
    },
    customSignetAIFunction: (player, gameState, services) => {
      const possibleNewMarkerLocations = gameState.playerAgentsOnFields.map((x) => x.fieldId);

      if (possibleNewMarkerLocations.length > 0) {
        const randomIndex = Math.floor(Math.random() * possibleNewMarkerLocations.length);
        services.gameModifierService.changeFieldMarkerModifier(player.id, possibleNewMarkerLocations[randomIndex], 1);
      }
    },
    customTimedFunction: {
      timing: 'timing-agent-placement',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        const playerFieldMarkers = services.gameModifierService.getPlayerGameModifier(player.id, 'fieldMarkers');
        if (!playerFieldMarkers) {
          return;
        } else {
          const fieldWithMarker = gameState.playerAgentsOnFields.find((x) =>
            playerFieldMarkers.some((marker) => marker.fieldId === x.fieldId && marker.amount > 0),
          );
          if (fieldWithMarker) {
            services.gameModifierService.changeFieldMarkerModifier(player.id, fieldWithMarker.fieldId, -1);
            services.effectsService.addRewardToPlayer(player.id, { type: 'card-draw', amount: 2 });
          }
        }
      },
    },
    signetRingValue: (player, gameState, targetBoardSpace) => {
      const playerAgentsOnFields = gameState.playerAgentsOnFields;
      if (targetBoardSpace) {
        playerAgentsOnFields.push({ playerId: player.id, fieldId: targetBoardSpace.title.en, state: 'placed' });
      }
      return playerAgentsOnFields.length > 0 ? 2.75 : 0;
    },
    signetTokenOrFieldMarkerValue: (player, gameState) => 4.5,
  },
  {
    id: 'Lady Margot Fenring',
    customEffects: [
      {
        type: 'helper-trade',
        timing: { type: 'timing-round-start' },
        effectCosts: { type: 'reward', effectRewards: [{ type: 'card-discard' }] },
        effectConversions: { type: 'reward', effectRewards: [{ type: 'card-draw' }, { type: 'turn-pass' }] },
      },
    ],
    customSignetFunction: (player: Player, gameState: GameState, services: GameServices) => {
      services.gameModifierService.addPlayerGameModifiers(player.id, {
        customActions: [
          {
            id: 'margot-charm',
            action: 'charm',
            currentRoundOnly: true,
          },
        ],
      });
    },
    customSignetAIFunction: (player: Player, gameState: GameState, services: GameServices) => {
      let targetCard: ImperiumRowCard | undefined;
      const handCardAmount = gameState.playerHandCards.length;
      const buyableCards = gameState.imperiumRowCards.filter(
        (x) => x.type === 'imperium-card' && x.persuasionCosts && x.persuasionCosts <= handCardAmount,
      );
      if (buyableCards.length > 0) {
        buyableCards.sort((a, b) => (b.persuasionCosts ?? 0) - (a.persuasionCosts ?? 0));
        targetCard = buyableCards[0] as ImperiumRowCard;
      } else {
        const nonBuyableCards = gameState.imperiumRowCards.filter(
          (x) => x.persuasionCosts && x.persuasionCosts > handCardAmount,
        );
        if (nonBuyableCards.length > 0) {
          nonBuyableCards.sort((a, b) => (b.persuasionCosts ?? 0) - (a.persuasionCosts ?? 0));
          targetCard = nonBuyableCards[0] as ImperiumRowCard;
        }
      }
      if (targetCard) {
        services.gameModifierService.addPlayerImperiumRowModifier(player.id, {
          cardId: targetCard.id,
          persuasionAmount: -1,
        });
        const enemyPlayers = services.playersService.getEnemyPlayers(player.id);
        for (const player of enemyPlayers) {
          services.gameModifierService.addPlayerImperiumRowModifier(player.id, {
            cardId: targetCard.id,
            persuasionAmount: 1,
          });
        }
      }
    },
    signetRingValue: (player, gameState) => 2.5,
  },
  {
    id: 'Count Hasimir Fenring',
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => {
        if (gameState.playerResources.signet < 1 || gameState.playerCombatUnits.troopsInGarrison < 1) {
          return 0;
        } else {
          return field.rewards.some((x) => x.type === 'combat') ? 0.05 : 0;
        }
      },
    },
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, services) => {
        if (gameState.playerResources.signet > 0) {
          services.effectsService.resolveStructuredEffects(
            [
              {
                type: 'helper-or',
                timing: { type: 'timing-reveal-turn' },
                effectLeft: {
                  type: 'helper-trade',
                  effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
                  effectConversions: { type: 'reward', effectRewards: [{ type: 'sword', amount: 2 }] },
                },
                effectRight: {
                  type: 'helper-trade',
                  effectCosts: { type: 'reward', effectRewards: [{ type: 'signet' }] },
                  effectConversions: { type: 'reward', effectRewards: [{ type: 'intrigue' }] },
                },
              },
            ],
            player,
            gameState,
          );
        }
      },
    },
    signetTokenOrFieldMarkerValue: (player, gameState) => 2.5 - 1.0 * gameState.playerResources.signet,
  },
  {
    id: 'Tessia Vernius',
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player, gameState, services) => {
        if (gameState.playerTechTiles.length > 0) {
          services.effectsService.resolveStructuredEffects(
            [
              {
                type: 'helper-trade',
                timing: { type: 'timing-reveal-turn' },
                effectCosts: { type: 'reward', effectRewards: [{ type: 'tech-tile-trash' }] },
                effectConversions: { type: 'reward', effectRewards: [{ type: 'faction-influence-up-choice' }] },
              },
            ],
            player,
            gameState,
          );
        }
      },
    },
  },
  {
    id: 'Count August Metulli',
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'high-council', modifier: -0.2 }],
      fieldEvaluationModifier: (player, gameState, field) =>
        field.rewards.some((x) => x.type === 'persuasion') ? -0.05 : 0.0,
    },
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        const playerVictoryPoints = gameState.playerScore.victoryPoints;
        const playerPersuasion =
          player.permanentPersuasion + player.persuasionGainedThisRound - player.persuasionSpentThisRound;

        services.playerResourcesService.addResourceToPlayer(player.id, 'signet', playerVictoryPoints + playerPersuasion);
        services.playersService.removePersuasionGainedFromPlayer(
          player.id,
          player.permanentPersuasion + player.persuasionGainedThisRound,
        );
      },
    },
    customSignetAIFunction: (player, gameState, services) => {
      const playerSignetTokens = gameState.playerResources.signet;
      const imperiumRowCards = gameState.imperiumRowCards.filter(
        (x) => x.type === 'imperium-card' && (x.persuasionCosts ?? 0) <= playerSignetTokens,
      ) as ImperiumRowCard[];
      if (imperiumRowCards.length < 1) {
        return;
      }

      let chosenImperiumRowCard: ImperiumRowCard | undefined;
      let bestEffectValue = 0;
      for (const card of imperiumRowCards) {
        if (card.structuredAgentEffects) {
          const effectEvaluation = services.aiEffectEvaluationService.getStructuredEffectUsefulnesAndCosts(
            card.structuredAgentEffects,
            player,
            gameState,
          );
          if (
            effectEvaluation.usefullness > bestEffectValue &&
            playerCanPayCosts(effectEvaluation.costs, player, gameState)
          ) {
            chosenImperiumRowCard = card;
            bestEffectValue = effectEvaluation.usefullness;
          }
        }
      }

      if (chosenImperiumRowCard && chosenImperiumRowCard.structuredAgentEffects) {
        if (chosenImperiumRowCard.persuasionCosts) {
          services.effectsService.payCostForPlayer(player.id, {
            type: 'signet',
            amount: chosenImperiumRowCard.persuasionCosts,
          });
        }
        services.effectsService.resolveStructuredEffects(chosenImperiumRowCard.structuredAgentEffects, player, gameState);
      }
    },
    signetRingValue: (player, gameState) => {
      const potentialImperiumRowCards = gameState.imperiumRowCards.filter(
        (x) =>
          x.type === 'imperium-card' &&
          x.structuredAgentEffects &&
          gameState.playerResources.signet >= (x.persuasionCosts ?? 0),
      );
      return potentialImperiumRowCards.length > 0 ? 2.5 + 1.0 * potentialImperiumRowCards.length : 0;
    },
  },
  {
    id: 'Lunara Metulli',
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => {
        if (gameState.playerResources.signet < 1) {
          return 0;
        } else {
          return field.rewards.some((x) => x.type === 'water' || x.type === 'spice') ? 0.05 : 0;
        }
      },
    },
    customTimedFunction: {
      timing: 'timing-game-start',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        services.effectsService.addRewardToPlayer(player.id, { type: 'solari', amount: -2 }, { valuesCanBeNegative: true });
      },
    },
    customTimedAIFunction: {
      timing: 'timing-agent-placement',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        if (gameState.playerResources.signet < 1) {
          return;
        }

        const boardSpace = gameState.boardSpaces.find((x) => x.title.en === gameState.playerAgentPlacedOnFieldThisTurn);
        if (boardSpace) {
          for (const reward of boardSpace.rewards) {
            if (reward.type === 'water' || reward.type === 'spice') {
              services.effectsService.addRewardToPlayer(player.id, { type: reward.type });
              services.effectsService.payCostForPlayer(player.id, { type: 'signet' });
              break;
            }
            if (reward.type === 'solari' && gameState.playerResources.signet > 1) {
              services.effectsService.addRewardToPlayer(player.id, { type: reward.type });
              services.effectsService.payCostForPlayer(player.id, { type: 'signet' });
              break;
            }
          }
        }
      },
    },
    signetTokenOrFieldMarkerValue: (player, gameState) => 2.75,
  },
  {
    id: 'Eva Moritani',
    gameModifiers: {
      customActions: [
        {
          id: 'eva-labour-camps',
          action: 'field-marker',
        },
      ],
    },
  },
  {
    id: 'Dara Moritani',
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'swordmaster', modifier: 0.2 }],
    },
    gameModifiers: {
      fieldEnemyAgentAccess: [
        {
          id: 'dara-enemy-access',
          actionTypes: ['bene', 'choam', 'emperor', 'fremen', 'guild', 'landsraad', 'spice', 'town'],
        },
      ],
      fieldCost: [{ id: 'dara-landsraad-costs', actionType: 'landsraad', costType: 'solari', amount: 2 }],
    },
    customSignetFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const rewardAmount = gameState.playerAgentsOnFields.filter((pa) =>
        gameState.enemyAgentsOnFields.some((ea) => ea.fieldId === pa.fieldId),
      ).length;

      services.effectsService.addRewardToPlayer(player.id, { type: 'spice', amount: rewardAmount });
    },
    signetRingValue: (player, gameState, targetBoardSpace) => {
      const playerAgentsOnFields = gameState.playerAgentsOnFields;
      if (targetBoardSpace) {
        playerAgentsOnFields.push({ playerId: player.id, fieldId: targetBoardSpace.title.en, state: 'placed' });
      }
      return (
        1 +
        2.0 *
          gameState.enemyAgentsOnFields.filter((enemy) =>
            playerAgentsOnFields.some((player) => player.fieldId === enemy.fieldId),
          ).length
      );
    },
  },
  {
    id: 'Earl Memnon Thorvald',
    aiAdjustments: {
      fieldEvaluationModifier: (player, gameState, field) => {
        if (gameState.playerResources.solari < 1) {
          return 0;
        } else {
          return field.actionType === 'landsraad' ? 0.05 : 0;
        }
      },
    },
    customTimedAIFunction: {
      timing: 'timing-agent-placement',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        if (!player.hasSwordmaster && gameState.currentRound < 4) {
          return;
        }

        const field = gameState.boardSpaces.find((x) => x.title.en === gameState.playerAgentPlacedOnFieldThisTurn);
        if (!field || field.actionType !== 'landsraad') {
          return;
        }

        if (gameState.playerCombatUnits.troopsInGarrison < 6) {
          if (gameState.playerResources.solari > 0) {
            services.effectsService.payCostForPlayer(player.id, { type: 'solari' });
            services.effectsService.addRewardToPlayer(player.id, { type: 'troop' });
          }
        }
      },
    },
  },
  {
    id: 'The Preacher',
    gameModifiers: {
      fieldEnemyAgentAccess: [
        {
          id: 'preacher-enemy-access',
          actionTypes: ['town'],
        },
      ],
    },
    customSignetFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const enemyLocation = gameState.enemyLocations.find(
        (x) => x.locationId === gameState.playerAgentPlacedOnFieldThisTurn,
      );
      if (enemyLocation) {
        services.effectsService.payCostForPlayer(enemyLocation.playerId, { type: 'card-discard' });
      } else {
        services.effectsService.addRewardToPlayer(player.id, { type: 'focus' });
      }
    },
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        for (const agentOnField of gameState.playerAgentsOnFields) {
          const isEnemyLocation = gameState.enemyLocations.some((x) => x.locationId === agentOnField.fieldId);
          if (isEnemyLocation) {
            services.effectsService.addRewardToPlayer(player.id, { type: 'persuasion' });
          }
        }
      },
    },
    signetRingValue: (player, gameState) => 2,
  },
];
