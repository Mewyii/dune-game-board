import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-dialog-game-manual',
  templateUrl: './dialog-game-manual.component.html',
  styleUrl: './dialog-game-manual.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DialogGameManualComponent {
  t = inject(TranslateService);
  dialogRef = inject<MatDialogRef<DialogGameManualComponent>>(MatDialogRef);
  data = inject<{
    title: string;
  }>(MAT_DIALOG_DATA);

  onClose() {
    this.dialogRef.close();
  }
}
