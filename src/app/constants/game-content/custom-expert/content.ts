import { GameContent } from '../../board-settings';
import { ixCustomAdvanced } from '../custom-advanced/ix-custom-advanced';
import { locationsCustomBeginner } from '../custom-beginner/locations-custom-beginner';
import { factionsCustomExpert } from './factions-custom-expert';

export const gameContentCustomExpert: GameContent = {
  name: 'custom-expert',
  factions: factionsCustomExpert,
  locations: locationsCustomBeginner,
  ix: ixCustomAdvanced,
  useTechTiles: true,
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
  troopCombatStrength: 2,
  dreadnoughtCombatStrength: 4,
  highCouncilPersuasion: 3,
};
