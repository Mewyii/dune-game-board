import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-dialog-game-manual',
  templateUrl: './dialog-game-manual.component.html',
  styleUrl: './dialog-game-manual.component.scss',
  standalone: false,
})
export class DialogGameManualComponent {
  constructor(
    public t: TranslateService,
    public dialogRef: MatDialogRef<DialogGameManualComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}

  onClose() {
    this.dialogRef.close();
  }
}
