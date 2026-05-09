import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DuneLocation } from 'src/app/models';
import { GameManager } from 'src/app/services/game-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

export type BoardSpaceSelectorMode = 'preview' | 'select';

export interface BoardSpaceSelectorData {
  title: string;
  locations: DuneLocation[];
  mode: BoardSpaceSelectorMode;
  playerId?: number;
  colorScheme: 'neutral' | 'positive' | 'negative';
  minSelected?: number;
  maxSelected?: number;
}

@Component({
  selector: 'dune-board-space-selector-dialog',
  templateUrl: './board-space-selector-dialog.component.html',
  styleUrl: './board-space-selector-dialog.component.scss',
  standalone: false,
})
export class BoardSpaceSelectorDialogComponent implements OnInit {
  public locations: DuneLocation[] = [];
  selectedCards: DuneLocation[] = [];
  hoveredBoardSpaceId = '';
  minSelected = 1;
  maxSelected = 1;

  constructor(
    public gameManager: GameManager,
    public t: TranslateService,
    public dialogRef: MatDialogRef<BoardSpaceSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: BoardSpaceSelectorData,
  ) {}

  ngOnInit(): void {
    this.locations = this.data.locations;
    if (this.data.minSelected) {
      this.minSelected = this.data.minSelected;
    }
    if (this.data.maxSelected) {
      this.maxSelected = this.data.maxSelected;
    }
  }

  get isSelectMode(): boolean {
    return this.data.mode === 'select';
  }

  get isPreviewMode(): boolean {
    return this.data.mode === 'preview';
  }

  onCardClick(card: DuneLocation) {
    if (this.isSelectMode) {
      if (this.minSelected === 1 && this.maxSelected === 1) {
        this.selectedCards = [card];
      } else {
        if (!this.isSelected(card)) {
          if (this.selectedCards.length < this.maxSelected) {
            this.selectedCards.push(card);
          }
        } else {
          if (this.selectedCards.length > this.minSelected)
            this.selectedCards = this.selectedCards.filter((x) => x.actionField.title.en !== card.actionField.title.en);
        }
      }
    }
  }

  isSelected(card: DuneLocation): boolean {
    return this.selectedCards.some((x) => x.actionField.title.en === card.actionField.title.en);
  }

  onConfirm() {
    if (this.selectedCards.length >= this.minSelected && this.selectedCards.length <= this.maxSelected) {
      if (this.minSelected === 1 && this.maxSelected === 1) {
        this.dialogRef.close(this.selectedCards[0]);
      } else {
        this.dialogRef.close(this.selectedCards);
      }
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
