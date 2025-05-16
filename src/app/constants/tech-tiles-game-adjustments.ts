import { Player } from '../models/player';
import { GameState } from '../services/ai/models';
import { GameModifiers } from '../services/game-modifier.service';

export interface TechTileGameAdjustments {
  id: string;
  aiEvaluation?: (player: Player, gameState: GameState) => number;
  gameModifiers?: GameModifiers;
}

export const techTilesGameAdjustments: TechTileGameAdjustments[] = [
  {
    id: 'Maula Pistol Works',
    aiEvaluation: (player, gameState) =>
      0.25 + 0.05 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsRewards.solari,
  },
  {
    id: 'Smuggler outposts',
    aiEvaluation: (player, gameState) =>
      0.6 - 0.02 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsRewards.solari,
  },
  {
    id: 'Imperial Barracks',
    aiEvaluation: (player, gameState) =>
      0.4 +
      0.033 * (gameState.currentRound - 1) +
      0.066 * gameState.playerCardsRewards.solari -
      0.033 * gameState.playerCardsRewards.troop,
  },
  {
    id: 'Upgraded Carryall Suspensors',
    aiEvaluation: (player, gameState) => 0.8 - 0.2 * (gameState.currentRound - 1),
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
  { id: 'Spice transport modules', aiEvaluation: (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount },
  { id: 'Spy modules', aiEvaluation: (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount },
  {
    id: 'Spy Network',
    aiEvaluation: (player, gameState) => 0.3 + 0.02 * (gameState.currentRound - 1),
  },
  {
    id: 'Wind Traps',
    aiEvaluation: (player, gameState) =>
      0.65 - 0.075 * (gameState.currentRound - 1) - 0.033 * gameState.playerCardsRewards.water,
  },
  { id: 'Heavy Lasguns', aiEvaluation: (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount },
  {
    id: 'Enhanced Sandcrawler Engines',
    aiEvaluation: (player, gameState) => 0.85 - 0.15 * (gameState.currentRound - 1),
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
      0.6 - 0.033 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsFactions.guild,
  },
  {
    id: 'Upgraded Ornithoper Engines',
    aiEvaluation: (player, gameState) => 0.25 + 0.025 * gameState.playerCardsBought + 0.025 * gameState.playerCardsTrashed,
  },
  {
    id: 'Barrage Rockets',
    aiEvaluation: (player, gameState) =>
      0.3 + 0.033 * (gameState.currentRound - 1) + 0.05 * gameState.playerDreadnoughtCount,
  },
  {
    id: 'Artillery Arsenal',
    aiEvaluation: (player, gameState) =>
      0.7 +
      0.05 * gameState.playerDreadnoughtCount -
      0.033 * (gameState.currentRound - 1) +
      0.025 * gameState.playerCardsRewards.sword,
  },
  {
    id: 'Ornithopter Hangar',
    aiEvaluation: (player, gameState) => 0.3 + 0.05 * (gameState.currentRound - 1) + (player.hasSwordmaster ? 0.0 : 0.1),
  },
  { id: 'Shieldbreakers', aiEvaluation: (player, gameState) => 0.0 + 0.5 * gameState.playerDreadnoughtCount },
  {
    id: 'Botanical Research Station',
    aiEvaluation: (player, gameState) =>
      0.4 + 0.015 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsFactions.fremen,
  },
  {
    id: 'Sardaukar Commando Post',
    aiEvaluation: (player, gameState) =>
      0.5 + 0.01 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsFactions.emperor,
  },
  {
    id: 'Missionaria Protectiva',
    aiEvaluation: (player, gameState) =>
      0.2 + 0.033 * (gameState.currentRound - 1) + 0.066 * gameState.playerCardsRewards.water,
  },
  {
    id: 'Stillsuits Factory',
    aiEvaluation: (player, gameState) =>
      0.3 +
      0.025 * (gameState.currentRound - 1) +
      0.01 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      0.066 * gameState.playerCardsRewards.solari,
  },
  {
    id: 'Spice Refineries',
    aiEvaluation: (player, gameState) => 0.65 - 0.05 * (gameState.currentRound - 1),
    gameModifiers: {
      fieldCost: [
        {
          id: 'spice-refineries',
          costType: 'spice',
          amount: -1,
          minCosts: 1,
        },
      ],
      techTiles: [
        {
          id: 'spice-refineries',
          spiceAmount: -1,
          minCosts: 1,
        },
      ],
    },
  },
  {
    id: 'Ornithoper Squadron',
    aiEvaluation: (player, gameState) =>
      0.25 +
      0.075 * (gameState.currentRound - 1) +
      0.05 * gameState.playerDreadnoughtCount +
      0.025 * gameState.playerCardsRewards.sword,
  },
  {
    id: 'Gunship',
    aiEvaluation: (player, gameState) =>
      0.3 +
      0.033 * (gameState.currentRound - 1) +
      0.075 * gameState.playerDreadnoughtCount +
      0.025 * gameState.playerCardsRewards.sword,
  },
  {
    id: 'Sietch',
    aiEvaluation: (player, gameState) =>
      0.6 +
      0.02 * (gameState.currentRound - 1) +
      0.01 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      (player.hasCouncilSeat ? 0.1 : 0.0) +
      0.033 * gameState.playerCardsRewards.water,
  },
  {
    id: 'Guild Bank',
    aiEvaluation: (player, gameState) =>
      0.6 +
      0.02 * (gameState.currentRound - 1) +
      0.01 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      (player.hasCouncilSeat ? 0.1 : 0.0) +
      0.033 * gameState.playerCardsRewards.spice,
  },
  {
    id: "Governor's Palace",
    aiEvaluation: (player, gameState) =>
      0.6 +
      0.02 * (gameState.currentRound - 1) +
      0.01 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      (player.hasSwordmaster ? 0.1 : 0.0) +
      (player.hasCouncilSeat ? 0.1 : 0.0) -
      0.05 * gameState.playerIntrigueCount +
      0.033 * gameState.playerCardsRewards.solari,
  },
  {
    id: 'Bene Gesserit Conclave',
    aiEvaluation: (player, gameState) =>
      0.6 +
      0.01 * (gameState.currentRound - 1) +
      0.02 * gameState.playerCardsBought +
      0.01 * gameState.playerCardsTrashed +
      (player.hasSwordmaster ? 0.1 : 0.0) +
      0.033 * gameState.playerCardsRewards.water,
  },
  {
    id: 'Lighter',
    aiEvaluation: (player, gameState) =>
      0.4 +
      0.1 * gameState.playerDreadnoughtCount +
      0.025 * gameState.playerCardsRewards.sword +
      0.01 * (gameState.currentRound - 1),
  },
  {
    id: 'Flagship',
    aiEvaluation: (player, gameState) =>
      0.3 +
      0.05 * (gameState.currentRound - 1) +
      (player.hasSwordmaster ? 0.1 : 0.0) +
      0.025 * gameState.playerScore.bene +
      0.025 * gameState.playerScore.emperor +
      0.025 * gameState.playerScore.fremen +
      0.025 * gameState.playerScore.guild,
  },
  {
    id: 'Landing Ships',
    aiEvaluation: (player, gameState) =>
      0.3 +
      0.02 * (gameState.currentRound - 1) +
      0.05 * gameState.playerDreadnoughtCount +
      0.02 * gameState.playerCardsRewards.sword +
      0.025 * gameState.playerCardsRewards.tech,
  },
  { id: 'Planetary Surveillance', aiEvaluation: (player, gameState) => 0.75 - 0.05 * (gameState.currentRound - 1) },
  { id: 'Satellite Control', aiEvaluation: (player, gameState) => 0.2 + 0.05 * gameState.playerCardsRewards.spice },
];
