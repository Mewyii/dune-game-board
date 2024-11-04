import { Reward, RewardType } from '../models';

export function isFactionScoreReward(reward: Reward) {
  if (
    reward.type === 'faction-influence-up-bene' ||
    reward.type === 'faction-influence-up-fremen' ||
    reward.type === 'faction-influence-up-emperor' ||
    reward.type === 'faction-influence-up-guild'
  ) {
    return true;
  }
  return false;
}

export function isFactionScoreRewardType(
  rewardType: RewardType
): rewardType is
  | 'faction-influence-up-bene'
  | 'faction-influence-up-fremen'
  | 'faction-influence-up-emperor'
  | 'faction-influence-up-guild' {
  if (
    rewardType === 'faction-influence-up-bene' ||
    rewardType === 'faction-influence-up-fremen' ||
    rewardType === 'faction-influence-up-emperor' ||
    rewardType === 'faction-influence-up-guild'
  ) {
    return true;
  }
  return false;
}

export function isFactionScoreCost(reward: Reward) {
  if (
    reward.type === 'faction-influence-down-bene' ||
    reward.type === 'faction-influence-down-fremen' ||
    reward.type === 'faction-influence-down-emperor' ||
    reward.type === 'faction-influence-down-guild'
  ) {
    return true;
  }
  return false;
}

export function isFactionScoreCostType(
  rewardType: RewardType
): rewardType is
  | 'faction-influence-down-bene'
  | 'faction-influence-down-fremen'
  | 'faction-influence-down-emperor'
  | 'faction-influence-down-guild' {
  if (
    rewardType === 'faction-influence-down-bene' ||
    rewardType === 'faction-influence-down-fremen' ||
    rewardType === 'faction-influence-down-emperor' ||
    rewardType === 'faction-influence-down-guild'
  ) {
    return true;
  }
  return false;
}
