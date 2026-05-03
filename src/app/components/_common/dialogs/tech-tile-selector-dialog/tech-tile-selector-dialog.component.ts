import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GameManager } from 'src/app/services/game-manager.service';
import { TechTileDeckCard } from 'src/app/services/tech-tiles.service';
import { TranslateService } from 'src/app/services/translate-service';

export type TechTileSelectorMode = 'preview' | 'select';

export interface TechTileSelectorData {
  title: string;
  techTiles: TechTileDeckCard[];
  mode: TechTileSelectorMode;
  playerId?: number;
  colorScheme: 'neutral' | 'positive' | 'negative';
}

@Component({
  selector: 'dune-tech-tile-selector-dialog',
  templateUrl: './tech-tile-selector-dialog.component.html',
  styleUrl: './tech-tile-selector-dialog.component.scss',
  standalone: false,
})
export class TechTileSelectorDialogComponent implements OnInit {
  public techTiles: TechTileDeckCard[] = [];
  selectedCard: TechTileDeckCard | null = null;
  hoveredBoardSpaceId = '';

  constructor(
    public gameManager: GameManager,
    public t: TranslateService,
    public dialogRef: MatDialogRef<TechTileSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: TechTileSelectorData,
  ) {}

  ngOnInit(): void {
    this.techTiles = this.data.techTiles;
  }

  get isSelectMode(): boolean {
    return this.data.mode === 'select';
  }

  get isPreviewMode(): boolean {
    return this.data.mode === 'preview';
  }

  onCardClick(card: TechTileDeckCard) {
    if (this.isSelectMode) {
      this.selectedCard = card;
    }
  }

  isSelected(card: TechTileDeckCard): boolean {
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
}
