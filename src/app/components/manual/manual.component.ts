import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogGameManualComponent } from './dialog-game-manual/dialog-game-manual.component';

@Component({
  selector: 'dune-manual',
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ManualComponent {
  settingsService = inject(SettingsService);
  private dialog = inject(MatDialog);
  t = inject(TranslateService);

  onShowManualClicked() {
    this.dialog.open(DialogGameManualComponent, { width: '900px' });
  }
}
