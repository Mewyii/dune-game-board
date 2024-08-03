import { Component, Input, OnInit } from '@angular/core';
import { RewardType } from 'src/app/models';
import { boardSettings } from 'src/app/constants/board-settings';
import { getRewardTypePath } from 'src/app/helpers/reward-types';
import { CombatManager, PlayerCombatUnits } from 'src/app/services/combat-manager.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { Player, PlayerManager } from 'src/app/services/player-manager.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SettingsService } from 'src/app/services/settings.service';
import { AudioManager } from 'src/app/services/audio-manager.service';

export interface CombatScore {
  playerId: number;
  score: number;
}

@Component({
  selector: 'app-dune-combat',
  templateUrl: './dune-combat.component.html',
  styleUrls: ['./dune-combat.component.scss'],
})
export class DuneCombatComponent implements OnInit {
  @Input() useDreadnoughts = false;

  public maxCombatScore = 22;

  public players: Player[] = [];

  public combatScoreArray: number[] = [];

  public boardSettings = boardSettings;

  public combatScores: CombatScore[] = [];

  public playerCombatUnits: PlayerCombatUnits[] = [];

  public activeGarrisonPlayerId = 0;

  constructor(
    public gameManager: GameManager,
    public combatManager: CombatManager,
    public playerManager: PlayerManager,
    public settingsService: SettingsService,
    private audioManager: AudioManager
  ) {}

  ngOnInit(): void {
    this.combatScoreArray = new Array(this.maxCombatScore);

    this.combatManager.playerCombatUnits$.subscribe((playerCombatUnits) => {
      this.playerCombatUnits = playerCombatUnits.sort((a, b) => a.playerId - b.playerId);
      this.combatScores = this.playerCombatUnits.map((x) => ({
        playerId: x.playerId,
        score: this.combatManager.getPlayerCombatScore(x),
      }));
    });

    this.playerManager.players$.subscribe((players) => {
      this.players = players;
    });
  }

  public onAddTroopToCombatClicked(playerId: number) {
    this.audioManager.playSound('click');
    this.combatManager.addPlayerTroopsToCombat(playerId, 1);
  }

  public onRemoveTroopFromCombatClicked(playerId: number) {
    this.audioManager.playSound('click');
    this.combatManager.removePlayerTroopsFromCombat(playerId, 1);
    return false;
  }

  public onAddShipToCombatClicked(playerId: number) {
    this.audioManager.playSound('click');
    this.combatManager.addPlayerShipsToCombat(playerId, 1);
  }

  public onRemoveShipFromCombatClicked(playerId: number) {
    this.audioManager.playSound('click');
    this.combatManager.removePlayerShipsFromCombat(playerId, 1);
    return false;
  }

  public onAddAdditionalCombatPowerToPlayer(playerId: number) {
    this.audioManager.playSound('sword');
    this.combatManager.addAdditionalCombatPowerToPlayer(playerId, 1);
  }

  public onRemoveAdditionalCombatPowerFromPlayer(playerId: number) {
    this.audioManager.playSound('sword');
    this.combatManager.removeAdditionalCombatPowerFromPlayer(playerId, 1);
    return false;
  }

  public setActiveGarrisonPlayerId(playerId: number) {
    if (this.activeGarrisonPlayerId !== playerId) {
      this.activeGarrisonPlayerId = playerId;
    } else {
      this.activeGarrisonPlayerId = 0;
    }
  }

  public getRewardTypePath(rewardType: RewardType) {
    return getRewardTypePath(rewardType);
  }

  public onCombatScoreMarkerDrop(event: CdkDragDrop<number[]>, score: number) {
    const playerCombatUnits = this.playerCombatUnits.find((x) => x.playerId === event.item.data);
    if (playerCombatUnits) {
      const currentScore = this.combatManager.getPlayerCombatScore(playerCombatUnits);
      if (currentScore < score) {
        this.combatManager.addAdditionalCombatPowerToPlayer(event.item.data, score - currentScore);
      } else if (currentScore > score) {
        this.combatManager.removeAdditionalCombatPowerFromPlayer(event.item.data, currentScore - score);
      }
    }
  }

  public getPlayersOnScore(score: number) {
    return this.combatScores.filter((x) => x.score === score);
  }

  public getPlayerColor(playerId: number) {
    return this.playerManager.getPlayerColor(playerId);
  }

  public trackCombatUnits(index: number, combatUnits: PlayerCombatUnits) {
    return combatUnits.playerId;
  }

  public trackPlayer(index: number, player: Player) {
    return player.id;
  }

  public trackCount(index: number, player: Player) {
    return index;
  }
}
