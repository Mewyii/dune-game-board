import { GameContent } from '../../board-settings';
import { aiGoalsCustomAdvanced } from './ai-goals';
import { factionsCustomAdvanced } from './factions';
import { ixCustomAdvanced } from './ix';
import { locationsCustomAdvanced } from './locations';

export const gameContentCustomAdvanced: GameContent = {
  name: 'custom-advanced',
  factions: factionsCustomAdvanced,
  locations: locationsCustomAdvanced,
  ix: ixCustomAdvanced,
  useTechTiles: true,
  finaleTrigger: 8,
  victoryPointBoni: [
    { score: 1, reward: { type: 'solari' } },
    { score: 2, reward: { type: 'troop' } },
    { score: 3, reward: { type: 'persuasion', amount: 1 } },
    { score: 4, reward: { type: 'solari' } },
    { score: 5, reward: { type: 'troop' } },
    { score: 6, reward: { type: 'card-round-start', amount: 1 } },
    { score: 7, reward: { type: 'solari' } },
    { score: 8, reward: { type: 'troop' } },
    { score: 9, reward: { type: 'persuasion', amount: 1 } },
    { score: 10, reward: { type: 'solari' } },
    { score: 11, reward: { type: 'troop' } },
    { score: 12, reward: { type: 'card-round-start', amount: 1 } },
    { score: 13, reward: { type: 'solari' } },
  ],
  troopCombatStrength: 2,
  dreadnoughtCombatStrength: 4,
  highCouncilPersuasion: 3,
  startingResources: [{ type: 'water', amount: 1 }],
  aiGoals: aiGoalsCustomAdvanced,
};
