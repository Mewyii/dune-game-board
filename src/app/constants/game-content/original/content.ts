import { GameContent } from '../../board-settings';
import { factionsOriginal } from './factions';
import { locationsOriginal } from './locations';

export const gameContentOriginal: GameContent = {
  name: 'original',
  factions: factionsOriginal,
  locations: locationsOriginal,
  useTechTiles: false,
  troopCombatStrength: 2,
  dreadnoughtCombatStrength: 3,
  highCouncilPersuasion: 2,
  startingResources: [{ type: 'water', amount: 1 }],
};
