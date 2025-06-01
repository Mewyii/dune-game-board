import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { DuneEvent } from 'src/app/constants/events';
import { DuneEventsManager } from 'src/app/services/dune-events.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogEventEditorComponent } from './dialog-event-editor/dialog-event-editor.component';

@Component({
    selector: 'dune-event-configurator',
    templateUrl: './event-configurator.component.html',
    styleUrls: ['./event-configurator.component.scss'],
    standalone: false
})
export class EventConfiguratorComponent {
  public events: DuneEvent[] = [];
  public showControls = true;
  public imagePadding = 0;

  constructor(public t: TranslateService, public eventsService: DuneEventsManager, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.eventsService.events$.subscribe((events) => {
      this.events = events;
    });
  }

  onExportCardsClicked() {
    const jsonContent = JSON.stringify(this.events, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'events.json';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onImportCardsClicked(input: HTMLInputElement) {
    if (!input.files) {
      return;
    }

    const file = input.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const content = e.target.result;
      const events = JSON.parse(content) as DuneEvent[];
      this.eventsService.setEvents(events);

      input.value = '';
    };

    reader.readAsText(file);
  }

  onAddCardClicked() {
    const dialogRef = this.dialog.open(DialogEventEditorComponent, {
      width: '875px',
      data: {
        title: 'Create New Event',
        leader: this.eventsService.getNewEvent(),
      },
    });
    dialogRef.afterClosed().subscribe((result: DuneEvent | undefined) => {
      if (result) {
        this.eventsService.addEvent(result);
      }
    });
  }

  onDeleteCardClicked(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.eventsService.deleteEvent(id);
      }
    });
  }

  onEditCardClicked(event: DuneEvent) {
    const dialogRef = this.dialog.open(DialogEventEditorComponent, {
      width: '875px',
      data: {
        title: 'Edit Event',
        event: event,
      },
    });
    dialogRef.afterClosed().subscribe((result: DuneEvent | undefined) => {
      if (result) {
        this.eventsService.editEvent(result);
      }
    });
  }

  onSaveCardClicked(el: HTMLDivElement, name: string) {
    if (el) {
      htmlToImage
        .toPng(el)
        .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = name + '.png';
          link.href = dataUrl;
          link.click();
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }

  onToggleControlsClicked() {
    this.showControls = !this.showControls;
  }
}
