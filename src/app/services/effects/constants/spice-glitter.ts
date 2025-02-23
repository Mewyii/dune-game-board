import { IParticlesProps } from 'ng-particles';

export const spiceGlitter: IParticlesProps = {
  autoPlay: true,
  fpsLimit: 40,
  style: { position: 'absolute', top: '650px', right: '50px', width: '2000px', height: '880px' },
  fullScreen: false,
  particles: {
    number: {
      value: 150,
    },
    color: {
      value: ['#d17c1a', '#e97c00', '#e0a25c', '#ebc79d'],
    },
    opacity: {
      value: { min: 0.25, max: 0.75 },
      anim: {
        enable: true,
        speed: 2,
      },
    },
    size: {
      value: { min: 1, max: 3 },
    },
    move: {
      enable: true,
      speed: { min: 0.025, max: 0.05 },
      direction: 'none',
      straight: false,
      outMode: 'bounce',
    },
    life: {
      duration: {
        sync: false,
        value: { min: 2.5, max: 5 },
      },
      delay: {
        random: {
          enable: true,
          minimumValue: 5,
        },
        value: 1,
      },
    },
  },
};
