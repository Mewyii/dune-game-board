import { Component, OnInit } from '@angular/core';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { RewardType } from 'src/app/models';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CardsService, ImperiumDeckCard, PlayerCard, PlayerCardStack } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { Player, PlayersService } from 'src/app/services/players.service';
import { SettingsService } from 'src/app/services/settings.service';
import { ImperiumCardsPreviewDialogComponent } from '../_common/dialogs/imperium-cards-preview-dialog/imperium-cards-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { GameModifiersService } from 'src/app/services/game-modifier.service';
import { LoggingService } from 'src/app/services/log.service';
import { TranslateService } from 'src/app/services/translate-service';
import { IntrigueDeckCard, IntriguesService, PlayerIntrigueStack } from 'src/app/services/intrigues.service';
import { PlayerRewardChoicesService } from 'src/app/services/player-reward-choices.service';

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

  public playerIntrigues: IntrigueDeckCard[] | undefined;
  public activeIntrigueId = '';

  public showCards = false;
  public cardsShown: 'hand' | 'discard' | 'deck' = 'hand';

  constructor(
    private playerManager: PlayersService,
    public gameManager: GameManager,
    private cardsService: CardsService,
    private intriguesService: IntriguesService,
    private audioManager: AudioManager,
    private settingsService: SettingsService,
    public dialog: MatDialog,
    private logService: LoggingService,
    private translateService: TranslateService,
    private playerRewardChoicesService: PlayerRewardChoicesService
  ) {}

  ngOnInit(): void {
    this.playerManager.players$.subscribe((players) => {
      this.currentPlayer = players.find((x) => x.id === this.activePlayerId);
    });

    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;

      this.currentPlayer = this.playerManager.getPlayer(this.activePlayerId);

      this.playerHandCards = this.cardsService.playerHands.find((x) => x.playerId === this.activePlayerId);
      this.playerDiscardPiles = this.cardsService.playerDiscardPiles.find((x) => x.playerId === this.activePlayerId);

      this.playerIntrigues = this.intriguesService.getPlayerIntrigues(this.activePlayerId);
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
    this.logService.logPlayerPlayedCard(this.activePlayerId, this.translateService.translate(card.name));
  }

  onUnPlayCardClicked(cardId: string) {
    this.cardsService.unsetPlayedPlayerCard(this.activePlayerId, cardId);
  }

  onDiscardCardClicked(card: ImperiumDeckCard) {
    this.cardsService.discardPlayerHandCard(this.activePlayerId, card);
    this.activeCardId = '';

    this.logService.logPlayerDiscardedCard(this.activePlayerId, this.translateService.translate(card.name));
  }

  onAIDiscardCardClicked() {
    this.gameManager.aiDiscardHandCard(this.activePlayerId);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onAITrashCardFromHandClicked() {
    this.gameManager.aiTrashCardFromHand(this.activePlayerId);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onAITrashCardFromDiscardPileClicked() {
    this.gameManager.aiTrashCardFromDiscardPile(this.activePlayerId);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onAIAddCardToHandFromDiscardPileClicked() {
    this.gameManager.aiAddCardToHandFromDiscardPile(this.activePlayerId);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onAITrashIntrigueClicked() {
    this.gameManager.aiTrashIntrigue(this.activePlayerId);

    this.gameManager.setPreferredFieldsForAIPlayer(this.activePlayerId);
  }

  onReturnDiscardedCardToHandClicked(card: ImperiumDeckCard) {
    if (this.currentPlayer) {
      this.cardsService.returnDiscardedPlayerCardToHand(this.activePlayerId, card);
      this.activeCardId = '';
    }
  }

  onTrashHandCardClicked(card: ImperiumDeckCard) {
    if (this.currentPlayer) {
      if (this.currentPlayer.turnState === 'agent-placement') {
        this.cardsService.trashPlayerHandCard(this.activePlayerId, card);
        this.activeCardId = '';

        this.logService.logPlayerTrashedCard(this.activePlayerId, this.translateService.translate(card.name));
      } else if (this.currentPlayer.focusTokens > 0) {
        this.cardsService.trashPlayerHandCard(this.activePlayerId, card);
        this.playerManager.removeFocusTokens(this.activePlayerId, 1);
        this.activeCardId = '';

        this.logService.logPlayerTrashedCard(this.activePlayerId, this.translateService.translate(card.name));
      }
    }
  }

  onTrashDiscardedCardClicked(card: ImperiumDeckCard) {
    if (this.currentPlayer) {
      if (this.currentPlayer.turnState === 'agent-placement') {
        this.cardsService.trashDiscardedPlayerCard(this.activePlayerId, card);
        this.activeCardId = '';

        this.logService.logPlayerTrashedCard(this.activePlayerId, this.translateService.translate(card.name));
      }
      if (this.currentPlayer.turnState === 'reveal' && this.currentPlayer.focusTokens > 0) {
        this.cardsService.trashDiscardedPlayerCard(this.activePlayerId, card);
        this.playerManager.removeFocusTokens(this.activePlayerId, 1);
        this.activeCardId = '';

        this.logService.logPlayerTrashedCard(this.activePlayerId, this.translateService.translate(card.name));
      }
    }
  }

  onShuffleDiscardPileUnderDeckClicked() {
    if (this.currentPlayer) {
      this.cardsService.shufflePlayerDiscardPileUnderDeck(this.activePlayerId);
    }
  }

  onShowTopCardClicked() {
    if (this.currentPlayer) {
      const deck = this.cardsService.getPlayerDeck(this.currentPlayer.id)?.cards;
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
    if (this.currentPlayer) {
      this.cardsService.shufflePlayerDeck(this.activePlayerId);
    }
  }

  onPlayIntrigueClicked(intrigue: IntrigueDeckCard) {
    this.playerRewardChoicesService.addPlayerRewardsChoice(this.activePlayerId, intrigue.effects);
    this.intriguesService.trashPlayerIntrigue(this.activePlayerId, intrigue.id);
    this.logService.logPlayerPlayedIntrigue(this.activePlayerId, this.translateService.translate(intrigue.name));
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

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }
}
