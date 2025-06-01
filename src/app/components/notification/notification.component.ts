import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dune-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
    standalone: false
})
export class NotificationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; text: string }) {}
}
