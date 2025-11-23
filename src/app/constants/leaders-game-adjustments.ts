import { EffectTimingType, StructuredChoiceEffect, StructuredEffect } from '../models';
import { AIAdjustments, GameServices, GameState } from '../models/ai';
import { Player } from '../models/player';
import { ImperiumRowCard } from '../services/cards.service';
import { GameModifiers } from '../services/game-modifier.service';

interface TimedFunction {
  timing: EffectTimingType;
  function: (player: Player, gameState: GameState, services: GameServices) => void;
}

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
      imperiumRow: [
        {
          id: 'chani',
          factionType: 'fremen',
          persuasionAmount: -1,
          minCosts: 1,
        },
      ],
      fieldCost: [{ id: 'chani-spice-field-costs', actionType: 'spice', costType: 'water', amount: -1 }],
      fieldReward: [{ id: 'chani-spice-field-rewards', actionType: 'spice', rewardType: 'spice', amount: -1 }],
    },
    signetTokenValue: 1.75,
  },
  {
    id: 'The Preacher',
    customTimedFunction: {
      timing: 'timing-reveal-turn',
      function: (player: Player, gameState: GameState, services: GameServices) => {
        const townBoardSpaces = gameState.boardSpaces.filter((x) => x.actionType === 'town');
        const agentsOnTownFields = gameState.playerAgentsOnFields.filter((x) =>
          townBoardSpaces.some((bs) => bs.title.en === x.fieldId)
        );
        if (agentsOnTownFields.length > 0) {
          for (const item of agentsOnTownFields) {
            const choiceEffect: StructuredChoiceEffect = {
              type: 'helper-or',
              effectLeft: {
                type: 'reward',
                effectRewards: [{ type: 'persuasion' }],
              },
              effectRight: {
                type: 'reward',
                effectRewards: [{ type: 'focus' }],
              },
            };
            services.turnInfoService.updatePlayerTurnInfo(player.id, { effectChoices: [choiceEffect] });
          }
          services.gameManager.resolveRewardChoices(player);
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
            playerFieldMarkers.some((marker) => marker.fieldId === x.fieldId && marker.amount > 0)
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
        (x) => x.type === 'imperium-card' && x.persuasionCosts && x.persuasionCosts <= handCardAmount
      );
      if (buyableCards.length > 0) {
        buyableCards.sort((a, b) => (b.persuasionCosts ?? 0) - (a.persuasionCosts ?? 0));
        targetCard = buyableCards[0] as ImperiumRowCard;
      } else {
        const nonBuyableCards = gameState.imperiumRowCards.filter(
          (x) => x.persuasionCosts && x.persuasionCosts > handCardAmount
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
  },
  {
    id: 'Lunara Metulli',
    aiAdjustments: {
      goalEvaluationModifier: () => [{ type: 'high-council', modifier: -0.2 }],
      fieldEvaluationModifier: (player, gameState, field) =>
        field.rewards.some((x) => x.type === 'persuasion') ? -0.05 : 0.0,
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
      const possibleNewMarkerLocations = gameState.playerAgentsOnFields.map((x) => x.fieldId);
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
            if (possibleNewMarkerLocations.includes(fieldMarker.fieldId)) {
              services.gameModifierService.changeFieldMarkerModifier(player.id, fieldMarker.fieldId, 1);
            }
          }
        }
      } else if (possibleNewMarkerLocations.length > 0) {
        services.gameModifierService.changeFieldMarkerModifier(player.id, possibleNewMarkerLocations[0], 1);
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
        gameState.enemyAgentsOnFields.some((ea) => ea.fieldId === pa.fieldId)
      ).length;

      services.gameManager.addRewardToPlayer(player.id, { type: 'spice', amount: rewardAmount });
    },
  },
];
