import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImperiumDeckCard } from 'src/app/services/cards.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

export type BoardSpaceSelectorMode = 'preview' | 'select';

export interface BoardSpaceSelectorData {
  title: string;
  imperiumCards: ImperiumDeckCard[];
  mode: BoardSpaceSelectorMode;
  playerId?: number;
  canAquireCards?: boolean;
  aquirableFactionTypes?: string[];
  search?: boolean;
}

@Component({
  selector: 'dune-board-space-selector-dialog',
  templateUrl: './board-space-selector-dialog.component.html',
  styleUrl: './board-space-selector-dialog.component.scss',
  standalone: false,
})
export class BoardSpaceSelectorDialogComponent implements OnInit {
  public searchString = '';
  public imperiumCards: ImperiumDeckCard[] = [];
  selectedCard: ImperiumDeckCard | null = null;
  hoveredBoardSpaceId = '';

  constructor(
    public gameManager: GameManager,
    public t: TranslateService,
    public dialogRef: MatDialogRef<BoardSpaceSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: BoardSpaceSelectorData,
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
