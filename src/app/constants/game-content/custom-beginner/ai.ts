import { AI } from '../../board-settings';
import { getRewardEffectEvaluation, getRewardEffectEvaluationForTurnState } from './ai-effect-evaluation';

export const aiCustomBeginner: AI = {
  name: 'custom-beginner',
  rewardEffectEvaluation: getRewardEffectEvaluation,
  rewardEffectEvaluationForTurnState: getRewardEffectEvaluationForTurnState,
};
