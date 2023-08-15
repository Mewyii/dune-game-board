import { Faction } from '../models';

export const factionsCustomAdvanced: Faction[] = [
  {
    title: { de: 'fremen', en: 'fremen' },
    type: 'fremen',
    position: {
      marginBottom: 16,
      marginLeft: 16,
    },
    actionFields: [
      {
        title: { de: 'wüstenkämpfer', en: 'hardy warriors' },
        actionType: 'fremen',
        costs: [{ type: 'water' }],
        rewards: [{ type: 'troops', amount: 2 }, { type: 'troop-insert' }],
        pathToImage: 'assets/images/action-backgrounds/fremen_warriors_2.png',
        isBattlefield: true,
      },
      {
        title: { de: 'destillanzüge', en: 'stillsuits' },
        actionType: 'fremen',
        rewards: [{ type: 'water' }],
        pathToImage: 'assets/images/action-backgrounds/stillsuits.png',
        isBattlefield: true,
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Fremen.png',
    primaryColor: 'rgb(52, 86, 153)',
    secondaryColor: '#191f2eb8',
    hasScoreBoard: true,
    levelTwoReward: [
      {
        type: 'troops',
        amount: 2,
      },
    ],
    levelFourReward: [
      {
        type: 'victory-point',
      },
    ],
  },
  {
    title: { de: 'bene gesserit', en: 'bene gesserit' },
    type: 'bene',
    position: {
      marginBottom: 510,
      marginLeft: 16,
    },
    actionFields: [
      {
        title: { de: 'verborgenes wissen', en: 'hidden knowledge' },
        actionType: 'bene',
        costs: [{ type: 'spice', amount: 2 }],
        rewards: [{ type: 'card-draw', amount: 3 }, { type: 'card-discard' }, { type: 'intrigue-draw' }],
        pathToImage: 'assets/images/action-backgrounds/bene_gesserit_4.png',
        isBattlefield: false,
      },
      {
        title: { de: 'geheimes abkommen', en: 'secret agreement' },
        actionType: 'bene',
        rewards: [{ type: 'intrigue' }, { type: 'card-destroy' }],
        pathToImage: 'assets/images/action-backgrounds/bene_gesserit.png',
        isBattlefield: false,
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Bene_Gesserit.png',
    primaryColor: 'rgb(102, 90, 125)',
    secondaryColor: '#1f192eb8',
    hasScoreBoard: true,
    levelTwoReward: [
      {
        type: 'card-draw-or-destroy',
      },
    ],
    levelFourReward: [
      {
        type: 'victory-point',
      },
    ],
  },
  {
    title: { de: 'raumgilde', en: 'spacing guild' },
    type: 'guild',
    position: {
      marginBottom: 1010,
      marginLeft: 16,
    },
    actionFields: [
      {
        title: { de: 'heighliner', en: 'heighliner' },
        actionType: 'guild',
        costs: [{ type: 'spice', amount: 6 }],
        rewards: [{ type: 'water' }, { type: 'water' }, { type: 'troops', amount: 4 }, { type: 'troop-insert' }],
        pathToImage: 'assets/images/action-backgrounds/highliner.png',
        isBattlefield: true,
      },
      {
        title: { de: 'expedition', en: 'expedition' },
        actionType: 'guild',
        rewards: [{ type: 'foldspace' }, { type: 'tech-reduced' }],
        pathToImage: 'assets/images/action-backgrounds/foldspace.png',
        isBattlefield: false,
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Spacing_Guild.png',
    primaryColor: 'rgb(135, 36, 36)',
    secondaryColor: '#2e1919b8',
    hasScoreBoard: true,
    levelTwoReward: [
      {
        type: 'currency',
        amount: 3,
      },
    ],
    levelFourReward: [
      {
        type: 'victory-point',
      },
    ],
  },
  {
    title: { de: 'imperator', en: 'emperor' },
    type: 'imperium',
    position: {
      marginBottom: 1515,
      marginLeft: 16,
    },
    actionFields: [
      {
        title: { de: 'verschwörung', en: 'conspiracy' },
        actionType: 'imperium',
        costs: [{ type: 'spice', amount: 4 }],
        rewards: [
          { type: 'intrigue' },
          { type: 'intrigue' },
          { type: 'currency', amount: 3 },
          { type: 'troops', amount: 2 },
        ],
        pathToImage: 'assets/images/action-backgrounds/conspiracy.png',
        isBattlefield: false,
      },
      {
        title: { de: 'imperiale gunst', en: 'imperial favor' },
        actionType: 'imperium',
        rewards: [{ type: 'currency', amount: 3 }],
        pathToImage: 'assets/images/action-backgrounds/wealth.png',
        isBattlefield: false,
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Empire.png',
    primaryColor: 'rgb(85 85 85)',
    secondaryColor: '#262626b8',
    hasScoreBoard: true,
    levelTwoReward: [
      {
        type: 'troops',
      },
      {
        type: 'troop-insert',
      },
    ],
    levelFourReward: [
      {
        type: 'victory-point',
      },
    ],
  },
  {
    title: { de: 'landsraad', en: 'landsraad' },
    type: 'landsraad',
    position: {
      marginBottom: 1515,
      marginLeft: 585,
      width: 650,
    },
    actionFields: [
      {
        title: { de: 'hoher rat', en: 'high council' },
        actionType: 'diplomacy',
        costs: [{ type: 'currency', amount: 5 }],
        rewards: [{ type: 'council-seat-small', amount: 2, iconHeight: 110 }],
        customWidth: 'fit-content',
        pathToImage: 'assets/images/action-backgrounds/empire_ambassador.png',
        isBattlefield: false,
      },
      {
        title: { de: 'beziehungen', en: 'relations' },
        actionType: 'diplomacy',
        rewards: [{ type: 'card-draw-or-destroy' }, { type: 'conviction', amount: 1 }],
        pathToImage: 'assets/images/action-backgrounds/wealth_2.png',
        isBattlefield: false,
      },
      {
        title: { de: 'mentat', en: 'mentat' },
        actionType: 'diplomacy',
        costs: [{ type: 'currency', amount: 3 }],
        rewards: [
          { type: 'card-draw' },
          { type: 'separator', width: 10, iconHeight: 50 },
          { type: 'troops', amount: 2 },
          { type: 'mentat', iconHeight: 50 },
        ],
        pathToImage: 'assets/images/action-backgrounds/mentat_4.png',
        isBattlefield: false,
        hasRewardOptions: true,
        customWidth: '125px',
      },
      {
        title: { de: 'schwertmeister', en: 'swordmaster' },
        actionType: 'diplomacy',
        costs: [{ type: 'currency', amount: 10 }],
        rewards: [{ type: 'sword-master', iconHeight: 95 }],
        pathToImage: 'assets/images/action-backgrounds/swordmaster_2.png',
        isBattlefield: false,
        customWidth: 'fit-content',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Landsraad.png',
    primaryColor: 'rgb(77, 94, 75)',
    secondaryColor: '#192e19b8',
  },
  {
    title: { de: 'mafea', en: 'choam' },
    type: 'choam',
    position: {
      marginBottom: 1515,
      marginLeft: 1340,
      width: 320,
    },
    actionFields: [
      {
        title: { de: 'spice-verkauf', en: 'spice sale' },
        actionType: 'spice',
        rewards: [
          { type: 'spice', amount: 2, width: 45 },
          { type: 'spice', amount: 3, width: 45 },
          { type: 'spice', amount: 4, width: 45 },
          { type: 'helper-arrow-down', iconHeight: 30, width: 45 },
          { type: 'helper-arrow-down', iconHeight: 30, width: 45 },
          { type: 'helper-arrow-down', iconHeight: 30, width: 45 },
          { type: 'currency', amount: 7, width: 45 },
          { type: 'currency', amount: 9, width: 45 },
          { type: 'currency', amount: 11, width: 45 },
        ],
        pathToImage: 'assets/images/action-backgrounds/spaceship_fleet.png',
        isBattlefield: false,
        hasRewardOptions: true,
        customWidth: '150px',
      },
      {
        title: { de: 'handelsrechte', en: 'trade rights' },
        actionType: 'spice',
        rewards: [{ type: 'currency', amount: 3 }, { type: 'tech' }],
        pathToImage: 'assets/images/action-backgrounds/spice_port.png',
        isBattlefield: false,
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Choam.png',
    primaryColor: 'rgb(150, 73, 9)',
    secondaryColor: '#2e2419b8',
  },
];
