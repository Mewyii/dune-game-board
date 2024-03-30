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
  buyEffects?: Reward[];
  imageUrl?: string;
  cardAmount?: number;
}

export const imperiumCards: ImperiumCard[] = [
  {
    name: { de: 'Sardaukar Lasgun-Team', en: 'Sardaukar Lasgun Team' },
    persuasionCosts: 3,
    faction: 'emperor',
    fieldAccess: ['town'],
    customAgentEffect: {
      de: 'Jeder Gegner zieht ein Schlachtschiff zurück oder verliert einen Trupp.',
      en: 'Each opponent retreats a battleship or loses one troop.',
    },
    revealEffects: [{ type: 'persuasion', amount: 1 }, { type: 'sword' }, { type: 'sword' }],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_6.png',
  },
  {
    name: { de: 'Sardaukar Infiltratoren', en: 'Sardaukar Infiltrators' },
    persuasionCosts: 2,
    faction: 'emperor',
    fieldAccess: ['town', 'spice'],
    customAgentEffect: {
      de: 'Jeder Gegner {resource:card-discard}.',
      en: 'Each opponent {resource:card-discard}.',
    },
    revealEffects: [{ type: 'persuasion', amount: 1 }, { type: 'sword' }],
    imageUrl: '/assets/images/action-backgrounds/sardaukar_4.png',
  },
  {
    name: { de: 'Loyalitätsbekundung', en: 'Pledge of Loyalty' },
    persuasionCosts: 2,
    faction: 'emperor',
    fieldAccess: ['emperor'],
    customAgentEffect: {
      de: 'Wenn du eine weitere Imperator-Karte im Spiel hast: {resource:intrigue}',
      en: 'If you have another emperor card in play: {resource:intrigue}',
    },
    revealEffects: [{ type: 'persuasion', amount: 1 }, { type: 'currency' }],
    imageUrl: '/assets/images/action-backgrounds/empire_ambassador_2.png',
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
      de: '{resource:sword}{resource:sword}. Decke 5 Karten des Imperium-Stapels auf. Du kannst Fremen-Karten davon erwerben.',
      en: '{resource:sword}{resource:sword}. Reveal the top 5 cards of the imperium deck. You may acquire fremen cards from them.',
    },
    imageUrl: '/assets/images/action-backgrounds/sandworm.png',
  },
  {
    name: { de: 'Fremen Stamm', en: 'Fremen Tribe' },
    persuasionCosts: 5,
    faction: 'fremen',
    fieldAccess: ['fremen', 'town', 'spice'],
    agentEffects: [{ type: 'troop' }, { type: 'combat' }],
    revealEffects: [{ type: 'persuasion', amount: 1 }, { type: 'troop' }, { type: 'sword' }, { type: 'sword' }],
    imageUrl: '/assets/images/action-backgrounds/fremen_warriors.png',
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
];
