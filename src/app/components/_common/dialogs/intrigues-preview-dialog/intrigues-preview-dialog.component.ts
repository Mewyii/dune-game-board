import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IntrigueDeckCard } from 'src/app/services/intrigues.service';

@Component({
  selector: 'dune-intrigues-preview-dialog',
  templateUrl: './intrigues-preview-dialog.component.html',
  styleUrl: './intrigues-preview-dialog.component.scss',
})
export class IntriguesPreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<IntriguesPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; intrigue: IntrigueDeckCard }
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
