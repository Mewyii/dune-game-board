import { LanguageString } from './language';
import { Effect, EffectReward } from './reward';

export interface Conflict {
  name: LanguageString;
  lvl: 1 | 2 | 3;
  rewards: EffectReward[][];
}
