import { IntrigueCard } from '../models/intrigue';

export const intrigues: IntrigueCard[] = [
  {
    name: {
      en: 'Ambush',
      de: 'Hinterhalt',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'intrigue-trash',
      },
      {
        type: 'intrigue-trash',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'victory-point',
      },
    ],
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
  },
  {
    name: {
      en: 'Appropriation',
      de: 'Aneignung',
    },
    type: 'combined',
    amount: 2,
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
    combatEffects: [
      {
        type: 'sword',
      },
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
      en: 'Attack',
      de: 'Anschlag',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'tech',
        amount: 2,
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
    combatEffects: [
      {
        type: 'tech',
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
    ],
  },
  {
    name: {
      en: 'Betrayal',
      de: 'Verrat',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'solari',
        amount: 5,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'location-control',
      },
    ],
    combatEffects: [
      {
        type: 'solari',
        amount: 5,
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
      en: 'Black Market',
      de: 'Schwarzmarkt',
    },
    type: 'combined',
    amount: 2,
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
    combatEffects: [
      {
        type: 'sword',
      },
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'tech',
        amount: 3,
      },
    ],
  },
  {
    name: {
      en: 'Blackmail',
      de: 'Erpressung',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'focus',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'faction-influence-up-choice',
      },
    ],
    combatEffects: [
      {
        type: 'dreadnought-retreat',
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
      en: 'Breaktrough',
      de: 'Durchbruch',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'tech',
        amount: 5,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'victory-point',
      },
    ],
    combatEffects: [
      {
        type: 'tech',
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
    ],
  },
  {
    name: {
      en: 'Bribery',
      de: 'Bestechung',
    },
    type: 'combined',
    amount: 2,
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
    combatEffects: [
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
    ],
  },
  {
    name: {
      en: 'Deceit',
      de: 'Täuschung',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'faction-influence-down-choice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'agent-lift',
      },
      {
        type: 'card-draw',
      },
    ],
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
    ],
  },
  {
    name: {
      en: 'Deception',
      de: 'Irreführung',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'water',
      },
      {
        type: 'focus',
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
      {
        type: 'card-draw',
      },
    ],
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
      },
      {
        type: 'troop',
      },
    ],
  },
  {
    name: {
      en: 'Deployment',
      de: 'Aufmarsch',
    },
    type: 'combined',
    amount: 2,
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
    combatEffects: [
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
      en: 'Displaced',
      de: 'Vertriebene',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'water',
      },
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
        type: 'victory-point',
      },
    ],
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
    ],
  },
  {
    name: {
      en: 'Distraction',
      de: 'Ablenkung',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'focus',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'signet-ring',
      },
      {
        type: 'card-draw',
      },
    ],
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
    ],
  },
  {
    name: {
      en: 'Facedancers',
      de: 'Gestaltwandler',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'solari',
        amount: 5,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'faction-influence-up-twice-choice',
      },
    ],
    combatEffects: [
      {
        type: 'solari',
        amount: 3,
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
      en: 'Feint',
      de: 'Finte',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'focus',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'agent-lift',
      },
    ],
    combatEffects: [
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
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'card-discard',
      },
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
    combatEffects: [
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
      en: 'Incitement',
      de: 'Aufstachelung',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'solari',
        amount: 2,
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
    combatEffects: [
      {
        type: 'water',
      },
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
    ],
  },
  {
    name: {
      en: 'Infiltration',
      de: 'Infiltration',
    },
    type: 'combined',
    amount: 2,
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
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'solari',
        amount: 3,
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
      {
        type: 'troop',
      },
    ],
    combatEffects: [
      {
        type: 'solari',
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
    ],
  },
  {
    name: {
      en: 'Mobilization',
      de: 'Mobilisierung',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'card-discard',
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
    combatEffects: [
      {
        type: 'focus',
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
    ],
  },
  {
    name: {
      en: 'Monopoly',
      de: 'Monopol',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'spice',
        amount: 4,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'victory-point',
      },
    ],
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
        type: 'spice',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Pincer',
      de: 'Zange',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'focus',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'solari',
        amount: 3,
      },
    ],
    combatEffects: [
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
      en: 'Production',
      de: 'Produktion',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'tech',
        amount: 3,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'dreadnought',
      },
    ],
    combatEffects: [
      {
        type: 'sword',
      },
      {
        type: 'tech',
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
      en: 'Prototypes',
      de: 'Prototypen',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'tech',
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
    combatEffects: [
      {
        type: 'tech',
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
    ],
  },
  {
    name: {
      en: 'Raid',
      de: 'Überfall',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'loose-troop',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'spice',
        amount: 2,
      },
    ],
    combatEffects: [
      {
        type: 'sword',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'spice',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Shading',
      de: 'Beschattung',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'solari',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'card-draw-or-destroy',
      },
    ],
    combatEffects: [
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
      en: 'Smuggling',
      de: 'Schmuggel',
    },
    type: 'combined',
    amount: 2,
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
    combatEffects: [
      {
        type: 'sword',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'shipping',
      },
    ],
  },
  {
    name: {
      en: 'Supply',
      de: 'Versorgung',
    },
    type: 'combined',
    amount: 2,
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
    combatEffects: [
      {
        type: 'water',
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
    ],
  },
  {
    name: {
      en: 'Threat',
      de: 'Bedrohung',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'loose-troop',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'shipping',
      },
    ],
    combatEffects: [
      {
        type: 'dreadnought-retreat',
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
  },
  {
    name: {
      en: 'Treachery',
      de: 'Betrug',
    },
    type: 'combined',
    amount: 2,
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
    combatEffects: [
      {
        type: 'dreadnought-retreat',
      },
      {
        type: 'dreadnought-retreat',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'victory-point',
      },
    ],
  },
];
