import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import {
  combatUnitTypes,
  effectChoices,
  effectConversions,
  effectMultipliers,
  effectRewards,
  EffectType,
  resourceTypes,
} from 'src/app/models';
import { IntrigueCard, intriguesTypes, IntrigueType } from 'src/app/models/intrigue';

@Component({
  selector: 'dune-intrigue-editor',
  templateUrl: './intrigue-editor.component.html',
  styleUrls: ['./intrigue-editor.component.scss'],
  standalone: false,
})
export class IntrigueEditorComponent implements OnInit, OnChanges {
  @Input() intrigue: IntrigueCard | null = null;

  intrigueForm!: FormGroup;

  editMode = false;
  intrigueTypes = intriguesTypes;
  rewardTypes = [...resourceTypes, ...combatUnitTypes, ...effectRewards].sort((a, b) => a.localeCompare(b));
  effectTypes = [...effectChoices, ...effectConversions, ...effectMultipliers, ...this.rewardTypes];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['intrigue'] && changes['intrigue'].currentValue) {
      const newIntrigueCard = changes['intrigue'].currentValue as IntrigueCard;

      this.intrigueForm.patchValue(newIntrigueCard);

      if (newIntrigueCard.plotEffects) {
        const effectsArray = this.plotEffects;

        effectsArray.clear();
        newIntrigueCard.plotEffects.forEach((field) => {
          effectsArray.push(
            this.fb.group({
              type: field.type,
              amount: field.amount,
            })
          );
        });
      }

      if (newIntrigueCard.combatEffects) {
        const effectsArray = this.combatEffects;

        effectsArray.clear();
        newIntrigueCard.combatEffects.forEach((field) => {
          effectsArray.push(
            this.fb.group({
              type: field.type,
              amount: field.amount,
            })
          );
        });
      }

      if (newIntrigueCard.name.en !== '') {
        this.editMode = true;
      }
    }
  }

  initForm() {
    this.intrigueForm = this.fb.group({
      name: this.fb.group({
        en: new FormControl('', Validators.required),
        de: '',
      }),
      type: 'complot',
      amount: 1,
    });

    this.addPlotEffectControl();
    this.addCombatEffectControl();

    if (this.intrigue) {
      this.intrigueForm.patchValue(this.intrigue);
    }
  }

  getFormData(): FormGroup {
    return this.intrigueForm;
  }

  get type() {
    return (this.intrigueForm.get('type') as FormControl).value;
  }

  onTypeSelectionChanged(event: MatSelectChange) {
    const newType = event.value as IntrigueType;
    if (newType === 'complot') {
      this.combatEffects.clear();
    } else if (newType === 'combat') {
      this.plotEffects.clear();
    }
  }

  // Plot Effects
  get plotEffects() {
    return this.intrigueForm.get('plotEffects') as FormArray;
  }

  getPlotEffectTypeControl(index: number): FormControl {
    return this.plotEffects.at(index).get('type') as FormControl;
  }

  getPlotEffectAmountControl(index: number): FormControl {
    return this.plotEffects.at(index).get('amount') as FormControl;
  }

  addPlotEffectControl() {
    this.intrigueForm.addControl(
      'plotEffects',
      new FormArray([
        this.fb.group({
          type: '',
          amount: undefined,
        }),
      ])
    );
  }

  onAddPlotEffectClicked() {
    this.plotEffects.push(
      this.fb.group({
        type: '',
        amount: undefined,
      })
    );
  }

  onRemovePlotEffectClicked(index: number) {
    this.plotEffects.removeAt(index);
  }

  // Combat Effects
  get combatEffects() {
    return this.intrigueForm.get('combatEffects') as FormArray;
  }

  getCombatEffectTypeControl(index: number): FormControl {
    return this.combatEffects.at(index).get('type') as FormControl;
  }

  getCombatEffectAmountControl(index: number): FormControl {
    return this.combatEffects.at(index).get('amount') as FormControl;
  }

  addCombatEffectControl() {
    this.intrigueForm.addControl(
      'combatEffects',
      new FormArray([
        this.fb.group({
          type: '',
          amount: undefined,
        }),
      ])
    );
  }

  onAddCombatEffectClicked() {
    this.combatEffects.push(
      this.fb.group({
        type: '',
        amount: undefined,
      })
    );
  }

  onRemoveCombatEffectClicked(index: number) {
    this.combatEffects.removeAt(index);
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }
}
