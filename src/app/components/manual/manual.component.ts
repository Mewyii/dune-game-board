import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogGameManualComponent } from './dialog-game-manual/dialog-game-manual.component';

@Component({
  selector: 'dune-manual',
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.scss',
  standalone: false,
})
export class ManualComponent {
  constructor(public settingsService: SettingsService, private dialog: MatDialog, public t: TranslateService) {}

  onShowManualClicked() {
    this.dialog.open(DialogGameManualComponent, { width: '900px' });
  }
}
