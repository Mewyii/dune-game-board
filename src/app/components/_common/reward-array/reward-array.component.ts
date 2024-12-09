import { Component, Input } from '@angular/core';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { Reward, RewardType } from 'src/app/models';

@Component({
  selector: 'dune-reward-array',
  templateUrl: './reward-array.component.html',
  styleUrl: './reward-array.component.scss',
})
export class RewardArrayComponent {
  @Input() rewards: Reward[] = [];
  @Input() size: string = '32px';

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }
}
