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
        title: { de: 'Die Wüste Verstehen', en: 'Desert Knowledge' },
        actionType: 'fremen',
        costs: [{ type: 'spice', amount: 1 }],
        rewards: [{ type: 'card-draw' }, { type: 'card-draw-or-destroy' }, { type: 'combat' }],
        pathToImage: 'assets/images/action-backgrounds/fremen_warriors_2.png',
      },
      {
        title: { de: 'Wüstenausrüstung', en: 'Desert Equipment' },
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
        title: { de: 'Hellsicht', en: 'Truthsay' },
        actionType: 'bene',
        costs: [{ type: 'spice', amount: 2 }],
        rewards: [{ type: 'card-draw', amount: 2 }, { type: 'card-discard' }, { type: 'agent-lift' }],
        pathToImage: 'assets/images/action-backgrounds/bene_gesserit_4.png',
      },
      {
        title: { de: 'Geistesausbildung', en: 'Mind Training' },
        actionType: 'bene',
        rewards: [{ type: 'card-draw' }, { type: 'focus' }],
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
        title: { de: 'Heighliner', en: 'Heighliner' },
        actionType: 'guild',
        costs: [{ type: 'spice', amount: 4 }],
        rewards: [
          { type: 'card-draw', amount: 2 },
          { type: 'troop', amount: 4 },
        ],
        pathToImage: 'assets/images/action-backgrounds/highliner.png',
      },
      {
        title: { de: 'Gildenabkommen', en: 'Guild Contract' },
        actionType: 'guild',
        rewards: [{ type: 'solari', amount: 3 }],
        pathToImage: 'assets/images/action-backgrounds/guild_navigators.png',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Spacing_Guild.png',
    primaryColor: 'rgb(135, 36, 36)',
    secondaryColor: '#2e1919b8',
    hasScoreBoard: true,
    levelTwoReward: [
      {
        type: 'foldspace',
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
        title: { de: 'Verschwörung', en: 'Conspiracy' },
        actionType: 'emperor',
        costs: [{ type: 'spice', amount: 3 }],
        rewards: [{ type: 'intrigue' }, { type: 'intrigue' }, { type: 'troop', amount: 2 }, { type: 'combat' }],
        pathToImage: 'assets/images/action-backgrounds/conspiracy.png',
      },
      {
        title: { de: 'Imperiale Gunst', en: 'Imperial Favor' },
        actionType: 'emperor',
        rewards: [{ type: 'solari' }, { type: 'intrigue' }, { type: 'intrigue-draw' }],
        pathToImage: 'assets/images/action-backgrounds/wealth.png',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Empire.png',
    primaryColor: 'rgb(85 85 85)',
    secondaryColor: '#262626b8',
    hasScoreBoard: true,
    levelTwoReward: [{ type: 'solari', amount: 2 }],
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
        title: { de: 'Verbindungen', en: 'Connections' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 3 }],
        rewards: [
          { type: 'troop', amount: 3 },
          { type: 'helper-or' },
          { type: 'card-draw', amount: 2 },
          { type: 'persuasion', amount: 1 },
        ],
        requiresInfluence: { type: 'bene' },
        pathToImage: 'assets/images/action-backgrounds/meeting_3.png',
        customWidth: '130px',
        noColumnGap: true,
      },
      {
        title: { de: 'schwertmeister', en: 'Swordmaster' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 9 }],
        rewards: [{ type: 'sword-master', iconHeight: 60 }],
        pathToImage: 'assets/images/action-backgrounds/ceremony_3.png',
        customWidth: '135px',
      },
      {
        title: { de: 'Propaganda', en: 'Propaganda' },
        actionType: 'landsraad',
        rewards: [{ type: 'solari' }, { type: 'persuasion', amount: 2 }],
        pathToImage: 'assets/images/action-backgrounds/troops_2.png',
      },
      {
        title: { de: 'Sitz im hohen Rat', en: 'High Council Seat' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 7 }],
        rewards: [{ type: 'council-seat-small', amount: 3, iconHeight: 110 }],
        customWidth: 'fit-content',
        pathToImage: 'assets/images/action-backgrounds/empire_ambassador_2.png',
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
          { type: 'helper-trade-horizontal', iconHeight: 30, width: 45 },
          { type: 'helper-trade-horizontal', iconHeight: 30, width: 45 },
          { type: 'helper-trade-horizontal', iconHeight: 30, width: 45 },
          { type: 'solari', amount: 5, width: 45 },
          { type: 'solari', amount: 7, width: 45 },
          { type: 'solari', amount: 9, width: 45 },
        ],
        pathToImage: 'assets/images/action-backgrounds/spaceship_fleet.png',
        customWidth: '150px',
        noRowGap: true,
        tradeOptionField: {
          from: 'spice',
          to: 'solari',
          tradeFormula: (tradeAmount) => 3 + 2 * tradeAmount,
          maxTradeAmount: 3,
        },
      },
      {
        title: { de: 'Versorgungslieferung', en: 'Supply Shipment' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 2 }],
        rewards: [{ type: 'water' }, { type: 'water' }, { type: 'troop' }],
        pathToImage: 'assets/images/action-backgrounds/freighter.png',
        requiresInfluence: { type: 'emperor' },
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Choam.png',
    primaryColor: 'rgb(150, 73, 9)',
    secondaryColor: '#2e2419b8',
  },
];
