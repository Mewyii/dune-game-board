import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImperiumCard } from 'src/app/models/imperium-card';

@Component({
  selector: 'dune-imperium-cards-preview-dialog',
  templateUrl: './imperium-cards-preview-dialog.component.html',
  styleUrl: './imperium-cards-preview-dialog.component.scss',
})
export class ImperiumCardsPreviewDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ImperiumCardsPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; imperiumCards: ImperiumCard[] }
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
