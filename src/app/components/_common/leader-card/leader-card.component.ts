import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Leader } from 'src/app/constants/leaders';
import { LanguageString } from 'src/app/models';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-leader-card',
  templateUrl: './leader-card.component.html',
  styleUrls: ['./leader-card.component.scss'],
})
export class LeaderCardComponent implements OnInit, OnChanges {
  @Input() leader!: Leader;

  public deckName: LanguageString = { de: 'deck', en: 'deck' };
  public discardName: LanguageString = { de: 'ablage', en: 'discard' };
  public passiveEffectSize = '22px';
  public signetEffectSize = '22px';

  constructor(public t: TranslateService) {}
  ngOnInit(): void {
    if (this.leader.passiveEffectSize) {
      this.passiveEffectSize =
        this.leader.passiveEffectSize === 'large' ? '26px' : this.leader.passiveEffectSize === 'medium' ? '22px' : '18px';
    }
    if (this.leader.signetEffectSize) {
      this.signetEffectSize =
        this.leader.signetEffectSize === 'large' ? '26px' : this.leader.signetEffectSize === 'medium' ? '22px' : '18px';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.leader.passiveEffectSize) {
      this.passiveEffectSize =
        this.leader.passiveEffectSize === 'large' ? '26px' : this.leader.passiveEffectSize === 'medium' ? '22px' : '18px';
    }
    if (this.leader.signetEffectSize) {
      this.signetEffectSize =
        this.leader.signetEffectSize === 'large' ? '26px' : this.leader.signetEffectSize === 'medium' ? '22px' : '18px';
    }
  }
}
