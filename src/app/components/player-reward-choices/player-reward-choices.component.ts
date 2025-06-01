import { Component, OnInit } from '@angular/core';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { isStructuredConversionEffect } from 'src/app/helpers/rewards';
import { EffectReward, EffectType, StructuredConversionEffect } from 'src/app/models';
import { StructuredChoiceEffectWithGameElement, StructuredConversionEffectWithGameElement } from 'src/app/models/turn-info';
import { GameManager } from 'src/app/services/game-manager.service';
import { PlayerActionLog } from 'src/app/services/log.service';
import { PlayerRewardChoices, PlayerRewardChoicesService } from 'src/app/services/player-reward-choices.service';
import { TranslateService } from 'src/app/services/translate-service';
import { TurnInfoService } from 'src/app/services/turn-info.service';

@Component({
  selector: 'dune-player-reward-choices',
  templateUrl: './player-reward-choices.component.html',
  styleUrl: './player-reward-choices.component.scss',
})
export class PlayerRewardChoicesComponent implements OnInit {
  public activePlayerId: number = 0;
  public playerRewardChoices: PlayerRewardChoices | undefined;
  public playerActionLog: PlayerActionLog[] = [];
  public playerEffectConversions: StructuredConversionEffectWithGameElement[] = [];
  public playerEffectOptions: StructuredChoiceEffectWithGameElement[] = [];
  public deployableUnits = 0;
  public deployableTroops = 0;
  public deployableDreadnoughts = 0;

  public activeEffectId = '';

  constructor(
    private gameManager: GameManager,
    private playerRewardChoicesService: PlayerRewardChoicesService,
    private turnInfoService: TurnInfoService,
    public t: TranslateService
  ) {}

  ngOnInit(): void {
    this.gameManager.activePlayerId$.subscribe((activePlayerId) => {
      this.activeEffectId = '';

      this.activePlayerId = activePlayerId;
      this.playerRewardChoices = this.playerRewardChoicesService.playerRewardChoices.find(
        (x) => x.playerId === this.activePlayerId
      );
    });

    this.playerRewardChoicesService.playerRewardChoices$.subscribe((playerRewardChoices) => {
      this.playerRewardChoices = playerRewardChoices.find((x) => x.playerId === this.activePlayerId);
    });

    this.turnInfoService.turnInfos$.subscribe((turnInfos) => {
      const playerTurnInfos = this.turnInfoService.getPlayerTurnInfo(this.activePlayerId);
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
    this.gameManager.addUnitsToCombatIfPossible(this.activePlayerId, 'troop', amount);
  }

  onDeployDreadnoughtsClicked(amount: number) {
    this.gameManager.addUnitsToCombatIfPossible(this.activePlayerId, 'dreadnought', amount);
  }

  public isStructuredConversionEffect(effect: EffectReward[] | StructuredConversionEffect) {
    return isStructuredConversionEffect(effect);
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }
}
