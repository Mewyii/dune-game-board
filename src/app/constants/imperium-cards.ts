import { ImperiumCard } from '../models/imperium-card';

export const imperiumCards: ImperiumCard[] = [
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
      {
        type: 'helper-or',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'leader-heal',
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
    rarity: 'rare',
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
        type: 'faction-influence-down-choice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'location-control-choice',
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
      en: 'Spice-Supremacy',
      de: 'Kontrolle über das Spice',
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
    ],
    fieldAccess: [],
    agentEffectSize: 'small',
    revealEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: 'If you control <b>2</b> {faction:spice} locations and have {resource:spice;amount:4}: {resource:trash-self} {resource:victory-point}',
      de: 'Wenn du <b>2</b> {faction:spice}-Orte kontrollierst und {resource:spice;amount:4} hast: {resource:trash-self} {resource:victory-point}',
      fontSize: 'small',
    },
    rarity: 'normal',
    cardAmount: 1,
    persuasionCosts: 2,
    imageUrl: '/assets/images/action-backgrounds/spice.png',
    backgroundColor: 'orange',
  },
  {
    name: {
      en: 'Military Might',
      de: 'Militärische Macht',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    fieldAccess: [],
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: 'If you have <b>8</b> troops in your garrison: {resource:trash-self} {resource:victory-point}',
      de: 'Wenn du <b>8</b> Truppen in deiner Garnison hast: {resource:trash-self} {resource:victory-point}',
      fontSize: 'small',
    },
    rarity: 'normal',
    cardAmount: 1,
    imageUrl: '/assets/images/action-backgrounds/troops_3.png',
    persuasionCosts: 2,
    backgroundColor: 'orange',
  },
  {
    name: {
      en: 'Landsraad leadership',
      de: 'Landsraad-Führerschaft',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    fieldAccess: [],
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: 'If you have a high council seat, <b>15</b> persuasion and not more than <b>2</b> {faction:emperor}-influence: <br>{resource:trash-self} {resource:victory-point} {resource:victory-point}',
      de: 'Wenn du einen Sitz im hohen Rat, <b>15</b> Überzeugung und maximal <b>2</b> {faction:emperor}-Einfluss hast: <br>{resource:trash-self} {resource:victory-point} {resource:victory-point}',
      fontSize: 'small',
    },
    rarity: 'normal',
    cardAmount: 1,
    imageUrl: '/assets/images/action-backgrounds/signet_ring.png',
    persuasionCosts: 2,
    backgroundColor: 'orange',
  },
  {
    name: {
      en: 'Against the old order',
      de: 'Gegen die alte Ordnung',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    fieldAccess: [],
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: "If you control <b>3</b> locations and don't have more than <b>1</b> {faction:emperor}-, {faction:guild}- and {faction:bene}-influence: <br>{resource:trash-self} {resource:victory-point} {resource:victory-point}",
      de: 'Wenn du <b>3</b> Orte kontrollierst und maximal <b>1</b> {faction:emperor}-, {faction:guild}- und {faction:bene}-Einfluss hast: <br>{resource:trash-self} {resource:victory-point} {resource:victory-point}',
      fontSize: 'small',
    },
    rarity: 'normal',
    cardAmount: 1,
    imageUrl: '/assets/images/action-backgrounds/lighter_2.png',
    persuasionCosts: 2,
    backgroundColor: 'orange',
  },
  {
    name: {
      en: 'Machine Pact with Ix',
      de: 'Maschinenpakt mit IX',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    fieldAccess: [],
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: 'If you have <b>4</b> {resource:tech-tile}: {resource:trash-self} {resource:victory-point}',
      de: 'Wenn du <b>4</b> {resource:tech-tile} besitzt: {resource:trash-self} {resource:victory-point}',
      fontSize: 'small',
    },
    rarity: 'normal',
    cardAmount: 1,
    imageUrl: '/assets/images/action-backgrounds/spaceship_landing.png',
    persuasionCosts: 2,
    backgroundColor: 'orange',
  },
  {
    name: {
      en: 'Comprehending the connections',
      de: 'Verstehen der Zusammenhänge',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    fieldAccess: [],
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: 'If you have <b>2</b> influence at every influence track: {resource:trash-self} {resource:victory-point}',
      de: 'Wenn du <b>2</b> Einfluss bei allen Einflussleisten hast: {resource:trash-self} {resource:victory-point}',
      fontSize: 'small',
    },
    rarity: 'normal',
    cardAmount: 1,
    imageUrl: '/assets/images/action-backgrounds/ecological_testing_station.png',
    persuasionCosts: 2,
    backgroundColor: 'orange',
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
    rarity: 'rare',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'card-return-to-hand',
        amount: 1,
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'leader-heal',
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
    rarity: 'rare',
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
      en: 'Covert Pact with House Wayku',
      de: 'Geheimes Bündnis mit Haus Wayku',
    },
    buyEffects: [
      {
        type: 'intrigue',
      },
    ],
    agentEffects: [
      {
        type: 'foldspace',
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
        type: 'helper-separator',
      },
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'dreadnought',
      },
      {
        type: 'faction-influence-up-choice',
      },
    ],
    fieldAccess: ['guild', 'landsraad', 'town'],
    agentEffectSize: 'large',
    revealEffectSize: 'small',
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
    persuasionCosts: 5,
    imageUrl: '/assets/images/action-backgrounds/house_wayku.png',
  },
  {
    name: {
      en: 'Intelligence Trade with House Wydras',
      de: 'Informationshandel mit Haus Wydras',
    },
    buyEffects: [
      {
        type: 'intrigue',
      },
    ],
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
        amount: 2,
      },
      {
        type: 'troop',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-high-council-seat',
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
    fieldAccess: ['landsraad', 'town'],
    agentEffectSize: 'small',
    revealEffectSize: 'small',
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
    persuasionCosts: 5,
    canInfiltrate: true,
    imageUrl: '/assets/images/action-backgrounds/house_wydras.png',
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
      en: 'Duncan Idaho, Swordmaster',
      de: 'Duncan Idaho, Schwertmeister',
    },
    persuasionCosts: 6,
    fieldAccess: ['fremen', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/duncan.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'small',
    rarity: 'rare',
    customAgentEffect: {
      en: 'Remove enemy agents from this board space. They are no longer available for this round.',
      de: 'Entferne gegnerische {resource:agent} von diesem Feld. Sie sind für diese Runde nicht mehr verfügbar.',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
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
    agentEffects: [],
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
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'House Maros Trade Accord',
      de: 'Handelsvertrag mit Haus Maros',
    },
    buyEffects: [
      {
        type: 'solari',
        amount: 2,
      },
    ],
    agentEffects: [
      {
        type: 'multiplier-own-agents-on-field-type',
        action: 'landsraad',
      },
      {
        type: 'solari',
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
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'victory-point',
      },
    ],
    fieldAccess: ['landsraad', 'town'],
    agentEffectSize: 'small',
    revealEffectSize: 'small',
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
    imageUrl: '/assets/images/action-backgrounds/house_maros.png',
    persuasionCosts: 6,
  },
  {
    name: {
      en: 'Supply Accord with House Alexin',
      de: 'Versorgungsvertrag mit Haus Alexin',
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
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'troop',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'victory-point',
      },
    ],
    fieldAccess: ['fremen', 'landsraad', 'town'],
    agentEffectSize: 'large',
    revealEffectSize: 'small',
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
    persuasionCosts: 6,
    imageUrl: '/assets/images/action-backgrounds/house_alexin.png',
  },
  {
    name: {
      en: 'Propaganda Pact with House Taligari',
      de: 'Propagandavertrag mit Haus Taligari',
    },
    buyEffects: [
      {
        type: 'focus',
      },
    ],
    agentEffects: [
      {
        type: 'multiplier-own-agents-on-field-type',
        action: 'town',
      },
      {
        type: 'solari',
        amount: 2,
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
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'victory-point',
      },
    ],
    fieldAccess: ['emperor', 'landsraad'],
    agentEffectSize: 'small',
    revealEffectSize: 'small',
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
    persuasionCosts: 6,
    imageUrl: '/assets/images/action-backgrounds/house_taligari.png',
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
      en: 'Gurney Halleck, Warmaster',
      de: 'Gurney Halleck, Kriegsmeister',
    },
    persuasionCosts: 7,
    fieldAccess: ['landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/gurney_5.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'small',
    rarity: 'rare',
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
      en: 'Trade Agreement with House Hagal',
      de: 'Handelsabkommen mit Haus Hagal',
    },
    buyEffects: [
      {
        type: 'solari',
        amount: 3,
      },
    ],
    agentEffects: [
      {
        type: 'multiplier-own-agents-on-field-type',
        amount: 2,
        action: 'landsraad',
      },
      {
        type: 'card-draw',
      },
      {
        type: 'solari',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'troop',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'victory-point',
      },
    ],
    fieldAccess: ['emperor', 'landsraad', 'town'],
    agentEffectSize: 'small',
    revealEffectSize: 'small',
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
    imageUrl: '/assets/images/action-backgrounds/house_hagal.png',
    persuasionCosts: 7,
  },
  {
    name: {
      en: 'Secret Trade with House Mikarrol',
      de: 'Geheimer Handel mit Haus Mikarrol',
    },
    buyEffects: [
      {
        type: 'solari',
        amount: 3,
      },
    ],
    agentEffects: [
      {
        type: 'multiplier-own-agents-on-field-type',
        action: 'town',
      },
      {
        type: 'solari',
        amount: 3,
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'troop',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'victory-point',
      },
    ],
    fieldAccess: ['emperor', 'guild', 'landsraad'],
    agentEffectSize: 'small',
    revealEffectSize: 'small',
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
    persuasionCosts: 7,
    imageUrl: '/assets/images/action-backgrounds/house_mikarrol.png',
  },
  {
    name: {
      en: 'House Novebruns Resource Accord',
      de: 'Rohstoffabkommen mit Haus Novebruns',
    },
    buyEffects: [
      {
        type: 'tech',
      },
    ],
    agentEffects: [
      {
        type: 'tech',
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
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'victory-point',
      },
    ],
    fieldAccess: ['landsraad', 'spice', 'town'],
    agentEffectSize: 'large',
    revealEffectSize: 'small',
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
    persuasionCosts: 7,
    imageUrl: '/assets/images/action-backgrounds/house_novebruns.png',
  },
  {
    name: {
      en: 'Training Alliance with House Wallach',
      de: 'Ausbildungsbündnis mit Haus Wallach',
    },
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    agentEffects: [
      {
        type: 'multiplier-own-agents-on-field-type',
        action: 'town',
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
        type: 'troop',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'victory-point',
      },
    ],
    fieldAccess: ['bene', 'landsraad', 'town'],
    agentEffectSize: 'small',
    revealEffectSize: 'small',
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
    persuasionCosts: 7,
    canInfiltrate: false,
    imageUrl: '/assets/images/action-backgrounds/house_wallach.png',
  },
  {
    name: {
      en: 'Espionage Accord with House Spinette',
      de: 'Spionageabkommen mit Haus Spinette',
    },
    buyEffects: [
      {
        type: 'intrigue',
      },
    ],
    agentEffects: [
      {
        type: 'multiplier-enemies-on-this-field',
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
        type: 'troop',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'victory-point',
      },
    ],
    fieldAccess: ['landsraad', 'spice', 'town'],
    agentEffectSize: 'small',
    revealEffectSize: 'small',
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
    persuasionCosts: 7,
    canInfiltrate: true,
    imageUrl: '/assets/images/action-backgrounds/house_spinette.png',
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
    rarity: 'rare',
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
    rarity: 'rare',
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
        type: 'condition-enemies-on-field-type',
        action: 'town',
      },
      {
        type: 'intrigue-trash',
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
    agentEffects: [
      {
        type: 'card-discard',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'card-draw-or-destroy',
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
      en: 'Control over the religion',
      de: 'Kontrolle über die Religion',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    fieldAccess: [],
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: 'If you control <b>2</b> {faction:town} locations and have <b>4</b> {faction:bene}-influence: {resource:trash-self} {resource:victory-point}',
      de: 'Wenn du <b>2</b> {faction:town}-Orte kontrollierst <br>und <b>4</b> {faction:bene}-Einfluss hast: {resource:trash-self} {resource:victory-point}',
      fontSize: 'small',
    },
    rarity: 'normal',
    cardAmount: 1,
    imageUrl: '/assets/images/action-backgrounds/sayadina.png',
    faction: 'bene',
    persuasionCosts: 2,
    backgroundColor: 'orange',
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
    rarity: 'normal',
    factionSecondary: 'emperor',
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
    rarity: 'normal',
    factionSecondary: 'fremen',
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
      en: 'Bene Gesserit Missionary',
      de: 'Bene Gesserit Missionarin',
    },
    faction: 'bene',
    persuasionCosts: 4,
    fieldAccess: ['fremen', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_missionary.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'medium',
    rarity: 'normal',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'large',
    customRevealEffect: {
      en: 'Fremen cards cost {resource:persuasion;amount:-1} for you this round',
      de: 'Fremen-Karten kosten für dich in dieser Runde {resource:persuasion;amount:-1}',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'condition-influence',
        amount: 2,
        faction: 'fremen',
      },
      {
        type: 'troop',
      },
      {
        type: 'troop',
      },
    ],
    revealEffects: [],
  },
  {
    name: {
      en: 'Weaving the threads',
      de: 'Spinnen der Fäden',
    },
    faction: 'bene',
    persuasionCosts: 4,
    fieldAccess: ['bene', 'emperor'],
    imageUrl: '/assets/images/action-backgrounds/ship_fleet.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    agentEffects: [
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'card-discard',
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
        type: 'solari',
        amount: 2,
      },
    ],
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
    agentEffectSize: 'medium',
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
    agentEffects: [
      {
        type: 'condition-influence',
        amount: 2,
        faction: 'bene',
      },
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
    buyEffects: [],
    agentEffects: [
      {
        type: 'condition-enemies-on-field-type',
        action: 'landsraad',
      },
      {
        type: 'card-discard',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-connection',
        amount: 2,
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
    rarity: 'normal',
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
    rarity: 'normal',
    customAgentEffect: {
      en: 'Each opponent on {faction:landsraad} board spaces trashes one of his cards in his hand.',
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
    rarity: 'rare',
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
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_12.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'large',
    rarity: 'normal',
    customAgentEffect: {
      en: '{faction:bene} Einfluss <br>0 {resource:card-discard}{resource:card-draw} {resource:helper-or} 2 {resource:card-draw} {resource:helper-or} 4 {resource:agent-lift}',
      de: '{faction:bene} Einfluss <br>0 {resource:card-discard}{resource:card-draw} {resource:helper-or} 2 {resource:card-draw} {resource:helper-or} 4 {resource:agent-lift}',
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
      en: 'Bene Gesserit Archivist',
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
    rarity: 'normal',
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
        type: 'persuasion',
        amount: 1,
      },
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
      en: 'Jessica, Lady',
      de: 'Jessica, Lady',
    },
    faction: 'bene',
    persuasionCosts: 7,
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/jessica_5.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    rarity: 'rare',
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
      en: 'Mohiam, Reverend Mother',
      de: 'Mohiam, Ehrwürdige Mutter',
    },
    faction: 'bene',
    persuasionCosts: 8,
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad'],
    imageUrl: '/assets/images/leaders/mohiam.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'large',
    rarity: 'rare',
    customAgentEffect: {
      en: 'You may look at the top card of your deck aswell as the intrigue deck.',
      de: 'Du kannst dir die oberste Karte deines Decks sowie des Intrigenstapels  ansehen.',
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
        type: 'spice',
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
      en: 'Bene Gesserit Chapter',
      de: 'Bene Gesserit Kapitel',
    },
    faction: 'bene',
    persuasionCosts: 9,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_16.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    rarity: 'rare',
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
    rarity: 'normal',
    factionSecondary: 'guild',
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
    rarity: 'normal',
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
        amount: 2,
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
      en: 'Imperial Hearing',
      de: 'Imperiale Anhörung',
    },
    faction: 'emperor',
    persuasionCosts: 2,
    fieldAccess: ['emperor'],
    imageUrl: '/assets/images/action-backgrounds/emperor_3.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    rarity: 'normal',
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
        type: 'condition-connection',
        faction: 'emperor',
      },
      {
        type: 'intrigue',
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
        type: 'condition-high-council-seat',
      },
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
  },
  {
    name: {
      en: 'Sardaukar Scout',
      de: 'Sardaukar Aufklärer',
    },
    faction: 'emperor',
    persuasionCosts: 2,
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_11.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
        type: 'card-discard',
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
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Favorite of the Emperor',
      de: 'Favorit des Imperators',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    fieldAccess: [],
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: 'If you have <b>3</b> {resource:intrigue} and <b>4</b> {faction:emperor}-influence: {resource:trash-self} {resource:victory-point}',
      de: 'Wenn du <b>3</b> {resource:intrigue} und <b>4</b> {faction:emperor}-Einfluss hast: {resource:trash-self} {resource:victory-point}',
      fontSize: 'small',
    },
    rarity: 'normal',
    cardAmount: 1,
    imageUrl: '/assets/images/action-backgrounds/emperor_3.png',
    persuasionCosts: 2,
    faction: 'emperor',
    backgroundColor: 'orange',
  },
  {
    name: {
      en: 'Imperial Diplomat',
      de: 'Imperialer Diplomat',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['bene', 'guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/imperial_diplomat.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'small',
    rarity: 'normal',
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
      en: 'Imperial Spies',
      de: 'Imperiale Spione',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['fremen', 'guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/fremen_6.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'small',
    rarity: 'normal',
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
    persuasionCosts: 3,
    fieldAccess: ['emperor'],
    imageUrl: '/assets/images/action-backgrounds/emperor_2.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'small',
    rarity: 'normal',
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
    ],
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
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    rarity: 'normal',
    customAgentEffect: {
      en: 'Put {resource:troop} on up to <b>1</b> board space of your choice. It is blocked for this round.',
      de: 'Lege {resource:troop} auf bis zu <b>1</b> Feld deiner Wahl. Es ist für diese Runde blockiert.',
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
        type: 'location-control-choice',
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
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    rarity: 'normal',
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
        type: 'solari',
      },
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
        type: 'sword',
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
        type: 'intrigue',
      },
    ],
  },
  {
    name: {
      en: 'Turncoats',
      de: 'Überläufer',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/soldiers.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    rarity: 'normal',
    customAgentEffect: {
      en: 'Receive a random {resource:intrigue} from each opponent on {faction:town} fields.',
      de: 'Erhalte eine zufällige {resource:intrigue} von jedem Gegner auf {faction:town}-Feldern.',
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
        type: 'solari',
      },
    ],
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
        type: 'recruitment-emperor',
      },
    ],
  },
  {
    name: {
      en: 'Sardaukar Battle Rites',
      de: 'Sardaukar Kampfriten',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_battle_rites.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    rarity: 'normal',
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
        type: 'faction-influence-down-choice',
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
  },
  {
    name: {
      en: 'Sardaukar Infiltrators',
      de: 'Sardaukar Infiltratoren',
    },
    faction: 'emperor',
    persuasionCosts: 4,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_4.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'small',
    rarity: 'normal',
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
        type: 'condition-enemies-on-field-type',
        action: 'choam',
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
        type: 'helper-separator',
      },
      {
        type: 'condition-influence',
        amount: 2,
        faction: 'emperor',
      },
      {
        type: 'trash-self',
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
  },
  {
    name: {
      en: 'Sardaukar Lasgun Team',
      de: 'Sardaukar Lasgun-Team',
    },
    faction: 'emperor',
    persuasionCosts: 4,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_6.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'small',
    rarity: 'normal',
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
        type: 'condition-enemies-on-field-type',
        amount: 2,
        action: 'town',
      },
      {
        type: 'card-discard',
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
      en: 'Imperial Assassin',
      de: 'Imperialer Assassine',
    },
    faction: 'emperor',
    persuasionCosts: 4,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/assassin.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    rarity: 'normal',
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
        type: 'trash-self',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'enemies-leader-assassinate',
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
        type: 'sword',
      },
      {
        type: 'sword',
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
    imageUrl: '/assets/images/action-backgrounds/iakin_nefud.png',
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
    agentEffectSize: 'small',
    rarity: 'normal',
    customAgentEffect: {
      en: 'Each opponent on {faction:town} board spaces trashes one of his cards in play.',
      de: 'Jeder Gegner auf {faction:town}-Feldern entsorgt eine seiner Karten im Spiel.',
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
      en: 'Arrival of the Emperor',
      de: 'Ankunft des Imperators',
    },
    faction: 'emperor',
    persuasionCosts: 5,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/lighter_2.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'small',
    rarity: 'normal',
    customAgentEffect: {
      en: 'Take over control of this location.',
      de: 'Übernimm die Kontrolle über diesen Ort.',
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
        type: 'trash-self',
      },
    ],
    revealEffects: [
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'persuasion',
        amount: 3,
      },
    ],
  },
  {
    name: {
      en: 'Sardaukar Bodyguard',
      de: 'Sardaukar Leibwache',
    },
    faction: 'emperor',
    persuasionCosts: 5,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_8.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'small',
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
    agentEffects: [
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'signet-ring',
      },
      {
        type: 'card-draw',
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
        type: 'helper-or',
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
        type: 'location-control-choice',
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
      de: 'Imperiales Hofmitglied',
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
      en: 'Betrayal',
      de: 'Verrat',
    },
    faction: 'emperor',
    persuasionCosts: 7,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/battle_3.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'small',
    rarity: 'normal',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: 'Each opponent loses <b>3</b> troops in the conflict.',
      de: 'Jeder Gegner verliert <b>3</b> Truppen im Konflikt.',
      fontSize: 'small',
    },
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    agentEffects: [
      {
        type: 'condition-enemies-on-field-type',
        action: 'town',
      },
      {
        type: 'card-discard',
      },
      {
        type: 'card-discard',
      },
    ],
    revealEffects: [
      {
        type: 'trash-self',
      },
    ],
    factionSecondary: 'guild',
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
      en: 'Intervention of the Emperor',
      de: 'Eingriff des Imperators',
    },
    faction: 'emperor',
    persuasionCosts: 9,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/ship_2.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    rarity: 'rare',
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
        type: 'location-control-choice',
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
      en: 'CHOAM Directorship',
      de: 'MAFEA Vorsitz',
    },
    buyEffects: [
      {
        type: 'victory-point',
      },
    ],
    agentEffects: [
      {
        type: 'condition-high-council-seat',
      },
      {
        type: 'faction-influence-up-choice',
      },
    ],
    revealEffects: [
      {
        type: 'solari',
        amount: 3,
      },
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad'],
    agentEffectSize: 'small',
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
    rarity: 'rare',
    cardAmount: 1,
    persuasionCosts: 9,
    faction: 'emperor',
    imageUrl: '/assets/images/action-backgrounds/highliner_3.png',
  },
  {
    name: {
      en: 'Desert Guide',
      de: 'Wüstenführer',
    },
    faction: 'fremen',
    persuasionCosts: 1,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors_5.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    rarity: 'normal',
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
      en: "Muad'Dib",
      de: "Muad'Dib",
    },
    faction: 'fremen',
    persuasionCosts: 1,
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/muaddib_2.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    rarity: 'normal',
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
        type: 'focus',
      },
    ],
    agentEffects: [
      {
        type: 'condition-influence',
        amount: 2,
        faction: 'fremen',
      },
      {
        type: 'focus',
      },
    ],
    revealEffects: [
      {
        type: 'condition-connection',
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
      en: 'Drawing the Knives',
      de: 'Ziehen der Messer',
    },
    faction: 'fremen',
    persuasionCosts: 1,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/crys_knife.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    rarity: 'normal',
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
        type: 'faction-influence-down-choice',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'enemies-leader-assassinate',
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
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/shadout.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    rarity: 'rare',
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
        type: 'trash-self',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'enemies-intrigue-trash',
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
      en: 'Sandwalking',
      de: 'Sandlaufen',
    },
    faction: 'fremen',
    persuasionCosts: 2,
    fieldAccess: ['fremen', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/sandwalking.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'small',
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
    agentEffects: [
      {
        type: 'condition-connection',
        faction: 'fremen',
      },
      {
        type: 'card-return-to-hand',
        amount: 1,
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
      en: 'Desert power',
      de: 'Wüstenmacht',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    fieldAccess: [],
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: 'If you have <b>8</b> troops in combat and <b>4</b> {faction:fremen}-influence: {resource:trash-self} {resource:victory-point}',
      de: 'Wenn du <b>8</b> Truppen in der Schlacht und <b>4</b> {faction:fremen}-Einfluss hast: {resource:trash-self} {resource:victory-point}',
      fontSize: 'small',
    },
    rarity: 'normal',
    cardAmount: 1,
    imageUrl: '/assets/images/action-backgrounds/worm_assault.png',
    faction: 'fremen',
    persuasionCosts: 2,
    backgroundColor: 'orange',
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
        type: 'condition-enemies-on-field-type',
        action: 'choam',
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
        amount: 1,
      },
    ],
    rarity: 'normal',
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
    canInfiltrate: false,
    agentEffectSize: 'large',
    rarity: 'rare',
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
      en: 'Signs of Shai-Hulud',
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
      en: 'Fremen Believers',
      de: 'Fremen Gläubige',
    },
    faction: 'fremen',
    persuasionCosts: 3,
    fieldAccess: ['fremen', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/fremen_believers_2.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    rarity: 'normal',
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
        type: 'condition-connection',
        faction: 'bene',
      },
      {
        type: 'faction-influence-up-fremen',
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
        faction: 'fremen',
      },
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
    factionSecondary: 'bene',
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
    rarity: 'rare',
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
    rarity: 'normal',
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
        type: 'condition-influence',
        amount: 2,
        faction: 'fremen',
      },
      {
        type: 'troop-insert-or-retreat',
        amount: 1,
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
    agentEffects: [],
    customRevealEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    rarity: 'normal',
    factionSecondary: 'bene',
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
    canInfiltrate: false,
    agentEffectSize: 'large',
    rarity: 'normal',
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
    imageUrl: '/assets/images/action-backgrounds/fremen_8.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'small',
    rarity: 'normal',
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
        type: 'condition-enemies-on-field-type',
        action: 'spice',
      },
      {
        type: 'loose-troop',
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
      en: 'Religious zeal',
      de: 'Religiöser Eifer',
    },
    faction: 'fremen',
    persuasionCosts: 4,
    fieldAccess: ['landsraad'],
    imageUrl: '/assets/images/action-backgrounds/jihad_2.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    rarity: 'normal',
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
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
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
  },
  {
    name: {
      en: 'Desert Travel',
      de: 'Wüsten-Fortbewegung',
    },
    faction: 'fremen',
    persuasionCosts: 5,
    fieldAccess: ['town', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/sandworm.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    rarity: 'normal',
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
        type: 'troop-insert-or-retreat',
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
        type: 'location-control-choice',
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
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'water',
      },
      {
        type: 'helper-or',
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
    rarity: 'rare',
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
    rarity: 'rare',
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
    rarity: 'rare',
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
    factionSecondary: 'bene',
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
      en: 'Worm Assault',
      de: 'Wurmangriff',
    },
    faction: 'fremen',
    persuasionCosts: 7,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/worm_assault.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'large',
    rarity: 'normal',
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
        type: 'trash-self',
      },
      {
        type: 'location-control-choice',
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
    rarity: 'rare',
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
    agentEffectSize: 'small',
    rarity: 'normal',
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
        type: 'spice',
        amount: 2,
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-enemies-on-field-type',
        action: 'spice',
      },
      {
        type: 'spice',
        amount: -2,
      },
    ],
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
    agentEffectSize: 'small',
    rarity: 'normal',
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
        type: 'multiplier-connections',
        faction: 'fremen',
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
    buyEffects: [
      {
        type: 'tech',
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
    agentEffectSize: 'small',
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
    agentEffects: [
      {
        type: 'solari',
      },
      {
        type: 'helper-separator',
      },
      {
        type: 'condition-high-council-seat',
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
    imageUrl: '/assets/images/action-backgrounds/guild_adjutant.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'large',
    rarity: 'normal',
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
      en: 'Smuggler Leader',
      de: 'Schmuggler-Anführer',
    },
    faction: 'guild',
    persuasionCosts: 2,
    fieldAccess: ['guild', 'landsraad', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/gurney_4.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
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
    buyEffects: [
      {
        type: 'troop',
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
        type: 'recruitment-guild',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Ixian Smuggler',
      de: 'Ixianischer Schmuggler',
    },
    faction: 'guild',
    persuasionCosts: 2,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/ixian_smuggler.png',
    cardAmount: 2,
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
    agentEffects: [
      {
        type: 'tech',
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
        type: 'tech',
        amount: 2,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'dreadnought',
      },
    ],
  },
  {
    name: {
      en: 'Trade blockade',
      de: 'Handelsblockade',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    fieldAccess: [],
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: 'If you have <b>2</b> {resource:dreadnought} in your garrison and <b>4</b> {faction:guild}-influence: {resource:trash-self} {resource:victory-point}',
      de: 'Wenn du <b>2</b> {resource:dreadnought} in deiner Garnison und <b>4</b> {faction:guild}-Einfluss hast: {resource:trash-self} {resource:victory-point}',
      fontSize: 'small',
    },
    rarity: 'normal',
    cardAmount: 1,
    imageUrl: '/assets/images/action-backgrounds/spaceship_fleet.png',
    faction: 'guild',
    persuasionCosts: 2,
    backgroundColor: 'orange',
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
    rarity: 'rare',
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
        amount: 2,
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
    imageUrl: '/assets/images/action-backgrounds/guild_officer.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'small',
    rarity: 'normal',
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
    buyEffects: [
      {
        type: 'tech',
      },
    ],
    agentEffects: [
      {
        type: 'water',
      },
      {
        type: 'helper-or',
      },
      {
        type: 'tech',
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
        type: 'helper-or',
      },
      {
        type: 'trash-self',
      },
      {
        type: 'solari',
        amount: 4,
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
    rarity: 'normal',
    factionSecondary: 'emperor',
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
      en: 'Guild Ship Engineer',
      de: 'Gilden Schiffsingenieur',
    },
    faction: 'guild',
    persuasionCosts: 4,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/guild_engineer.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    rarity: 'normal',
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
        type: 'tech',
        amount: 2,
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
        type: 'multiplier-dreadnought-amount',
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
    rarity: 'rare',
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
    imageUrl: '/assets/images/action-backgrounds/guild_captain.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    rarity: 'normal',
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
      {
        type: 'sword',
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
      {
        type: 'recruitment-guild',
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
    rarity: 'normal',
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
    rarity: 'rare',
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
        type: 'tech',
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
    imageUrl: '/assets/images/action-backgrounds/guild_admiral.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    rarity: 'normal',
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
];
