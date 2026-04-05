import { Component, Input } from '@angular/core';
import {
  ActionType,
  effectActionConditions,
  effectFactionConditions,
  effectFactionMultipliers,
  EffectType,
  FactionType,
} from 'src/app/models';

export interface SimpleEffect {
  type: EffectType;
  amount?: number;
  faction?: FactionType;
  action?: ActionType;
}

@Component({
  selector: 'dune-effect-selector',
  templateUrl: './effect-selector.component.html',
  styleUrls: ['./effect-selector.component.scss'],
  standalone: false,
})
export class EffectSelectorComponent {
  @Input() effects!: SimpleEffect[];
  @Input() effectTypes: EffectType[] = [];
  @Input() factions: FactionType[] = [];
  @Input() actions: ActionType[] = [];
  @Input() title: string = 'Effects';

  effectRequiresFaction(type: EffectType) {
    return effectFactionConditions.some((x) => x === type) || effectFactionMultipliers.some((x) => x === type);
  }

  effectRequiresAction(type: EffectType) {
    return effectActionConditions.some((x) => x === type);
  }

  onTypeChanged(effect: SimpleEffect) {
    if (!this.effectRequiresFaction(effect.type)) {
      delete effect.faction;
    }

    if (!this.effectRequiresAction(effect.type)) {
      delete effect.action;
    }
  }

  onAddEffectClicked() {
    const newEffect: SimpleEffect = {
      type: this.effectTypes[0],
      amount: undefined,
    };
    if (this.effectRequiresFaction(newEffect.type)) {
      newEffect.faction = undefined;
    }
    if (this.effectRequiresAction(newEffect.type)) {
      newEffect.action = undefined;
    }
    this.effects.push(newEffect);
  }

  onRemoveEffectClicked(index: number) {
    this.effects.splice(index, 1);
  }
}
