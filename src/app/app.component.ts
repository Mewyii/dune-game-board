import { Component } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private title: Title, public settingsService: SettingsService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.title.setTitle('Dune Imperium: Alliances');
  }

  switchLanguage() {
    if (this.settingsService.settings.language === 'de') {
      this.settingsService.changeLanguage('en');

      let dialogRef = this.dialog.open(NotificationComponent, {
        data: { title: 'Language changed', text: 'Please reload this page to apply changes...' },
      });
    } else {
      this.settingsService.changeLanguage('de');

      let dialogRef = this.dialog.open(NotificationComponent, {
        data: { title: 'Sprache geändert', text: 'Bitte laden Sie diese Seite neu, um die Änderungen zu übernehmen...' },
      });
    }
  }
}
