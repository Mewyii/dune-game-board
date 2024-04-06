import { Resource, ResourceType, Reward, RewardType } from '../models';

export function isResource(reward: Reward): reward is Resource {
  if (reward.type === 'solari' || reward.type === 'spice' || reward.type === 'water') {
    return true;
  }
  return false;
}

export function isResourceType(rewardType: RewardType): rewardType is ResourceType {
  if (rewardType === 'solari' || rewardType === 'spice' || rewardType === 'water') {
    return true;
  }
  return false;
}
