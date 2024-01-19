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

  editMode = false;

  factions = [...activeFactionTypes, ...passiveFactionTypes, ''].sort((a, b) => a.localeCompare(b));
  actionTypes = [...activeFactionTypes, ...passiveFactionTypes, ...nonFactionActionTypes].sort((a, b) => a.localeCompare(b));
  rewardTypes = [...resourceTypes, ...combatUnitTypes, ...rewardTypes].sort((a, b) => a.localeCompare(b)); // Add other reward types

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
        this.imperiumCardForm.removeControl('agentEffects');
      }

      if (newImperiumCard.customRevealEffect) {
        this.hasCustomRevealEffect = true;

        this.addCustomRevealEffectControl();
        this.imperiumCardForm.removeControl('revealEffects');
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

      if (newImperiumCard.revealEffects) {
        this.hasCustomRevealEffect = false;
        const revealEffectsArray = this.revealEffects;

        revealEffectsArray.clear();
        newImperiumCard.revealEffects.forEach((field) => {
          revealEffectsArray.push(
            this.fb.group({
              type: field.type,
              amount: field.amount,
            })
          );
        });
      }

      if (newImperiumCard.name.en !== '') {
        this.editMode = true;
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
      imageUrl: '',
    });

    this.addAgentEffectControl();
    this.addRevealEffectControl();

    if (this.imperiumCard) {
      this.imperiumCardForm.patchValue(this.imperiumCard);
    }
  }

  getFormData(): any {
    return this.imperiumCardForm.value;
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

  updateAgentEffects() {
    if (this.hasCustomAgentEffect) {
      this.imperiumCardForm.removeControl('agentEffects');

      this.addCustomAgentEffectControl();
    } else {
      this.addAgentEffectControl();

      this.imperiumCardForm.removeControl('customAgentEffect');
    }
  }

  get revealEffects() {
    return this.imperiumCardForm.get('revealEffects') as FormArray;
  }

  get customRevealEffect() {
    return this.imperiumCardForm.get('customRevealEffect') as FormGroup;
  }

  getRevealEffectTypeControl(index: number): FormControl {
    return this.revealEffects.at(index).get('type') as FormControl;
  }

  getRevealEffectAmountControl(index: number): FormControl {
    return this.revealEffects.at(index).get('amount') as FormControl;
  }

  addRevealEffectControl() {
    this.imperiumCardForm.addControl(
      'revealEffects',
      new FormArray([
        this.fb.group({
          type: '',
          amount: undefined,
        }),
      ])
    );
  }

  addCustomRevealEffectControl() {
    this.imperiumCardForm.addControl(
      'customRevealEffect',
      this.fb.group({
        en: '',
        de: '',
      })
    );
  }

  onAddRevealEffectClicked() {
    this.revealEffects.push(
      this.fb.group({
        type: '',
        amount: undefined,
      })
    );
  }

  onRemoveRevealEffectClicked(index: number) {
    this.revealEffects.removeAt(index);
  }

  updateRevealEffects() {
    if (this.hasCustomRevealEffect) {
      this.imperiumCardForm.removeControl('revealEffects');

      this.addCustomRevealEffectControl();
    } else {
      this.addRevealEffectControl();

      this.imperiumCardForm.removeControl('customRevealEffect');
    }
  }
}
