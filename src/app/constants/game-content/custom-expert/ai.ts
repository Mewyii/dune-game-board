import { AI } from '../../board-settings';
import {
  getRewardEffectEvaluation,
  getRewardEffectEvaluationForTurnState,
  getTechTileBuyEvaluation,
} from './ai-effect-evaluation';

export const aiCustomExpert: AI = {
  name: 'custom-expert',
  rewardEffectEvaluation: getRewardEffectEvaluation,
  rewardEffectEvaluationForTurnState: getRewardEffectEvaluationForTurnState,
  techTileBuyEvaluation: getTechTileBuyEvaluation,
};
