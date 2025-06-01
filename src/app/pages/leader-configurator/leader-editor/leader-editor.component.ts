import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Leader } from 'src/app/constants/leaders';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { isConditionalEffect } from 'src/app/helpers/rewards';
import {
  activeFactionTypes,
  combatUnitTypes,
  effectChoices,
  effectConditions,
  effectConversions,
  effectRewards,
  effectSeparators,
  effectTimings,
  EffectType,
  FactionType,
  resourceTypes,
} from 'src/app/models';

@Component({
  selector: 'dune-leader-editor',
  templateUrl: './leader-editor.component.html',
  styleUrls: ['./leader-editor.component.scss'],
})
export class LeaderEditorComponent implements OnChanges {
  @Input() leader: Leader | null = null;

  leaderForm!: FormGroup;

  editMode = false;

  factions = [...activeFactionTypes, ''].sort((a, b) => a.localeCompare(b)) as FactionType[];
  rewardTypes = [...resourceTypes, ...combatUnitTypes, ...effectRewards].sort((a, b) => a.localeCompare(b));
  effectTypes = [
    ...this.rewardTypes,
    ...effectTimings,
    ...effectSeparators,
    ...effectChoices,
    ...effectConversions,
    ...effectConditions,
  ].sort((a, b) => a.localeCompare(b));
  fontSizes = ['large', 'medium', 'small'];

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

      if (leader.passiveEffects) {
        const passiveEffectsArray = this.passiveEffects;

        passiveEffectsArray.clear();
        leader.passiveEffects.forEach((field) => {
          if (isConditionalEffect(field)) {
            passiveEffectsArray.push(
              this.fb.group({
                type: field.type,
                amount: field.amount,
                faction: field.faction,
              })
            );
          } else {
            passiveEffectsArray.push(
              this.fb.group({
                type: field.type,
                amount: field.amount,
                faction: undefined,
              })
            );
          }
        });
      }

      if (leader.signetEffects) {
        const signetEffectsArray = this.signetEffects;

        signetEffectsArray.clear();
        leader.signetEffects.forEach((field) => {
          if (isConditionalEffect(field)) {
            signetEffectsArray.push(
              this.fb.group({
                type: field.type,
                amount: field.amount,
                faction: field.faction,
              })
            );
          } else {
            signetEffectsArray.push(
              this.fb.group({
                type: field.type,
                amount: field.amount,
                faction: undefined,
              })
            );
          }
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
      passiveEffectSize: 'medium',
      signetEffectSize: 'medium',
    });

    this.addStartingResourcesControl();
    this.addPassiveEffectControl();
    this.addSignetEffectControl();

    if (this.leader) {
      this.leaderForm.patchValue(this.leader);
    }
  }

  // Custom Starting Resources
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

  // Agent Effects
  get passiveEffects() {
    return this.leaderForm.get('passiveEffects') as FormArray;
  }

  getPassiveEffectTypeControl(index: number): FormControl {
    return this.passiveEffects.at(index).get('type') as FormControl;
  }

  getPassiveEffectAmountControl(index: number): FormControl {
    return this.passiveEffects.at(index).get('amount') as FormControl;
  }

  getPassiveEffectFactionControl(index: number): FormControl {
    return this.passiveEffects.at(index).get('faction') as FormControl;
  }

  addPassiveEffectControl() {
    this.leaderForm.addControl(
      'passiveEffects',
      new FormArray([
        this.fb.group({
          type: '',
          amount: undefined,
          faction: undefined,
        }),
      ])
    );
  }

  onAddPassiveEffectClicked() {
    this.passiveEffects.push(
      this.fb.group({
        type: '',
        amount: undefined,
        faction: undefined,
      })
    );
  }

  onRemovePassiveEffectClicked(index: number) {
    this.passiveEffects.removeAt(index);
  }

  // Reveal Effects
  get signetEffects() {
    return this.leaderForm.get('signetEffects') as FormArray;
  }

  getSignetEffectTypeControl(index: number): FormControl {
    return this.signetEffects.at(index).get('type') as FormControl;
  }

  getSignetEffectAmountControl(index: number): FormControl {
    return this.signetEffects.at(index).get('amount') as FormControl;
  }

  getSignetEffectFactionControl(index: number): FormControl {
    return this.signetEffects.at(index).get('faction') as FormControl;
  }

  addSignetEffectControl() {
    this.leaderForm.addControl(
      'signetEffects',
      new FormArray([
        this.fb.group({
          type: '',
          amount: undefined,
          faction: undefined,
        }),
      ])
    );
  }

  onAddSignetEffectClicked() {
    this.signetEffects.push(
      this.fb.group({
        type: '',
        amount: undefined,
        faction: undefined,
      })
    );
  }

  onRemoveSignetEffectClicked(index: number) {
    this.signetEffects.removeAt(index);
  }

  getFormData(): FormGroup {
    return this.leaderForm;
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public getFactionTypePath(factionType: FactionType) {
    return getFactionTypePath(factionType);
  }
}
