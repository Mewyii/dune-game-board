import { Component } from '@angular/core';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-game-manual',
  templateUrl: './game-manual.component.html',
  styleUrls: ['./game-manual.component.scss'],
})
export class GameManualComponent {
  public isFullScreen = false;

  constructor(public t: TranslateService) {
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
}
