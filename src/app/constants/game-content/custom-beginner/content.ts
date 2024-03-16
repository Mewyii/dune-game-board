import { GameContent } from '../../board-settings';
import { locationsCustom } from '../custom-beginner/locations-custom';
import { factionsCustomBeginner } from './factions-custom-beginner';
import { ixCustomBeginner } from './ix-custom-beginner';

export const gameContentCustomBeginner: GameContent = {
  factions: factionsCustomBeginner,
  locations: locationsCustom,
  ix: ixCustomBeginner,
  useTechTiles: false,
  useVictoryPointBoni: true,
};
