import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { Subscription } from 'rxjs';
import { ActionType, combatUnitTypes, effectRewards, EffectRewardType, FactionType, resourceTypes } from 'src/app/models';
import { Conflict } from 'src/app/models/conflict';
import { BoardSpacesService } from 'src/app/services/board-spaces.service';

@Component({
  selector: 'dune-dialog-conflict-editor',
  templateUrl: './dialog-conflict-editor.component.html',
  styleUrls: ['./dialog-conflict-editor.component.scss'],
  standalone: false,
})
export class DialogConflictEditorComponent implements OnInit, OnDestroy {
  conflict: Conflict;
  boardSpaceIds: string[] = [];
  rewardTypes: EffectRewardType[] = [...resourceTypes, ...combatUnitTypes, ...effectRewards].sort((a, b) =>
    a.localeCompare(b),
  );
  factions: FactionType[] = [];
  actions: ActionType[] = [];
  private boardSpacesSubscription?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<DialogConflictEditorComponent>,
    private boardSpacesService: BoardSpacesService,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; conflict: Conflict },
  ) {
    this.conflict = cloneDeep(data.conflict);
  }

  ngOnInit(): void {
    this.boardSpacesSubscription = this.boardSpacesService.boardSpaces$.subscribe((boardSpaces) => {
      this.boardSpaceIds = [
        ...new Set(boardSpaces.filter((x) => x.ownerReward).map((boardSpace) => boardSpace.title.en)),
      ].sort((a, b) => a.localeCompare(b));
    });
  }

  ngOnDestroy(): void {
    this.boardSpacesSubscription?.unsubscribe();
  }

  onAddRankClicked(): void {
    this.conflict.rewards.push([]);
  }

  onRemoveRankClicked(rankIndex: number): void {
    this.conflict.rewards.splice(rankIndex, 1);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const name = this.conflict.name.en.trim();
    if (!name) {
      return;
    }

    this.conflict.name.en = name;
    const boardSpaceId = (this.conflict.boardSpaceId ?? '').trim();
    this.conflict.boardSpaceId = boardSpaceId || undefined;
    this.dialogRef.close(this.conflict);
  }
}
