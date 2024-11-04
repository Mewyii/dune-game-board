import { Reward } from '../models';
import { PlayerFactionScoreType } from '../services/player-score-manager.service';

export function getFactionScoreTypeFromReward(reward: Reward): PlayerFactionScoreType | undefined {
  if (reward.type === 'faction-influence-up-bene') {
    return 'bene';
  } else if (reward.type === 'faction-influence-up-fremen') {
    return 'fremen';
  } else if (reward.type === 'faction-influence-up-emperor') {
    return 'emperor';
  } else if (reward.type === 'faction-influence-up-guild') {
    return 'guild';
  }
  return undefined;
}

export function getFactionScoreTypeFromCost(reward: Reward): PlayerFactionScoreType | undefined {
  if (reward.type === 'faction-influence-down-bene') {
    return 'bene';
  } else if (reward.type === 'faction-influence-down-fremen') {
    return 'fremen';
  } else if (reward.type === 'faction-influence-down-emperor') {
    return 'emperor';
  } else if (reward.type === 'faction-influence-down-guild') {
    return 'guild';
  }
  return undefined;
}

export function isFactionScoreType(value: string): value is PlayerFactionScoreType {
  if (value === 'bene' || value === 'fremen' || value === 'emperor' || value === 'guild') {
    return true;
  }
  return false;
}
