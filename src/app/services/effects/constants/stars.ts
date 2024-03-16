import { IParticlesProps } from 'ng-particles';

export const stars: IParticlesProps = {
  autoPlay: true,
  fpsLimit: 40,
  style: { width: '100%', height: '625px' },
  fullScreen: false,
  particles: {
    number: {
      value: 25,
      density: {
        enable: true,
        value_area: 500,
      },
    },
    color: {
      value: '#fff',
    },
    opacity: {
      value: 1,
      anim: {
        enable: true,
        speed: 2,
        opacity_min: 0.1,
        sync: false,
      },
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: 1.75,
      random: true,
    },
    line_linked: {
      enable: false,
    },
    move: {
      enable: true,
      speed: 0.05,
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
