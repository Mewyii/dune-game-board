import type { ISourceOptions } from '@tsparticles/engine';

export const spice: ISourceOptions = {
  autoPlay: true,
  duration: 10,
  fpsLimit: 40,
  style: {},
  particles: {
    number: {
      value: 500,
      density: {
        enable: true,
      },
    },
    color: {
      value: ['#d17c1a', '#e97c00', '#e0a25c', '#ebc79d', '#b5762d'],
    },
    opacity: {
      value: { min: 0.1, max: 0.6 },
    },
    size: {
      value: { min: 1, max: 2 },
    },
    move: {
      enable: true,
      speed: 5,
      random: false,
    },
  },
  background: {
    image: 'radial-gradient(#d17c1a, #000)',
  },
};
