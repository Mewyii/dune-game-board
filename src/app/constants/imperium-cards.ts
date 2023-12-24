import { ActionType, FactionType, LanguageString, Reward } from '../models';

export interface ImperiumCard {
  name: LanguageString;
  faction?: FactionType;
  persuasionCosts?: number;
  fieldAccess?: ActionType[];
  agentEffects?: Reward[];
  customAgentEffect?: LanguageString;
  revealEffects?: Reward[];
  customRevealEffect?: LanguageString;
  imageUrl?: string;
}

export const imperiumCards: ImperiumCard[] = [
  {
    name: { de: 'Aufmarsch', en: 'Deployment' },
    fieldAccess: ['landsraad'],
    revealEffects: [{ type: 'troops' }],
    imageUrl: '/assets/images/action-backgrounds/troops_3.png',
  },
  {
    name: { de: 'Forschung', en: 'Research' },
    fieldAccess: ['landsraad'],
    revealEffects: [{ type: 'tech' }],
    imageUrl: '/assets/images/action-backgrounds/industry.png',
  },
  {
    name: { de: 'Imperialer Agent', en: 'Imperial Agent' },
    persuasionCosts: 2,
    faction: 'imperium',
    fieldAccess: ['landsraad', 'town'],
    revealEffects: [{ type: 'persuasion', amount: 2 }],
    imageUrl: '/assets/images/action-backgrounds/soldiers.png',
  },
  {
    name: { de: 'Bene Gesserit Kontakt', en: 'Bene Gesserit Kontakt' },
    persuasionCosts: 2,
    faction: 'bene',
    fieldAccess: ['landsraad', 'town'],
    revealEffects: [{ type: 'persuasion', amount: 2 }],
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit.png',
  },
  {
    name: { de: 'Sardaukar Lasgun-Team', en: 'Sardaukar Lasgun Team' },
    persuasionCosts: 3,
    faction: 'imperium',
    fieldAccess: ['town'],
    customAgentEffect: {
      de: 'Jeder Gegner zieht ein Schlachtschiff zurück oder verliert einen Trupp.',
      en: 'Each opponent retreats a battleship or loses one troop.',
    },
    revealEffects: [{ type: 'persuasion', amount: 1 }, { type: 'attack-value' }, { type: 'attack-value' }],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_6.png',
  },
  {
    name: { de: 'Sardaukar Infiltratoren', en: 'Sardaukar Infiltrators' },
    persuasionCosts: 2,
    faction: 'imperium',
    fieldAccess: ['town', 'spice'],
    customAgentEffect: {
      de: 'Jeder Gegner {resource:card-discard}.',
      en: 'Each opponent {resource:card-discard}.',
    },
    revealEffects: [{ type: 'persuasion', amount: 1 }, { type: 'attack-value' }],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_4.png',
  },
  {
    name: { de: 'Sardaukar Kampfriten', en: 'Sardaukar Battle Rites' },
    persuasionCosts: 4,
    faction: 'imperium',
    fieldAccess: ['imperium', 'town'],
    customAgentEffect: {
      de: '{resource:card-destroy}. Wenn du eine weitere Imperator-Karte im Spiel hast: {resource:card-draw}',
      en: '{resource:card-destroy}. If you have another emperor card in play: {resource:card-draw}',
    },
    revealEffects: [{ type: 'persuasion', amount: 1 }, { type: 'attack-value' }, { type: 'card-destroy' }],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_2.png',
  },
  {
    name: { de: 'Imperialer Caid', en: 'Imperial Caid' },
    persuasionCosts: 3,
    faction: 'imperium',
    fieldAccess: ['imperium', 'landsraad', 'town'],
    customAgentEffect: {
      de: '',
      en: '{resource:troops}. If you have another emperor card in play: {resource:troops}',
    },
    customRevealEffect: {
      de: '{resource:persuasion}. Decke 5 Karten des Imperium-Stapels auf. Du kannst Imperator-Karten davon erwerben.',
      en: '{resource:persuasion}. Reveal the top 5 cards of the imperium deck. You may acquire emperor cards from them.',
    },
    imageUrl: '/assets/images/action-backgrounds/sardaukar_5.png',
  },
  {
    name: { de: 'Imperialer Burseg', en: 'Imperial Burseg' },
    persuasionCosts: 6,
    faction: 'imperium',
    agentEffects: [{ type: 'card-draw' }],
    fieldAccess: ['imperium', 'guild', 'bene', 'landsraad', 'town'],
    revealEffects: [{ type: 'persuasion', amount: 2 }, { type: 'attack-value' }, { type: 'attack-value' }],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_3.png',
  },
  {
    name: { de: 'Loyalitätsbekundung', en: 'Pledge of Loyalty' },
    persuasionCosts: 2,
    faction: 'imperium',
    fieldAccess: ['imperium'],
    customAgentEffect: {
      de: 'Wenn du eine weitere Imperator-Karte im Spiel hast: {resource:intrigue}',
      en: 'If you have another emperor card in play: {resource:intrigue}',
    },
    revealEffects: [{ type: 'persuasion', amount: 1 }, { type: 'currency' }],
    imageUrl: '/assets/images/action-backgrounds/empire_ambassador_2.png',
  },
  {
    name: { de: 'Imperiale Bestechung', en: 'Imperial Bribe' },
    persuasionCosts: 1,
    faction: 'imperium',
    fieldAccess: ['bene', 'guild', 'landsraad'],
    customAgentEffect: {
      de: 'Wenn du eine weitere Imperator-Karte im Spiel hast: {resource:currency}',
      en: 'If you have another emperor card in play: {resource:currency}',
    },
    revealEffects: [{ type: 'currency', amount: 2 }, { type: 'helper-arrow-right' }, { type: 'faction-influence-choice' }],
    imageUrl: '/assets/images/action-backgrounds/wealth_2.png',
  },
  {
    name: { de: 'Wüsten-Führer', en: 'Desert Guide' },
    persuasionCosts: 1,
    faction: 'fremen',
    fieldAccess: ['spice'],
    customAgentEffect: {
      de: '{resource:spice}. Wenn du eine weitere Fremen-Karte im Spiel hast: {resource:spice}',
      en: '{resource:spice}. If you have another fremen card in play: {resource:spice}',
    },
    revealEffects: [{ type: 'persuasion', amount: 1 }],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors_2.png',
  },
  {
    name: { de: 'Fangbecken', en: 'Catchbasin' },
    persuasionCosts: 2,
    faction: 'fremen',
    revealEffects: [{ type: 'water' }, { type: 'water' }],
    imageUrl: '/assets/images/action-backgrounds/research_station.png',
  },
  {
    name: { de: 'Wüsten-Fortbewegung', en: 'Desert Travel' },
    persuasionCosts: 3,
    faction: 'fremen',
    fieldAccess: ['town', 'spice'],
    customAgentEffect: {
      de: '{resource:card-draw}. Wenn du eine weitere Fremen-Karte im Spiel hast: {resource:card-draw}',
      en: '{resource:card-draw}. If you have another fremen card in play: {resource:card-draw}',
    },
    customRevealEffect: {
      de: '{resource:attack-value}{resource:attack-value}. Decke 5 Karten des Imperium-Stapels auf. Du kannst Fremen-Karten davon erwerben.',
      en: '{resource:attack-value}{resource:attack-value}. Reveal the top 5 cards of the imperium deck. You may acquire fremen cards from them.',
    },
    imageUrl: '/assets/images/action-backgrounds/sandworm.png',
  },
  {
    name: { de: 'Fremen Stamm', en: 'Fremen Tribe' },
    persuasionCosts: 5,
    faction: 'fremen',
    fieldAccess: ['fremen', 'town', 'spice'],
    agentEffects: [{ type: 'troops' }, { type: 'battle-insert' }],
    revealEffects: [
      { type: 'persuasion', amount: 1 },
      { type: 'troops' },
      { type: 'attack-value' },
      { type: 'attack-value' },
    ],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors.png',
  },
  {
    name: { de: 'Fremen Sietch', en: 'Fremen Sietch' },
    persuasionCosts: 7,
    faction: 'fremen',
    fieldAccess: ['fremen', 'town', 'spice'],
    agentEffects: [{ type: 'water' }],
    revealEffects: [{ type: 'persuasion', amount: 2 }, { type: 'water' }, { type: 'spice' }, { type: 'troops' }],
    imageUrl: '/assets/images/action-backgrounds/desert_2.png',
  },
  {
    name: { de: 'Gläubige', en: 'Faithful' },
    persuasionCosts: 1,
    faction: 'fremen',
    fieldAccess: ['town'],
    customAgentEffect: {
      de: 'Wenn du eine Bene-Gesserit-Karte im Spiel hast: {resource:card-draw}',
      en: 'If you have a bene gesserit card in play: {resource:card-draw}',
    },
    revealEffects: [{ type: 'persuasion', amount: 1 }, { type: 'currency' }],
    imageUrl: '/assets/images/action-backgrounds/faithful.png',
  },
  {
    name: { de: 'Ehrwürdige Mutter', en: 'Reverend Mother' },
    persuasionCosts: 4,
    faction: 'bene',
    fieldAccess: ['bene', 'landsraad'],
    agentEffects: [{ type: 'card-draw-or-destroy' }],
    customRevealEffect: {
      de: '{resource:persuasion}. Decke 5 Karten des Imperium-Stapels auf. Du kannst Bene-Gesserit-Karten davon erwerben.',
      en: '{resource:persuasion}. Reveal the top 5 cards of the imperium deck. You may acquire bene gesserit cards from them.',
    },
    imageUrl: '/assets/images/action-backgrounds/bene_gesserit_3.png',
  },
  {
    name: { de: 'Den Glauben Verbreiten', en: 'Spreading the Faith' },
    persuasionCosts: 2,
    faction: 'bene',
    fieldAccess: ['imperium', 'fremen', 'landsraad', 'town'],
    customAgentEffect: {
      de: 'Wenn du eine Fremen-Karte im Spiel hast: {resource:card-draw}',
      en: 'If you have a fremen card in play: {resource:card-draw}',
    },
    revealEffects: [{ type: 'persuasion', amount: 1 }],
    imageUrl: '/assets/images/action-backgrounds/book.png',
  },
  {
    name: { de: 'Flächen Bombardierung', en: 'Area Bombardment' },
    persuasionCosts: 6,
    fieldAccess: ['imperium', 'guild', 'bene', 'fremen', 'landsraad', 'town'],
    customAgentEffect: {
      de: 'Lege {resource:troops} auf dieses Feld. Es kann nicht verwendet werden. Entferne {resource:troops} nach der nächsten Runde.',
      en: 'Place {resource:troops} on this board space. It can not be used. Remove {resource:troops} after the next round.',
    },
    revealEffects: [
      { type: 'persuasion', amount: 2 },
      { type: 'separator' },
      { type: 'attack-value' },
      { type: 'attack-value' },
      { type: 'attack-value' },
    ],
    imageUrl: '/assets/images/action-backgrounds/assault.png',
  },
  {
    name: { de: 'Yueh, Verräter', en: 'Yueh, Traitor' },
    persuasionCosts: 6,
    customRevealEffect: {
      de: 'Jeder Gegner verliert alle Truppen aus seiner Garnison. Entsorge diese Karte.',
      en: 'Each opponent loses all garrisoned troops. Trash this card.',
    },
    imageUrl: '/assets/images/action-backgrounds/yueh.png',
  },
];
