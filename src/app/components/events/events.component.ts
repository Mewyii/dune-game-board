import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DuneEvent } from 'src/app/constants/events';
import { DuneEventsManager } from 'src/app/services/dune-events.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class EventsComponent implements OnInit {
  t = inject(TranslateService);
  gameManager = inject(GameManager);
  duneEventsManager = inject(DuneEventsManager);

  public event: Omit<DuneEvent, 'cardAmount'> | undefined;
  public currentEventIndex = 0;

  ngOnInit(): void {
    this.duneEventsManager.currentEvent$.subscribe((x) => {
      this.event = x;
    });
  }
}
