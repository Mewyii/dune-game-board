import { ActionType, FactionType, LanguageString, Reward } from '../models';

export interface LanguageStringAndFontSize extends LanguageString {
  fontSize?: 'medium' | 'small';
}

export interface ImperiumCard {
  name: LanguageString;
  faction?: FactionType;
  persuasionCosts?: number;
  fieldAccess?: ActionType[];
  agentEffects?: Reward[];
  customAgentEffect?: LanguageStringAndFontSize;
  revealEffects?: Reward[];
  customRevealEffect?: LanguageStringAndFontSize;
  buyEffects?: Reward[];
  imageUrl?: string;
  cardAmount?: number;
}

export const imperiumCards: ImperiumCard[] = [
  {
    name: {
      en: 'spice consumption',
      de: 'Spice Konsum',
    },
    persuasionCosts: 1,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/spice_3.png',
    cardAmount: 2,
    buyEffects: [
      {
        type: 'card-destroy',
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'persuasion',
        amount: 3,
      },
      {
        type: 'card-destroy',
      },
    ],
  },
  {
    name: {
      en: 'Smuggling Gang',
      de: 'Schmugglerbande',
    },
    persuasionCosts: 1,
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/smugglers_8.png',
    cardAmount: 2,
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
        type: 'separator',
      },
      {
        type: 'tech-reduced',
      },
    ],
    customAgentEffect: {
      en: '{faction:guild} 2 Influence: {resource:solari}',
      de: '{faction:guild} 2 Einfluss: {resource:solari}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Spice Vision',
      de: 'Spice Visionen',
    },
    persuasionCosts: 1,
    fieldAccess: ['spice'],
    imageUrl: '/assets/images/action-backgrounds/vision.png',
    cardAmount: 2,
    buyEffects: [],
    customAgentEffect: {
      en: '',
      de: 'Du kannst dir die oberste Karte des Konflikt-Stapels ansehen.',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '',
      de: '{faction:bene} -Verbindung: {resource:persuasion;amount:2}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Supply Ambush',
      de: 'Versorgungsüberfall',
    },
    persuasionCosts: 2,
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors_4.png',
    cardAmount: 2,
    buyEffects: [],
    customAgentEffect: {
      en: 'If you have a fremen card in play: {resource:card-draw}',
      de: 'Jeder Gegner verliert {resource:spice}/{resource:water}/{resource:solari}',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '',
      de: '{resource:sword}{resource:sword}. Du darfst einen Trupp aus deiner Garnison im Konflikt einsetzen.',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Suk Doctor',
      de: 'Suk-Arzt',
    },
    persuasionCosts: 2,
    fieldAccess: ['landsraad'],
    imageUrl: '/assets/images/action-backgrounds/suk_doc.png',
    cardAmount: 2,
    buyEffects: [],
    agentEffects: [
      {
        type: 'card-draw',
      },
    ],
    customRevealEffect: {
      en: '',
      de: '{resource:persuasion;amount:1}<br>Du kannst nach der Kampf-Phase einen eingesetzten Trupp zurückziehen.',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Dr. Yue, Suk Doctor',
      de: 'Dr. Yueh, Suk-Arzt',
    },
    persuasionCosts: 2,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/yueh_2.png',
    cardAmount: 1,
    buyEffects: [],
    customAgentEffect: {
      en: '',
      de: 'Du kannst eine Karte im Spiel zurück auf deine Hand nehmen.',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '',
      de: 'Du kannst nach der Kampf-Phase bis zu zwei eingesetzte Truppen zurückziehen.',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Yueh, Traitor',
      de: 'Dr. Yueh, Verräter',
    },
    persuasionCosts: 3,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/yueh.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [],
    customRevealEffect: {
      en: 'Each opponent loses all garrisoned troops. Trash this card.',
      de: '{resource:location-control}<br>Entsorge diese Karte.',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Mercenary Dreadnought',
      de: 'Söldner Schlachtschiff',
    },
    persuasionCosts: 3,
    fieldAccess: ['guild', 'landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/dreadnought.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [
      {
        type: 'solari',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'shipping',
      },
    ],
    revealEffects: [
      {
        type: 'solari',
        amount: 2,
      },
      {
        type: 'helper-arrow-right',
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
      en: 'Promise of Stability',
      de: 'Stabilitätsversprechen',
    },
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
        type: 'card-discard',
      },
      {
        type: 'helper-arrow-right',
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
      en: 'Display of Force',
      de: 'Machtdemonstration',
    },
    persuasionCosts: 3,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/harkonnen_ceremony.png',
    cardAmount: 2,
    buyEffects: [],
    agentEffects: [
      {
        type: 'card-discard',
      },
      {
        type: 'card-discard',
      },
      {
        type: 'helper-arrow-right',
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
    ],
  },
  {
    name: {
      en: 'Gurney, Smuggler',
      de: 'Gurney Halleck, Schmuggler',
    },
    persuasionCosts: 4,
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/gurney.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-arrow-right',
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
      en: 'Iakin Nefud, Corporal',
      de: 'Iakin Nefud, Korporal',
    },
    persuasionCosts: 4,
    fieldAccess: ['emperor', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/twisted_mentat_2.png',
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    agentEffects: [
      {
        type: 'solari',
        amount: 2,
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'troop',
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
        type: 'troop',
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
    persuasionCosts: 4,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/twisted_mentat.png',
    cardAmount: 2,
    buyEffects: [],
    agentEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'agent-lift',
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
      en: 'Insurgents',
      de: 'Aufrührer',
    },
    persuasionCosts: 5,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/battle.png',
    cardAmount: 2,
    buyEffects: [],
    agentEffects: [
      {
        type: 'solari',
        amount: 5,
      },
      {
        type: 'helper-arrow-right',
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
    ],
  },
  {
    name: {
      en: 'Honorable Reception',
      de: 'Ehrenvoller Empfang',
    },
    persuasionCosts: 5,
    fieldAccess: ['bene', 'emperor', 'fremen', 'guild'],
    imageUrl: '/assets/images/action-backgrounds/meeting_4.png',
    cardAmount: 2,
    buyEffects: [
      {
        type: 'faction-influence-up-choice',
      },
    ],
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
      en: 'Duncan Idaho, Fremen Ambassador',
      de: 'Duncan Idaho, Fremen Kundschafter',
    },
    persuasionCosts: 5,
    fieldAccess: ['fremen', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/duncan_2.png',
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
    ],
    customAgentEffect: {
      en: '',
      de: '{faction:fremen} Einfluss <br>0 {resource:faction-influence-up-fremen} {resource:separator} 2 {resource:troop} {resource:separator} 4 {resource:troop}{resource:troop}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Piter De Vries, Mentat',
      de: 'Piter De Vries, Mentat',
    },
    persuasionCosts: 5,
    fieldAccess: ['emperor', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/piter.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'card-draw',
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
      en: 'Area Bombardment',
      de: 'Flächen Bombardierung',
    },
    persuasionCosts: 6,
    fieldAccess: ['emperor', 'guild', 'bene', 'fremen', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/assault.png',
    cardAmount: 1,
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'separator',
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
      en: 'Place {resource:troop} on this board space. It can not be used. Remove {resource:troop} after the next round.',
      de: 'Lege {resource:troop} auf dieses Feld. Es kann nicht verwendet werden. Entferne {resource:troop} nach der nächsten Runde.',
    },
  },
  {
    name: {
      en: 'Duncan, Swordmaster',
      de: 'Duncan Idaho, Schwertmeister',
    },
    persuasionCosts: 6,
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
        type: 'troop',
      },
      {
        type: 'sword',
      },
    ],
    customAgentEffect: {
      en: '',
      de: '{resource:card-draw} <br>Ignoriere gegnerische Agenten oder benötigten Einfluss.',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Claim to Power',
      de: 'Herrschaftsanspruch',
    },
    persuasionCosts: 6,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/lighter_2.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [],
    customRevealEffect: {
      en: '',
      de: '{resource:loose-troop}{resource:loose-troop}{resource:faction-influence-down-guild}{resource:faction-influence-down-emperor}{resource:helper-arrow-right}{resource:victory-point}{resource:victory-point}<br>Entsorge diese Karte.',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Mentat',
      de: 'Mentat',
    },
    persuasionCosts: 6,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/mentat.png',
    cardAmount: 2,
    buyEffects: [],
    agentEffects: [
      {
        type: 'agent-lift',
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
      en: 'Gurney, Warmaster',
      de: 'Gurney Halleck, Kriegsmeister',
    },
    persuasionCosts: 7,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/gurney_5.png',
    cardAmount: 1,
    buyEffects: [
      {
        type: 'card-destroy',
      },
    ],
    agentEffects: [
      {
        type: 'troop',
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
        type: 'card-destroy',
      },
      {
        type: 'sword',
      },
    ],
  },
  {
    name: {
      en: 'Thufir Hawat, Mentat',
      de: 'Thufir Hawat, Mentat',
    },
    persuasionCosts: 7,
    fieldAccess: ['landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/thufir_2.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [
      {
        type: 'agent-lift',
      },
    ],
    customRevealEffect: {
      en: '',
      de: '{resource:persuasion;amount:2}<br>Jeder Gegner: {resource:intrigue-trash}',
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
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'card-destroy',
      },
    ],
    customAgentEffect: {
      en: 'If you have another bene gesserit card in play: {resource:card-draw}',
      de: '{faction:bene} -Verbindung: {resource:card-draw}',
      fontSize: 'medium',
    },
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
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
    customAgentEffect: {
      en: 'If you have a fremen card in play: {resource:card-draw}',
      de: '{faction:fremen} -Verbindung: {resource:card-draw}<br>{faction:bene} -Verbindung: {resource:faction-influence-up-fremen}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Bene Gesserit Acolyte',
      de: 'Bene Gesserit Akolythin',
    },
    faction: 'bene',
    persuasionCosts: 2,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_6.png',
    cardAmount: 2,
    buyEffects: [],
    agentEffects: [
      {
        type: 'card-draw',
      },
    ],
    customRevealEffect: {
      en: '',
      de: '{resource:persuasion;amount:1}<br>{faction:bene} -Verbindung: {resource:persuasion;amount:1}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Covert Influence',
      de: 'Heimliche Beeinflussung',
    },
    faction: 'bene',
    persuasionCosts: 3,
    fieldAccess: ['emperor', 'landsraad'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_9.png',
    cardAmount: 2,
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    customAgentEffect: {
      en: '',
      de: 'Jeder Gegner: {resource:card-discard}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Prana Bindu Training',
      de: 'Prana Bindu Ausbildung',
    },
    faction: 'bene',
    persuasionCosts: 3,
    fieldAccess: ['bene', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_4.png',
    cardAmount: 2,
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
      {
        type: 'separator',
      },
      {
        type: 'card-destroy',
      },
      {
        type: 'sword',
      },
    ],
    customAgentEffect: {
      en: 'If you have another bene gesserit card in play: {resource:signet-ring}',
      de: '{faction:bene} -Verbindung: {resource:signet-ring}',
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
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_7.png',
    cardAmount: 2,
    buyEffects: [],
    agentEffects: [
      {
        type: 'intrigue',
      },
    ],
    customRevealEffect: {
      en: '',
      de: 'Für jede Bene-Gesserit-Karte, die du im Spiel hast: {resource:persuasion;amount:1}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Bene Gesserit Sister',
      de: 'Bene Gesserit Schwester',
    },
    faction: 'bene',
    persuasionCosts: 4,
    fieldAccess: ['bene', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_8.png',
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
        type: 'card-destroy',
      },
    ],
  },
  {
    name: {
      en: 'Jessica, Schwester',
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
        type: 'helper-arrow-right',
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
        type: 'card-destroy',
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
        type: 'helper-arrow-right',
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
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/irulan.png',
    cardAmount: 2,
    buyEffects: [],
    customAgentEffect: {
      en: '',
      de: '{faction:bene} Einfluss <br>0 {resource:card-draw} {resource:separator} 2 {resource:agent-lift}',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '',
      de: '{resource:persuasion;amount:2}<br>{faction:bene} -Verbindung: {resource:intrigue-trash}{resource:intrigue}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Wisdom of Ages',
      de: 'Wissen aus Zeitaltern',
    },
    faction: 'bene',
    persuasionCosts: 5,
    fieldAccess: ['landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_10.png',
    cardAmount: 1,
    buyEffects: [],
    revealEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'persuasion',
        amount: 3,
      },
    ],
    customAgentEffect: {
      en: '',
      de: 'Für jede Bene-Gesserit-Karte, die du im Spiel hast: {resource:card-draw}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Reverend Mother',
      de: 'Ehrwürdige Mutter',
    },
    faction: 'bene',
    persuasionCosts: 6,
    fieldAccess: ['bene', 'emperor', 'fremen', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_2.png',
    cardAmount: 2,
    buyEffects: [],
    customAgentEffect: {
      en: '',
      de: '{faction:bene} Einfluss <br>0 {resource:card-draw-or-destroy} {resource:separator} 2 {resource:card-draw}{resource:card-draw-or-destroy} {resource:separator} 4 {resource:faction-influence-up-choice}',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '{resource:persuasion;amount:2}. Reveal the top 5 cards of the imperium deck. You may acquire bene gesserit cards from them.',
      de: '{resource:persuasion;amount:2}. Decke 5 Karten des Imperium-Stapels auf. Du kannst Bene-Gesserit-Karten davon erwerben.',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Lady Jessica',
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
        type: 'helper-arrow-right',
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
    buyEffects: [
      {
        type: 'card-destroy',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
    ],
    customAgentEffect: {
      en: 'If you have another emperor card in play: {resource:card-draw}',
      de: '{faction:emperor} -Verbindung: {resource:intrigue}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Pledge of Loyalty',
      de: 'Loyalitätsbekundung',
    },
    faction: 'emperor',
    persuasionCosts: 2,
    fieldAccess: ['emperor'],
    imageUrl: '/assets/images/action-backgrounds/empire_ambassador_2.png',
    cardAmount: 2,
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'troop',
      },
    ],
    customAgentEffect: {
      en: 'If you have another emperor card in play: {resource:intrigue}',
      de: '{faction:emperor} -Verbindung: {resource:solari;amount:2}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Sardaukar Infiltrators',
      de: 'Sardaukar Infiltratoren',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['town', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_4.png',
    cardAmount: 2,
    buyEffects: [],
    agentEffects: [
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
        type: 'helper-arrow-right',
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
      en: 'Each opponent retreats a battleship or loses one troop.',
      de: 'Jeder Gegner zieht ein Schlachtschiff zurück oder verliert einen Trupp.',
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
    fieldAccess: ['emperor', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_5.png',
    cardAmount: 2,
    buyEffects: [],
    agentEffects: [
      {
        type: 'troop',
      },
    ],
    customRevealEffect: {
      en: '{resource:persuasion;amount:1}. Reveal the top 5 cards of the imperium deck. You may acquire emperor cards from them.',
      de: '{resource:persuasion;amount:1}. Decke 5 Karten des Imperium-Stapels auf. Du kannst Imperator-Karten davon erwerben.',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Imperial Camp',
      de: 'Imperiales Lager',
    },
    faction: 'emperor',
    persuasionCosts: 3,
    fieldAccess: ['emperor', 'town'],
    imageUrl: '/assets/images/action-backgrounds/military_camp.png',
    cardAmount: 2,
    buyEffects: [
      {
        type: 'troop',
      },
    ],
    customAgentEffect: {
      en: '{faction:emperor} 2 Influence: {resource:troop}',
      de: '{faction:emperor} 2 Einfluss: {resource:troop}',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '{resource:persuasion;amount:1}<br>For each emperor card you have in play (including this one): {resource:sword}',
      de: '{resource:persuasion;amount:1}<br>Für jede Imperator-Karte, die du im Spiel hast: {resource:sword}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Sardaukar Battle Rites',
      de: 'Sardaukar Kampfriten',
    },
    faction: 'emperor',
    persuasionCosts: 4,
    fieldAccess: ['emperor', 'town'],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_2.png',
    cardAmount: 1,
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
        type: 'card-destroy',
      },
    ],
    customAgentEffect: {
      en: '{resource:card-destroy}. If you have another emperor card in play: {resource:card-draw}',
      de: '{resource:card-destroy}<br>{faction:emperor} -Verbindung: {resource:card-draw}',
      fontSize: 'medium',
    },
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
    cardAmount: 2,
    buyEffects: [
      {
        type: 'faction-influence-up-emperor',
      },
    ],
    agentEffects: [],
    customRevealEffect: {
      en: '',
      de: '{resource:location-control}<br>Entsorge diese Karte.',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Imperial Assassin',
      de: 'Imperialer Assassine',
    },
    faction: 'emperor',
    persuasionCosts: 5,
    fieldAccess: ['emperor', 'guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/assassin.png',
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
    ],
    customAgentEffect: {
      en: 'Each opponent trashes one of his cards in play.',
      de: 'Jeder Gegner entsorgt eine seiner Karten im Spiel.',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Betrayal',
      de: 'Verrat',
    },
    faction: 'emperor',
    persuasionCosts: 6,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/battle_3.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [
      {
        type: 'intrigue',
      },
    ],
    customRevealEffect: {
      en: '',
      de: 'Jeder Gegner verliert alle Einheiten im Konflikt.<br>Entsorge diese Karte.',
      fontSize: 'small',
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
    cardAmount: 1,
    buyEffects: [],
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
        type: 'sword',
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
    imageUrl: '/assets/images/action-backgrounds/court_member.png',
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
        type: 'helper-arrow-right',
      },
      {
        type: 'victory-point',
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
      en: 'Intervention of the Emperor',
      de: 'Eingriff des Imperators',
    },
    faction: 'emperor',
    persuasionCosts: 8,
    fieldAccess: ['town'],
    imageUrl: '/assets/images/action-backgrounds/ship.png',
    cardAmount: 1,
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
        amount: 2,
      },
      {
        type: 'troop',
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
    buyEffects: [],
    agentEffects: [
      {
        type: 'spice',
      },
    ],
    customRevealEffect: {
      en: '',
      de: '{resource:persuasion;amount:1}<br>Fremenbund: {resource:sword}',
      fontSize: 'medium',
    },
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
    customAgentEffect: {
      en: 'If you have a bene gesserit card in play: {resource:card-draw}',
      de: '{faction:bene} -Verbindung: {resource:card-draw}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Catchbasin',
      de: 'Fangbecken',
    },
    faction: 'fremen',
    persuasionCosts: 2,
    fieldAccess: [],
    imageUrl: '/assets/images/action-backgrounds/research_station.png',
    cardAmount: 2,
    buyEffects: [],
    agentEffects: [],
    revealEffects: [
      {
        type: 'water',
      },
      {
        type: 'water',
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
        type: 'sword',
      },
    ],
    customAgentEffect: {
      en: 'You may pass your next turn.',
      de: 'Du kannst deinen nächsten Zug passen.',
      fontSize: 'small',
    },
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
    buyEffects: [],
    customAgentEffect: {
      en: '',
      de: 'Jeder Gegner: {resource:loose-troop}<br>{faction:fremen} -Verbindung: {resource:spice}',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '',
      de: '{resource:sword}{resource:sword}<br>Du darfst drei Truppen aus deiner Garnison im Konflikt einsetzen.',
      fontSize: 'small',
    },
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
        type: 'sword',
      },
    ],
    customAgentEffect: {
      en: '',
      de: '{resource:card-destroy}{resource:card-destroy}{resource:card-draw}{resource:card-draw}<br>Entsorge diese Karte.',
      fontSize: 'medium',
    },
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
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'card-destroy',
      },
    ],
    customAgentEffect: {
      en: '',
      de: '{resource:spice}<br>{faction:fremen} -Verbindung: {resource:spice}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Prophecy of Paradise',
      de: 'Prophezeiung des Paradieses',
    },
    faction: 'fremen',
    persuasionCosts: 4,
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/sietch.png',
    cardAmount: 2,
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
        type: 'helper-arrow-right',
      },
      {
        type: 'victory-point',
      },
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    customRevealEffect: {
      en: '{resource:persuasion;amount:2}. Reveal the top 5 cards of the imperium deck. You may acquire fremen cards from them.',
      de: '{resource:persuasion;amount:2}. Decke 5 Karten des Imperium-Stapels auf. Du kannst Fremen-Karten davon erwerben.',
      fontSize: 'small',
    },
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
    buyEffects: [],
    customAgentEffect: {
      en: '{resource:card-draw}. If you have another fremen card in play: {resource:agent-lift}',
      de: '{resource:card-draw}<br>{faction:fremen} -Verbindung: {resource:agent-lift}',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '{resource:sword}{resource:sword}. Reveal the top 5 cards of the imperium deck. You may acquire fremen cards from them.',
      de: 'Für jede Fremen-Karte, die du im Spiel hast: {resource:sword}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Sayyadinah',
      de: 'Sayyadinah',
    },
    faction: 'fremen',
    persuasionCosts: 4,
    fieldAccess: ['fremen'],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_5.png',
    cardAmount: 1,
    buyEffects: [],
    customAgentEffect: {
      en: '{faction:bene} or {faction:fremen} 2 Influence: Turn this card on its back side.',
      de: '{faction:bene} oder {faction:fremen} 2 Einfluss: Erhalte die Karte "Wasser des Lebens" aus dem Imperium-Stapel.',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '{resource:persuasion;amount:1}<br>Fremen Bond: {resource:troop}{resource:water}',
      de: '{resource:persuasion;amount:1}<br>Fremenbund: {resource:troop}{resource:water}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Fedaykin',
      de: 'Fedaykin',
    },
    faction: 'fremen',
    persuasionCosts: 4,
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors_5.png',
    cardAmount: 2,
    buyEffects: [],
    agentEffects: [
      {
        type: 'card-discard',
      },
      {
        type: 'card-discard',
      },
      {
        type: 'helper-arrow-right',
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
    buyEffects: [],
    agentEffects: [
      {
        type: 'troop',
      },
      {
        type: 'card-destroy',
      },
    ],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 1,
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
      en: 'Ramallo, Reverend Mother',
      de: 'Ramallo, Ehrwürdige Mutter ',
    },
    faction: 'fremen',
    persuasionCosts: 5,
    fieldAccess: ['fremen'],
    imageUrl: '/assets/images/action-backgrounds/ramallo.png',
    cardAmount: 1,
    buyEffects: [
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    agentEffects: [],
    customRevealEffect: {
      en: '',
      de: 'Für jede Fremen-Karte, die du im Spiel hast: {resource:persuasion;amount:1}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Otheym, Naib',
      de: 'Otheym, Naib',
    },
    faction: 'fremen',
    persuasionCosts: 5,
    fieldAccess: ['fremen', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/fremen_2.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [
      {
        type: 'troop',
      },
    ],
    customRevealEffect: {
      en: '',
      de: '{resource:persuasion;amount:1}{resource:sword}{resource:sword}<br>Fremenbund: {resource:water}',
      fontSize: 'medium',
    },
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
    buyEffects: [],
    agentEffects: [
      {
        type: 'water',
      },
    ],
    customRevealEffect: {
      en: '',
      de: '{resource:persuasion;amount:2}{resource:sword}<br>Fremenbund: {resource:card-destroy}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Jessica, Reverend Mother',
      de: 'Jessica, Ehrwürdige Mutter',
    },
    faction: 'fremen',
    persuasionCosts: 6,
    fieldAccess: ['fremen', 'town'],
    imageUrl: '/assets/images/action-backgrounds/jessica.png',
    cardAmount: 1,
    buyEffects: [],
    customAgentEffect: {
      en: '',
      de: 'Für jede Fremen-Karte, die du im Spiel hast: {resource:card-draw-or-destroy}',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '',
      de: 'Für jede Fremen-Karte, die du im Spiel hast: {resource:persuasion;amount:1}{resource:sword}',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Fremen Sietch',
      de: 'Fremen Sietch',
    },
    faction: 'fremen',
    persuasionCosts: 7,
    fieldAccess: ['fremen', 'town', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/desert_2.png',
    cardAmount: 1,
    buyEffects: [],
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
        type: 'water',
      },
      {
        type: 'spice',
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
    persuasionCosts: 7,
    fieldAccess: ['fremen'],
    imageUrl: '/assets/images/action-backgrounds/water_of_life.png',
    cardAmount: 1,
    buyEffects: [],
    customAgentEffect: {
      en: '{faction:bene} or {faction:fremen} Alliance: Trash this card {resource:helper-arrow-right} {resource:victory-point}',
      de: '{faction:bene} oder {faction:fremen} Allianz: {resource:victory-point}. Entsorge diese Karte.',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '{resource:persuasion;amount:1}<br>Fremen Bond: {resource:faction-influence-up-fremen}',
      de: '{resource:persuasion;amount:1}<br>Fremenbund: {resource:faction-influence-up-fremen}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'The Voice from the Outer World',
      de: 'Stimme der Aussenwelt',
    },
    faction: 'fremen',
    persuasionCosts: 8,
    fieldAccess: ['fremen', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/faithful_6.png',
    cardAmount: 1,
    buyEffects: [
      {
        type: 'faction-influence-up-fremen',
      },
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    customAgentEffect: {
      en: '',
      de: 'Für jede Fremen-Karte, die du im Spiel hast: {resource:troop}',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '',
      de: '{resource:persuasion;amount:2}<br>Für jede Fremen-Karte, die du im Spiel hast: {resource:sword}',
      fontSize: 'small',
    },
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
    buyEffects: [
      {
        type: 'solari',
        amount: 2,
      },
    ],
    agentEffects: [
      {
        type: 'solari',
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
    buyEffects: [],
    agentEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'solari',
        amount: 2,
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
        type: 'solari',
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
    fieldAccess: ['guild', 'landsraad', 'spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/staban.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'solari',
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
      en: '',
      de: '{faction:guild} 2 Einfluss: {resource:card-draw}',
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
    fieldAccess: ['spice'],
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
        type: 'helper-arrow-right',
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
    ],
  },
  {
    name: {
      en: 'Guild Banker',
      de: 'Gilden Bänker',
    },
    faction: 'guild',
    persuasionCosts: 4,
    fieldAccess: ['guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/guild_banker.png',
    cardAmount: 2,
    buyEffects: [],
    agentEffects: [
      {
        type: 'faction-influence-down-choice',
      },
      {
        type: 'helper-arrow-right',
      },
      {
        type: 'solari',
        amount: 5,
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
      en: 'Esmar Tuek, Smuggler',
      de: 'Esmar Tuek, Schmuggler',
    },
    faction: 'guild',
    persuasionCosts: 5,
    fieldAccess: ['guild', 'spice'],
    imageUrl: '/assets/images/action-backgrounds/esmar.png',
    cardAmount: 1,
    buyEffects: [],
    agentEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-arrow-right',
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
    cardAmount: 1,
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    customAgentEffect: {
      en: '',
      de: '{resource:spice} -Kosten für Felder sind um 1 reduziert.',
      fontSize: 'small',
    },
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
    buyEffects: [
      {
        type: 'faction-influence-up-guild',
      },
    ],
    agentEffects: [
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
      en: 'Embargo',
      de: 'Embargo',
    },
    faction: 'guild',
    persuasionCosts: 6,
    fieldAccess: ['bene', 'emperor', 'guild', 'landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/highliner_2.png',
    cardAmount: 1,
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 3,
      },
    ],
    customAgentEffect: {
      en: '',
      de: '{resource:card-draw}<br>Felder dieses Typs sind für andere Spieler in dieser Runde blockiert.',
      fontSize: 'small',
    },
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
        type: 'persuasion',
        amount: 1,
      },
      {
        type: 'shipping',
      },
      {
        type: 'tech',
      },
    ],
  },
];
