import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  activeFactionTypes,
  combatUnitTypes,
  nonFactionActionTypes,
  passiveFactionTypes,
  resourceTypes,
  rewardTypes,
} from 'src/app/models';
import { TechTileCard } from 'src/app/models/tech-tile';

@Component({
  selector: 'dune-tech-tile-editor',
  templateUrl: './tech-tile-editor.component.html',
  styleUrls: ['./tech-tile-editor.component.scss'],
})
export class TechTileEditorComponent implements OnInit, OnChanges {
  @Input() techTile: TechTileCard | null = null;

  techTileForm!: FormGroup;

  editMode = false;

  factions = [...activeFactionTypes, ...passiveFactionTypes, ''].sort((a, b) => a.localeCompare(b));
  actionTypes = [...activeFactionTypes, ...passiveFactionTypes, ...nonFactionActionTypes].sort((a, b) => a.localeCompare(b));
  rewardTypes = [...resourceTypes, ...combatUnitTypes, ...rewardTypes].sort((a, b) => a.localeCompare(b)); // Add other reward types
  fontSizes = ['medium', 'small'];

  hasCustomAgentEffect = false;
  hasCustomRevealEffect = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['techTile'] && changes['techTile'].currentValue) {
      const newImperiumCard = changes['techTile'].currentValue as TechTileCard;

      if (newImperiumCard.customEffect) {
        this.hasCustomAgentEffect = true;

        this.addCustomAgentEffectControl();
        this.techTileForm.removeControl('effects');
      }

      this.techTileForm.patchValue(newImperiumCard);

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

      if (newImperiumCard.effects) {
        this.hasCustomAgentEffect = false;
        const effectsArray = this.effects;

        effectsArray.clear();
        newImperiumCard.effects.forEach((field) => {
          effectsArray.push(
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
    this.techTileForm = this.fb.group({
      name: this.fb.group({
        en: '',
        de: '',
      }),
      faction: '',
      costs: 0,
      imageUrl: '',
    });

    this.addBuyEffectControl();
    this.addAgentEffectControl();

    if (this.techTile) {
      this.techTileForm.patchValue(this.techTile);
    }
  }

  getFormData(): any {
    return this.techTileForm.value;
  }

  get fieldAccess() {
    return this.techTileForm.get('fieldAccess') as FormArray;
  }

  // Buy Effects
  get buyEffects() {
    return this.techTileForm.get('buyEffects') as FormArray;
  }

  getBuyEffectTypeControl(index: number): FormControl {
    return this.buyEffects.at(index).get('type') as FormControl;
  }

  getBuyEffectAmountControl(index: number): FormControl {
    return this.buyEffects.at(index).get('amount') as FormControl;
  }

  addBuyEffectControl() {
    this.techTileForm.addControl('buyEffects', new FormArray([]));
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
  get effects() {
    return this.techTileForm.get('effects') as FormArray;
  }

  get customEffect() {
    return this.techTileForm.get('customEffect') as FormGroup;
  }

  getAgentEffectTypeControl(index: number): FormControl {
    return this.effects.at(index).get('type') as FormControl;
  }

  getAgentEffectAmountControl(index: number): FormControl {
    return this.effects.at(index).get('amount') as FormControl;
  }

  addAgentEffectControl() {
    this.techTileForm.addControl(
      'effects',
      new FormArray([
        this.fb.group({
          type: '',
          amount: undefined,
        }),
      ])
    );
  }

  addCustomAgentEffectControl() {
    this.techTileForm.addControl(
      'customEffect',
      this.fb.group({
        en: '',
        de: '',
        fontSize: 'small',
      })
    );
  }

  onAddAgentEffectClicked() {
    this.effects.push(
      this.fb.group({
        type: '',
        amount: undefined,
      })
    );
  }

  onRemoveAgentEffectClicked(index: number) {
    this.effects.removeAt(index);
  }

  updateAgentEffects() {
    if (this.hasCustomAgentEffect) {
      this.techTileForm.removeControl('effects');

      this.addCustomAgentEffectControl();
    } else {
      this.addAgentEffectControl();

      this.techTileForm.removeControl('customEffect');
    }
  }
}
