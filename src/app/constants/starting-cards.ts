import { ImperiumCard } from '../models/imperium-card';

export const startingCards: ImperiumCard[] = [
  {
    name: {
      en: 'Warmaster',
      de: 'Kriegsmeister',
    },
    fieldAccess: ['emperor', 'fremen'],
    imageUrl: '/assets/images/action-backgrounds/warmaster.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    rarity: 'normal',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'large',
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
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
    rarity: 'normal',
  },
  {
    name: {
      en: 'Persuasion',
      de: 'Überzeugung',
    },
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/meeting_4.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    agentEffectSize: 'large',
    revealEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    rarity: 'normal',
  },
  {
    name: {
      en: 'Spy Master',
      de: 'Spionagemeister',
    },
    fieldAccess: ['bene', 'guild'],
    imageUrl: '/assets/images/action-backgrounds/mentat_4.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
    rarity: 'normal',
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
    fieldAccess: ['landsraad', 'town'],
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
    agentEffectSize: 'large',
    revealEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    rarity: 'normal',
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
        amount: 1,
      },
      {
        type: 'trash-self',
      },
    ],
    agentEffectSize: 'large',
    revealEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    rarity: 'normal',
  },
  {
    name: {
      en: 'Scouts',
      de: 'Kundschafter',
    },
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/smugglers_7.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'sword',
      },
    ],
    rarity: 'normal',
  },
  {
    name: {
      en: 'Discovering the Desert Planet',
      de: 'Erfahren des Wüstenplaneten',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'focus',
      },
    ],
    fieldAccess: ['spice', 'town'],
    agentEffectSize: 'large',
    revealEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    rarity: 'normal',
    cardAmount: 1,
    imageUrl: '/assets/images/action-backgrounds/desert_6.png',
  },
  {
    name: {
      en: 'Weapon Master',
      de: 'Waffenmeister',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'sword',
      },
    ],
    fieldAccess: ['town'],
    agentEffectSize: 'large',
    revealEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    rarity: 'normal',
    cardAmount: 1,
    imageUrl: '/assets/images/action-backgrounds/ornithopter_3.png',
  },
];
