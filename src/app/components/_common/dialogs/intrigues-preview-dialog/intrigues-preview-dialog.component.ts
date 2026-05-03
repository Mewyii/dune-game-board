import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IntrigueDeckCard } from 'src/app/models/intrigue';
import { IntriguesService } from 'src/app/services/intrigues.service';
import { TranslateService } from 'src/app/services/translate-service';

export type IntrigueSelectorMode = 'preview' | 'select';

export interface IntrigueSelectorData {
  title: string;
  intrigues: IntrigueDeckCard[];
  mode: IntrigueSelectorMode;
  canAquireCards?: boolean;
  playerId?: number;
  colorScheme: 'neutral' | 'positive' | 'negative';
}

@Component({
  selector: 'dune-intrigues-preview-dialog',
  templateUrl: './intrigues-preview-dialog.component.html',
  styleUrl: './intrigues-preview-dialog.component.scss',
  standalone: false,
})
export class IntriguesPreviewDialogComponent {
  selectedIntrigue: IntrigueDeckCard | null = null;
  hoveredCardId = '';

  constructor(
    private intriguesService: IntriguesService,
    public t: TranslateService,
    public dialogRef: MatDialogRef<IntriguesPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IntrigueSelectorData,
  ) {}

  get isSelectMode(): boolean {
    return this.data.mode === 'select';
  }

  get isPreviewMode(): boolean {
    return this.data.mode === 'preview';
  }

  onIntrigueClick(intrigue: IntrigueDeckCard) {
    if (this.isSelectMode) {
      this.selectedIntrigue = intrigue;
    }
  }

  isSelected(intrigue: IntrigueDeckCard): boolean {
    return this.selectedIntrigue === intrigue;
  }

  onConfirm() {
    if (this.selectedIntrigue) {
      this.dialogRef.close(this.selectedIntrigue);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onBuyCardClicked(card: IntrigueDeckCard) {
    if (this.data.playerId !== undefined) {
      this.intriguesService.addPlayerIntrigue(this.data.playerId, card);
      this.intriguesService.removeIntrigueFromDeck(card.id);
      this.data.intrigues = this.data.intrigues.filter((x) => x.id !== card.id);
    }
  }
}
