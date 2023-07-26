import { Component, OnInit } from '@angular/core';
import { RewardType } from 'src/app/models';
import { boardSettings } from 'src/app/constants/board-settings';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { CombatManager, CombatScore, PlayerCombatUnits } from 'src/app/services/combat-manager.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { Player, PlayerManager } from 'src/app/services/player-manager.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-dune-combat',
  templateUrl: './dune-combat.component.html',
  styleUrls: ['./dune-combat.component.scss'],
})
export class DuneCombatComponent implements OnInit {
  public maxCombatScore = 22;

  public players: Player[] = [];

  public combatScoreArray: number[] = [];

  public boardSettings = boardSettings;

  public combatScores: CombatScore[] = [];

  public playerCombatUnits: PlayerCombatUnits[] = [];

  constructor(
    public gameManager: GameManager,
    public combatManager: CombatManager,
    public playerManager: PlayerManager,
    public settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.combatScoreArray = new Array(this.maxCombatScore);

    this.combatManager.playerCombatScores$.subscribe((combatScores) => {
      this.combatScores = combatScores;
    });

    this.combatManager.playerCombatUnits$.subscribe((playerCombatUnits) => {
      this.playerCombatUnits = playerCombatUnits;
    });

    this.playerManager.players$.subscribe((players) => {
      this.players = players;
    });
  }

  public onAddTroopToGarrisonClicked(playerId: number) {
    this.combatManager.addPlayerTroopsToGarrison(playerId, 1);
  }

  public onRemoveTroopFromGarrisonClicked(playerId: number) {
    this.combatManager.removePlayerTroopsFromGarrison(playerId, 1);
  }

  public onAddTroopToCombatClicked(playerId: number) {
    this.combatManager.addPlayerTroopsToCombat(playerId, 1);
  }

  public onRemoveTroopFromCombatClicked(playerId: number) {
    this.combatManager.removePlayerTroopsFromCombat(playerId, 1);
  }

  public onAddShipToGarrisonClicked(playerId: number) {
    this.combatManager.addPlayerShipsToGarrison(playerId, 1);
  }

  public onRemoveShipFromGarrisonClicked(playerId: number) {
    this.combatManager.removePlayerShipsFromGarrison(playerId, 1);
  }

  public onAddShipToCombatClicked(playerId: number) {
    this.combatManager.addPlayerShipsToCombat(playerId, 1);
  }

  public onRemoveShipFromCombatClicked(playerId: number) {
    this.combatManager.removePlayerShipsFromCombat(playerId, 1);
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  public onCombatScoreMarkerDrop(event: CdkDragDrop<number[]>, score: number) {
    this.gameManager.setPlayerCombatScore(event.item.data, score);
  }

  public setCombatScore(score: number) {
    this.gameManager.setActivePlayerCombatScore(score);
  }

  public getPlayersOnScore(score: number) {
    return this.combatScores.filter((x) => x.score === score);
  }

  public getPlayerColor(playerId: number) {
    return this.playerManager.getPlayerColor(playerId);
  }

  public getArrayFromNumber(length: number) {
    return new Array(length);
  }
}
