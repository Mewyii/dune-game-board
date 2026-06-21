import { GameContent } from '../../board-settings';
import { conflictsCustomExpert } from './conflicts';
import { customCardsCustomExpert } from './custom-cards';
import { factionsCustomExpert } from './factions';
import { ixCustomExpert } from './ix';
import { fivePlayerLocations, threePlayerLocations, zeroPlayerLocations } from './locations';

export const gameContentCustomExpert: GameContent = {
  name: 'Sands of Arrakis',
  factions: factionsCustomExpert,
  locations: [
    { playerCount: 0, locations: zeroPlayerLocations },
    { playerCount: 3, locations: threePlayerLocations },
    { playerCount: 5, locations: fivePlayerLocations },
  ],
  conflicts: conflictsCustomExpert,
  ix: ixCustomExpert,
  useTechTiles: true,
  useDreadnoughts: true,
  finaleTrigger: [
    { playerCount: 0, trigger: 9 },
    { playerCount: 3, trigger: 8 },
    { playerCount: 5, trigger: 7 },
  ],
  victoryPointBoni: [
    { score: 2, reward: { type: 'persuasion', amount: 1 } },
    { score: 5, reward: { type: 'persuasion', amount: 1 } },
    { score: 8, reward: { type: 'persuasion', amount: 1 } },
    { score: 11, reward: { type: 'persuasion', amount: 1 } },
  ],
  troopCombatStrength: 2,
  dreadnoughtCombatStrength: 5,
  maxPlayerDreadnoughtCount: 2,
  maxPlayerIntrigueCount: 3,
  highCouncilPersuasion: 4,
  startingResources: [{ type: 'leader-heal', amount: 3 }],
  customCards: customCardsCustomExpert,
  recruitmentCardAmount: 6,
  locationTakeoverTroopCosts: 1,
  combatMaxDeployableUnits: 4,
  factionInfluenceMaxScore: 6,
  factionInfluenceAllianceTreshold: 4,
  imperiumRowCards: 6,
  aiName: 'custom-expert',
  maxPlayers: 6,
  cardAcquiringRules: {
    imperiumRow: 'below-deck',
    limited: 'below-deck',
    unlimited: 'below-deck',
    foldspace: 'hand',
  },
  churnRowCards: true,
  leaderCombatStrength: 3,
  conflictsMode: 'pick',
  conflictCardsPerLevel: [24],
};
