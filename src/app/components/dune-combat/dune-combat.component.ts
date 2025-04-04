import { Component, Input, OnInit } from '@angular/core';
import { EffectType } from 'src/app/models';
import { boardSettings } from 'src/app/constants/board-settings';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { CombatManager, PlayerCombatUnits } from 'src/app/services/combat-manager.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SettingsService } from 'src/app/services/settings.service';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { Player } from 'src/app/models/player';
import { TurnInfoService } from 'src/app/services/turn-info.service';

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
    public playerManager: PlayersService,
    public settingsService: SettingsService,
    private audioManager: AudioManager,
    private turnInfoService: TurnInfoService
  ) {}

  ngOnInit(): void {
    this.combatScoreArray = new Array(this.maxCombatScore);

    this.combatManager.playerCombatUnits$.subscribe((playerCombatUnits) => {
      this.playerCombatUnits = playerCombatUnits.sort((a, b) => a.playerId - b.playerId);
      this.combatScores = this.combatManager.getPlayerCombatScores();
    });

    this.playerManager.players$.subscribe((players) => {
      this.players = players;
    });

    this.turnInfoService.turnInfos$.subscribe((turnInfos) => {
      this.activeGarrisonPlayerId = turnInfos.find((x) => x.canEnterCombat)?.playerId ?? 0;
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

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public onCombatScoreMarkerDrop(event: CdkDragDrop<number[]>, score: number) {
    const playerCombatScore = this.combatManager.getPlayerCombatScore(event.item.data);
    if (playerCombatScore < score) {
      this.combatManager.addAdditionalCombatPowerToPlayer(event.item.data, score - playerCombatScore);
    } else if (playerCombatScore > score) {
      this.combatManager.removeAdditionalCombatPowerFromPlayer(event.item.data, playerCombatScore - score);
    }
  }

  public getPlayersOnScore(score: number) {
    return this.combatScores.filter((x) => x.score === score);
  }

  public getPlayerColor(playerId: number) {
    return this.playerManager.getPlayerColor(playerId);
  }

  public trackCombatUnits(combatUnits: PlayerCombatUnits) {
    return combatUnits.playerId;
  }

  public trackPlayerScore(playerScore: CombatScore) {
    return playerScore.playerId * 100 + playerScore.score;
  }
}
