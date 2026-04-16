import { Injectable } from '@angular/core';
import type { ISourceOptions } from '@tsparticles/engine';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { LanguageString } from 'src/app/models';
import { RoundService } from '../round.service';
import { fire, spice } from './constants';
import { welcome } from './constants/welcome';

export interface Effect {
  id: string;
  title: LanguageString;
  effect: ISourceOptions;
  duration: number;
  show: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  private welcomeAnimationSubject = new BehaviorSubject<Effect>({
    id: 'welcomeEffect',
    title: { en: 'Dune: Imperium', de: 'Dune: Imperium' },
    effect: welcome,
    duration: 5,
    show: false,
  });
  welcomeAnimation$ = this.welcomeAnimationSubject.asObservable();

  private combatAnimationSubject = new BehaviorSubject<Effect>({
    id: 'combatEffect',
    title: { en: 'Combat', de: 'Kampf' },
    effect: fire,
    duration: 5,
    show: false,
  });
  combatAnimation$ = this.combatAnimationSubject.asObservable();

  private spiceAnimationSubject = new BehaviorSubject<Effect>({
    id: 'spiceEffect',
    title: { en: 'Round Start', de: 'Rundenbeginn' },
    effect: spice,
    duration: 5,
    show: false,
  });
  spiceAnimation$ = this.spiceAnimationSubject.asObservable();

  currentTurn = 0;

  constructor(private roundService: RoundService) {
    this.roundService.currentRound$.subscribe((currentTurn) => {
      this.currentTurn = currentTurn;
    });

    this.roundService.currentRoundPhase$.subscribe((phase) => {
      if (phase === 'combat') {
        this.showCombatAnimation();
      }
      if (phase === 'agent-placement') {
        this.showSpiceAnimation({ en: 'Round ' + this.currentTurn, de: 'Runde ' + this.currentTurn });
      }
      if (phase === 'none') {
        this.showWelcomeAnimation();
      }
    });

    this.welcomeAnimation$.subscribe((x) => {
      if (x.show === true) {
        setTimeout(() => {
          this.welcomeAnimationSubject.next({ ...this.welcomeAnimation, show: false });
        }, x.duration * 1000);
      }
    });

    this.combatAnimation$.subscribe((x) => {
      if (x.show === true) {
        setTimeout(() => {
          this.combatAnimationSubject.next({ ...this.combatAnimation, show: false });
        }, x.duration * 1000);
      }
    });

    this.spiceAnimation$.subscribe((x) => {
      if (x.show === true) {
        setTimeout(() => {
          this.spiceAnimationSubject.next({ ...this.spiceAnimation, show: false });
        }, x.duration * 1000);
      }
    });
  }

  get welcomeAnimation() {
    return cloneDeep(this.welcomeAnimationSubject.value);
  }
  get combatAnimation() {
    return cloneDeep(this.combatAnimationSubject.value);
  }

  get spiceAnimation() {
    return cloneDeep(this.spiceAnimationSubject.value);
  }

  showWelcomeAnimation() {
    this.welcomeAnimationSubject.next({ ...this.welcomeAnimation, show: true });
  }

  showCombatAnimation(title?: LanguageString) {
    this.combatAnimationSubject.next({ ...this.combatAnimation, title: title ?? this.combatAnimation.title, show: true });
  }

  showSpiceAnimation(title?: LanguageString) {
    this.spiceAnimationSubject.next({ ...this.spiceAnimation, title: title ?? this.spiceAnimation.title, show: true });
  }
}
