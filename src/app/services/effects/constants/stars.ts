import type { ISourceOptions } from '@tsparticles/engine';
import type { IEmitter } from '@tsparticles/plugin-emitters/types/Options/Interfaces/IEmitter.js';

const shootingStarEmitters = Array.from(
  { length: 5 },
  () =>
    ({
      autoPlay: true,
      startCount: 0,
      fill: false,
      direction: 'bottom-right',
      shape: { type: 'circle', options: {}, replace: { color: true, opacity: true } },
      life: { duration: -1, count: 0, wait: false },
      rate: {
        delay: { min: 2, max: 4 },
        quantity: 1,
      },
      size: { width: 100, height: 100, mode: 'percent' },
      position: {
        x: 5 + Math.random() * 90,
        y: { min: 0, max: 1 },
      },
      particles: {
        move: {
          enable: true,
          speed: { min: 4, max: 7 },
          direction: 'bottom-right',
          straight: true,
          outModes: { default: 'destroy' },
        },
        size: { value: { min: 1, max: 2 } },
        opacity: { value: 1 },
        color: { value: '#fff' },
        life: { duration: { value: { min: 2, max: 6 } }, count: 1 },
      },
    } as IEmitter)
);

const blinkingStarsEmitters = Array.from(
  { length: 8 },
  () =>
    ({
      autoPlay: true,
      startCount: 0,
      fill: false,
      direction: 'none',
      shape: { type: 'circle', options: {}, replace: { color: false, opacity: false } },
      life: { duration: -1, count: 0, wait: false },
      rate: {
        delay: { min: 0.5, max: 2 },
        quantity: 1,
      },
      size: { width: 100, height: 100, mode: 'percent' },
      position: {
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
      },
      particles: {
        size: { value: { min: 1, max: 2 } },
        color: { value: ['#ffffff', '#ffffff', '#c4d0ffff', '#fffae4ff', '#fff6d1ff'] },
        opacity: {
          value: { min: 0.1, max: 1 },
          animation: {
            enable: true,
            startValue: 'min',
            destroy: 'min',
            speed: { min: 3, max: 6 },
            sync: true,
            mode: 'auto',
          },
        },
        life: {
          duration: {
            value: 3,
            sync: false,
          },
          count: 1,
        },
        move: {
          enable: false,
        },
      },
    } as IEmitter)
);

export const stars: ISourceOptions = {
  autoPlay: true,
  fpsLimit: 60,
  style: { width: '100%', height: '620px' },
  fullScreen: false,
  particles: {
    number: {
      value: 75,
      density: {
        enable: true,
        width: 800,
        height: 800,
      },
    },
    color: {
      value: ['#ffffff', '#ffffff', '#c4d0ffff', '#718effff', '#fffae4ff', '#fff6d1ff', '#fbe48aff'],
    },
    opacity: {
      value: { min: 0.1, max: 1 },
      animation: {
        enable: true,
        speed: { min: 0.25, max: 1 },
        sync: false,
      },
    },
    size: {
      value: { min: 0.5, max: 2 },
      animation: {
        enable: true,
        speed: { min: 0.05, max: 0.2 },
        sync: false,
      },
    },
    move: {
      enable: true,
      speed: 0.02,
      direction: 'none',
      straight: false,
    },
  },
  emitters: [...shootingStarEmitters, ...blinkingStarsEmitters],
  interactivity: {
    events: {
      onHover: { enable: false },
      onClick: { enable: false },
    },
  },
};
