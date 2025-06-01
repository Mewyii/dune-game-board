import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LanguageType } from 'src/app/models';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'dune-translation',
  templateUrl: './translation.component.html',
  styleUrl: './translation.component.scss',
  standalone: false,
})
export class TranslationComponent {
  showLanguageSelection = false;

  constructor(public settingsService: SettingsService, private dialog: MatDialog, public t: TranslateService) {}

  onSelectLanguageClicked(language: LanguageType) {
    if (this.settingsService.language !== language) {
      this.settingsService.changeLanguage(language);

      if (language === 'de') {
        let dialogRef = this.dialog.open(NotificationComponent, {
          data: { title: 'Sprache geändert', text: 'Bitte laden Sie diese Seite neu, um die Änderungen zu übernehmen...' },
        });
      } else if (language === 'en') {
        let dialogRef = this.dialog.open(NotificationComponent, {
          data: { title: 'Language changed', text: 'Please reload this page to apply changes...' },
        });
      }
    }
  }
}
