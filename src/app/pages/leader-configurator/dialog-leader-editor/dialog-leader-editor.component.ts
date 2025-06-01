import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Leader } from 'src/app/constants/leaders';
import { LeaderEditorComponent } from '../leader-editor/leader-editor.component';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
    selector: 'dune-dialog-leader-editor',
    templateUrl: './dialog-leader-editor.component.html',
    styleUrls: ['./dialog-leader-editor.component.scss'],
    standalone: false
})
export class DialogLeaderEditorComponent {
  @ViewChild(LeaderEditorComponent) leaderEditorComponent!: LeaderEditorComponent;

  constructor(
    public t: TranslateService,
    public dialogRef: MatDialogRef<DialogLeaderEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; leader: Leader }
  ) {}

  get dialogTitle(): string {
    return this.data.title;
  }

  get leader(): Leader {
    return this.data.leader;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const formData = this.leaderEditorComponent.getFormData();
    if (formData.valid) {
      this.dialogRef.close(formData.value);
    }
  }
}
