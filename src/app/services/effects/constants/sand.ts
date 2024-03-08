import { IParticlesProps } from 'ng-particles';

export const sand: IParticlesProps = {
  autoPlay: true,
  fpsLimit: 40,
  style: { position: 'absolute', bottom: '0px', width: '100%', height: '590px' },
  fullScreen: false,
  particles: {
    number: {
      value: 5,
    },
    color: {
      value: '#fff',
    },
    opacity: {
      value: { min: 0.25, max: 1 },
      anim: {
        enable: true,
        speed: { min: 0.5, max: 2 },
        sync: false,
      },
    },
    shape: {
      type: 'image',
      image: {
        src: '/assets/images/particles/sand.png',
      },
    },
    size: {
      value: { min: 150, max: 300 },
    },
    line_linked: {
      enable: false,
    },
    move: {
      enable: true,
      speed: { min: 5, max: 15 },
      direction: 'left',
      straight: true,
      outMode: 'out',
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
