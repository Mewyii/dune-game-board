import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DuneEvent } from 'src/app/constants/events';
import { TranslateService } from 'src/app/services/translate-service';
import { EventEditorComponent } from '../event-editor/event-editor.component';

@Component({
  selector: 'dune-dialog-event-editor',
  templateUrl: './dialog-event-editor.component.html',
  styleUrls: ['./dialog-event-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DialogEventEditorComponent {
  t = inject(TranslateService);
  dialogRef = inject<MatDialogRef<DialogEventEditorComponent>>(MatDialogRef);
  data = inject<{
    title: string;
    event: DuneEvent;
  }>(MAT_DIALOG_DATA);

  @ViewChild(EventEditorComponent) eventEditorComponent!: EventEditorComponent;

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
