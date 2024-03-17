import { GameContent } from '../../board-settings';
import { locationsCustom } from '../custom-beginner/locations-custom';
import { factionsCustomAdvanced } from './factions-custom-advanced';
import { ixCustomAdvanced } from './ix-custom-advanced';

export const gameContentCustomAdvanced: GameContent = {
  name: 'custom-advanced',
  factions: factionsCustomAdvanced,
  locations: locationsCustom,
  ix: ixCustomAdvanced,
  useTechTiles: true,
  useVictoryPointBoni: true,
};
