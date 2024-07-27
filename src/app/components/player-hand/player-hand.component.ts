import { Component, OnInit } from '@angular/core';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { RewardType } from 'src/app/models';
import { CardsService, ImperiumDeckCard, PlayerCard, PlayerCardStack } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { Player, PlayerManager } from 'src/app/services/player-manager.service';

@Component({
  selector: 'dune-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss'],
})
export class PlayerHandComponent implements OnInit {
  public currentPlayer: Player | undefined;
  public activePlayerId: number = 0;
  public playerHandCards: PlayerCardStack | undefined;
  public playerDiscardPiles: PlayerCardStack | undefined;
  public activeCardId = '';
  public playedPlayerCardId: string | undefined;

  public showCards = false;
  public cardsShown: 'hand' | 'discard' = 'hand';

  constructor(private playerManager: PlayerManager, public gameManager: GameManager, private cardsService: CardsService) {}

  ngOnInit(): void {
    this.playerManager.players$.subscribe((players) => {
      this.currentPlayer = players.find((x) => x.id === this.activePlayerId);
    });

    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;

      this.currentPlayer = this.playerManager.getPlayer(this.activePlayerId);

      this.playerHandCards = this.cardsService.playerHands.find((x) => x.playerId === this.activePlayerId);
      this.playerDiscardPiles = this.cardsService.playerDiscardPiles.find((x) => x.playerId === this.activePlayerId);
    });

    this.cardsService.playerHands$.subscribe((playerHandCards) => {
      this.playerHandCards = playerHandCards.find((x) => x.playerId === this.activePlayerId);
    });

    this.cardsService.playerDiscardPiles$.subscribe((playerDiscardPiles) => {
      this.playerDiscardPiles = playerDiscardPiles.find((x) => x.playerId === this.activePlayerId);
    });

    this.cardsService.playedPlayerCards$.subscribe((playedPlayerCards) => {
      this.playedPlayerCardId = playedPlayerCards.find((x) => x.playerId === this.activePlayerId)?.cardId;
    });
  }

  onToggleShowCardsClicked() {
    this.activeCardId = '';
    this.showCards = !this.showCards;
  }

  onDrawCardClicked() {
    this.cardsService.drawPlayerCardsFromDeck(this.activePlayerId, 1);
  }

  onShowHandClicked() {
    this.cardsShown = 'hand';
  }

  onShowDiscardPileClicked() {
    this.cardsShown = 'discard';
  }

  onPlayCardClicked(cardId: string) {
    this.cardsService.setPlayedPlayerCard(this.activePlayerId, cardId);
  }

  onUnPlayCardClicked(cardId: string) {
    this.cardsService.unsetPlayedPlayerCard(this.activePlayerId, cardId);
  }

  onDiscardCardClicked(card: ImperiumDeckCard) {
    this.cardsService.discardPlayerHandCard(this.activePlayerId, card);
    this.activeCardId = '';
  }

  onTrashHandCardClicked(card: ImperiumDeckCard) {
    if (this.currentPlayer) {
      if (this.currentPlayer.turnState === 'agent-placement') {
        this.cardsService.trashPlayerHandCard(this.activePlayerId, card);
        this.activeCardId = '';
      }
      if (this.currentPlayer.turnState === 'reveal' || this.currentPlayer.focusTokens > 0) {
        this.cardsService.trashPlayerHandCard(this.activePlayerId, card);
        this.playerManager.removeFocusTokens(this.activePlayerId, 1);
        this.activeCardId = '';
      }
    }
  }

  onTrashDiscardedCardClicked(card: ImperiumDeckCard) {
    if (this.currentPlayer) {
      if (this.currentPlayer.turnState === 'agent-placement') {
        this.cardsService.trashDiscardedPlayerCard(this.activePlayerId, card);
        this.activeCardId = '';
      }
      if (this.currentPlayer.turnState === 'reveal' || this.currentPlayer.focusTokens > 0) {
        this.cardsService.trashDiscardedPlayerCard(this.activePlayerId, card);
        this.playerManager.removeFocusTokens(this.activePlayerId, 1);
        this.activeCardId = '';
      }
    }
  }

  setCardActive(cardId: string) {
    if (this.activeCardId !== cardId) {
      this.activeCardId = cardId;
    } else {
      this.activeCardId = '';
    }
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }
}