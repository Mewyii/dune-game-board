import { Component, Input, OnInit } from '@angular/core';
import { DuneLocation, RewardType } from 'src/app/models';
import { isResourceType } from 'src/app/helpers/resources';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { GameManager } from 'src/app/services/game-manager.service';
import { LocationManager } from 'src/app/services/location-manager.service';
import { Player, PlayerManager } from 'src/app/services/player-manager.service';

@Component({
  selector: 'app-dune-location',
  templateUrl: './dune-location.component.html',
  styleUrls: ['./dune-location.component.scss'],
})
export class DuneLocationComponent implements OnInit {
  @Input() location: DuneLocation = {
    color: '#6b5233',
    position: {
      marginTop: 1000,
      marginLeft: 2250,
    },
    actionField: {
      title: { de: 'arrakeen', en: 'arrakeen' },
      actionType: 'town',
      rewards: [
        { type: 'troop', amount: 1 },
        { type: 'card-draw', amount: 1 },
      ],
      pathToImage: '',
      isBattlefield: true,
    },
  };

  public owner: Player | undefined;

  constructor(private locationManager: LocationManager, private playerManager: PlayerManager) {}

  ngOnInit(): void {
    this.locationManager.locationOwnerId$(this.location.actionField.title.en).subscribe((ownerId) => {
      if (ownerId) {
        this.owner = this.playerManager.getPlayer(ownerId);
      } else {
        this.owner = undefined;
      }
    });
  }

  onOwnerIndicatorClicked() {
    if (!this.playerManager.isLastPlayer(this.owner?.id)) {
      const nextPlayerId = this.playerManager.getNextPlayerId(this.owner?.id);
      this.locationManager.changeLocationOwner(this.location.actionField.title.en, nextPlayerId);
    } else {
      this.locationManager.resetLocationOwner(this.location.actionField.title.en);
    }
  }

  onActionFieldClicked(event: { playerId: number }) {
    const ownerReward = this.location.ownerReward;
    if (ownerReward && isResourceType(ownerReward.type)) {
      if (this.owner && this.owner.id !== event.playerId) {
        this.playerManager.addResourceToPlayer(this.owner.id, ownerReward.type, ownerReward.amount ?? 1);
      }
    }
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }
}
