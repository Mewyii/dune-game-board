import { Component, Input } from '@angular/core';
import { IntrigueCard, IntrigueDeckCard } from 'src/app/models/intrigue';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-intrigue-card',
  templateUrl: './intrigue-card.component.html',
  styleUrl: './intrigue-card.component.scss',
})
export class IntrigueCardComponent {
  @Input() card!: IntrigueCard | IntrigueDeckCard;

  constructor(public t: TranslateService) {}
}
