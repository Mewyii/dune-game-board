import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Leader } from 'src/app/constants/leaders';
import { TranslateService } from 'src/app/services/translate-service';
import { LeaderEditorComponent } from '../leader-editor/leader-editor.component';

@Component({
  selector: 'dune-dialog-leader-editor',
  templateUrl: './dialog-leader-editor.component.html',
  styleUrls: ['./dialog-leader-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DialogLeaderEditorComponent {
  t = inject(TranslateService);
  dialogRef = inject<MatDialogRef<DialogLeaderEditorComponent>>(MatDialogRef);
  data = inject<{
    title: string;
    leader: Leader;
  }>(MAT_DIALOG_DATA);

  @ViewChild(LeaderEditorComponent)
  leaderEditorComponent!: LeaderEditorComponent;

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
