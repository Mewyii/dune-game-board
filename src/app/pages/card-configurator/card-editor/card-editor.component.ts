import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  EffectType,
  FactionType,
  nonFactionActionTypes,
  passiveFactionTypes,
  resourceTypes,
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
  rewardTypes = [...resourceTypes, ...combatUnitTypes, ...effectRewards].sort((a, b) => a.localeCompare(b)); // Add other reward types
  effectTypes = [...effectSeparators, ...effectConditions, ...effectChoices, ...effectConversions, ...this.rewardTypes].sort(
    (a, b) => a.localeCompare(b)
  );
  fontSizes = ['large', 'medium', 'small'];

  constructor(private fb: FormBuilder, public t: TranslateService) {
    this.initForm();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imperiumCard'] && changes['imperiumCard'].currentValue) {
      const newImperiumCard = changes['imperiumCard'].currentValue as ImperiumCard;

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
        en: new FormControl('', Validators.required),
        de: '',
      }),
      faction: '',
      persuasionCosts: null,
      fieldAccess: new FormControl([]),
      imageUrl: '',
      cardAmount: 1,
      canInfiltrate: false,
      agentEffectSize: 'large',
      customAgentEffect: this.fb.group({
        en: '',
        de: '',
        fontSize: 'medium',
      }),
      revealEffectSize: 'large',
      customRevealEffect: this.fb.group({
        en: '',
        de: '',
        fontSize: 'medium',
      }),
    });

    this.addBuyEffectControl();
    this.addAgentEffectControl();
    this.addRevealEffectControl();

    if (this.imperiumCard) {
      this.imperiumCardForm.patchValue(this.imperiumCard);
    }
  }

  getFormData(): FormGroup {
    return this.imperiumCardForm;
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

  // Reveal Effects
  get revealEffects() {
    return this.imperiumCardForm.get('revealEffects') as FormArray;
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

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public getFactionTypePath(factionType: FactionType) {
    return getFactionTypePath(factionType);
  }
}
