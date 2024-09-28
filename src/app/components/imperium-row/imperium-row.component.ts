import { Component, OnInit } from '@angular/core';
import { getCardCostModifier } from 'src/app/helpers/game-modifiers';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { RewardType } from 'src/app/models';
import { CardsService, ImperiumDeckCard } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService, ImperiumRowModifier } from 'src/app/services/game-modifier.service';
import { LoggingService } from 'src/app/services/log.service';
import { Player, PlayerManager, PlayerTurnState } from 'src/app/services/player-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

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
  public imperiumRowModifiers: ImperiumRowModifier[] | undefined;
  public playerCanCharm = false;

  constructor(
    private playerManager: PlayerManager,
    private gameManager: GameManager,
    public cardsService: CardsService,
    private gameModifierService: GameModifiersService,
    private logService: LoggingService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.cardsService.imperiumRow$.subscribe((imperiumCards) => {
      this.imperiumRowCards = imperiumCards;
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

        this.activePlayerPersuasion = this.getPlayerPersuasion(this.activePlayer);

        this.imperiumRowModifiers = this.gameModifierService.getPlayerImperiumRowModifiers(this.activePlayerId);
        this.playerCanCharm = this.gameModifierService.playerHasCustomActionAvailable(this.activePlayerId, 'charm');
      }
    });

    this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.imperiumRowModifiers = this.gameModifierService.getPlayerImperiumRowModifiers(this.activePlayerId);
      this.playerCanCharm = this.gameModifierService.playerHasCustomActionAvailable(this.activePlayerId, 'charm');
    });
  }

  onBuyCardClicked(card: ImperiumDeckCard) {
    const costModifier = getCardCostModifier(card, this.imperiumRowModifiers);
    if (card.persuasionCosts) {
      this.playerManager.addPersuasionSpentToPlayer(this.activePlayerId, card.persuasionCosts + costModifier);
    }
    if (card.buyEffects) {
      for (const effect of card.buyEffects) {
        this.gameManager.addRewardToPlayer(this.activePlayerId, effect);
      }
    }
    this.cardsService.aquirePlayerCardFromImperiumDeck(this.activePlayerId, card);

    this.logService.logPlayerBoughtCard(this.activePlayerId, this.translateService.translate(card.name));
  }

  onRemoveCardClicked(card: ImperiumDeckCard) {
    this.cardsService.removeCardFromImperiumDeck(card);
  }

  onCharmCardClicked(card: ImperiumDeckCard) {
    this.gameModifierService.addPlayerImperiumRowModifier(this.activePlayerId, { cardId: card.id, persuasionAmount: -1 });
    const enemyPlayers = this.playerManager.getEnemyPlayers(this.activePlayerId);
    for (const player of enemyPlayers) {
      this.gameModifierService.addPlayerImperiumRowModifier(player.id, { cardId: card.id, persuasionAmount: 1 });
    }
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

  getCardCostModifier(card: ImperiumDeckCard) {
    return getCardCostModifier(card, this.imperiumRowModifiers);
  }

  private getPlayerPersuasion(player: Player) {
    return player.persuasionGainedThisRound + player.permanentPersuasion - player.persuasionSpentThisRound;
  }
}
