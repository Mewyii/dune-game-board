import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { getFactionTypePath } from 'src/app/helpers/faction-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { isConditionalEffect } from 'src/app/helpers/rewards';
import {
  activeFactionTypes,
  combatUnitTypes,
  EffectType,
  FactionType,
  nonFactionActionTypes,
  passiveFactionTypes,
  resourceTypes,
  rewardChoices,
  rewardConditions,
  rewardSeparators,
  RewardType,
  rewardTypes,
} from 'src/app/models';
import { ImperiumCard } from 'src/app/models/imperium-card';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-card-editor',
  templateUrl: './card-editor.component.html',
  styleUrls: ['./card-editor.component.scss'],
})
export class CardEditorComponent implements OnInit, OnChanges {
  @Input() imperiumCard: ImperiumCard | null = null;

  imperiumCardForm!: FormGroup;

  editMode = false;

  factions = [...activeFactionTypes, ''].sort((a, b) => a.localeCompare(b)) as FactionType[];
  actionTypes = [...activeFactionTypes, ...passiveFactionTypes, ...nonFactionActionTypes].sort((a, b) => a.localeCompare(b));
  rewardTypes = [...resourceTypes, ...combatUnitTypes, ...rewardTypes].sort((a, b) => a.localeCompare(b)); // Add other reward types
  effectTypes = [...rewardTypes, ...rewardSeparators, ...rewardChoices, ...rewardConditions].sort((a, b) =>
    a.localeCompare(b)
  );
  fontSizes = ['large', 'medium', 'small'];

  hasCustomAgentEffect = false;
  hasCustomRevealEffect = false;

  constructor(private fb: FormBuilder, public t: TranslateService) {
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

      if (newImperiumCard.buyEffects) {
        const buyEffectsArray = this.buyEffects;

        buyEffectsArray.clear();
        newImperiumCard.buyEffects.forEach((field) => {
          buyEffectsArray.push(
            this.fb.group({
              type: field.type,
              amount: field.amount,
            })
          );
        });
      }

      if (newImperiumCard.agentEffects) {
        this.hasCustomAgentEffect = false;
        const agentEffectsArray = this.agentEffects;

        agentEffectsArray.clear();
        newImperiumCard.agentEffects.forEach((field) => {
          if (isConditionalEffect(field)) {
            agentEffectsArray.push(
              this.fb.group({
                type: field.type,
                amount: field.amount,
                faction: field.faction,
              })
            );
          } else {
            agentEffectsArray.push(
              this.fb.group({
                type: field.type,
                amount: field.amount,
                faction: undefined,
              })
            );
          }
        });
      }

      if (newImperiumCard.revealEffects) {
        this.hasCustomRevealEffect = false;
        const revealEffectsArray = this.revealEffects;

        revealEffectsArray.clear();
        newImperiumCard.revealEffects.forEach((field) => {
          if (isConditionalEffect(field)) {
            revealEffectsArray.push(
              this.fb.group({
                type: field.type,
                amount: field.amount,
                faction: field.faction,
              })
            );
          } else {
            revealEffectsArray.push(
              this.fb.group({
                type: field.type,
                amount: field.amount,
                faction: undefined,
              })
            );
          }
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
      cardAmount: 1,
      canInfiltrate: false,
      agentEffectSize: 'large',
      revealEffectSize: 'large',
    });

    this.addBuyEffectControl();
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

  getFaction() {
    return this.imperiumCardForm.get('faction') as FormArray;
  }

  // Buy Effects
  get buyEffects() {
    return this.imperiumCardForm.get('buyEffects') as FormArray;
  }

  getBuyEffectTypeControl(index: number): FormControl {
    return this.buyEffects.at(index).get('type') as FormControl;
  }

  getBuyEffectAmountControl(index: number): FormControl {
    return this.buyEffects.at(index).get('amount') as FormControl;
  }

  addBuyEffectControl() {
    this.imperiumCardForm.addControl('buyEffects', new FormArray([]));
  }

  onAddBuyEffectClicked() {
    this.buyEffects.push(
      this.fb.group({
        type: '',
        amount: undefined,
      })
    );
  }

  onRemoveBuyEffectClicked(index: number) {
    this.buyEffects.removeAt(index);
  }

  // Agent Effects
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

  getAgentEffectFactionControl(index: number): FormControl {
    return this.agentEffects.at(index).get('faction') as FormControl;
  }

  addAgentEffectControl() {
    this.imperiumCardForm.addControl(
      'agentEffects',
      new FormArray([
        this.fb.group({
          type: '',
          amount: undefined,
          faction: undefined,
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
        fontSize: 'small',
      })
    );
  }

  onAddAgentEffectClicked() {
    this.agentEffects.push(
      this.fb.group({
        type: '',
        amount: undefined,
        faction: undefined,
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

  // Reveal Effects
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

  getRevealEffectFactionControl(index: number): FormControl {
    return this.revealEffects.at(index).get('faction') as FormControl;
  }

  addRevealEffectControl() {
    this.imperiumCardForm.addControl(
      'revealEffects',
      new FormArray([
        this.fb.group({
          type: '',
          amount: undefined,
          faction: undefined,
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
        fontSize: 'small',
      })
    );
  }

  onAddRevealEffectClicked() {
    this.revealEffects.push(
      this.fb.group({
        type: '',
        amount: undefined,
        faction: undefined,
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

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public getFactionTypePath(factionType: FactionType) {
    return getFactionTypePath(factionType);
  }
}
