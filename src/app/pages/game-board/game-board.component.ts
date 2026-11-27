import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgParticlesService } from '@tsparticles/angular';
import {
  MultiplayerDialogComponent,
  MultiplayerDialogData,
} from 'src/app/components/multiplayer-dialog/multiplayer-dialog.component';
import { GameSessionService } from 'src/app/services/persistence/game-session.service';
import { AppMode } from 'src/app/constants/board-settings';
import { ActionField, DuneLocation, Faction } from 'src/app/models';
import { dust, sand, ships, stars } from 'src/app/services/effects/constants';
import { spiceGlitter } from 'src/app/services/effects/constants/spice-glitter';
import { LocationsService } from 'src/app/services/location-manager.service';
import { RoundPhaseType, RoundService } from 'src/app/services/round.service';
import { SettingsService } from 'src/app/services/settings.service';
import { loadFull } from 'tsparticles';

@Component({
  selector: 'dune-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class GameBoardComponent implements OnInit, AfterViewInit {
  private settingsService = inject(SettingsService);
  private locationsService = inject(LocationsService);
  private roundService = inject(RoundService);
  private readonly ngParticlesService = inject(NgParticlesService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private gameSessionService = inject(GameSessionService);

  @ViewChild('gameBoardContainer', { static: true }) gameBoardRef!: ElementRef;

  currentRound = 0;
  roundPhase: RoundPhaseType | undefined;

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

  factions: Faction[] = [];
  locations: DuneLocation[] = [];
  ix: ActionField | undefined;
  useTechTiles = false;
  useDreadnoughts = false;

  constructor() {
    this.settingsService.gameContent$.subscribe((gameContent) => {
      this.factions = gameContent.factions;
      this.ix = gameContent.useTech;
      this.useTechTiles = gameContent.useTechTiles;
      this.useDreadnoughts = gameContent.useDreadnoughts;
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

    this.locationsService.locations$.subscribe((locations) => {
      this.locations = locations;
    });
  }

  ngOnInit(): void {
    this.openMultiplayerDialogForInviteLink();

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

  /** Invite links look like `game-board?session=CODE`. The parameter is removed, so a reload doesn't open the dialog again. */
  private openMultiplayerDialogForInviteLink() {
    const sessionCode = this.activatedRoute.snapshot.queryParamMap.get('session');
    if (!sessionCode) {
      return;
    }

    void this.router.navigate([], { queryParams: { session: null }, queryParamsHandling: 'merge', replaceUrl: true });

    const isAlreadyInSession = this.gameSessionService.activeSession?.sessionCode === sessionCode.toUpperCase();
    if (isAlreadyInSession) {
      return;
    }

    const dialogData: MultiplayerDialogData = { sessionCodeFromInviteLink: sessionCode };
    this.dialog.open(MultiplayerDialogComponent, { width: '720px', data: dialogData });
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
