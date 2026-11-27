import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IntrigueCard } from 'src/app/models/intrigue';
import { TranslateService } from 'src/app/services/translate-service';
import { IntrigueEditorComponent } from '../intrigue-editor/intrigue-editor.component';

@Component({
  selector: 'dune-dialog-intrigue-editor',
  templateUrl: './dialog-intrigue-editor.component.html',
  styleUrls: ['./dialog-intrigue-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DialogIntrigueEditorComponent {
  t = inject(TranslateService);
  dialogRef = inject<MatDialogRef<DialogIntrigueEditorComponent>>(MatDialogRef);
  data = inject<{
    title: string;
    intrigue: IntrigueCard;
  }>(MAT_DIALOG_DATA);

  @ViewChild(IntrigueEditorComponent)
  intrigueEditorComponent!: IntrigueEditorComponent;

  get dialogTitle(): string {
    return this.data.title;
  }

  get intrigue(): IntrigueCard {
    return this.data.intrigue;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const formData = this.intrigueEditorComponent.getFormData();
    if (formData.valid) {
      this.dialogRef.close(formData.value);
    }
  }
}
