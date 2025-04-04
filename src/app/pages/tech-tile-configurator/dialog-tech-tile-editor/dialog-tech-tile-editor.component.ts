import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TechTileEditorComponent } from '../tech-tile-editor/tech-tile-editor.component';
import { TechTileCard } from 'src/app/models/tech-tile';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-dialog-tech-tile-editor',
  templateUrl: './dialog-tech-tile-editor.component.html',
  styleUrls: ['./dialog-tech-tile-editor.component.scss'],
})
export class DialogTechTileEditorComponent {
  @ViewChild(TechTileEditorComponent) techTileEditorComponent!: TechTileEditorComponent;

  constructor(
    public t: TranslateService,
    public dialogRef: MatDialogRef<DialogTechTileEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; techTile: TechTileCard }
  ) {}

  get dialogTitle(): string {
    return this.data.title;
  }

  get techTile(): TechTileCard {
    return this.data.techTile;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const formData = this.techTileEditorComponent.getFormData();

    if (formData.valid) {
      this.dialogRef.close(formData.value);
    }
  }
}
