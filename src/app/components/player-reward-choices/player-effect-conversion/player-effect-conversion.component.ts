import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StructuredConversionEffectWithGameElement } from 'src/app/models/turn-info';

@Component({
  selector: 'dune-player-effect-conversion',
  templateUrl: './player-effect-conversion.component.html',
  styleUrl: './player-effect-conversion.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PlayerEffectConversionComponent {
  @Input() effectConversion!: StructuredConversionEffectWithGameElement;
}
