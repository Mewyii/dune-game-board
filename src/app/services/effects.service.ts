import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { fire, spice } from '../components/particle-effects/effects';
import { IParticlesProps } from 'ng-particles';
import { GameManager } from './game-manager.service';

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
    this.gameManager.currentTurn$.subscribe((currentTurn) => {
      this.currentTurn = currentTurn;
    });

    this.gameManager.currentTurnState$.subscribe((state) => {
      if (state === 'combat') {
        this.showCombatAnimation();
      }
      if (state === 'agent-placement') {
        this.showSpiceAnimation('runde ' + this.currentTurn);
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

  public get combatAnimation() {
    return cloneDeep(this.combatAnimationSubject.value);
  }

  public get spiceAnimation() {
    return cloneDeep(this.spiceAnimationSubject.value);
  }

  public showCombatAnimation(title?: string) {
    this.combatAnimationSubject.next({ ...this.combatAnimation, title: title ?? this.combatAnimation.title, show: true });
  }

  public showSpiceAnimation(title?: string) {
    this.spiceAnimationSubject.next({ ...this.spiceAnimation, title: title ?? this.spiceAnimation.title, show: true });
  }
}
