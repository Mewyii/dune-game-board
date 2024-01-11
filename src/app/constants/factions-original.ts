import { Faction } from '../models';

export const factionsOriginal: Faction[] = [
  {
    title: { de: 'fremen', en: 'fremen' },
    type: 'fremen',
    position: {
      marginBottom: 16,
      marginLeft: 16,
    },
    actionFields: [
      {
        title: { de: 'zähe krieger', en: 'hardy warriors' },
        actionType: 'fremen',
        costs: [{ type: 'water' }],
        rewards: [{ type: 'troop', amount: 2 }, { type: 'battle-insert' }],
        pathToImage: 'assets/images/action-backgrounds/fremen_warriors_2.png',
        isBattlefield: true,
      },
      {
        title: { de: 'destillanzüge', en: 'stillsuits' },
        actionType: 'fremen',
        rewards: [{ type: 'water' }, { type: 'battle-insert' }],
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
        type: 'victory-point',
      },
    ],
    levelFourReward: [
      {
        type: 'water',
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
        title: { de: 'selektive züchtung', en: 'selective breeding' },
        actionType: 'bene',
        costs: [{ type: 'spice', amount: 2 }],
        rewards: [{ type: 'card-draw', amount: 2 }, { type: 'card-destroy' }],
        pathToImage: 'assets/images/action-backgrounds/bene_gesserit_4.png',
        isBattlefield: false,
      },
      {
        title: { de: 'geheimnisse', en: 'secrets' },
        actionType: 'bene',
        rewards: [{ type: 'intrigue' }, { type: 'intrigue-draw' }],
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
        type: 'victory-point',
      },
    ],
    levelFourReward: [
      {
        type: 'intrigue',
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
        rewards: [{ type: 'water' }, { type: 'water' }, { type: 'troop', amount: 5 }, { type: 'battle-insert' }],
        pathToImage: 'assets/images/action-backgrounds/highliner.png',
        isBattlefield: true,
      },
      {
        title: { de: 'faltraum', en: 'foldspace' },
        actionType: 'guild',
        rewards: [{ type: 'foldspace' }],
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
        type: 'victory-point',
      },
    ],
    levelFourReward: [
      {
        type: 'currency',
        amount: 3,
      },
    ],
  },
  {
    title: { de: 'imperator', en: 'emperor' },
    type: 'emperor',
    position: {
      marginBottom: 1515,
      marginLeft: 16,
    },
    actionFields: [
      {
        title: { de: 'verschwörung', en: 'conspire' },
        actionType: 'emperor',
        costs: [{ type: 'spice', amount: 4 }],
        rewards: [{ type: 'intrigue' }, { type: 'troop', amount: 2 }, { type: 'currency', amount: 5 }],
        pathToImage: 'assets/images/action-backgrounds/conspiracy.png',
        isBattlefield: false,
      },
      {
        title: { de: 'wohlstand', en: 'wealth' },
        actionType: 'emperor',
        rewards: [{ type: 'currency', amount: 2 }],
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
        type: 'victory-point',
      },
    ],
    levelFourReward: [
      {
        type: 'troop',
        amount: 2,
      },
    ],
  },
  {
    title: { de: 'landsraad', en: 'landsraad' },
    type: 'landsraad',
    position: {
      marginBottom: 1515,
      marginLeft: 615,
      width: 905,
    },
    actionFields: [
      {
        title: { de: 'hoher rat', en: 'high council' },
        actionType: 'landsraad',
        costs: [{ type: 'currency', amount: 5 }],
        rewards: [{ type: 'council-seat-large', amount: 2, iconHeight: 55 }],
        customWidth: 'fit-content',
        pathToImage: 'assets/images/action-backgrounds/empire_ambassador.png',
        isBattlefield: false,
      },
      {
        title: { de: 'rednersaal', en: 'hall of oratory' },
        actionType: 'landsraad',
        rewards: [{ type: 'troop' }, { type: 'persuasion', amount: 1 }],
        pathToImage: 'assets/images/action-backgrounds/spaceship_landing.png',
        isBattlefield: false,
      },
      {
        title: { de: 'mentat', en: 'mentat' },
        actionType: 'landsraad',
        costs: [{ type: 'currency', amount: 2 }],
        rewards: [{ type: 'card-draw' }, { type: 'mentat', iconHeight: 50 }],
        pathToImage: 'assets/images/action-backgrounds/mentat_4.png',
        isBattlefield: false,
      },
      {
        title: { de: 'truppen sammeln', en: 'rally troops' },
        actionType: 'landsraad',
        costs: [{ type: 'currency', amount: 4 }],
        rewards: [{ type: 'troop', amount: 4 }],
        pathToImage: 'assets/images/action-backgrounds/troops_3.png',
        isBattlefield: false,
        hasRewardOptions: true,
        customWidth: '200px',
      },
      {
        title: { de: 'schwertmeister', en: 'swordmaster' },
        actionType: 'landsraad',
        costs: [{ type: 'currency', amount: 8 }],
        rewards: [{ type: 'sword-master', iconHeight: 50 }],
        pathToImage: 'assets/images/action-backgrounds/swordmaster_2.png',
        isBattlefield: false,
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
      marginLeft: 1650,
      width: 400,
    },
    actionFields: [
      {
        title: { de: 'melange verkaufen', en: 'sell melange' },
        actionType: 'spice',
        rewards: [
          { type: 'spice', amount: 2, width: 50 },
          { type: 'spice', amount: 3, width: 50 },
          { type: 'spice', amount: 4, width: 50 },
          { type: 'spice', amount: 5, width: 50 },
          { type: 'helper-arrow-down', iconHeight: 30, width: 50 },
          { type: 'helper-arrow-down', iconHeight: 30, width: 50 },
          { type: 'helper-arrow-down', iconHeight: 30, width: 50 },
          { type: 'helper-arrow-down', iconHeight: 30, width: 50 },
          { type: 'currency', amount: 6, width: 50 },
          { type: 'currency', amount: 8, width: 50 },
          { type: 'currency', amount: 10, width: 50 },
          { type: 'currency', amount: 12, width: 50 },
        ],
        pathToImage: 'assets/images/action-backgrounds/spaceship_fleet.png',
        isBattlefield: false,
        hasRewardOptions: true,
        customWidth: '220px',
      },
      {
        title: { de: 'abkommen treffen', en: 'secure contract' },
        actionType: 'spice',
        rewards: [{ type: 'currency', amount: 3 }],
        pathToImage: 'assets/images/action-backgrounds/spice_port.png',
        isBattlefield: false,
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Choam.png',
    primaryColor: 'rgb(150, 73, 9)',
    secondaryColor: '#2e2419b8',
  },
];
