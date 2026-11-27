import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppVersionService } from 'src/app/services/app-version.service';
import { TranslateService } from 'src/app/services/translate-service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'dune-version-updater',
  templateUrl: './dune-version-updater.component.html',
  styleUrl: './dune-version-updater.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DuneVersionUpdaterComponent {
  t = inject(TranslateService);
  private appVersionService = inject(AppVersionService);
  private dialog = inject(MatDialog);

  public appVersionChanged = false;
  constructor() {
    this.appVersionService.appVersionChanged$.subscribe((appVersionChanged) => {
      this.appVersionChanged = appVersionChanged;
    });
  }

  onShowVersionUpdateClicked() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        text: this.t.translate(
          'commonUpdateWarningText',
          true,
          this.appVersionService.currentAppVersion,
          this.appVersionService.newAppVersion,
        ),
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
