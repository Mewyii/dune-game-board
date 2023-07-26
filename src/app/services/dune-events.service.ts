import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { DuneEvent, duneEvents } from '../constants/events';
import { shuffle } from '../helpers/common';

@Injectable({
  providedIn: 'root',
})
export class DuneEventsManager {
  private duneEventsSubject = new BehaviorSubject<Omit<DuneEvent, 'cardAmount'>[]>([this.getEventPlaceHolder()]);
  public duneEvents$ = this.duneEventsSubject.asObservable();

  constructor() {
    const duneEventsString = localStorage.getItem('duneEvents');
    if (duneEventsString) {
      const duneEvents = JSON.parse(duneEventsString) as Omit<DuneEvent, 'cardAmount'>[];
      this.duneEventsSubject.next(duneEvents);
    } else {
    }

    this.duneEvents$.subscribe((duneEvents) => {
      localStorage.setItem('duneEvents', JSON.stringify(duneEvents));
    });
  }

  public get duneEvents() {
    return cloneDeep(this.duneEventsSubject.value);
  }

  public shuffleDuneEvents() {
    const events = [];
    for (let event of duneEvents) {
      for (let i = 0; i < (event.cardAmount ?? 1); i++) {
        events.push({
          title: event.title,
          description: event.description,
          imagePath: event.imagePath,
        });
      }
    }
    shuffle(events);
    this.duneEventsSubject.next(events);
  }

  public resetDuneEvents() {
    this.duneEventsSubject.next([this.getEventPlaceHolder()]);
  }

  public getEventPlaceHolder() {
    return {
      title: { de: 'ereignisse', en: 'events' },
      description: { de: 'Ereignisse auf Arrakis werden hier angezeigt.', en: 'Events on Arrakis are displayed here.' },
      imagePath: '',
    };
  }
}
