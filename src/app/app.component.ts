import { Component } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from './components/notification/notification.component';
import { DialogSettingsComponent } from './components/dialog-settings/dialog-settings.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('Dune Imperium: Alliances');
  }
}
