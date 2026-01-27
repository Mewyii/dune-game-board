import { ImperiumCard } from '../models/imperium-card';

export const imperiumCards: ImperiumCard[] = [
  {
    name: {
      en: 'Litany Against Fear',
      de: 'Litanei gegen die Furcht',
    },
    faction: 'bene',
    persuasionCosts: 1,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/book_2.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    buyEffects: [
      {
        type: 'focus',
      },
    ],
    agentEffects: [
      {
        type: 'condition-connection',
        faction: 'bene',
      },
      {
        type: 'card-draw',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'focus',
      },
    ],
  },
  {
    name: {
      en: 'Usage of the voice',
      de: 'Einsatz der Stimme',
    },
    faction: 'bene',
    persuasionCosts: 1,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/voice.png',
    cardAmount: 2,
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
        type: 'trash-self',
      },
      {
        type: 'persuasion',
        amount: 3,
      },
    ],
  },
  {
    name: {
      en: 'Imperial Bribe',
      de: 'Imperiale Bestechung',
    },
    faction: 'emperor',
    persuasionCosts: 1,
    fieldAccess: ['bene', 'guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/wealth_2.png',
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
        type: 'solari',
        amount: 3,
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
      en: 'Contemplating the moves',
      de: 'Abwägen der Schritte',
    },
    faction: 'emperor',
    persuasionCosts: 1,
    fieldAccess: ['emperor', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/emperor.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'small',
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
    buyEffects: [
      {
        type: 'focus',
      },
    ],
    agentEffects: [
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'intrigue-trash',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'intrigue',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'solari',
      },
    ],
  },
  {
    name: {
      en: 'Ruthless Harvest',
      de: 'Rücksichtslose Ernte',
    },
    faction: 'emperor',
    persuasionCosts: 1,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/spice_port.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    agentEffects: [
      {
        type: 'condition-influence',
        amount: 2,
        faction: 'emperor',
      },
      {
        type: 'card-discard',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'spice',
        amount: 2,
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
      en: 'Desert Training',
      de: 'Wüsten Ausbildung',
    },
    faction: 'emperor',
    persuasionCosts: 1,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/assault_trooper_2.png',
    cardAmount: 2,
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
    agentEffects: [
      {
        type: 'troop',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'sword',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'emperor',
      },
      {
        type: 'water',
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
      en: 'Desert Guide',
      de: 'Wüstenführer',
    },
    faction: 'fremen',
    persuasionCosts: 1,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors_2.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    agentEffects: [
      {
        type: 'condition-influence',
        amount: 2,
        faction: 'fremen',
      },
      {
        type: 'spice',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
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
  {
    name: {
      en: 'Faithful',
      de: 'Gläubige',
    },
    faction: 'fremen',
    persuasionCosts: 1,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/faithful_5.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    buyEffects: [
      {
        type: 'solari',
      },
    ],
    agentEffects: [
      {
        type: 'condition-connection',
        faction: 'bene',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'troop',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'solari',
      },
    ],
  },
  {
    name: {
      en: 'Smuggling Gang',
      de: 'Schmugglerbande',
    },
    faction: 'guild',
    persuasionCosts: 1,
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/smugglers_8.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    buyEffects: [
      {
        type: 'spice',
      },
    ],
    agentEffects: [
      {
        type: 'condition-influence',
        amount: 2,
        faction: 'guild',
      },
      {
        type: 'solari',
      },
    ],
    revealEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-or',
      },
      {
        type: 'tech',
      },
    ],
  },
  {
    name: {
      en: 'Guild Administrator',
      de: 'Gilden Administrator',
    },
    faction: 'guild',
    persuasionCosts: 1,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/guild_banker_8.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '{faction:guild} Influence <br>0 {resource:solari} {resource:helper-or} 2 {resource:solari;amount:2} {resource:helper-or} 4 {resource:solari;amount:3}',
      de: '{faction:guild} Einfluss <br>0 {resource:solari} {resource:helper-or} 2 {resource:solari;amount:2} {resource:helper-or} 4 {resource:solari;amount:3}',
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
  },
  {
    name: {
      en: 'Smuggler escort',
      de: 'Schmuggler-Geleitschutz',
    },
    faction: 'guild',
    persuasionCosts: 1,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/smugglers_2.png',
    cardAmount: 2,
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
    agentEffects: [
      {
        type: 'card-draw',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'helper-or',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Guild Adjutant',
      de: 'Gilden Adjutant',
    },
    faction: 'guild',
    persuasionCosts: 1,
    fieldAccess: ['landsraad'],
    imageUrl: '/assets/images/action-backgrounds/guild_adjutant_3.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'small',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'foldspace',
      },
    ],
    revealEffects: [
      {
        type: 'sword',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-dreadnought-in-garrison-amount',
      },
      {
        type: 'water',
      },
    ],
  },
  {
    name: {
      en: 'Suk Doctor',
      de: 'Suk-Arzt',
    },
    persuasionCosts: 2,
    fieldAccess: ['landsraad'],
    imageUrl: '/assets/images/action-backgrounds/suk_doc.png',
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
      en: 'You may retreat <b>1</b> inserted troops after the combat phase.',
      de: 'Du kannst nach der Kampf-Phase <b>1</b> eingesetzten Trupp zurückziehen.',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'card-draw',
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
      en: 'Yueh, Traitor',
      de: 'Dr. Yueh, Verräter',
    },
    persuasionCosts: 2,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/yueh.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    revealEffectSize: 'large',
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'faction-influence-down-choice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'location-control',
      },
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'trash-self',
      },
    ],
  },
  {
    name: {
      en: 'Spreading the Faith',
      de: 'Den Glauben Verbreiten',
    },
    faction: 'bene',
    persuasionCosts: 2,
    fieldAccess: ['fremen', 'town'],
    imageUrl: '/assets/images/action-backgrounds/book.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    agentEffects: [
      {
        type: 'condition-connection',
        faction: 'bene',
      },
      {
        type: 'faction-influence-up-fremen',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'card-draw',
      },
    ],
    revealEffects: [
      {
        type: 'faction-influence-up-bene',
      },
      {
        type: 'recruitment-bene',
      },
    ],
  },
  {
    name: {
      en: 'Bene Gesserit Acolyte',
      de: 'Bene Gesserit Akolythin',
    },
    faction: 'bene',
    persuasionCosts: 2,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_19.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    agentEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'bene',
      },
      {
        type: 'card-draw',
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
      en: 'Bene Gesserit Concubine',
      de: 'Bene Gesserit Konkubine',
    },
    faction: 'bene',
    persuasionCosts: 2,
    fieldAccess: ['landsraad'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_6.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'solari',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-enemies-on-this-field',
      },
      {
        type: 'solari',
        amount: -1,
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
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
      en: 'Adaption',
      de: 'Adaption',
    },
    faction: 'bene',
    persuasionCosts: 2,
    fieldAccess: ['bene'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_14.png',
    cardAmount: 2,
    canInfiltrate: true,
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
    agentEffects: [
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
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Pledge of Loyalty',
      de: 'Loyalitätsbekundung',
    },
    faction: 'emperor',
    persuasionCosts: 2,
    fieldAccess: ['emperor'],
    imageUrl: '/assets/images/action-backgrounds/imperial_delegation.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    revealEffectSize: 'large',
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    agentEffects: [
      {
        type: 'condition-influence',
        amount: 2,
        faction: 'emperor',
      },
      {
        type: 'solari',
        amount: 2,
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'recruitment-emperor',
      },
      {
        type: 'troop',
      },
    ],
  },
  {
    name: {
      en: 'Imperial Pilot',
      de: 'Imperialer Pilot',
    },
    faction: 'emperor',
    persuasionCosts: 2,
    fieldAccess: ['landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/pilot.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'small',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'small',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'troop-insert-or-retreat',
        amount: 1,
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-dreadnought-in-conflict-amount',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Imperial Spies',
      de: 'Imperiale Spione',
    },
    faction: 'emperor',
    persuasionCosts: 2,
    fieldAccess: ['fremen', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/fremen_6.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'small',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'multiplier-enemies-on-this-field',
      },
      {
        type: 'card-draw',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'helper-or',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'troop',
      },
    ],
  },
  {
    name: {
      en: 'Personal Audience',
      de: 'Persönliche Audienz',
    },
    faction: 'emperor',
    persuasionCosts: 2,
    fieldAccess: ['emperor'],
    imageUrl: '/assets/images/action-backgrounds/emperor_2.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'small',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'troop',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Supply Ambush',
      de: 'Versorgungsüberfall',
    },
    faction: 'fremen',
    persuasionCosts: 2,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors_4.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'small',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'tech',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-enemies-on-this-field',
      },
      {
        type: 'solari',
        amount: -1,
      },
    ],
    revealEffects: [
      {
        type: 'sword',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'troop-insert',
        amount: 1,
      },
    ],
  },
  {
    name: {
      en: 'Fremen Scouts',
      de: 'Fremen Kundschafter',
    },
    faction: 'fremen',
    persuasionCosts: 2,
    fieldAccess: ['fremen', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors_3.png',
    cardAmount: 2,
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
    buyEffects: [
      {
        type: 'water',
      },
    ],
    agentEffects: [
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
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'recruitment-fremen',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Shadout Mapes, Believer',
      de: 'Shadout Mapes, Gläubige',
    },
    faction: 'fremen',
    persuasionCosts: 2,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/shadout.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'small',
    customAgentEffect: {
      en: 'Each opponent reveals one of his intrigues.',
      de: 'Jeder Gegner deckt eine seiner Intrigen auf.',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'trash-self',
      },
    ],
    revealEffects: [
      {
        type: 'condition-connection',
        faction: 'bene',
      },
      {
        type: 'persuasion',
        amount: 2,
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
  {
    name: {
      en: 'Smuggling Operation',
      de: 'Schmuggeloperation',
    },
    faction: 'guild',
    persuasionCosts: 2,
    fieldAccess: ['guild', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/sandcrawler.png',
    cardAmount: 2,
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
    buyEffects: [
      {
        type: 'solari',
        amount: 2,
      },
    ],
    agentEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'tech',
        amount: 2,
      },
    ],
    revealEffects: [
      {
        type: 'solari',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Guild Agent',
      de: 'Gilden Agent',
    },
    faction: 'guild',
    persuasionCosts: 2,
    fieldAccess: ['fremen', 'town'],
    imageUrl: '/assets/images/action-backgrounds/guild_agent.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'small',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'condition-enemies-on-this-field',
      },
      {
        type: 'card-discard',
      },
    ],
    revealEffects: [
      {
        type: 'multiplier-agents-on-board-spaces',
      },
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
  },
  {
    name: {
      en: 'Promise of Stability',
      de: 'Stabilitäts-versprechen',
    },
    faction: 'bene',
    persuasionCosts: 3,
    fieldAccess: ['bene', 'guild'],
    imageUrl: '/assets/images/action-backgrounds/conspiracy_2.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'small',
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
    buyEffects: [
      {
        type: 'intrigue',
      },
    ],
    agentEffects: [
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'intrigue-trash',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'intrigue',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Prana Bindu Training',
      de: 'Prana Bindu Geistesausbildung',
    },
    faction: 'bene',
    persuasionCosts: 3,
    fieldAccess: ['bene', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_4.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    revealEffectSize: 'large',
    buyEffects: [
      {
        type: 'focus',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    agentEffects: [
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
        type: 'signet-ring',
      },
    ],
  },
  {
    name: {
      en: 'Prana Bindu combat training',
      de: 'Prana Bindu Kampfausbildung',
    },
    faction: 'bene',
    persuasionCosts: 3,
    fieldAccess: ['bene'],
    imageUrl: '/assets/images/action-backgrounds/combat.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'small',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'troop',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'bene',
      },
      {
        type: 'intrigue',
      },
    ],
    revealEffects: [
      {
        type: 'sword',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-cards-with-sword',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Whispers of prophecies',
      de: 'Geflüster von Prophezeiungen',
    },
    faction: 'bene',
    persuasionCosts: 3,
    fieldAccess: ['bene', 'fremen'],
    imageUrl: '/assets/images/action-backgrounds/paul_2.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    agentEffects: [
      {
        type: 'condition-connection',
        faction: 'bene',
      },
      {
        type: 'spice',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'troop',
      },
    ],
    revealEffects: [
      {
        type: 'faction-influence-up-fremen',
      },
      {
        type: 'recruitment-fremen',
      },
    ],
  },
  {
    name: {
      en: 'Plans over generations',
      de: 'Pläne über Generationen',
    },
    faction: 'bene',
    persuasionCosts: 3,
    fieldAccess: ['emperor', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_15.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'small',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: 'If you have no units in combat: {resource:persuasion;amount:3}',
      de: 'Wenn du keine Einheiten in der Schlacht hast: {resource:persuasion;amount:3}',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'solari',
      },
      {
        type: 'troop',
      },
    ],
    revealEffects: [],
  },
  {
    name: {
      en: 'Display of Force',
      de: 'Machtdemonstration',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/harkonnen_ceremony.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    revealEffectSize: 'large',
    buyEffects: [],
    agentEffects: [
      {
        type: 'condition-connection',
        faction: 'emperor',
      },
      {
        type: 'faction-influence-up-choice',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'recruitment-emperor',
      },
    ],
  },
  {
    name: {
      en: 'Sardaukar Infiltrators',
      de: 'Sardaukar Infiltratoren',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_4.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'condition-enemies-on-this-field',
      },
      {
        type: 'loose-troop',
      },
    ],
    revealEffects: [
      {
        type: 'sword',
      },
      {
        type: 'helper-or',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'loose-troop',
      },
      {
        type: 'location-control',
      },
    ],
  },
  {
    name: {
      en: 'Sardaukar Lasgun Team',
      de: 'Sardaukar Lasgun-Team',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_6.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'condition-enemies-on-this-field',
      },
      {
        type: 'loose-troop',
      },
    ],
    revealEffects: [
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
      en: 'Imperial Caid',
      de: 'Imperialer Caid',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['emperor', 'guild'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_5.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    agentEffects: [
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
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'recruitment-emperor',
      },
    ],
  },
  {
    name: {
      en: 'Insurgents',
      de: 'Aufrührer',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/battle.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'If this location is controlled by an opponent, they lose {resource:solari;amount:2} and you gain {resource:solari;amount:2}.',
      de: 'Wenn ein Gegner diesen Ort kontrolliert, verliert er {resource:solari;amount:2} und du erhältst {resource:solari;amount:2}.',
      fontSize: 'small',
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
        type: 'helper-or',
      },
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
  },
  {
    name: {
      en: 'Scouring the desert',
      de: 'Durchkämmen der Wüste',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/landing_ship.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    buyEffects: [],
    agentEffects: [
      {
        type: 'loose-troop',
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
    revealEffects: [
      {
        type: 'intrigue',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'emperor',
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
      en: 'Desert Ambush',
      de: 'Wüsten-Hinterhalt',
    },
    faction: 'fremen',
    persuasionCosts: 3,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/ambush.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'small',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'condition-enemies-on-this-field',
      },
      {
        type: 'loose-troop',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'water',
      },
    ],
    revealEffects: [
      {
        type: 'sword',
      },
      {
        type: 'sword',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'troop-insert',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Jamis, Guide of the way',
      de: 'Jamis, Bereiter des Weges',
    },
    faction: 'fremen',
    persuasionCosts: 3,
    fieldAccess: ['fremen', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/jamis.png',
    cardAmount: 1,
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'recruitment-fremen',
      },
      {
        type: 'sword',
      },
    ],
    agentEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'focus',
      },
      {
        type: 'focus',
      },
      {
        type: 'trash-self',
      },
    ],
  },
  {
    name: {
      en: 'Understanding the Signs',
      de: 'Zeichen von Shai-Hulud',
    },
    faction: 'fremen',
    persuasionCosts: 3,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/worm_rider_2.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    revealEffectSize: 'large',
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'focus',
      },
    ],
    agentEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'spice',
      },
    ],
  },
  {
    name: {
      en: 'Fremen believers',
      de: 'Fremen Gläubige',
    },
    faction: 'fremen',
    persuasionCosts: 3,
    fieldAccess: ['fremen', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/fremen_8.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '{faction:fremen} Influence<br>0 {resource:persuasion;amount:1}{resource:helper-or}2 {resource:persuasion;amount:1} {resource:spice}{resource:helper-or}4 {resource:persuasion;amount:2} {resource:spice}',
      de: '{faction:fremen} Einfluss <br>0 {resource:persuasion;amount:1}{resource:helper-or}2 {resource:persuasion;amount:1} {resource:spice}{resource:helper-or}4 {resource:persuasion;amount:2} {resource:spice}',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'condition-connection',
        faction: 'bene',
      },
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    revealEffects: [],
  },
  {
    name: {
      en: 'Shishakli, Fedaykin Commando',
      de: 'Shishakli, Fedaykin Kommando',
    },
    faction: 'fremen',
    persuasionCosts: 3,
    fieldAccess: ['fremen', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/shishakli.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    agentEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'troop',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'sword',
      },
      {
        type: 'helper-or',
      },
      {
        type: 'trash-self',
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
      en: 'Fremen Stillsuits',
      de: 'Fremen Destillanzüge',
    },
    faction: 'fremen',
    persuasionCosts: 3,
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/stillsuits_2.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    agentEffects: [
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'card-draw',
      },
    ],
    revealEffects: [
      {
        type: 'water',
      },
    ],
  },
  {
    name: {
      en: 'Fremen Wormrider',
      de: 'Fremen Wurmreiter',
    },
    faction: 'fremen',
    persuasionCosts: 3,
    fieldAccess: ['fremen', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/worm_rider_3.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'small',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'spice',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'sword',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'troop-insert',
        amount: 1,
      },
    ],
  },
  {
    name: {
      en: 'Staban Tuek, Smuggler',
      de: 'Staban Tuek, Schmuggler',
    },
    faction: 'guild',
    persuasionCosts: 3,
    fieldAccess: ['guild', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/staban.png',
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
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    agentEffects: [
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
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'spice',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Guild Envoy',
      de: 'Gilden Botschafter',
    },
    faction: 'guild',
    persuasionCosts: 3,
    fieldAccess: ['guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/guild_banker_3.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '{faction:guild} Influence <br>0 {resource:foldspace} {resource:helper-or} 2 {resource:water} {resource:helper-or} 4 {resource:foldspace} {resource:water}',
      de: '{faction:guild} Einfluss <br>0 {resource:foldspace} {resource:helper-or} 2 {resource:water} {resource:helper-or} 4 {resource:foldspace} {resource:water}',
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
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Guild Officer',
      de: 'Gilden Offizier',
    },
    faction: 'guild',
    persuasionCosts: 3,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/guild_adjutant_1.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'small',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'small',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'dreadnought-insert-or-retreat',
        amount: 1,
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'sword',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-dreadnought-in-garrison-amount',
      },
      {
        type: 'troop',
      },
    ],
  },
  {
    name: {
      en: 'Dr. Yueh, Suk Doctor',
      de: 'Dr. Yueh, Suk-Arzt',
    },
    persuasionCosts: 4,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/yueh_2.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'small',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: 'You may retreat up to <b>2</b> inserted troops after the combat phase.',
      de: 'Du kannst nach der Kampf-Phase bis zu <b>2</b> eingesetzte Truppen zurückziehen.',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'card-return-to-hand',
        amount: 1,
      },
    ],
    revealEffects: [],
  },
  {
    name: {
      en: 'Bene Gesserit Sister',
      de: 'Bene Gesserit Schwester',
    },
    faction: 'bene',
    persuasionCosts: 4,
    fieldAccess: ['bene', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_20.png',
    cardAmount: 2,
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
      {
        type: 'recruitment-bene',
      },
      {
        type: 'focus',
      },
    ],
  },
  {
    name: {
      en: 'Covert Influence',
      de: 'Heimliche Beeinflussung',
    },
    faction: 'bene',
    persuasionCosts: 4,
    fieldAccess: ['emperor', 'guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_9.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    agentEffects: [
      {
        type: 'enemies-card-discard',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'bene',
      },
      {
        type: 'spice',
        amount: 2,
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
      en: 'Seduction',
      de: 'Verführung',
    },
    faction: 'bene',
    persuasionCosts: 4,
    fieldAccess: ['landsraad'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_7.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'Each opponent on {faction:landsraad} board spaces of this type trashes one of his cards in his hand.',
      de: 'Jeder Gegner auf {faction:landsraad}-Feldern entsorgt eine Karte aus seiner Hand.',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [
      {
        type: 'intrigue',
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-connections',
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
      en: 'Jessica, Bene Gesserit Sister',
      de: 'Jessica, Bene Gesserit Schwester',
    },
    faction: 'bene',
    persuasionCosts: 4,
    fieldAccess: ['bene', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/jessica_4.png',
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
    agentEffects: [
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
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'focus',
      },
    ],
  },
  {
    name: {
      en: 'Instrumentalization of faith',
      de: 'Instrumentalisierung des Glaubens',
    },
    faction: 'bene',
    persuasionCosts: 4,
    fieldAccess: ['bene', 'town'],
    imageUrl: '/assets/images/action-backgrounds/speech.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    revealEffectSize: 'large',
    buyEffects: [],
    agentEffects: [
      {
        type: 'condition-influence',
        amount: 2,
        faction: 'emperor',
      },
      {
        type: 'solari',
        amount: 2,
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-influence',
        amount: 2,
        faction: 'fremen',
      },
      {
        type: 'water',
      },
    ],
    revealEffects: [
      {
        type: 'faction-influence-up-emperor',
      },
      {
        type: 'helper-or',
      },
      {
        type: 'faction-influence-up-fremen',
      },
    ],
  },
  {
    name: {
      en: 'Imperial Camp',
      de: 'Imperiales Lager',
    },
    faction: 'emperor',
    persuasionCosts: 4,
    fieldAccess: ['emperor', 'town'],
    imageUrl: '/assets/images/action-backgrounds/military_camp.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [
      {
        type: 'troop',
      },
      {
        type: 'tech',
      },
    ],
    agentEffects: [
      {
        type: 'condition-influence',
        amount: 2,
        faction: 'emperor',
      },
      {
        type: 'troop',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-connections',
        faction: 'emperor',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Sardaukar Battle Rites',
      de: 'Sardaukar Kampfriten',
    },
    faction: 'emperor',
    persuasionCosts: 4,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_battle_rites.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    agentEffects: [
      {
        type: 'focus',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'emperor',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'card-draw',
      },
    ],
    revealEffects: [
      {
        type: 'multiplier-troops-in-conflict',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Desert Travel',
      de: 'Wüsten-Fortbewegung',
    },
    faction: 'fremen',
    persuasionCosts: 4,
    fieldAccess: ['town', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/sandworm.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'agent-lift',
      },
    ],
    revealEffects: [
      {
        type: 'troop-insert',
        amount: 3,
      },
    ],
  },
  {
    name: {
      en: 'Sayyadinah',
      de: 'Sayyadinah',
    },
    faction: 'fremen',
    persuasionCosts: 4,
    fieldAccess: ['fremen'],
    imageUrl: '/assets/images/action-backgrounds/sayadina_2.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    buyEffects: [],
    customAgentEffect: {
      en: '{faction:bene} or {faction:fremen} 2 Influence: Get the card "Water of Life" from the imperium deck.',
      de: '{faction:bene} oder {faction:fremen} 2 Einfluss: Erhalte die Karte "Wasser des Lebens" aus dem Imperium-Stapel.',
      fontSize: 'small',
    },
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'water',
      },
    ],
  },
  {
    name: {
      en: 'Instilling Fear',
      de: 'Furcht vor dem Unbekannten',
    },
    faction: 'fremen',
    persuasionCosts: 4,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/harkonnen_soldier.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'Each opponent on {faction:spice} board spaces retreats <b>2</b> units.',
      de: 'Jeder Gegner auf {faction:spice}-Feldern zieht <b>2</b> Einheiten zurück.',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-connections',
        faction: 'fremen',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Prophecy of Paradise',
      de: 'Prophezeiung des Paradieses',
    },
    faction: 'fremen',
    persuasionCosts: 4,
    fieldAccess: ['fremen', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/sietch_2.png',
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
    agentEffects: [
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
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'recruitment-fremen',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'faction-influence-up-fremen',
      },
    ],
  },
  {
    name: {
      en: 'Fremen Warriors',
      de: 'Fremen Kämpfer',
    },
    faction: 'fremen',
    persuasionCosts: 4,
    fieldAccess: ['fremen', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors_5.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'small',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'focus',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'enemies-troop-destroy',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
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
      en: 'Transport Agreement',
      de: 'Transportabkommen',
    },
    faction: 'guild',
    persuasionCosts: 4,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/spaceship_fleet.png',
    cardAmount: 2,
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
    buyEffects: [
      {
        type: 'tech',
      },
    ],
    agentEffects: [
      {
        type: 'trash-self',
      },
      {
        type: 'solari',
        amount: 4,
      },
    ],
    revealEffects: [
      {
        type: 'water',
      },
      {
        type: 'helper-or',
      },
      {
        type: 'tech',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Privilege',
      de: 'Bevorzugung',
    },
    faction: 'guild',
    persuasionCosts: 4,
    fieldAccess: ['bene', 'emperor', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/port_4.png',
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
    buyEffects: [
      {
        type: 'faction-influence-up-guild',
      },
    ],
    agentEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'solari',
        amount: 4,
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'tech',
      },
    ],
  },
  {
    name: {
      en: 'Guild Banker',
      de: 'Gilden Bänker',
    },
    faction: 'guild',
    persuasionCosts: 4,
    fieldAccess: ['emperor', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/guild_banker.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '{faction:guild} Influence <br>0 {resource:solari;amount:2} {resource:helper-or} 2 {resource:solari;amount:3} {resource:helper-or} 4 {resource:solari;amount:4}',
      de: '{faction:guild} Einfluss <br>0 {resource:solari;amount:2} {resource:helper-or} 2 {resource:solari;amount:3} {resource:helper-or} 4 {resource:solari;amount:4}',
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
        type: 'faction-influence-up-guild',
      },
    ],
  },
  {
    name: {
      en: 'Gurney Halleck, Smuggler',
      de: 'Gurney Halleck, Schmuggler',
    },
    persuasionCosts: 5,
    fieldAccess: ['guild', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/gurney.png',
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
    buyEffects: [
      {
        type: 'spice',
      },
    ],
    agentEffects: [
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
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'spice',
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
      en: 'Hidden Connections',
      de: 'Versteckte Verbindungen',
    },
    faction: 'bene',
    persuasionCosts: 5,
    fieldAccess: ['landsraad'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_11.png',
    cardAmount: 2,
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
    buyEffects: [
      {
        type: 'faction-influence-up-bene',
      },
    ],
    agentEffects: [
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
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'intrigue',
      },
    ],
  },
  {
    name: {
      en: 'Truthsayer',
      de: 'Wahrsagerin',
    },
    faction: 'bene',
    persuasionCosts: 5,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_12.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '{faction:bene} Einfluss <br>0 {resource:card-draw} {resource:helper-or} 2 {resource:agent-lift} {resource:helper-or} 4 {resource:card-draw}{resource:agent-lift}',
      de: '{faction:bene} Einfluss <br>0 {resource:card-draw} {resource:helper-or} 2 {resource:agent-lift} {resource:helper-or} 4 {resource:card-draw}{resource:agent-lift}',
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
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'bene',
      },
      {
        type: 'intrigue-trash',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'intrigue',
      },
    ],
  },
  {
    name: {
      en: 'Wisdom of Ages',
      de: 'Wissen aus Zeitaltern',
    },
    faction: 'bene',
    persuasionCosts: 5,
    fieldAccess: ['bene', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_10.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'small',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'multiplier-agents-on-board-spaces',
      },
      {
        type: 'focus',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
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
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Bene Gesserit Archivar',
      de: 'Bene Gesserit Archivarin',
    },
    faction: 'bene',
    persuasionCosts: 5,
    fieldAccess: ['bene', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_17.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'small',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'multiplier-agents-on-board-spaces',
      },
      {
        type: 'card-draw',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 3,
      },
      {
        type: 'recruitment-bene',
      },
    ],
  },
  {
    name: {
      en: 'Iakin Nefud, Corporal',
      de: 'Iakin Nefud, Korporal',
    },
    faction: 'emperor',
    persuasionCosts: 5,
    fieldAccess: ['emperor', 'guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/twisted_mentat_2.png',
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
    agentEffects: [
      {
        type: 'solari',
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
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'recruitment-emperor',
      },
    ],
  },
  {
    name: {
      en: 'Imperial Assassin',
      de: 'Imperialer Assassine',
    },
    faction: 'emperor',
    persuasionCosts: 5,
    fieldAccess: ['guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/assassin.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'Each opponent trashes one of his cards in play.',
      de: 'Jeder Gegner entsorgt eine seiner Karten im Spiel.',
      fontSize: 'small',
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
        amount: 2,
      },
      {
        type: 'helper-or',
      },
      {
        type: 'trash-self',
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
      en: 'Sardaukar training',
      de: 'Sardaukar Ausbildung',
    },
    faction: 'emperor',
    persuasionCosts: 5,
    fieldAccess: ['emperor'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_9.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    agentEffects: [
      {
        type: 'loose-troop',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'multiplier-troops-in-conflict',
      },
      {
        type: 'sword',
      },
    ],
    revealEffects: [
      {
        type: 'focus',
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
      en: 'Provoked Hostilities',
      de: 'Provozierte Feindschaften',
    },
    faction: 'emperor',
    persuasionCosts: 5,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/battle_2.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'Each opponent on {faction:town} board spaces: {resource:loose-troop}<br>{faction:emperor} -Connection: {resource:troop}',
      de: 'Jeder Gegner auf {faction:town}-Feldern: {resource:loose-troop}<br>{faction:emperor} -Verbindung: {resource:troop}',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: 'Each opponent loses one troop in the conflict.',
      de: 'Jeder Gegner verliert einen Trupp im Konflikt.',
      fontSize: 'small',
    },
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
      en: 'Fedaykin',
      de: 'Fedaykin',
    },
    faction: 'fremen',
    persuasionCosts: 5,
    fieldAccess: ['fremen', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/fremen_5.png',
    cardAmount: 2,
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
    agentEffects: [
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
        type: 'location-control',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
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
      en: 'Fremen Tribe',
      de: 'Fremen Stamm',
    },
    faction: 'fremen',
    persuasionCosts: 5,
    fieldAccess: ['fremen', 'town', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors.png',
    cardAmount: 2,
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
    buyEffects: [
      {
        type: 'troop',
      },
      {
        type: 'troop',
      },
    ],
    agentEffects: [
      {
        type: 'troop',
      },
      {
        type: 'focus',
      },
    ],
    revealEffects: [
      {
        type: 'water',
      },
      {
        type: 'troop',
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
      en: 'Otheym, Naib',
      de: 'Otheym, Naib',
    },
    faction: 'fremen',
    persuasionCosts: 5,
    fieldAccess: ['fremen', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/fremen_2.png',
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
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    agentEffects: [
      {
        type: 'spice',
        amount: 2,
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'recruitment-fremen',
      },
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
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Korba, Naib',
      de: 'Korba, Naib',
    },
    faction: 'fremen',
    persuasionCosts: 5,
    fieldAccess: ['fremen', 'town'],
    imageUrl: '/assets/images/action-backgrounds/fremen_3.png',
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
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    agentEffects: [
      {
        type: 'water',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'recruitment-fremen',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'focus',
      },
    ],
  },
  {
    name: {
      en: 'Religious zeal',
      de: 'Religiöser Eifer',
    },
    faction: 'fremen',
    persuasionCosts: 5,
    fieldAccess: ['landsraad'],
    imageUrl: '/assets/images/action-backgrounds/jihad_2.png',
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
    buyEffects: [
      {
        type: 'faction-influence-up-bene',
      },
    ],
    agentEffects: [
      {
        type: 'focus',
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
    revealEffects: [
      {
        type: 'multiplier-troops-in-conflict',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Esmar Tuek, Smuggler',
      de: 'Esmar Tuek, Schmuggler',
    },
    faction: 'guild',
    persuasionCosts: 5,
    fieldAccess: ['guild', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/esmar.png',
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
    agentEffects: [
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
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'spice',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Guild Captain',
      de: 'Gilden Kapitän',
    },
    faction: 'guild',
    persuasionCosts: 5,
    fieldAccess: ['guild', 'town'],
    imageUrl: '/assets/images/action-backgrounds/guild_officer_2.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'small',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    agentEffects: [
      {
        type: 'multiplier-dreadnought-amount',
      },
      {
        type: 'card-draw',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'sword',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-dreadnought-in-conflict-amount',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Swordmaster',
      de: 'Schwertmeister',
    },
    persuasionCosts: 6,
    fieldAccess: ['landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/mentat.png',
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
    buyEffects: [
      {
        type: 'faction-influence-up-choice',
      },
    ],
    agentEffects: [
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
        type: 'troop',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
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
      en: 'Reverend Mother',
      de: 'Ehrwürdige Mutter',
    },
    faction: 'bene',
    persuasionCosts: 6,
    fieldAccess: ['bene', 'emperor', 'fremen', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_13.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-enemies-on-this-field',
      },
      {
        type: 'card-discard',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Dying in Darkness',
      de: 'Sterben in Dunkelheit',
    },
    faction: 'bene',
    persuasionCosts: 6,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/irulan_4.png',
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
    buyEffects: [
      {
        type: 'solari',
        amount: 5,
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'faction-influence-up-choice',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'troop-retreat',
        amount: 4,
      },
    ],
  },
  {
    name: {
      en: 'Enfeoffment by the Emperor',
      de: 'Belehnung durch den Imperator',
    },
    faction: 'emperor',
    persuasionCosts: 6,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/arrakeen_3.png',
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
    buyEffects: [
      {
        type: 'faction-influence-up-emperor',
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'location-control',
      },
      {
        type: 'trash-self',
      },
    ],
  },
  {
    name: {
      en: 'Imperial Burseg',
      de: 'Imperialer Burseg',
    },
    faction: 'emperor',
    persuasionCosts: 6,
    fieldAccess: ['emperor', 'guild', 'bene', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_3.png',
    cardAmount: 2,
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
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    agentEffects: [
      {
        type: 'card-draw',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'recruitment-emperor',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Imperial Court Member',
      de: 'imperiales Hofmitglied',
    },
    faction: 'emperor',
    persuasionCosts: 6,
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/imperial_court_member.png',
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
    buyEffects: [
      {
        type: 'faction-influence-up-emperor',
      },
    ],
    agentEffects: [
      {
        type: 'solari',
        amount: 5,
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
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'solari',
      },
    ],
  },
  {
    name: {
      en: 'Ramallo, Reverend Mother',
      de: 'Ramallo, Ehrwürdige Mutter ',
    },
    faction: 'fremen',
    persuasionCosts: 6,
    fieldAccess: ['bene', 'fremen'],
    imageUrl: '/assets/images/action-backgrounds/ramallo.png',
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
    buyEffects: [
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-connections',
        faction: 'fremen',
      },
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Fremen Elder',
      de: 'Fremen Ältester',
    },
    faction: 'fremen',
    persuasionCosts: 6,
    fieldAccess: ['fremen'],
    imageUrl: '/assets/images/action-backgrounds/fremen_elder_2.png',
    cardAmount: 1,
    buyEffects: [
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    agentEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'helper-or',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'recruitment-fremen',
      },
      {
        type: 'water',
      },
    ],
  },
  {
    name: {
      en: 'Fremen Elder ',
      de: 'Fremen Älteste',
    },
    faction: 'fremen',
    persuasionCosts: 6,
    fieldAccess: ['fremen'],
    imageUrl: '/assets/images/action-backgrounds/fremen_elder.png',
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
    buyEffects: [
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    agentEffects: [
      {
        type: 'signet-ring',
      },
      {
        type: 'helper-or',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'recruitment-fremen',
      },
      {
        type: 'spice',
      },
    ],
  },
  {
    name: {
      en: 'Guild Navigator',
      de: 'Gilden Navigator',
    },
    faction: 'guild',
    persuasionCosts: 6,
    fieldAccess: ['emperor', 'guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/guild_navigators_3.png',
    cardAmount: 2,
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
    buyEffects: [
      {
        type: 'spice',
      },
    ],
    agentEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'agent-lift',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Embargo',
      de: 'Embargo',
    },
    faction: 'guild',
    persuasionCosts: 6,
    fieldAccess: ['guild'],
    imageUrl: '/assets/images/action-backgrounds/highliner_2.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: 'Put {resource:troop} on up to <b>3</b> board spaces of your choice. They are blocked for this round.',
      de: 'Lege {resource:troop} auf bis zu <b>3</b> Felder deiner Wahl. Sie sind für diese Runde blockiert.',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'trash-self',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'card-draw',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 3,
      },
    ],
  },
  {
    name: {
      en: 'Twisted Mentat',
      de: 'Verderbter Mentat',
    },
    persuasionCosts: 7,
    fieldAccess: ['emperor', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/twisted_mentat.png',
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
    agentEffects: [
      {
        type: 'spice',
        amount: 2,
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
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'helper-or',
      },
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'agent',
      },
    ],
  },
  {
    name: {
      en: 'Duncan, Swordmaster',
      de: 'Duncan Idaho, Schwertmeister',
    },
    persuasionCosts: 7,
    fieldAccess: ['fremen', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/duncan.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'small',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'troop',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-influence',
        amount: 2,
        faction: 'fremen',
      },
      {
        type: 'troop',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'sword',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-troops-in-conflict',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Gurney Halleck, Warmaster',
      de: 'Gurney Halleck, Kriegsmeister',
    },
    persuasionCosts: 7,
    fieldAccess: ['landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/gurney_5.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'small',
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
    buyEffects: [
      {
        type: 'troop',
      },
      {
        type: 'focus',
      },
    ],
    agentEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'focus',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'troop-insert',
        amount: 2,
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'troop',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Jessica, Lady',
      de: 'Jessica, Lady',
    },
    faction: 'bene',
    persuasionCosts: 7,
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/jessica_5.png',
    cardAmount: 1,
    buyEffects: [
      {
        type: 'faction-influence-up-choice',
      },
    ],
    agentEffects: [
      {
        type: 'signet-ring',
      },
      {
        type: 'card-draw',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 3,
      },
    ],
  },
  {
    name: {
      en: 'Betrayal',
      de: 'Verrat',
    },
    faction: 'emperor',
    persuasionCosts: 7,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/battle_3.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '{resource:solari;amount:2} {resource:helper-trade} Get {resource:intrigue} from each opponent on {faction:town} board spaces .',
      de: '{resource:solari;amount:2} {resource:helper-trade} Erhalte von jedem Gegner auf {faction:town}-Feldern {resource:intrigue}.',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: 'Each opponent loses <b>4</b> troops in the conflict.',
      de: 'Jeder Gegner verliert <b>4</b> Truppen im Konflikt.',
      fontSize: 'small',
    },
    buyEffects: [
      {
        type: 'intrigue',
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'trash-self',
      },
    ],
  },
  {
    name: {
      en: 'Imperial Bashar',
      de: 'Imperialer Bashar',
    },
    faction: 'emperor',
    persuasionCosts: 7,
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/imperial_bashar.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [
      {
        type: 'intrigue',
      },
      {
        type: 'troop',
      },
    ],
    agentEffects: [
      {
        type: 'intrigue',
      },
      {
        type: 'intrigue',
      },
      {
        type: 'intrigue-trash',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 3,
      },
      {
        type: 'recruitment-emperor',
      },
    ],
  },
  {
    name: {
      en: 'Jessica, Reverend Mother',
      de: 'Jessica, Ehrwürdige Mutter',
    },
    faction: 'fremen',
    persuasionCosts: 7,
    fieldAccess: ['fremen', 'town'],
    imageUrl: '/assets/images/action-backgrounds/jessica.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'card-draw-or-destroy',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 3,
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-connections',
        faction: 'fremen',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Destruction of the spice harvest',
      de: 'Vernichtung der Spice-Ernte',
    },
    faction: 'fremen',
    persuasionCosts: 7,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/lasguns.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'Each opponent on {faction:spice} fields loses {resource:spice;amount:2} and you gain {resource:spice;amount:2}.',
      de: 'Jeder Gegner auf {faction:spice}-Feldern verliert {resource:spice;amount:2} und du erhältst {resource:spice;amount:2}.',
      fontSize: 'small',
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
        type: 'spice',
        amount: 3,
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
      en: 'Edric, Guild Navigator',
      de: 'Edric, Gilden Navigator',
    },
    faction: 'guild',
    persuasionCosts: 7,
    fieldAccess: ['bene', 'emperor', 'guild', 'town'],
    imageUrl: '/assets/images/action-backgrounds/guild_navigators.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [
      {
        type: 'faction-influence-up-guild',
      },
      {
        type: 'spice',
      },
    ],
    agentEffects: [
      {
        type: 'intrigue-trash',
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
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'solari',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Guild Admiral',
      de: 'Gilden Admiral',
    },
    faction: 'guild',
    persuasionCosts: 7,
    fieldAccess: ['emperor', 'guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/guild_captain_1.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'small',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [
      {
        type: 'faction-influence-up-choice',
      },
    ],
    agentEffects: [
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
        type: 'dreadnought',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'dreadnought-insert-or-retreat',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Piter De Vries, Twisted Mentat',
      de: 'Piter De Vries, Verderbter Mentat',
    },
    persuasionCosts: 8,
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/piter.png',
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
    agentEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'intrigue',
      },
      {
        type: 'card-draw',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'helper-or',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'agent',
      },
    ],
  },
  {
    name: {
      en: 'Thufir Hawat, Mentat',
      de: 'Thufir Hawat, Mentat',
    },
    persuasionCosts: 8,
    fieldAccess: ['landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/thufir_2.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    agentEffects: [
      {
        type: 'enemies-intrigue-trash',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'intrigue',
      },
      {
        type: 'helper-or',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'agent',
      },
    ],
  },
  {
    name: {
      en: 'Mohiam, Reverend Mother',
      de: 'Mohiam, Ehrwürdige Mutter',
    },
    faction: 'bene',
    persuasionCosts: 8,
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad'],
    imageUrl: '/assets/images/leaders/mohiam.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'You may look at the top card of the intrigue deck as well as the conflict deck.',
      de: 'Du kannst dir die oberste Karte des Intrigen-Stapels sowie des Konflikt-Stapels ansehen.',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    buyEffects: [
      {
        type: 'faction-influence-up-bene',
      },
      {
        type: 'faction-influence-up-bene',
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'recruitment-bene',
      },
      {
        type: 'intrigue',
      },
    ],
  },
  {
    name: {
      en: 'Intervention of the Emperor',
      de: 'Eingriff des Imperators',
    },
    faction: 'emperor',
    persuasionCosts: 8,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/ship.png',
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
    buyEffects: [
      {
        type: 'dreadnought',
      },
      {
        type: 'location-control',
      },
    ],
    agentEffects: [
      {
        type: 'faction-influence-up-emperor',
      },
      {
        type: 'troop',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'solari',
      },
      {
        type: 'troop',
      },
    ],
  },
  {
    name: {
      en: 'Water of Life',
      de: 'Wasser des Lebens',
    },
    faction: 'fremen',
    persuasionCosts: 8,
    fieldAccess: ['fremen'],
    imageUrl: '/assets/images/action-backgrounds/water_of_life.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '{faction:bene} or {faction:fremen} Alliance: {resource:trash-self} {resource:victory-point}',
      de: '{faction:bene} oder {faction:fremen} Allianz: {resource:trash-self} {resource:victory-point}',
      fontSize: 'small',
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
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'troop',
        amount: 2,
      },
      {
        type: 'faction-influence-up-fremen',
      },
    ],
  },
  {
    name: {
      en: 'The Voice from the Outer World',
      de: 'Stimme der Aussenwelt',
    },
    faction: 'fremen',
    persuasionCosts: 8,
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/faithful_6.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [
      {
        type: 'faction-influence-up-fremen',
      },
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    agentEffects: [
      {
        type: 'troop',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-connections',
        faction: 'fremen',
      },
      {
        type: 'troop',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'recruitment-fremen',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'multiplier-connections',
        faction: 'fremen',
      },
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
  },
  {
    name: {
      en: 'Secret Transports',
      de: 'Geheime Transporte',
    },
    faction: 'guild',
    persuasionCosts: 8,
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/highliner.png',
    cardAmount: 1,
    canInfiltrate: true,
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
    agentEffects: [
      {
        type: 'foldspace',
      },
      {
        type: 'agent-lift',
      },
    ],
    revealEffects: [
      {
        type: 'water',
      },
      {
        type: 'tech',
        amount: 2,
      },
    ],
  },
  {
    name: {
      en: 'Bene gesserit chapter',
      de: 'Bene Gesserit Kapitel',
    },
    faction: 'bene',
    persuasionCosts: 9,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_16.png',
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
    buyEffects: [
      {
        type: 'victory-point',
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'faction-influence-up-choice',
      },
      {
        type: 'intrigue',
      },
    ],
  },
  {
    name: {
      en: 'Fief: Caladan',
      de: 'Lehen: Caladan',
    },
    faction: 'emperor',
    persuasionCosts: 9,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/caladan.png',
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
    buyEffects: [
      {
        type: 'victory-point',
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'water',
      },
      {
        type: 'troop',
      },
      {
        type: 'focus',
      },
    ],
  },
  {
    name: {
      en: 'Fief: Giedi Prime',
      de: 'Lehen: Giedi Prime',
    },
    faction: 'emperor',
    persuasionCosts: 9,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/giedi_prime.png',
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
    buyEffects: [
      {
        type: 'victory-point',
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'intrigue',
      },
      {
        type: 'troop',
        amount: 2,
      },
      {
        type: 'tech',
      },
    ],
  },
  {
    name: {
      en: 'Fremen Sietch',
      de: 'Fremen Sietch',
    },
    faction: 'fremen',
    persuasionCosts: 9,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/sietch_4.png',
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
    buyEffects: [
      {
        type: 'victory-point',
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'water',
      },
      {
        type: 'spice',
      },
      {
        type: 'troop',
        amount: 2,
      },
    ],
  },
];
