import { Component, OnInit } from '@angular/core';
import { CardCoordinates, ConflictSet, ConflictsService } from 'src/app/services/conflicts.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { GameModifiersService } from 'src/app/services/game-modifier.service';
import { ConflictsPreviewDialogComponent } from '../_common/dialogs/conflicts-preview-dialog/conflicts-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'dune-conflicts',
  templateUrl: './conflicts.component.html',
  styleUrls: ['./conflicts.component.scss'],
})
export class ConflictsComponent implements OnInit {
  constructor(
    public conflictsService: ConflictsService,
    private gameManager: GameManager,
    private gameModifierService: GameModifiersService,
    public dialog: MatDialog
  ) {}

  public currentConflictSet: ConflictSet | undefined;

  public currentCardCoordinates: CardCoordinates = { x: 0, y: 0 };

  public activePlayerId = 0;
  public hasConflictVision = false;
  public conflictStackIsActive = false;

  ngOnInit(): void {
    this.conflictsService.currentConflictSet$.subscribe((currentConflictSet) => {
      this.currentConflictSet = currentConflictSet;
    });

    this.conflictsService.currentCardCoordinates$.subscribe((currentCardCoordinates) => {
      this.currentCardCoordinates = currentCardCoordinates;
    });

    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activePlayerId = activePlayerId;

      this.hasConflictVision = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'vision-conflict'
      );

      this.conflictStackIsActive = false;
    });

    this.gameModifierService.playerGameModifiers$.subscribe(() => {
      this.hasConflictVision = this.gameModifierService.playerHasCustomActionAvailable(
        this.activePlayerId,
        'vision-conflict'
      );
    });
  }

  onSetConflictStackActiveClicked() {
    this.conflictStackIsActive = !this.conflictStackIsActive;
  }

  onShowNextConflictClicked() {
    const nextConflict = this.conflictsService.conflictStack[1];
    if (nextConflict) {
      const coordinates = this.conflictsService.getCardCoordinates(nextConflict.column, nextConflict.row);

      this.dialog.open(ConflictsPreviewDialogComponent, {
        data: {
          title: 'Top Conflict Card',
          currentConflictSet: this.currentConflictSet,
          currentCardCoordinates: coordinates,
        },
      });
    }
  }
}
