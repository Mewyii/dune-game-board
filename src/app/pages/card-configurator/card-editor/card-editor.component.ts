import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ImperiumCard } from 'src/app/constants/imperium-cards';
import {
  activeFactionTypes,
  combatUnitTypes,
  nonFactionActionTypes,
  passiveFactionTypes,
  resourceTypes,
  rewardTypes,
} from 'src/app/models';

@Component({
  selector: 'dune-card-editor',
  templateUrl: './card-editor.component.html',
  styleUrls: ['./card-editor.component.scss'],
})
export class CardEditorComponent implements OnInit, OnChanges {
  @Input() imperiumCard: ImperiumCard | null = null;

  imperiumCardForm!: FormGroup;

  factions = [...activeFactionTypes, ...passiveFactionTypes];
  actionTypes = [...activeFactionTypes, ...passiveFactionTypes, ...nonFactionActionTypes];
  rewardTypes = [...resourceTypes, ...combatUnitTypes, ...rewardTypes]; // Add other reward types

  hasCustomAgentEffect = false;
  hasCustomRevealEffect = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imperiumCard'] && changes['imperiumCard'].currentValue) {
      const newImperiumCard = changes['imperiumCard'].currentValue as ImperiumCard;

      if (newImperiumCard.customAgentEffect) {
        this.hasCustomAgentEffect = true;

        this.addCustomAgentEffectControl();
      }

      this.imperiumCardForm.patchValue(newImperiumCard);

      if (newImperiumCard.agentEffects) {
        this.hasCustomAgentEffect = false;
        const agentEffectsArray = this.agentEffects;

        agentEffectsArray.clear();
        newImperiumCard.agentEffects.forEach((field) => {
          agentEffectsArray.push(
            this.fb.group({
              type: field.type,
              amount: field.amount,
            })
          );
        });
      }
    }
  }

  initForm() {
    this.imperiumCardForm = this.fb.group({
      name: this.fb.group({
        en: '',
        de: '',
      }),
      faction: '',
      persuasionCosts: null,
      fieldAccess: new FormControl([]),
      agentEffects: new FormArray([]),
      revealEffects: new FormArray([]),
      imageUrl: '',
    });

    if (this.imperiumCard) {
      this.imperiumCardForm.patchValue(this.imperiumCard);
    }
  }

  get fieldAccess() {
    return this.imperiumCardForm.get('fieldAccess') as FormArray;
  }

  get agentEffects() {
    return this.imperiumCardForm.get('agentEffects') as FormArray;
  }

  get customAgentEffect() {
    return this.imperiumCardForm.get('customAgentEffect') as FormGroup;
  }

  getAgentEffectTypeControl(index: number): FormControl {
    return this.agentEffects.at(index).get('type') as FormControl;
  }

  getAgentEffectAmountControl(index: number): FormControl {
    return this.agentEffects.at(index).get('amount') as FormControl;
  }

  addAgentEffectControl() {
    this.imperiumCardForm.addControl(
      'agentEffects',
      new FormArray([
        this.fb.group({
          type: '',
          amount: undefined,
        }),
      ])
    );
  }

  addCustomAgentEffectControl() {
    this.imperiumCardForm.addControl(
      'customAgentEffect',
      this.fb.group({
        en: '',
        de: '',
      })
    );
  }

  getFormData(): any {
    return this.imperiumCardForm.value;
  }

  updateAgentEffects() {
    if (this.hasCustomAgentEffect) {
      this.imperiumCardForm.removeControl('agentEffects');

      this.addCustomAgentEffectControl();
    } else {
      this.addAgentEffectControl();

      this.imperiumCardForm.removeControl('customAgentEffect');
    }
  }

  onAddAgentEffectClicked() {
    this.agentEffects.push(
      this.fb.group({
        type: '',
        amount: undefined,
      })
    );
  }

  onRemoveAgentEffectClicked(index: number) {
    this.agentEffects.removeAt(index);
  }
}
