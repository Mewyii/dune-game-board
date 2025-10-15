import { IntrigueCard } from '../models/intrigue';

export const intrigues: IntrigueCard[] = [
  {
    name: {
      en: 'Ambush',
      de: 'Hinterhalt',
    },
    type: 'combat',
    amount: 3,
    combatEffects: [
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
    plotEffects: [],
  },
  {
    name: {
      en: 'Betrayal',
      de: 'Verrat',
    },
    type: 'combat',
    amount: 3,
    combatEffects: [
      {
        type: 'spice',
        amount: 2,
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
    plotEffects: [],
  },
  {
    name: {
      en: 'Deceit',
      de: 'Täuschung',
    },
    type: 'combat',
    amount: 3,
    combatEffects: [
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
        amount: 3,
      },
    ],
    plotEffects: [],
  },
  {
    name: {
      en: 'Distraction',
      de: 'Ablenkung',
    },
    type: 'combat',
    amount: 3,
    combatEffects: [
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
    plotEffects: [],
  },
  {
    name: {
      en: 'Facedancers',
      de: 'Gestaltwandler',
    },
    type: 'combat',
    amount: 3,
    combatEffects: [
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
    ],
    plotEffects: [],
  },
  {
    name: {
      en: 'Feint',
      de: 'Finte',
    },
    type: 'combat',
    amount: 3,
    combatEffects: [
      {
        type: 'intrigue',
      },
      {
        type: 'sword',
      },
    ],
    plotEffects: [],
  },
  {
    name: {
      en: 'Flanking',
      de: 'Flankieren',
    },
    type: 'combat',
    amount: 3,
    combatEffects: [
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
    plotEffects: [],
  },
  {
    name: {
      en: 'Pincer',
      de: 'Zange',
    },
    type: 'combat',
    amount: 3,
    combatEffects: [
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
    ],
    plotEffects: [],
  },
  {
    name: {
      en: 'Raid',
      de: 'Überfall',
    },
    type: 'combat',
    amount: 3,
    combatEffects: [
      {
        type: 'sword',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'solari',
        amount: 3,
      },
    ],
    plotEffects: [],
  },
  {
    name: {
      en: 'Appropriation',
      de: 'Aneignung',
    },
    type: 'complot',
    amount: 3,
    plotEffects: [
      {
        type: 'spice',
        amount: 3,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'dreadnought',
      },
    ],
    combatEffects: [],
  },
  {
    name: {
      en: 'Black Market',
      de: 'Schwarzmarkt',
    },
    type: 'complot',
    amount: 3,
    plotEffects: [
      {
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'tech',
        amount: 3,
      },
    ],
    combatEffects: [],
  },
  {
    name: {
      en: 'Bribery',
      de: 'Bestechung',
    },
    type: 'complot',
    amount: 3,
    plotEffects: [
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
    combatEffects: [],
  },
  {
    name: {
      en: 'Deception',
      de: 'Irreführung',
    },
    type: 'complot',
    amount: 3,
    plotEffects: [
      {
        type: 'water',
      },
      {
        type: 'water',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'card-draw',
        amount: 3,
      },
    ],
    combatEffects: [],
  },
  {
    name: {
      en: 'Infiltration',
      de: 'Infiltration',
    },
    type: 'complot',
    amount: 3,
    plotEffects: [
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
    combatEffects: [],
  },
  {
    name: {
      en: 'Mercenaries',
      de: 'Söldner',
    },
    type: 'complot',
    amount: 3,
    plotEffects: [
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
    combatEffects: [],
  },
  {
    name: {
      en: 'Smuggling',
      de: 'Schmuggel',
    },
    type: 'complot',
    amount: 3,
    plotEffects: [
      {
        type: 'faction-influence-down-choice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'shipping',
      },
      {
        type: 'shipping',
      },
    ],
    combatEffects: [],
  },
  {
    name: {
      en: 'Deployment',
      de: 'Aufmarsch',
    },
    type: 'complot',
    amount: 3,
    plotEffects: [
      {
        type: 'water',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'combat',
      },
    ],
    combatEffects: [],
  },
  {
    name: {
      en: 'Traitors',
      de: 'Verräter',
    },
    type: 'complot',
    amount: 3,
    plotEffects: [
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
    combatEffects: [],
  },
  {
    name: {
      en: 'Treachery',
      de: 'Betrug',
    },
    type: 'complot',
    amount: 3,
    plotEffects: [
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
    combatEffects: [],
  },
  {
    name: {
      en: 'Expedition',
      de: 'Expedition',
    },
    type: 'complot',
    amount: 3,
    plotEffects: [
      {
        type: 'water',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'agent-lift',
      },
    ],
    combatEffects: [],
  },
];
