interface Widget {
  play: () => void;
  pause: () => void;
  seekTo: (milliseconds: number) => void;
  setVolume: (volume: number) => void;
  bind: (event: string, callback: Function) => void;
  next: () => void;
  prev: () => void;
  skip: (index: any) => void;
  getSounds: (callback: (sounds: any[]) => void) => void;
  getCurrentSound: (callback: (sounds: any) => void) => void;
  isPaused: (callback: (isPaused: boolean) => void) => void;
}

declare var SC: {
  Widget: (id: string | HTMLIFrameElement) => Widget;
};
