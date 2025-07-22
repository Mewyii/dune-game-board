import { StructuredEffects } from '../models';
import { AIAdjustments } from '../models/ai';
import { GameModifiers } from '../services/game-modifier.service';

export interface LeaderGameAdjustments {
  id: string;
  aiAdjustments?: AIAdjustments;
  gameModifiers?: GameModifiers;
  customSignetEffects?: StructuredEffects;
  customEffects?: StructuredEffects;
}

export const leadersGameAdjustments: LeaderGameAdjustments[] = [
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
    customSignetEffects: {
      choiceEffects: [
        {
          choiceType: 'helper-or',
          left: [{ type: 'signet-token' }],
          right: {
            conversionType: 'helper-trade',
            costs: [{ type: 'signet-token', amount: 3 }],
            rewards: [{ type: 'victory-point' }],
          },
        },
      ],
      conditionalEffects: [],
      conversionEffects: [],
      multiplierEffects: [],
      rewards: [],
      timingEffects: [],
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
    },
    customSignetEffects: {
      choiceEffects: [],
      conditionalEffects: [],
      conversionEffects: [],
      multiplierEffects: [],
      rewards: [{ type: 'signet-token' }],
      timingEffects: [],
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
    customSignetEffects: {
      choiceEffects: [],
      conditionalEffects: [],
      conversionEffects: [],
      multiplierEffects: [],
      rewards: [{ type: 'signet-token' }],
      timingEffects: [
        {
          type: 'timing-combat',
          effect: { conversionType: 'helper-trade', costs: [{ type: 'signet-token' }], rewards: [{ type: 'sword' }] },
        },
      ],
    },
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
    customEffects: {
      choiceEffects: [],
      conditionalEffects: [],
      conversionEffects: [],
      multiplierEffects: [],
      rewards: [{ type: 'signet-token' }],
      timingEffects: [
        {
          type: 'timing-round-start',
          effect: {
            conversionType: 'helper-trade',
            costs: [{ type: 'card-discard' }],
            rewards: [{ type: 'card-draw' }, { type: 'turn-pass' }],
          },
        },
      ],
    },
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
    customSignetEffects: {
      choiceEffects: [],
      conditionalEffects: [],
      conversionEffects: [],
      multiplierEffects: [],
      rewards: [{ type: 'signet-token' }],
      timingEffects: [],
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
    customEffects: {
      choiceEffects: [],
      conditionalEffects: [],
      conversionEffects: [],
      multiplierEffects: [],
      rewards: [{ type: 'signet-token' }],
      timingEffects: [{ type: 'timing-round-start', effect: [{ type: 'card-destroy' }] }],
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
      fieldCost: [{ id: 'dara-landsraad-costs', actionType: 'landsraad', costType: 'solari', amount: 1 }],
    },
  },
];
