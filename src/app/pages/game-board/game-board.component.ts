import { Component } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'dune-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent {
  constructor(public settingsService: SettingsService) {}
}
