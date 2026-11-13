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
        type: 'card-discard',
      },
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
        type: 'location-control-choice',
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
        type: 'location-control-choice',
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
        type: 'sword',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'location-control-choice',
      },
    ],
  },
  {
    name: {
      en: 'Assassination',
      de: 'Attentat',
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
        type: 'target-enemies',
      },
      {
        type: 'leader-wound',
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
        type: 'water',
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
        type: 'loose-troop',
      },
      {
        type: 'loose-troop',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'target-enemies',
      },
      {
        type: 'card-discard',
      },
      {
        type: 'leader-wound',
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
        type: 'location-control-choice',
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
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'solari',
        amount: 2,
      },
      {
        type: 'tech',
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
        type: 'intrigue-trash',
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
      en: 'Sacrifice',
      de: 'Aufopferung',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'leader-heal',
        amount: 3,
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
        type: 'leader-wound',
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
        type: 'spice',
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
        type: 'dreadnought-retreat',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'troop-retreat',
        amount: 2,
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
        type: 'water',
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
        type: 'troop-retreat',
        amount: 3,
      },
    ],
  },
  {
    name: {
      en: 'Defamation',
      de: 'Rufmord',
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
        type: 'target-enemies',
      },
      {
        type: 'faction-influence-down-choice',
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
        type: 'troop-insert',
        amount: 3,
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
        type: 'signet-ring',
      },
      {
        type: 'leader-heal',
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
      en: 'Espionage',
      de: 'Spionage',
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
        type: 'intrigue',
      },
      {
        type: 'intrigue',
      },
    ],
    combatEffects: [
      {
        type: 'intrigue-trash',
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
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'solari',
        amount: 6,
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
        amount: 4,
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
      en: 'False-Flag',
      de: 'False-Flag',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'leader-wound',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'target-enemies',
      },
      {
        type: 'faction-influence-down-choice',
      },
    ],
    combatEffects: [
      {
        type: 'leader-wound',
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
      en: 'Feint',
      de: 'Finte',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'solari',
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
        type: 'helper-trade',
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
        amount: 3,
      },
      {
        type: 'loose-troop',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'location-control-choice',
      },
    ],
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
        type: 'card-discard',
      },
      {
        type: 'card-discard',
      },
      {
        type: 'loose-troop',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'location-control-choice',
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
        type: 'target-enemies',
      },
      {
        type: 'leader-wound',
      },
    ],
  },
  {
    name: {
      en: 'Kanly',
      de: 'Kanly',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'leader-heal',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'location-control-choice',
      },
    ],
    combatEffects: [
      {
        type: 'leader-heal',
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
      en: 'Leadership',
      de: 'Führung',
    },
    type: 'combined',
    amount: 2,
    plotEffects: [
      {
        type: 'leader-heal',
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
        type: 'leader-wound',
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
        amount: 4,
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
      en: 'Mobilization',
      de: 'Mobilisierung',
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
        type: 'helper-trade',
      },
      {
        type: 'troop',
        amount: 4,
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
        type: 'dreadnought-retreat',
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
        type: 'water',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'target-enemies',
      },
      {
        type: 'leader-wound',
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
      en: 'Poisoning',
      de: 'Vergiftung',
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
        type: 'target-enemies',
      },
      {
        type: 'leader-wound',
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
        type: 'card-discard',
      },
      {
        type: 'loose-troop',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'spice',
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
      {
        type: 'helper-trade',
      },
      {
        type: 'spice',
      },
    ],
  },
  {
    name: {
      en: 'Sabotage',
      de: 'Sabotage',
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
        type: 'target-enemies',
      },
      {
        type: 'card-discard',
      },
      {
        type: 'loose-troop',
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
        type: 'target-enemies',
      },
      {
        type: 'dreadnought-retreat',
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
        type: 'solari',
        amount: 3,
      },
      {
        type: 'tech',
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
        type: 'solari',
        amount: 3,
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
        type: 'faction-influence-down-choice',
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
  {
    name: {
      en: 'Plans in Plans',
      de: 'Pläne in Plänen',
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
        type: 'faction-influence-up-twice-choice',
      },
    ],
    combatEffects: [
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
      en: 'Compromise',
      de: 'Kompromitierung',
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
        type: 'solari',
        amount: 3,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'target-enemies',
      },
      {
        type: 'loose-troop',
      },
      {
        type: 'loose-troop',
      },
    ],
  },
];
