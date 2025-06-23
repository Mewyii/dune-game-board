import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { getSeparatedEffectArrays, isConditionalEffect, isTimingEffect } from 'src/app/helpers/rewards';
import { Effect, EffectTimingConditionChoiceConversionMultiplierOrReward, EffectType } from 'src/app/models';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-reward-array',
  templateUrl: './reward-array.component.html',
  styleUrl: './reward-array.component.scss',
  standalone: false,
})
export class RewardArrayComponent implements OnInit, OnChanges {
  public effectArrays: EffectTimingConditionChoiceConversionMultiplierOrReward[][] = [];
  @Input() rewards: Effect[] = [];
  @Input() size: string = '32px';
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

  constructor(public t: TranslateService) {}

  ngOnChanges(): void {
    this.effectArrays = getSeparatedEffectArrays(this.rewards);
    const sizeNumber = parseInt(this.size);
    this.fontSize = Math.round(sizeNumber - sizeNumber / 3.75) + 'px';
    this.iconMinWidth = Math.round(sizeNumber / 1.33) + 'px';
    this.rewardAmountFontSize = Math.round(sizeNumber - sizeNumber / 2.25) + 'px';
    this.effectGap = Math.round(sizeNumber / 13) + 'px';
    this.marginBottom = Math.round(sizeNumber / 6) + 'px';
  }

  ngOnInit(): void {
    this.effectArrays = getSeparatedEffectArrays(this.rewards);
    const sizeNumber = parseInt(this.size);
    this.fontSize = Math.round(sizeNumber - sizeNumber / 3.75) + 'px';
    this.iconMinWidth = Math.round(sizeNumber / 1.33) + 'px';
    this.rewardAmountFontSize = Math.round(sizeNumber - sizeNumber / 2.25) + 'px';
    this.effectGap = Math.round(sizeNumber / 13) + 'px';
    this.marginBottom = Math.round(sizeNumber / 6) + 'px';
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public isTimingEffect(effect: EffectTimingConditionChoiceConversionMultiplierOrReward) {
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

  public isTurnStartTiming(type: EffectType) {
    return type === 'timing-turn-start';
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

  public isAgentsOnBoardSpacesMultiplierType(type: EffectType) {
    return type === 'multiplier-agents-on-board-spaces';
  }

  public isDreadnoughtAmountMultiplierType(type: EffectType) {
    return type === 'multiplier-dreadnought-amount';
  }

  public isTroopsInConflictMultiplierType(type: EffectType) {
    return type === 'multiplier-troops-in-conflict';
  }

  public getFactionTypePath(effect: any) {
    return getFactionTypePath(effect.faction);
  }
}
