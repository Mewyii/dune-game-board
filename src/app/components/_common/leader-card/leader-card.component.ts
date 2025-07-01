import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Leader } from 'src/app/constants/leaders';
import { LanguageString } from 'src/app/models';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-leader-card',
  templateUrl: './leader-card.component.html',
  styleUrls: ['./leader-card.component.scss'],
  standalone: false,
})
export class LeaderCardComponent implements OnInit, OnChanges {
  @Input() leader!: Leader;

  public deckName: LanguageString = { de: 'deck', en: 'deck' };
  public discardName: LanguageString = { de: 'ablage', en: 'discard' };
  public passiveEffectSize = '22px';
  public passiveDescriptionSize = '13px';
  public passiveDescriptionSymbolSize = '16px';
  public signetEffectSize = '22px';
  public signetDescriptionSize = '13px';
  public signetDescriptionSymbolSize = '17px';

  constructor(public t: TranslateService) {}
  ngOnInit(): void {
    this.setTextAndSymbolSizes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setTextAndSymbolSizes();
  }

  setTextAndSymbolSizes() {
    if (this.leader.passiveEffectSize) {
      this.passiveEffectSize =
        this.leader.passiveEffectSize === 'large' ? '26px' : this.leader.passiveEffectSize === 'medium' ? '22px' : '18px';
    }
    if (this.leader.signetEffectSize) {
      this.signetEffectSize =
        this.leader.signetEffectSize === 'large' ? '26px' : this.leader.signetEffectSize === 'medium' ? '22px' : '18px';
    }
    if (this.leader.passiveDescriptionSize) {
      this.passiveDescriptionSize =
        this.leader.passiveDescriptionSize === 'large'
          ? '14px'
          : this.leader.passiveDescriptionSize === 'medium'
          ? '13px'
          : '12px';
      this.passiveDescriptionSymbolSize =
        this.leader.passiveDescriptionSize === 'large'
          ? '19px'
          : this.leader.passiveDescriptionSize === 'medium'
          ? '17px'
          : '15px';
    }
    if (this.leader.signetDescriptionSize) {
      this.signetDescriptionSize =
        this.leader.signetDescriptionSize === 'large'
          ? '14px'
          : this.leader.signetDescriptionSize === 'medium'
          ? '13px'
          : '12px';
      this.signetDescriptionSymbolSize =
        this.leader.signetDescriptionSize === 'large'
          ? '19px'
          : this.leader.signetDescriptionSize === 'medium'
          ? '17px'
          : '15px';
    }
  }
}
