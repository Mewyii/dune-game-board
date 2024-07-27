import { Component, OnInit } from '@angular/core';
import { ImperiumCard } from 'src/app/constants/imperium-cards';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { RewardType } from 'src/app/models';
import { CardsService, ImperiumDeckCard } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { Player, PlayerManager, PlayerTurnState } from 'src/app/services/player-manager.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'dune-imperium-row',
  templateUrl: './imperium-row.component.html',
  styleUrls: ['./imperium-row.component.scss'],
})
export class ImperiumRowComponent implements OnInit {
  public imperiumRowCards: ImperiumDeckCard[] = [];
  public activeCardId = '';

  public activePlayerId: number = 0;
  public activePlayer: Player | undefined;
  public activePlayerPersuasion: number = 0;
  public activePlayerTurnState: PlayerTurnState | undefined;

  constructor(private playerManager: PlayerManager, private gameManager: GameManager, public cardsService: CardsService) {}

  ngOnInit(): void {
    this.cardsService.imperiumDeck$.subscribe((imperiumCards) => {
      this.imperiumRowCards = imperiumCards.slice(0, 6);
    });

    this.playerManager.players$.subscribe((players) => {
      this.activePlayer = players.find((x) => x.id === this.activePlayerId);
      if (this.activePlayer) {
        this.activePlayerTurnState = this.playerManager.getPlayer(this.activePlayerId)?.turnState;

        this.activePlayerPersuasion =
          this.activePlayer.persuasionGainedThisRound +
          this.activePlayer.permanentPersuasion -
          this.activePlayer.persuasionSpentThisRound;
      }
    });

    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;
      this.activePlayer = this.playerManager.getPlayer(activePlayerId);
      if (this.activePlayer) {
        this.activePlayerTurnState = this.playerManager.getPlayer(this.activePlayerId)?.turnState;

        this.activePlayerPersuasion =
          this.activePlayer.persuasionGainedThisRound +
          this.activePlayer.permanentPersuasion -
          this.activePlayer.persuasionSpentThisRound;
      }
    });
  }

  onBuyCardClicked(card: ImperiumDeckCard) {
    if (card.persuasionCosts) {
      this.playerManager.addPersuasionSpentToPlayer(this.activePlayerId, card.persuasionCosts);
    }
    if (card.buyEffects) {
      for (const effect of card.buyEffects) {
        this.gameManager.addRewardToPlayer(effect);
      }
    }
    this.cardsService.aquirePlayerCardFromImperiumDeck(this.activePlayerId, card);
  }

  onRemoveCardClicked(card: ImperiumDeckCard) {
    this.cardsService.removeCardFromImperiumDeck(card);
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
