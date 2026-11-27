import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { cloneDeep } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActiveFactionType, activeFactionTypes, DuneLocation, EffectType } from 'src/app/models';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { BoardSpacesService } from 'src/app/services/board-spaces.service';
import { CardsService, ImperiumDeckCard } from 'src/app/services/cards.service';
import { ConflictDeckCard, ConflictsService } from 'src/app/services/conflicts.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { LeadersService } from 'src/app/services/leaders.service';
import { LocationsService } from 'src/app/services/location-manager.service';
import { PlayerAgentsService } from 'src/app/services/player-agents.service';
import { ImmediateEffect, PlayerRewardChoicesService } from 'src/app/services/player-reward-choices.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { PlayersService } from 'src/app/services/players.service';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ImmediateEffectsComponent implements OnInit, OnDestroy {
  t = inject(TranslateService);
  private gameManager = inject(GameManager);
  private playerRewardChoicesService = inject(PlayerRewardChoicesService);
  private dialog = inject(MatDialog);
  private cardsService = inject(CardsService);
  private leadersService = inject(LeadersService);
  private intriguesService = inject(IntriguesService);
  private settingsService = inject(SettingsService);
  private locationsService = inject(LocationsService);
  private boardSpacesService = inject(BoardSpacesService);
  private playerScoreManager = inject(PlayerScoreManager);
  private playerAgentsService = inject(PlayerAgentsService);
  private conflictsService = inject(ConflictsService);
  private playersService = inject(PlayersService);
  private audioManager = inject(AudioManager);

  private immediateEffectStackSubject = new BehaviorSubject<ImmediateEffect[]>([]);
  immediateEffectStack$ = this.immediateEffectStackSubject.asObservable();

  immediateEffects: EffectType[] = [
    'card-discard',
    'intrigue-trash',
    'faction-influence-up-choice',
    'faction-influence-up-twice-choice',
    'faction-influence-down-choice',
    'location-control-choice',
    'card-return-to-hand',
    'agent-lift',
    'shield-choice',
  ];

  immediateEffectDialogOpen = false;

  subscriptions: Subscription[] = [];

  private get immediateEffectStack() {
    return cloneDeep(this.immediateEffectStackSubject.value);
  }

  ngOnInit(): void {
    const rewardChoicesSub = this.playerRewardChoicesService.playersRewardChoices$.subscribe((playersRewardChoices) => {
      const immediateEffectStack = this.immediateEffectStack;

      const immediateEffectsToAdd: ImmediateEffect[] = [];
      for (const playerRewardChoices of playersRewardChoices) {
        const player = this.playersService.getPlayer(playerRewardChoices.playerId);
        if (player && !player.isAI) {
          for (const rewardChoice of playerRewardChoices.rewardChoices) {
            if (
              this.immediateEffects.includes(rewardChoice.choice.type) &&
              !immediateEffectStack.some((x) => x.id === rewardChoice.id)
            ) {
              immediateEffectsToAdd.push({
                id: rewardChoice.id,
                playerId: playerRewardChoices.playerId,
                choice: rewardChoice.choice.type,
              });
            }
          }

          const conflictRewardChoice = playerRewardChoices.conflictChoice;
          if (conflictRewardChoice) {
            immediateEffectsToAdd.push({
              id: conflictRewardChoice.id,
              playerId: playerRewardChoices.playerId,
              choice: 'conflict-pick',
            });
          }
        }
      }

      if (immediateEffectsToAdd.length > 0) {
        this.immediateEffectStackSubject.next([...immediateEffectStack, ...immediateEffectsToAdd]);
      }
    });

    const immediateEffectsSub = this.immediateEffectStack$.subscribe((immediateEffectStack) => {
      if (immediateEffectStack.length > 0 && !this.immediateEffectDialogOpen) {
        const currentEffect = immediateEffectStack[0];
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
          case 'shield-choice':
            this.showLocationShieldDialog(currentEffect);
            break;
          case 'agent-lift':
            this.showAgentLiftDialog(currentEffect);
            break;
          case 'card-return-to-hand':
            this.showCardReturnToHandDialog(currentEffect);
            break;
          case 'card-trash':
            this.showCardTrashDialog(currentEffect);
            break;
          case 'card-trash-from-hand':
            this.showCardTrashFromHandDialog(currentEffect);
            break;
          case 'card-trash-in-play':
            this.showCardTrashInPlayDialog(currentEffect);
            break;
        }
      }
    });

    this.subscriptions.push(rewardChoicesSub, immediateEffectsSub);
  }

  private showCardDiscardDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerHand = this.cardsService.getPlayerHand(currentEffect.playerId);
    const playedCards = this.cardsService.playedPlayerCards;

    const discardableCards = playerHand?.cards.filter((x) => !playedCards.some((y) => x.id === y.cardId));

    if (!playerHand || !discardableCards || discardableCards.length < 1) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
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
      this.gameManager.discardImperiumCardFromHand(currentEffect.playerId, cardToDiscard);
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private showCardReturnToHandDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerDiscardPile = this.cardsService.getPlayerDiscardPile(currentEffect.playerId);

    if (!playerDiscardPile || playerDiscardPile.cards.length < 1) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
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
      this.gameManager.returnDiscardedPlayerCardToHand(currentEffect.playerId, cardToReturn);
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private showCardTrashInPlayDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerDiscardPile = this.cardsService.getPlayerDiscardPile(currentEffect.playerId);

    if (!playerDiscardPile || playerDiscardPile.cards.length < 1) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
      return;
    }

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(ImperiumCardsPreviewDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectCardTrash')}`,
        playerId: currentEffect.playerId,
        imperiumCards: playerDiscardPile.cards,
        mode: 'select',
        colorScheme: 'positive',
      } as ImperiumCardSelectorData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((cardToTrash: ImperiumDeckCard) => {
      this.gameManager.trashImperiumCard(currentEffect.playerId, cardToTrash, 'discard-pile');
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private showCardTrashFromHandDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerHand = this.cardsService.getPlayerHand(currentEffect.playerId);

    if (!playerHand || playerHand.cards.length < 1) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
      return;
    }

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(ImperiumCardsPreviewDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectCardTrash')}`,
        playerId: currentEffect.playerId,
        imperiumCards: playerHand.cards,
        mode: 'select',
        colorScheme: 'positive',
      } as ImperiumCardSelectorData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((cardToTrash: ImperiumDeckCard) => {
      this.gameManager.trashImperiumCard(currentEffect.playerId, cardToTrash, 'hand');
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private showCardTrashDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerHandCards = this.cardsService.getPlayerHand(currentEffect.playerId)?.cards ?? [];
    const playerDiscardPileCards = this.cardsService.getPlayerDiscardPile(currentEffect.playerId)?.cards ?? [];
    if (playerHandCards.length < 1 && playerDiscardPileCards.length < 1) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
      return;
    }

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(ImperiumCardsPreviewDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectCardTrash')}`,
        playerId: currentEffect.playerId,
        imperiumCards: [...playerHandCards, ...playerDiscardPileCards],
        mode: 'select',
        colorScheme: 'positive',
      } as ImperiumCardSelectorData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((cardToTrash: ImperiumDeckCard) => {
      const source = playerHandCards.some((x) => x.id === cardToTrash.id) ? 'hand' : 'discard-pile';
      this.gameManager.trashImperiumCard(currentEffect.playerId, cardToTrash, source);
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private showIntrigueTrashDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerIntrigues = this.intriguesService.getPlayerIntrigues(currentEffect.playerId);

    if (!playerIntrigues || playerIntrigues.length < 1) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
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
      this.gameManager.trashPlayerIntrigue(currentEffect.playerId, cardToDiscard);
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private showFactionInfluenceUpDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerScores = this.playerScoreManager.getPlayerScore(currentEffect.playerId);
    if (!playerScores) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
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
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
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
      this.gameManager.increasePlayerFactionScore(currentEffect.playerId, factionType);
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private showFactionInfluenceUpTwiceDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerScores = this.playerScoreManager.getPlayerScore(currentEffect.playerId);
    if (!playerScores) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
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
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
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
      this.gameManager.increasePlayerFactionScore(currentEffect.playerId, factionType);
      this.gameManager.increasePlayerFactionScore(currentEffect.playerId, factionType);
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private showFactionInfluenceDownDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerScores = this.playerScoreManager.getPlayerScore(currentEffect.playerId);
    if (!playerScores) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
      return;
    }

    const factionTypes: ActiveFactionType[] = [];
    for (const factionType of activeFactionTypes) {
      if (playerScores[factionType] > 0) {
        factionTypes.push(factionType);
      }
    }

    if (factionTypes.length < 1) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
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
      this.gameManager.decreasePlayerFactionScore(currentEffect.playerId, factionType);
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private showConflictPickDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerAgentsOnFields = this.playerAgentsService.getPlayerAgentsOnFields(currentEffect.playerId);

    if (playerAgentsOnFields.length < 1) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
      return;
    }

    let conflicts = this.conflictsService.conflictStack.filter((x) =>
      playerAgentsOnFields.some((y) => y.fieldId === x.boardSpaceId),
    );

    if (conflicts.length < 1) {
      conflicts = this.conflictsService.conflictDiscardPile.filter((x) =>
        playerAgentsOnFields.some((y) => y.fieldId === x.boardSpaceId),
      );

      if (conflicts.length > 0) {
        this.conflictsService.removeConflictsFromDiscardPile(conflicts.map((x) => x.id));
        this.conflictsService.addConflictsToConflictStack(conflicts);
      }
    }

    if (conflicts.length < 1) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
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
      this.gameManager.pickCurrentConflict(currentEffect.playerId, conflict);
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private showLocationControlDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerLocations = this.locationsService.locations.filter((x) =>
      this.playerAgentsService
        .getPlayerAgentsOnFields(currentEffect.playerId)
        .some((y) => y.fieldId === x.actionField.title.en),
    );

    if (playerLocations.length < 1) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
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
      this.gameManager.changeLocationOwner(location.actionField.title.en, currentEffect.playerId);
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private showLocationShieldDialog(currentEffect: ImmediateEffect): void {
    this.immediateEffectDialogOpen = true;

    const playerLocations = this.locationsService.getPlayerLocations(currentEffect.playerId).filter((x) => !x.isShielded);

    if (playerLocations.length < 1) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
      return;
    }

    const selectableLocations = this.locationsService.locations.filter((location) =>
      playerLocations.some((pl) => pl.locationId === location.actionField.title.en),
    );

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(BoardSpaceSelectorDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectLocationChoice')}`,
        playerId: currentEffect.playerId,
        locations: selectableLocations,
        mode: 'select',
        colorScheme: 'positive',
      } as BoardSpaceSelectorData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((location: DuneLocation) => {
      this.audioManager.playSound('shield');
      this.locationsService.setLocationIsShielded(location.actionField.title.en);
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private showAgentLiftDialog(currentEffect: ImmediateEffect) {
    this.immediateEffectDialogOpen = true;

    const boardSpaces = this.boardSpacesService.boardSpaces;
    const playerBoardSpaces = boardSpaces.filter((x) =>
      this.playerAgentsService.getPlayerAgentsOnFields(currentEffect.playerId).some((y) => y.fieldId === x.title.en),
    );

    if (playerBoardSpaces.length < 1) {
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
      return;
    }

    const leaderName = this.leadersService.getPlayerLeaderName(currentEffect.playerId);
    const dialogRef = this.dialog.open(BoardSpaceSelectorDialogComponent, {
      data: {
        title: `${this.t.translateLS(leaderName!)}: ${this.t.translate('commonEffectLocationChoice')}`,
        playerId: currentEffect.playerId,
        locations: playerBoardSpaces.map((x) => ({
          actionField: x,
          color: this.settingsService.getBoardSpaceColor(x.actionType),
        })),
        mode: 'select',
        colorScheme: 'positive',
      } as BoardSpaceSelectorData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((location: DuneLocation) => {
      this.gameManager.liftPlayerAgentFromField(currentEffect.playerId, location.actionField);
      this.closeDialogAndRemoveImmediateEffect(currentEffect.id);
    });
  }

  private closeDialogAndRemoveImmediateEffect(id: string) {
    this.immediateEffectDialogOpen = false;
    this.immediateEffectStackSubject.next(this.immediateEffectStackSubject.value.filter((x) => x.id !== id));
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
