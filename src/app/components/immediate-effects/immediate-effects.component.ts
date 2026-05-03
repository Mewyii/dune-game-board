import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import { ActiveFactionType, activeFactionTypes, DuneLocation } from 'src/app/models';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { CardsService, ImperiumDeckCard } from 'src/app/services/cards.service';
import { ConflictDeckCard, ConflictsService } from 'src/app/services/conflicts.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { LeadersService } from 'src/app/services/leaders.service';
import { PlayerAgentsService } from 'src/app/services/player-agents.service';
import { ImmediateEffect, PlayerRewardChoicesService } from 'src/app/services/player-reward-choices.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';
import {
  BoardSpaceSelectorData,
  BoardSpaceSelectorDialogComponent,
} from '../_common/dialogs/board-space-selector-dialog/board-space-selector-dialog.component';
import {
  ConflictSelectorData,
  ConflictsPreviewDialogComponent,
} from '../_common/dialogs/conflicts-preview-dialog/conflicts-preview-dialog.component';
import {
  FactionSelectorData,
  FactionSelectorDialogComponent,
} from '../_common/dialogs/faction-selector-dialog/faction-selector-dialog.component';
import {
  ImperiumCardSelectorData,
  ImperiumCardsPreviewDialogComponent,
} from '../_common/dialogs/imperium-cards-preview-dialog/imperium-cards-preview-dialog.component';
import {
  IntrigueSelectorData,
  IntriguesPreviewDialogComponent,
} from '../_common/dialogs/intrigues-preview-dialog/intrigues-preview-dialog.component';

@Component({
  selector: 'dune-immediate-effects',
  templateUrl: './immediate-effects.component.html',
  styleUrl: './immediate-effects.component.scss',
  standalone: false,
})
export class ImmediateEffectsComponent implements OnInit, OnDestroy {
  immediateEffectDialogOpen = false;

  subscriptions: Subscription[] = [];

  constructor(
    public t: TranslateService,
    private gameManager: GameManager,
    private playerRewardChoicesService: PlayerRewardChoicesService,
    private dialog: MatDialog,
    private cardsService: CardsService,
    private leadersService: LeadersService,
    private intriguesService: IntriguesService,
    private settingsService: SettingsService,
    private playerScoreManager: PlayerScoreManager,
    private playerAgentsService: PlayerAgentsService,
    private conflictsService: ConflictsService,
  ) {}

  ngOnInit(): void {
    const immediateEffectSub = this.playerRewardChoicesService.immediateEffectStack$.subscribe((stack) => {
      if (stack.length > 0 && !this.immediateEffectDialogOpen) {
        const currentEffect = stack[0];
        switch (currentEffect.choice) {
          case 'card-discard':
            this.showCardDiscardDialog(currentEffect);
            break;
          case 'intrigue-trash':
            this.showIntrigueTrashDialog(currentEffect);
            break;
          case 'faction-influence-up-choice':
            this.showFactionInfluenceUpDialog(currentEffect);
            break;
          case 'faction-influence-up-twice-choice':
            this.showFactionInfluenceUpTwiceDialog(currentEffect);
            break;
          case 'faction-influence-down-choice':
            this.showFactionInfluenceDownDialog(currentEffect);
            break;
          case 'conflict-pick':
            this.showConflictPickDialog(currentEffect);
            break;
          case 'location-control-choice':
            this.showLocationControlDialog(currentEffect);
            break;
          case 'card-return-to-hand':
            this.showCardReturnToHandDialog(currentEffect);
            break;
        }
      }
    });

    this.subscriptions.push(immediateEffectSub);
  }

  private showCardDiscardDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerHand = this.cardsService.getPlayerHand(currentEffect.playerId);
    const playedCards = this.cardsService.playedPlayerCards;

    const discardableCards = playerHand?.cards.filter((x) => !playedCards.some((y) => x.id === y.cardId));

