import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DuneLocation } from 'src/app/models';

import { Player } from 'src/app/models/player';
import { GameManager } from 'src/app/services/game-manager.service';
import { LeadersService } from 'src/app/services/leaders.service';
import { LocationManager } from 'src/app/services/location-manager.service';
import { PlayersService } from 'src/app/services/players.service';

@Component({
  selector: 'dune-location',
  templateUrl: './dune-location.component.html',
  styleUrls: ['./dune-location.component.scss'],
  standalone: false,
})
export class DuneLocationComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

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
  @Input() readonly = false;

  public activePlayerId = 0;

  public owner: Player | undefined;
  public leaderInitials = '';

  constructor(
    private locationManager: LocationManager,
    private playersService: PlayersService,
    private leaderService: LeadersService,
    private gameManager: GameManager,
  ) {}

  ngOnInit(): void {
    const locationOwnerIdSub = this.locationManager
      .locationOwnerId$(this.location.actionField.title.en)
      .subscribe((ownerId) => {
        if (ownerId) {
          this.owner = this.playersService.getPlayer(ownerId);
          if (this.owner) {
            this.leaderInitials = this.leaderService.getLeader(this.owner.id)?.house?.en ?? '';
          }
        } else {
          this.owner = undefined;
          this.leaderInitials = '';
        }
      });

    const activePlayerIdSub = this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
    });

    this.subscriptions.push(locationOwnerIdSub, activePlayerIdSub);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onOwnerIndicatorClicked() {
    if (!this.readonly) {
      this.gameManager.changeLocationOwner(this.location.actionField.title.en, this.gameManager.activePlayerId);
    }
  }
}
