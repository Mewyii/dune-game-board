import { GameContent } from '../../board-settings';
import { factionsOriginal } from './factions-original';
import { locationsOriginal } from './locations-original';

export const gameContentOriginal: GameContent = {
  name: 'original',
  factions: factionsOriginal,
  locations: locationsOriginal,
  useTechTiles: false,
  troopCombatStrength: 2,
  dreadnoughtCombatStrength: 3,
  highCouncilPersuasion: 2,
};
