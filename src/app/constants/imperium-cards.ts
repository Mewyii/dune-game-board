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
        type: 'focus',
      },
    ],
    agentEffects: [],
    revealEffects: [
      {
        type: 'spice',
      },
      {
        type: 'helper-trade',
      },
      {
        type: 'persuasion',
        amount: 3,
      },
      {
        type: 'focus',
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
        type: 'helper-or',
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
      en: 'You may look at the top card of the conflict deck.',
      de: 'Du kannst dir die oberste Karte des Konflikt-Stapels ansehen.',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '{faction:bene} -Connection: {resource:persuasion;amount:2}',
      de: '{faction:bene} -Verbindung: {resource:persuasion;amount:2}',
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
    customAgentEffect: {
      en: '{faction:bene} -Connection: {resource:card-draw}',
      de: '{faction:bene} -Verbindung: {resource:card-draw}',
      fontSize: 'medium',
    },
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
    buyEffects: [],
    agentEffects: [],
    customRevealEffect: {
      en: '{resource:persuasion;amount:1}<br>{faction:emperor} -Connection: {resource:intrigue}',
      de: '{resource:persuasion;amount:1}<br>{faction:emperor} -Verbindung: {resource:intrigue}',
      fontSize: 'medium',
    },
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
      en: '{resource:persuasion;amount:1}<br>{faction:fremen} -Connection: {resource:sword}',
      de: '{resource:persuasion;amount:1}<br>{faction:fremen} -Verbindung: {resource:sword}',
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
        amount: 2,
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
      en: '{faction:bene} -Connection: {resource:card-draw}',
      de: '{faction:bene} -Verbindung: {resource:card-draw}',
      fontSize: 'medium',
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
    buyEffects: [],
    agentEffects: [
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
      en: 'Supply Ambush',
      de: 'Versorgungsüberfall',
    },
    persuasionCosts: 2,
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors_4.png',
    cardAmount: 2,
    buyEffects: [],
    customAgentEffect: {
      en: 'Every opponent loses {resource:spice}/{resource:water}/{resource:solari}',
      de: 'Jeder Gegner verliert {resource:spice}/{resource:water}/{resource:solari}',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '{resource:sword}{resource:sword}. Deploy up to <b>1</b> additional troop to the conflict.',
      de: '{resource:sword}{resource:sword}. Setze bis zu <b>1</b> Trupp aus deiner Garnison im Konflikt ein.',
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
      en: '{resource:persuasion;amount:1}<br>You may retreat <b>1</b> inserted troops after the combat phase.',
      de: '{resource:persuasion;amount:1}<br>Du kannst nach der Kampf-Phase <b>1</b> eingesetzten Trupp zurückziehen.',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Dr. Yueh, Suk Doctor',
      de: 'Dr. Yueh, Suk-Arzt',
    },
    persuasionCosts: 2,
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
      en: '{faction:fremen} -Connection: {resource:card-draw}<br>{faction:bene} -Connection: {resource:faction-influence-up-fremen}',
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
      en: '{resource:persuasion;amount:1}<br>{faction:bene} -Connection: {resource:persuasion;amount:1}',
      de: '{resource:persuasion;amount:1}<br>{faction:bene} -Verbindung: {resource:persuasion;amount:1}',
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
      en: '{faction:emperor} -Connection: {resource:intrigue}',
      de: '{faction:emperor} -Verbindung: {resource:solari;amount:2}',
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
        type: 'helper-trade',
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
      en: '{resource:location-control}<br>Trash this card.',
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
        type: 'helper-trade',
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
        type: 'helper-trade',
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
      en: 'Each opponent: {resource:card-discard}',
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
        type: 'helper-or',
      },
      {
        type: 'focus',
      },
      {
        type: 'sword',
      },
    ],
    customAgentEffect: {
      en: '{faction:bene} -Connection: {resource:signet-ring}',
      de: '{faction:bene} -Verbindung: {resource:signet-ring}',
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
      en: '{resource:persuasion;amount:1}. Reveal the top <b>5</b> cards of the imperium deck. You may acquire emperor cards from them.',
      de: '{resource:persuasion;amount:1}. Decke <b>5</b> Karten des Imperium-Stapels auf. Du kannst Imperator-Karten davon erwerben.',
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
      en: '{resource:persuasion;amount:1}<br>For each emperor card you have in play: {resource:sword}',
      de: '{resource:persuasion;amount:1}<br>Für jede Imperator-Karte, die du im Spiel hast: {resource:sword}',
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
      en: 'Each opponent: {resource:loose-troop}<br>{faction:fremen} -Connection: {resource:spice}',
      de: 'Jeder Gegner: {resource:loose-troop}<br>{faction:fremen} -Verbindung: {resource:spice}',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '{resource:sword}{resource:sword}<br>Deploy up to <b>3</b> troops from your garrison to conflict.',
      de: '{resource:sword}{resource:sword}<br>Setze bis zu <b>3</b> Truppen aus deiner Garnison im Konflikt ein.',
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
      en: '{resource:focus}{resource:focus}{resource:card-draw}{resource:card-draw}<br>Trash this card.',
      de: '{resource:focus}{resource:focus}{resource:card-draw}{resource:card-draw}<br>Entsorge diese Karte.',
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
        type: 'focus',
      },
    ],
    customAgentEffect: {
      en: '{resource:spice}<br>{faction:fremen} -Connection: {resource:spice}',
      de: '{resource:spice}<br>{faction:fremen} -Verbindung: {resource:spice}',
      fontSize: 'medium',
    },
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
      en: '{faction:guild} 2 Influence: {resource:card-draw}',
      de: '{faction:guild} 2 Einfluss: {resource:card-draw}',
      fontSize: 'medium',
    },
  },
  {
    name: {
      en: 'Gurney Halleck, Smuggler',
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
        type: 'helper-trade',
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
        type: 'helper-trade',
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
      en: 'For each bene gesserit card you have in play: {resource:persuasion;amount:1}',
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
        type: 'focus',
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
        type: 'focus',
      },
    ],
    customAgentEffect: {
      en: '{resource:focus}<br>{faction:emperor} -Connection: {resource:card-draw}',
      de: '{resource:focus}<br>{faction:emperor} -Verbindung: {resource:card-draw}',
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
        type: 'helper-trade',
      },
      {
        type: 'victory-point',
      },
      {
        type: 'faction-influence-up-fremen',
      },
    ],
    customRevealEffect: {
      en: '{resource:persuasion;amount:2}. Reveal the top <b>5</b> cards of the imperium deck. You may acquire fremen cards from them.',
      de: '{resource:persuasion;amount:2}. Decke <b>5</b> Karten des Imperium-Stapels auf. Du kannst Fremen-Karten davon erwerben.',
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
      en: '{resource:card-draw}<br>{faction:fremen} -Connection: {resource:agent-lift}',
      de: '{resource:card-draw}<br>{faction:fremen} -Verbindung: {resource:agent-lift}',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: 'For each fremen card you have in play: {resource:sword}',
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
      en: '{faction:bene} or {faction:fremen} 2 Influence: Get the card "Water of Life" from the imperium deck.',
      de: '{faction:bene} oder {faction:fremen} 2 Einfluss: Erhalte die Karte "Wasser des Lebens" aus dem Imperium-Stapel.',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '{resource:persuasion;amount:1}<br>{faction:fremen} -Connection: {resource:troop}{resource:water}',
      de: '{resource:persuasion;amount:1}<br>{faction:fremen} -Verbindung: {resource:troop}{resource:water}',
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
        type: 'helper-trade',
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
        type: 'helper-trade',
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
      en: 'Insurgents',
      de: 'Aufrührer',
    },
    persuasionCosts: 4,
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
      en: '{faction:fremen} Influence <br>0 {resource:faction-influence-up-fremen} {resource:helper-or} 2 {resource:troop} {resource:helper-or} 4 {resource:troop}{resource:troop}',
      de: '{faction:fremen} Einfluss <br>0 {resource:faction-influence-up-fremen} {resource:helper-or} 2 {resource:troop} {resource:helper-or} 4 {resource:troop}{resource:troop}',
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
        type: 'helper-trade',
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
    fieldAccess: ['spice', 'town'],
    imageUrl: '/assets/images/action-backgrounds/irulan.png',
    cardAmount: 2,
    buyEffects: [],
    customAgentEffect: {
      en: '{faction:bene} Influence <br>0 {resource:card-draw} {resource:helper-or} 2 {resource:agent-lift}',
      de: '{faction:bene} Einfluss <br>0 {resource:card-draw} {resource:helper-or} 2 {resource:agent-lift}',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '{resource:persuasion;amount:2}<br>{faction:bene} -Connection: {resource:intrigue-trash}{resource:intrigue}',
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
        type: 'helper-trade',
      },
      {
        type: 'persuasion',
        amount: 3,
      },
    ],
    customAgentEffect: {
      en: 'For each bene-gesserit card in play: {resource:card-draw}',
      de: 'Für jede Bene-Gesserit-Karte, die du im Spiel hast: {resource:card-draw}',
      fontSize: 'small',
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
      en: '{resource:location-control}<br>Trash this card.',
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
        type: 'focus',
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
      en: 'For each fremen card you have in play: {resource:persuasion;amount:1}',
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
      en: '{resource:persuasion;amount:1}{resource:sword}{resource:sword}<br>{faction:fremen} -Connection: {resource:water}',
      de: '{resource:persuasion;amount:1}{resource:sword}{resource:sword}<br>{faction:fremen} -Verbindung: {resource:water}',
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
      en: '{resource:persuasion;amount:2}{resource:sword}<br>{faction:fremen} -Connection: {resource:focus}',
      de: '{resource:persuasion;amount:2}{resource:sword}<br>{faction:fremen} -Verbindung: {resource:focus}',
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
    cardAmount: 1,
    buyEffects: [],
    revealEffects: [
      {
        type: 'persuasion',
        amount: 2,
      },
    ],
    customAgentEffect: {
      en: '{resource:spice} -costs for fields are reduced by <b>1</b>.',
      de: '{resource:spice} -Kosten für Felder sind um <b>1</b> reduziert.',
      fontSize: 'small',
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
      en: '{resource:card-draw} <br>Ignore enemy agents or influence requirements.',
      de: '{resource:card-draw} <br>Ignoriere gegnerische Agenten oder Einfluss-Anforderungen.',
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
      en: '{resource:loose-troop}{resource:loose-troop}{resource:faction-influence-down-guild}{resource:faction-influence-down-emperor}{resource:helper-trade}{resource:victory-point}{resource:victory-point}<br>Trash this card.',
      de: '{resource:loose-troop}{resource:loose-troop}{resource:faction-influence-down-guild}{resource:faction-influence-down-emperor}{resource:helper-trade}{resource:victory-point}{resource:victory-point}<br>Entsorge diese Karte.',
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
      en: '{faction:bene} Influence <br>0 {resource:card-draw-or-destroy} {resource:helper-or} 2 {resource:card-draw}{resource:card-draw-or-destroy} {resource:helper-or} 4 {resource:faction-influence-up-choice}',
      de: '{faction:bene} Einfluss <br>0 {resource:card-draw-or-destroy} {resource:helper-or} 2 {resource:card-draw}{resource:card-draw-or-destroy} {resource:helper-or} 4 {resource:faction-influence-up-choice}',
      fontSize: 'medium',
    },
    customRevealEffect: {
      en: '{resource:persuasion;amount:2}. Reveal the top <b>5</b> cards of the imperium deck. You may acquire bene gesserit cards from them.',
      de: '{resource:persuasion;amount:2}. Decke <b>5</b> Karten des Imperium-Stapels auf. Du kannst Bene-Gesserit-Karten davon erwerben.',
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
      en: 'Each opponent loses all units in the conflict.<br>Trash this card.',
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
        type: 'helper-trade',
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
      en: '{resource:card-draw}<br>Fields of this type are blocked for all opponents this round.',
      de: '{resource:card-draw}<br>Felder dieses Typs sind für alle Gegner in dieser Runde blockiert.',
      fontSize: 'small',
    },
  },
  {
    name: {
      en: 'Gurney Halleck, Warmaster',
      de: 'Gurney Halleck, Kriegsmeister',
    },
    persuasionCosts: 7,
    fieldAccess: ['landsraad', 'town'],
    imageUrl: '/assets/images/action-backgrounds/gurney_5.png',
    cardAmount: 1,
    buyEffects: [
      {
        type: 'focus',
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
        type: 'focus',
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
      en: '{resource:persuasion;amount:2}<br>Each opponent: {resource:intrigue-trash}',
      de: '{resource:persuasion;amount:2}<br>Jeder Gegner: {resource:intrigue-trash}',
      fontSize: 'medium',
    },
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
      en: '{faction:bene} or {faction:fremen} Alliance: Trash this card {resource:helper-trade} {resource:victory-point}',
      de: '{faction:bene} oder {faction:fremen} Allianz: {resource:victory-point}. Entsorge diese Karte.',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '{resource:persuasion;amount:1}<br>{faction:fremen} -Connection: {resource:faction-influence-up-fremen}',
      de: '{resource:persuasion;amount:1}<br>{faction:fremen} -Verbindung: {resource:faction-influence-up-fremen}',
      fontSize: 'medium',
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
      en: 'For each fremen card you have in play: {resource:troop}',
      de: 'Für jede Fremen-Karte, die du im Spiel hast: {resource:troop}',
      fontSize: 'small',
    },
    customRevealEffect: {
      en: '{resource:persuasion;amount:2}<br>For each fremen card you have in play: {resource:sword}',
      de: '{resource:persuasion;amount:2}<br>Für jede Fremen-Karte, die du im Spiel hast: {resource:sword}',
      fontSize: 'small',
    },
  },
];
