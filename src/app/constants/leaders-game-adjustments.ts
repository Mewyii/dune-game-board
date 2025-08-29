import { StructuredEffect } from '../models';
import { AIAdjustments } from '../models/ai';
import { GameModifiers } from '../services/game-modifier.service';

export interface LeaderGameAdjustments {
  id: string;
  aiAdjustments?: AIAdjustments;
  gameModifiers?: GameModifiers;
  customSignetEffects?: StructuredEffect[];
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
            type: 'card-draw',
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
    customSignetEffects: [
      {
        type: 'helper-or',
        effectLeft: { type: 'reward', effectRewards: [{ type: 'signet-token' }] },
        effectRight: {
          type: 'helper-trade',
          effectCosts: { type: 'reward', effectRewards: [{ type: 'signet-token', amount: 3 }] },
          effectConversions: { type: 'reward', effectRewards: [{ type: 'victory-point' }] },
        },
      },
    ],
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
  },
  {
    id: 'Count Glossu Rabban',
    customEffects: [{ type: 'reward', timing: { type: 'timing-round-start' }, effectRewards: [{ type: 'card-destroy' }] }],
    customSignetEffects: [{ type: 'reward', effectRewards: [{ type: 'spice' }] }],
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
      fieldCost: [{ id: 'dara-landsraad-costs', actionType: 'landsraad', costType: 'solari', amount: 1 }],
    },
  },
];
