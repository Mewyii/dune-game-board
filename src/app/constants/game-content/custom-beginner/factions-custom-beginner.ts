import { Faction } from '../../../models';

export const factionsCustomBeginner: Faction[] = [
  {
    title: { de: 'fremen', en: 'fremen' },
    type: 'fremen',
    position: {
      marginTop: 1670,
      marginLeft: 16,
    },
    actionFields: [
      {
        title: { de: 'fremenkrieger', en: 'fremen warriors' },
        actionType: 'fremen',
        costs: [{ type: 'water' }],
        rewards: [{ type: 'troop', amount: 2 }, { type: 'combat' }],
        pathToImage: 'assets/images/action-backgrounds/fremen_warriors_2.png',
      },
      {
        title: { de: 'wüstenausrüstung', en: 'desert equipment' },
        actionType: 'fremen',
        rewards: [{ type: 'water' }],
        pathToImage: 'assets/images/action-backgrounds/stillsuits.png',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Fremen.png',
    primaryColor: 'rgb(52, 86, 153)',
    secondaryColor: '#191f2eb8',
    hasScoreBoard: true,
    levelTwoReward: [
      {
        type: 'card-destroy',
      },
      {
        type: 'troop',
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
      marginTop: 1170,
      marginLeft: 16,
    },
    actionFields: [
      {
        title: { de: 'verborgenes wissen', en: 'hidden knowledge' },
        actionType: 'bene',
        costs: [{ type: 'spice', amount: 2 }],
        rewards: [{ type: 'card-draw', amount: 2 }, { type: 'card-discard' }, { type: 'intrigue' }],
        pathToImage: 'assets/images/action-backgrounds/bene_gesserit_4.png',
      },
      {
        title: { de: 'geistesausbildung', en: 'mind training' },
        actionType: 'bene',
        rewards: [{ type: 'card-draw' }, { type: 'card-destroy' }],
        pathToImage: 'assets/images/action-backgrounds/book.png',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Bene_Gesserit.png',
    primaryColor: 'rgb(102, 90, 125)',
    secondaryColor: '#1f192eb8',
    hasScoreBoard: true,
    levelTwoReward: [
      {
        type: 'intrigue',
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
      marginTop: 670,
      marginLeft: 16,
    },
    actionFields: [
      {
        title: { de: 'heighliner', en: 'heighliner' },
        actionType: 'guild',
        costs: [{ type: 'spice', amount: 4 }],
        rewards: [{ type: 'card-draw' }, { type: 'troop', amount: 4 }, { type: 'combat' }],
        pathToImage: 'assets/images/action-backgrounds/highliner.png',
      },
      {
        title: { de: 'expedition', en: 'expedition' },
        actionType: 'guild',
        rewards: [{ type: 'currency' }, { type: 'intrigue' }],
        pathToImage: 'assets/images/action-backgrounds/foldspace.png',
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
    type: 'emperor',
    position: {
      marginTop: 170,
      marginLeft: 16,
    },
    actionFields: [
      {
        title: { de: 'verschwörung', en: 'conspiracy' },
        actionType: 'emperor',
        costs: [{ type: 'spice', amount: 4 }],
        rewards: [{ type: 'intrigue' }, { type: 'intrigue' }, { type: 'currency', amount: 3 }, { type: 'troop', amount: 2 }],
        pathToImage: 'assets/images/action-backgrounds/conspiracy.png',
      },
      {
        title: { de: 'imperiale gunst', en: 'imperial favor' },
        actionType: 'emperor',
        rewards: [{ type: 'currency', amount: 3 }, { type: 'intrigue-draw' }],
        pathToImage: 'assets/images/action-backgrounds/wealth.png',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Empire.png',
    primaryColor: 'rgb(85 85 85)',
    secondaryColor: '#262626b8',
    hasScoreBoard: true,
    levelTwoReward: [
      {
        type: 'troop',
      },
      {
        type: 'combat',
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
      marginTop: 170,
      marginLeft: 580,
      width: 660,
    },
    actionFields: [
      {
        title: { de: 'mentat', en: 'mentat' },
        actionType: 'landsraad',
        costs: [{ type: 'currency', amount: 3 }],
        rewards: [
          { type: 'card-draw' },
          { type: 'separator', width: 10, iconHeight: 50 },
          { type: 'troop', amount: 2 },
          { type: 'mentat', iconHeight: 50 },
        ],
        pathToImage: 'assets/images/action-backgrounds/mentat_4.png',

        isNonBlockingField: true,
        hasRewardOptions: true,
        customWidth: '125px',
        noGap: true,
      },
      {
        title: { de: 'schwertmeister', en: 'swordmaster' },
        actionType: 'landsraad',
        costs: [{ type: 'currency', amount: 10 }],
        rewards: [{ type: 'sword-master', iconHeight: 60 }],
        pathToImage: 'assets/images/action-backgrounds/swordmaster_2.png',

        hasRewardOptions: false,
        customWidth: '135px',
      },
      {
        title: { de: 'beziehungen', en: 'relations' },
        actionType: 'landsraad',
        rewards: [{ type: 'persuasion', amount: 1 }, { type: 'intrigue' }],
        pathToImage: 'assets/images/action-backgrounds/wealth_2.png',
      },
      {
        title: { de: 'hoher rat', en: 'high council' },
        actionType: 'landsraad',
        costs: [{ type: 'currency', amount: 7 }],
        rewards: [{ type: 'council-seat-small', amount: 3, iconHeight: 110 }],
        customWidth: 'fit-content',
        pathToImage: 'assets/images/action-backgrounds/empire_ambassador.png',
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
      marginTop: 170,
      marginLeft: 1345,
      width: 320,
    },
    actionFields: [
      {
        title: { de: 'Spice Handel', en: 'Spice Trade' },
        actionType: 'landsraad',
        rewards: [
          { type: 'spice', amount: 1, width: 45 },
          { type: 'spice', amount: 2, width: 45 },
          { type: 'spice', amount: 3, width: 45 },
          { type: 'helper-arrow-down', iconHeight: 30, width: 45 },
          { type: 'helper-arrow-down', iconHeight: 30, width: 45 },
          { type: 'helper-arrow-down', iconHeight: 30, width: 45 },
          { type: 'currency', amount: 5, width: 45 },
          { type: 'currency', amount: 7, width: 45 },
          { type: 'currency', amount: 9, width: 45 },
        ],
        pathToImage: 'assets/images/action-backgrounds/spaceship_fleet.png',

        hasRewardOptions: true,
        customWidth: '150px',
        noGap: true,
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Choam.png',
    primaryColor: 'rgb(150, 73, 9)',
    secondaryColor: '#2e2419b8',
  },
];
