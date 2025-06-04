import { DuneLocation } from '../../../models';

export const locationsOriginal: DuneLocation[] = [
  {
    color: 'rgb(87, 69, 52)',
    position: {
      marginTop: 875,
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
    color: 'rgb(87, 69, 52)',
    position: {
      marginTop: 930,
      marginLeft: 1090,
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
    color: 'rgb(87, 69, 52)',
    position: {
      marginTop: 660,
      marginLeft: 970,
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
    color: 'rgb(87, 69, 52)',
    position: {
      marginTop: 850,
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
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1190,
      marginLeft: 1260,
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
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1090,
      marginLeft: 770,
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
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1310,
      marginLeft: 580,
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
