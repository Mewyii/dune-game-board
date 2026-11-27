import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from './translate-service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private t = inject(TranslateService);

  showWarning(message: string) {
    this.snackBar.open(message, this.t.translate('commonClose'), {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['notification', 'font-text'],
      duration: 5000,
    });
  }
}
