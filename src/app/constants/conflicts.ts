import { normalizeNumber } from '../helpers/common';
import { isResourceType } from '../helpers/resources';
import { LanguageString, ResourceType, Reward, RewardType } from '../models';
import { GameState } from '../services/ai/models';
import { Player } from '../services/player-manager.service';

export interface Conflict {
  name: LanguageString;
  aiEvaluation: (player: Player, gameState: GameState) => number;
  lvl: 1 | 2 | 3;
  row: number;
  column: number;
  rewards: Reward[][];
}

export const conflicts: Conflict[] = [
  {
    name: { de: 'Wüstenkraft', en: 'desert power' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('victory-point', 1, player, gameState) + getRewardDesire('water', 1, player, gameState),
    lvl: 2,
    row: 1,
    column: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'water' }],
      [{ type: 'water' }, { type: 'spice', amount: 1 }],
      [{ type: 'spice', amount: 1 }],
    ],
  },
  {
    name: { de: 'Raub der Lagerbestände', en: 'raid stockpiles' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('intrigue', 1, player, gameState) + getRewardDesire('spice', 3, player, gameState),
    lvl: 2,
    row: 1,
    column: 2,
    rewards: [
      [{ type: 'intrigue' }, { type: 'spice', amount: 3 }],
      [{ type: 'spice', amount: 2 }],
      [{ type: 'spice', amount: 1 }],
    ],
  },
  {
    name: { de: 'Heimlichtuerei', en: 'cloak and dagger' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('faction-influence-up-choice', 1, player, gameState) +
      getRewardDesire('intrigue', 2, player, gameState),
    lvl: 2,
    row: 1,
    column: 3,
    rewards: [
      [{ type: 'faction-influence-up-choice' }, { type: 'intrigue' }, { type: 'intrigue' }],
      [{ type: 'intrigue' }, { type: 'spice', amount: 1 }],
      [{ type: 'intrigue' }, { type: 'separator' }, { type: 'spice', amount: 1 }],
    ],
  },
  {
    name: { de: 'Machenschaften', en: 'machinations' },
    aiEvaluation: (player, gameState) => getRewardDesire('faction-influence-up-choice', 2, player, gameState),
    lvl: 2,
    row: 1,
    column: 4,
    rewards: [
      [{ type: 'faction-influence-up-choice' }, { type: 'faction-influence-up-choice' }],
      [{ type: 'water' }, { type: 'solari', amount: 2 }],
      [{ type: 'water' }],
    ],
  },
  {
    name: { de: 'Sortieren des Chaos', en: 'sort trough the chaos' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('mentat', 1, player, gameState) +
      getRewardDesire('intrigue', 1, player, gameState) +
      getRewardDesire('solari', 2, player, gameState),
    lvl: 2,
    row: 1,
    column: 5,
    rewards: [
      [{ type: 'mentat' }, { type: 'intrigue' }, { type: 'solari', amount: 2 }],
      [{ type: 'intrigue' }, { type: 'solari', amount: 2 }],
      [{ type: 'solari', amount: 2 }],
    ],
  },
  {
    name: { de: 'Schrecklicher Zweck', en: 'terrible purpose' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('victory-point', 1, player, gameState) + getRewardDesire('card-destroy', 1, player, gameState),
    lvl: 2,
    row: 1,
    column: 6,
    rewards: [
      [{ type: 'victory-point' }, { type: 'card-destroy' }],
      [{ type: 'water' }, { type: 'spice', amount: 1 }],
      [{ type: 'spice', amount: 1 }],
    ],
  },
  {
    name: { de: 'Gildenbanküberfall', en: 'guild bank raid' },
    aiEvaluation: (player, gameState) => getRewardDesire('solari', 6, player, gameState),
    lvl: 2,
    row: 2,
    column: 1,
    rewards: [[{ type: 'solari', amount: 6 }], [{ type: 'solari', amount: 4 }], [{ type: 'solari', amount: 2 }]],
  },
  {
    name: { de: 'Belagerung von Arrakeen', en: 'siege of arrakeen' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('victory-point', 1, player, gameState) + getRewardDesire('victory-point', 0.25, player, gameState),
    lvl: 2,
    row: 2,
    column: 2,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'solari', amount: 4 }],
      [{ type: 'solari', amount: 2 }],
    ],
  },
  {
    name: { de: 'Belagerung von Carthag', en: 'siege of carthag' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('victory-point', 1, player, gameState) + getRewardDesire('victory-point', 0.25, player, gameState),
    lvl: 2,
    row: 2,
    column: 3,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'intrigue' }, { type: 'spice', amount: 1 }],
      [{ type: 'spice', amount: 1 }],
    ],
  },
  {
    name: { de: 'Imperiales Becken sichern', en: 'secure imperial basin' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('victory-point', 1, player, gameState) + getRewardDesire('victory-point', 0.25, player, gameState),
    lvl: 2,
    row: 2,
    column: 4,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'water' }, { type: 'water' }],
      [{ type: 'water' }],
    ],
  },
  {
    name: { de: 'Handelsmonopol', en: 'trade monopoly' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('shipping', 2, player, gameState) + getRewardDesire('troop', 1, player, gameState),
    lvl: 2,
    row: 2,
    column: 5,
    rewards: [
      [{ type: 'shipping' }, { type: 'shipping' }, { type: 'troop' }],
      [{ type: 'intrigue' }, { type: 'water' }],
      [{ type: 'intrigue' }, { type: 'separator' }, { type: 'water' }],
    ],
  },
  {
    name: { de: 'Schlacht um das Imperiale Becken', en: 'battle for imperial basin' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('victory-point', 2, player, gameState) + getRewardDesire('victory-point', 0.25, player, gameState),
    lvl: 3,
    row: 1,
    column: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'spice', amount: 5 }],
      [{ type: 'spice', amount: 3 }],
    ],
  },
  {
    name: { de: 'Große Vision', en: 'grand vision' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('faction-influence-up-twice-choice', 1, player, gameState) +
      getRewardDesire('intrigue', 1, player, gameState),
    lvl: 3,
    row: 1,
    column: 2,
    rewards: [
      [{ type: 'faction-influence-up-twice-choice' }, { type: 'intrigue' }],
      [{ type: 'intrigue' }, { type: 'spice', amount: 3 }],
      [{ type: 'spice', amount: 3 }],
    ],
  },
  {
    name: { de: 'Schlacht um Carthag', en: 'battle for carthag' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('victory-point', 2, player, gameState) + getRewardDesire('victory-point', 0.25, player, gameState),
    lvl: 3,
    row: 1,
    column: 3,
    rewards: [
      [{ type: 'victory-point' }, { type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'intrigue' }, { type: 'spice', amount: 3 }],
      [{ type: 'spice', amount: 3 }],
    ],
  },
  {
    name: { de: 'Schlacht um Arrakeen', en: 'battle for arrakeen' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('victory-point', 2, player, gameState) + getRewardDesire('victory-point', 0.25, player, gameState),
    lvl: 3,
    row: 2,
    column: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'victory-point' }, { type: 'location-control' }],
      [
        // { type: 'intrigue' }, { type: 'spice', amount: 2 }, { type: 'solari', amount: 3 }
      ],
      [{ type: 'intrigue' }, { type: 'solari', amount: 3 }],
    ],
  },
  {
    name: { de: 'Wirtschaftliche Überlegenheit', en: 'economic supremacy' },
    aiEvaluation: (player, gameState) =>
      getRewardDesire('victory-point', 1, player, gameState) + getRewardDesire('victory-point', 0.5, player, gameState),
    lvl: 3,
    row: 2,
    column: 2,
    rewards: [
      [
        { type: 'victory-point' },
        // { type: 'solari', amount: 6 },
        // { type: 'helper-arrow-right' },
        // { type: 'spice', amount: 4 },
        // { type: 'helper-arrow-right' },
        // { type: 'victory-point' },
      ],
      [{ type: 'victory-point' }],
      [
        { type: 'spice', amount: 2 },
        { type: 'solari', amount: 2 },
      ],
    ],
  },
];

