import { LanguageString, Resource } from '../models';

export interface LeaderImageOnly {
  name: LanguageString;
  house?: LanguageString;
  type: 'old';
  imageUrl: string;
  playableByAI?: boolean;
  aiFieldAccessModifier?: AiFieldAccessModifier;
}

interface AiFieldAccessModifier {
  resources?: Resource[];
  directFieldAccess?: string[];
}

export const leadersOld: LeaderImageOnly[] = [
  {
    name: { de: 'paul atreides', en: 'paul atreides' },
    house: {
      de: 'haus atreides',
      en: 'house atreides',
    },
    type: 'old',
    imageUrl: '/assets/images/leaders/old/paul.jpg',
    playableByAI: true,
  },
  {
    name: { de: 'herzog leto atreides', en: 'duke leto atreides' },
    house: {
      de: 'haus atreides',
      en: 'house atreides',
    },
    type: 'old',
    imageUrl: '/assets/images/leaders/old/leto.jpg',
    playableByAI: true,
    aiFieldAccessModifier: {
      resources: [{ type: 'currency', amount: 1 }],
    },
  },
  {
    name: { de: 'graf ilban richese', en: 'count ilban richese' },
    house: {
      de: 'haus richese',
      en: 'house richese',
    },
    type: 'old',
    imageUrl: '/assets/images/leaders/old/ilban.jpg',
    playableByAI: true,
  },
  {
    name: { de: 'helena richese', en: 'helena richese' },
    house: {
      de: 'haus richese',
      en: 'house richese',
    },
    type: 'old',
    imageUrl: '/assets/images/leaders/old/helena.jpg',
  },
  {
    name: { de: 'baron vladimir harkonnen', en: 'baron vladimir harkonnen' },
    house: {
      de: 'haus harkonnen',
      en: 'house harkonnen',
    },
    type: 'old',
    imageUrl: '/assets/images/leaders/old/vlad.jpg',
  },
  {
    name: { de: 'glossu "die bestie" rabban', en: 'glossu "the beast" rabban' },
    house: {
      de: 'haus harkonnen',
      en: 'house harkonnen',
    },
    type: 'old',
    imageUrl: '/assets/images/leaders/old/rabban.jpg',
    playableByAI: true,
  },
  {
    name: { de: 'gräfin ariana thorvald', en: 'countess ariana thorvald' },
    house: {
      de: 'haus thorvald',
      en: 'house thorvald',
    },
    type: 'old',
    imageUrl: '/assets/images/leaders/old/ariana.jpg',
    playableByAI: true,
  },
  {
    name: { de: 'graf memnon thorvald', en: 'count memnon thorvald' },
    house: {
      de: 'haus thorvald',
      en: 'house thorvald',
    },
    type: 'old',
    imageUrl: '/assets/images/leaders/old/memnon.jpg',
    playableByAI: true,
  },
  // {
  //   name: 'count hundro moritani',
  //   imageUrl: '/assets/images/leaders/old/hundro.jpg',
  // },
  {
    name: { de: '"prinzessin" yuna moritani', en: '"princess" yuna moritani' },
    house: {
      de: 'haus moritani',
      en: 'house moritani',
    },
    type: 'old',
    imageUrl: '/assets/images/leaders/old/yuna.jpg',
  },
  {
    name: { de: 'erzherzog  armand ecaz', en: 'archduke armand ecaz' },
    house: {
      de: 'haus ecaz',
      en: 'house ecaz',
    },
    type: 'old',
    imageUrl: '/assets/images/leaders/old/armand.jpg',
  },
  // {
  //   name: 'ilesa ecaz',
  //   imageUrl: '/assets/images/leaders/old/ilesa.jpg',
  // },
];