    if (!playerHand || !discardableCards || discardableCards.length < 1) {
      this.immediateEffectDialogOpen = false;
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
      return;
    }

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(ImperiumCardsPreviewDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectCardDiscard')}`,
        playerId: currentEffect.playerId,
        imperiumCards: discardableCards,
        mode: 'select',
        colorScheme: 'negative',
      } as ImperiumCardSelectorData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((cardToDiscard: ImperiumDeckCard) => {
      this.immediateEffectDialogOpen = false;
      this.gameManager.discardImperiumCardFromHand(currentEffect.playerId, cardToDiscard);
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
    });
  }

  private showCardReturnToHandDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerDiscardPile = this.cardsService.getPlayerDiscardPile(currentEffect.playerId);

    if (!playerDiscardPile || playerDiscardPile.cards.length < 1) {
      this.immediateEffectDialogOpen = false;
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
      return;
    }

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(ImperiumCardsPreviewDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectCardChoice')}`,
        playerId: currentEffect.playerId,
        imperiumCards: playerDiscardPile.cards,
        mode: 'select',
        colorScheme: 'positive',
      } as ImperiumCardSelectorData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((cardToReturn: ImperiumDeckCard) => {
      this.immediateEffectDialogOpen = false;
      this.gameManager.returnDiscardedPlayerCardToHand(currentEffect.playerId, cardToReturn);
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
    });
  }

  private showIntrigueTrashDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerIntrigues = this.intriguesService.getPlayerIntrigues(currentEffect.playerId);

    if (!playerIntrigues || playerIntrigues.length < 1) {
      this.immediateEffectDialogOpen = false;
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
      return;
    }

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(IntriguesPreviewDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectIntrigueTrash')}`,
        playerId: currentEffect.playerId,
        intrigues: playerIntrigues,
        mode: 'select',
        colorScheme: 'negative',
      } as IntrigueSelectorData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((cardToDiscard: IntrigueDeckCard) => {
      this.immediateEffectDialogOpen = false;
      this.gameManager.trashPlayerIntrigue(currentEffect.playerId, cardToDiscard);
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
    });
  }

  private showFactionInfluenceUpDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerScores = this.playerScoreManager.getPlayerScore(currentEffect.playerId);
    if (!playerScores) {
      this.immediateEffectDialogOpen = false;
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
      return;
    }

    const maxFactionInfluence = this.settingsService.getFactionInfluenceMaxScore();
    const factionTypes: ActiveFactionType[] = [];
    for (const factionType of activeFactionTypes) {
      if (playerScores[factionType] < maxFactionInfluence) {
        factionTypes.push(factionType);
      }
    }

    if (factionTypes.length < 1) {
      this.immediateEffectDialogOpen = false;
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
      return;
    }

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(FactionSelectorDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectFactionInfluenceIncrease')}`,
        playerId: currentEffect.playerId,
        factionTypes: factionTypes,
        mode: 'select',
        colorScheme: 'positive',
      } as FactionSelectorData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((factionType: ActiveFactionType) => {
      this.immediateEffectDialogOpen = false;
      this.gameManager.increasePlayerFactionScore(currentEffect.playerId, factionType);
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
    });
  }

  private showFactionInfluenceUpTwiceDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerScores = this.playerScoreManager.getPlayerScore(currentEffect.playerId);
    if (!playerScores) {
      this.immediateEffectDialogOpen = false;
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
      return;
    }

    const maxFactionInfluence = this.settingsService.getFactionInfluenceMaxScore();
    const factionTypes: ActiveFactionType[] = [];
    for (const factionType of activeFactionTypes) {
      if (playerScores[factionType] < maxFactionInfluence) {
        factionTypes.push(factionType);
      }
    }

    if (factionTypes.length < 1) {
      this.immediateEffectDialogOpen = false;
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
      return;
    }

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(FactionSelectorDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectFactionInfluenceIncrease')}`,
        playerId: currentEffect.playerId,
        factionTypes: factionTypes,
        mode: 'select',
        colorScheme: 'positive',
      } as FactionSelectorData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((factionType: ActiveFactionType) => {
      this.immediateEffectDialogOpen = false;
      this.gameManager.increasePlayerFactionScore(currentEffect.playerId, factionType);
      this.gameManager.increasePlayerFactionScore(currentEffect.playerId, factionType);
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
    });
  }

  private showFactionInfluenceDownDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerScores = this.playerScoreManager.getPlayerScore(currentEffect.playerId);
    if (!playerScores) {
      this.immediateEffectDialogOpen = false;
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
      return;
    }

    const factionTypes: ActiveFactionType[] = [];
    for (const factionType of activeFactionTypes) {
      if (playerScores[factionType] > 0) {
        factionTypes.push(factionType);
      }
    }

    if (factionTypes.length < 1) {
      this.immediateEffectDialogOpen = false;
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
      return;
    }

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(FactionSelectorDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectFactionInfluenceDecrease')}`,
        playerId: currentEffect.playerId,
        factionTypes: factionTypes,
        mode: 'select',
        colorScheme: 'negative',
      } as FactionSelectorData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((factionType: ActiveFactionType) => {
      this.immediateEffectDialogOpen = false;
      this.gameManager.decreasePlayerFactionScore(currentEffect.playerId, factionType);
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
    });
  }

  private showConflictPickDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerAgentsOnFields = this.playerAgentsService.getPlayerAgentsOnFields(currentEffect.playerId);

    if (playerAgentsOnFields.length < 1) {
      this.immediateEffectDialogOpen = false;
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
      return;
    }

    const conflicts = this.conflictsService.conflictStack.filter((x) =>
      playerAgentsOnFields.some((y) => y.fieldId === x.boardSpaceId),
    );

    if (conflicts.length < 1) {
      this.immediateEffectDialogOpen = false;
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
      return;
    }

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(ConflictsPreviewDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectConflictChoice')}`,
        playerId: currentEffect.playerId,
        conflicts: conflicts,
        mode: 'select',
        colorScheme: 'neutral',
      } as ConflictSelectorData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((conflict: ConflictDeckCard) => {
      this.immediateEffectDialogOpen = false;
      this.gameManager.pickCurrentConflict(currentEffect.playerId, conflict.id);
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
    });
  }

  private showLocationControlDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const locations = this.settingsService.getBoardLocations();
    const playerLocations = locations.filter((x) =>
      this.playerAgentsService
        .getPlayerAgentsOnFields(currentEffect.playerId)
        .some((y) => y.fieldId === x.actionField.title.en),
    );

    if (playerLocations.length < 1) {
      this.immediateEffectDialogOpen = false;
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
      return;
    }

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(BoardSpaceSelectorDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectLocationChoice')}`,
        playerId: currentEffect.playerId,
        locations: playerLocations,
        mode: 'select',
        colorScheme: 'positive',
      } as BoardSpaceSelectorData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((location: DuneLocation) => {
      this.immediateEffectDialogOpen = false;
      this.gameManager.changeLocationOwner(location.actionField.title.en, currentEffect.playerId);
      this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
    });
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
