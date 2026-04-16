import { Component, Input, OnInit } from '@angular/core';
import { Conflict } from 'src/app/models/conflict';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-conflict-card',
  templateUrl: './conflict-card.component.html',
  styleUrl: './conflict-card.component.scss',
  standalone: false,
})
export class ConflictCardComponent implements OnInit {
  @Input() conflict!: Conflict;

  public boardSpaceName = '';

  constructor(
    public t: TranslateService,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    if (this.conflict.boardSpaceId) {
      const boardSpace = this.settingsService.getBoardField(this.conflict.boardSpaceId);
      if (boardSpace) {
        this.boardSpaceName = this.t.translateLS(boardSpace.title);
      }
    }
  }
}
