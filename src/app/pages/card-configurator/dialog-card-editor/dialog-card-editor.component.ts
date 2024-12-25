import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CardEditorComponent } from '../card-editor/card-editor.component';
import { ImperiumCard } from 'src/app/models/imperium-card';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-dialog-card-editor',
  templateUrl: './dialog-card-editor.component.html',
  styleUrls: ['./dialog-card-editor.component.scss'],
})
export class DialogCardEditorComponent {
  @ViewChild(CardEditorComponent) cardEditorComponent!: CardEditorComponent;

  constructor(
    public t: TranslateService,
    public dialogRef: MatDialogRef<DialogCardEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; imperiumCard: ImperiumCard }
  ) {}

  get dialogTitle(): string {
    return this.data.title;
  }

  get imperiumCard(): ImperiumCard {
    return this.data.imperiumCard;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const formData = this.cardEditorComponent.getFormData();

    this.dialogRef.close(formData);
  }
}
