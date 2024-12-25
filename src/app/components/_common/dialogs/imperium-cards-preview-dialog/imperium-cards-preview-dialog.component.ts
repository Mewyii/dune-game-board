import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImperiumDeckCard } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-imperium-cards-preview-dialog',
  templateUrl: './imperium-cards-preview-dialog.component.html',
  styleUrl: './imperium-cards-preview-dialog.component.scss',
})
export class ImperiumCardsPreviewDialogComponent implements OnInit {
  public searchString = '';
  public imperiumCards: ImperiumDeckCard[] = [];

  constructor(
    public gameManager: GameManager,
    public t: TranslateService,
    public dialogRef: MatDialogRef<ImperiumCardsPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      imperiumCards: ImperiumDeckCard[];
      playerId: number;
      canAquireCards: boolean;
      aquirableFactionTypes?: string[];
      search?: boolean;
    }
  ) {}

  ngOnInit(): void {
    if (this.data.search) {
      this.imperiumCards = [];
    } else {
      this.imperiumCards = this.data.imperiumCards;
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onBuyCardClicked(card: ImperiumDeckCard) {
    const couldBuyCard = this.gameManager.acquireImperiumDeckCard(this.data.playerId, card);
    if (couldBuyCard) {
      this.data.imperiumCards = this.data.imperiumCards.filter((x) => x.id !== card.id);
      this.filterCards();
    }
  }

  filterCards() {
    if (this.data.search && this.searchString.length > 2) {
      const searchInput = this.searchString.toLocaleLowerCase();
      this.imperiumCards = this.data.imperiumCards.filter(
        (x) =>
          x.name.en.toLocaleLowerCase().includes(searchInput) ||
          x.name.de.toLocaleLowerCase().includes(searchInput) ||
          x.faction?.toLocaleLowerCase().includes(searchInput)
      );
    } else {
      this.imperiumCards = [];
    }
  }
}
