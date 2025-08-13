import type { ISourceOptions } from '@tsparticles/engine';

export const dust: ISourceOptions = {
  autoPlay: true,
  fpsLimit: 40,
  style: {
    position: 'absolute',
    top: '650px',
    width: '100%',
    height: '900px',
  },
  fullScreen: {
    enable: false,
  },
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        width: 500,
        height: 500,
      },
    },
    color: {
      value: '#ffffff',
    },
    opacity: {
      value: { min: 0.2, max: 1 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    shape: {
      type: 'image',
      options: {
        image: { src: '/assets/images/particles/dust.png' },
      },
    },
    size: {
      value: { min: 50, max: 200 },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    move: {
      enable: true,
      speed: { min: 0.75, max: 1.5 },
      direction: 'none',
      straight: false,
      outModes: {
        default: 'bounce',
      },
    },
    links: {
      enable: false,
    },
  },
  interactivity: {
    events: {
      onHover: { enable: false },
      onClick: { enable: false },
    },
  },
};
