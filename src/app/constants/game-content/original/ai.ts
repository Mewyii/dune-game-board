import { AI } from '../../board-settings';
import { getRewardEffectEvaluation, getRewardEffectEvaluationForTurnState } from './ai-effect-evaluation';

export const aiOriginal: AI = {
  name: 'custom-expert',
  rewardEffectEvaluation: getRewardEffectEvaluation,
  rewardEffectEvaluationForTurnState: getRewardEffectEvaluationForTurnState,
};
