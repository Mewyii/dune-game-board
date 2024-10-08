import { Component, OnInit } from '@angular/core';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { RewardType } from 'src/app/models';

interface HomeworldUpgrade {
  rewardType: RewardType;
  upgradeCount: number;
  initialAmount: number;
}

@Component({
  selector: 'dune-homeworld-tile',
  templateUrl: './homeworld-tile.component.html',
  styleUrls: ['./homeworld-tile.component.scss'],
})
export class HomeworldTileComponent implements OnInit {
  public upgrades: HomeworldUpgrade[] = [
    { rewardType: 'persuasion', initialAmount: 1, upgradeCount: 2 },
    { rewardType: 'solari', initialAmount: 2, upgradeCount: 2 },
    { rewardType: 'troop', initialAmount: 1, upgradeCount: 2 },
    { rewardType: 'water', initialAmount: 0, upgradeCount: 2 },
  ];

  public planetColors = [this.getRandomDegree(), this.getRandomDegree(), this.getRandomDegree(), this.getRandomDegree()];

  public showTiles = true;

  constructor() {}

  ngOnInit(): void {}

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  public getRandomDegree() {
    return Math.floor(Math.random() * 360) + 1;
  }
}
