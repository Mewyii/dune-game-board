import { IParticlesProps } from 'ng-particles';

export const spice: IParticlesProps = {
  autoPlay: true,
  duration: 10,
  fpsLimit: 40,
  style: {},
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
      },
    },
    color: {
      value: ['#d17c1a', '#e97c00', '#e0a25c', '#ebd8c2', '#94632b'],
    },
    opacity: {
      value: { min: 0.1, max: 0.5 },
    },
    size: {
      value: { min: 5, max: 10 },
    },
    move: {
      enable: true,
      speed: 3,
      random: false,
    },
  },
  background: {
    image: 'radial-gradient(#d17c1a, #000)',
  },
};
