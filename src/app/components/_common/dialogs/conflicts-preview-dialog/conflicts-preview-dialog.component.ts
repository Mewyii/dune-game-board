import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Conflict } from 'src/app/models/conflict';

@Component({
  selector: 'dune-conflicts-preview-dialog',
  templateUrl: './conflicts-preview-dialog.component.html',
  styleUrl: './conflicts-preview-dialog.component.scss',
})
export class ConflictsPreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConflictsPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; conflicts: Conflict[] }
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
