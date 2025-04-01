import { Resource, ResourceType, Effect, EffectRewardType } from '../models';

export function isResourceArray(rewards: Effect[]): rewards is Resource[] {
  for (const reward of rewards) {
    if (reward.type !== 'solari' && reward.type !== 'spice' && reward.type !== 'water') {
      return false;
    }
  }
  return true;
}

export function isResource(reward: Effect): reward is Resource {
  if (reward.type === 'solari' || reward.type === 'spice' || reward.type === 'water') {
    return true;
  }
  return false;
}

export function isResourceType(rewardType: EffectRewardType): rewardType is ResourceType {
  if (rewardType === 'solari' || rewardType === 'spice' || rewardType === 'water') {
    return true;
  }
  return false;
}
