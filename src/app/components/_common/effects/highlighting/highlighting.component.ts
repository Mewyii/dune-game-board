import { Component, Input, OnInit } from '@angular/core';
import { ISourceOptions } from '@tsparticles/engine';
import type { IEmitter } from '@tsparticles/plugin-emitters/types/Options/Interfaces/IEmitter.js';

@Component({
  selector: 'dune-highlighting',
  standalone: false,
  templateUrl: './highlighting.component.html',
  styleUrl: './highlighting.component.scss',
})
export class HighlightingComponent implements OnInit {
  @Input() id!: string;
  @Input() width = 100;
  @Input() height = 100;
  @Input() left = 0;
  @Input() bottom = 0;
  @Input() direction: 'inwards' | 'outwards' = 'outwards';

  highlightingEffect: ISourceOptions = this.getHighlightingAnimation();

  constructor() {}

  ngOnInit(): void {
    this.highlightingEffect = this.getHighlightingAnimation();
  }

  getHighlightingAnimation(): ISourceOptions {
    const refWidth = 300;
    const refHeight = 300;
    const refArea = refWidth * refHeight;

    const area = this.width * this.height;
    const densityFactor = Math.sqrt(refArea / area);

    const baseDelayMin = 0.1;
    const baseDelayMax = 0.4;

    const adjustedDelayMin = baseDelayMin * densityFactor;
    const adjustedDelayMax = baseDelayMax * densityFactor;

    if (this.direction === 'outwards') {
      return {
        style: {
          position: 'absolute',
          bottom: `${this.bottom}px`,
          left: `${this.left}px`,
          width: `${this.width}px`,
          height: `${this.height}px`,
        },
        fullScreen: { enable: false },
        background: { color: { value: 'transparent' } },
        particles: {
          number: { value: 0 },
          shape: { type: 'circle' },
          size: {
            value: { min: 0.25, max: 2 },
          },
          color: {
            value: ['#ffaa33', '#ffbb55', '#ff7700', '#ffc99aff'],
          },
          move: {
            enable: true,
            speed: { min: 0.05, max: 0.4 },
            direction: 'none',
            outModes: {
              default: 'destroy',
            },
          },
          opacity: {
            value: { min: 0.25, max: 0.75 },
          },
          life: {
            duration: {
              sync: false,
              value: { min: 1, max: 3 },
            },
          },
        },
        emitters: [
          {
            direction: 'top',
            rate: { delay: { min: adjustedDelayMin, max: adjustedDelayMax }, quantity: 1 },
            size: { width: 85, height: 1 },
            position: { x: 5, y: 92 },
          } as IEmitter,
          {
            direction: 'bottom',
            rate: { delay: { min: adjustedDelayMin + 0.1, max: adjustedDelayMax + 0.2 }, quantity: 1 },
            size: { width: 85, height: 1 },
            position: { x: 5, y: 8 },
          } as IEmitter,
          {
            direction: 'left',
            rate: { delay: { min: adjustedDelayMin, max: adjustedDelayMax }, quantity: 1 },
            size: { width: 1, height: 85 },
            position: { x: 8, y: 5 },
          } as IEmitter,
          {
            direction: 'right',
            rate: { delay: { min: adjustedDelayMin + 0.1, max: adjustedDelayMax + 0.2 }, quantity: 1 },
            size: { width: 1, height: 85 },
            position: { x: 92, y: 5 },
          } as IEmitter,
        ],
      } as ISourceOptions;
    } else {
      return {
        style: {
          position: 'absolute',
          bottom: `${this.bottom}px`,
          left: `${this.left}px`,
          width: `${this.width}px`,
          height: `${this.height}px`,
        },
        fullScreen: { enable: false },
        background: { color: { value: 'transparent' } },
        particles: {
          number: { value: 0 },
          shape: { type: 'circle' },
          size: {
            value: { min: 0.25, max: 2 },
          },
          color: {
            value: ['#ffaa33', '#ffbb55', '#ff7700', '#ffc99aff'],
          },
          move: {
            enable: true,
            speed: { min: 0.05, max: 0.4 },
            direction: 'none',
            outModes: {
              default: 'destroy',
            },
          },
          opacity: {
            value: { min: 0.25, max: 0.75 },
          },
          life: {
            duration: {
              sync: false,
              value: { min: 1, max: 3 },
            },
          },
        },
        shadow: {
          enable: true,
          color: '#ff9900',
          blur: 2,
        },
        emitters: [
          {
            direction: 'bottom',
            rate: { delay: { min: adjustedDelayMin, max: adjustedDelayMax }, quantity: 1 },
            size: { width: 85, height: 1 },
            position: { x: 5, y: 92 },
          } as IEmitter,
          {
            direction: 'top',
            rate: { delay: { min: adjustedDelayMin + 0.1, max: adjustedDelayMax + 0.2 }, quantity: 1 },
            size: { width: 85, height: 1 },
            position: { x: 5, y: 8 },
          } as IEmitter,
          {
            direction: 'right',
            rate: { delay: { min: adjustedDelayMin, max: adjustedDelayMax }, quantity: 1 },
            size: { width: 1, height: 85 },
            position: { x: 8, y: 5 },
          } as IEmitter,
          {
            direction: 'left',
            rate: { delay: { min: adjustedDelayMin + 0.1, max: adjustedDelayMax + 0.2 }, quantity: 1 },
            size: { width: 1, height: 85 },
            position: { x: 92, y: 5 },
          } as IEmitter,
        ],
      } as ISourceOptions;
    }
  }
}
