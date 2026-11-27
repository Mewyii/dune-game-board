import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { getImperiumCardModifier } from 'src/app/helpers/game-modifiers';
import { ActiveFactionType } from 'src/app/models';
import { ImperiumCard } from 'src/app/models/imperium-card';
import { Player, PlayerTurnState } from 'src/app/models/player';
import { CardsService, ImperiumDeckCard, ImperiumRowCard, ImperiumRowPlot } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService, ImperiumRowModifier } from 'src/app/services/game-modifier.service';
import { PlayerResourcesService } from 'src/app/services/player-resources.service';
import { TurnInfoService } from 'src/app/services/player-turn-info.service';
import { PlayersService } from 'src/app/services/players.service';
import { RoundService } from 'src/app/services/round.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';
import {
  ImperiumCardSelectorData,
  ImperiumCardsPreviewDialogComponent,
} from '../_common/dialogs/imperium-cards-preview-dialog/imperium-cards-preview-dialog.component';

@Component({
  selector: 'dune-imperium-row',
  templateUrl: './imperium-row.component.html',
  styleUrls: ['./imperium-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ImperiumRowComponent implements OnInit, OnDestroy {
  t = inject(TranslateService);
  private playersService = inject(PlayersService);
  private gameManager = inject(GameManager);
  private cardsService = inject(CardsService);
  private gameModifierService = inject(GameModifiersService);
  private dialog = inject(MatDialog);
  private turnInfoService = inject(TurnInfoService);
  private settingsService = inject(SettingsService);
  private roundService = inject(RoundService);
  private playerResourcesService = inject(PlayerResourcesService);

  subscriptions: Subscription[] = [];

  imperiumRowCardsLeft: ((ImperiumRowCard | ImperiumRowPlot) & {
    costModifier: number;
    isBlocked: boolean;
  })[] = [];
  imperiumRowCardsRight: ((ImperiumRowCard | ImperiumRowPlot) & {
    costModifier: number;
    isBlocked: boolean;
  })[] = [];
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
  limitedCustomCards: (ImperiumDeckCard & {
    costModifier: number;
    isBlocked: boolean;
  })[] = [];

  ngOnInit(): void {
    const imperiumRowSub = this.cardsService.imperiumRow$.subscribe((imperiumCards) => {
      this.setRowCards();
    });

    const unlimitedCustomCardsSub = this.cardsService.unlimitedCustomCards$.subscribe((unlimitedCards) => {
      this.setRowCards();
    });

    const limitedCustomCardsSub = this.cardsService.limitedCustomCards$.subscribe((limitedCards) => {
      this.setRowCards();
    });

    const activePlayerSub = this.gameManager.activePlayer$.subscribe((activePlayer) => {
      this.activePlayer = activePlayer;
      this.activePlayerId = activePlayer?.id ?? 0;

      if (this.activePlayer) {
        this.activePlayerTurnState = this.activePlayer.turnState;

        this.activePlayerPersuasion = this.playerResourcesService.getPlayerResourceAmount(this.activePlayerId, 'persuasion');

        this.imperiumRowModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'imperiumRow');
        this.playerCanCharm = this.gameModifierService.playerHasCustomActionAvailable(this.activePlayerId, 'charm');
        this.setRowCards();
      }
    });

    const playerGameModifiersSub = this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.imperiumRowModifiers = this.gameModifierService.getPlayerGameModifier(this.activePlayerId, 'imperiumRow');
      this.playerCanCharm = this.gameModifierService.playerHasCustomActionAvailable(this.activePlayerId, 'charm');
      this.setRowCards();
    });

    const turnInfosSub = this.turnInfoService.turnInfos$.subscribe((turnInfos) => {
      const playerTurnInfo = turnInfos.find((x) => x.playerId === this.activePlayerId);
      if (playerTurnInfo) {
        this.factionRecruitment = playerTurnInfo.factionRecruitment;
      }
    });

    const currentRoundSub = this.roundService.currentRound$.subscribe((round) => {
      this.setRowCards();
    });

    const playerResourcesSub = this.playerResourcesService.playersResources$.subscribe(() => {
      this.activePlayerPersuasion = this.playerResourcesService.getPlayerResourceAmount(this.activePlayerId, 'persuasion');
    });

    this.subscriptions.push(
      imperiumRowSub,
      unlimitedCustomCardsSub,
      limitedCustomCardsSub,
      activePlayerSub,
      playerGameModifiersSub,
      turnInfosSub,
      currentRoundSub,
      playerResourcesSub,
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onBuyCardClicked(card: ImperiumRowCard | ImperiumRowPlot) {
    this.gameManager.acquireImperiumCard(this.activePlayerId, card, 'row');
  }

  onBuyAlwaysAvailableCardClicked(card: ImperiumCard) {
    this.gameManager.acquireImperiumCard(
      this.activePlayerId,
      this.cardsService.instantiateImperiumCard(card),
      'always-buyable',
    );
  }

  onBuyLimitedCustomCardClicked(card: ImperiumDeckCard) {
    this.gameManager.acquireImperiumCard(this.activePlayerId, card, 'always-buyable');
  }

  onRemoveCardClicked(card: ImperiumRowCard | ImperiumRowPlot) {
    this.cardsService.removeCardFromImperiumRow(card);
  }

  onCharmCardClicked(card: ImperiumRowCard | ImperiumRowPlot) {
    this.gameModifierService.addPlayerImperiumRowModifier(this.activePlayerId, {
      cardId: card.id,
      persuasionAmount: -1,
    });
    const enemyPlayers = this.playersService.getEnemyPlayers(this.activePlayerId);
    for (const player of enemyPlayers) {
      this.gameModifierService.addPlayerImperiumRowModifier(player.id, {
        cardId: card.id,
        persuasionAmount: 1,
      });
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
        } as ImperiumCardSelectorData,
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
        this.turnInfoService.setPlayerTurnInfo(this.activePlayerId, {
          factionRecruitment: [],
        });
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
    this.limitedCustomCards = shownCards.map((card) => ({
      ...card,
      ...getImperiumCardModifier(card, this.imperiumRowModifiers),
    }));

    const cardsWithPlotCostsAdjusted = this.cardsService.imperiumRow.map((x) => {
      if (x.type === 'plot') {
        return { ...x, persuasionCosts: this.roundService.currentRound };
      } else {
        return x;
      }
    });

    const cutOff = 5 - this.unlimitedCustomCards.length - this.limitedCustomCards.length;
    this.imperiumRowCardsLeft = cardsWithPlotCostsAdjusted.slice(0, cutOff).map((card) => ({
      ...card,
      ...getImperiumCardModifier(card, this.imperiumRowModifiers),
    }));
    this.imperiumRowCardsRight = cardsWithPlotCostsAdjusted.slice(cutOff).map((card) => ({
      ...card,
      ...getImperiumCardModifier(card, this.imperiumRowModifiers),
    }));
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
}
