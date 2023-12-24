import { LanguageString, Reward } from '../models';

export interface House {
  name: LanguageString;
  colorPrimary: string;
  colorSecondary: string;
  persuasion: number;
  friendshipRequirement?: Reward[];
  customFriendshipRequirement?: LanguageString;
  friendshipReward?: Reward[];
  customFriendshipReward?: LanguageString;
  allianceRequirement?: Reward[];
  customAllianceRequirement?: LanguageString;
  allianceReward?: Reward[];
  customAllianceReward?: LanguageString;
}

export const minorHouses: House[] = [
  {
    name: { de: 'ginaz', en: 'ginaz' },
    colorPrimary: '#ffffff',
    colorSecondary: '#8a6b21',
    persuasion: 4,
    customFriendshipRequirement: { de: 'Habe deinen Schwertmeister.', en: 'Have your swordmaster.' },
    friendshipReward: [{ type: 'card-destroy' }, { type: 'troops' }],
    customAllianceRequirement: { de: 'Habe nur einen Agent auf Feldern.', en: 'Only have one agent on board spaces.' },
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'heiron', en: 'heiron' },
    colorPrimary: '#b59126',
    colorSecondary: '#6dbda6',
    persuasion: 4,
    customFriendshipRequirement: { de: 'Habe einen Sitz im hohen Rat.', en: 'Have a high council seat.' },
    friendshipReward: [{ type: 'card-round-start' }],
    allianceRequirement: [{ type: 'conviction', amount: 6 }],
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'metulli', en: 'metulli' },
    colorPrimary: '#e0d6b8',
    colorSecondary: '#8a0f0f',
    persuasion: 2,
    customFriendshipRequirement: {
      de: 'Habe zwei oder weniger {resource:troops} in deiner Garnison und in der Schlacht.',
      en: 'Habe zwei oder weniger {resource:troops} in deiner Garnison und in der Schlacht.',
    },
    friendshipReward: [{ type: 'currency', amount: 3 }],
    customAllianceRequirement: {
      de: 'Habe keinen Agenten auf einem Kampffeld.',
      en: 'Habe keinen Agenten auf einem Kampffeld.',
    },
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'plana', en: 'plana' },
    colorPrimary: '#8d2e8f',
    colorSecondary: '#19181a',
    persuasion: 2,
    customFriendshipRequirement: {
      de: '{resource:agent} auf 2 oder mehr: Imperiales Becken, Sietch Tabr, Destillanzüge, Forschungszentrum',
      en: '{resource:agent} auf 2 oder mehr: Imperiales Becken, Sietch Tabr, Destillanzüge, Forschungszentrum',
    },
    friendshipReward: [{ type: 'card-round-start' }, { type: 'currency' }],
    allianceRequirement: [{ type: 'water' }, { type: 'water' }],
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'ordos', en: 'ordos' },
    colorPrimary: '#adadad',
    colorSecondary: '#166e10',
    persuasion: 2,
    customFriendshipRequirement: {
      de: '{resource:agent} auf 2 oder mehr: Handelsrechte, Carthag, Expedition, Aufrüstung',
      en: '{resource:agent} auf 2 oder mehr: Handelsrechte, Carthag, Expedition, Aufrüstung',
    },
    friendshipReward: [{ type: 'currency', amount: 3 }],
    customAllianceRequirement: { de: 'Verliere 1 Tech-Plättchen.', en: 'Verliere 1 Tech-Plättchen.' },
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'wallach', en: 'wallach' },
    colorPrimary: '#8f8f8f',
    colorSecondary: '#38160e',
    persuasion: 2,
    customFriendshipRequirement: {
      de: '{resource:agent} auf 2 oder mehr: Sietch Tabr, Arrakeen, Carthag, Verborgenes Wissen',
      en: '{resource:agent} auf 2 oder mehr: Sietch Tabr, Arrakeen, Carthag, Verborgenes Wissen',
    },
    friendshipReward: [{ type: 'water' }, { type: 'card-destroy' }],
    allianceRequirement: [{ type: 'spice', amount: 3 }],
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'novebruns', en: 'novebruns' },
    colorPrimary: '#216dd9',
    colorSecondary: '#171f59',
    persuasion: 2,
    customFriendshipRequirement: {
      de: '{resource:agent} auf 2 oder mehr: Imperiales Becken, Hagga-Becken, Die Große Ebene, Beziehungen',
      en: '{resource:agent} auf 2 oder mehr: Imperiales Becken, Hagga-Becken, Die Große Ebene, Beziehungen',
    },
    customFriendshipReward: { de: '3 Tech-Agenten', en: '3 Tech-Agenten' },
    allianceRequirement: [{ type: 'currency', amount: 5 }],
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'fenring', en: 'fenring' },
    colorPrimary: '#a10202',
    colorSecondary: '#080808',
    persuasion: 4,
    customFriendshipRequirement: {
      de: '{resource:agent} auf: Verschwörung',
      en: '{resource:agent} auf: Verschwörung',
    },
    friendshipReward: [{ type: 'currency', amount: 3 }],
    customAllianceRequirement: {
      de: 'Besitze 4 oder mehr {resource:intrigue}.',
      en: 'Besitze 4 oder mehr {resource:intrigue}',
    },
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'tantor', en: 'tantor' },
    colorPrimary: '#ab6f6f',
    colorSecondary: '#3d3737',
    persuasion: 2,
    customFriendshipRequirement: {
      de: '{resource:agent} auf: Verborgenes Wissen',
      en: '{resource:agent} auf: Verborgenes Wissen',
    },
    friendshipReward: [{ type: 'spice' }, { type: 'foldspace' }],
    customAllianceRequirement: { de: 'Verliere einen Sitz im hohen Rat.', en: 'Verliere einen Sitz im hohen Rat' },
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'wayku', en: 'wayku' },
    colorPrimary: '#636363',
    colorSecondary: '#0f0f0f',
    persuasion: 2,
    customFriendshipRequirement: {
      de: '{resource:agent} auf: Heighliner',
      en: '{resource:agent} auf: Heighliner',
    },
    friendshipReward: [{ type: 'intrigue' }, { type: 'troops' }],
    customAllianceRequirement: { de: 'Verliere einen Sitz im hohen Rat.', en: 'Verliere einen Sitz im hohen Rat.' },
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'mcnaught', en: 'mcnaught' },
    colorPrimary: '#1128bd',
    colorSecondary: '#b3b3b3',
    persuasion: 4,
    friendshipRequirement: [
      {
        type: 'faction-influence-choice-down',
      },
    ],
    friendshipReward: [{ type: 'troops', amount: 2 }],
    customAllianceRequirement: {
      de: 'Habe zwei oder weniger Einfluss bei allen Fraktionen.',
      en: 'Habe zwei oder weniger Einfluss bei allen Fraktionen.',
    },
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'fazeel', en: 'fazeel' },
    colorPrimary: '#7b52d9',
    colorSecondary: '#730633',
    persuasion: 2,
    customFriendshipRequirement: { de: 'Entsorge eine Fremen Karte.', en: 'Verliere eine Fremen Karte.' },
    friendshipReward: [{ type: 'intrigue' }, { type: 'currency' }],
    customAllianceRequirement: {
      de: 'Verliere einen Fremen Einfluss.',
      en: 'Verliere einen Einfluss auf der Fremen Leiste.',
    },
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'varrik', en: 'varrik' },
    colorPrimary: '#b36205',
    colorSecondary: '#5a90a6',
    persuasion: 2,
    customFriendshipRequirement: { de: 'Entsorge eine Bene Gesserit Karte.', en: 'Verliere eine Bene Gesserit Karte.' },
    friendshipReward: [{ type: 'card-destroy' }, { type: 'card-round-start' }],
    customAllianceRequirement: {
      de: 'Verliere einen Bene Gesserit Einfluss.',
      en: 'Verliere einen Einfluss auf der Bene Gesserit Leiste.',
    },
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'jaederan', en: 'jaederan' },
    colorPrimary: '#0ec764',
    colorSecondary: '#381a12',
    persuasion: 2,
    customFriendshipRequirement: { de: 'Entsorge eine Raumgilden Karte.', en: 'Verliere eine Raumgilden Karte.' },
    friendshipReward: [{ type: 'troops', amount: 3 }],
    customAllianceRequirement: {
      de: 'Verliere einen Raumgilden Einfluss.',
      en: 'Verliere einen Einfluss auf der Raumgilden Leiste.',
    },
    allianceReward: [{ type: 'victory-point' }],
  },
  {
    name: { de: 'taligari', en: 'taligari' },
    colorPrimary: '#786577',
    colorSecondary: '#9e2898',
    persuasion: 2,
    customFriendshipRequirement: { de: 'Entsorge eine Imperator Karte.', en: 'Verliere eine Imperator Karte.' },
    friendshipReward: [{ type: 'water' }, { type: 'water' }],
    customAllianceRequirement: {
      de: 'Verliere einen Imperator Einfluss.',
      en: 'Verliere einen Einfluss auf der Imperator Leiste.',
    },
    allianceReward: [{ type: 'victory-point' }],
  },
];
