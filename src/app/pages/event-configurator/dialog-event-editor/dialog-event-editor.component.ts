import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DuneEvent } from 'src/app/constants/events';
import { EventEditorComponent } from '../event-editor/event-editor.component';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-dialog-event-editor',
  templateUrl: './dialog-event-editor.component.html',
  styleUrls: ['./dialog-event-editor.component.scss'],
})
export class DialogEventEditorComponent {
  @ViewChild(EventEditorComponent) eventEditorComponent!: EventEditorComponent;

  constructor(
    public t: TranslateService,
    public dialogRef: MatDialogRef<DialogEventEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; event: DuneEvent }
  ) {}

  get dialogTitle(): string {
    return this.data.title;
  }

  get event(): DuneEvent {
    return this.data.event;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const formData = this.eventEditorComponent.getFormData();

    if (formData.valid) {
      this.dialogRef.close(formData.value);
    }
  }
}
