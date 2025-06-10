import { GameContent } from '../../board-settings';
import { customCardsOriginal } from './custom-cards';
import { factionsOriginal } from './factions';
import { locationsOriginal } from './locations';

export const gameContentOriginal: GameContent = {
  name: 'original',
  factions: factionsOriginal,
  locations: locationsOriginal,
  useTechTiles: false,
  useDreadnoughts: false,
  troopCombatStrength: 2,
  dreadnoughtCombatStrength: 3,
  highCouncilPersuasion: 2,
  startingResources: [
    { type: 'water', amount: 1 },
    { type: 'troop', amount: 3 },
  ],
  customCards: customCardsOriginal,
  recruitmentCardAmount: 5,
  finaleTrigger: 8,
  combatMaxDeployableUnits: 2,
  factionInfluenceMaxScore: 6,
  factionInfluenceAllianceTreshold: 4,
  imperiumRowCards: 5,
  aiName: 'original',
};
