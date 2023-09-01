import { Component } from '@angular/core';
import { leaders } from 'src/app/constants/leaders';
import { GameManager } from 'src/app/services/game-manager.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-leaders',
  templateUrl: './leaders.component.html',
  styleUrls: ['./leaders.component.scss'],
})
export class LeadersComponent {
  public leaders = leaders;

  constructor(public translateService: TranslateService, public gameManager: GameManager) {}

  ngOnInit(): void {}
}
