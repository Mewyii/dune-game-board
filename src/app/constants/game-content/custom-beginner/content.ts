import { GameContent } from '../../board-settings';
import { locationsCustom } from '../custom-beginner/locations-custom';
import { factionsCustomBeginner } from './factions-custom-beginner';
import { ixCustomBeginner } from './ix-custom-beginner';

export const gameContentCustomBeginner: GameContent = {
  name: 'custom-beginner',
  factions: factionsCustomBeginner,
  locations: locationsCustom,
  ix: ixCustomBeginner,
  useTechTiles: false,
  finaleTrigger: 8,
  victoryPointBoni: [
    { score: 1, reward: { type: 'currency' } },
    { score: 2, reward: { type: 'troop' } },
    { score: 3, reward: { type: 'persuasion', amount: 1 } },
    { score: 4, reward: { type: 'currency' } },
    { score: 5, reward: { type: 'troop' } },
    { score: 6, reward: { type: 'card-round-start', amount: 1 } },
    { score: 7, reward: { type: 'currency' } },
    { score: 8, reward: { type: 'troop' } },
    { score: 9, reward: { type: 'persuasion', amount: 1 } },
    { score: 10, reward: { type: 'currency' } },
    { score: 11, reward: { type: 'troop' } },
    { score: 12, reward: { type: 'card-round-start', amount: 1 } },
    { score: 13, reward: { type: 'currency' } },
  ],
};
