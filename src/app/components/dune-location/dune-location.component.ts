import { Component, Input, OnInit } from '@angular/core';
import { DuneLocation, RewardType } from 'src/app/models';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { GameManager } from 'src/app/services/game-manager.service';
import { LocationManager } from 'src/app/services/location-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { LeadersService } from 'src/app/services/leaders.service';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { GameModifiersService } from 'src/app/services/game-modifier.service';
import { Player } from 'src/app/models/player';

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

  public activePlayerId = 0;
  public canBuildupLocationChange = false;
  public locationChangeBuildupAmount: number | undefined;

  public owner: Player | undefined;
  public leaderInitials = '';

  constructor(
    private locationManager: LocationManager,
    private playerManager: PlayersService,
    private leaderService: LeadersService,
    private audioManager: AudioManager,
    private gameManager: GameManager,
    private gameModifierService: GameModifiersService
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

    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;

      this.canBuildupLocationChange = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'location-change-buildup'
      );

      this.locationChangeBuildupAmount = this.gameModifierService.getPlayerLocationChangeBuildupModifier(
        this.activePlayerId,
        this.location.actionField.title.en
      )?.changeAmount;
    });

    this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.canBuildupLocationChange = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'location-change-buildup'
      );

      this.locationChangeBuildupAmount = this.gameModifierService.getPlayerLocationChangeBuildupModifier(
        this.activePlayerId,
        this.location.actionField.title.en
      )?.changeAmount;
    });
  }

  onOwnerIndicatorClicked() {
    this.gameManager.changeLocationOwner(this.location.actionField.title.en, this.gameManager.activePlayerId);
  }

  onActionFieldClicked(event: { playerId: number }) {
    // const ownerReward = this.location.ownerReward;
    // if (ownerReward && isResourceType(ownerReward.type)) {
    //   if (this.owner && this.owner.id !== event.playerId) {
    //     this.playerManager.addResourceToPlayer(this.owner.id, ownerReward.type, ownerReward.amount ?? 1);
    //   }
    // }
  }

  onBuildUpLocationChangeClicked() {
    this.audioManager.playSound('click-soft');
    this.gameModifierService.increaseLocationChangeModifier(this.activePlayerId, this.location.actionField.title.en, 1);
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }
}
