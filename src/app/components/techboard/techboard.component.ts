import { Component, OnInit } from '@angular/core';
import { ActionField } from 'src/app/models';
import { PlayerManager } from 'src/app/services/player-manager.service';
import { PlayerScoreManager } from 'src/app/services/player-score-manager.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-techboard',
  templateUrl: './techboard.component.html',
  styleUrls: ['./techboard.component.scss'],
})
export class TechboardComponent implements OnInit {
  public techActionField: ActionField = {
    title: { de: 'aufrüstung', en: 'upgrade' },
    actionType: 'landsraad',
    costs: [{ type: 'currency', amount: 4 }],
    rewards: [
      { type: 'ship' },
      { type: 'separator', width: 10, iconHeight: 50 },
      { type: 'tech-reduced-three' },
      { type: 'battle-insert' },
    ],
    pathToImage: 'assets/images/action-backgrounds/industry_2.png',
    isBattlefield: false,
    hasRewardOptions: true,
    customWidth: 'fit-content',
  };

  public playerTechAgents: { playerId: number; techAgents: number }[] = [];

  constructor(
    public playerManager: PlayerManager,
    public playerScoreManager: PlayerScoreManager,
    public settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.techActionField = this.settingsService.ix;

    this.playerManager.players$.subscribe((players) => {
      this.playerTechAgents = players.map((x) => ({ playerId: x.id, techAgents: x.techAgents }));
    });
  }

  public getPlayerColor(playerId: number) {
    return this.playerManager.getPlayerColor(playerId);
  }

  public getArrayFromNumber(length: number) {
    return new Array(length);
  }
}
