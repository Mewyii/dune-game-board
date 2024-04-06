import { Faction } from '../../../models';

export const factionsCustomExpert: Faction[] = [
  {
    title: { de: 'fremen', en: 'fremen' },
    type: 'fremen',
    position: {
      marginTop: 1670,
      marginLeft: 16,
    },
    actionFields: [
      {
        title: { de: 'Wüstenausrüstung', en: 'Desert Equipment' },
        actionType: 'fremen',
        costs: [{ type: 'solari', amount: 2 }],
        rewards: [{ type: 'water' }, { type: 'water' }],
        pathToImage: 'assets/images/action-backgrounds/stillsuits.png',
      },
      {
        title: { de: 'Die Wüste Verstehen', en: 'Desert Knowledge' },
        actionType: 'fremen',
        rewards: [{ type: 'card-draw-or-destroy' }, { type: 'combat' }],
        pathToImage: 'assets/images/action-backgrounds/fremen_warriors_2.png',
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
        title: { de: 'Wahrsagung', en: 'Truthsay' },
        actionType: 'bene',
        costs: [{ type: 'spice', amount: 2 }],
        rewards: [{ type: 'card-draw', amount: 2 }, { type: 'card-discard' }, { type: 'agent-lift' }],
        pathToImage: 'assets/images/action-backgrounds/bene_gesserit_4.png',
      },
      {
        title: { de: 'Geistesausbildung', en: 'Mind Training' },
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
      { type: 'intrigue-draw' },
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
        rewards: [{ type: 'water' }, { type: 'water' }, { type: 'troop', amount: 4 }],
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
        costs: [{ type: 'spice', amount: 4 }],
        rewards: [{ type: 'intrigue' }, { type: 'intrigue' }, { type: 'solari', amount: 4 }, { type: 'troop', amount: 2 }],
        pathToImage: 'assets/images/action-backgrounds/conspiracy.png',
      },
      {
        title: { de: 'Imperiale Gunst', en: 'Imperial Favor' },
        actionType: 'emperor',
        rewards: [{ type: 'solari' }, { type: 'intrigue' }],
        pathToImage: 'assets/images/action-backgrounds/wealth.png',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Empire.png',
    primaryColor: 'rgb(85 85 85)',
    secondaryColor: '#262626b8',
    hasScoreBoard: true,
    levelTwoReward: [{ type: 'troop' }, { type: 'combat' }],
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
        title: { de: 'Propaganda', en: 'Propaganda' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 2 }],
        rewards: [
          { type: 'persuasion', amount: 2 },
          { type: 'separator', width: 10, iconHeight: 50 },
          { type: 'troop', amount: 2 },
          { type: 'card-draw' },
        ],
        pathToImage: 'assets/images/action-backgrounds/troops_2.png',
        customWidth: '125px',
        hasRewardOptions: true,
      },
      {
        title: { de: 'schwertmeister', en: 'Swordmaster' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 10 }],
        rewards: [{ type: 'sword-master', iconHeight: 60 }],
        pathToImage: 'assets/images/action-backgrounds/swordmaster_2.png',
        customWidth: '135px',
      },
      {
        title: { de: 'beziehungen', en: 'Relations' },
        actionType: 'landsraad',
        rewards: [{ type: 'persuasion', amount: 1 }, { type: 'troop' }, { type: 'tech' }],
        pathToImage: 'assets/images/action-backgrounds/wealth_2.png',
      },
      {
        title: { de: 'Sitz im hohen Rat', en: 'High Council Seat' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 8 }],
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
          { type: 'solari', amount: 5, width: 45 },
          { type: 'solari', amount: 7, width: 45 },
          { type: 'solari', amount: 9, width: 45 },
        ],
        pathToImage: 'assets/images/action-backgrounds/spaceship_fleet.png',

        hasRewardOptions: true,
        customWidth: '150px',
        noGap: true,
      },
      {
        title: { de: 'Begünstigung', en: 'Favoritism' },
        actionType: 'landsraad',
        rewards: [{ type: 'faction-influence-up-choice' }],
        pathToImage: 'assets/images/action-backgrounds/freighter.png',
        requiresInfluence: { type: 'emperor' },
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Choam.png',
    primaryColor: 'rgb(150, 73, 9)',
    secondaryColor: '#2e2419b8',
  },
];
