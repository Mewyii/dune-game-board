import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActiveFactionType } from 'src/app/models';
import { GameManager } from 'src/app/services/game-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

export type FactionSelectorMode = 'preview' | 'select';

export interface FactionSelectorData {
  title: string;
  mode: FactionSelectorMode;
  factionTypes: ActiveFactionType[];
  playerId?: number;
}
@Component({
  selector: 'dune-faction-selector-dialog',
  templateUrl: './faction-selector-dialog.component.html',
  styleUrl: './faction-selector-dialog.component.scss',
  standalone: false,
})
export class FactionSelectorDialogComponent implements OnInit {
  public searchString = '';
  selectedFaction: ActiveFactionType | null = null;
  hoveredFactionId = '';

  constructor(
    public gameManager: GameManager,
    public t: TranslateService,
    public dialogRef: MatDialogRef<FactionSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: FactionSelectorData,
  ) {}

  ngOnInit(): void {}

  get isSelectMode(): boolean {
    return this.data.mode === 'select';
  }

  get isPreviewMode(): boolean {
    return this.data.mode === 'preview';
  }

  onCardClick(faction: ActiveFactionType) {
    if (this.isSelectMode) {
      this.selectedFaction = faction;
    }
  }

  isSelected(faction: ActiveFactionType): boolean {
    return this.selectedFaction === faction;
  }

  onConfirm() {
    if (this.selectedFaction) {
      this.dialogRef.close(this.selectedFaction);
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
