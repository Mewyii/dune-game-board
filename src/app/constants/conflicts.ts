import { normalizeNumber } from '../helpers/common';
import { isResourceType } from '../helpers/resources';
import { LanguageString, ResourceType, Reward, RewardType } from '../models';
import { GameState } from '../services/ai/models';
import { Player } from '../services/player-manager.service';

export interface Conflict {
  name: LanguageString;
  lvl: 1 | 2 | 3;
  row: number;
  column: number;
  rewards: Reward[][];
}

export const conflicts: Conflict[] = [
  {
    name: { de: 'Wüstenkraft', en: 'desert power' },
    lvl: 2,
    row: 1,
    column: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'water' }],
      [{ type: 'water' }, { type: 'spice', amount: 1 }],
      [{ type: 'spice', amount: 1 }],
    ],
  },
  {
    name: { de: 'Raub der Lagerbestände', en: 'raid stockpiles' },
    lvl: 2,
    row: 1,
    column: 2,
    rewards: [
      [{ type: 'intrigue' }, { type: 'spice', amount: 3 }],
      [{ type: 'spice', amount: 2 }],
      [{ type: 'spice', amount: 1 }],
    ],
  },
  {
    name: { de: 'Heimlichtuerei', en: 'cloak and dagger' },
    lvl: 2,
    row: 1,
    column: 3,
    rewards: [
      [{ type: 'faction-influence-up-choice' }, { type: 'intrigue' }, { type: 'intrigue' }],
      [{ type: 'intrigue' }, { type: 'spice', amount: 1 }],
      [{ type: 'intrigue' }, { type: 'helper-or' }, { type: 'spice', amount: 1 }],
    ],
  },
  {
    name: { de: 'Machenschaften', en: 'machinations' },
    lvl: 2,
    row: 1,
    column: 4,
    rewards: [
      [{ type: 'faction-influence-up-choice' }, { type: 'faction-influence-up-choice' }],
      [{ type: 'water' }, { type: 'solari', amount: 2 }],
      [{ type: 'water' }],
    ],
  },
  {
    name: { de: 'Sortieren des Chaos', en: 'sort trough the chaos' },
    lvl: 2,
    row: 1,
    column: 5,
    rewards: [
      [{ type: 'mentat' }, { type: 'intrigue' }, { type: 'solari', amount: 2 }],
      [{ type: 'intrigue' }, { type: 'solari', amount: 2 }],
      [{ type: 'solari', amount: 2 }],
    ],
  },
  {
    name: { de: 'Schrecklicher Zweck', en: 'terrible purpose' },
    lvl: 2,
    row: 1,
    column: 6,
    rewards: [
      [{ type: 'victory-point' }, { type: 'card-destroy' }],
      [{ type: 'water' }, { type: 'spice', amount: 1 }],
      [{ type: 'spice', amount: 1 }],
    ],
  },
  {
    name: { de: 'Gildenbanküberfall', en: 'guild bank raid' },
    lvl: 2,
    row: 2,
    column: 1,
    rewards: [[{ type: 'solari', amount: 6 }], [{ type: 'solari', amount: 4 }], [{ type: 'solari', amount: 2 }]],
  },
  {
    name: { de: 'Belagerung von Arrakeen', en: 'siege of arrakeen' },
    lvl: 2,
    row: 2,
    column: 2,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'solari', amount: 4 }],
      [{ type: 'solari', amount: 2 }],
    ],
  },
  {
    name: { de: 'Belagerung von Carthag', en: 'siege of carthag' },
    lvl: 2,
    row: 2,
    column: 3,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'intrigue' }, { type: 'spice', amount: 1 }],
      [{ type: 'spice', amount: 1 }],
    ],
  },
  {
    name: { de: 'Imperiales Becken sichern', en: 'secure imperial basin' },
    lvl: 2,
    row: 2,
    column: 4,
    rewards: [
      [{ type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'water' }, { type: 'water' }],
      [{ type: 'water' }],
    ],
  },
  {
    name: { de: 'Handelsmonopol', en: 'trade monopoly' },
    lvl: 2,
    row: 2,
    column: 5,
    rewards: [
      [{ type: 'shipping' }, { type: 'shipping' }, { type: 'troop' }],
      [{ type: 'intrigue' }, { type: 'water' }],
      [{ type: 'intrigue' }, { type: 'helper-or' }, { type: 'water' }],
    ],
  },
  {
    name: { de: 'Schlacht um das Imperiale Becken', en: 'battle for imperial basin' },
    lvl: 3,
    row: 1,
    column: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'spice', amount: 5 }],
      [{ type: 'spice', amount: 3 }],
    ],
  },
  {
    name: { de: 'Große Vision', en: 'grand vision' },
    lvl: 3,
    row: 1,
    column: 2,
    rewards: [
      [{ type: 'faction-influence-up-twice-choice' }, { type: 'intrigue' }],
      [{ type: 'intrigue' }, { type: 'spice', amount: 3 }],
      [{ type: 'spice', amount: 3 }],
    ],
  },
  {
    name: { de: 'Schlacht um Carthag', en: 'battle for carthag' },
    lvl: 3,
    row: 1,
    column: 3,
    rewards: [
      [{ type: 'victory-point' }, { type: 'victory-point' }, { type: 'location-control' }],
      [{ type: 'intrigue' }, { type: 'spice', amount: 3 }],
      [{ type: 'spice', amount: 3 }],
    ],
  },
  {
    name: { de: 'Schlacht um Arrakeen', en: 'battle for arrakeen' },
    lvl: 3,
    row: 2,
    column: 1,
    rewards: [
      [{ type: 'victory-point' }, { type: 'victory-point' }, { type: 'location-control' }],
      [
        // { type: 'intrigue' }, { type: 'spice', amount: 2 }, { type: 'solari', amount: 3 }
      ],
      [{ type: 'intrigue' }, { type: 'solari', amount: 3 }],
    ],
  },
  {
    name: { de: 'Wirtschaftliche Überlegenheit', en: 'economic supremacy' },
    lvl: 3,
    row: 2,
    column: 2,
    rewards: [
      [
        { type: 'victory-point' },
        // { type: 'solari', amount: 6 },
        // { type: 'helper-trade' },
        // { type: 'spice', amount: 4 },
        // { type: 'helper-trade' },
        // { type: 'victory-point' },
      ],
      [{ type: 'victory-point' }],
      [
        { type: 'spice', amount: 2 },
        { type: 'solari', amount: 2 },
      ],
    ],
  },
];
