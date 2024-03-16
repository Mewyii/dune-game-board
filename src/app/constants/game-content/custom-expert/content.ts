import { GameContent } from '../../board-settings';
import { ixCustomAdvanced } from '../custom-advanced/ix-custom-advanced';
import { locationsCustom } from '../custom-beginner/locations-custom';
import { factionsCustomExpert } from './factions-custom-expert';

export const gameContentCustomExpert: GameContent = {
  factions: factionsCustomExpert,
  locations: locationsCustom,
  ix: ixCustomAdvanced,
  useTechTiles: true,
  useVictoryPointBoni: true,
};
