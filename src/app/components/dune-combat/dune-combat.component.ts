import { Component, Input, OnInit } from '@angular/core';
import { boardSettings } from 'src/app/constants/board-settings';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { playerCanEnterCombat } from 'src/app/helpers/turn-infos';
import { EffectType } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CombatManager, PlayerCombatUnits } from 'src/app/services/combat-manager.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TurnInfoService } from 'src/app/services/turn-info.service';

export interface CombatScore {
  playerId: number;
  score: number;
}

@Component({
  selector: 'app-dune-combat',
  templateUrl: './dune-combat.component.html',
  styleUrls: ['./dune-combat.component.scss'],
  standalone: false,
})
export class DuneCombatComponent implements OnInit {
  @Input() useDreadnoughts = false;

  public maxCombatScore = 26;

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
      this.activeGarrisonPlayerId = turnInfos.find((x) => playerCanEnterCombat(x))?.playerId ?? 0;
    });
  }

  public onAddTroopToCombatClicked(playerId: number) {
    this.audioManager.playSound('click');
    this.gameManager.addUnitsToCombatIfPossible(playerId, 'troop', 1);
  }

  public onRemoveTroopFromCombatClicked(playerId: number) {
    this.audioManager.playSound('click');
    this.gameManager.retreatUnitsIfPossible(playerId, 'troop', 1);
    return false;
  }

  public onAddShipToCombatClicked(playerId: number) {
    this.audioManager.playSound('click');
    this.gameManager.addUnitsToCombatIfPossible(playerId, 'dreadnought', 1);
  }

  public onRemoveShipFromCombatClicked(playerId: number) {
    this.audioManager.playSound('click');
    this.gameManager.retreatUnitsIfPossible(playerId, 'dreadnought', 1);
    return false;
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
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
