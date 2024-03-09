import { Component } from '@angular/core';
import { dust, sand, ships, stars } from 'src/app/services/effects/constants';
import { GameManager } from 'src/app/services/game-manager.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

@Component({
  selector: 'dune-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent {
  public stars = stars;
  public dust = dust;
  public sand = sand;
  public ships = ships;

  constructor(public settingsService: SettingsService, public gameManager: GameManager) {}

  async initStars(engine: Engine) {
    await loadSlim(engine);
  }

  async initDust(engine: Engine) {
    await loadSlim(engine);
  }

  async initShips(engine: Engine) {
    await loadSlim(engine);
  }

  async initSand(engine: Engine) {
    await loadSlim(engine);
  }
}
