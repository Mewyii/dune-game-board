import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgParticlesService } from '@tsparticles/angular';
import { AppMode, GameContent } from 'src/app/constants/board-settings';
import { dust, sand, ships, stars } from 'src/app/services/effects/constants';
import { spiceGlitter } from 'src/app/services/effects/constants/spice-glitter';
import { RoundPhaseType, RoundService } from 'src/app/services/round.service';
import { SettingsService } from 'src/app/services/settings.service';
import { loadFull } from 'tsparticles';

@Component({
  selector: 'dune-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  standalone: false,
})
export class GameBoardComponent implements OnInit, AfterViewInit {
  @ViewChild('gameBoardContainer', { static: true }) gameBoardRef!: ElementRef;

  currentRound = 0;
  roundPhase: RoundPhaseType | undefined;

  gameContent: GameContent | undefined;
  mode: AppMode | undefined;
  eventsEnabled: boolean | undefined;

  stars = stars;
  dust = dust;
  sand = sand;
  ships = ships;
  spiceGlitter = spiceGlitter;

  viewInitialized = false;
  isChrome = false;
  isFirefox = false;

  constructor(
    private settingsService: SettingsService,
    private roundService: RoundService,
    private readonly ngParticlesService: NgParticlesService,
  ) {
    this.settingsService.gameContent$.subscribe((gameContent) => {
      this.gameContent = gameContent;
    });

    this.settingsService.mode$.subscribe((mode) => {
      this.mode = mode;
    });
    this.settingsService.eventsEnabled$.subscribe((eventsEnabled) => {
      this.eventsEnabled = eventsEnabled;
    });

    this.roundService.currentRound$.subscribe((currentRound) => {
      this.currentRound = currentRound;
    });

    this.roundService.currentRoundPhase$.subscribe((roundPhase) => {
      this.roundPhase = roundPhase;
    });
  }

  ngOnInit(): void {
    this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    this.isFirefox = /Firefox\/\d+/.test(navigator.userAgent);

    this.ngParticlesService.init(async (engine) => {
      await loadFull(engine);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewInitialized = true;
    }, 5000);

    this.setZoom();
    window.addEventListener('resize', () => this.setZoom());
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
    }
  }
}
