import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ConfirmDialogComponent {
  t = inject(TranslateService);
  dialogRef = inject<MatDialogRef<ConfirmDialogComponent>>(MatDialogRef);
  data? = inject<{
    title?: string;
    text?: string;
  }>(MAT_DIALOG_DATA);
}
