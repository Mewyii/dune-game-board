import { Component, Input, OnInit } from '@angular/core';
import { DuneLocation, RewardType } from 'src/app/models';
import { isResourceType } from 'src/app/helpers/resources';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { GameManager } from 'src/app/services/game-manager.service';
import { LocationManager } from 'src/app/services/location-manager.service';
import { Player, PlayerManager } from 'src/app/services/player-manager.service';
import { LeadersService } from 'src/app/services/leaders.service';
import { AudioManager } from 'src/app/services/audio-manager.service';

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
      title: { de: 'Arrakeen', en: 'Arrakeen' },
      actionType: 'town',
      rewards: [
        { type: 'troop', amount: 1 },
        { type: 'card-draw', amount: 1 },
      ],
      pathToImage: '',
    },
  };

  public owner: Player | undefined;
  public leaderInitials = '';

  constructor(
    private locationManager: LocationManager,
    private playerManager: PlayerManager,
    private leaderService: LeadersService,
    private audioManager: AudioManager
  ) {}

  ngOnInit(): void {
    this.locationManager.locationOwnerId$(this.location.actionField.title.en).subscribe((ownerId) => {
      if (ownerId) {
        this.owner = this.playerManager.getPlayer(ownerId);
        if (this.owner) {
          this.leaderInitials = this.leaderService.getLeader(this.owner.id)?.house?.en ?? '';
        }
      } else {
        this.owner = undefined;
        this.leaderInitials = '';
      }
    });
  }

  onOwnerIndicatorClicked() {
    this.audioManager.playSound('click-soft');
    if (this.location.ownerReward?.type === 'persuasion') {
      if (this.owner) {
        this.playerManager.removePermanentPersuasionFromPlayer(this.owner.id, 1);
      }
    }
    if (!this.playerManager.isLastPlayer(this.owner?.id)) {
      const nextPlayerId = this.playerManager.getNextPlayerId(this.owner?.id);
      this.locationManager.changeLocationOwner(this.location.actionField.title.en, nextPlayerId);

      if (this.location.ownerReward?.type === 'persuasion') {
        this.playerManager.addPermanentPersuasionToPlayer(nextPlayerId, 1);
      }
    } else {
      this.locationManager.resetLocationOwner(this.location.actionField.title.en);
    }
  }

  onActionFieldClicked(event: { playerId: number }) {
    // const ownerReward = this.location.ownerReward;
    // if (ownerReward && isResourceType(ownerReward.type)) {
    //   if (this.owner && this.owner.id !== event.playerId) {
    //     this.playerManager.addResourceToPlayer(this.owner.id, ownerReward.type, ownerReward.amount ?? 1);
    //   }
    // }
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }
}
