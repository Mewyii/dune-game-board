import { Component, OnInit } from '@angular/core';
import { DuneEvent, duneEvents } from 'src/app/constants/events';
import { DuneEventsManager } from 'src/app/services/dune-events.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  public events: Omit<DuneEvent, 'cardAmount'>[] = [];
  public currentEventIndex = 0;

  constructor(
    public translateService: TranslateService,
    public gameManager: GameManager,
    public duneEventsManager: DuneEventsManager
  ) {}

  ngOnInit(): void {
    this.gameManager.currentRound$.subscribe((turn) => {
      if (turn > 0) {
        this.currentEventIndex = turn - 1;
      } else {
        this.currentEventIndex = 0;
      }
    });

    this.duneEventsManager.gameEvents$.subscribe((x) => {
      this.events = x;
    });
  }
}
