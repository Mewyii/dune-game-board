import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getCardCostModifier } from 'src/app/helpers/game-modifiers';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { ActiveFactionType, EffectType } from 'src/app/models';
import { ImperiumCard } from 'src/app/models/imperium-card';
import { Player, PlayerTurnState } from 'src/app/models/player';
import { CardsService, ImperiumDeckCard, ImperiumRowCard, ImperiumRowPlot } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService, ImperiumRowModifier } from 'src/app/services/game-modifier.service';
import { PlayersService } from 'src/app/services/players.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';
import { TurnInfoService } from 'src/app/services/turn-info.service';
import { ImperiumCardsPreviewDialogComponent } from '../_common/dialogs/imperium-cards-preview-dialog/imperium-cards-preview-dialog.component';

@Component({
  selector: 'dune-imperium-row',
  templateUrl: './imperium-row.component.html',
  styleUrls: ['./imperium-row.component.scss'],
  standalone: false,
})
export class ImperiumRowComponent implements OnInit {
  imperiumRowCardsLeft: (ImperiumRowCard | ImperiumRowPlot)[] = [];
  imperiumRowCardsRight: (ImperiumRowCard | ImperiumRowPlot)[] = [];
  activeCardId = '';
  hoveredCardId = '';

  activePlayerId: number = 0;
  activePlayer: Player | undefined;
  activePlayerPersuasion: number = 0;
  activePlayerTurnState: PlayerTurnState | undefined;
  imperiumRowModifiers: ImperiumRowModifier[] | undefined;
  playerCanCharm = false;
  factionRecruitment: ActiveFactionType[] = [];
  unlimitedCustomCards: ImperiumCard[] = [];
  limitedCustomCards: ImperiumDeckCard[] = [];

  constructor(
    private playerManager: PlayersService,
    private gameManager: GameManager,
    public cardsService: CardsService,
    private gameModifierService: GameModifiersService,
    private dialog: MatDialog,
    private turnInfoService: TurnInfoService,
    private settingsService: SettingsService,
    public t: TranslateService
  ) {}

  ngOnInit(): void {
    this.cardsService.imperiumRow$.subscribe((imperiumCards) => {
      this.setRowCards();
    });

    this.cardsService.unlimitedCustomCards$.subscribe((unlimitedCards) => {
      this.setRowCards();
    });

    this.cardsService.limitedCustomCards$.subscribe((limitedCards) => {
      this.setRowCards();
    });

    this.gameManager.activePlayer$.subscribe((activePlayer) => {
      this.activePlayer = activePlayer;
      this.activePlayerId = activePlayer?.id ?? 0;

      if (this.activePlayer) {
        this.activePlayerTurnState = this.activePlayer.turnState;

        this.activePlayerPersuasion = this.playerManager.getPlayerPersuasion(this.activePlayer.id);

        this.imperiumRowModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'imperiumRow');
        this.playerCanCharm = this.gameModifierService.playerHasCustomActionAvailable(this.activePlayerId, 'charm');
      }
    });

    this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.imperiumRowModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'imperiumRow');
      this.playerCanCharm = this.gameModifierService.playerHasCustomActionAvailable(this.activePlayerId, 'charm');
    });

    this.turnInfoService.turnInfos$.subscribe((turnInfos) => {
      const playerTurnInfo = turnInfos.find((x) => x.playerId === this.activePlayerId);
      if (playerTurnInfo) {
        this.factionRecruitment = playerTurnInfo.factionRecruitment;
      }
    });

    this.gameManager.currentRound$.subscribe((round) => {
      this.setRowCards();
    });
  }

  onBuyCardClicked(card: ImperiumRowCard | ImperiumRowPlot) {
    this.gameManager.acquireImperiumRowCard(this.activePlayerId, card);
  }

  onBuyAlwaysAvailableCardClicked(card: ImperiumCard) {
    this.gameManager.acquireCustomImperiumCard(this.activePlayerId, this.cardsService.instantiateImperiumCard(card));
  }

  onBuyLimitedCustomCardClicked(card: ImperiumDeckCard) {
    this.gameManager.acquireCustomImperiumCard(this.activePlayerId, card);
  }

  onRemoveCardClicked(card: ImperiumRowCard | ImperiumRowPlot) {
    this.cardsService.removeCardFromImperiumRow(card);
  }

  onCharmCardClicked(card: ImperiumRowCard | ImperiumRowPlot) {
    this.gameModifierService.addPlayerImperiumRowModifier(this.activePlayerId, { cardId: card.id, persuasionAmount: -1 });
    const enemyPlayers = this.playerManager.getEnemyPlayers(this.activePlayerId);
    for (const player of enemyPlayers) {
      this.gameModifierService.addPlayerImperiumRowModifier(player.id, { cardId: card.id, persuasionAmount: 1 });
    }
  }

  onSearchImperiumDeckClicked() {
    const imperiumDeck = this.cardsService.imperiumDeck;
    if (imperiumDeck) {
      const dialogRef = this.dialog.open(ImperiumCardsPreviewDialogComponent, {
        data: {
          title: this.t.translate('imperiumrowSearchTitle'),
          playerId: this.activePlayerId,
          imperiumCards: imperiumDeck,
          canAquireCards: true,
          search: true,
        },
      });

      dialogRef.afterClosed().subscribe(() => {
        this.cardsService.shuffleImperiumDeck();
      });
    }
  }

  onRecruitFromImperiumRowClicked() {
    const recruitmentCardAmount = this.settingsService.getRecruitmentCardAmount();

    const recruitableCards = this.cardsService.imperiumDeck.slice(0, recruitmentCardAmount);
    if (recruitableCards) {
      const dialogRef = this.dialog.open(ImperiumCardsPreviewDialogComponent, {
        data: {
          title: this.t.translate('imperiumrowRecruitmentTitle'),
          playerId: this.activePlayerId,
          imperiumCards: recruitableCards,
          canAquireCards: true,
          aquirableFactionTypes: this.factionRecruitment,
        },
      });
      dialogRef.afterClosed().subscribe(() => {
        this.cardsService.shuffleImperiumDeck();
        this.turnInfoService.setPlayerTurnInfo(this.activePlayerId, { factionRecruitment: [] });
      });
    }
  }

  setRowCards() {
    this.unlimitedCustomCards = this.cardsService.unlimitedCustomCards;

    const shownCards: ImperiumDeckCard[] = [];
    for (const limitedCard of this.cardsService.limitedCustomCards) {
      if (!shownCards.some((x) => x.name.en === limitedCard.name.en)) {
        shownCards.push(limitedCard);
      }
    }
    this.limitedCustomCards = shownCards;

    const cardsWithPlotCostsAdjusted = this.cardsService.imperiumRow.map((x) => {
      if (x.type === 'plot') {
        return { ...x, persuasionCosts: this.gameManager.currentRound };
      } else {
        return x;
      }
    });

    const cutOff = 5 - this.unlimitedCustomCards.length - this.limitedCustomCards.length;
    this.imperiumRowCardsLeft = cardsWithPlotCostsAdjusted.slice(0, cutOff);
    this.imperiumRowCardsRight = cardsWithPlotCostsAdjusted.slice(cutOff);
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

  getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  getCardCostModifier(card: ImperiumRowCard | ImperiumRowPlot) {
    return getCardCostModifier(card, this.imperiumRowModifiers);
  }
}
