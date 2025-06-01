import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { getSeparatedEffectArrays, isConditionalEffect, isTimingEffect } from 'src/app/helpers/rewards';
import { Effect, EffectTimingConditionChoiceConversionOrReward, EffectType } from 'src/app/models';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-reward-array',
  templateUrl: './reward-array.component.html',
  styleUrl: './reward-array.component.scss',
})
export class RewardArrayComponent implements OnInit, OnChanges {
  public effectArrays: EffectTimingConditionChoiceConversionOrReward[][] = [];
  @Input() rewards: Effect[] = [];
  @Input() size: string = '32px';
  @Input() textColor: 'black' | 'white' | 'white-clear' = 'black';
  @Input() arraySeparationGap = '4px';
  @Input() wrap = true;
  @Input() centerEffectText = false;
  public fontSize = '';
  public rewardAmountFontSize = '';
  public marginBottom = '';
  public iconMinWidth = '';
  public effectGap = '4px';

  constructor(public t: TranslateService) {}

  ngOnChanges(): void {
    this.effectArrays = getSeparatedEffectArrays(this.rewards);
    const sizeNumber = parseInt(this.size);
    this.fontSize = Math.round(sizeNumber - sizeNumber / 3.75) + 'px';
    this.iconMinWidth = Math.round(sizeNumber / 1.33) + 'px';
    this.rewardAmountFontSize = Math.round(sizeNumber - sizeNumber / 2.25) + 'px';
    this.effectGap = Math.round(sizeNumber / 6) + 'px';
    this.marginBottom = '0px';
  }

  ngOnInit(): void {
    this.effectArrays = getSeparatedEffectArrays(this.rewards);
    const sizeNumber = parseInt(this.size);
    this.fontSize = Math.round(sizeNumber - sizeNumber / 3.75) + 'px';
    this.iconMinWidth = Math.round(sizeNumber / 1.33) + 'px';
    this.rewardAmountFontSize = Math.round(sizeNumber - sizeNumber / 2.25) + 'px';
    this.effectGap = Math.round(sizeNumber / 6) + 'px';
    this.marginBottom = '0px';
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public isTimingEffect(effect: EffectTimingConditionChoiceConversionOrReward) {
    return isTimingEffect(effect);
  }

  public isConditionalEffect(effect: Effect) {
    return isConditionalEffect(effect);
  }

  public isGameStartTiming(type: EffectType) {
    return type === 'timing-game-start';
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

  public isHighCouncilConditionType(type: EffectType) {
    return type === 'condition-high-council-seat';
  }

  public getFactionTypePath(effect: any) {
    return getFactionTypePath(effect.faction);
  }
}
