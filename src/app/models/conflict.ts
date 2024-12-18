import { LanguageString } from './language';
import { Reward } from './reward';

export interface Conflict {
  name: LanguageString;
  lvl: 1 | 2 | 3;
  rewards: Reward[][];
}
