import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { boardSettings } from 'src/app/constants/board-settings';

import { playerCanEnterCombat } from 'src/app/helpers/turn-infos';
import { Player } from 'src/app/models/player';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { CombatManager, PlayerCombatUnits } from 'src/app/services/combat-manager.service';
import { EffectsService } from 'src/app/services/game-effects.service';
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
export class DuneCombatComponent implements OnInit, OnDestroy {
  @Input() useDreadnoughts = false;

  subscriptions: Subscription[] = [];

  maxCombatScore = 28;

  players: Player[] = [];

  combatScoreArray: number[] = [];

  boardSettings = boardSettings;

  combatScores: CombatScore[] = [];

  playerCombatUnits: PlayerCombatUnits[] = [];

  activeGarrisonPlayerId = 0;

  dreadnoughtCombatStrength = 4;

  troopCombatStrength = 2;

  leaderHitPointCombatStrength: number | undefined;

  playerGarrisonLocations: { [key: number]: { x: string; y: string } } = {
    0: { x: '60px', y: '-50px' },
    1: { x: '990px', y: '-55px' },
    2: { x: '-70px', y: '55px' },
    3: { x: '900px', y: '60px' },
    4: { x: '-10px', y: '170px' },
    5: { x: '970px', y: '190px' },
  };

  playerCombatLocations: { [key: number]: { x: string; y: string } } = {
    0: { x: '330px', y: '270px' },
    1: { x: '650px', y: '270px' },
    2: { x: '315px', y: '160px' },
    3: { x: '635px', y: '160px' },
    4: { x: '300px', y: '50px' },
    5: { x: '620px', y: '50px' },
  };

  playerColors: { [key: number]: string } = {};

  constructor(
    public settingsService: SettingsService,
    private combatManager: CombatManager,
    private playersService: PlayersService,
    private audioManager: AudioManager,
    private turnInfoService: TurnInfoService,
    private effectsService: EffectsService,
    private gameManager: GameManager,
  ) {}

  ngOnInit(): void {
    this.combatScoreArray = new Array(this.maxCombatScore);

    const playerCombatUnitsSub = this.combatManager.playerCombatUnits$.subscribe((playerCombatUnits) => {
      this.playerCombatUnits = playerCombatUnits.sort((a, b) => a.playerId - b.playerId);
      this.combatScores = this.combatManager.getPlayerCombatScores();
    });

    const playersSub = this.playersService.players$.subscribe((players) => {
      this.players = players;
    });

    const playerColorsSub = this.playersService.playerColors$.subscribe((playerColors) => {
      this.playerColors = playerColors;
    });

    const turnInfosSub = this.turnInfoService.turnInfos$.subscribe((turnInfos) => {
      this.activeGarrisonPlayerId = turnInfos.find((x) => playerCanEnterCombat(x))?.playerId ?? 0;
    });

    const gameContentSub = this.settingsService.gameContent$.subscribe((x) => {
      this.dreadnoughtCombatStrength = x.dreadnoughtCombatStrength;
      this.troopCombatStrength = x.troopCombatStrength;
      this.leaderHitPointCombatStrength = x.leaderCombatStrength;
    });

    this.subscriptions.push(playerCombatUnitsSub, playersSub, playerColorsSub, turnInfosSub, gameContentSub);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  onAddTroopToCombatClicked(playerId: number) {
    this.audioManager.playSound('click');
    this.gameManager.addUnitsIntoCombat(playerId, 'troop', 1);
  }

  onRemoveTroopFromCombatClicked(playerId: number) {
    this.audioManager.playSound('click');
    this.effectsService.retreatUnitsIfPossible(playerId, 'troop', 1);
    return false;
  }

  onAddShipToCombatClicked(playerId: number) {
    this.audioManager.playSound('click');
    this.gameManager.addUnitsIntoCombat(playerId, 'dreadnought', 1);
  }

  onRemoveShipFromCombatClicked(playerId: number) {
    this.audioManager.playSound('click');
    this.effectsService.retreatUnitsIfPossible(playerId, 'dreadnought', 1);
    return false;
  }

  getPlayersOnScore(score: number) {
    return this.combatScores.filter((x) => x.score === score);
  }

  trackCombatUnits(combatUnits: PlayerCombatUnits) {
    return combatUnits.playerId;
  }

  trackPlayerScore(playerScore: CombatScore) {
    return playerScore.playerId * 100 + playerScore.score;
  }
}
