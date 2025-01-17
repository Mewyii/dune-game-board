import { GameState } from '../services/ai/models';
import { GameModifiers } from '../services/game-modifier.service';
import { ActiveFactionType } from './faction';
import { LanguageStringAndFontSize } from './imperium-card';
import { LanguageString } from './language';
import { Player } from './player';
import { Reward } from './reward';

export interface TechTileCard {
  name: LanguageString;
  faction?: ActiveFactionType;
  costs: number;
  effects?: Reward[];
  customEffect?: LanguageStringAndFontSize;
  buyEffects?: Reward[];
  imageUrl?: string;
  aiEvaluation: (player: Player, gameState: GameState) => number;
  gameModifiers?: GameModifiers;
}
