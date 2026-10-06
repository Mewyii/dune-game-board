import { DuneLocation } from '../../../models';

export const locations: DuneLocation[] = [
  {
    color: 'rgb(79, 61, 47)',
    position: {
      marginTop: 850,
      marginLeft: 1460,
    },
    actionField: {
      title: { de: 'Arrakeen', en: 'Arrakeen' },
      actionType: 'town',
      rewards: [{ type: 'card-draw' }, { type: 'troop' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/arrakeen_2.png',
      ownerReward: { type: 'persuasion', amount: 1 },
    },
  },
  {
    color: 'rgb(79, 61, 47)',
    position: {
      marginTop: 650,
      marginLeft: 1250,
    },
    actionField: {
      title: { de: 'Raumhafen', en: 'Space Port' },
      actionType: 'town',
      rewards: [{ type: 'foldspace' }, { type: 'troop' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/troops.png',
      ownerReward: { type: 'solari', amount: 2 },
      activeForPlayerCount: 4,
    },
  },
  {
    color: 'rgb(79, 61, 47)',
    position: {
      marginTop: 880,
      marginLeft: 1020,
    },
    actionField: {
      title: { de: 'Carthag', en: 'Carthag' },
      actionType: 'town',
      rewards: [{ type: 'tech' }, { type: 'troop' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/arrakeen_11.png',
      ownerReward: { type: 'persuasion', amount: 1 },
    },
  },
  {
    color: 'rgb(79, 61, 47)',
    position: {
      marginTop: 630,
      marginLeft: 850,
    },
    actionField: {
      title: { de: 'Tsimpo', en: 'Tsimpo' },
      actionType: 'town',
      costs: [{ type: 'water' }],
      rewards: [{ type: 'intrigue' }, { type: 'troop', amount: 2 }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/arrakeen_4.png',
      ownerReward: { type: 'focus' },
      activeForPlayerCount: 4,
    },
  },
  {
    color: 'rgb(79, 61, 47)',
    position: {
      marginTop: 830,
      marginLeft: 610,
    },
    actionField: {
      title: { de: 'Sietch Tabr', en: 'Sietch Tabr' },
      actionType: 'town',
      costs: [{ type: 'water' }, { type: 'water' }],
      rewards: [{ type: 'troop', amount: 4 }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/desert_2.png',
      requiresInfluence: { type: 'fremen' },
      ownerReward: { type: 'troop' },
    },
  },
  {
    color: 'rgb(163, 131, 88)',
    position: {
      marginTop: 1090,
      marginLeft: 1260,
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
    color: 'rgb(163, 131, 88)',
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
      ownerReward: { type: 'spice' },
      activeForPlayerCount: 3,
    },
  },
  {
    color: 'rgb(163, 131, 88)',
    position: {
      marginTop: 1290,
      marginLeft: 620,
    },
    actionField: {
      title: { de: 'Die grosse Ebene', en: 'The Great Flat' },
      actionType: 'spice',
      costs: [{ type: 'water' }, { type: 'water' }],
      rewards: [{ type: 'spice', amount: 3 }, { type: 'spice-accumulation' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/desert.png',
      ownerReward: { type: 'spice' },
    },
  },
  {
    color: 'rgb(163, 131, 88)',
    position: {
      marginTop: 1290,
      marginLeft: 1470,
    },
    actionField: {
      title: { de: "Tuek's Sietch", en: "Tuek's Sietch" },
      actionType: 'spice',
      costs: [{ type: 'water' }, { type: 'water' }],
      rewards: [{ type: 'spice', amount: 2 }, { type: 'spice-accumulation' }, { type: 'tech' }, { type: 'combat' }],
      pathToImage: 'assets/images/action-backgrounds/desert_5.png',
      requiresInfluence: { type: 'guild' },
      ownerReward: { type: 'solari', amount: 2 },
      activeForPlayerCount: 5,
    },
  },
];
