import { DuneLocation } from '../models';

export const locationsOriginal: DuneLocation[] = [
  {
    color: 'rgb(87, 71, 52)',
    position: {
      marginTop: 750,
      marginLeft: 1390,
    },
    actionField: {
      title: { de: 'arrakeen', en: 'arrakeen' },
      actionType: 'town',
      rewards: [{ type: 'card-draw' }, { type: 'troop' }, { type: 'battle-insert' }],
      pathToImage: 'assets/images/action-backgrounds/arrakeen.png',
      isBattlefield: true,
    },
    ownerReward: { type: 'currency' },
  },
  {
    color: 'rgb(87, 71, 52)',
    position: {
      marginTop: 910,
      marginLeft: 1110,
    },
    actionField: {
      title: { de: 'carthag', en: 'carthag' },
      actionType: 'town',
      rewards: [{ type: 'intrigue' }, { type: 'troop' }, { type: 'battle-insert' }],
      pathToImage: 'assets/images/action-backgrounds/carthag.png',
      isBattlefield: true,
    },
    ownerReward: { type: 'currency' },
  },
  {
    color: 'rgb(87, 71, 52)',
    position: {
      marginTop: 680,
      marginLeft: 920,
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
      rewards: [{ type: 'card-draw', amount: 3 }, { type: 'battle-insert' }],
      pathToImage: 'assets/images/action-backgrounds/research_station.png',
      isBattlefield: true,
    },
  },
  {
    color: 'rgb(87, 71, 52)',
    position: {
      marginTop: 840,
      marginLeft: 600,
    },
    actionField: {
      title: { de: 'sietch tabr', en: 'sietch tabr' },
      actionType: 'town',
      rewards: [{ type: 'water' }, { type: 'troop' }, { type: 'battle-insert' }],
      pathToImage: 'assets/images/action-backgrounds/desert_2.png',
      isBattlefield: true,
      requiresInfluence: { type: 'fremen', amount: 2 },
    },
  },
  {
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1210,
      marginLeft: 1240,
    },
    actionField: {
      title: { de: 'imperiales becken', en: 'imperial basin' },
      actionType: 'spice',
      rewards: [{ type: 'spice' }, { type: 'extra-spice' }, { type: 'battle-insert' }],
      pathToImage: 'assets/images/action-backgrounds/sandcrawler.png',
      isBattlefield: true,
    },
    ownerReward: { type: 'spice' },
  },
  {
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1120,
      marginLeft: 870,
    },
    actionField: {
      title: { de: 'hagga-becken', en: 'hagga basin' },
      actionType: 'spice',
      costs: [{ type: 'water' }],
      rewards: [{ type: 'spice', amount: 2 }, { type: 'extra-spice' }, { type: 'battle-insert' }],
      pathToImage: 'assets/images/action-backgrounds/sandworm.png',
      isBattlefield: true,
    },
  },
  {
    color: 'rgb(196, 172, 139)',
    position: {
      marginTop: 1310,
      marginLeft: 585,
    },
    actionField: {
      title: { de: 'die grosse ebene', en: 'the great flat' },
      actionType: 'spice',
      costs: [{ type: 'water' }, { type: 'water' }],
      rewards: [{ type: 'spice', amount: 3 }, { type: 'extra-spice' }, { type: 'battle-insert' }],
      pathToImage: 'assets/images/action-backgrounds/desert.png',
      isBattlefield: true,
    },
  },
];
