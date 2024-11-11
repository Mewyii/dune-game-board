import { Component } from '@angular/core';

@Component({
  selector: 'dune-game-manual',
  templateUrl: './game-manual.component.html',
  styleUrls: ['./game-manual.component.scss'],
})
export class GameManualComponent {
  public isFullScreen = false;

  constructor() {
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
