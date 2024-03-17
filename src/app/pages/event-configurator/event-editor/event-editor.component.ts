import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DuneEvent } from 'src/app/constants/events';

@Component({
  selector: 'dune-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss'],
})
export class EventEditorComponent implements OnChanges {
  @Input() event: DuneEvent | null = null;

  eventForm!: FormGroup;

  editMode = false;

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['event'] && changes['event'].currentValue) {
      const event = changes['event'].currentValue as DuneEvent;

      this.eventForm.patchValue(event);

      if (event.title.en !== '') {
        this.editMode = true;
      }
    }
  }

  initForm() {
    this.eventForm = this.fb.group({
      title: this.fb.group({
        en: '',
        de: '',
      }),
      description: this.fb.group({
        en: '',
        de: '',
      }),
      imagePath: '',
      cardAmount: 1,
    });

    if (this.event) {
      this.eventForm.patchValue(this.event);
    }
  }

  getFormData(): any {
    return this.eventForm.value;
  }
}
