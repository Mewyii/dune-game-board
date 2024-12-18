import { Component, Input } from '@angular/core';
import { Conflict } from 'src/app/models/conflict';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-conflict-card',
  templateUrl: './conflict-card.component.html',
  styleUrl: './conflict-card.component.scss',
})
export class ConflictCardComponent {
  @Input() conflict!: Conflict;

  constructor(public translateService: TranslateService) {}
}
