import { GameContent } from '../../board-settings';
import { customCardsCustomExpert } from './custom-cards';
import { factionsCustomExpert } from './factions';
import { ixCustomExpert } from './ix';
import { locationsCustomExpert } from './locations';

export const gameContentCustomExpert: GameContent = {
  name: 'custom-expert',
  factions: factionsCustomExpert,
  locations: locationsCustomExpert,
  ix: ixCustomExpert,
  useTechTiles: true,
  useDreadnoughts: true,
  finaleTrigger: 8,
  victoryPointBoni: [
    { score: 2, reward: { type: 'persuasion', amount: 1 } },
    { score: 5, reward: { type: 'persuasion', amount: 1 } },
    { score: 8, reward: { type: 'persuasion', amount: 1 } },
    { score: 11, reward: { type: 'persuasion', amount: 1 } },
  ],
  troopCombatStrength: 2,
  dreadnoughtCombatStrength: 4,
  highCouncilPersuasion: 3,
  startingResources: [],
  customCards: customCardsCustomExpert,
  recruitmentCardAmount: 6,
  locationTakeoverTroopCosts: 1,
  combatMaxDeployableUnits: 4,
  factionInfluenceMaxScore: 6,
  factionInfluenceAllianceTreshold: 4,
  imperiumRowCards: 6,
  aiName: 'custom-expert',
};
