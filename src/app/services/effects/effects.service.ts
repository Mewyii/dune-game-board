import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { fire, spice } from './constants';
import { IParticlesProps } from 'ng-particles';
import { GameManager } from '../game-manager.service';
import { welcome } from './constants/welcome';

export interface Effect {
  id: string;
  title: string;
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
    title: 'dune: imperium',
    effect: welcome,
    duration: 5,
    show: false,
  });
  public welcomeAnimation$ = this.welcomeAnimationSubject.asObservable();

  private combatAnimationSubject = new BehaviorSubject<Effect>({
    id: 'combatEffect',
    title: 'combat',
    effect: fire,
    duration: 4,
    show: false,
  });
  public combatAnimation$ = this.combatAnimationSubject.asObservable();

  private spiceAnimationSubject = new BehaviorSubject<Effect>({
    id: 'spiceEffect',
    title: 'rundenbeginn',
    effect: spice,
    duration: 4,
    show: false,
  });
  public spiceAnimation$ = this.spiceAnimationSubject.asObservable();

  public currentTurn = 0;

  constructor(public gameManager: GameManager) {
    this.gameManager.currentRound$.subscribe((currentTurn) => {
      this.currentTurn = currentTurn;
    });

    this.gameManager.currentTurnState$.subscribe((state) => {
      if (state === 'combat') {
        this.showCombatAnimation();
      }
      if (state === 'agent-placement') {
        this.showSpiceAnimation('runde ' + this.currentTurn);
      }
      if (state === 'none') {
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

  public showCombatAnimation(title?: string) {
    this.combatAnimationSubject.next({ ...this.combatAnimation, title: title ?? this.combatAnimation.title, show: true });
  }

  public showSpiceAnimation(title?: string) {
    this.spiceAnimationSubject.next({ ...this.spiceAnimation, title: title ?? this.spiceAnimation.title, show: true });
  }
}
