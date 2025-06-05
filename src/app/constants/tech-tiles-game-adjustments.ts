import { GameState } from '../models/ai';
import { Player } from '../models/player';
import { GameModifiers } from '../services/game-modifier.service';

export interface TechTileGameAdjustments {
  id: string;
  aiEvaluation?: (player: Player, gameState: GameState) => number; //Keep costs in mind, Max value should be 20, min 0
  gameModifiers?: GameModifiers;
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
  },
  {
    id: 'Botanical Research Station',
    aiEvaluation: (player, gameState) =>
      0 + 1.5 * gameState.playerCardsFactions.fremen + 0.5 * gameState.playerCardsRewards['card-draw'],
  },
  {
    id: 'Sardaukar Commando Post',
    aiEvaluation: (player, gameState) =>
      0 + 1.5 * gameState.playerCardsFactions.emperor + 0.5 * gameState.playerCardsRewards['card-draw'],
  },
  {
    id: 'Missionaria Protectiva',
    aiEvaluation: (player, gameState) =>
      0 + 1.5 * gameState.playerCardsFactions.bene + 0.5 * gameState.playerCardsRewards['card-draw'],
  },
  {
    id: 'Upgraded Ornithoper Engines',
    aiEvaluation: (player, gameState) => 11 + 0.75 * gameState.playerCardsBought + 0.25 * gameState.playerCardsTrashed,
  },
  {
    id: 'Barrage Rockets',
    aiEvaluation: (player, gameState) => 9 + 0.25 * (gameState.currentRound - 1) + 4 * gameState.playerDreadnoughtCount,
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
  { id: 'Shieldbreakers', aiEvaluation: (player, gameState) => 0.0 + 9 * gameState.playerDreadnoughtCount },
  {
    id: 'Gunship',
    aiEvaluation: (player, gameState) => 1 + 0.25 * (gameState.currentRound - 1),
  },
  { id: 'Planetary Surveillance', aiEvaluation: (player, gameState) => 0 + 0.5 * (gameState.currentRound - 1) },
  { id: 'Improved Projectile Rifles', aiEvaluation: (player, gameState) => 0 + 0.5 * gameState.playerCardsRewards.sword },
];
