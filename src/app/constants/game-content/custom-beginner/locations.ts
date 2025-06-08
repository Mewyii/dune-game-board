import { DuneLocation } from '../../../models';

export const locationsCustomBeginner: DuneLocation[] = [
  {
    color: 'rgb(74, 58, 46)',
    position: {
      marginTop: 880,
      marginLeft: 1430,
    },
    actionField: {
      title: { de: 'Arrakeen', en: 'Arrakeen' },
      actionType: 'town',
      rewards: [{ type: 'solari', amount: 2 }, { type: 'troop' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/arrakeen_2.png',
      ownerReward: { type: 'solari', amount: 2 },
    },
  },
  {
    color: 'rgb(176, 147, 109)',
    position: {
      marginTop: 1310,
      marginLeft: 1160,
    },
    actionField: {
      title: { de: "Tuek's Sietch", en: "Tuek's Sietch" },
      actionType: 'spice',
      costs: [{ type: 'water' }],
      rewards: [{ type: 'spice' }, { type: 'troop' }, { type: 'faction-influence-up-choice' }],
      pathToImage: 'assets/images/action-backgrounds/desert_5.png',
      requiresInfluence: { type: 'guild' },
      ownerReward: { type: 'spice' },
    },
  },
  {
    color: 'rgb(74, 58, 46)',
    position: {
      marginTop: 890,
      marginLeft: 1010,
    },
    actionField: {
      title: { de: 'Carthag', en: 'Carthag' },
      actionType: 'town',
      rewards: [{ type: 'intrigue' }, { type: 'troop' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/arrakeen_11.png',
      ownerReward: { type: 'solari', amount: 2 },
    },
  },
  {
    color: 'rgb(74, 58, 46)',
    position: {
      marginTop: 670,
      marginLeft: 1250,
    },
    actionField: {
      title: { de: 'Raumhafen', en: 'Space Port' },
      actionType: 'town',
      rewards: [{ type: 'card-draw' }, { type: 'foldspace' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/troops.png',
      ownerReward: { type: 'tech' },
    },
  },
  {
    color: 'rgb(74, 58, 46)',
    position: {
      marginTop: 800,
      marginLeft: 600,
    },
    actionField: {
      title: { de: 'Sietch Tabr', en: 'Sietch Tabr' },
      actionType: 'town',
      costs: [{ type: 'water' }, { type: 'water' }],
      rewards: [{ type: 'card-draw-or-destroy' }, { type: 'troop', amount: 3 }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/desert_2.png',
      requiresInfluence: { type: 'fremen' },
      ownerReward: { type: 'troop' },
    },
  },
  {
    color: 'rgb(176, 147, 109)',
    position: {
      marginTop: 1080,
      marginLeft: 1230,
    },
    actionField: {
      title: { de: 'Imperiales Becken', en: 'Imperial Basin' },
      actionType: 'spice',
      rewards: [{ type: 'spice' }, { type: 'spice-accumulation' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/sandcrawler.png',
      ownerReward: { type: 'spice' },
    },
  },
  {
    color: 'rgb(176, 147, 109)',
    position: {
      marginTop: 1070,
      marginLeft: 780,
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
    color: 'rgb(176, 147, 109)',
    position: {
      marginTop: 1300,
      marginLeft: 610,
    },
    actionField: {
      title: { de: 'Die grosse Ebene', en: 'The Great Flat' },
      actionType: 'spice',
      costs: [{ type: 'water' }, { type: 'water' }],
      rewards: [{ type: 'spice', amount: 3 }, { type: 'spice-accumulation' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/desert.png',
    },
  },
];
