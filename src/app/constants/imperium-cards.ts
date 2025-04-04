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
      en: 'Dr. Yueh, Suk Doctor',
      de: 'Dr. Yueh, Suk-Arzt',
    },
    persuasionCosts: 4,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/yueh_2.png',
    cardAmount: 1,
    buyEffects: [],
    customAgentEffect: {
      en: 'You may put <b>1</b> of your cards in play back to your hand.',
      de: 'Du kannst <b>1</b> Karte im Spiel zurück auf deine Hand nehmen.',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: 'You may retreat up to <b>2</b> inserted troops after the combat phase.',
      de: 'Du kannst nach der Kampf-Phase bis zu <b>2</b> eingesetzte Truppen zurückziehen.',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Gurney Halleck, Smuggler',
      de: 'Gurney Halleck, Schmuggler',
    },
    persuasionCosts: 4,
    fieldAccess: ['guild', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/gurney.png',
    cardAmount: 1,
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
        type: 'shipping',
      },
      {
        type: 'solari',
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
      en: 'Twisted Mentat',
      de: 'Verderbter Mentat',
    },
    persuasionCosts: 7,
    fieldAccess: ['landsraad'],
    imageUrl: '/assets/images/action-backgrounds/twisted_mentat.png',
    cardAmount: 2,
    buyEffects: [
      {
        type: 'agent',
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
      en: 'Swordmaster',
      de: 'Schwertmeister',
    },
    persuasionCosts: 6,
    fieldAccess: ['landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/mentat.png',
    cardAmount: 2,
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
      en: 'Duncan, Swordmaster',
      de: 'Duncan Idaho, Schwertmeister',
    },
    persuasionCosts: 7,
    fieldAccess: ['landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/duncan.png',
    cardAmount: 1,
    buyEffects: [],
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
        type: 'sword',
      },
    ],
    customAgentEffect: {
      en: 'Troops in your garrison<br>0 {resource:card-draw} {resource:helper-or} 2 {resource:card-draw}{resource:troop} {resource:helper-or} 4 {resource:troop}{resource:troop}',
      de: 'Truppen in deiner Garnison <br>0 {resource:card-draw} {resource:helper-or} 2 {resource:card-draw}{resource:troop} {resource:helper-or} 4 {resource:troop}{resource:troop}',
      fontSize: 'small',
    },
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
        type: 'combat',
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
      en: 'Piter De Vries, Twisted Mentat',
      de: 'Piter De Vries, Verderbter Mentat',
    },
    persuasionCosts: 8,
    fieldAccess: ['emperor', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/piter.png',
    cardAmount: 1,
    buyEffects: [
      {
        type: 'agent',
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
    buyEffects: [
      {
        type: 'agent',
      },
    ],
    agentEffects: [
      {
        type: 'card-draw',
      },
    ],
    customRevealEffect: {
      en: 'Each opponent: {resource:intrigue-trash}',
      de: 'Jeder Gegner: {resource:intrigue-trash}',
      fontSize: 'medium',
    },
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
    buyEffects: [
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
    revealEffectSize: 'large',
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
        type: 'helper-separator',
      },
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
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_8.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    revealEffectSize: 'large',
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
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'Each opponent on {faction:landsraad} board spaces loses {resource:solari} and you gain {resource:solari}.',
      de: 'Jeder Gegner auf {faction:landsraad}-Feldern verliert {resource:solari} und du erhältst {resource:solari}.',
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
      en: 'Promise of Stability',
      de: 'Stabilitätsversprechen',
    },
    faction: 'bene',
    persuasionCosts: 3,
    fieldAccess: ['bene', 'guild'],
    imageUrl: '/assets/images/action-backgrounds/conspiracy_2.png',
    cardAmount: 2,
    buyEffects: [
      {
        type: 'intrigue',
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
      en: 'Bene Gesserit Sister',
      de: 'Bene Gesserit Schwester',
    },
    faction: 'bene',
    persuasionCosts: 4,
    fieldAccess: ['bene', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_14.png',
    cardAmount: 2,
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
      en: 'For each card with a {resource:sword}-symbol you have in play: {resource:sword}',
      de: 'Für jede Karte mit {resource:sword}-Symbol, die du im Spiel hast: {resource:sword}',
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
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
    customAgentEffect: {
      en: 'Each opponent: {resource:card-discard}<br>{faction:bene} -Connection: {resource:spice;amount:2}',
      de: 'Jeder Gegner: {resource:card-discard}<br>{faction:bene} -Verbindung: {resource:spice;amount:2}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Seduction',
      de: 'Verführung',
    },
    faction: 'bene',
    persuasionCosts: 4,
    fieldAccess: ['emperor', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_7.png',
    cardAmount: 2,
    canInfiltrate: true,
    buyEffects: [
      {
        type: 'intrigue',
      },
    ],
    customAgentEffect: {
      en: 'Each opponent trashes one of his cards in his hand.',
      de: 'Jeder Gegner auf Feldern dieses Typs entsorgt eine Karte aus seiner Hand.',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: 'For each bene gesserit card you have in play: {resource:persuasion;amount:1}',
      de: 'Für jede Bene-Gesserit-Karte, die du im Spiel hast: {resource:persuasion;amount:1}',
      fontSize: 'small',
    },
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
    revealEffectSize: 'medium',
    buyEffects: [],
    customAgentEffect: {
      en: '{faction:bene} Einfluss <br>0 {resource:card-draw} {resource:helper-or} 2 {resource:agent-lift} {resource:helper-or} 4 {resource:card-draw}{resource:agent-lift}',
      de: '{faction:bene} Einfluss <br>0 {resource:card-draw} {resource:helper-or} 2 {resource:agent-lift} {resource:helper-or} 4 {resource:card-draw}{resource:agent-lift}',
      fontSize: 'medium',
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
        faction: 'bene',
      },
      {
        type: 'intrigue-trash',
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
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    buyEffects: [],
    customAgentEffect: {
      en: 'For each bene-gesserit card in play: {resource:card-draw}',
      de: 'Für jeden deiner Agenten auf Feldern: {resource:card-draw}',
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
        faction: 'bene',
      },
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
      en: 'Reverend Mother',
      de: 'Ehrwürdige Mutter',
    },
    faction: 'bene',
    persuasionCosts: 6,
    fieldAccess: ['bene', 'emperor', 'fremen', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_13.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: '{faction:bene} Influence <br>0 {resource:card-draw-or-destroy} {resource:helper-or} 2 {resource:card-draw}{resource:card-draw-or-destroy} {resource:helper-or} 4 {resource:faction-influence-up-choice}',
      de: 'Jeder Gegner auf Feldern dieses Typs {resource:card-discard} und du erhältst {resource:card-draw} für jede abgeworfene Karte.',
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
        type: 'recruitment-bene',
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
      en: 'Retreat up to <b>4</b> units.',
      de: 'Ziehe bis zu <b>4</b> eingesetzte Einheiten zurück.',
      fontSize: 'medium',
    },
    buyEffects: [
      {
        type: 'solari',
        amount: 4,
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'faction-influence-up-choice',
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
      en: 'Mohiam, Reverend Mother',
      de: 'Mohiam, Ehrwürdige Mutter',
    },
    faction: 'bene',
    persuasionCosts: 8,
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad'],
    imageUrl: '/assets/images/leaders/mohiam.png',
    cardAmount: 1,
    buyEffects: [
      {
        type: 'faction-influence-up-bene',
      },
      {
        type: 'faction-influence-up-bene',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'intrigue',
      },
    ],
    customAgentEffect: {
      en: 'You may look at the top card of the intrigue deck as well as the conflict deck.',
      de: 'Du kannst dir die oberste Karte des Intrigen-Stapels sowie des Konflikt-Stapels ansehen.',
      fontSize: 'small',
    },
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
    cardAmount: 2,
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
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
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
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: '',
      de: '',
      fontSize: 'medium',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: 'If you have a dreadnought in conflict: {resource:sword}{resource:sword}',
      de: 'Wenn du ein Schlachtschiff im Konflikt hast: {resource:sword}{resource:sword}',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [
      {
        type: 'condition-connection',
        faction: 'emperor',
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
        type: 'tech',
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
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'Each opponent on {faction:spice} board spaces: {resource:loose-troop}',
      de: 'Jeder Gegner auf {faction:spice}-Feldern: {resource:loose-troop}',
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
    buyEffects: [],
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
    customAgentEffect: {
      en: 'Each opponent retreats a {resource:dreadnought} or loses <b>1</b> troop.',
      de: 'Jeder Gegner auf {faction:town}-Feldern zieht ein {resource:dreadnought} zurück oder verliert <b>1</b> Trupp.',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Imperial Caid',
      de: 'Imperialer Caid',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['emperor', 'guild', 'town'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_5.png',
    cardAmount: 2,
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
        type: 'recruitment-emperor',
      },
      {
        type: 'sword',
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
    buyEffects: [],
    revealEffects: [
      {
        type: 'solari',
        amount: 4,
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'location-control',
      },
    ],
    customAgentEffect: {
      en: 'If this location is controlled by an opponent, they lose {resource:loose-troop} and you gain {resource:spice}.',
      de: 'Wird dieser Ort von einem Gegner kontrolliert, verliert dieser {resource:loose-troop} und du erhältst {resource:spice}.',
      fontSize: 'small',
    },
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
      en: 'For each emperor card you have in play: {resource:sword}',
      de: 'Für jede Imperator-Karte, die du im Spiel hast: {resource:sword}',
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
    revealEffectSize: 'large',
    buyEffects: [],
    customRevealEffect: {
      en: 'For each of your troops in conflict: {resource:sword}',
      de: 'Für jede deiner Truppen im Konflikt: {resource:sword}',
      fontSize: 'medium',
    },
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
  },
  {
    name: {
      en: 'Iakin Nefud, Corporal',
      de: 'Iakin Nefud, Korporal',
    },
    faction: 'emperor',
    persuasionCosts: 5,
    fieldAccess: ['emperor', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/twisted_mentat_2.png',
    cardAmount: 1,
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
      en: 'Enfeoffment by the Emperor',
      de: 'Belehnung durch den Imperator',
    },
    faction: 'emperor',
    persuasionCosts: 5,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/arrakeen_3.png',
    cardAmount: 1,
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
      en: 'Imperial Assassin',
      de: 'Imperialer Assassine',
    },
    faction: 'emperor',
    persuasionCosts: 5,
    fieldAccess: ['guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/assassin.png',
    cardAmount: 2,
    canInfiltrate: false,
    buyEffects: [],
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
    customAgentEffect: {
      en: 'Each opponent trashes one of his cards in play.',
      de: 'Jeder Gegner entsorgt eine seiner Karten im Spiel.',
      fontSize: 'small',
    },
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
    buyEffects: [
      {
        type: 'troop',
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
    customAgentEffect: {
      en: '{resource:loose-troop}{resource:helper-trade}{resource:helper-trade}{resource:sword} for each of your troops in conflict',
      de: '{resource:loose-troop}{resource:helper-trade}{resource:sword} für jede deiner Truppen im Konflikt',
      fontSize: 'medium',
    },
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
      en: 'Provoked Hostilities',
      de: 'Provozierte Feindschaften',
    },
    faction: 'emperor',
    persuasionCosts: 6,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/battle_2.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'Each opponent send <b>2</b> units into the conflict',
      de: 'Jeder Gegner auf {faction:town}-Feldern entsendet <b>2</b> Einheiten in den Konflikt.',
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
        amount: 1,
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
      en: '{resource:solari;amount:2} {resource:helper-trade} Draw {resource:intrigue} from each opponent on {faction:town} board spaces .',
      de: '{resource:solari;amount:2} {resource:helper-trade} Ziehe von jedem Gegner auf {faction:town}-Feldern eine {resource:intrigue}.',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: 'Each opponent loses <b>4</b> troops in the conflict.',
      de: 'Jeder Gegner verliert <b>4</b> Truppen im Konflikt.',
      fontSize: 'small',
    },
    buyEffects: [],
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
      en: 'Draw intrigue cards, until you draw a combat-intrigue. Keep it, trash the rest.',
      de: 'Ziehe Intrigen, bis du eine Kampf-Intrige ziehst. Behalte sie, entsorge die anderen.',
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
      {
        type: 'troop',
      },
    ],
    agentEffects: [],
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
    persuasionCosts: 8,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/ship.png',
    cardAmount: 1,
    canInfiltrate: false,
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
      en: 'Fief: Caladan',
      de: 'Lehen: Caladan',
    },
    faction: 'emperor',
    persuasionCosts: 9,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/caladan.png',
    cardAmount: 1,
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
      en: 'Desert Guide',
      de: 'Wüsten-Führer',
    },
    faction: 'fremen',
    persuasionCosts: 1,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors_2.png',
    cardAmount: 2,
    canInfiltrate: false,
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
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
    revealEffectSize: 'large',
    buyEffects: [
      {
        type: 'solari',
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
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'Each opponent loses {resource:spice}{resource:helper-or}{resource:water}{resource:helper-or}{resource:solari}',
      de: 'Jeder Gegner auf {faction:town}-Feldern verliert {resource:spice}{resource:helper-or}{resource:solari} und du erhältst {resource:tech}.',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: 'Deploy up to <b>1</b> additional troop to the conflict.',
      de: 'Setze bis zu <b>1</b> Trupp aus deiner Garnison im Konflikt ein.',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'sword',
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
    buyEffects: [
      {
        type: 'water',
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
  },
  {
    name: {
      en: 'Desert Ambush',
      de: 'Wüsten Hinterhalt',
    },
    faction: 'fremen',
    persuasionCosts: 3,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/ambush.png',
    cardAmount: 1,
    canInfiltrate: true,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'Each opponent: {resource:loose-troop}<br>{faction:fremen} -Connection: {resource:water}',
      de: 'Jeder Gegner auf {faction:spice}-Feldern: {resource:loose-troop}<br>{faction:fremen} -Verbindung: {resource:water}',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: 'Deploy up to <b>2</b> troops from your garrison to the conflict.',
      de: 'Setze bis zu <b>2</b> Truppen aus deiner Garnison im Konflikt ein.',
      fontSize: 'small',
    },
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
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
    revealEffectSize: 'large',
    buyEffects: [],
    customRevealEffect: {
      en: 'Deploy up to <b>3</b> troops from your garrison to the conflict.',
      de: 'Setze bis zu <b>3</b> Truppen aus deiner Garnison im Konflikt ein.',
      fontSize: 'small',
    },
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
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/harkonnen_soldier.png',
    cardAmount: 2,
    canInfiltrate: true,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'Each opponent retreats two units.',
      de: 'Jeder Gegner auf Feldern dieses Typs zieht <b>2</b> Einheiten zurück.',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: 'For each fremen card you have in play: {resource:sword}',
      de: 'Für jede Fremen-Karte, die du im Spiel hast: {resource:sword}',
      fontSize: 'small',
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
    revealEffectSize: 'medium',
    buyEffects: [],
    agentEffects: [
      {
        type: 'water',
      },
      {
        type: 'water',
      },
      {
        type: 'card-discard',
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
    buyEffects: [],
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
    customAgentEffect: {
      en: '{resource:focus}<br>{faction:fremen} -Connection: Each opponent: {resource:loose-troop}',
      de: '{resource:focus}<br>{faction:fremen} -Verbindung: Jeder Gegner: {resource:loose-troop}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Duncan Idaho, Fremen Ambassador',
      de: 'Duncan Idaho, Fremenkundschafter',
    },
    faction: 'fremen',
    persuasionCosts: 5,
    fieldAccess: ['fremen', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/duncan_2.png',
    cardAmount: 1,
    canInfiltrate: true,
    buyEffects: [
      {
        type: 'water',
      },
    ],
    customAgentEffect: {
      en: 'Ignore all influence requirements on board spaces this round.',
      de: 'Ignoriere alle Einfluss-Anforderungen auf Feldern in dieser Runde.',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '{faction:fremen} Influence <br>0 {resource:faction-influence-up-fremen} {resource:helper-or} 2 {resource:troop} {resource:helper-or} 4 {resource:troop}{resource:troop}',
      de: '{faction:fremen} Einfluss <br>0 {resource:faction-influence-up-fremen} {resource:helper-or} 2 {resource:troop}{resource:troop} {resource:helper-or} 4 {resource:troop;amount:3}',
      fontSize: 'medium',
    },
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
    revealEffectSize: 'medium',
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
    revealEffectSize: 'medium',
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
    persuasionCosts: 5,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/jihad_2.png',
    cardAmount: 1,
    buyEffects: [
      {
        type: 'faction-influence-up-bene',
      },
    ],
    agentEffects: [],
    customRevealEffect: {
      en: '{resource:sword} for each of your troops in conflict',
      de: '{resource:sword} für jede deiner Truppen im Konflikt',
      fontSize: 'medium',
    },
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
      en: 'For each fremen card you have in play: {resource:persuasion;amount:2}',
      de: 'Für jede Fremen-Karte, die du im Spiel hast: {resource:persuasion;amount:2}',
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
        type: 'recruitment-fremen',
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
      en: 'Jessica, Reverend Mother',
      de: 'Jessica, Ehrwürdige Mutter',
    },
    faction: 'fremen',
    persuasionCosts: 7,
    fieldAccess: ['fremen', 'town'],
    imageUrl: '/assets/images/action-backgrounds/jessica.png',
    cardAmount: 1,
    buyEffects: [],
    customAgentEffect: {
      en: 'For each fremen card you have in play: {resource:card-draw-or-destroy}',
      de: 'Für jede Fremen-Karte, die du im Spiel hast: {resource:card-draw-or-destroy}',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: 'For each fremen card you have in play: {resource:persuasion;amount:1}{resource:sword}',
      de: 'Für jede Fremen-Karte, die du im Spiel hast: {resource:persuasion;amount:1}{resource:sword}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Water of Life',
      de: 'Wasser des Lebens',
    },
    faction: 'fremen',
    persuasionCosts: 7,
    fieldAccess: ['fremen'],
    imageUrl: '/assets/images/action-backgrounds/water_of_life.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    revealEffectSize: 'medium',
    buyEffects: [],
    customAgentEffect: {
      en: '{faction:bene} or {faction:fremen} Alliance: {resource:victory-point} {resource:trash-self}',
      de: '{faction:bene} oder {faction:fremen} Allianz: {resource:victory-point} {resource:trash-self}',
      fontSize: 'small',
    },
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
        type: 'troop',
      },
      {
        type: 'faction-influence-up-fremen',
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
    buyEffects: [],
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
    customAgentEffect: {
      en: '',
      de: 'Jeder Gegner auf {faction:spice}-Feldern verliert {resource:spice;amount:2} und du erhältst {resource:spice;amount:2}.',
      fontSize: 'small',
    },
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
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'For each fremen card you have in play: {resource:troop}',
      de: 'Für jede Fremen-Karte, die du im Spiel hast: {resource:troop}',
      fontSize: 'small',
    },
    revealEffectSize: 'medium',
    customRevealEffect: {
      en: 'For each fremen card you have in play: {resource:sword}',
      de: 'Für jede Fremen-Karte, die du im Spiel hast: {resource:sword}',
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
    agentEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'recruitment-fremen',
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
    imageUrl: '/assets/images/action-backgrounds/desert_2.png',
    cardAmount: 1,
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
    revealEffectSize: 'large',
    buyEffects: [
      {
        type: 'spice',
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
        amount: 2,
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
  },
  {
    name: {
      en: 'Guild Administrator',
      de: 'Gilden Verwalter',
    },
    faction: 'guild',
    persuasionCosts: 1,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/guild_banker_8.png',
    cardAmount: 2,
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
    customAgentEffect: {
      en: '{faction:guild} Influence <br>0 {resource:solari} {resource:helper-or} 2 {resource:solari;amount:2} {resource:helper-or} 4 {resource:solari;amount:3}',
      de: '{faction:guild} Einfluss <br>0 {resource:solari} {resource:helper-or} 2 {resource:solari;amount:2} {resource:helper-or} 4 {resource:solari;amount:3}',
      fontSize: 'medium',
    },
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
      en: 'Transport Agreement',
      de: 'Transport Abkommen',
    },
    faction: 'guild',
    persuasionCosts: 2,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/spaceship_fleet.png',
    cardAmount: 2,
    buyEffects: [
      {
        type: 'shipping',
      },
    ],
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
        type: 'shipping',
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
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/sandcrawler.png',
    cardAmount: 2,
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
      en: 'Staban Tuek, Smuggler',
      de: 'Staban Tuek, Schmuggler',
    },
    faction: 'guild',
    persuasionCosts: 3,
    fieldAccess: ['guild', 'landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/staban.png',
    cardAmount: 1,
    buyEffects: [],
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
    ],
  },
  {
    name: {
      en: 'Guild Envoy',
      de: 'Gilden Vertreter',
    },
    faction: 'guild',
    persuasionCosts: 3,
    fieldAccess: ['guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/guild_banker_3.png',
    cardAmount: 2,
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    customAgentEffect: {
      en: '{faction:guild} Influence <br>0 {resource:foldspace} {resource:helper-or} 2 {resource:shipping} {resource:helper-or} 4 {resource:foldspace} {resource:shipping}',
      de: '{faction:guild} Einfluss <br>0 {resource:foldspace} {resource:helper-or} 2 {resource:shipping} {resource:helper-or} 4 {resource:foldspace} {resource:shipping}',
      fontSize: 'medium',
    },
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
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/guild_banker.png',
    cardAmount: 2,
    canInfiltrate: false,
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'faction-influence-up-guild',
      },
    ],
    customAgentEffect: {
      en: '{faction:guild} Influence <br>0 {resource:solari;amount:2} {resource:helper-or} 2 {resource:solari;amount:3} {resource:helper-or} 4 {resource:solari;amount:4}',
      de: '{faction:guild} Einfluss <br>0 {resource:solari;amount:2} {resource:helper-or} 2 {resource:solari;amount:3} {resource:helper-or} 4 {resource:solari;amount:4}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Esmar Tuek, Smuggler',
      de: 'Esmar Tuek, Schmuggler',
    },
    faction: 'guild',
    persuasionCosts: 5,
    fieldAccess: ['guild', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/esmar.png',
    cardAmount: 1,
    canInfiltrate: false,
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
      en: 'Guild Navigator',
      de: 'Gilden Navigator',
    },
    faction: 'guild',
    persuasionCosts: 5,
    fieldAccess: ['emperor', 'guild', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/guild_navigators_3.png',
    cardAmount: 2,
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
      en: 'Edric, Guild Navigator',
      de: 'Edric, Gilden-Navigator',
    },
    faction: 'guild',
    persuasionCosts: 6,
    fieldAccess: ['guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/guild_navigators.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'large',
    customAgentEffect: {
      en: 'Draw intrigues until you draw a plot intrigue. Keep it, trash the rest.',
      de: 'Ziehe Intrigen, bis du eine Komplott-Intrige ziehst. Behalte sie, entsorge die anderen.',
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
    agentEffects: [],
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
      en: 'Embargo',
      de: 'Embargo',
    },
    faction: 'guild',
    persuasionCosts: 6,
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/highliner_2.png',
    cardAmount: 1,
    canInfiltrate: false,
    agentEffectSize: 'medium',
    customAgentEffect: {
      en: 'Board spaces of this type are blocked for all opponents this round.',
      de: 'Felder dieses Typs sind für alle Gegner in dieser Runde blockiert.',
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
      en: 'Secret Transports',
      de: 'Geheime Transporte',
    },
    faction: 'guild',
    persuasionCosts: 7,
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/highliner.png',
    cardAmount: 1,
    canInfiltrate: true,
    buyEffects: [],
    agentEffects: [
      {
        type: 'card-draw',
      },
      {
        type: 'agent-lift',
      },
    ],
    revealEffects: [
      {
        type: 'shipping',
      },
      {
        type: 'tech',
      },
    ],
  },
];
