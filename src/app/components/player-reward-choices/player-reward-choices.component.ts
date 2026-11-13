import { Component, OnInit } from '@angular/core';

import { isStructuredConversionEffect } from 'src/app/helpers/rewards';
import { StructuredConversionEffect, StructuredRewardEffect } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { StructuredChoiceEffectWithGameElement, StructuredConversionEffectWithGameElement } from 'src/app/models/turn-info';
import { EffectsService } from 'src/app/services/game-effects.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { PlayerActionLog } from 'src/app/services/log.service';
import {
  PlayerRewardChoice,
  PlayerRewardChoices,
  PlayerRewardChoicesService,
} from 'src/app/services/player-reward-choices.service';
import { TurnInfoService } from 'src/app/services/player-turn-info.service';
import { TranslateService } from 'src/app/services/translate-service';

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
      this.playerRewardChoices = this.playerRewardChoicesService.playersRewardChoices.find(
        (x) => x.playerId === this.activePlayerId,
      );
    });

    this.playerRewardChoicesService.playersRewardChoices$.subscribe((playerRewardChoices) => {
      this.playerRewardChoices = playerRewardChoices.find((x) => x.playerId === this.activePlayerId);
    });

    this.turnInfoService.turnInfos$.subscribe((turnInfos) => {
      const playerTurnInfos = this.turnInfoService.getPlayerTurnInfos(this.activePlayerId);
      if (playerTurnInfos) {
        this.deployableUnits = playerTurnInfos.deployableUnits - playerTurnInfos.deployedUnits;
        this.deployableTroops = playerTurnInfos.deployableTroops - playerTurnInfos.deployedTroops;
        this.deployableDreadnoughts = playerTurnInfos.deployableDreadnoughts - playerTurnInfos.deployedDreadnoughts;
      } else {
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

  onOptionEffectRightClicked(effect: PlayerRewardChoice<StructuredChoiceEffectWithGameElement>) {
    const optionSuccessFull = this.gameManager.resolveEffectChoice(this.activePlayerId, effect.choice, 'right');
    if (optionSuccessFull) {
      this.playerRewardChoicesService.removePlayerEitherOrChoice(
        this.activePlayerId,
        effect.id,
        effect.choice.exlusiveChoiceOfMultipleEffectsId,
      );
    }
  }

  onOptionEffectLeftClicked(effect: PlayerRewardChoice<StructuredChoiceEffectWithGameElement>) {
    const optionSuccessFull = this.gameManager.resolveEffectChoice(this.activePlayerId, effect.choice, 'left');
    if (optionSuccessFull) {
      this.playerRewardChoicesService.removePlayerEitherOrChoice(
        this.activePlayerId,
        effect.id,
        effect.choice.exlusiveChoiceOfMultipleEffectsId,
      );
    }
  }

  onConvertEffectClicked(effect: PlayerRewardChoice<StructuredConversionEffectWithGameElement>) {
    const conversionSuccessFull = this.gameManager.resolveEffectConversionIfPossible(this.activePlayerId, effect.choice);
    if (conversionSuccessFull) {
      this.playerRewardChoicesService.removePlayerConversionChoice(
        this.activePlayerId,
        effect.id,
        effect.choice.exlusiveChoiceOfMultipleEffectsId,
      );
    }
  }

  onDenyConversionClicked(id: string) {
    this.playerRewardChoicesService.removePlayerConversionChoice(this.activePlayerId, id);
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
