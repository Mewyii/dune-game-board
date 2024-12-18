import { Conflict } from '../models/conflict';

export const conflicts: Conflict[] = [
  {
    name: { de: 'Gildenbanküberfall', en: 'guild bank raid' },
    lvl: 1,
    rewards: [[{ type: 'solari', amount: 7 }], [{ type: 'solari', amount: 5 }], [{ type: 'solari', amount: 2 }]],
  },
  {
    name: { de: 'Raub der Lagerbestände', en: 'raid stockpiles' },
    lvl: 1,
    rewards: [[{ type: 'spice', amount: 4 }], [{ type: 'spice', amount: 3 }], [{ type: 'spice' }]],
  },
  {
    name: { de: 'Belagerung von Arrakeen', en: 'siege of arrakeen' },
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'tech-reduced-two' }],
      [{ type: 'water' }, { type: 'water' }, { type: 'tech-reduced' }],
      [{ type: 'water' }],
    ],
  },
  {
    name: { de: 'Belagerung von Carthag', en: 'siege of carthag' },
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'intrigue' }, { type: 'intrigue' }],
      [{ type: 'intrigue' }, { type: 'intrigue' }, { type: 'solari', amount: 2 }],
      [{ type: 'solari', amount: 2 }],
    ],
  },
  {
    name: { de: 'Imperiales Becken sichern', en: 'secure imperial basin' },
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'spice', amount: 2 }],
      [{ type: 'spice', amount: 3 }],
      [{ type: 'spice' }],
    ],
  },
  {
    name: { de: 'Machenschaften', en: 'machinations' },
    lvl: 1,
    rewards: [
      [{ type: 'faction-influence-up-choice' }, { type: 'location-control' }],
      [{ type: 'water' }, { type: 'solari', amount: 3 }],
      [{ type: 'water' }],
    ],
  },
  {
    name: { de: 'Heimlichtuerei', en: 'cloak and dagger' },
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'faction-influence-up-choice' }],
      [{ type: 'intrigue' }, { type: 'intrigue' }],
      [{ type: 'intrigue' }, { type: 'helper-or' }, { type: 'spice' }],
    ],
  },
  {
    name: { de: 'Wüstenmacht', en: 'desert power' },
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'water' }],
      [{ type: 'water' }, { type: 'spice', amount: 2 }],
      [{ type: 'spice' }],
    ],
  },
  {
    name: { de: 'Schrecklicher Zweck', en: 'terrible purpose' },
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'focus' }],
      [{ type: 'intrigue' }, { type: 'solari', amount: 2 }, { type: 'focus' }],
      [{ type: 'solari', amount: 2 }, { type: 'focus' }],
    ],
  },
  {
    name: { de: 'Sortieren des Chaos', en: 'sort trough the chaos' },
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'foldspace' }],
      [{ type: 'water' }, { type: 'spice', amount: 2 }],
      [{ type: 'spice' }, { type: 'foldspace' }],
    ],
  },
  {
    name: { de: 'Handelsmonopol', en: 'trade monopoly' },
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'shipping' }],
      [{ type: 'shipping' }, { type: 'shipping' }],
      [{ type: 'water' }],
    ],
  },
  {
    name: { de: 'Schlacht um das Imperiale Becken', en: 'battle for imperial basin' },
    lvl: 2,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'spice', amount: 3 }],
      [{ type: 'spice', amount: 3 }],
    ],
  },
  {
    name: { de: 'Schlacht um Carthag', en: 'battle for carthag' },
    lvl: 2,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'intrigue' }, { type: 'intrigue' }],
      [{ type: 'intrigue' }, { type: 'intrigue' }],
    ],
  },
  {
    name: { de: 'Schlacht um Arrakeen', en: 'battle for arrakeen' },
    lvl: 2,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'water' }, { type: 'water' }, { type: 'tech-reduced-two' }],
      [{ type: 'water' }, { type: 'tech-reduced' }],
    ],
  },
  {
    name: { de: 'Große Vision', en: 'grand vision' },
    lvl: 2,
    rewards: [
      [{ type: 'faction-influence-up-twice-choice' }, { type: 'intrigue' }],
      [{ type: 'victory-point' }],
      [{ type: 'spice', amount: 3 }],
    ],
  },
  {
    name: { de: 'Wirtschaftliche Überlegenheit', en: 'economic supremacy' },
    lvl: 2,
    rewards: [
      [{ type: 'victory-point' }, { type: 'victory-point' }],
      [{ type: 'victory-point' }],
      [
        { type: 'spice', amount: 2 },
        { type: 'solari', amount: 2 },
      ],
    ],
  },
];
