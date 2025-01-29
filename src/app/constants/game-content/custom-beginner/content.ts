import { GameContent } from '../../board-settings';
import { locationsCustomBeginner } from './locations';
import { factionsCustomBeginner } from './factions';
import { ixCustomBeginner } from './ix';
import { aiGoalsCustomBeginner } from './ai-goals';
import { customCardsCustomBeginner } from './custom-cards';

export const gameContentCustomBeginner: GameContent = {
  name: 'custom-beginner',
  factions: factionsCustomBeginner,
  locations: locationsCustomBeginner,
  ix: ixCustomBeginner,
  useTechTiles: false,
  customCards: customCardsCustomBeginner,
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
  aiGoals: aiGoalsCustomBeginner,
  recruitmentCardAmount: 6,
  combatMaxDeployableUnits: 2,
  factionInfluenceMaxScore: 6,
  factionInfluenceAllianceTreshold: 4,
  imperiumRowCards: 6,
};
