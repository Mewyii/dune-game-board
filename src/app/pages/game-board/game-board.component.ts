import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppMode, GameContent } from 'src/app/constants/board-settings';
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
  standalone: false,
})
export class GameBoardComponent implements OnInit, AfterViewInit {
  @ViewChild('gameBoardContainer', { static: true }) gameBoardRef!: ElementRef;

  public gameContent: GameContent | undefined;
  public mode: AppMode | undefined;
  public eventsEnabled: boolean | undefined;

  public stars = stars;
  public dust = dust;
  public sand = sand;
  public ships = ships;
  public spiceGlitter = spiceGlitter;

  public viewInitialized = false;
  isChrome = false;
  isFirefox = false;

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
  ngOnInit(): void {
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    this.isFirefox = /Firefox\/\d+/.test(navigator.userAgent);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewInitialized = true;
    }, 5000);

    this.setZoom();
    window.addEventListener('resize', () => this.setZoom());
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

  private setZoom(): void {
    const element = this.gameBoardRef?.nativeElement;
    if (!element) return;

    const targetHeight = 2250;
    const currentWidth = window.innerHeight;
    const zoom = currentWidth / targetHeight;

    if (this.isChrome || this.isFirefox) {
      element.style.zoom = zoom.toString();
    } else {
      element.style.zoom = zoom.toString();
      // element.style.transform = `scale(${zoom})`;
      // element.style.transformOrigin = 'top left';
      // element.style.width = `${targetHeight}px`;
    }
  }
}
