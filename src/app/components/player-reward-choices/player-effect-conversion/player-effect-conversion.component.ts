import { Component, Input } from '@angular/core';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { isStructuredMultiplierEffect } from 'src/app/helpers/rewards';
import { EffectReward, EffectType, StructuredMultiplierEffect } from 'src/app/models';
import { StructuredConversionEffectWithGameElement } from 'src/app/models/turn-info';

@Component({
  selector: 'dune-player-effect-conversion',
  templateUrl: './player-effect-conversion.component.html',
  styleUrl: './player-effect-conversion.component.scss',
  standalone: false,
})
export class PlayerEffectConversionComponent {
  @Input() effectConversion!: StructuredConversionEffectWithGameElement;

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public isStructuredMultiplierEffect(effect: StructuredMultiplierEffect | EffectReward[]) {
    return isStructuredMultiplierEffect(effect);
  }
}
