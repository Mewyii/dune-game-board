import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-card-areas',
  templateUrl: './card-areas.component.html',
  styleUrls: ['./card-areas.component.scss'],
})
export class CardAreasComponent implements OnInit {
  constructor(public settingsService: SettingsService) {}

  ngOnInit(): void {}
}
