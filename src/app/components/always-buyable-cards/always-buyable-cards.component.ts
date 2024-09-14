import { Component } from '@angular/core';
import { ImperiumCard } from 'src/app/constants/imperium-cards';
import { getCardCostModifier } from 'src/app/helpers/game-modifiers';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { RewardType } from 'src/app/models';
import { CardsService } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService, ImperiumRowModifier } from 'src/app/services/game-modifier.service';
import { Player, PlayerManager, PlayerTurnState } from 'src/app/services/player-manager.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'dune-always-buyable-cards',
  templateUrl: './always-buyable-cards.component.html',
  styleUrls: ['./always-buyable-cards.component.scss'],
})
export class AlwaysBuyableCardsComponent {
  public liasonCards: ImperiumCard[] = [];
  public shownLiasonCard: ImperiumCard | undefined;
  public shownLiasonIndex = 0;

  public spiceMustFlowCard: ImperiumCard | undefined;
  public activeCardId = '';

  public activePlayerId: number = 0;
  public activePlayer: Player | undefined;
  public activePlayerPersuasion: number = 0;
  public activePlayerTurnState: PlayerTurnState | undefined;
  public imperiumRowModifiers: ImperiumRowModifier[] | undefined;

  constructor(
    private playerManager: PlayerManager,
    private gameManager: GameManager,
    public cardsService: CardsService,
    private settingsService: SettingsService,
    private gameModifierService: GameModifiersService
  ) {}

  ngOnInit(): void {
    const alwaysBuyableCards = this.settingsService.getAlwaysBuyableCards();
    this.spiceMustFlowCard = alwaysBuyableCards.find((x) => x.name.en === 'The Spice Must Flow');

    this.liasonCards = alwaysBuyableCards.filter((x) => x.name.en !== 'The Spice Must Flow');
    this.shownLiasonCard = this.liasonCards[this.shownLiasonIndex];

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

        this.imperiumRowModifiers = this.gameModifierService.getPlayerImperiumRowModifiers(this.activePlayerId);
      }
    });

    this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.imperiumRowModifiers = this.gameModifierService.getPlayerImperiumRowModifiers(this.activePlayerId);
    });
  }

  onBuyAlwaysAvailableCardClicked(card: ImperiumCard) {
    const costModifier = getCardCostModifier(card, this.imperiumRowModifiers);
    if (card.persuasionCosts) {
      this.playerManager.addPersuasionSpentToPlayer(this.activePlayerId, card.persuasionCosts + costModifier);
    }
    if (card.buyEffects) {
      for (const effect of card.buyEffects) {
        this.gameManager.addRewardToPlayer(this.activePlayerId, effect);
      }
    }

    this.cardsService.addCardToPlayerDiscardPile(this.activePlayerId, this.cardsService.instantiateImperiumCard(card));
  }

  onShowNextLiasonClicked() {
    if (this.shownLiasonIndex < this.liasonCards.length - 1) {
      this.shownLiasonIndex++;
    } else {
      this.shownLiasonIndex = 0;
    }
    this.shownLiasonCard = this.liasonCards[this.shownLiasonIndex];
  }

  onShowPreviousLiasonClicked() {
    if (this.shownLiasonIndex > 0) {
      this.shownLiasonIndex--;
    } else {
      this.shownLiasonIndex = this.liasonCards.length - 1;
    }
    this.shownLiasonCard = this.liasonCards[this.shownLiasonIndex];
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
