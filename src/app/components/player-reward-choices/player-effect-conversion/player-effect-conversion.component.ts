import { Component, Input } from '@angular/core';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { EffectType } from 'src/app/models';
import { StructuredConversionEffectWithGameElement } from 'src/app/models/turn-info';

@Component({
  selector: 'dune-player-effect-conversion',
  templateUrl: './player-effect-conversion.component.html',
  styleUrl: './player-effect-conversion.component.scss',
})
export class PlayerEffectConversionComponent {
  @Input() effectConversion!: StructuredConversionEffectWithGameElement;

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }
}
