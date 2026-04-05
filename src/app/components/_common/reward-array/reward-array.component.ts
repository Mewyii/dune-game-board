import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';

import { getSeparatedEffectArrays, isConditionalEffect, isTimingEffect } from 'src/app/helpers/rewards';
import { Effect, EffectTimingConditionChoiceConversionMultiplierOrReward } from 'src/app/models';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-reward-array',
  templateUrl: './reward-array.component.html',
  styleUrl: './reward-array.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class RewardArrayComponent implements OnInit, OnChanges {
  public effectArrays: EffectTimingConditionChoiceConversionMultiplierOrReward[][] = [];
  @Input() rewards: Effect[] = [];
  @Input() size: string = '30px';
  @Input() textColor: 'black' | 'white' | 'white-clear' = 'black';
  @Input() arraySeparationGap = '4px';
  @Input() wrap = true;
  @Input() alignItems: 'center' | 'end' | 'start' = 'center';
  @Input() vertical = false;
  public fontSize = '';
  public rewardAmountFontSize = '';
  public marginBottom = '';
  public iconMinWidth = '';
  public effectGap = '4px';
  public effectGapLarge = '6px';
  public rewardEffectMargin = '0px 0px';

  constructor(public t: TranslateService) {}

  ngOnChanges(): void {
    this.setEffectArraysAndSizes();
  }

  ngOnInit(): void {
    this.setEffectArraysAndSizes();
  }

  public trackArray = (_index: number, effects: EffectTimingConditionChoiceConversionMultiplierOrReward[]) => effects;

  public trackReward = (_index: number, reward: EffectTimingConditionChoiceConversionMultiplierOrReward) => reward;

  public rewardTextClass(baseClass: string): string {
    return `${baseClass} ${this.textColor}`;
  }

  private setEffectArraysAndSizes(): void {
    this.effectArrays = getSeparatedEffectArrays(this.rewards);
    const sizeNumber = Number.parseInt(this.size, 10) || 0;
    this.fontSize = `${Math.round(sizeNumber - sizeNumber / 3.5)}px`;
    this.iconMinWidth = `${Math.round(sizeNumber / 1.33)}px`;
    this.rewardAmountFontSize = `${Math.round(sizeNumber - sizeNumber / 2.25)}px`;
    this.effectGap = `${Math.round(sizeNumber / 13)}px`;
    this.effectGapLarge = `${Math.round(sizeNumber / 12)}px`;
    this.marginBottom = `${Math.round(sizeNumber / 6)}px`;
    this.rewardEffectMargin = this.vertical ? `${this.effectGap} 0px` : `0px ${this.effectGap}`;
  }

  public isTimingEffect(effect: EffectTimingConditionChoiceConversionMultiplierOrReward) {
    return isTimingEffect(effect);
  }

  public isConditionalEffect(effect: Effect) {
    return isConditionalEffect(effect);
  }
}
