import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import {
  activeFactionTypes,
  combatUnitTypes,
  effectActionMultipliers,
  effectChoices,
  effectConditions,
  effectConversions,
  effectFactionConditions,
  effectFactionMultipliers,
  effectMultipliers,
  effectRewards,
  effectSeparators,
  effectTargets,
  FactionType,
  nonFactionActionTypes,
  passiveFactionTypes,
  resourceTypes,
} from 'src/app/models';
import { ImperiumCard } from 'src/app/models/imperium-card';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-dialog-card-editor',
  templateUrl: './dialog-card-editor.component.html',
  styleUrls: ['./dialog-card-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class DialogCardEditorComponent {
  t = inject(TranslateService);
  dialogRef = inject<MatDialogRef<DialogCardEditorComponent>>(MatDialogRef);
  data = inject<{
    title: string;
    imperiumCard: ImperiumCard;
  }>(MAT_DIALOG_DATA);

  card!: ImperiumCard;
  editMode = false;

  factions = [...activeFactionTypes, ''].sort((a, b) => a.localeCompare(b)) as FactionType[];
  actionTypes = [...activeFactionTypes, ...passiveFactionTypes, ...nonFactionActionTypes].sort((a, b) => a.localeCompare(b));
  rewardTypes = [...resourceTypes, ...combatUnitTypes, ...effectRewards].sort((a, b) => a.localeCompare(b));
  conditionTypes = [...effectConditions, ...effectFactionConditions].sort((a, b) => a.localeCompare(b));
  multiplierTypes = [...effectMultipliers, ...effectFactionMultipliers, ...effectActionMultipliers].sort((a, b) =>
    a.localeCompare(b),
  );
  targetTypes = [...effectTargets].sort((a, b) => a.localeCompare(b));
  effectTypes = [
    ...effectSeparators,
    ...this.conditionTypes,
    ...effectChoices,
    ...effectConversions,
    ...this.targetTypes,
    ...this.multiplierTypes,
    ...this.rewardTypes,
  ];
  fontSizes = ['large', 'medium', 'small'];

  constructor() {
    const cardClone = cloneDeep(this.data.imperiumCard);
    this.card = {
      ...cardClone,
      name: cardClone.name || { en: '', de: '' },
      buyEffects: cardClone.buyEffects || [],
      agentEffects: cardClone.agentEffects || [],
      revealEffects: cardClone.revealEffects || [],
      fieldAccess: cardClone.fieldAccess || [],
      agentEffectSize: cardClone.agentEffectSize || 'large',
      revealEffectSize: cardClone.revealEffectSize || 'large',
      customAgentEffect: cardClone.customAgentEffect || {
        en: '',
        de: '',
        fontSize: 'medium',
      },
      customRevealEffect: cardClone.customRevealEffect || {
        en: '',
        de: '',
        fontSize: 'medium',
      },
      rarity: cardClone.rarity || 'normal',
      cardAmount: cardClone.cardAmount || 1,
    };
    this.editMode = this.card.name.en !== '';
  }

  get dialogTitle(): string {
    return this.data.title;
  }

  get imperiumCard(): ImperiumCard {
    return this.data.imperiumCard;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.card.name?.en?.trim()) {
      this.dialogRef.close(this.card);
    }
  }
}
