import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash';
import { IParticlesProps } from 'ng-particles';
import { BehaviorSubject } from 'rxjs';
import { LanguageString } from 'src/app/models';
import { GameManager } from '../game-manager.service';
import { fire, spice } from './constants';
import { welcome } from './constants/welcome';

export interface Effect {
  id: string;
  title: LanguageString;
  effect: IParticlesProps;
  duration: number;
  show: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EffectsService {
  private welcomeAnimationSubject = new BehaviorSubject<Effect>({
    id: 'welcomeEffect',
    title: { en: 'Dune: Imperium', de: 'Dune: Imperium' },
    effect: welcome,
    duration: 5,
    show: false,
  });
  public welcomeAnimation$ = this.welcomeAnimationSubject.asObservable();

  private combatAnimationSubject = new BehaviorSubject<Effect>({
    id: 'combatEffect',
    title: { en: 'Combat', de: 'Kampf' },
    effect: fire,
    duration: 5,
    show: false,
  });
  public combatAnimation$ = this.combatAnimationSubject.asObservable();

  private spiceAnimationSubject = new BehaviorSubject<Effect>({
    id: 'spiceEffect',
    title: { en: 'Round Start', de: 'Rundenbeginn' },
    effect: spice,
    duration: 5,
    show: false,
  });
  public spiceAnimation$ = this.spiceAnimationSubject.asObservable();

  public currentTurn = 0;

  constructor(public gameManager: GameManager) {
    this.gameManager.currentRound$.subscribe((currentTurn) => {
      this.currentTurn = currentTurn;
    });

    this.gameManager.currentRoundPhase$.subscribe((phase) => {
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

  public get welcomeAnimation() {
    return cloneDeep(this.welcomeAnimationSubject.value);
  }
  public get combatAnimation() {
    return cloneDeep(this.combatAnimationSubject.value);
  }

  public get spiceAnimation() {
    return cloneDeep(this.spiceAnimationSubject.value);
  }

  public showWelcomeAnimation() {
    this.welcomeAnimationSubject.next({ ...this.welcomeAnimation, show: true });
  }

  public showCombatAnimation(title?: LanguageString) {
    this.combatAnimationSubject.next({ ...this.combatAnimation, title: title ?? this.combatAnimation.title, show: true });
  }

  public showSpiceAnimation(title?: LanguageString) {
    this.spiceAnimationSubject.next({ ...this.spiceAnimation, title: title ?? this.spiceAnimation.title, show: true });
  }
}