function getRewardDesire(rewardType: RewardType, amount: number, player: Player, gameState: GameState) {
  if (rewardType === 'faction-influence-up-choice') {
    return getInfluenceBumpDesire(amount, gameState);
  } else if (rewardType === 'faction-influence-up-twice-choice') {
    return getInfluenceBumpDesire(amount, gameState, 2);
  } else if (rewardType === 'victory-point') {
    return getVictoryPointDesire(amount);
  } else if (isResourceType(rewardType)) {
    return getResourceDesire(rewardType, amount, player);
  } else if (rewardType === 'mentat') {
    return 0.2 * amount;
  } else if (rewardType === 'intrigue') {
    return getIntrigueDesire(amount, player);
  } else if (rewardType === 'shipping') {
    return 0.125 * amount;
  } else {
    return 0.075 * amount;
  }
}

function getVictoryPointDesire(amount: number) {
  const modifier = 0.4;
  return amount * modifier;
}

function getInfluenceBumpDesire(amount: number, gameState: GameState, bumpAmounts: number = 1) {
  const modifier = 0.4;
  const baseInfluenceDesire = 0.25;

  let desires: number[] = new Array(amount).fill(baseInfluenceDesire);
  for (const scoreType in gameState.playerScore) {
    if (scoreType === 'emperor' || scoreType === 'bene' || scoreType === 'guild' || scoreType === 'fremen') {
      const score = gameState.playerScore[scoreType];
      let desire = 0;

      if (score < 4) {
        desire = normalizeNumber(score + bumpAmounts, 4, 0);
      } else {
        const reachableEnemyWithAlliance = gameState.enemyScore.find(
          (x) => x[scoreType] >= score && x[scoreType] - score <= bumpAmounts
        );
        if (reachableEnemyWithAlliance) {
          desire = 1;
        }
      }
      if (desires.some((x) => x < desire)) {
        desires.sort((a, b) => b - a);
        desires.pop();
        desires.push(desire);
      }
    }
  }
  let result = 0;
  for (const desire of desires) {
    result = result + modifier * desire;
  }
  return result;
}

function getResourceDesire(resourceType: ResourceType, amount: number, player: Player) {
  let modifier = 0.0;
  let maxDesiredAmount = 0;

  if (resourceType === 'solari') {
    modifier = 0.08;
    maxDesiredAmount = 10;
  } else if (resourceType === 'spice') {
    modifier = 0.12;
    maxDesiredAmount = 5;
  } else if (resourceType === 'water') {
    modifier = 0.16;
    maxDesiredAmount = 3;
  }

  if (!player.hasSwordmaster) {
    modifier += 0.02;
  }
  if (!player.hasCouncilSeat) {
    modifier += 0.02;
  }
  const playerResourceAmount = player.resources.find((x) => x.type === resourceType)?.amount ?? 0;
  return modifier * amount * (1 - normalizeNumber(playerResourceAmount, maxDesiredAmount, 0));
}

function getIntrigueDesire(amount: number, player: Player) {
  return player.intrigueCount < 3 ? 0.1 * amount : 0.025 * amount;
}
