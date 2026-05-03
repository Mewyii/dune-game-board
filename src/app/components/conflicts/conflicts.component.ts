import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Conflict } from 'src/app/models/conflict';
import { ConflictsService } from 'src/app/services/conflicts.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService } from 'src/app/services/game-modifier.service';
import { ConflictsPreviewDialogComponent } from '../_common/dialogs/conflicts-preview-dialog/conflicts-preview-dialog.component';

@Component({
  selector: 'dune-conflicts',
  templateUrl: './conflicts.component.html',
  styleUrls: ['./conflicts.component.scss'],
  standalone: false,
})
export class ConflictsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
    public conflictsService: ConflictsService,
    private gameManager: GameManager,
    private gameModifierService: GameModifiersService,
    private dialog: MatDialog,
  ) {}

  public currentConflict: Conflict | undefined;
  public activePlayerId = 0;
  public hasConflictVision = false;
  public conflictStackIsActive = false;
  public currentconflictIsActive = false;

  ngOnInit(): void {
    const currentConflictSub = this.conflictsService.currentConflict$.subscribe((currentConflict) => {
      this.currentConflict = currentConflict;
    });

    const activePlayerIdSub = this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;

      this.hasConflictVision = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'vision-conflict',
      );

      this.conflictStackIsActive = false;
      this.currentconflictIsActive = false;
    });

    const playerGameModifiersSub = this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.hasConflictVision = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'vision-conflict',
      );
    });

    this.subscriptions.push(currentConflictSub, activePlayerIdSub, playerGameModifiersSub);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onSetCurrentConflictActiveClicked() {
    this.currentconflictIsActive = !this.currentconflictIsActive;
  }

  onSetConflictStackActiveClicked() {
    this.conflictStackIsActive = !this.conflictStackIsActive;
  }

  onShowNextConflictClicked() {
    const conflict = this.conflictsService.conflictStack[1];
    if (conflict) {
      this.dialog.open(ConflictsPreviewDialogComponent, {
        data: {
          title: 'Top Conflict Card',
          conflicts: [conflict],
        },
      });
    }
  }

  onSearchConflictsClicked() {
    const conflictDeck = this.conflictsService.conflictStack;
    if (conflictDeck) {
      this.dialog.open(ConflictsPreviewDialogComponent, {
        data: {
          title: 'Conflict Deck',
          conflicts: conflictDeck,
        },
      });
    }
  }
}
