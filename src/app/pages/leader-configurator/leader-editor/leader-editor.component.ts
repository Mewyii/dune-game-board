import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Leader } from 'src/app/constants/leaders';

@Component({
  selector: 'dune-leader-editor',
  templateUrl: './leader-editor.component.html',
  styleUrls: ['./leader-editor.component.scss'],
})
export class LeaderEditorComponent implements OnChanges {
  @Input() leader: Leader | null = null;

  leaderForm!: FormGroup;

  editMode = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leader'] && changes['leader'].currentValue) {
      const leader = changes['leader'].currentValue as Leader;

      this.leaderForm.patchValue(leader);

      if (leader.name.en !== '') {
        this.editMode = true;
      }
    }
  }

  initForm() {
    this.leaderForm = this.fb.group({
      name: this.fb.group({
        en: '',
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

    if (this.leader) {
      this.leaderForm.patchValue(this.leader);
    }
  }

  getFormData(): any {
    return this.leaderForm.value;
  }
}
