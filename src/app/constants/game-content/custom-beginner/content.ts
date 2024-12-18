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
    // { score: 1, reward: { type: 'solari' } },
    // { score: 2, reward: { type: 'troop' } },
    { score: 2, reward: { type: 'persuasion', amount: 1 } },
    // { score: 4, reward: { type: 'solari' } },
    // { score: 5, reward: { type: 'troop' } },
    { score: 5, reward: { type: 'persuasion', amount: 1 } },
    // { score: 7, reward: { type: 'solari' } },
    // { score: 8, reward: { type: 'troop' } },
    { score: 8, reward: { type: 'persuasion', amount: 1 } },
    // { score: 10, reward: { type: 'solari' } },
    // { score: 11, reward: { type: 'troop' } },
    { score: 11, reward: { type: 'persuasion', amount: 1 } },
    // { score: 13, reward: { type: 'solari' } },
  ],
  troopCombatStrength: 2,
  dreadnoughtCombatStrength: 4,
  highCouncilPersuasion: 3,
  startingResources: [{ type: 'solari', amount: 1 }],
  aiGoals: aiGoalsCustomBeginner,
  recruitmentCardAmount: 5,
};
