import type { ISourceOptions } from '@tsparticles/engine';

export const sand: ISourceOptions = {
  autoPlay: true,
  fpsLimit: 40,
  style: { position: 'absolute', bottom: '0px', width: '100%', height: '680px' },
  fullScreen: false,
  particles: {
    number: {
      value: 5,
    },
    color: {
      value: '#fff',
    },
    opacity: {
      value: { min: 0.25, max: 1 },
      animation: {
        enable: true,
        speed: { min: 0.5, max: 2 },
        sync: false,
      },
    },
    shape: {
      type: 'image',
      options: {
        image: { src: '/assets/images/particles/sand.png' },
      },
    },
    size: {
      value: { min: 150, max: 300 },
      animation: {
        enable: true,
        speed: { min: 0.5, max: 1 },
        sync: false,
        mode: 'random',
      },
    },
    line_linked: {
      enable: false,
    },
    move: {
      enable: true,
      speed: { min: 5, max: 15 },
      direction: 'left',
      straight: true,
      outModes: 'out',
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onHover: {
        enable: false,
      },
      onClick: {
        enable: false,
      },
    },
  },
};
