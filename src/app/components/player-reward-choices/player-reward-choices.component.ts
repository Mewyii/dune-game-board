import { Component, OnInit } from '@angular/core';

import { isStructuredConversionEffect } from 'src/app/helpers/rewards';
import { StructuredConversionEffect, StructuredRewardEffect } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { StructuredChoiceEffectWithGameElement, StructuredConversionEffectWithGameElement } from 'src/app/models/turn-info';
import { EffectsService } from 'src/app/services/game-effects.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { PlayerActionLog } from 'src/app/services/log.service';
import { PlayerRewardChoices, PlayerRewardChoicesService } from 'src/app/services/player-reward-choices.service';
import { TranslateService } from 'src/app/services/translate-service';
import { TurnInfoService } from 'src/app/services/turn-info.service';

@Component({
  selector: 'dune-player-reward-choices',
  templateUrl: './player-reward-choices.component.html',
  styleUrl: './player-reward-choices.component.scss',
  standalone: false,
})
export class PlayerRewardChoicesComponent implements OnInit {
  activePlayerId: number = 0;
  activePlayer: Player | undefined;
  playerRewardChoices: PlayerRewardChoices | undefined;
  playerActionLog: PlayerActionLog[] = [];
  playerEffectConversions: StructuredConversionEffectWithGameElement[] = [];
  playerEffectOptions: StructuredChoiceEffectWithGameElement[] = [];
  deployableUnits = 0;
  deployableTroops = 0;
  deployableDreadnoughts = 0;

  activeEffectId = '';

  constructor(
    public t: TranslateService,
    private gameManager: GameManager,
    private playerRewardChoicesService: PlayerRewardChoicesService,
    private turnInfoService: TurnInfoService,
    private effectsService: EffectsService,
  ) {}

  ngOnInit(): void {
    this.gameManager.activePlayer$.subscribe((activePlayer) => {
      this.activeEffectId = '';

      this.activePlayerId = activePlayer?.id ?? 0;
      this.activePlayer = activePlayer;
      this.playerRewardChoices = this.playerRewardChoicesService.playerRewardChoices.find(
        (x) => x.playerId === this.activePlayerId,
      );
    });

    this.playerRewardChoicesService.playerRewardChoices$.subscribe((playerRewardChoices) => {
      this.playerRewardChoices = playerRewardChoices.find((x) => x.playerId === this.activePlayerId);
    });

    this.turnInfoService.turnInfos$.subscribe((turnInfos) => {
      const playerTurnInfos = this.turnInfoService.getPlayerTurnInfos(this.activePlayerId);
      if (playerTurnInfos) {
        this.playerEffectOptions = playerTurnInfos.effectChoices;
        this.playerEffectConversions = playerTurnInfos.effectConversions;
        this.deployableUnits = playerTurnInfos.deployableUnits - playerTurnInfos.deployedUnits;
        this.deployableTroops = playerTurnInfos.deployableTroops - playerTurnInfos.deployedTroops;
        this.deployableDreadnoughts = playerTurnInfos.deployableDreadnoughts - playerTurnInfos.deployedDreadnoughts;
      } else {
        this.playerEffectOptions = [];
        this.playerEffectConversions = [];
        this.deployableUnits = 0;
        this.deployableTroops = 0;
        this.deployableDreadnoughts = 0;
      }
    });
  }

  onRewardChoiceClicked(id: string) {
    this.playerRewardChoicesService.removePlayerRewardChoice(this.activePlayerId, id);
  }

  onRewardsChoiceClicked(id: string) {
    this.playerRewardChoicesService.removePlayerRewardsChoice(this.activePlayerId, id);
  }

  onCustomChoiceClicked(id: string) {
    this.playerRewardChoicesService.removePlayerCustomChoice(this.activePlayerId, id);
  }

  setEffectActive(id: string) {
    if (this.activeEffectId !== id) {
      this.activeEffectId = id;
    } else {
      this.activeEffectId = '';
    }
  }

  onOptionEffectRightClicked(effect: StructuredChoiceEffectWithGameElement, index: number) {
    const optionSuccessFull = this.gameManager.resolveEffectChoice(this.activePlayerId, effect, 'right');
    if (optionSuccessFull) {
      this.turnInfoService.setPlayerTurnInfo(this.activePlayerId, {
        effectChoices: this.playerEffectOptions.filter((x, idx) => idx !== index),
      });
    }
  }

  onOptionEffectLeftClicked(effect: StructuredChoiceEffectWithGameElement, index: number) {
    const optionSuccessFull = this.gameManager.resolveEffectChoice(this.activePlayerId, effect, 'left');
    if (optionSuccessFull) {
      this.turnInfoService.setPlayerTurnInfo(this.activePlayerId, {
        effectChoices: this.playerEffectOptions.filter((x, idx) => idx !== index),
      });
    }
  }

  onConvertEffectClicked(effect: StructuredConversionEffectWithGameElement, index: number) {
    const conversionSuccessFull = this.gameManager.resolveEffectConversionIfPossible(this.activePlayerId, effect);
    if (conversionSuccessFull) {
      this.turnInfoService.setPlayerTurnInfo(this.activePlayerId, {
        effectConversions: this.playerEffectConversions.filter((x, idx) => idx !== index),
      });
    }
  }

  onDenyConversionClicked(index: number) {
    this.turnInfoService.setPlayerTurnInfo(this.activePlayerId, {
      effectConversions: this.playerEffectConversions.filter((x, idx) => idx !== index),
    });
  }

  onDeployTroopsClicked(amount: number) {
    this.effectsService.addUnitsToCombatIfPossible(this.activePlayerId, 'troop', amount);
  }

  onDeployDreadnoughtsClicked(amount: number) {
    this.effectsService.addUnitsToCombatIfPossible(this.activePlayerId, 'dreadnought', amount);
  }

  public isStructuredConversionEffect(effect: StructuredConversionEffect | StructuredRewardEffect) {
    return isStructuredConversionEffect(effect);
  }
}
