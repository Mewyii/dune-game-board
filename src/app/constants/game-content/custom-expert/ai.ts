import { AI } from '../../board-settings';
import { getRewardEffectEvaluation, getRewardEffectEvaluationForTurnState } from './ai-effect-evaluation';

export const aiCustomExpert: AI = {
  name: 'custom-expert',
  rewardEffectEvaluation: getRewardEffectEvaluation,
  rewardEffectEvaluationForTurnState: getRewardEffectEvaluationForTurnState,
};
