import { Injectable } from '@angular/core';
import { cloneDeep, shuffle } from 'lodash';
import { BehaviorSubject, first, map } from 'rxjs';
import { DuneEvent, duneEvents } from '../constants/events';

@Injectable({
  providedIn: 'root',
})
export class DuneEventsManager {
  private eventsSubject = new BehaviorSubject<DuneEvent[]>(duneEvents);
  public events$ = this.eventsSubject.asObservable();

  private eventDeckSubject = new BehaviorSubject<Omit<DuneEvent, 'cardAmount'>[]>([]);
  public eventDeck$ = this.eventDeckSubject.asObservable();
  public currentEvent$ = this.eventDeck$.pipe(map((x) => x[0]));

  constructor() {
    const eventsString = localStorage.getItem('events');
    if (eventsString) {
      const events = JSON.parse(eventsString) as DuneEvent[];

      // Workaround for local storage not being able to store functions
      const realEvents = events.map((x) => {
        const techTile = duneEvents.find((y) => y.title.en === x.title.en);
        return techTile ?? x;
      });

      this.eventsSubject.next(realEvents);
    } else {
    }

    this.events$.subscribe((events) => {
      localStorage.setItem('events', JSON.stringify(events));
    });

    const eventDeckString = localStorage.getItem('eventDeck');
    if (eventDeckString) {
      const eventDeck = JSON.parse(eventDeckString) as Omit<DuneEvent, 'cardAmount'>[];

      // Workaround for local storage not being able to store functions
      const realEvents = eventDeck.map((x) => {
        const techTile = duneEvents.find((y) => y.title.en === x.title.en);
        return techTile ?? x;
      });

      this.eventDeckSubject.next(realEvents);
    } else {
    }

    this.eventDeck$.subscribe((eventDeck) => {
      localStorage.setItem('eventDeck', JSON.stringify(eventDeck));
    });
  }

  public get events() {
    return cloneDeep(this.eventsSubject.value);
  }

  public get eventDeck() {
    return cloneDeep(this.eventDeckSubject.value);
  }

  public getCurrentEvent() {
    const currentEvent = this.eventDeckSubject.value[0];
    if (currentEvent) {
      return cloneDeep(this.eventDeckSubject.value[0]);
    } else {
      return undefined;
    }
  }

  public setEventDeck() {
    const newEvents: Omit<DuneEvent, 'cardAmount'>[] = [];
    for (let event of this.events) {
      for (let i = 0; i < (event.cardAmount ?? 1); i++) {
        newEvents.push({
          title: event.title,
          description: event.description,
          imagePath: event.imagePath,
          aiAdjustments: event.aiAdjustments,
          gameModifiers: event.gameModifiers,
        });
      }
    }
    this.eventDeckSubject.next(shuffle(newEvents));
  }

  public setNextEvent() {
    const eventDeck = this.eventDeck;
    eventDeck.shift();
    this.eventDeckSubject.next(eventDeck);
    return eventDeck[0];
  }

  public resetEventDeck() {
    this.eventDeckSubject.next([]);
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
