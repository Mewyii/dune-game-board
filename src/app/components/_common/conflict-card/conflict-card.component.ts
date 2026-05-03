import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Conflict } from 'src/app/models/conflict';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-conflict-card',
  templateUrl: './conflict-card.component.html',
  styleUrl: './conflict-card.component.scss',
  standalone: false,
})
export class ConflictCardComponent implements OnInit, OnChanges {
  @Input() conflict!: Conflict;

  public boardSpaceName = '';

  constructor(
    public t: TranslateService,
    private settingsService: SettingsService,
  ) {}

  ngOnInit(): void {
    this.boardSpaceName = this.getBoardSpaceName();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.boardSpaceName = this.getBoardSpaceName();
  }

  private getBoardSpaceName() {
    if (this.conflict.boardSpaceId) {
      const boardSpace = this.settingsService.getBoardField(this.conflict.boardSpaceId);
      if (boardSpace) {
        return this.t.translateLS(boardSpace.title);
      }
    }
    return '';
  }
}
