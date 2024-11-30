import { Component } from '@angular/core';
import { AppMode, Settings } from 'src/app/constants/board-settings';
import { ImperiumCard } from 'src/app/constants/imperium-cards';
import { getCardCostModifier } from 'src/app/helpers/game-modifiers';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { RewardType } from 'src/app/models';
import { CardsService, ImperiumDeckCard } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService, ImperiumRowModifier } from 'src/app/services/game-modifier.service';
import { LoggingService } from 'src/app/services/log.service';
import { Player, PlayersService, PlayerTurnState } from 'src/app/services/players.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-always-buyable-cards',
  templateUrl: './always-buyable-cards.component.html',
  styleUrls: ['./always-buyable-cards.component.scss'],
})
export class AlwaysBuyableCardsComponent {
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
    private playerManager: PlayersService,
    private gameManager: GameManager,
    public cardsService: CardsService,
    private gameModifierService: GameModifiersService,
    private logService: LoggingService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.settingsService.mode$.subscribe((mode) => {
      this.mode = mode;
    });

    this.cardsService.limitedCustomCards$.subscribe((cards) => {
      this.limitedCustomCards = cards;

      if (cards.length > 0) {
        this.shownLimitedCustomCard = this.limitedCustomCards[0];
      } else {
        this.shownLimitedCustomCard = undefined;
      }
    });

    this.cardsService.unlimitedCustomCards$.subscribe((cards) => {
      if (cards.length > 0) {
        this.unlimitedCard = cards[0];
      } else {
        this.unlimitedCard = undefined;
      }
    });

    this.playerManager.players$.subscribe((players) => {
      this.activePlayer = players.find((x) => x.id === this.activePlayerId);
      if (this.activePlayer) {
        this.activePlayerTurnState = this.playerManager.getPlayer(this.activePlayerId)?.turnState;

        this.activePlayerPersuasion = this.getPlayerPersuasion(this.activePlayer);
      }
    });

    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
      this.activePlayer = this.playerManager.getPlayer(activePlayerId);
      if (this.activePlayer) {
        this.activePlayerTurnState = this.playerManager.getPlayer(this.activePlayerId)?.turnState;

        this.activePlayerPersuasion = this.getPlayerPersuasion(this.activePlayer);

        this.imperiumRowModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'imperiumRow');
      }
    });

    this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.imperiumRowModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'imperiumRow');
    });
  }

  onBuyAlwaysAvailableCardClicked(card: ImperiumCard) {
    this.gameManager.acquireCustomImperiumCard(this.activePlayerId, this.cardsService.instantiateImperiumCard(card));
  }

  onShowNextLimitedCustomCardClicked() {
    if (this.shownLimitedCustomCardIndex < this.limitedCustomCards.length - 1) {
      this.shownLimitedCustomCardIndex++;
    } else {
      this.shownLimitedCustomCardIndex = 0;
    }
    this.shownLimitedCustomCard = this.limitedCustomCards[this.shownLimitedCustomCardIndex];
  }

  onShowPreviousLimitedCustomCardClicked() {
    if (this.shownLimitedCustomCardIndex > 0) {
      this.shownLimitedCustomCardIndex--;
    } else {
      this.shownLimitedCustomCardIndex = this.limitedCustomCards.length - 1;
    }
    this.shownLimitedCustomCard = this.limitedCustomCards[this.shownLimitedCustomCardIndex];
  }

  onBuyLimitedCustomCardClicked(card: ImperiumDeckCard) {
    this.gameManager.acquireCustomImperiumCard(this.activePlayerId, card);
  }

  setCardActive(cardId: string) {
    if (this.activeCardId !== cardId) {
      this.activeCardId = cardId;
    } else {
      this.activeCardId = '';
    }
  }

  getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  getCardCostModifier(card: ImperiumCard) {
    return getCardCostModifier(card, this.imperiumRowModifiers);
  }

  private getPlayerPersuasion(player: Player) {
    return player.persuasionGainedThisRound + player.permanentPersuasion - player.persuasionSpentThisRound;
  }
}
