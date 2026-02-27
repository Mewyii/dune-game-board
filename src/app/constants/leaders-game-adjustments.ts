import { getResourceAmount } from '../helpers/ai';
import { playerCanPayCosts } from '../helpers/rewards';
import { StructuredEffect } from '../models';
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
  signetTokenValue?: number;
}

export const leadersGameAdjustments: LeaderGameAdjustments[] = [
  {
    id: 'Stilgar',
    customEffects: [
      {
        timing: { type: 'timing-combat' },
        type: 'helper-trade',
        effectCosts: { type: 'reward', effectRewards: [{ type: 'signet-token' }] },
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
    signetTokenValue: 2.5,
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
      const playerWater = player.resources.find((x) => x.type === 'water');
      if (player.signetTokenCount > 2) {
        services.gameManager.addRewardToPlayer(player.id, { type: 'victory-point' });
        services.gameManager.payCostForPlayer(player.id, { type: 'signet-token', amount: 3 });
      } else if (playerWater && playerWater.amount && playerWater.amount > 1) {
        services.gameManager.payCostForPlayer(player.id, { type: 'water', amount: 2 });
        services.gameManager.addRewardToPlayer(player.id, { type: 'signet-token', amount: 3 });
      } else {
        services.gameManager.addRewardToPlayer(player.id, { type: 'signet-token' });
      }
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
        const availableSignetTokens = player.signetTokenCount;
        if (availableSignetTokens < 1) {
          return;
        }

        const availablePersuasion = services.playersService.getPlayerPersuasion(player.id);
        const { allCards, imperiumRowCards, recruitableCards } = services.gameManager.getAllBuyableCards(player.id);

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

        const cardToBuy = services.aiManager.getImperiumCardToBuy(
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
          services.gameManager.payCostForPlayer(player.id, { type: 'signet-token', amount: usedSignetTokens });
        }
      },
    },
    signetTokenValue: 1.75,
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
        services.gameManager.payCostForPlayer(enemyLocation.playerId, { type: 'card-discard' });
      } else {
        services.gameManager.addRewardToPlayer(player.id, { type: 'focus' });
      }
    },
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        for (const agentOnField of gameState.playerAgentsOnFields) {
          const isEnemyLocation = gameState.enemyLocations.some((x) => x.locationId === agentOnField.fieldId);
          if (isEnemyLocation) {
            services.gameManager.addRewardToPlayer(player.id, { type: 'persuasion' });
          }
        }
      },
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
            services.gameManager.addRewardToPlayer(player.id, { type: 'card-draw', amount: 2 });
          }
        }
      },
    },
    signetTokenValue: 2.5,
  },
  {
    id: 'Feyd-Rautha Harkonnen',
    customSignetEffects: [{ type: 'reward', effectRewards: [{ type: 'signet-token' }] }],
    customEffects: [
      {
        type: 'helper-trade',
        timing: { type: 'timing-combat' },
        effectCosts: { type: 'reward', effectRewards: [{ type: 'signet-token' }] },
        effectConversions: { type: 'reward', effectRewards: [{ type: 'sword' }] },
      },
    ],
    signetTokenValue: 0.5,
  },
  {
    id: 'Count Hasimir Fenring',
    customEffects: [
      {
        type: 'helper-or',
        timing: { type: 'timing-reveal-turn' },
        effectLeft: {
          type: 'helper-trade',
          effectCosts: { type: 'reward', effectRewards: [{ type: 'signet-token' }] },
          effectConversions: { type: 'reward', effectRewards: [{ type: 'sword', amount: 2 }] },
        },
        effectRight: {
          type: 'helper-trade',
          effectCosts: { type: 'reward', effectRewards: [{ type: 'signet-token' }] },
          effectConversions: { type: 'reward', effectRewards: [{ type: 'intrigue' }] },
        },
      },
    ],
    signetTokenValue: 2.0,
  },
  {
    id: 'Lady Margot Fenring',
    gameModifiers: {
      customActions: [
        {
          id: 'margot-charm',
          action: 'charm',
        },
      ],
    },
    customEffects: [
      {
        type: 'helper-trade',
        timing: { type: 'timing-round-start' },
        effectCosts: { type: 'reward', effectRewards: [{ type: 'card-discard' }] },
        effectConversions: { type: 'reward', effectRewards: [{ type: 'card-draw' }, { type: 'turn-pass' }] },
      },
    ],
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
  },
  {
    id: 'Tessia Vernius',
    customEffects: [
      {
        type: 'helper-trade',
        timing: { type: 'timing-reveal-turn' },
        effectCosts: { type: 'reward', effectRewards: [{ type: 'tech-tile-trash' }] },
        effectConversions: { type: 'reward', effectRewards: [{ type: 'faction-influence-up-choice' }] },
      },
    ],
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

        services.playersService.addSignetTokensToPlayer(player.id, playerVictoryPoints + playerPersuasion);
        services.playersService.removePersuasionGainedFromPlayer(
          player.id,
          player.permanentPersuasion + player.persuasionGainedThisRound,
        );
      },
    },
    customSignetAIFunction: (player, gameState, services) => {
      const playerSignetTokens = player.signetTokenCount;
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
          const effectEvaluation = services.aiManager.getStructuredEffectUsefulnesAndCosts(
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
          services.gameManager.payCostForPlayer(player.id, {
            type: 'signet-token',
            amount: chosenImperiumRowCard.persuasionCosts,
          });
        }
        services.gameManager.resolveStructuredEffects(chosenImperiumRowCard.structuredAgentEffects, player, gameState);
      }
    },
    signetTokenValue: 0.25,
  },
  {
    id: 'Lunara Metulli',
    customTimedFunction: {
      timing: 'timing-game-start',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        services.gameManager.addRewardToPlayer(player.id, { type: 'solari', amount: -2 }, { valuesCanBeNegative: true });
      },
    },
    customTimedAIFunction: {
      timing: 'timing-agent-placement',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        if (player.signetTokenCount < 1) {
          return;
        }

        const boardSpace = gameState.boardSpaces.find((x) => x.title.en === gameState.playerAgentPlacedOnFieldThisTurn);
        if (boardSpace) {
          for (const reward of boardSpace.rewards) {
            if (reward.type === 'water' || reward.type === 'spice') {
              services.gameManager.addRewardToPlayer(player.id, { type: reward.type });
              services.gameManager.payCostForPlayer(player.id, { type: 'signet-token' });
              break;
            }
            if (reward.type === 'solari' && player.signetTokenCount > 1) {
              services.gameManager.addRewardToPlayer(player.id, { type: reward.type });
              services.gameManager.payCostForPlayer(player.id, { type: 'signet-token' });
              break;
            }
          }
        }
      },
    },
  },
  {
    id: 'Emperor Paul Atreides',
    gameModifiers: {
      customActions: [
        {
          id: 'emperor-paul-vision-deck',
          action: 'vision-deck',
        },
        {
          id: 'emperor-paul-vision-intrigues',
          action: 'vision-intrigues',
        },
        {
          id: 'emperor-paul-vision-conflict',
          action: 'vision-conflict',
        },
      ],
    },
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
    signetTokenValue: 2,
  },
  {
    id: 'Count Glossu Rabban',
    customEffects: [{ type: 'reward', timing: { type: 'timing-round-start' }, effectRewards: [{ type: 'card-destroy' }] }],
    customSignetAIFunction: (player: Player, gameState: GameState, services: GameServices) => {
      const resourceOptions = gameState.boardSpaces
        .filter((bs) => gameState.playerLocations.includes(bs.title.en))
        .map((x) => x.ownerReward)
        .filter((x) => x !== undefined);

      const resourceChoices = services.aiManager.getPreferredRewardEffects(player, resourceOptions, gameState);
      for (const choice of resourceChoices) {
        services.gameManager.addRewardToPlayer(player.id, choice);
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

      services.gameManager.addRewardToPlayer(player.id, { type: 'spice', amount: rewardAmount });
    },
  },
  {
    id: 'Earl Memnon Thorvald',
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
          if (getResourceAmount(player, 'solari') > 0) {
            services.gameManager.payCostForPlayer(player.id, { type: 'solari' });
            services.gameManager.addRewardToPlayer(player.id, { type: 'troop' });
          }
        }
      },
    },
  },
  {
    id: 'Feyd-Rautha Harkonnen',
    customTimedAIFunction: {
      timing: 'timing-round-start',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        if (
          gameState.playerDeckCards.length + gameState.playerHandCards.length > 8 &&
          gameState.playerIntrigueCount < 2 &&
          Math.random() > 0.33
        ) {
          services.gameManager.addRewardToPlayer(player.id, { type: 'card-destroy' });
          services.gameManager.addRewardToPlayer(player.id, { type: 'intrigue' });
          services.gameManager.addRewardToPlayer(player.id, { type: 'intrigue' });
          services.gameManager.payCostForPlayer(player.id, { type: 'intrigue-trash' });
        }
      },
    },
  },
];
