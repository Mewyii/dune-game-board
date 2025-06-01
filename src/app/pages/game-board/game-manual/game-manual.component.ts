import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogGameManualComponent } from 'src/app/components/manual/dialog-game-manual/dialog-game-manual.component';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-game-manual',
  templateUrl: './game-manual.component.html',
  styleUrls: ['./game-manual.component.scss'],
  standalone: false,
})
export class GameManualComponent {
  public isFullScreen = false;

  constructor(public t: TranslateService, private dialog: MatDialog) {
    addEventListener('fullscreenchange', (event) => {
      this.isFullScreen = !!document.fullscreenElement;
    });
  }

  enableFullScreen() {
    if (!this.isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  onShowGameManualClicked() {
    this.dialog.open(DialogGameManualComponent, { width: '900px' });
  }
}
