import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { combatUnitTypes, resourceTypes, rewardTypes } from 'src/app/models';
import { IntrigueCard, intriguesTypes } from 'src/app/models/intrigue';

@Component({
  selector: 'dune-intrigue-editor',
  templateUrl: './intrigue-editor.component.html',
  styleUrls: ['./intrigue-editor.component.scss'],
})
export class IntrigueEditorComponent implements OnInit, OnChanges {
  @Input() intrigue: IntrigueCard | null = null;

  intrigueForm!: FormGroup;

  editMode = false;
  intrigueTypes = intriguesTypes;
  rewardTypes = [...resourceTypes, ...combatUnitTypes, ...rewardTypes].sort((a, b) => a.localeCompare(b)); // Add other reward types

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['intrigue'] && changes['intrigue'].currentValue) {
      const newIntrigueCard = changes['intrigue'].currentValue as IntrigueCard;

      this.intrigueForm.patchValue(newIntrigueCard);

      if (newIntrigueCard.effects) {
        const effectsArray = this.effects;

        effectsArray.clear();
        newIntrigueCard.effects.forEach((field) => {
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
        en: '',
        de: '',
      }),
      type: 'complot',
      amount: 1,
    });

    this.addEffectControl();

    if (this.intrigue) {
      this.intrigueForm.patchValue(this.intrigue);
    }
  }

  getFormData(): any {
    return this.intrigueForm.value;
  }

  // Effects
  get effects() {
    return this.intrigueForm.get('effects') as FormArray;
  }

  getEffectTypeControl(index: number): FormControl {
    return this.effects.at(index).get('type') as FormControl;
  }

  getEffectAmountControl(index: number): FormControl {
    return this.effects.at(index).get('amount') as FormControl;
  }

  addEffectControl() {
    this.intrigueForm.addControl(
      'effects',
      new FormArray([
        this.fb.group({
          type: '',
        }),
      ])
    );
  }

  onAddEffectClicked() {
    this.effects.push(
      this.fb.group({
        type: '',
      })
    );
  }

  onRemoveEffectClicked(index: number) {
    this.effects.removeAt(index);
  }
}
