import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { IntrigueCard, IntrigueDeckCard } from 'src/app/models/intrigue';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-intrigue-card',
  templateUrl: './intrigue-card.component.html',
  styleUrl: './intrigue-card.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class IntrigueCardComponent {
  t = inject(TranslateService);

  @Input() card!: IntrigueCard | IntrigueDeckCard;
}
