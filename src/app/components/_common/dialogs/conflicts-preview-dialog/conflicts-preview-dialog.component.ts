import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'dune-conflicts-preview-dialog',
  templateUrl: './conflicts-preview-dialog.component.html',
  styleUrl: './conflicts-preview-dialog.component.scss',
})
export class ConflictsPreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConflictsPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; currentConflictSet: any; currentCardCoordinates: any }
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
