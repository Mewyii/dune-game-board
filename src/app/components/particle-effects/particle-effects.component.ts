import { Component, OnInit } from '@angular/core';
import { Container, Engine } from 'tsparticles-engine';
import { loadFirePreset } from 'tsparticles-preset-fire';
import { Effect, EffectsService } from 'src/app/services/effects.service';

@Component({
  selector: 'dune-particle-effects',
  templateUrl: './particle-effects.component.html',
  styleUrls: ['./particle-effects.component.scss'],
})
export class ParticleEffectsComponent implements OnInit {
  public combatAnimation: Effect | undefined;
  public spiceAnimation: Effect | undefined;

  constructor(public effectsService: EffectsService) {}

  ngOnInit(): void {
    this.effectsService.combatAnimation$.subscribe((combatAnimation) => {
      this.combatAnimation = combatAnimation;
    });
    this.effectsService.spiceAnimation$.subscribe((spiceAnimation) => {
      this.spiceAnimation = spiceAnimation;
    });
  }

  particlesLoaded(container: Container): void {
    console.log(container);
  }

  async combatInit(engine: Engine): Promise<void> {
    await loadFirePreset(engine);
  }

  async spiceInit(engine: Engine): Promise<void> {
    await loadFirePreset(engine);
  }
}
