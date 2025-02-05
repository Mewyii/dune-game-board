import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlotEditorComponent } from '../plot-editor/plot-editor.component';
import { ImperiumPlot } from 'src/app/models/imperium-plot';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-dialog-plot-editor',
  templateUrl: './dialog-plot-editor.component.html',
  styleUrls: ['./dialog-plot-editor.component.scss'],
})
export class DialogPlotEditorComponent {
  @ViewChild(PlotEditorComponent) plotEditorComponent!: PlotEditorComponent;

  constructor(
    public t: TranslateService,
    public dialogRef: MatDialogRef<DialogPlotEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; imperiumPlot: ImperiumPlot }
  ) {}

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

    this.dialogRef.close(formData);
  }
}
