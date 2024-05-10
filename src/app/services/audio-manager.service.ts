import { Injectable } from '@angular/core';

export type SoundType =
  | 'click'
  | 'click-soft'
  | 'tech-tile'
  | 'atmospheric'
  | 'conflict'
  | 'ping'
  | 'water'
  | 'solari'
  | 'spice'
  | 'aquire-tech'
  | 'dreadnought'
  | 'high-council'
  | 'victory-point'
  | 'swordmaster'
  | 'intrigue'
  | 'troops'
  | 'combat'
  | 'sword';

export interface Sound {
  url: string;
  volume: number;
}

@Injectable({
  providedIn: 'root',
})
export class AudioManager {
  private clickSound: Sound = { url: 'assets/audio/sounds/click.mp3', volume: 0.66 };
  private clickSoftSound: Sound = { url: 'assets/audio/sounds/click-minor.mp3', volume: 0.33 };
  private techSound: Sound = { url: 'assets/audio/sounds/flip.mp3', volume: 0.25 };
  private introSound: Sound = { url: 'assets/audio/sounds/intro.mp3', volume: 1.0 };
  private conflictSound: Sound = { url: 'assets/audio/sounds/conflict.mp3', volume: 0.33 };
  private nextRoundSound: Sound = { url: 'assets/audio/sounds/next-round.mp3', volume: 0.66 };
  private solariSound: Sound = { url: 'assets/audio/sounds/solari.mp3', volume: 1.0 };
  private waterSound: Sound = { url: 'assets/audio/sounds/water.mp3', volume: 0.2 };
  private spiceSound: Sound = { url: 'assets/audio/sounds/spice.mp3', volume: 1.0 };
  private aquireTechSound: Sound = { url: 'assets/audio/sounds/aquire-tech.mp3', volume: 0.4 };
  private dreadnoughtSound: Sound = { url: 'assets/audio/sounds/dreadnought.mp3', volume: 0.4 };
  private swordSound: Sound = { url: 'assets/audio/sounds/sword.mp3', volume: 0.15 };
  private highCouncilSound: Sound = { url: 'assets/audio/sounds/high-council.mp3', volume: 1.0 };
  private victoryPointSound: Sound = { url: 'assets/audio/sounds/victory-point.mp3', volume: 0.2 };
  private swordmasterSound: Sound = { url: 'assets/audio/sounds/swordmaster.mp3', volume: 0.3 };
  private intrigueSound: Sound = { url: 'assets/audio/sounds/intrigue.mp3', volume: 0.3 };
  private combatSound: Sound = { url: 'assets/audio/sounds/combat.mp3', volume: 0.4 };
  private troopsSound: Sound = { url: 'assets/audio/sounds/troops.mp3', volume: 0.8 };

  constructor() {}

  playSound(sound: SoundType, chorusAmount = 1) {
    if (sound === 'click') {
      this.play(this.clickSound);
    } else if (sound === 'click-soft') {
      this.play(this.clickSoftSound);
    } else if (sound === 'tech-tile') {
      this.play(this.techSound);
    } else if (sound === 'atmospheric') {
      this.play(this.introSound);
    } else if (sound === 'conflict') {
      this.play(this.conflictSound);
    } else if (sound === 'ping') {
      this.play(this.nextRoundSound);
    } else if (sound === 'solari') {
      this.play(this.solariSound);
    } else if (sound === 'spice') {
      this.play(this.spiceSound);
    } else if (sound === 'water') {
      this.play(this.waterSound);
    } else if (sound === 'aquire-tech') {
      this.play(this.aquireTechSound);
    } else if (sound === 'dreadnought') {
      this.play(this.dreadnoughtSound);
    } else if (sound === 'sword') {
      this.play(this.swordSound);
    } else if (sound === 'high-council') {
      this.play(this.highCouncilSound);
    } else if (sound === 'victory-point') {
      this.play(this.victoryPointSound);
    } else if (sound === 'swordmaster') {
      this.play(this.swordmasterSound);
    } else if (sound === 'troops') {
      this.play(this.troopsSound);
    } else if (sound === 'combat') {
      this.play(this.combatSound);
    } else if (sound === 'intrigue') {
      this.play(this.intrigueSound);
    }

    if (chorusAmount > 1) {
      setTimeout(() => this.playSound(sound, chorusAmount - 1), 200);
    }
  }

  private play(sound: Sound) {
    const audio = new Audio(sound.url);
    audio.volume = sound.volume;
    audio.play();
  }
}
