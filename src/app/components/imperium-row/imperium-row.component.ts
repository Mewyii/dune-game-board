import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getCardCostModifier } from 'src/app/helpers/game-modifiers';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { ActiveFactionType, RewardType } from 'src/app/models';
import { Player, PlayerTurnState } from 'src/app/models/player';
import { CardsService, ImperiumRowCard } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService, ImperiumRowModifier } from 'src/app/services/game-modifier.service';
import { PlayersService } from 'src/app/services/players.service';
import { ImperiumCardsPreviewDialogComponent } from '../_common/dialogs/imperium-cards-preview-dialog/imperium-cards-preview-dialog.component';
import { TurnInfoService } from 'src/app/services/turn-info.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'dune-imperium-row',
  templateUrl: './imperium-row.component.html',
  styleUrls: ['./imperium-row.component.scss'],
})
export class ImperiumRowComponent implements OnInit {
  public imperiumRowCards: ImperiumRowCard[] = [];
  public activeCardId = '';

  public activePlayerId: number = 0;
  public activePlayer: Player | undefined;
  public activePlayerPersuasion: number = 0;
  public activePlayerTurnState: PlayerTurnState | undefined;
  public imperiumRowModifiers: ImperiumRowModifier[] | undefined;
  public playerCanCharm = false;
  public factionRecruitment: ActiveFactionType[] = [];

  constructor(
    private playerManager: PlayersService,
    private gameManager: GameManager,
    public cardsService: CardsService,
    private gameModifierService: GameModifiersService,
    public dialog: MatDialog,
    private turnInfoService: TurnInfoService,
    private settingsService: SettingsService
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
  }

  onBuyCardClicked(card: ImperiumRowCard) {
    this.gameManager.acquireImperiumRowCard(this.activePlayerId, card);
  }

  onRemoveCardClicked(card: ImperiumRowCard) {
    this.cardsService.removeCardFromImperiumRow(card);
  }

  onCharmCardClicked(card: ImperiumRowCard) {
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
          title: 'Imperium Deck',
          imperiumCards: imperiumDeck,
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
          title: 'Imperium Deck Recruitment',
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

  getCardCostModifier(card: ImperiumRowCard) {
    return getCardCostModifier(card, this.imperiumRowModifiers);
  }
}
