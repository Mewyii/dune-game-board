import { Component, Input } from '@angular/core';
import { Leader } from 'src/app/constants/leaders';
import { LanguageString } from 'src/app/models';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-leader-card',
  templateUrl: './leader-card.component.html',
  styleUrls: ['./leader-card.component.scss'],
})
export class LeaderCardComponent {
  @Input() leader!: Leader;

  public deckName: LanguageString = { de: 'deck', en: 'deck' };
  public discardName: LanguageString = { de: 'ablage', en: 'discard' };

  constructor(public t: TranslateService) {}
}
