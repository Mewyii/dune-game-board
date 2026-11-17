import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import {
  activeFactionTypes,
  combatUnitTypes,
  effectActionMultipliers,
  effectChoices,
  effectConditions,
  effectConversions,
  effectMultipliers,
  effectRewards,
  effectSeparators,
  effectTargets,
  effectTimings,
  FactionType,
  nonFactionActionTypes,
  passiveFactionTypes,
  resourceTypes,
} from 'src/app/models';
import { TechTileCard } from 'src/app/models/tech-tile';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-dialog-tech-tile-editor',
  templateUrl: './dialog-tech-tile-editor.component.html',
  styleUrls: ['./dialog-tech-tile-editor.component.scss'],
  standalone: false,
})
export class DialogTechTileEditorComponent {
  techTile!: TechTileCard;
  editMode = false;

  factions = [...activeFactionTypes, ...passiveFactionTypes, ''].sort((a, b) => a.localeCompare(b)) as FactionType[];
  actionTypes = [...activeFactionTypes, ...passiveFactionTypes, ...nonFactionActionTypes].sort((a, b) => a.localeCompare(b));
  rewardTypes = [...resourceTypes, ...combatUnitTypes, ...effectRewards].sort((a, b) => a.localeCompare(b));
  targetTypes = [...effectTargets].sort((a, b) => a.localeCompare(b));
  effectMultiplierTypes = [...effectMultipliers, ...effectActionMultipliers].sort((a, b) => a.localeCompare(b));
  effectTypes = [
    ...effectSeparators,
    ...effectTimings,
    ...effectConditions,
    ...effectChoices,
    ...effectConversions,
    ...this.targetTypes,
    ...this.effectMultiplierTypes,
    ...this.rewardTypes,
  ];
  fontSizes = ['large', 'medium', 'small'];
  imagePositions = ['top', 'center', 'bottom'];

  constructor(
    public t: TranslateService,
    public dialogRef: MatDialogRef<DialogTechTileEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; techTile: TechTileCard },
  ) {
    this.techTile = cloneDeep(this.data.techTile);
    this.editMode = this.techTile.name.en !== '';
  }

  get dialogTitle(): string {
    return this.data.title;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.techTile.name?.en?.trim()) {
      this.dialogRef.close(this.techTile);
    }
  }
}
