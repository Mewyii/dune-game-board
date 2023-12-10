import { Component } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private title: Title, public settingsService: SettingsService) {}

  ngOnInit(): void {
    this.title.setTitle('Dune Imperium: Alliances');
  }
}
