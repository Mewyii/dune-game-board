import { IParticlesProps } from 'ng-particles';

export const stars: IParticlesProps = {
  autoPlay: true,
  fpsLimit: 40,
  style: { width: '100%', height: '600px' },
  fullScreen: false,
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
        value_area: 500,
      },
    },
    color: {
      value: '#fff',
    },
    opacity: {
      value: { min: 0, max: 1 },
      anim: {
        enable: true,
        speed: 2,
        sync: false,
      },
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 0.25, max: 1.5 },
      random: true,
    },
    line_linked: {
      enable: false,
    },
    move: {
      enable: true,
      speed: 0.1,
      direction: 'top',
      straight: false,
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: false,
      },
      onclick: {
        enable: false,
      },
    },
  },
};
