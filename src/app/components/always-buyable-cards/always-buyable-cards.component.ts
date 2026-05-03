import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppMode } from 'src/app/constants/board-settings';
import { getCardCostModifier } from 'src/app/helpers/game-modifiers';

import { ImperiumCard } from 'src/app/models/imperium-card';
import { Player, PlayerTurnState } from 'src/app/models/player';
import { CardsService, ImperiumDeckCard } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService, ImperiumRowModifier } from 'src/app/services/game-modifier.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-always-buyable-cards',
  templateUrl: './always-buyable-cards.component.html',
  styleUrls: ['./always-buyable-cards.component.scss'],
  standalone: false,
})
export class AlwaysBuyableCardsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  public mode: AppMode | undefined;

  public limitedCustomCards: ImperiumDeckCard[] = [];
  public shownLimitedCustomCard: ImperiumDeckCard | undefined;
  public shownLimitedCustomCardIndex = 0;

  public unlimitedCard: ImperiumCard | undefined;

  public activeCardId = '';
  public activePlayerId: number = 0;
  public activePlayer: Player | undefined;
  public activePlayerPersuasion: number = 0;
  public activePlayerTurnState: PlayerTurnState | undefined;
  public imperiumRowModifiers: ImperiumRowModifier[] | undefined;

  constructor(
    private settingsService: SettingsService,
    private gameManager: GameManager,
    public cardsService: CardsService,
    private gameModifierService: GameModifiersService,
    public t: TranslateService,
  ) {}

  ngOnInit(): void {
    const modeSub = this.settingsService.mode$.subscribe((mode) => {
      this.mode = mode;
    });

    const limitedCustomCardsSub = this.cardsService.limitedCustomCards$.subscribe((cards) => {
      this.limitedCustomCards = cards;

      if (cards.length > 0) {
        this.shownLimitedCustomCard = this.limitedCustomCards[0];
      } else {
        this.shownLimitedCustomCard = undefined;
      }
    });

    const unlimitedCustomCardsSub = this.cardsService.unlimitedCustomCards$.subscribe((cards) => {
      if (cards.length > 0) {
        this.unlimitedCard = cards[0];
      } else {
        this.unlimitedCard = undefined;
      }
    });

    const activePlayerSub = this.gameManager.activePlayer$.subscribe((activePlayer) => {
      this.activePlayer = activePlayer;
      this.activePlayerId = activePlayer?.id ?? 0;

      if (this.activePlayer) {
        this.activePlayerTurnState = this.activePlayer.turnState;

        this.activePlayerPersuasion = this.getPlayerPersuasion(this.activePlayer);

        this.imperiumRowModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'imperiumRow');
      }
    });

    const playerGameModifiersSub = this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.imperiumRowModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'imperiumRow');
    });

    this.subscriptions.push(
      modeSub,
      limitedCustomCardsSub,
      unlimitedCustomCardsSub,
      activePlayerSub,
      playerGameModifiersSub,
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onBuyAlwaysAvailableCardClicked(card: ImperiumCard) {
    this.gameManager.acquireImperiumCard(
      this.activePlayerId,
      this.cardsService.instantiateImperiumCard(card),
      'always-buyable',
    );
  }

  onShowNextLimitedCustomCardClicked() {
    const currentName = this.shownLimitedCustomCard?.name?.en;
    const totalCardCount = this.limitedCustomCards.length;

    for (let offset = 1; offset < totalCardCount; offset++) {
      const i = (this.shownLimitedCustomCardIndex + offset) % totalCardCount;
      if (this.limitedCustomCards[i].name?.en !== currentName) {
        this.shownLimitedCustomCardIndex = i;
        this.shownLimitedCustomCard = this.limitedCustomCards[i];
        return;
      }
    }
  }

  onShowPreviousLimitedCustomCardClicked() {
    const currentName = this.shownLimitedCustomCard?.name?.en;
    const total = this.limitedCustomCards.length;

    for (let offset = 1; offset < total; offset++) {
      const i = (this.shownLimitedCustomCardIndex - offset + total) % total;
      if (this.limitedCustomCards[i].name?.en !== currentName) {
        this.shownLimitedCustomCardIndex = i;
        this.shownLimitedCustomCard = this.limitedCustomCards[i];
        return;
      }
    }
  }

  onBuyLimitedCustomCardClicked(card: ImperiumDeckCard) {
    this.gameManager.acquireImperiumCard(this.activePlayerId, card, 'always-buyable');
  }

  setCardActive(cardId: string) {
    if (this.activeCardId !== cardId) {
      this.activeCardId = cardId;
    } else {
      this.activeCardId = '';
    }
  }

  getCardCostModifier(card: ImperiumCard) {
    return getCardCostModifier(card, this.imperiumRowModifiers);
  }

  private getPlayerPersuasion(player: Player) {
    return player.persuasionGainedThisRound + player.permanentPersuasion - player.persuasionSpentThisRound;
  }
}
