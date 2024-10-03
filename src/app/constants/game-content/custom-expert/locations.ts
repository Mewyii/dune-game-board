import { DuneLocation } from '../../../models';

export const locationsCustomExpert: DuneLocation[] = [
  {
    color: 'rgb(87, 69, 52)',
    position: {
      marginTop: 880,
      marginLeft: 1430,
    },
    actionField: {
      title: { de: 'Arrakeen', en: 'Arrakeen' },
      actionType: 'town',
      rewards: [{ type: 'card-draw' }, { type: 'troop' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/arrakeen_2.png',
    },
    ownerReward: { type: 'persuasion', amount: 1 },
  },
  {
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1310,
      marginLeft: 1160,
    },
    actionField: {
      title: { de: "Tuek's Sietch", en: "Tuek's Sietch" },
      actionType: 'spice',
      costs: [{ type: 'water' }, { type: 'water' }],
      rewards: [{ type: 'spice' }, { type: 'spice-accumulation' }, { type: 'tech-reduced' }],
      pathToImage: 'assets/images/action-backgrounds/desert_5.png',
      requiresInfluence: { type: 'guild' },
    },
    ownerReward: { type: 'spice' },
  },
  {
    color: 'rgb(87, 69, 52)',
    position: {
      marginTop: 890,
      marginLeft: 1010,
    },
    actionField: {
      title: { de: 'Carthag', en: 'Carthag' },
      actionType: 'town',
      rewards: [{ type: 'intrigue' }, { type: 'troop' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/arrakeen_11.png',
    },
    ownerReward: { type: 'persuasion', amount: 1 },
  },
  {
    color: 'rgb(87, 69, 52)',
    position: {
      marginTop: 670,
      marginLeft: 1250,
    },
    actionField: {
      title: { de: 'Raumhafen', en: 'Space Port' },
      actionType: 'town',
      rewards: [{ type: 'solari', amount: 2 }, { type: 'foldspace' }, { type: 'tech' }],
      pathToImage: 'assets/images/action-backgrounds/troops.png',
    },
    ownerReward: { type: 'solari', amount: 2 },
  },
  {
    color: 'rgb(87, 69, 52)',
    position: {
      marginTop: 810,
      marginLeft: 600,
    },
    actionField: {
      title: { de: 'Sietch Tabr', en: 'Sietch Tabr' },
      actionType: 'town',
      costs: [{ type: 'water' }],
      rewards: [{ type: 'troop', amount: 3 }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/desert_2.png',
      requiresInfluence: { type: 'fremen' },
    },
    ownerReward: { type: 'troop' },
  },
  {
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1100,
      marginLeft: 1230,
    },
    actionField: {
      title: { de: 'Imperiales Becken', en: 'Imperial Basin' },
      actionType: 'spice',
      rewards: [{ type: 'spice' }, { type: 'spice-accumulation' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/sandcrawler.png',
    },
  },
  {
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1070,
      marginLeft: 800,
    },
    actionField: {
      title: { de: 'Hagga-Becken', en: 'Hagga Basin' },
      actionType: 'spice',
      costs: [{ type: 'water' }],
      rewards: [{ type: 'spice', amount: 2 }, { type: 'spice-accumulation' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/sandworm.png',
    },
  },
  {
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1280,
      marginLeft: 620,
    },
    actionField: {
      title: { de: 'Die grosse Ebene', en: 'The Great Flat' },
      actionType: 'spice',
      costs: [{ type: 'water' }, { type: 'water' }],
      rewards: [{ type: 'spice', amount: 3 }, { type: 'spice-accumulation' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/desert.png',
    },
  },
  // 5-6Player Stuff
  // {
  //   color: 'rgb(87, 69, 52)',
  //   position: {
  //     marginTop: 635,
  //     marginLeft: 1375,
  //   },
  //   actionField: {
  //     title: { de: 'Raumhafen', en: 'Space Port' },
  //     actionType: 'town',
  //     rewards: [{ type: 'foldspace' }, { type: 'solari', amount: 2 }, { type: 'tech' }],
  //     pathToImage: 'assets/images/action-backgrounds/carthag.png',
  //   },
  // },
  // {
  //   color: 'rgb(77, 94, 75)',
  //   position: {
  //     marginTop: 630,
  //     marginLeft: 595,
  //   },
  //   actionField: {
  //     title: { de: 'Spice-Schmuggel', en: 'Spice-Smuggling' },
  //     actionType: 'landsraad',
  //     rewards: [{ type: 'spice' }, { type: 'persuasion', amount: 1 }],
  //     pathToImage: 'assets/images/action-backgrounds/carthag.png',
  //   },
  // },
  // {
  //   color: 'rgb(87, 69, 52)',
  //   position: {
  //     marginTop: 1000,
  //     marginLeft: 1444,
  //   },
  //   actionField: {
  //     title: "tuek's sietch",
  //     actionType: 'town',
  //     rewards: [{ type: 'water' }, { type: 'solari', amount: 1 }, { type: 'combat' }],
  //     pathToImage: 'assets/images/action-backgrounds/desert_2.png',
  //
  //   },
  // },
  // {
  //   color: 'rgb(196, 172, 139)',
  //   position: {
  //     marginTop: 1080,
  //     marginLeft: 540,
  //   },
  //   actionField: {
  //     title: 'ebene der toten',
  //     actionType: 'spice',
  //     costs: [{ type: 'water' }],
  //     rewards: [{ type: 'spice' }, { type: 'spice-accumulation' }, { type: 'focus' }],
  //     pathToImage: 'assets/images/action-backgrounds/desert.png',
  //
  //   },
  // },
  // {
  //   color: 'rgb(79, 94, 78)',
  //   position: {
  //     marginTop: 1170,
  //     marginLeft: 1800,
  //   },
  //   actionField: {
  //     title: 'bashar',
  //     actionType: 'landsraad',
  //     rewards: [{ type: 'troop', amount: 3 }],
  //     pathToImage: 'assets/images/action-backgrounds/sardaukar.png',
  //
  //   },
  // },
  // {
  //   color: 'rgb(79, 94, 78)',
  //   position: {
  //     marginTop: 1370,
  //     marginLeft: 1800,
  //   },
  //   actionField: {
  //     title: 'twisted mentat',
  //     actionType: 'landsraad',
  //     costs: [{ type: 'solari', amount: 2 }],
  //     rewards: [{ type: 'focus' }, { type: 'mentat', iconHeight: 95 }],
  //     pathToImage: 'assets/images/action-backgrounds/mentat_2.png',
  //
  //     customWidth: 'fit-content',
  //   },
  // },
];
