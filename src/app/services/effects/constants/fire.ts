import { IParticlesProps } from 'ng-particles';

export const fire: IParticlesProps = {
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
      value: ['#a12916', '#610000', '#ff8d63', '#520606', '#69011a'],
    },
    opacity: {
      value: { min: 0.1, max: 0.5 },
    },
    size: {
      value: { min: 1, max: 4 },
    },
    move: {
      enable: true,
      speed: 1.25,
      random: false,
    },
  },
  background: {
    image: 'radial-gradient(#4a0000, #000)',
  },
};
