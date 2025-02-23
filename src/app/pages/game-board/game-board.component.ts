import { AfterViewInit, Component } from '@angular/core';
import { AppMode, GameContent, Settings } from 'src/app/constants/board-settings';
import { dust, sand, ships, stars } from 'src/app/services/effects/constants';
import { spiceGlitter } from 'src/app/services/effects/constants/spice-glitter';
import { GameManager } from 'src/app/services/game-manager.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

@Component({
  selector: 'dune-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements AfterViewInit {
  public gameContent: GameContent | undefined;
  public mode: AppMode | undefined;
  public eventsEnabled: boolean | undefined;

  public stars = stars;
  public dust = dust;
  public sand = sand;
  public ships = ships;
  public spiceGlitter = spiceGlitter;

  public viewInitialized = false;

  constructor(public settingsService: SettingsService, public gameManager: GameManager) {
    this.settingsService.gameContent$.subscribe((gameContent) => {
      this.gameContent = gameContent;
    });

    this.settingsService.mode$.subscribe((mode) => {
      this.mode = mode;
    });
    this.settingsService.eventsEnabled$.subscribe((eventsEnabled) => {
      this.eventsEnabled = eventsEnabled;
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewInitialized = true;
    }, 5000);
  }

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

  async initSpiceGlitter(engine: Engine) {
    await loadSlim(engine);
  }
}
