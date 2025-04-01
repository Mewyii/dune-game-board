import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { getSeparatedEffectArrays, isConditionalEffect, isTimingEffect } from 'src/app/helpers/rewards';
import { Effect, EffectType, EffectRewardChoiceOrCondition, EffectTimingRewardChoiceOrCondition } from 'src/app/models';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-reward-array',
  templateUrl: './reward-array.component.html',
  styleUrl: './reward-array.component.scss',
})
export class RewardArrayComponent implements OnInit, OnChanges {
  public effectArrays: EffectTimingRewardChoiceOrCondition[][] = [];
  @Input() rewards: Effect[] = [];
  @Input() size: string = '32px';
  @Input() textColor: 'black' | 'white' | 'white-clear' = 'black';
  public fontSize = '';
  public rewardAmountFontSize = '';
  public marginBottom = '';

  constructor(public t: TranslateService) {}

  ngOnChanges(): void {
    this.effectArrays = getSeparatedEffectArrays(this.rewards);
  }

  ngOnInit(): void {
    this.effectArrays = getSeparatedEffectArrays(this.rewards);
    this.fontSize = 'calc(' + this.size + ' - ' + this.size + ' / 3.75)';
    this.rewardAmountFontSize = 'calc(' + this.size + ' - ' + this.size + ' / 2.25)';
    this.marginBottom = '0px';
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public isTimingEffect(effect: EffectTimingRewardChoiceOrCondition) {
    return isTimingEffect(effect);
  }

  public isConditionalEffect(effect: Effect) {
    return isConditionalEffect(effect);
  }

  public isRoundStartTiming(type: EffectType) {
    return type === 'timing-round-start';
  }

  public isRevealTurnTiming(type: EffectType) {
    return type === 'timing-reveal-turn';
  }

  public isInfluenceType(type: EffectType) {
    return type === 'condition-influence';
  }

  public isConnectionType(type: EffectType) {
    return type === 'condition-connection';
  }

  public getFactionTypePath(effect: any) {
    return getFactionTypePath(effect.faction);
  }
}
