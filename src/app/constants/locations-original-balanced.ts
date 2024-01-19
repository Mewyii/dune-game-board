import { DuneLocation } from '../models';

export const locationsOriginalBalanced: DuneLocation[] = [
  {
    color: 'rgb(87, 71, 52)',
    position: {
      marginTop: 740,
      marginLeft: 1380,
    },
    actionField: {
      title: { de: 'arrakeen', en: 'arrakeen' },
      actionType: 'town',
      rewards: [{ type: 'card-draw-or-destroy' }, { type: 'troop' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/arrakeen.png',
      isBattlefield: true,
    },
    ownerReward: { type: 'currency', amount: 2 },
  },
  {
    color: 'rgb(87, 71, 52)',
    position: {
      marginTop: 900,
      marginLeft: 1100,
    },
    actionField: {
      title: { de: 'carthag', en: 'carthag' },
      actionType: 'town',
      rewards: [{ type: 'intrigue' }, { type: 'troop' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/carthag.png',
      isBattlefield: true,
    },
    ownerReward: { type: 'currency', amount: 2 },
  },
  {
    color: 'rgb(87, 71, 52)',
    position: {
      marginTop: 670,
      marginLeft: 910,
    },
    actionField: {
      title: { de: 'forschungszentrum', en: 'research station' },
      actionType: 'town',
      costs: [
        {
          type: 'water',
        },
        {
          type: 'water',
        },
      ],
      rewards: [{ type: 'card-draw', amount: 2 }, { type: 'card-draw-or-destroy' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/research_station.png',
      isBattlefield: true,
    },
  },
  {
    color: 'rgb(87, 71, 52)',
    position: {
      marginTop: 830,
      marginLeft: 590,
    },
    actionField: {
      title: { de: 'sietch tabr', en: 'sietch tabr' },
      actionType: 'town',
      rewards: [{ type: 'water' }, { type: 'troop' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/desert_2.png',
      isBattlefield: true,
      requiresInfluence: { type: 'fremen', amount: 2 },
    },
  },
  {
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1200,
      marginLeft: 1230,
    },
    actionField: {
      title: { de: 'imperiales becken', en: 'imperial basin' },
      actionType: 'spice',
      rewards: [{ type: 'spice' }, { type: 'extra-spice' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/sandcrawler.png',
      isBattlefield: true,
    },
    ownerReward: { type: 'spice' },
  },
  {
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1110,
      marginLeft: 860,
    },
    actionField: {
      title: { de: 'hagga-becken', en: 'hagga basin' },
      actionType: 'spice',
      costs: [{ type: 'water' }],
      rewards: [{ type: 'spice', amount: 2 }, { type: 'extra-spice' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/sandworm.png',
      isBattlefield: true,
    },
  },
  {
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1300,
      marginLeft: 575,
    },
    actionField: {
      title: { de: 'die grosse ebene', en: 'the great flat' },
      actionType: 'spice',
      costs: [{ type: 'water' }, { type: 'water' }],
      rewards: [{ type: 'spice', amount: 3 }, { type: 'extra-spice' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/desert.png',
      isBattlefield: true,
    },
  },
];
