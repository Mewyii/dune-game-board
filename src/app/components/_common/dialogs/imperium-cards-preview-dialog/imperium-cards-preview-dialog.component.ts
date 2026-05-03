import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImperiumDeckCard } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

export type ImperiumCardSelectorMode = 'preview' | 'select';

export interface ImperiumCardSelectorData {
  title: string;
  imperiumCards: ImperiumDeckCard[];
  mode: ImperiumCardSelectorMode;
  playerId?: number;
  canAquireCards?: boolean;
  aquirableFactionTypes?: string[];
  search?: boolean;
  colorScheme: 'neutral' | 'positive' | 'negative';
}

@Component({
  selector: 'dune-imperium-cards-preview-dialog',
  templateUrl: './imperium-cards-preview-dialog.component.html',
  styleUrl: './imperium-cards-preview-dialog.component.scss',
  standalone: false,
})
export class ImperiumCardsPreviewDialogComponent implements OnInit {
  public searchString = '';
  public imperiumCards: ImperiumDeckCard[] = [];
  selectedCard: ImperiumDeckCard | null = null;
  hoveredCardId = '';
  constructor(
    public gameManager: GameManager,
    public t: TranslateService,
    public dialogRef: MatDialogRef<ImperiumCardsPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ImperiumCardSelectorData,
  ) {}

  ngOnInit(): void {
    this.imperiumCards = this.data.imperiumCards;
  }

  get isSelectMode(): boolean {
    return this.data.mode === 'select';
  }

  get isPreviewMode(): boolean {
    return this.data.mode === 'preview';
  }

  onCardClick(card: ImperiumDeckCard) {
    if (this.isSelectMode) {
      this.selectedCard = card;
    }
  }

  isSelected(card: ImperiumDeckCard): boolean {
    return this.selectedCard === card;
  }

  onConfirm() {
    if (this.selectedCard) {
      this.dialogRef.close(this.selectedCard);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onBuyCardClicked(card: ImperiumDeckCard) {
    if (this.data.playerId !== undefined) {
      const couldBuyCard = this.gameManager.acquireImperiumCard(this.data.playerId, card, 'deck');
      if (couldBuyCard) {
        this.data.imperiumCards = this.data.imperiumCards.filter((x) => x.id !== card.id);
        this.filterCards();
      }
    }
  }

  filterCards() {
    if (this.data.search && this.searchString.length > 0) {
      const searchInput = this.searchString.toLocaleLowerCase();
      this.imperiumCards = this.data.imperiumCards.filter(
        (x) =>
          x.name.en.toLocaleLowerCase().includes(searchInput) ||
          x.name.de.toLocaleLowerCase().includes(searchInput) ||
          x.faction?.toLocaleLowerCase().includes(searchInput),
      );
    } else {
      this.imperiumCards = this.data.imperiumCards;
    }
  }
}
