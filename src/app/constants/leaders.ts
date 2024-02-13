import { LanguageString, Resource } from '../models';

export interface Leader {
  name: LanguageString;
  type: 'new';
  house: LanguageString;
  passiveName: LanguageString;
  passiveDescription: LanguageString;
  signetName: LanguageString;
  signetDescription: LanguageString;
  imageUrl: string;
  playableByAI?: boolean;
  aiFieldAccessModifier?: AiFieldAccessModifier;
}

interface AiFieldAccessModifier {
  resources?: Resource[];
  directFieldAccess?: string[];
}

export const leaders: Leader[] = [
  {
    name: { de: 'der prediger', en: 'the preacher' },
    house: { de: '-', en: '-' },
    passiveName: { de: 'blind und doch sehend', en: 'blind but seeing' },
    passiveDescription: {
      de: '<b>Aufdeckzug</b>: Bevor du aufdeckst, darfst du 1 deiner Karten im Spiel zurück auf deine Hand nehmen.',
      en: '<b>Reveal turn</b>: Before you reveal, you may add 1 of your cards in play back to your hand.',
    },
    signetName: { de: 'anklagender prophet', en: 'accusing prophet' },
    signetDescription: {
      de: 'Jeder Spieler {resource:card-discard}.',
      en: 'Every player {resource:card-discard}.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/preacher.png',
  },
  {
    name: { de: 'prinzessin irulan corrino', en: 'princess irulan corrino' },
    house: { de: 'haus corrino', en: 'house corrino' },
    passiveName: { de: 'tochter des imperators', en: 'daughter of the emperor' },
    passiveDescription: {
      de: 'Entferne deinen Marker von der {faction:emperor}-Einflussleiste. Immer wenn du dort Einfluss erhalten würdest: {resource:currency}',
      en: 'Remove your marker from the {faction:emperor}-track. Every time you would gain influence there: {resource:currency}',
    },
    signetName: { de: 'chronistin', en: 'chronicler' },
    signetDescription: {
      de: '{resource:card-discard} {resource:helper-arrow-right} {resource:signet-token}. Du kannst ihn entsorgen wenn du einen Agenten platzierst, um {resource:card-draw}{resource:card-draw} zu erhalten.',
      en: '{resource:card-discard} {resource:helper-arrow-right} {resource:signet-token}. You may trash it when you place an agent to get {resource:card-draw}{resource:card-draw}.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/irulan.png',
    playableByAI: true,
  },
  {
    name: { de: 'graf hasimir fenring', en: 'count hasimir fenring' },
    house: { de: 'haus fenring', en: 'house fenring' },
    passiveName: { de: 'politischer taktiker', en: 'political tactician' },
    passiveDescription: {
      de: 'Du beginnst mit {resource:foldspace}{resource:foldspace} in deinem Deck.',
      en: 'You begin with {resource:foldspace}{resource:foldspace} in your deck.',
    },
    signetName: { de: 'vorgetäuschte schwäche', en: 'feigned weakness' },
    signetDescription: {
      de: '{resource:card-discard} {resource:helper-arrow-right} {resource:signet-token}. Entsorge ihn an deinem Aufdeckzug, um {resource:sword}{resource:sword}{resource:separator}{resource:intrigue} zu erhalten.',
      en: '{resource:card-discard} {resource:helper-arrow-right} {resource:signet-token}. Trash it at your reveal turn to get {resource:sword}{resource:sword}{resource:separator}{resource:intrigue}.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/hasimir.png',
    playableByAI: true,
  },
  {
    name: { de: 'lady margot fenring', en: 'lady margot fenring' },
    house: { de: 'haus fenring', en: 'house fenring' },
    passiveName: { de: 'bene gesserit training', en: 'bene gesserit training' },
    passiveDescription: {
      de: 'Du kannst deinen 1. Zug passen. Tust du das, {resource:card-draw}.',
      en: 'You may pass your 1. turn. If you do, {resource:card-draw}.',
    },
    signetName: { de: 'hypnotische verführung', en: 'hypnotic seduction' },
    signetDescription: {
      de: 'Lege {resource:signet-token} auf eine Karte in der Imperium-Reihe. Sie kostet dich {resource:persuasion} weniger, Gegner {resource:persuasion} mehr.',
      en: 'Place {resource:signet-token} on a card in the imperium row. It costs you {resource:persuasion} less and enemies {resource:persuasion} more.',
    },
    type: 'new',
    imageUrl: '/assets/images/leaders/margot.png',
    playableByAI: true,
  },
];
