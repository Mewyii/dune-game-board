import { GameContent } from '../../board-settings';
import { aiGoalsCustomExpert } from './ai-goals';
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
  startingResources: [{ type: 'solari', amount: 1 }],
  aiGoals: aiGoalsCustomExpert,
  customCards: customCardsCustomExpert,
  recruitmentCardAmount: 5,
};
