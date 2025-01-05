import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-intrigues-preview-dialog',
  templateUrl: './intrigues-preview-dialog.component.html',
  styleUrl: './intrigues-preview-dialog.component.scss',
})
export class IntriguesPreviewDialogComponent {
  constructor(
    private intriguesService: IntriguesService,
    public t: TranslateService,
    public dialogRef: MatDialogRef<IntriguesPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; intrigues: IntrigueDeckCard[]; canAquireCards: boolean; playerId: number }
  ) {}

  onClose() {
    this.dialogRef.close();
  }

  onBuyCardClicked(card: IntrigueDeckCard) {
    this.intriguesService.addPlayerIntrigue(this.data.playerId, card);
    this.data.intrigues = this.data.intrigues.filter((x) => x.id !== card.id);
  }
}
