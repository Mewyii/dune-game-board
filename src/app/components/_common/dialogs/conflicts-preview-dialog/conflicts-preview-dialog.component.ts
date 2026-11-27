import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConflictDeckCard } from 'src/app/services/conflicts.service';
import { TranslateService } from 'src/app/services/translate-service';

export type ConflictSelectorMode = 'preview' | 'select';

export interface ConflictSelectorData {
  title: string;
  conflicts: ConflictDeckCard[];
  mode: ConflictSelectorMode;
  colorScheme: 'neutral' | 'positive' | 'negative';
}

@Component({
  selector: 'dune-conflicts-preview-dialog',
  templateUrl: './conflicts-preview-dialog.component.html',
  styleUrl: './conflicts-preview-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ConflictsPreviewDialogComponent {
  t = inject(TranslateService);
  dialogRef = inject<MatDialogRef<ConflictsPreviewDialogComponent>>(MatDialogRef);
  data = inject<ConflictSelectorData>(MAT_DIALOG_DATA);

  selectedConflict: ConflictDeckCard | null = null;
  hoveredCardId = '';

  get isSelectMode(): boolean {
    return this.data.mode === 'select';
  }

  get isPreviewMode(): boolean {
    return this.data.mode === 'preview';
  }

  onConflictClick(conflict: ConflictDeckCard) {
    if (this.isSelectMode) {
      this.selectedConflict = conflict;
    }
  }

  isSelected(conflict: ConflictDeckCard): boolean {
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
