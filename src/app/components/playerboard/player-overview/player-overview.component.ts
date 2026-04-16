import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Subscription } from 'rxjs';

import { Player } from 'src/app/models/player';
import { CardsService } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { LeadersService } from 'src/app/services/leaders.service';
import { PlayerAgentsService } from 'src/app/services/player-agents.service';
import { PlayerResourcesService, Resources } from 'src/app/services/player-resources.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-player-overview',
  templateUrl: './player-overview.component.html',
  styleUrl: './player-overview.component.scss',
  standalone: false,
})
export class PlayerOverviewComponent implements OnInit, OnDestroy {
  @Input() player!: Player;

  public playerLeaderName: string | undefined;
  public playerDeckCards: number | undefined;
  public playerDiscardPileCards: number | undefined;
  public playerHandCards: number | undefined;
  public playerIntrigues: number | undefined;
  public playerResources: Resources | undefined;
  public availablePlayerAgents: number = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    public gameManager: GameManager,
    private cardsService: CardsService,
    private intriguesService: IntriguesService,
    public t: TranslateService,
    private leadersService: LeadersService,
    private playerAgentsService: PlayerAgentsService,
    private playerResourcesService: PlayerResourcesService,
  ) {}

  ngOnInit(): void {
    const deckSub = this.cardsService.playerDeck$(this.player.id).subscribe((cards) => {
      this.playerDeckCards = cards?.length;
    });

    const handSub = this.cardsService.playerHand$(this.player.id).subscribe((cards) => {
      this.playerHandCards = cards?.length;
    });

    const dpSub = this.cardsService.playerDiscardPile$(this.player.id).subscribe((cards) => {
      this.playerDiscardPileCards = cards?.length;
    });

    const intrigueSub = this.intriguesService.playerIntrigues$(this.player.id).subscribe((intrigues) => {
      this.playerIntrigues = intrigues?.length;
    });

    const resourceSub = this.playerResourcesService.playerResources$(this.player.id).subscribe((resources) => {
      this.playerResources = resources;
    });

    const agentSub = this.playerAgentsService.availablePlayerAgents$(this.player.id).subscribe((agents) => {
      this.availablePlayerAgents = agents.length;
    });

    const leaderSub = this.leadersService.playerLeaders$.subscribe((leaders) => {
      const playerLeader = leaders.find((x) => x.playerId === this.player.id);
      if (playerLeader) {
        this.playerLeaderName = this.t.translateLS(playerLeader.leader.name).toUpperCase();
      } else {
        this.playerLeaderName = 'P. ' + this.player.id;
      }
    });

    this.subscriptions.push(deckSub);
    this.subscriptions.push(handSub);
    this.subscriptions.push(dpSub);
    this.subscriptions.push(intrigueSub);
    this.subscriptions.push(resourceSub);
    this.subscriptions.push(agentSub);
    this.subscriptions.push(leaderSub);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this.subscriptions = [];
  }

  onSetAIActiveClicked(player: Player, event: MatSlideToggleChange) {
    this.gameManager.setAIActiveForPlayer(player, event.checked);
  }
}
