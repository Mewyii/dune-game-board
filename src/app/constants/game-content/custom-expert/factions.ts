import { Faction } from '../../../models';

export const factionsCustomExpert: Faction[] = [
  {
    title: { de: 'Fremen', en: 'Fremen' },
    type: 'fremen',
    position: {
      marginTop: 1665,
      marginLeft: 15,
    },
    actionFields: [
      {
        title: { de: 'Die Wüste Verstehen', en: 'Desert Knowledge' },
        actionType: 'fremen',
        costs: [{ type: 'spice', amount: 2 }],
        rewards: [{ type: 'card-draw', amount: 2 }, { type: 'card-draw-or-destroy' }],
        pathToImage: 'assets/images/action-backgrounds/spice_2.png',
      },
      {
        title: { de: 'Wüstenausrüstung', en: 'Desert Equipment' },
        actionType: 'fremen',
        rewards: [{ type: 'water' }],
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
          type: 'troop',
          amount: 2,
        },
      ],
      4: [
        {
          type: 'victory-point',
        },
      ],
    },
  },
  {
    title: { de: 'Bene Gesserit', en: 'Bene Gesserit' },
    type: 'bene',
    position: {
      marginTop: 1155,
      marginLeft: 15,
    },
    actionFields: [
      {
        title: { de: 'Hellsicht', en: 'Truthsay' },
        actionType: 'bene',
        costs: [{ type: 'spice', amount: 2 }],
        rewards: [{ type: 'card-draw' }, { type: 'agent-lift' }],
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
    primaryColor: 'rgb(84, 78, 97)',
    secondaryColor: '#1f192eb8',
    hasScoreBoard: true,
    influenceRewards: {
      2: [
        {
          type: 'intrigue',
        },
      ],
      4: [
        {
          type: 'victory-point',
        },
      ],
    },
  },
  {
    title: { de: 'Raumgilde', en: 'Spacing Guild' },
    type: 'guild',
    position: {
      marginTop: 645,
      marginLeft: 15,
    },
    actionFields: [
      {
        title: { de: 'Heighliner', en: 'Heighliner' },
        actionType: 'guild',
        costs: [{ type: 'spice', amount: 4 }],
        rewards: [{ type: 'tech' }, { type: 'troop', amount: 7 }],
        pathToImage: 'assets/images/action-backgrounds/highliner.png',
        activeForPlayerCount: 3,
      },
      {
        title: { de: 'Gildenabkommen', en: 'Guild Contract' },
        actionType: 'guild',
        rewards: [{ type: 'solari', amount: 3 }],
        pathToImage: 'assets/images/action-backgrounds/guild_navigators.png',
        activeForPlayerCount: 3,
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Spacing_Guild.png',
    primaryColor: 'rgb(128, 34, 34)',
    secondaryColor: '#2e1919b8',
    hasScoreBoard: true,
    influenceRewards: {
      2: [
        {
          type: 'foldspace',
        },
      ],
      4: [
        {
          type: 'victory-point',
        },
      ],
    },
  },
  {
    title: { de: 'Imperator', en: 'Emperor' },
    type: 'emperor',
    position: {
      marginTop: 130,
      marginLeft: 15,
    },
    actionFields: [
      {
        title: { de: 'Verschwörung', en: 'Conspiracy' },
        actionType: 'emperor',
        costs: [{ type: 'spice', amount: 4 }],
        rewards: [{ type: 'intrigue' }, { type: 'intrigue' }, { type: 'troop', amount: 4 }, { type: 'combat' }],
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
    primaryColor: 'rgb(103, 80, 38)',
    secondaryColor: '#2e2619b8',
    hasScoreBoard: true,
    influenceRewards: {
      2: [
        {
          type: 'solari',
          amount: 2,
        },
      ],
      4: [
        {
          type: 'victory-point',
        },
      ],
    },
  },
  {
    title: { de: 'Landsraad', en: 'Landsraad' },
    type: 'landsraad',
    position: {
      marginTop: 130,
      marginLeft: 590,
      width: 330,
    },
    actionFields: [
      {
        title: { de: 'Sitz im hohen Rat', en: 'High Council Seat' },
        actionType: 'landsraad',
        costs: [{ type: 'spice', amount: 6 }],
        rewards: [{ type: 'council-seat-small', amount: 4, iconHeight: 110 }],
        customWidth: 'fit-content',
        pathToImage: 'assets/images/action-backgrounds/empire_ambassador_2.png',
      },
      {
        title: { de: 'Verbindungen', en: 'Connections' },
        actionType: 'landsraad',
        rewards: [
          { type: 'troop', amount: 2 },
          { type: 'helper-or' },
          { type: 'persuasion', amount: 1 },
          { type: 'persuasion', amount: 1 },
        ],
        pathToImage: 'assets/images/action-backgrounds/meeting_3.png',
        customWidth: '130px',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Landsraad.png',
    primaryColor: 'rgb(72, 89, 71)',
    secondaryColor: '#192e19b8',
  },
  {
    title: { de: 'Imperium', en: 'Empire' },
    type: 'choam',
    position: {
      marginTop: 130,
      marginLeft: 1035,
      width: 1030,
    },
    actionFields: [
      {
        title: { de: 'Mentat', en: 'Mentat' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 10 }],
        rewards: [{ type: 'sword-master', iconHeight: 60 }],
        pathToImage: 'assets/images/action-backgrounds/mentat_3.png',
        customWidth: '160px',
      },
      {
        title: { de: 'Leichter', en: 'Lighter' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 8 }],
        rewards: [{ type: 'dreadnought', iconHeight: 60 }],
        pathToImage: 'assets/images/action-backgrounds/industry_2.png',
        customWidth: '160px',
      },
      {
        title: { de: 'Söldner', en: 'Mercenaries' },
        actionType: 'landsraad',
        costs: [{ type: 'solari', amount: 4 }],
        rewards: [{ type: 'troop', amount: 4 }],
        activeForPlayerCount: 5,
        pathToImage: 'assets/images/action-backgrounds/meeting_3.png',
      },
      {
        title: { de: 'Spice Handel', en: 'Spice Trade' },
        actionType: 'landsraad',
        rewards: [],
        conversionOptions: [
          [
            { type: 'spice', amount: 1, width: 45 },
            { type: 'helper-trade-horizontal', iconHeight: 30, width: 45 },
            { type: 'solari', amount: 6, width: 45 },
          ],
          [
            { type: 'spice', amount: 2, width: 45 },
            { type: 'helper-trade-horizontal', iconHeight: 30, width: 45 },
            { type: 'solari', amount: 9, width: 45 },
          ],
          [
            { type: 'spice', amount: 3, width: 45 },
            { type: 'helper-trade-horizontal', iconHeight: 30, width: 45 },
            { type: 'solari', amount: 11, width: 45 },
          ],
        ],
        pathToImage: 'assets/images/action-backgrounds/spaceship_fleet.png',
        customWidth: '150px',
        noRowGap: true,
      },
      {
        title: { de: 'Versorgungslieferung', en: 'Supply Shipment' },
        actionType: 'landsraad',
        rewards: [{ type: 'tech' }, { type: 'helper-or' }, { type: 'leader-heal' }, { type: 'water' }],
        pathToImage: 'assets/images/action-backgrounds/freighter.png',
        customWidth: '115px',
        noColumnGap: true,
      },
      {
        title: { de: 'Propaganda', en: 'Propaganda' },
        actionType: 'landsraad',
        rewards: [
          { type: 'solari', amount: 2 },
          { type: 'troop', amount: 2 },
        ],
        activeForPlayerCount: 5,
        pathToImage: 'assets/images/action-backgrounds/troops_2.png',
      },
    ],
    pathToSymbol: 'assets/images/faction-symbols/Symbol_Choam.png',
    primaryColor: 'rgb(69, 69, 69)',
    secondaryColor: '#1e1e1eb8',
  },
];
