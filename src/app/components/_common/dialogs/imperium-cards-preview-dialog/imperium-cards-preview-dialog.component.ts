import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImperiumDeckCard } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';

@Component({
  selector: 'dune-imperium-cards-preview-dialog',
  templateUrl: './imperium-cards-preview-dialog.component.html',
  styleUrl: './imperium-cards-preview-dialog.component.scss',
})
export class ImperiumCardsPreviewDialogComponent {
  constructor(
    public gameManager: GameManager,
    public dialogRef: MatDialogRef<ImperiumCardsPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      imperiumCards: ImperiumDeckCard[];
      playerId: number;
      canAquireCards: boolean;
      aquirableFactionTypes: string[];
    }
  ) {}

  onClose() {
    this.dialogRef.close();
  }

  onBuyCardClicked(card: ImperiumDeckCard) {
    const couldBuyCard = this.gameManager.acquireImperiumDeckCard(this.data.playerId, card);
    if (couldBuyCard) {
      this.data.imperiumCards = this.data.imperiumCards.filter((x) => x.id !== card.id);
    }
  }
}
