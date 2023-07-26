import { LanguageString } from '../models';

export interface DuneEvent {
  title: LanguageString;
  description: LanguageString;
  imagePath: string;
  cardAmount?: number;
}

export const duneEvents: DuneEvent[] = [
  {
    title: {
      de: 'klarer himmel',
      en: 'clear sky',
    },
    description: { de: 'kein effekt.', en: 'no effect.' },
    imagePath: 'assets/images/action-backgrounds/sky.png',
    cardAmount: 5,
  },
  {
    title: {
      de: 'sandstürme',
      en: 'sandstorms',
    },
    description: {
      de: 'die kampfstärke aller einheiten ist auf 1 reduziert.',
      en: 'the combat strength of all units is reduced to 1.',
    },
    imagePath: 'assets/images/action-backgrounds/sandstorm.png',
    cardAmount: 2,
  },
  {
    title: {
      de: 'spice-explosionen',
      en: 'spice explosions',
    },
    description: { de: 'spice-felder bringen 1 spice mehr ein.', en: 'spice fields yield 1 spice more.' },
    imagePath: 'assets/images/action-backgrounds/spice_field.png',
    cardAmount: 3,
  },
  {
    title: {
      de: 'sandwürmer',
      en: 'sandworms',
    },
    description: { de: 'spice-felder bringen 1 spice weniger ein.', en: 'spice fields yield 1 spice less.' },
    imagePath: 'assets/images/action-backgrounds/sandworm.png',
    cardAmount: 2,
  },
  {
    title: {
      de: 'pilger',
      en: 'pilgrims',
    },
    description: {
      de: 'am ende deines aufdeckzugs: erhalte 2 solari für jedes blaue feld, das von dir kontrolliert wird.',
      en: 'at the end of your reveal turn: get 2 solari for each blue square you control.',
    },
    imagePath: 'assets/images/action-backgrounds/spaceship.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'bettler',
      en: 'beggars',
    },
    description: {
      de: 'am ende deines aufdeckzugs: zahle 2 solari für jedes blaue feld, das von dir kontrolliert wird oder verliere einen siegpunkt.',
      en: 'at the end of your reveal turn: pay 2 solari for each blue square you control or lose one victory point.',
    },
    imagePath: 'assets/images/action-backgrounds/faithful.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'schmugglerbanden',
      en: 'smuggling gangs',
    },
    description: {
      de: 'am ende deines aufdeckzugs: du kannst 2 raumgilden einfluss verlieren oder 8 solari bezahlen um 1 spice und einen siegpunkt zu erhalten.',
      en: 'at the end of your reveal turn: you can lose 2 spacing guild influence or pay 8 solari to gain 1 spice and one victory point.',
    },
    imagePath: 'assets/images/action-backgrounds/smugglers.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'abgefallene fremen',
      en: 'renegade fremen',
    },
    description: {
      de: 'am ende deines aufdeckzugs: du kannst 2 fremen einfluss verlieren oder 4 einheiten verlieren um 1 wasser und einen siegpunkt zu erhalten.',
      en: 'at the end of your reveal turn: you can lose 2 fremen influence or lose 4 units to gain 1 water and one victory point.',
    },
    imagePath: 'assets/images/action-backgrounds/fremen_warriors.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'gestaltwandler',
      en: 'facedancers',
    },
    description: {
      de: 'am ende deines aufdeckzugs: du kannst 2 bene gesserit einfluss verlieren oder 2 intrigen verlieren um 1 karte zu entsorgen und einen siegpunkt zu erhalten.',
      en: 'at the end of your reveal turn: you can lose 2 bene gesserit influence or lose 2 intrigue to discard 1 card and gain one victory point.',
    },
    imagePath: 'assets/images/action-backgrounds/soldiers.png',
    cardAmount: 1,
  },
  {
    title: {
      de: 'rivalen',
      en: 'rivals',
    },
    description: {
      de: 'am ende deines aufdeckzugs: du kannst 2 imperator einfluss verlieren oder 5 spice bezahlen um eine intrige und einen siegpunkt zu erhalten.',
      en: 'at the end of your reveal turn: you can lose 2 emperor influence or pay 5 spice to gain an intrigue and one victory point.',
    },
    imagePath: 'assets/images/action-backgrounds/smugglers.png',
    cardAmount: 1,
  },
];
