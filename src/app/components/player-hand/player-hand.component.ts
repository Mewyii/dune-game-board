import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { Player } from 'src/app/models/player';
import { AIManager } from 'src/app/services/ai/ai.manager';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CardsService, ImperiumDeckCard, PlayerCardStack, PlayerPlotStack } from 'src/app/services/cards.service';
import { EffectsService } from 'src/app/services/game-effects.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { LoggingService } from 'src/app/services/log.service';
import { PlayerResourcesService } from 'src/app/services/player-resources.service';
import { RoundService } from 'src/app/services/round.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';
import { ImperiumCardsPreviewDialogComponent } from '../_common/dialogs/imperium-cards-preview-dialog/imperium-cards-preview-dialog.component';

@Component({
  selector: 'dune-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss'],
  standalone: false,
})
export class PlayerHandComponent implements OnInit {
  activePlayer: Player | undefined;
  activePlayerId: number = 0;

  playerHandCards: PlayerCardStack | undefined;
  playerDiscardPiles: PlayerCardStack | undefined;
  activeCardId = '';
  hoveredCardId = '';
  playedPlayerCardId: string | undefined;

  playerPlots: PlayerPlotStack | undefined;

  playerIntrigues: IntrigueDeckCard[] | undefined;
  activeIntrigueId = '';

  showCards = false;
  cardsShown: 'hand' | 'discard' | 'deck' = 'hand';

  revealPlots = false;

  constructor(
    public t: TranslateService,
    private gameManager: GameManager,
    private cardsService: CardsService,
    private intriguesService: IntriguesService,
    private audioManager: AudioManager,
    private settingsService: SettingsService,
    private dialog: MatDialog,
    private logService: LoggingService,
    private playerresourcesService: PlayerResourcesService,
    private roundService: RoundService,
    private effectsService: EffectsService,
    private aiManager: AIManager,
  ) {}

  ngOnInit(): void {
    this.gameManager.activePlayer$.subscribe((activePlayer) => {
      if (!this.activePlayer || activePlayer?.id !== this.activePlayer?.id) {
        this.activePlayerId = activePlayer?.id ?? 0;

        this.playerHandCards = this.cardsService.playerHands.find((x) => x.playerId === this.activePlayerId);
        this.playerDiscardPiles = this.cardsService.playerDiscardPiles.find((x) => x.playerId === this.activePlayerId);

        this.playerPlots = this.cardsService.playerPlots.find((x) => x.playerId === this.activePlayerId);

        this.playerIntrigues = this.intriguesService.getPlayerIntrigues(this.activePlayerId);
        this.showCards = false;
        this.cardsShown = 'hand';
      }
      this.activePlayer = activePlayer;
    });

    this.roundService.currentRoundPhase$.subscribe((roundPhase) => {
      this.revealPlots = roundPhase === 'combat-resolvement' && this.roundService.isFinale;
    });

    this.cardsService.playerHands$.subscribe((playerHandCards) => {
      this.playerHandCards = playerHandCards.find((x) => x.playerId === this.activePlayerId);
    });

    this.cardsService.playerDiscardPiles$.subscribe((playerDiscardPiles) => {
      this.playerDiscardPiles = playerDiscardPiles.find((x) => x.playerId === this.activePlayerId);
    });

    this.cardsService.playerPlots$.subscribe((playerPlots) => {
      this.playerPlots = playerPlots.find((x) => x.playerId === this.activePlayerId);
    });

    this.cardsService.playedPlayerCards$.subscribe((playedPlayerCards) => {
      this.playedPlayerCardId = playedPlayerCards.find((x) => x.playerId === this.activePlayerId)?.cardId;
    });

    this.intriguesService.playersIntrigues$.subscribe((playerIntrigues) => {
      this.playerIntrigues = this.intriguesService.getPlayerIntrigues(this.activePlayerId);
    });
  }

  onToggleShowCardsClicked() {
    this.activeCardId = '';
    this.showCards = !this.showCards;
  }

  onDrawCardClicked() {
    if (!this.activePlayer) {
      return;
    }

    this.audioManager.playSound('card-draw');
    this.cardsService.drawPlayerCardsFromDeck(this.activePlayerId, 1);

    this.aiManager.setPreferredFieldsForAIPlayer(this.activePlayer);
  }

  onAddFoldspaceToHandClicked() {
    if (!this.activePlayer) {
      return;
    }

    const foldspaceCard = this.settingsService.getCustomCards()?.find((x) => x.type === 'foldspace');
    if (foldspaceCard) {
      this.effectsService.addRewardToPlayer(this.activePlayerId, { type: 'foldspace' });
    }

    this.aiManager.setPreferredFieldsForAIPlayer(this.activePlayer);
  }

  onShowHandClicked() {
    this.cardsShown = 'hand';
  }

