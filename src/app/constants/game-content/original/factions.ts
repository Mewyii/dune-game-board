import { Faction } from '../../../models';

export const factionsOriginal: Faction[] = [
  {
    title: { de: 'fremen', en: 'fremen' },
    type: 'fremen',
    position: {
      marginTop: 1670,
      marginLeft: 15,
    },
    actionFields: [
      {
        title: { de: 'zähe krieger', en: 'hardy warriors' },
        actionType: 'fremen',
        costs: [{ type: 'water' }],
        rewards: [{ type: 'troop', amount: 2 }, { type: 'combat' }],
        pathToImage: 'assets/images/action-backgrounds/fremen_warriors_2.png',
      },
      {
        title: { de: 'destillanzüge', en: 'stillsuits' },
        actionType: 'fremen',
        rewards: [{ type: 'water' }, { type: 'combat' }],
        pathToImage: 'assets/images/action-backgrounds/stillsuits.png',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Fremen.png',
    primaryColor: 'rgb(42, 72, 133)',
    secondaryColor: '#191f2eb8',
    hasScoreBoard: true,
    influenceRewards: {
      2: [
        {
          type: 'victory-point',
        },
      ],
      4: [
        {
          type: 'water',
        },
      ],
    },
  },
  {
    title: { de: 'bene gesserit', en: 'bene gesserit' },
    type: 'bene',
    position: {
      marginTop: 1170,
      marginLeft: 15,
    },
    actionFields: [
      {
        title: { de: 'selektive züchtung', en: 'selective breeding' },
        actionType: 'bene',
        costs: [{ type: 'spice', amount: 2 }],
        rewards: [{ type: 'card-draw', amount: 2 }, { type: 'card-destroy' }],
        pathToImage: 'assets/images/action-backgrounds/bene_gesserit_4.png',
      },
      {
        title: { de: 'geheimnisse', en: 'secrets' },
        actionType: 'bene',
        rewards: [{ type: 'intrigue' }, { type: 'intrigue-draw' }],
        pathToImage: 'assets/images/action-backgrounds/bene_gesserit.png',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Bene_Gesserit.png',
    primaryColor: 'rgb(84, 78, 97)',
    secondaryColor: '#1f192eb8',
    hasScoreBoard: true,
    influenceRewards: {
      2: [
        {
          type: 'victory-point',
        },
      ],
      4: [
        {
          type: 'intrigue',
        },
      ],
    },
  },
  {
    title: { de: 'raumgilde', en: 'spacing guild' },
    type: 'guild',
    position: {
      marginTop: 670,
      marginLeft: 15,
    },
    actionFields: [
      {
        title: { de: 'heighliner', en: 'heighliner' },
        actionType: 'guild',
        costs: [{ type: 'spice', amount: 6 }],
        rewards: [{ type: 'water' }, { type: 'water' }, { type: 'troop', amount: 5 }, { type: 'combat' }],
        pathToImage: 'assets/images/action-backgrounds/highliner.png',
      },
      {
        title: { de: 'faltraum', en: 'foldspace' },
        actionType: 'guild',
        rewards: [{ type: 'foldspace' }],
        pathToImage: 'assets/images/action-backgrounds/foldspace.png',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Spacing_Guild.png',
    primaryColor: 'rgb(128, 34, 34)',
    secondaryColor: '#2e1919b8',
    hasScoreBoard: true,
    influenceRewards: {
      2: [
        {
          type: 'victory-point',
        },
      ],
      4: [
        {
          type: 'solari',
          amount: 3,
        },
      ],
    },
  },
  {
    title: { de: 'imperator', en: 'emperor' },
    type: 'emperor',
    position: {
      marginTop: 170,
      marginLeft: 15,
    },
    actionFields: [
      {
        title: { de: 'verschwörung', en: 'conspire' },
        actionType: 'emperor',
        costs: [{ type: 'spice', amount: 4 }],
        rewards: [{ type: 'intrigue' }, { type: 'troop', amount: 2 }, { type: 'solari', amount: 5 }],
        pathToImage: 'assets/images/action-backgrounds/conspiracy.png',
      },
      {
        title: { de: 'wohlstand', en: 'wealth' },
        actionType: 'emperor',
        rewards: [{ type: 'solari', amount: 2 }],
        pathToImage: 'assets/images/action-backgrounds/wealth.png',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Empire.png',
    primaryColor: 'rgb(69, 69, 69)',
    secondaryColor: '#1e1e1eb8',
    hasScoreBoard: true,
    influenceRewards: {
      2: [
        {
          type: 'victory-point',
        },
      ],
      4: [
        {
          type: 'troop',
          amount: 2,
        },
      ],
    },
  },
  {
    title: { de: 'landsraad', en: 'landsraad' },
    type: 'landsraad',
    position: {
      marginTop: 170,
      marginLeft: 610,
      width: 910,
    },
    actionFields: [
      {
        title: { de: 'hoher rat', en: 'high council' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 5 }],
        rewards: [{ type: 'council-seat-large', amount: 2, iconHeight: 55 }],
        customWidth: 'fit-content',
        pathToImage: 'assets/images/action-backgrounds/empire_ambassador.png',
      },
      {
        title: { de: 'rednersaal', en: 'hall of oratory' },
        actionType: 'landsraad',
        rewards: [{ type: 'troop' }, { type: 'persuasion', amount: 1 }],
        pathToImage: 'assets/images/action-backgrounds/spaceship_landing.png',
      },
      {
        title: { de: 'mentat', en: 'mentat' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 2 }],
        rewards: [{ type: 'card-draw' }, { type: 'mentat', iconHeight: 50 }],
        pathToImage: 'assets/images/action-backgrounds/mentat_4.png',
      },
      {
        title: { de: 'truppen sammeln', en: 'rally troops' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 4 }],
        rewards: [{ type: 'troop', amount: 4 }],
        pathToImage: 'assets/images/action-backgrounds/troops_3.png',
      },
      {
        title: { de: 'schwertmeister', en: 'swordmaster' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 8 }],
        rewards: [{ type: 'sword-master', iconHeight: 50 }],
        pathToImage: 'assets/images/action-backgrounds/swordmaster_2.png',
        customWidth: '135px',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Landsraad.png',
    primaryColor: 'rgb(72, 89, 71)',
    secondaryColor: '#192e19b8',
  },
  {
    title: { de: 'mafea', en: 'choam' },
    type: 'choam',
    position: {
      marginTop: 170,
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
          { type: 'helper-trade-horizontal', iconHeight: 30, width: 50 },
          { type: 'helper-trade-horizontal', iconHeight: 30, width: 50 },
          { type: 'helper-trade-horizontal', iconHeight: 30, width: 50 },
          { type: 'helper-trade-horizontal', iconHeight: 30, width: 50 },
          { type: 'solari', amount: 6, width: 50 },
          { type: 'solari', amount: 8, width: 50 },
          { type: 'solari', amount: 10, width: 50 },
          { type: 'solari', amount: 12, width: 50 },
        ],
        pathToImage: 'assets/images/action-backgrounds/spaceship_fleet.png',
        customWidth: '220px',
        noRowGap: true,
      },
      {
        title: { de: 'abkommen treffen', en: 'secure contract' },
        actionType: 'spice',
        rewards: [{ type: 'solari', amount: 3 }],
        pathToImage: 'assets/images/action-backgrounds/spice_port.png',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Choam.png',
    primaryColor: 'rgb(143, 69, 9)',
    secondaryColor: '#2e2419b8',
  },
];
