import { IParticlesProps } from 'ng-particles';

export const ships: IParticlesProps = {
  autoPlay: true,
  fpsLimit: 40,
  style: { position: 'absolute', top: '700px', right: '450px', width: '700px', height: '650px' },
  fullScreen: false,
  particles: {
    number: {
      value: 3,
    },
    color: {
      value: ['#bbbbbb', '#494949', '#696d79', '#676767'],
    },
    opacity: {
      value: 0.66,
      anim: {
        enable: true,
        speed: { min: 0.25, max: 1 },
        opacity_min: 0.1,
        sync: false,
      },
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 1.5, max: 3 },
    },
    line_linked: {
      enable: false,
    },
    move: {
      enable: true,
      speed: { min: 0.25, max: 1.5 },
      direction: 'none',
      straight: false,
      out_mode: 'out',
      angle: { value: 90, offset: 0 },
      path: { clamp: true },
    },
    life: {
      duration: {
        sync: false,
        value: { min: 5, max: 10 },
      },
      delay: {
        random: {
          enable: true,
          minimumValue: 0.5,
        },
        value: 1,
      },
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
