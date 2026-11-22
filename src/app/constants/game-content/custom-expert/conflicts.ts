import { Conflict } from '../../../models/conflict';

export const conflictsCustomExpert: Conflict[] = [
  {
    name: {
      de: 'Schlacht am Gouverneurs-Palast',
      en: "Battle at the Governor's Palace",
    },
    boardSpaceId: 'Arrakeen',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'intrigue',
        },
      ],
      [
        {
          type: 'faction-influence-up-bene',
        },
        {
          type: 'intrigue',
        },
        {
          type: 'solari',
          amount: 2,
        },
      ],
      [
        {
          type: 'solari',
          amount: 2,
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht am Wasserhändler-Viertel',
      en: 'Battle at the Water Merchant District',
    },
    boardSpaceId: 'Arrakeen',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'solari',
          amount: 2,
        },
      ],
      [
        {
          type: 'water',
        },
        {
          type: 'solari',
          amount: 4,
        },
      ],
      [
        {
          type: 'water',
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht am imperialen Palast',
      en: 'Battle at the Imperial Palace',
    },
    boardSpaceId: 'Carthag',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'intrigue',
        },
      ],
      [
        {
          type: 'faction-influence-up-emperor',
        },
        {
          type: 'intrigue',
        },
        {
          type: 'intrigue',
        },
      ],
      [
        {
          type: 'solari',
          amount: 2,
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht an den Industrieanlagen',
      en: 'Battle at the Industrial Facilities',
    },
    boardSpaceId: 'Carthag',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'solari',
          amount: 2,
        },
      ],
      [
        {
          type: 'solari',
          amount: 6,
        },
      ],
      [
        {
          type: 'solari',
          amount: 2,
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht an den Landefeldern',
      en: 'Battle at the landing fields',
    },
    boardSpaceId: 'Space Port',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'solari',
          amount: 2,
        },
      ],
      [
        {
          type: 'faction-influence-up-guild',
        },
        {
          type: 'foldspace',
        },
        {
          type: 'solari',
          amount: 2,
        },
      ],
      [
        {
          type: 'foldspace',
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht an den Wasser Depots',
      en: 'Battle at the Water Depots',
    },
    boardSpaceId: 'Space Port',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'water',
        },
      ],
      [
        {
          type: 'water',
        },
        {
          type: 'water',
        },
        {
          type: 'leader-heal',
        },
      ],
      [
        {
          type: 'water',
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht am Sietch',
      en: 'Battle at the Sietch',
    },
    boardSpaceId: 'Sietch Tabr',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'water',
        },
      ],
      [
        {
          type: 'faction-influence-up-fremen',
        },
        {
          type: 'water',
        },
        {
          type: 'troop',
          amount: 2,
        },
      ],
      [
        {
          type: 'focus',
        },
        {
          type: 'troop',
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht im Tuono Becken',
      en: 'Battle at the Tuono Basin',
    },
    boardSpaceId: 'Sietch Tabr',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'spice',
        },
      ],
      [
        {
          type: 'faction-influence-up-choice',
        },
        {
          type: 'spice',
          amount: 2,
        },
      ],
      [
        {
          type: 'spice',
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht in den Spice-Feldern',
      en: 'Battle in the Spice Fields',
    },
    boardSpaceId: 'Imperial Basin',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'spice',
        },
      ],
      [
        {
          type: 'spice',
          amount: 3,
        },
      ],
      [
        {
          type: 'spice',
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht am Schildwall',
      en: 'Battle at the Shield Wall',
    },
    boardSpaceId: 'Imperial Basin',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'focus',
        },
      ],
      [
        {
          type: 'faction-influence-up-emperor',
        },
        {
          type: 'solari',
          amount: 3,
        },
        {
          type: 'focus',
        },
      ],
      [
        {
          type: 'solari',
          amount: 2,
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht in den Spice-Feldern',
      en: 'Battle in the Spice Fields',
    },
    boardSpaceId: 'Hagga Basin',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'spice',
        },
      ],
      [
        {
          type: 'spice',
          amount: 3,
        },
      ],
      [
        {
          type: 'spice',
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht an der imperialen Forschungs-Station',
      en: 'Battle at the Imperial Research Station',
    },
    boardSpaceId: 'Hagga Basin',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'leader-heal',
        },
      ],
      [
        {
          type: 'faction-influence-up-twice-choice',
        },
      ],
      [
        {
          type: 'water',
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht in den Spice-Feldern',
      en: 'Battle in the Spice Fields',
    },
    boardSpaceId: 'The Great Flat',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'spice',
        },
      ],
      [
        {
          type: 'faction-influence-up-choice',
        },
        {
          type: 'spice',
          amount: 2,
        },
      ],
      [
        {
          type: 'spice',
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht am falschen Wall (West)',
      en: 'Battle at the False Wall West',
    },
    boardSpaceId: 'The Great Flat',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'focus',
        },
      ],
      [
        {
          type: 'faction-influence-up-fremen',
        },
        {
          type: 'spice',
        },
        {
          type: 'focus',
        },
      ],
      [
        {
          type: 'spice',
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht bei den Schmuggler-Lägern',
      en: "Battle at the Smuggler's Communities",
    },
    boardSpaceId: "Tuek's Sietch",
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'solari',
          amount: 2,
        },
      ],
      [
        {
          type: 'faction-influence-up-guild',
        },
        {
          type: 'spice',
        },
        {
          type: 'solari',
          amount: 2,
        },
      ],
      [
        {
          type: 'solari',
          amount: 2,
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht am Harg Pass',
      en: 'Battle at Harg Pass',
    },
    boardSpaceId: "Tuek's Sietch",
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'focus',
        },
      ],
      [
        {
          type: 'solari',
          amount: 3,
        },
        {
          type: 'focus',
        },
        {
          type: 'leader-heal',
        },
      ],
      [
        {
          type: 'leader-heal',
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht bei der Festung',
      en: 'Battle at the Fortress',
    },
    boardSpaceId: 'Tsimpo',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'intrigue',
        },
      ],
      [
        {
          type: 'spice',
        },
        {
          type: 'water',
        },
        {
          type: 'intrigue',
        },
      ],
      [
        {
          type: 'water',
        },
        {
          type: 'troop',
        },
      ],
    ],
  },
  {
    name: {
      de: 'Schlacht bei den Forschungsanlagen',
      en: 'Battle at the Research Stations',
    },
    boardSpaceId: 'Tsimpo',
    lvl: 1,
    rewards: [
      [
        {
          type: 'location-control',
        },
        {
          type: 'leader-heal',
        },
      ],
      [
        {
          type: 'faction-influence-up-bene',
        },
        {
          type: 'leader-heal',
        },
        {
          type: 'leader-heal',
        },
      ],
      [
        {
          type: 'leader-heal',
        },
      ],
    ],
  },
];
