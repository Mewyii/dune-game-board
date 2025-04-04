import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Leader } from 'src/app/constants/leaders';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { combatUnitTypes, effectRewards, EffectType, resourceTypes } from 'src/app/models';

@Component({
  selector: 'dune-leader-editor',
  templateUrl: './leader-editor.component.html',
  styleUrls: ['./leader-editor.component.scss'],
})
export class LeaderEditorComponent implements OnChanges {
  @Input() leader: Leader | null = null;

  leaderForm!: FormGroup;

  editMode = false;

  rewardTypes = [...resourceTypes, ...combatUnitTypes, ...effectRewards].sort((a, b) => a.localeCompare(b));

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leader'] && changes['leader'].currentValue) {
      const leader = changes['leader'].currentValue as Leader;

      this.leaderForm.patchValue(leader);

      if (leader.startingResources) {
        const startingResourcesArray = this.startingResources;

        startingResourcesArray.clear();
        leader.startingResources.forEach((field) => {
          startingResourcesArray.push(
            this.fb.group({
              type: field.type,
              amount: field.amount,
            })
          );
        });
      }

      if (leader.name.en !== '') {
        this.editMode = true;
      }
    }
  }

  initForm() {
    this.leaderForm = this.fb.group({
      name: this.fb.group({
        en: new FormControl('', Validators.required),
        de: '',
      }),
      house: this.fb.group({
        en: '',
        de: '',
      }),
      passiveName: this.fb.group({
        en: '',
        de: '',
      }),
      passiveDescription: this.fb.group({
        en: '',
        de: '',
      }),
      signetName: this.fb.group({
        en: '',
        de: '',
      }),
      signetDescription: this.fb.group({
        en: '',
        de: '',
      }),
      imageUrl: '',
      type: 'new',
    });

    this.addStartingResourcesControl();

    if (this.leader) {
      this.leaderForm.patchValue(this.leader);
    }
  }

  // Buy Effects
  get startingResources() {
    return this.leaderForm.get('startingResources') as FormArray;
  }

  getStartingResourcesTypeControl(index: number): FormControl {
    return this.startingResources.at(index).get('type') as FormControl;
  }

  getStartingResourcesAmountControl(index: number): FormControl {
    return this.startingResources.at(index).get('amount') as FormControl;
  }

  addStartingResourcesControl() {
    this.leaderForm.addControl('startingResources', new FormArray([]));
  }

  onAddStartingResourcesClicked() {
    this.startingResources.push(
      this.fb.group({
        type: '',
        amount: undefined,
      })
    );
  }

  onRemoveStartingResourcesClicked(index: number) {
    this.startingResources.removeAt(index);
  }

  getFormData(): FormGroup {
    return this.leaderForm;
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }
}
