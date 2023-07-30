import { IParticlesProps } from 'ng-particles';

export const fire: IParticlesProps = {
  autoPlay: true,
  duration: 10,
  fpsLimit: 40,
  style: {},
  particles: {
    number: {
      value: 250,
      density: {
        enable: true,
      },
    },
    color: {
      value: ['#fdcf58', '#757676', '#f27d0c', '#800909', '#f07f13'],
    },
    opacity: {
      value: { min: 0.1, max: 0.5 },
    },
    size: {
      value: { min: 1, max: 3 },
    },
    move: {
      enable: true,
      speed: 7,
      random: false,
    },
  },
  background: {
    image: 'radial-gradient(#4a0000, #000)',
  },
};
