import { Component, Input } from '@angular/core';
import { DuneEvent } from 'src/app/constants/events';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent {
  @Input() event!: DuneEvent;

  constructor(public t: TranslateService) {}
}
