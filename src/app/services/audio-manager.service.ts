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
  | 'sword'
  | 'fog'
  | 'card-draw'
  | 'card-discard'
  | 'signet'
  | 'location-control'
  | 'tech-agent'
  | 'click-reverse'
  | 'influence'
  | 'focus';

export interface Sound {
  url: string;
  volume: number;
}

@Injectable({
  providedIn: 'root',
})
export class AudioManager {
  private sounds: { [key in SoundType]: Sound } = {
    click: { url: 'assets/audio/sounds/click.mp3', volume: 0.66 },
    'click-soft': { url: 'assets/audio/sounds/click-minor.mp3', volume: 0.33 },
    'tech-tile': { url: 'assets/audio/sounds/flip.mp3', volume: 0.25 },
    atmospheric: { url: 'assets/audio/sounds/intro.mp3', volume: 1.0 }, // Handle multiple sounds separately if needed
    conflict: { url: 'assets/audio/sounds/conflict.mp3', volume: 0.33 },
    ping: { url: 'assets/audio/sounds/next-round.mp3', volume: 0.66 },
    solari: { url: 'assets/audio/sounds/solari.mp3', volume: 1.0 },
    spice: { url: 'assets/audio/sounds/spice.mp3', volume: 1.0 },
    water: { url: 'assets/audio/sounds/water.mp3', volume: 0.2 },
    'aquire-tech': { url: 'assets/audio/sounds/aquire-tech.mp3', volume: 0.4 },
    dreadnought: { url: 'assets/audio/sounds/dreadnought.mp3', volume: 0.4 },
    sword: { url: 'assets/audio/sounds/sword.mp3', volume: 0.15 },
    'high-council': { url: 'assets/audio/sounds/high-council.mp3', volume: 1.0 },
    'victory-point': { url: 'assets/audio/sounds/victory-point.mp3', volume: 0.2 },
    swordmaster: { url: 'assets/audio/sounds/swordmaster.mp3', volume: 0.3 },
    intrigue: { url: 'assets/audio/sounds/intrigue.mp3', volume: 0.3 },
    troops: { url: 'assets/audio/sounds/troops.mp3', volume: 0.8 },
    combat: { url: 'assets/audio/sounds/combat.mp3', volume: 0.25 },
    fog: { url: 'assets/audio/sounds/fog.mp3', volume: 1.0 },
    'card-draw': { url: 'assets/audio/sounds/card-draw.mp3', volume: 1.0 },
    'card-discard': { url: 'assets/audio/sounds/card-discard.mp3', volume: 0.66 },
    signet: { url: 'assets/audio/sounds/signet.mp3', volume: 1.0 },
    'location-control': { url: 'assets/audio/sounds/location-control.mp3', volume: 0.33 },
    'tech-agent': { url: 'assets/audio/sounds/tech.mp3', volume: 0.5 },
    'click-reverse': { url: 'assets/audio/sounds/click-reverse.mp3', volume: 1.0 },
    influence: { url: 'assets/audio/sounds/influence.mp3', volume: 0.3 },
    focus: { url: 'assets/audio/sounds/focus.mp3', volume: 0.33 },
  };

  constructor() {}

  playSound(sound: SoundType, chorusAmount = 1) {
    const soundToPlay = this.sounds[sound];
    if (soundToPlay) {
      this.play(soundToPlay);
      if (chorusAmount > 1) {
        setTimeout(() => this.playSound(sound, chorusAmount - 1), 200);
      }
    }
  }

  private play(sound: Sound) {
    const audio = new Audio(sound.url);
    audio.volume = sound.volume;
    audio.play();
  }
}
