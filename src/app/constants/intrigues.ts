import { LanguageString, Reward } from '../models';

export const intriguesTypes = ['complot', 'combat'] as const;
export type IntrigueType = (typeof intriguesTypes)[number];

export interface IntrigueCardBase {
  name: LanguageString;
  effects: Reward[];
  type: IntrigueType;
}

export interface IntrigueCard extends IntrigueCardBase {
  amount: number;
}

export const intrigues: IntrigueCard[] = [
  {
    name: {
      en: 'Ambush',
      de: 'Hinterhalt',
    },
    type: 'combat',
    amount: 3,
    effects: [
      {
        type: 'loose-troop',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Betrayal',
      de: 'Verrat',
    },
    type: 'combat',
    amount: 3,
    effects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Deceit',
      de: 'Täuschung',
    },
    type: 'combat',
    amount: 3,
    effects: [
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'troop',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Distraction',
      de: 'Ablenkung',
    },
    type: 'combat',
    amount: 3,
    effects: [
      {
        type: 'solari',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Facedancers',
      de: 'Gestaltwandler',
    },
    type: 'combat',
    amount: 3,
    effects: [
      {
        type: 'faction-influence-down-choice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Feint',
      de: 'Finte',
    },
    type: 'combat',
    amount: 3,
    effects: [
      {
        type: 'intrigue',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Flanking',
      de: 'Flankieren',
    },
    type: 'combat',
    amount: 3,
    effects: [
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Pincer',
      de: 'Zange',
    },
    type: 'combat',
    amount: 3,
    effects: [
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Raid',
      de: 'Überfall',
    },
    type: 'combat',
    amount: 3,
    effects: [
      {
        type: 'tech',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Appropriation',
      de: 'Aneignung',
    },
    type: 'complot',
    amount: 3,
    effects: [
      {
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'dreadnought',
      },
    ],
  },
  {
    name: {
      en: 'Black Market',
      de: 'Schwarzmarkt',
    },
    type: 'complot',
    amount: 3,
    effects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'tech-reduced-two',
      },
    ],
  },
  {
    name: {
      en: 'Blackmail',
      de: 'Erpressung',
    },
    type: 'complot',
    amount: 3,
    effects: [
      {
        type: 'solari',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Bribery',
      de: 'Bestechung',
    },
    type: 'complot',
    amount: 3,
    effects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'faction-influence-up-choice',
      },
    ],
  },
  {
    name: {
      en: 'Deception',
      de: 'Irreführung',
    },
    type: 'complot',
    amount: 3,
    effects: [
      {
        type: 'card-discard',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'card-draw',
      },
    ],
  },
  {
    name: {
      en: 'Infiltration',
      de: 'Infiltration',
    },
    type: 'complot',
    amount: 3,
    effects: [
      {
        type: 'loose-troop',
      },
      {
        type: 'loose-troop',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'location-control',
      },
    ],
  },
  {
    name: {
      en: 'Mercenaries',
      de: 'Söldner',
    },
    type: 'complot',
    amount: 3,
    effects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'troop',
      },
      {
        type: 'troop',
      },
    ],
  },
  {
    name: {
      en: 'Smuggling',
      de: 'Schmuggel',
    },
    type: 'complot',
    amount: 3,
    effects: [
      {
        type: 'water',
      },
    ],
  },
  {
    name: {
      en: 'Substances',
      de: 'Substanzen',
    },
    type: 'complot',
    amount: 3,
    effects: [
      {
        type: 'focus',
      },
    ],
  },
  {
    name: {
      en: 'Traitors',
      de: 'Verräter',
    },
    type: 'complot',
    amount: 3,
    effects: [
      {
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'location-control',
      },
    ],
  },
  {
    name: {
      en: 'Treachery',
      de: 'Betrug',
    },
    type: 'complot',
    amount: 3,
    effects: [
      {
        type: 'faction-influence-down-choice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'solari',
      },
      {
        type: 'faction-influence-up-choice',
      },
    ],
  },
];