  onShowDiscardPileClicked() {
    this.cardsShown = 'discard';
  }

  onShowDeckClicked() {
    this.cardsShown = 'deck';
  }

  onPlayCardClicked(card: ImperiumDeckCard) {
    this.cardsService.setPlayedPlayerCard(this.activePlayerId, card.id);
    this.logService.logPlayerPlayedCard(this.activePlayerId, this.t.translateLS(card.name));
  }

  onUnPlayCardClicked(cardId: string) {
    this.cardsService.unsetPlayedPlayerCard(this.activePlayerId, cardId);
  }

  onDiscardCardClicked(card: ImperiumDeckCard) {
    this.gameManager.discardImperiumCardFromHand(this.activePlayerId, card);
    this.activeCardId = '';
  }

  onTrashHandCardClicked(card: ImperiumDeckCard) {
    this.gameManager.trashImperiumCard(this.activePlayerId, card, 'hand');
    this.activeCardId = '';
  }

  onAIDiscardCardClicked() {
    if (!this.activePlayer) {
      return;
    }

    this.audioManager.playSound('card-discard');
    this.aiManager.aiDiscardHandCard(this.activePlayerId);

    this.aiManager.setPreferredFieldsForAIPlayer(this.activePlayer);
  }

  onAITrashCardFromHandClicked() {
    if (!this.activePlayer) {
      return;
    }

    this.audioManager.playSound('card-discard');
    this.aiManager.aiTrashCardFromHand(this.activePlayerId);

    this.aiManager.setPreferredFieldsForAIPlayer(this.activePlayer);
  }

  onAITrashCardFromDiscardPileClicked() {
    if (!this.activePlayer) {
      return;
    }

    this.audioManager.playSound('card-discard');
    this.aiManager.aiTrashCardFromDiscardPile(this.activePlayerId);

    this.aiManager.setPreferredFieldsForAIPlayer(this.activePlayer);
  }

  onAIAddCardToHandFromDiscardPileClicked() {
    if (!this.activePlayer) {
      return;
    }

    this.audioManager.playSound('card-discard');
    this.aiManager.aiAddCardToHandFromDiscardPile(this.activePlayerId);

    this.aiManager.setPreferredFieldsForAIPlayer(this.activePlayer);
  }

  onAITrashIntrigueClicked() {
    if (!this.activePlayer) {
      return;
    }

    this.aiManager.aiTrashIntrigue(this.activePlayerId);

    this.aiManager.setPreferredFieldsForAIPlayer(this.activePlayer);
  }

  onReturnDiscardedCardToHandClicked(card: ImperiumDeckCard) {
    if (this.activePlayer) {
      this.cardsService.returnDiscardedPlayerCardToHand(this.activePlayerId, card);
      this.activeCardId = '';
    }
  }

  onTrashDiscardedCardClicked(card: ImperiumDeckCard) {
    if (this.activePlayer) {
      this.gameManager.trashImperiumCard(this.activePlayerId, card, 'discard-pile');
      this.activeCardId = '';
    }
  }

  onShuffleDiscardPileUnderDeckClicked() {
    if (this.activePlayer) {
      this.cardsService.shufflePlayerDiscardPileUnderDeck(this.activePlayerId);
    }
  }

  onShowTopCardClicked() {
    if (this.activePlayer) {
      const deck = this.cardsService.getPlayerDeck(this.activePlayer.id)?.cards;
      if (deck && deck.length > 0) {
        const topCard = deck[0];

        const dialogRef = this.dialog.open(ImperiumCardsPreviewDialogComponent, {
          data: {
            title: 'Top Deck Card',
            imperiumCards: [topCard],
          },
        });
      }
    }
  }

  onShuffleDeckClicked() {
    if (this.activePlayer) {
      this.cardsService.shufflePlayerDeck(this.activePlayerId);
    }
  }

  onPlayIntrigueClicked(intrigue: IntrigueDeckCard) {
    this.gameManager.playPlayerIntrigue(this.activePlayerId, intrigue);
  }

  onTrashIntrigueClicked(intrigue: IntrigueDeckCard) {
    this.gameManager.trashPlayerIntrigue(this.activePlayerId, intrigue);
  }

  setCardActive(cardId: string) {
    if (this.activeCardId !== cardId) {
      this.activeCardId = cardId;
    } else {
      this.activeCardId = '';
    }
  }

  setCardHover(cardId: string) {
    if (this.hoveredCardId !== cardId) {
      this.hoveredCardId = cardId;
    } else {
      this.hoveredCardId = '';
    }
  }

  setIntrigueActive(cardId: string) {
    if (this.activeIntrigueId !== cardId) {
      this.activeIntrigueId = cardId;
    } else {
      this.activeIntrigueId = '';
    }
  }

  public trackCount(index: number, card: any) {
    return index + card.id;
  }
}
