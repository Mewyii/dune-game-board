import { Effect, EffectRewardType, Resource, ResourceType, resourceTypes } from '../models';

export function isResourceArray(rewards: Effect[]): rewards is Resource[] {
  for (const reward of rewards) {
    if (resourceTypes.some((x) => x === reward.type)) {
      return false;
    }
  }
  return true;
}

export function isResourceType(rewardType: EffectRewardType): rewardType is ResourceType {
  if (resourceTypes.some((x) => x === rewardType)) {
    return true;
  }
  return false;
}
