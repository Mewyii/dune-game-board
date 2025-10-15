import { ImperiumCard } from '../models/imperium-card';

export const startingCards: ImperiumCard[] = [
  {
    name: {
      en: 'Warmaster',
      de: 'Kriegsmeister',
    },
    fieldAccess: ['emperor', 'town'],
    imageUrl: '/assets/images/action-backgrounds/gurney_3.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'troop',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'emperor',
      },
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
    fieldAccess: ['guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/meeting_2.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'tech',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'guild',
      },
      {
        type: 'solari',
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
    fieldAccess: ['bene', 'town'],
    imageUrl: '/assets/images/action-backgrounds/mentat_4.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'focus',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'bene',
      },
      {
        type: 'persuasion',
        amount: 1,
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
    agentEffects: [
      {
        type: 'trash-self',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'trash-self',
      },
    ],
  },
  {
    name: {
      en: 'Scouts',
      de: 'Kundschafter',
    },
    fieldAccess: ['fremen', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/smugglers_7.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'sword',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'sword',
      },
    ],
  },
];
