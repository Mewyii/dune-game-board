import { Conflict } from '../../../models/conflict';

export const conflictsCustomBeginner: Conflict[] = [
  // Arrakeen
  {
    name: { de: 'Schlacht am Gouverneurs-Palast', en: "Battle at the Governor's Palace" },
    boardSpaceId: 'Arrakeen',
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'victory-point' }, { type: 'intrigue' }],
      [{ type: 'solari', amount: 4 }],
    ],
  },
  {
    name: { de: 'Schlacht am Wasserhändler-Viertel', en: 'Battle at the Water Merchant District' },
    boardSpaceId: 'Arrakeen',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'water' }],
      [{ type: 'water' }, { type: 'solari', amount: 4 }],
      [{ type: 'solari', amount: 2 }],
    ],
  },
  {
    name: { de: 'Schlacht an den Spice-Raffinerien', en: 'Battle at the spice-refineries' },
    boardSpaceId: 'Arrakeen',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'spice' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'spice' }, { type: 'solari' }],
      [{ type: 'solari', amount: 2 }],
    ],
  },

  // Carthag
  {
    name: { de: 'Schlacht am imperialen Palast', en: 'Battle at the Imperial Palace' },
    boardSpaceId: 'Carthag',
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'victory-point' }, { type: 'intrigue' }],
      [{ type: 'solari', amount: 2 }, { type: 'intrigue' }],
    ],
  },
  {
    name: { de: 'Schlacht an den Industrieanlagen', en: 'Battle at the Industrial Facilities' },
    boardSpaceId: 'Carthag',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'tech' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'tech', amount: 2 }],
      [{ type: 'tech' }],
    ],
  },
  {
    name: { de: 'Schlacht an der Gildenbank', en: 'Battle at the Guild Bank' },
    boardSpaceId: 'Carthag',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'solari', amount: 2 }],
      [{ type: 'solari', amount: 6 }],
      [{ type: 'solari', amount: 2 }],
    ],
  },

  // Spaceport
  {
    name: { de: 'Schlacht an den Landefeldern', en: 'Battle at the landing fields' },
    boardSpaceId: 'Space Port',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'foldspace' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'water' }, { type: 'tech' }],
      [{ type: 'water' }],
    ],
  },
  {
    name: { de: 'Schlacht an den Wasser Depots', en: 'Battle at the Water Depots' },
    boardSpaceId: 'Space Port',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'water' }],
      [{ type: 'water' }, { type: 'water' }, { type: 'water' }],
      [{ type: 'water' }],
    ],
  },
  {
    name: { de: 'Schlacht an den Versorgungsdepots', en: 'Battle at the Supply Depots' },
    boardSpaceId: 'Space Port',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'leader-heal' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'leader-heal' }, { type: 'leader-heal' }],
      [{ type: 'leader-heal' }],
    ],
  },

  // Sietch Tabr
  {
    name: { de: 'Schlacht am Sietch', en: 'Battle at the Sietch' },
    boardSpaceId: 'Sietch Tabr',
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'victory-point' }, { type: 'focus' }],
      [{ type: 'focus' }, { type: 'troop', amount: 2 }],
    ],
  },
  {
    name: { de: 'Schlacht bei den Windfallen', en: 'Battle at the Wind Traps' },
    boardSpaceId: 'Sietch Tabr',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'water' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'water' }, { type: 'leader-heal' }],
      [{ type: 'water' }],
    ],
  },
  {
    name: { de: 'Schlacht im Tuono Becken', en: 'Battle at the Tuono Basin' },
    boardSpaceId: 'Sietch Tabr',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'spice' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'spice', amount: 2 }],
      [{ type: 'spice' }],
    ],
  },

  // Imperial Basin
  {
    name: { de: 'Schlacht in den Spice-Feldern', en: 'Battle in the Spice Fields' },
    boardSpaceId: 'Imperial Basin',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'spice' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'spice', amount: 2 }],
      [{ type: 'spice' }],
    ],
  },
  {
    name: { de: 'Schlacht am Schildwall', en: 'Battle at the Shield Wall' },
    boardSpaceId: 'Imperial Basin',
    lvl: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'victory-point' }, { type: 'tech' }],
      [{ type: 'tech' }],
    ],
  },
  {
    name: { de: 'Schlacht an der imperialen Forschungs-Station', en: 'Battle at the Imperial Research Station' },
    boardSpaceId: 'Imperial Basin',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'focus' }],
      [{ type: 'water' }, { type: 'leader-heal' }, { type: 'focus' }],
      [{ type: 'focus' }],
    ],
  },

  // Hagga Basin
  {
    name: { de: 'Schlacht in den Spice-Feldern', en: 'Battle in the Spice Fields' },
    boardSpaceId: 'Hagga Basin',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'spice' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'spice', amount: 2 }],
      [{ type: 'spice' }],
    ],
  },
  {
    name: { de: 'Schlacht bei Tsimpo', en: 'Battle at Tsimpo Village' },
    boardSpaceId: 'Hagga Basin',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'solari', amount: 2 }],
      [{ type: 'faction-influence-up-choice' }, { type: 'solari', amount: 2 }, { type: 'intrigue' }],
      [{ type: 'intrigue' }],
    ],
  },
  {
    name: { de: 'Schlacht bei Felssplitterberg', en: 'Battle at Splintered Rock' },
    boardSpaceId: 'Hagga Basin',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'focus' }],
      [{ type: 'spice', amount: 2 }, { type: 'focus' }, { type: 'focus' }],
      [{ type: 'spice' }],
    ],
  },

  // The Great Flat
  {
    name: { de: 'Schlacht in den Spice-Feldern', en: 'Battle in the Spice Fields' },
    boardSpaceId: 'The Great Flat',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'spice' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'spice', amount: 2 }],
      [{ type: 'spice' }],
    ],
  },
  {
    name: { de: 'Schlacht am falschen Wall (West)', en: 'Battle at the False Wall West' },
    boardSpaceId: 'The Great Flat',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'focus' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'spice' }, { type: 'focus' }],
      [{ type: 'spice' }],
    ],
  },
  {
    name: { de: 'Schlacht am Wind Pass', en: 'Battle at the Wind Pass' },
    boardSpaceId: 'The Great Flat',
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'leader-heal' }],
      [{ type: 'intrigue' }, { type: 'intrigue' }, { type: 'leader-heal' }],
      [{ type: 'intrigue' }],
    ],
  },

  // Tueks Sietch
  {
    name: { de: 'Schlacht bei den Schmuggler-Lägern', en: "Battle at the Smuggler's Communities" },
    boardSpaceId: "Tuek's Sietch",
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'solari', amount: 2 }],
      [{ type: 'faction-influence-up-choice' }, { type: 'solari', amount: 3 }],
      [{ type: 'solari', amount: 2 }],
    ],
  },
  {
    name: { de: 'Schlacht am Schmuggler-Raumhafen', en: "Battle at the Smuggler's Spaceport" },
    boardSpaceId: "Tuek's Sietch",
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'tech' }],
      [{ type: 'faction-influence-up-choice' }, { type: 'water' }, { type: 'tech' }],
      [{ type: 'tech' }],
    ],
  },
  {
    name: { de: 'Schlacht am Harg Pass', en: 'Battle at Harg Pass' },
    boardSpaceId: "Tuek's Sietch",
    lvl: 1,
    rewards: [
      [{ type: 'location-control' }, { type: 'focus' }],
      [{ type: 'solari', amount: 3 }, { type: 'focus' }, { type: 'leader-heal' }],
      [{ type: 'leader-heal' }],
    ],
  },
];
