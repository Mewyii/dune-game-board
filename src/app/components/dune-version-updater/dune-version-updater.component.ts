import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppVersionService } from 'src/app/services/app-version.service';
import { TranslateService } from 'src/app/services/translate-service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'dune-version-updater',
  templateUrl: './dune-version-updater.component.html',
  styleUrl: './dune-version-updater.component.scss',
})
export class DuneVersionUpdaterComponent {
  public appVersionChanged = false;
  constructor(public t: TranslateService, private appVersionService: AppVersionService, private dialog: MatDialog) {
    this.appVersionService.appVersionChanged$.subscribe((appVersionChanged) => {
      this.appVersionChanged = appVersionChanged;
    });
  }

  onShowVersionUpdateClicked() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        text: this.t.translate('commonUpdateWarningText'),
      },
      width: '750px',
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.appVersionService.loadNewVersion();
      }
    });
  }
}
