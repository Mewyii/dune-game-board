import { Conflict } from '../models/conflict';

export const conflicts: Conflict[] = [
  // LVL 1
  {
    name: { de: 'Schlacht von Arrakeen', en: 'Battle of Arrakeen' },
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'solari', amount: 2 }],
      [{ type: 'tech' }, { type: 'solari', amount: 3 }],
      [{ type: 'solari', amount: 2 }],
    ],
  },
  {
    name: { de: 'Schlacht von Carthag', en: 'Battle of Carthag' },
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'intrigue' }],
      [{ type: 'intrigue' }, { type: 'solari', amount: 3 }],
      [{ type: 'solari', amount: 2 }],
    ],
  },
  {
    name: { de: 'Schlacht in den Spice-Feldern', en: 'Battle in the Spice Fields' },
    lvl: 1,
    rewards: [[{ type: 'location-control' }, { type: 'spice' }], [{ type: 'spice', amount: 3 }], [{ type: 'spice' }]],
  },
  {
    name: { de: 'Schlacht an den Raumhäfen', en: 'Battle at the space ports' },
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'tech' }],
      [{ type: 'water' }, { type: 'tech', amount: 2 }],
      [{ type: 'water' }],
    ],
  },
  {
    name: { de: 'Vorherrschaft über die Spice-Raffinerien', en: 'Supremacy over the spice-refineries' },
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'spice' }],
      [
        { type: 'spice', amount: 2 },
        { type: 'solari', amount: 2 },
      ],
      [{ type: 'solari', amount: 2 }],
    ],
  },
  {
    name: { de: 'Eroberung der Schmuggler-Sietches', en: "Conquest of the Smuggler's Sietches" },
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'solari', amount: 2 }],
      [{ type: 'solari', amount: 5 }],
      [{ type: 'solari', amount: 2 }],
    ],
  },
  {
    name: { de: 'Vorherrschaft über den Wasserhandel', en: 'Supremacy over the Water Trade' },
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'water' }],
      [{ type: 'water' }, { type: 'solari', amount: 3 }],
      [{ type: 'water' }],
    ],
  },
  {
    name: { de: 'Eroberung der imperialen Forschungs-Stationen', en: 'Conquest of the Imperial Research Stations' },
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'focus' }],
      [{ type: 'water' }, { type: 'spice' }, { type: 'focus' }],
      [{ type: 'spice' }],
    ],
  },
  // LVL 2
  {
    name: { de: 'Schlacht von Carthag', en: 'Battle of Carthag' },
    lvl: 2,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'intrigue' }, { type: 'intrigue' }],
      [{ type: 'intrigue' }, { type: 'intrigue' }],
    ],
  },
  {
    name: { de: 'Schlacht von Arrakeen', en: 'Battle of Arrakeen' },
    lvl: 2,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'water' }, { type: 'tech' }],
      [{ type: 'water' }, { type: 'tech', amount: 2 }],
    ],
  },
  {
    name: { de: 'Schlacht von Sietch Tabr', en: 'Battle of Sietch Tabr' },
    lvl: 2,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'water' }, { type: 'spice' }],
      [{ type: 'water' }, { type: 'spice' }],
    ],
  },
  {
    name: { de: 'Schlacht in der tiefen Wüste', en: 'Battle of the Deep Dessert' },
    lvl: 2,
    rewards: [
      [{ type: 'victory-point' }, { type: 'victory-point' }],
      [{ type: 'victory-point' }],
      [{ type: 'spice', amount: 2 }],
    ],
  },
  {
    name: { de: 'Schlacht um die Raumhäfen', en: 'Battle of the Space Ports' },
    lvl: 2,
    rewards: [
      [{ type: 'faction-influence-up-twice-choice' }, { type: 'tech', amount: 2 }],
      [{ type: 'location-control' }],
      [{ type: 'tech', amount: 2 }],
    ],
  },
  {
    name: { de: 'Schlacht von Tueks Sietch', en: 'Battle of Tueks Sietch' },
    lvl: 2,
    rewards: [
      [{ type: 'victory-point' }, { type: 'faction-influence-up-choice' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'solari', amount: 3 }],
      [{ type: 'solari', amount: 5 }],
    ],
  },
];
