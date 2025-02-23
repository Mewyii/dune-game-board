import { IParticlesProps } from 'ng-particles';

export const ships: IParticlesProps = {
  autoPlay: true,
  fpsLimit: 40,
  style: { position: 'absolute', top: '600px', right: '350px', width: '800px', height: '750px' },
  fullScreen: false,
  particles: {
    number: {
      value: 6,
    },
    color: {
      value: { r: { min: 25, max: 125 }, b: { min: 25, max: 125 }, g: { min: 25, max: 125 } },
    },
    opacity: {
      value: 0.8,
      anim: {
        enable: true,
        speed: { min: 0.25, max: 0.75 },
        opacity_min: 0.4,
        sync: false,
      },
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 2.5, max: 5 },
    },
    line_linked: {
      enable: false,
    },
    move: {
      enable: true,
      speed: { min: 0.2, max: 0.75 },
      direction: 'none',
      straight: false,
      out_mode: 'out',
      angle: { value: 90, offset: 0 },
      path: { clamp: true },
    },
    life: {
      duration: {
        sync: false,
        value: { min: 5, max: 15 },
      },
      delay: {
        random: {
          enable: true,
          minimumValue: 3,
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
