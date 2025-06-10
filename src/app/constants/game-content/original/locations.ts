import { DuneLocation } from '../../../models';

export const locationsOriginal: DuneLocation[] = [
  {
    color: 'rgb(74, 58, 46)',
    position: {
      marginTop: 880,
      marginLeft: 1430,
    },
    actionField: {
      title: { de: 'Arrakeen', en: 'Arrakeen' },
      actionType: 'town',
      rewards: [{ type: 'card-draw' }, { type: 'troop' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/arrakeen.png',
      ownerReward: { type: 'solari' },
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
      pathToImage: 'assets/images/action-backgrounds/arrakeen_2.png',
      ownerReward: { type: 'solari' },
    },
  },
  {
    color: 'rgb(74, 58, 46)',
    position: {
      marginTop: 670,
      marginLeft: 1250,
    },
    actionField: {
      title: { de: 'Forschungszentrum', en: 'Research Station' },
      actionType: 'town',
      costs: [
        {
          type: 'water',
        },
        {
          type: 'water',
        },
      ],
      rewards: [{ type: 'card-draw', amount: 3 }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/research_station.png',
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
      rewards: [{ type: 'water' }, { type: 'troop' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/desert_2.png',

      requiresInfluence: { type: 'fremen', amount: 2 },
    },
  },
  {
    color: 'rgb(176, 147, 109)',
    position: {
      marginTop: 1080,
      marginLeft: 1230,
    },
    actionField: {
      title: { de: 'Imperiales Becken', en: 'Imperial basin' },
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
      title: { de: 'Hagga-Becken', en: 'Hagga basin' },
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
      title: { de: 'Die grosse Ebene', en: 'The great flat' },
      actionType: 'spice',
      costs: [{ type: 'water' }, { type: 'water' }],
      rewards: [{ type: 'spice', amount: 3 }, { type: 'spice-accumulation' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/desert.png',
    },
  },
];
