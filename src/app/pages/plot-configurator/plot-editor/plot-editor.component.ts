import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import {
  activeFactionTypes,
  combatUnitTypes,
  EffectType,
  nonFactionActionTypes,
  passiveFactionTypes,
  resourceTypes,
  EffectRewardType,
  effectRewards,
} from 'src/app/models';
import { ImperiumPlot } from 'src/app/models/imperium-plot';

@Component({
  selector: 'dune-plot-editor',
  templateUrl: './plot-editor.component.html',
  styleUrls: ['./plot-editor.component.scss'],
})
export class PlotEditorComponent implements OnInit, OnChanges {
  @Input() imperiumPlot: ImperiumPlot | null = null;

  imperiumPlotForm!: FormGroup;

  editMode = false;

  factions = [...activeFactionTypes, ''].sort((a, b) => a.localeCompare(b));
  fontSizes = ['medium', 'small'];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imperiumPlot'] && changes['imperiumPlot'].currentValue) {
      const newImperiumPlot = changes['imperiumPlot'].currentValue as ImperiumPlot;

      this.imperiumPlotForm.patchValue(newImperiumPlot);

      if (newImperiumPlot.name.en !== '') {
        this.editMode = true;
      }
    }
  }

  initForm() {
    this.imperiumPlotForm = this.fb.group({
      name: this.fb.group({
        en: '',
        de: '',
      }),
      faction: '',
      persuasionCosts: null,
      imageUrl: '',
      cardAmount: 2,
    });

    this.addCustomRevealEffectControl();

    if (this.imperiumPlot) {
      this.imperiumPlotForm.patchValue(this.imperiumPlot);
    }
  }

  getFormData(): any {
    return this.imperiumPlotForm.value;
  }

  // Reveal Effects
  get plotDescription() {
    return this.imperiumPlotForm.get('plotDescription') as FormGroup;
  }

  addCustomRevealEffectControl() {
    this.imperiumPlotForm.addControl(
      'plotDescription',
      this.fb.group({
        en: '',
        de: '',
        fontSize: 'small',
      })
    );
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }
}
