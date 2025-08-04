import { EffectReward } from './effect';
import { LanguageString } from './language';

export interface Conflict {
  name: LanguageString;
  lvl: 1 | 2 | 3;
  rewards: EffectReward[][];
}
