import { Component, OnInit } from '@angular/core';
import { AnimationService, Effect } from 'src/app/services/effects/animation.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-particle-effects',
  templateUrl: './particle-effects.component.html',
  styleUrls: ['./particle-effects.component.scss'],
  standalone: false,
})
export class ParticleEffectsComponent implements OnInit {
  combatAnimation: Effect | undefined;
  spiceAnimation: Effect | undefined;
  welcomeAnimation: Effect | undefined;

  constructor(
    public t: TranslateService,
    private effectsService: AnimationService,
  ) {}

  ngOnInit(): void {
    this.effectsService.combatAnimation$.subscribe((combatAnimation) => {
      this.combatAnimation = combatAnimation;
    });
    this.effectsService.spiceAnimation$.subscribe((spiceAnimation) => {
      this.spiceAnimation = spiceAnimation;
    });
    this.effectsService.welcomeAnimation$.subscribe((welcomeAnimation) => {
      this.welcomeAnimation = welcomeAnimation;
    });
  }
}
