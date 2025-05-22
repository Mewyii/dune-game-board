import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { EffectType } from 'src/app/models';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { Player } from 'src/app/models/player';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CardsService, ImperiumDeckCard, PlayerCardStack, PlayerPlotStack } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { LoggingService } from 'src/app/services/log.service';
import { PlayersService } from 'src/app/services/players.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';
import { ImperiumCardsPreviewDialogComponent } from '../_common/dialogs/imperium-cards-preview-dialog/imperium-cards-preview-dialog.component';

@Component({
  selector: 'dune-player-hand',
  templateUrl: './player-hand.component.html',
  styleUrls: ['./player-hand.component.scss'],
})
export class PlayerHandComponent implements OnInit {
  public activePlayer: Player | undefined;
  public activePlayerId: number = 0;

  public playerHandCards: PlayerCardStack | undefined;
  public playerDiscardPiles: PlayerCardStack | undefined;
  public activeCardId = '';
  public playedPlayerCardId: string | undefined;

  public playerPlots: PlayerPlotStack | undefined;

  public playerIntrigues: IntrigueDeckCard[] | undefined;
  public activeIntrigueId = '';

  public showCards = false;
  public cardsShown: 'hand' | 'discard' | 'deck' = 'hand';

  public revealPlots = false;

  constructor(
    private playerManager: PlayersService,
    public gameManager: GameManager,
    private cardsService: CardsService,
    private intriguesService: IntriguesService,
    private audioManager: AudioManager,
    private settingsService: SettingsService,
    private dialog: MatDialog,
    private logService: LoggingService,
    private t: TranslateService
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

    this.gameManager.currentRoundPhase$.subscribe((roundPhase) => {
      this.revealPlots = roundPhase === 'combat-resolvement' && this.gameManager.isFinale;
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

    this.intriguesService.playerIntrigues$.subscribe((playerIntrigues) => {
      this.playerIntrigues = this.intriguesService.getPlayerIntrigues(this.activePlayerId);
    });
  }

  onToggleShowCardsClicked() {
    this.activeCardId = '';
    this.showCards = !this.showCards;
  }

  onDrawCardClicked() {
    this.audioManager.playSound('card-draw');
    this.cardsService.drawPlayerCardsFromDeck(this.activePlayerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onAddFoldspaceToHandClicked() {
    const foldspaceCard = this.settingsService.getCustomCards()?.find((x) => x.name.en.toLocaleLowerCase() === 'foldspace');
    if (foldspaceCard) {
      this.audioManager.playSound('card-draw');
      this.cardsService.addCardToPlayerHand(this.activePlayerId, this.cardsService.instantiateImperiumCard(foldspaceCard));
    }

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
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
    this.audioManager.playSound('card-discard');
    this.cardsService.discardPlayerHandCard(this.activePlayerId, card);
    this.activeCardId = '';

    this.logService.logPlayerDiscardedCard(this.activePlayerId, this.t.translateLS(card.name));
  }

  onAIDiscardCardClicked() {
    this.audioManager.playSound('card-discard');
    this.gameManager.aiDiscardHandCard(this.activePlayerId);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onAITrashCardFromHandClicked() {
    this.audioManager.playSound('card-discard');
    this.gameManager.aiTrashCardFromHand(this.activePlayerId);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onAITrashCardFromDiscardPileClicked() {
    this.audioManager.playSound('card-discard');
    this.gameManager.aiTrashCardFromDiscardPile(this.activePlayerId);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onAIAddCardToHandFromDiscardPileClicked() {
    this.audioManager.playSound('card-discard');
    this.gameManager.aiAddCardToHandFromDiscardPile(this.activePlayerId);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onAITrashIntrigueClicked() {
    this.gameManager.aiTrashIntrigue(this.activePlayerId);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onReturnDiscardedCardToHandClicked(card: ImperiumDeckCard) {
    if (this.activePlayer) {
      this.cardsService.returnDiscardedPlayerCardToHand(this.activePlayerId, card);
      this.activeCardId = '';
    }
  }

  onTrashHandCardClicked(card: ImperiumDeckCard) {
    if (this.activePlayer) {
      if (this.activePlayer.turnState === 'agent-placement') {
        this.cardsService.trashPlayerHandCard(this.activePlayerId, card);
        this.activeCardId = '';

        this.logService.logPlayerTrashedCard(this.activePlayerId, this.t.translateLS(card.name));
      } else if (this.activePlayer.focusTokens > 0) {
        this.cardsService.trashPlayerHandCard(this.activePlayerId, card);
        this.playerManager.removeFocusTokens(this.activePlayerId, 1);
        this.activeCardId = '';

        this.logService.logPlayerTrashedCard(this.activePlayerId, this.t.translateLS(card.name));
      }
    }
  }

  onTrashDiscardedCardClicked(card: ImperiumDeckCard) {
    if (this.activePlayer) {
      if (this.activePlayer.turnState === 'agent-placement') {
        this.cardsService.trashDiscardedPlayerCard(this.activePlayerId, card);
        this.activeCardId = '';

        this.logService.logPlayerTrashedCard(this.activePlayerId, this.t.translateLS(card.name));
      } else if (this.activePlayer.focusTokens > 0) {
        this.cardsService.trashDiscardedPlayerCard(this.activePlayerId, card);
        this.playerManager.removeFocusTokens(this.activePlayerId, 1);
        this.activeCardId = '';

        this.logService.logPlayerTrashedCard(this.activePlayerId, this.t.translateLS(card.name));
      }
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
    this.gameManager.playIntrigue(this.activePlayerId, intrigue);
  }

  onTrashIntrigueClicked(intrigue: IntrigueDeckCard) {
    this.intriguesService.trashPlayerIntrigue(this.activePlayerId, intrigue.id);
  }

  setCardActive(cardId: string) {
    if (this.activeCardId !== cardId) {
      this.activeCardId = cardId;
    } else {
      this.activeCardId = '';
    }
  }

  setIntrigueActive(cardId: string) {
    if (this.activeIntrigueId !== cardId) {
      this.activeIntrigueId = cardId;
    } else {
      this.activeIntrigueId = '';
    }
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public trackCount(index: number, card: any) {
    return index + card.id;
  }
}
