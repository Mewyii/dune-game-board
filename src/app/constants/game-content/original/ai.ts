import { AI } from '../../board-settings';
import { getRewardEffectEvaluation, getRewardEffectEvaluationForTurnState } from './ai-effect-evaluation';

export const aiOriginal: AI = {
  name: 'original',
  rewardEffectEvaluation: getRewardEffectEvaluation,
  rewardEffectEvaluationForTurnState: getRewardEffectEvaluationForTurnState,
};
