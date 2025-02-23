import { IParticlesProps } from 'ng-particles';

export const welcome: IParticlesProps = {
  autoPlay: true,
  duration: 10,
  fpsLimit: 40,
  style: {},
  particles: {
    number: {
      value: 25,
      density: {
        enable: true,
      },
    },
    color: {
      value: ['#d17c1a', '#e97c00', '#e0a25c', '#ebc79d', '#b5762d'],
    },
    opacity: {
      value: { min: 0.01, max: 0.1 },
    },
    size: {
      value: { min: 1, max: 250 },
    },
    move: {
      enable: true,
      speed: 3,
      random: false,
    },
  },
  background: {
    image: 'radial-gradient(#784000, #000)',
  },
};
