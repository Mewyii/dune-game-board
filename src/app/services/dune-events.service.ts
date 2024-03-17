import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { DuneEvent, duneEvents } from '../constants/events';
import { shuffle } from '../helpers/common';

@Injectable({
  providedIn: 'root',
})
export class DuneEventsManager {
  private eventsSubject = new BehaviorSubject<DuneEvent[]>(duneEvents);
  public events$ = this.eventsSubject.asObservable();

  private gameEventsSubject = new BehaviorSubject<Omit<DuneEvent, 'cardAmount'>[]>([]);
  public gameEvents$ = this.gameEventsSubject.asObservable();

  constructor() {
    const eventsString = localStorage.getItem('events');
    if (eventsString) {
      const events = JSON.parse(eventsString) as DuneEvent[];
      this.eventsSubject.next(events);
    } else {
    }

    this.events$.subscribe((events) => {
      localStorage.setItem('events', JSON.stringify(events));
    });

    const gameEventsString = localStorage.getItem('gameEvents');
    if (gameEventsString) {
      const gameEvents = JSON.parse(gameEventsString) as Omit<DuneEvent, 'cardAmount'>[];
      this.gameEventsSubject.next(gameEvents);
    } else {
    }

    this.gameEvents$.subscribe((gameEvents) => {
      localStorage.setItem('gameEvents', JSON.stringify(gameEvents));
    });
  }

  public get events() {
    return cloneDeep(this.eventsSubject.value);
  }

  public get gameEvents() {
    return cloneDeep(this.gameEventsSubject.value);
  }

  public setGameEvents() {
    const newEvents = [];
    for (let event of this.events) {
      for (let i = 0; i < (event.cardAmount ?? 1); i++) {
        newEvents.push({
          title: event.title,
          description: event.description,
          imagePath: event.imagePath,
        });
      }
    }
    shuffle(newEvents);
    this.gameEventsSubject.next(newEvents);
  }

  public resetGameEvents() {
    this.gameEventsSubject.next([]);
  }

  public setEvents(events: DuneEvent[]) {
    this.eventsSubject.next(events);
  }

  public addEvent(card: DuneEvent) {
    this.eventsSubject.next([...this.events, card]);
  }

  public editEvent(card: DuneEvent) {
    const cardId = card.title.en;

    const events = this.events;
    const cardIndex = events.findIndex((x) => x.title.en === cardId);
    events[cardIndex] = card;

    this.eventsSubject.next(events);
  }

  public deleteEvent(id: string) {
    this.eventsSubject.next(this.events.filter((x) => x.title.en !== id));
  }

  public getNewEvent() {
    return {
      title: { en: '', de: '' },
      description: { en: '', de: '' },
      imagePath: '',
      cardAmount: 1,
    };
  }
}
