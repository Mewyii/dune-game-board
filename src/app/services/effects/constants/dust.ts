import { IParticlesProps } from 'ng-particles';

export const dust: IParticlesProps = {
  autoPlay: true,
  fpsLimit: 40,
  style: { position: 'absolute', top: '650px', width: '100%', height: '900px' },
  fullScreen: false,
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 500,
      },
    },
    color: {
      value: '#fff',
    },
    opacity: {
      value: { min: 0.2, max: 1 },
      anim: {
        enable: true,
        speed: { min: 0.25, max: 1 },
        sync: false,
        mode: 'random',
      },
    },
    shape: {
      type: 'image',
      image: {
        src: '/assets/images/particles/dust.png',
      },
    },
    size: {
      value: { min: 50, max: 200 },
      anim: {
        enable: true,
        speed: { min: 0.25, max: 1 },
        sync: false,
        mode: 'random',
      },
    },
    line_linked: {
      enable: false,
    },
    move: {
      enable: true,
      speed: { min: 0.75, max: 1.5 },
      direction: 'none',
      straight: false,
      outMode: 'bounce',
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
