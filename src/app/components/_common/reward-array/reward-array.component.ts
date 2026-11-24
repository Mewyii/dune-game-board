import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';

import { getSeparatedEffectArrays, isConditionalEffect, isTargetEffect, isTimingEffect } from 'src/app/helpers/rewards';
import { LocaleType } from 'src/app/locales';
import {
  Effect,
  EffectActionMultiplierType,
  EffectFactionMultiplierType,
  EffectMultiplierType,
  EffectTargetType,
  EffectTimingConditionChoiceConversionMultiplierTargetOrReward,
  EffectTimingType,
  EffectType,
} from 'src/app/models';
import { TranslateService } from 'src/app/services/translate-service';

type MultiplierType = EffectMultiplierType | EffectFactionMultiplierType | EffectActionMultiplierType;
type TextRewardType =
  | 'troop-insert'
  | 'troop-insert-or-retreat'
  | 'troop-retreat'
  | 'dreadnought-insert'
  | 'dreadnought-insert-or-retreat'
  | 'card-return-to-hand'
  | 'card-trash-from-hand'
  | 'card-trash-in-play'
  | 'turn-pass';

interface EffectDescription {
  text: string;
}

interface RewardDescription extends EffectDescription {
  customWithReward: boolean;
}

const timingTranslationKeys: Record<Exclude<EffectTimingType, 'timing-combat'>, LocaleType> = {
  'timing-game-start': 'commonEffectTimingGameStart',
  'timing-reveal-turn': 'commonEffectTimingRevealTurn',
  'timing-round-start': 'commonEffectTimingRoundStart',
  'timing-turn-start': 'commonEffectTimingTurnStart',
  'timing-agent-placed': 'commonEffectTimingAgentPlaced',
  'timing-resource-gained': 'commonEffectTimingResourceGained',
};

const multiplierTranslationKeys: Record<MultiplierType, LocaleType> = {
  'multiplier-agents-on-board-spaces': 'commonEffectMultiplierAgentsOnBoardSpaces',
  'multiplier-cards-with-sword': 'commonEffectMultiplierCardsWithSwordAmount',
  'multiplier-dreadnought-amount': 'commonEffectMultiplierDreadnoughtAmount',
  'multiplier-dreadnought-in-conflict-amount': 'commonEffectMultiplierDreadnoughtInConflictAmount',
  'multiplier-dreadnought-in-garrison-amount': 'commonEffectMultiplierDreadnoughtInGarrisonAmount',
  'multiplier-troops-in-conflict': 'commonEffectMultiplierTroopsInConflictAmount',
  'multiplier-enemies-on-this-field': 'commonEffectMultiplierEnemiesOnThisField',
  'multiplier-connections': 'commonEffectMultiplierConnections',
  'multiplier-own-agents-on-field-type': 'commonEffectMultiplierOwnAgentsOnFieldType',
};

const targetTranslationKeys: Record<EffectTargetType, LocaleType> = {
  'target-enemies': 'commonEffectEachOpponent',
  'target-enemies-on-this-field': 'commonEffectConditionEnemiesOnThisField',
  'target-enemies-on-field-type': 'commonEffectConditionEnemiesFieldType',
  'target-enemy-controlling-this-field': 'commonEffectConditionEnemiesControllingThisField',
};

const rewardTranslationKeys: Record<TextRewardType, LocaleType> = {
  'troop-insert': 'commonEffectRewardTroopInsert',
  'troop-insert-or-retreat': 'commonEffectRewardTroopInsertOrRetreat',
  'troop-retreat': 'commonEffectRewardTroopRetreat',
  'dreadnought-insert': 'commonEffectRewardDreadnoughtInsert',
  'dreadnought-insert-or-retreat': 'commonEffectRewardDreadnoughtInsertOrRetreat',
  'card-return-to-hand': 'commonEffectRewardCardReturnToHand',
  'card-trash-from-hand': 'commonEffectRewardCardTrashFromHand',
  'card-trash-in-play': 'commonEffectRewardCardTrashInPlay',
  'turn-pass': 'commonEffectTurnPass',
};

function isMultiplierType(type: EffectType): type is MultiplierType {
  return Object.prototype.hasOwnProperty.call(multiplierTranslationKeys, type);
}

function isTextRewardType(type: EffectType): type is TextRewardType {
  return Object.prototype.hasOwnProperty.call(rewardTranslationKeys, type);
}

@Component({
  selector: 'dune-reward-array',
  templateUrl: './reward-array.component.html',
  styleUrl: './reward-array.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class RewardArrayComponent implements OnInit, OnChanges {
  public effectArrays: EffectTimingConditionChoiceConversionMultiplierTargetOrReward[][] = [];
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

  public trackArray = (_index: number, effects: EffectTimingConditionChoiceConversionMultiplierTargetOrReward[]) => effects;

  public trackReward = (_index: number, reward: EffectTimingConditionChoiceConversionMultiplierTargetOrReward) => reward;

  public rewardTextClass(baseClass: string): string {
    return `${baseClass} ${this.textColor}`;
  }

  public timingEffect(effect: EffectTimingConditionChoiceConversionMultiplierTargetOrReward): EffectDescription | undefined {
    if (!isTimingEffect(effect) || effect.type === 'timing-combat') {
      return undefined;
    }
    return { text: `${this.t.translate(timingTranslationKeys[effect.type])}:` };
  }

  public isTimingEffect(effect: EffectTimingConditionChoiceConversionMultiplierTargetOrReward): boolean {
    return isTimingEffect(effect);
  }

  public multiplierEffect(
    effect: EffectTimingConditionChoiceConversionMultiplierTargetOrReward,
  ): EffectDescription | undefined {
    if (!isMultiplierType(effect.type)) {
      return undefined;
    }

    const translationKey = multiplierTranslationKeys[effect.type];
    switch (effect.type) {
      case 'multiplier-connections':
        return { text: this.t.translate(translationKey, false, `{faction:${effect.faction}}`) };
      case 'multiplier-own-agents-on-field-type':
        return { text: this.t.translate(translationKey, false, `{faction:${effect.action}}`) };
      default:
        return { text: this.t.translate(translationKey, true, effect.amount) };
    }
  }

  public targetEffect(effect: EffectTimingConditionChoiceConversionMultiplierTargetOrReward): EffectDescription | undefined {
    if (!isTargetEffect(effect)) {
      return undefined;
    }

    const translationKey = targetTranslationKeys[effect.type];
    switch (effect.type) {
      case 'target-enemies':
        return { text: this.t.translate(translationKey) };
      case 'target-enemies-on-field-type':
        return {
          text: `${this.t.translate(translationKey, false, `{faction:${effect.action}}`)}:`,
        };
      default:
        return { text: `${this.t.translate(translationKey)}:` };
    }
  }

  public textEffect(effect: EffectTimingConditionChoiceConversionMultiplierTargetOrReward): RewardDescription | undefined {
    if (!isTextRewardType(effect.type)) {
      return undefined;
    }

    return {
      text: this.t.translate(rewardTranslationKeys[effect.type], true, effect.amount),
      customWithReward: effect.type === 'turn-pass',
    };
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

  public isConditionalEffect(effect: Effect) {
    return isConditionalEffect(effect);
  }
}
