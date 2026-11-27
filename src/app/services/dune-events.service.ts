import { inject, Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, map } from 'rxjs';
import { DuneEvent, duneEvents } from '../constants/events';
import { shuffleMultipleTimes } from '../helpers/common';
import { GameStatePersistenceService } from './persistence/game-state-persistence.service';

export interface DuneEventCard extends DuneEvent {
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class DuneEventsManager {
  private gameStatePersistenceService = inject(GameStatePersistenceService);

  private eventsSubject = new BehaviorSubject<DuneEvent[]>(duneEvents);
  events$ = this.eventsSubject.asObservable();

  private eventDeckSubject = new BehaviorSubject<DuneEventCard[]>([]);
  eventDeck$ = this.eventDeckSubject.asObservable();
  currentEvent$ = this.eventDeck$.pipe(map((x) => x[0]));

  constructor() {
    this.gameStatePersistenceService.bindSubjectToStorage('events', this.eventsSubject, { scope: 'game' });

    this.gameStatePersistenceService.bindSubjectToStorage('eventDeck', this.eventDeckSubject, { scope: 'game' });
  }

  get events() {
    return cloneDeep(this.eventsSubject.value);
  }

  get eventDeck() {
    return cloneDeep(this.eventDeckSubject.value);
  }

  getCurrentEvent() {
    const currentEvent = this.eventDeckSubject.value[0];
    if (currentEvent) {
      return cloneDeep(this.eventDeckSubject.value[0]);
    } else {
      return undefined;
    }
  }

  setEventDeck() {
    const newEvents: DuneEventCard[] = [];
    for (let event of this.events) {
      for (let i = 0; i < (event.cardAmount ?? 1); i++) {
        newEvents.push(this.instantiateEvent(event));
      }
    }
    this.eventDeckSubject.next(shuffleMultipleTimes(newEvents));
  }

  setNextEvent() {
    const eventDeck = this.eventDeck;
    eventDeck.shift();
    this.eventDeckSubject.next(eventDeck);
    return eventDeck[0];
  }

  resetEventDeck() {
    this.eventDeckSubject.next([]);
  }

  setEvents(events: DuneEvent[]) {
    this.eventsSubject.next(events);
  }

  addEvent(card: DuneEvent) {
    this.eventsSubject.next([...this.events, card]);
  }

  editEvent(card: DuneEvent) {
    const cardId = card.title.en;

    const events = this.events;
    const cardIndex = events.findIndex((x) => x.title.en === cardId);
    events[cardIndex] = { ...events[cardIndex], ...card };

    this.eventsSubject.next(events);
  }

  deleteEvent(id: string) {
    this.eventsSubject.next(this.events.filter((x) => x.title.en !== id));
  }

  instantiateEvent(card: DuneEvent): DuneEventCard {
    return {
      ...card,
      id: crypto.randomUUID(),
      cardAmount: 1,
    };
  }

  getNewEvent() {
    return {
      title: { en: '', de: '' },
      description: { en: '', de: '' },
      imagePath: '',
      cardAmount: 1,
    };
  }
}
