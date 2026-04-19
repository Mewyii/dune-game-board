import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ActiveFactionType, activeFactionTypes } from 'src/app/models';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { CardsService, ImperiumDeckCard } from 'src/app/services/cards.service';
import { ConflictDeckCard, ConflictsService } from 'src/app/services/conflicts.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { LeadersService } from 'src/app/services/leaders.service';
import { PlayerAgentsService } from 'src/app/services/player-agents.service';
import { PlayerRewardChoicesService } from 'src/app/services/player-reward-choices.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';
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
export class ImmediateEffectsComponent implements OnInit {
  immediateEffectDialogOpen = false;

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
    this.playerRewardChoicesService.immediateEffectStack$.subscribe((stack) => {
      if (stack.length > 0 && !this.immediateEffectDialogOpen) {
        const currentEffect = stack[0];
        if (currentEffect.choice === 'card-discard') {
          this.immediateEffectDialogOpen = true;

          const playerHand = this.cardsService.getPlayerHand(currentEffect.playerId);
          const playedCards = this.cardsService.playedPlayerCards;
          const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
          const dialogRef = this.dialog.open(ImperiumCardsPreviewDialogComponent, {
            data: {
              title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectCardDiscard')}`,
              playerId: currentEffect.playerId,
              imperiumCards: playerHand?.cards.filter((x) => !playedCards.some((y) => x.id === y.cardId)),
              mode: 'select',
            } as ImperiumCardSelectorData,
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe((cardToDiscard: ImperiumDeckCard) => {
            this.immediateEffectDialogOpen = false;
            this.gameManager.discardImperiumCardFromHand(currentEffect.playerId, cardToDiscard);
            this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
          });
        } else if (currentEffect.choice === 'intrigue-trash') {
          this.immediateEffectDialogOpen = true;

          const playerIntrigues = this.intriguesService.getPlayerIntrigues(currentEffect.playerId);
          const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
          const dialogRef = this.dialog.open(IntriguesPreviewDialogComponent, {
            data: {
              title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectIntrigueTrash')}`,
              playerId: currentEffect.playerId,
              intrigues: playerIntrigues,
              mode: 'select',
            } as IntrigueSelectorData,
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe((cardToDiscard: IntrigueDeckCard) => {
            this.immediateEffectDialogOpen = false;
            this.gameManager.trashPlayerIntrigue(currentEffect.playerId, cardToDiscard);
            this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
          });
        } else if (currentEffect.choice === 'faction-influence-up-choice') {
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
          const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
          const dialogRef = this.dialog.open(FactionSelectorDialogComponent, {
            data: {
              title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectFactionInfluenceIncrease')}`,
              playerId: currentEffect.playerId,
              factionTypes: factionTypes,
              mode: 'select',
            } as FactionSelectorData,
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe((factionType: ActiveFactionType) => {
            this.immediateEffectDialogOpen = false;
            this.gameManager.increasePlayerFactionScore(currentEffect.playerId, factionType);
            this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
          });
        } else if (currentEffect.choice === 'faction-influence-up-twice-choice') {
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
          const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
          const dialogRef = this.dialog.open(FactionSelectorDialogComponent, {
            data: {
              title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectFactionInfluenceIncrease')}`,
              playerId: currentEffect.playerId,
              factionTypes: factionTypes,
              mode: 'select',
            } as FactionSelectorData,
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe((factionType: ActiveFactionType) => {
            this.immediateEffectDialogOpen = false;
            this.gameManager.increasePlayerFactionScore(currentEffect.playerId, factionType);
            this.gameManager.increasePlayerFactionScore(currentEffect.playerId, factionType);
            this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
          });
        } else if (currentEffect.choice === 'faction-influence-down-choice') {
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
          const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
          const dialogRef = this.dialog.open(FactionSelectorDialogComponent, {
            data: {
              title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectFactionInfluenceDecrease')}`,
              playerId: currentEffect.playerId,
              factionTypes: factionTypes,
              mode: 'select',
            } as FactionSelectorData,
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe((factionType: ActiveFactionType) => {
            this.immediateEffectDialogOpen = false;
            this.gameManager.decreasePlayerFactionScore(currentEffect.playerId, factionType);
            this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
          });
        } else if (currentEffect.choice === 'conflict-pick') {
          this.immediateEffectDialogOpen = true;

          const playerAgentsOnFields = this.playerAgentsService.getPlayerAgentsOnFields(currentEffect.playerId);
          const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
          const dialogRef = this.dialog.open(ConflictsPreviewDialogComponent, {
            data: {
              title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectConflictChoice')}`,
              playerId: currentEffect.playerId,
              conflicts: this.conflictsService.conflictStack.filter((x) =>
                playerAgentsOnFields.some((y) => y.fieldId === x.boardSpaceId),
              ),
              mode: 'select',
            } as ConflictSelectorData,
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe((conflict: ConflictDeckCard) => {
            this.immediateEffectDialogOpen = false;
            this.gameManager.pickCurrentConflict(currentEffect.playerId, conflict.id);
            this.playerRewardChoicesService.removeImmediateEffect(currentEffect.id);
          });
        }
      }
    });
  }
}
