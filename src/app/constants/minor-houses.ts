import { LanguageString } from '../models';

export interface House {
  name: LanguageString;
  colorPrimary: string;
  colorSecondary: string;
  persuasion: number;
  friendshipRequirement: LanguageString;
  friendshipReward: LanguageString;
  allianceRequirement: LanguageString;
  allianceReward: LanguageString;
}

export const minorHouses: House[] = [
  {
    name: { de: 'ginaz', en: 'ginaz' },
    colorPrimary: '#ffffff',
    colorSecondary: '#8a6b21',
    persuasion: 4,
    friendshipRequirement: { de: 'Habe deinen Schwertmeister.', en: 'Have your swordmaster.' },
    friendshipReward: { de: '{resource:card-destroy}', en: '{resource:card-destroy}' },
    allianceRequirement: { de: 'Habe maximal einen Agent auf Feldern.', en: 'Habe maximal einen Agent auf Feldern.' },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'heiron', en: 'heiron' },
    colorPrimary: '#b59126',
    colorSecondary: '#6dbda6',
    persuasion: 4,
    friendshipRequirement: { de: 'Habe einen Sitz im hohen Rat.', en: 'Habe einen Sitz im hohen Rat.' },
    friendshipReward: { de: '{resource:card-round-start}', en: '{resource:card-round-start}' },
    allianceRequirement: { de: 'Verliere 6 Überzeugung.', en: 'Verliere 6 Überzeugung.' },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'metulli', en: 'metulli' },
    colorPrimary: '#e0d6b8',
    colorSecondary: '#8a0f0f',
    persuasion: 3,
    friendshipRequirement: {
      de: 'Habe zwei oder weniger Truppen in deiner Garnison und in der Schlacht.',
      en: 'Habe zwei oder weniger Truppen in deiner Garnison und in der Schlacht.',
    },
    friendshipReward: {
      de: '{resource:currency}{resource:currency}{resource:currency}',
      en: '{resource:currency}{resource:currency}{resource:currency}',
    },
    allianceRequirement: { de: 'Habe keinen Agenten auf einem Kampffeld.', en: 'Habe keinen Agenten auf einem Kampffeld.' },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'plana', en: 'plana' },
    colorPrimary: '#8d2e8f',
    colorSecondary: '#19181a',
    persuasion: 3,
    friendshipRequirement: {
      de: 'Habe Agenten auf mindestens 2 der Felder: "Imperiales Becken", "Sietch Tabr", "Destillanzüge", "Forschungszentrum".',
      en: 'Habe Agenten auf mindestens 2 der Felder: "Imperiales Becken", "Sietch Tabr", "Destillanzüge", "Forschungszentrum".',
    },
    friendshipReward: {
      de: '{resource:card-round-start}{resource:card-round-start}',
      en: '{resource:card-round-start}{resource:card-round-start}',
    },
    allianceRequirement: { de: 'Verliere 2 Wasser.', en: 'Verliere 2 Wasser.' },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'ordos', en: 'ordos' },
    colorPrimary: '#adadad',
    colorSecondary: '#166e10',
    persuasion: 3,
    friendshipRequirement: {
      de: 'Habe Agenten auf mindestens 2 der Felder: "Handelsrechte", "Carthag", "Expedition", "Aufrüstung".',
      en: 'Habe Agenten auf mindestens 2 der Felder: "Handelsrechte", "Carthag", "Expedition", "Aufrüstung".',
    },
    friendshipReward: {
      de: '{resource:currency}{resource:currency}{resource:currency}',
      en: '{resource:currency}{resource:currency}{resource:currency}',
    },
    allianceRequirement: { de: 'Verliere 1 Tech-Plättchen.', en: 'Verliere 1 Tech-Plättchen.' },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'wallach', en: 'wallach' },
    colorPrimary: '#8f8f8f',
    colorSecondary: '#38160e',
    persuasion: 3,
    friendshipRequirement: {
      de: 'Habe Agenten auf mindestens 2 der Felder: "Sietch Tabr", "Arrakeen", "Carthag", "Verborgenes Wissen".',
      en: 'Habe Agenten auf mindestens 2 der Felder: "Sietch Tabr", "Arrakeen", "Carthag", "Verborgenes Wissen".',
    },
    friendshipReward: { de: '{resource:card-destroy}', en: '{resource:card-destroy}' },
    allianceRequirement: { de: 'Verliere 3 Spice.', en: 'Verliere 3 Spice.' },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'novebruns', en: 'novebruns' },
    colorPrimary: '#216dd9',
    colorSecondary: '#171f59',
    persuasion: 3,
    friendshipRequirement: {
      de: 'Habe Agenten auf mindestens 2 der Felder: "Imperiales Becken", "Hagga-Becken", "Die Große Ebene", "Beziehungen".',
      en: 'Habe Agenten auf mindestens 2 der Felder: "Imperiales Becken", "Hagga-Becken", "Die Große Ebene", "Beziehungen"',
    },
    friendshipReward: { de: '2 Tech-Agenten', en: '2 Tech-Agenten' },
    allianceRequirement: { de: 'Verliere 6 Solari.', en: 'Verliere 3 Spice.' },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'fenring', en: 'fenring' },
    colorPrimary: '#a10202',
    colorSecondary: '#080808',
    persuasion: 4,
    friendshipRequirement: {
      de: 'Habe einen Agenten auf dem Feld "Verschwörung".',
      en: 'Habe einen Agenten auf dem Feld "Verschwörung"',
    },
    friendshipReward: {
      de: '{resource:currency}{resource:currency}',
      en: '{resource:currency}{resource:currency}',
    },
    allianceRequirement: { de: 'Besitze 5 oder mehr Intrigen.', en: 'Besitze 5 oder mehr Intrigen' },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'tantor', en: 'tantor' },
    colorPrimary: '#ab6f6f',
    colorSecondary: '#3d3737',
    persuasion: 2,
    friendshipRequirement: {
      de: 'Habe einen Agenten auf dem Feld "Verborgenes Wissen".',
      en: 'Habe einen Agenten auf dem Feld "Verborgenes Wissen".',
    },
    friendshipReward: { de: '{resource:foldspace}', en: '{resource:foldspace}' },
    allianceRequirement: { de: 'Verliere einen Sitz im hohen Rat.', en: 'Verliere einen Sitz im hohen Rat' },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'wayku', en: 'wayku' },
    colorPrimary: '#636363',
    colorSecondary: '#0f0f0f',
    persuasion: 2,
    friendshipRequirement: {
      de: 'Habe einen Agenten auf dem Feld "Heighliner".',
      en: 'Habe einen Agenten auf dem Feld "Heighliner".',
    },
    friendshipReward: { de: '{resource:intrigue}{resource:troops}', en: '{resource:intrigue}{resource:troops}' },
    allianceRequirement: { de: 'Verliere einen Sitz im hohen Rat.', en: 'Verliere einen Sitz im hohen Rat.' },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'mcnaught', en: 'mcnaught' },
    colorPrimary: '#1128bd',
    colorSecondary: '#b3b3b3',
    persuasion: 3,
    friendshipRequirement: {
      de: 'Verliere 1 Einfluss bei einer beliebigen Fraktion.',
      en: 'Verliere 1 Einfluss bei einer beliebigen Fraktion.',
    },
    friendshipReward: {
      de: '{resource:troops}{resource:troops}{resource:troops}',
      en: '{resource:troops}{resource:troops}{resource:troops}',
    },
    allianceRequirement: {
      de: 'Habe zwei oder weniger Einfluss bei allen Fraktionen.',
      en: 'Habe zwei oder weniger Einfluss bei allen Fraktionen.',
    },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'fazeel', en: 'fazeel' },
    colorPrimary: '#7b52d9',
    colorSecondary: '#730633',
    persuasion: 2,
    friendshipRequirement: { de: 'Entsorge eine Fremen Karte.', en: 'Verliere eine Fremen Karte.' },
    friendshipReward: { de: '{resource:intrigue}', en: '{resource:intrigue}' },
    allianceRequirement: {
      de: 'Verliere zwei Fremen Einfluss.',
      en: 'Verliere zwei Einfluss auf der Fremen Leiste.',
    },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'varrik', en: 'varrik' },
    colorPrimary: '#b36205',
    colorSecondary: '#5a90a6',
    persuasion: 2,
    friendshipRequirement: { de: 'Entsorge eine Bene Gesserit Karte.', en: 'Verliere eine Bene Gesserit Karte.' },
    friendshipReward: { de: '{resource:card-round-start}', en: '{resource:card-round-start}' },
    allianceRequirement: {
      de: 'Verliere zwei Bene Gesserit Einfluss.',
      en: 'Verliere zwei Einfluss auf der Bene Gesserit Leiste.',
    },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'jaederan', en: 'jaederan' },
    colorPrimary: '#0ec764',
    colorSecondary: '#381a12',
    persuasion: 2,
    friendshipRequirement: { de: 'Entsorge eine Raumgilden Karte.', en: 'Verliere eine Raumgilden Karte.' },
    friendshipReward: { de: '{resource:troops}{resource:troops}', en: '{resource:troops}{resource:troops}' },
    allianceRequirement: {
      de: 'Verliere zwei Raumgilden Einfluss.',
      en: 'Verliere zwei Einfluss auf der Raumgilden Leiste.',
    },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
  {
    name: { de: 'taligari', en: 'taligari' },
    colorPrimary: '#786577',
    colorSecondary: '#9e2898',
    persuasion: 2,
    friendshipRequirement: { de: 'Entsorge eine Imperator Karte.', en: 'Verliere eine Imperator Karte.' },
    friendshipReward: { de: '{resource:water}', en: '{resource:water}' },
    allianceRequirement: {
      de: 'Verliere zwei Imperator Einfluss.',
      en: 'Verliere zwei Einfluss auf der Imperator Leiste.',
    },
    allianceReward: { de: '{resource:victory-point}', en: '{resource:victory-point}' },
  },
];
