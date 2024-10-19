import { ImperiumCard } from './imperium-cards';

export const startingCards: ImperiumCard[] = [
  {
    name: {
      en: 'Warmaster',
      de: 'Kriegsmeister',
    },
    fieldAccess: ['emperor', 'guild'],
    imageUrl: '/assets/images/action-backgrounds/gurney_3.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'troop',
      },
    ],
  },
  {
    name: {
      en: 'Spice Harvester',
      de: 'Spice-Ernter',
    },
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/sandcrawler_2.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
  },
  {
    name: {
      en: 'Negotiator',
      de: 'Unterhändler',
    },
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/meeting_2.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'tech',
      },
    ],
  },
  {
    name: {
      en: 'Persuasion',
      de: 'Überzeugung',
    },
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/irulan_2.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Spy Master',
      de: 'Spionagemeister',
    },
    fieldAccess: ['bene', 'fremen'],
    imageUrl: '/assets/images/action-backgrounds/mentat_4.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'focus',
      },
    ],
  },
  {
    name: {
      en: 'Ornithoper',
      de: 'Ornithopter',
    },
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/ornithopter_3.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
  },
  {
    name: {
      en: 'Diplomacy',
      de: 'Diplomatie',
    },
    fieldAccess: ['landsraad'],
    imageUrl: '/assets/images/action-backgrounds/wealth.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
  },
  {
    name: {
      en: 'Leadership',
      de: 'Führung',
    },
    fieldAccess: ['landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/signet_ring_2.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [
      {
        type: 'signet-ring',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
  },
  {
    name: {
      en: 'Past Connections',
      de: 'Vergangene Verbindungen',
    },
    fieldAccess: ['bene', 'emperor', 'fremen', 'guild'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_10.png',
    cardAmount: 1,
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
    agentEffects: [{ type: 'trash-self' }],
  },
  {
    name: {
      en: 'Scouts',
      de: 'Kundschafter',
    },
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/smugglers_7.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'sword',
      },
    ],
  },
];
