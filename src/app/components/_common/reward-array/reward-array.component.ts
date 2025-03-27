import { Component, Input, OnInit } from '@angular/core';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import {
  getSeparatedEffectArrays,
  isChoiceEffect,
  isConditionalEffect,
  isConversionEffectType,
  isOptionEffectType,
} from 'src/app/helpers/rewards';
import { Effect, EffectType, EffectWithoutSeparator, FactionType, RewardType } from 'src/app/models';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-reward-array',
  templateUrl: './reward-array.component.html',
  styleUrl: './reward-array.component.scss',
})
export class RewardArrayComponent implements OnInit {
  public effectArrays: EffectWithoutSeparator[][] = [];
  @Input() rewards: Effect[] = [];
  @Input() size: string = '32px';
  @Input() textColor: 'black' | 'white' = 'black';
  public fontSize = '';
  public rewardAmountFontSize = '';
  public marginBottom = '';

  constructor(public t: TranslateService) {}

  ngOnInit(): void {
    this.effectArrays = getSeparatedEffectArrays(this.rewards);
    this.fontSize = 'calc(' + this.size + ' - ' + this.size + ' / 3.75)';
    this.rewardAmountFontSize = 'calc(' + this.size + ' - ' + this.size + ' / 2.25)';
    this.marginBottom = '0px';
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public isConditionalEffect(effect: EffectWithoutSeparator) {
    return isConditionalEffect(effect);
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
