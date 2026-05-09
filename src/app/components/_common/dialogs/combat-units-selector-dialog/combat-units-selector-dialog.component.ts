import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GameManager } from 'src/app/services/game-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

export type CombatUnitsSelectorMode = 'preview' | 'select';

export interface CombatUnitsSelectorData {
  title: string;
  troops: number;
  dreadnoughts: number;
  mode: CombatUnitsSelectorMode;
  playerId: number;
  playerColor: string;
  colorScheme: 'neutral' | 'positive' | 'negative';
  minSelected?: number;
  maxSelected?: number;
}

export interface CombatUnitsSelectorResult {
  selectedTroops: number;
  selectedDreadnoughts: number;
}

@Component({
  selector: 'dune-board-space-selector-dialog',
  templateUrl: './combat-units-selector-dialog.component.html',
  styleUrl: './combat-units-selector-dialog.component.scss',
  standalone: false,
})
export class CombatUnitsSelectorDialogComponent implements OnInit {
  selectedTroops: number[] = [];
  selectedDreadnoughts: number[] = [];
  selectedTotal: number = 0;
  hoveredUnitId = '';
  minSelected = 1;
  maxSelected = 1;

  constructor(
    public gameManager: GameManager,
    public t: TranslateService,
    public dialogRef: MatDialogRef<CombatUnitsSelectorDialogComponent, CombatUnitsSelectorResult>,
    @Inject(MAT_DIALOG_DATA)
    public data: CombatUnitsSelectorData,
  ) {}

  ngOnInit(): void {
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

  onCardClick(unitId: number, type: 'troop' | 'dreadnought') {
    if (this.isSelectMode) {
      if (this.minSelected === 1 && this.maxSelected === 1) {
        if (type === 'troop') {
          this.selectedTroops = [unitId];
          this.selectedDreadnoughts = [];
        } else {
          this.selectedDreadnoughts = [unitId];
          this.selectedTroops = [];
        }
        this.selectedTotal = 1;
      } else {
        if (!this.isSelected(unitId, type)) {
          if (this.selectedTotal < this.maxSelected) {
            if (type === 'troop') {
              this.selectedTroops.push(unitId);
            } else {
              this.selectedDreadnoughts.push(unitId);
            }
            this.selectedTotal += 1;
          }
        } else {
          if (type === 'troop') {
            this.selectedTroops = this.selectedTroops.filter((x) => x !== unitId);
          } else {
            this.selectedDreadnoughts = this.selectedDreadnoughts.filter((x) => x !== unitId);
          }
          this.selectedTotal -= 1;
        }
      }
    }
  }

  isSelected(unitId: number, type: 'troop' | 'dreadnought'): boolean {
    if (type === 'troop') {
      return this.selectedTroops.some((x) => x === unitId);
    } else {
      return this.selectedDreadnoughts.some((x) => x === unitId);
    }
  }

  onConfirm() {
    if (this.selectedTotal >= this.minSelected && this.selectedTotal <= this.maxSelected) {
      this.dialogRef.close({
        selectedTroops: this.selectedTroops.length,
        selectedDreadnoughts: this.selectedDreadnoughts.length,
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
