import { Injectable } from '@angular/core';

export type SoundType = 'click' | 'click-soft' | 'tech-tile' | 'atmospheric' | 'combat' | 'ping';

@Injectable({
  providedIn: 'root',
})
export class AudioManager {
  private clickSound = new Audio('assets/audio/sounds/click.mp3');
  private clickSoftSound = new Audio('assets/audio/sounds/click-minor.mp3');
  private techSound = new Audio('assets/audio/sounds/flip.mp3');
  private introSound = new Audio('assets/audio/sounds/intro.mp3');
  private combatSound = new Audio('assets/audio/sounds/combat.mp3');
  private nextRoundSound = new Audio('assets/audio/sounds/next-round.mp3');

  constructor() {
    this.clickSound.volume = 0.66;
    this.clickSoftSound.volume = 0.33;
    this.techSound.volume = 0.5;
    this.introSound.volume = 1.0;
    this.combatSound.volume = 0.5;
    this.nextRoundSound.volume = 0.66;
  }

  playSound(sound: SoundType) {
    if (sound === 'click') {
      this.clickSound.play();
    } else if (sound === 'click-soft') {
      this.clickSoftSound.play();
    } else if (sound === 'tech-tile') {
      this.techSound.play();
    } else if (sound === 'atmospheric') {
      this.introSound.play();
    } else if (sound === 'combat') {
      this.combatSound.play();
    } else if (sound === 'ping') {
      this.nextRoundSound.play();
    }
  }
}
