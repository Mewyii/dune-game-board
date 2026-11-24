import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DuneLocation } from 'src/app/models';

import { Player } from 'src/app/models/player';
import { GameManager } from 'src/app/services/game-manager.service';
import { LeadersService } from 'src/app/services/leaders.service';
import { LocationsService } from 'src/app/services/location-manager.service';
import { PlayersService } from 'src/app/services/players.service';

@Component({
  selector: 'dune-location',
  templateUrl: './dune-location.component.html',
  styleUrls: ['./dune-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DuneLocationComponent implements OnInit, OnChanges, OnDestroy {
  subscriptions: Subscription[] = [];
  private headingResizeObserver: ResizeObserver | undefined;

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

  public isActiveForPlayerCount = true;

  constructor(
    private locationsService: LocationsService,
    private playersService: PlayersService,
    private leaderService: LeadersService,
    private gameManager: GameManager,
    private elementRef: ElementRef<HTMLElement>,
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    const host = this.elementRef.nativeElement;
    const tile = host.querySelector<HTMLElement>('.location-tile');
    const heading = host.querySelector<HTMLElement>('.location-tile .heading');
    if (!tile || !heading || typeof ResizeObserver === 'undefined') {
      return;
    }

    // Feeds the real title width into the ::after clip-path so the frame follows the heading.
    const updateHeadingWidth = () => {
      tile.style.setProperty('--heading-width', `${heading.offsetWidth}px`);
    };
    updateHeadingWidth();
    this.headingResizeObserver = new ResizeObserver(updateHeadingWidth);
    this.headingResizeObserver.observe(heading);
  }

  ngOnInit(): void {
    const locationOwnerIdSub = this.locationsService
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

    const playersSub = this.playersService.players$.subscribe((players) => {
      if (this.location.actionField.activeForPlayerCount) {
        this.isActiveForPlayerCount = players.length >= this.location.actionField.activeForPlayerCount;
      }
    });

    this.subscriptions.push(locationOwnerIdSub, activePlayerIdSub, playersSub);
  }

  ngOnDestroy(): void {
    this.headingResizeObserver?.disconnect();
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
