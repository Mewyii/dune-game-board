import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Conflict } from 'src/app/models/conflict';
import { TranslateService } from 'src/app/services/translate-service';

export type ConflictSelectorMode = 'preview' | 'select';

export interface ConflictSelectorData {
  title: string;
  conflicts: Conflict[];
  mode: ConflictSelectorMode;
}

@Component({
  selector: 'dune-conflicts-preview-dialog',
  templateUrl: './conflicts-preview-dialog.component.html',
  styleUrl: './conflicts-preview-dialog.component.scss',
  standalone: false,
})
export class ConflictsPreviewDialogComponent {
  selectedConflict: Conflict | null = null;
  hoveredCardId = '';

  constructor(
    public t: TranslateService,
    public dialogRef: MatDialogRef<ConflictsPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConflictSelectorData,
  ) {}

  get isSelectMode(): boolean {
    return this.data.mode === 'select';
  }

  get isPreviewMode(): boolean {
    return this.data.mode === 'preview';
  }

  onConflictClick(conflict: Conflict) {
    if (this.isSelectMode) {
      this.selectedConflict = conflict;
    }
  }

  isSelected(conflict: Conflict): boolean {
    return this.selectedConflict === conflict;
  }

  onConfirm() {
    if (this.selectedConflict) {
      this.dialogRef.close(this.selectedConflict);
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
