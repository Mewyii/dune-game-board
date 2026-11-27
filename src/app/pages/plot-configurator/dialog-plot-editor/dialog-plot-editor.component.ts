import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImperiumPlot } from 'src/app/models/imperium-plot';
import { TranslateService } from 'src/app/services/translate-service';
import { PlotEditorComponent } from '../plot-editor/plot-editor.component';

@Component({
  selector: 'dune-dialog-plot-editor',
  templateUrl: './dialog-plot-editor.component.html',
  styleUrls: ['./dialog-plot-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DialogPlotEditorComponent {
  t = inject(TranslateService);
  dialogRef = inject<MatDialogRef<DialogPlotEditorComponent>>(MatDialogRef);
  data = inject<{
    title: string;
    imperiumPlot: ImperiumPlot;
  }>(MAT_DIALOG_DATA);

  @ViewChild(PlotEditorComponent) plotEditorComponent!: PlotEditorComponent;

  get dialogTitle(): string {
    return this.data.title;
  }

  get imperiumPlot(): ImperiumPlot {
    return this.data.imperiumPlot;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    const formData = this.plotEditorComponent.getFormData();

    if (formData.valid) {
      this.dialogRef.close(formData.value);
    }
  }
}
