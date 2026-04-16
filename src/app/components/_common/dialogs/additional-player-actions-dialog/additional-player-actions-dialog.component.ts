import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { compact } from 'lodash';
import { isFactionType } from 'src/app/helpers/faction-types';

import { ActionField, EffectRewardType } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { AIManager } from 'src/app/services/ai/ai.manager';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { EffectsService } from 'src/app/services/game-effects.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { FieldBlockModifier, GameModifiersService } from 'src/app/services/game-modifier.service';
import { PlayerScore, PlayerScoreManager, PlayerScoreType } from 'src/app/services/player-score-manager.service';
import { PlayersService } from 'src/app/services/players.service';
import { RoundService } from 'src/app/services/round.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';
import { TurnInfoService } from 'src/app/services/turn-info.service';

@Component({
  selector: 'dune-additional-player-actions-dialog',
  templateUrl: './additional-player-actions-dialog.component.html',
  styleUrl: './additional-player-actions-dialog.component.scss',
  standalone: false,
})
export class AdditionalPlayerActionsDialogComponent implements OnInit {
  activePlayer: Player | undefined;
  activePlayerId: number = 0;

  boardFields: ActionField[] = [];
  blockedFieldIds: FieldBlockModifier[] = [];

  activePlayerScore: PlayerScore | undefined;
  playerCanRetreatUnits: boolean | undefined;

  constructor(
    public t: TranslateService,
    private dialogRef: MatDialogRef<AdditionalPlayerActionsDialogComponent>,
    private audioManager: AudioManager,
    private gameManager: GameManager,
    private playersService: PlayersService,
    private settingsService: SettingsService,
    private gameModifiersService: GameModifiersService,
    private playerScoreManager: PlayerScoreManager,
    private turnInfoService: TurnInfoService,
    private roundService: RoundService,
    private effectsService: EffectsService,
    private aiManager: AIManager,
  ) {}

  ngOnInit(): void {
    this.gameManager.activePlayer$.subscribe((activePlayer) => {
      this.activePlayer = activePlayer;
      this.activePlayerId = activePlayer?.id ?? 0;

      this.activePlayerScore = this.playerScoreManager.playerScores.find((x) => x.playerId === this.activePlayerId);
      this.playerCanRetreatUnits = this.turnInfoService.getPlayerTurnInfo(this.activePlayerId, 'canRetreatUnits');
    });

    this.gameModifiersService.playerGameModifiers$.subscribe((modifiers) => {
      this.blockedFieldIds = compact(modifiers.flatMap((x) => x.fieldBlock));
    });

    this.playerScoreManager.playerScores$.subscribe((playerScores) => {
      this.activePlayerScore = playerScores.find((x) => x.playerId === this.activePlayerId);
    });

    this.turnInfoService.turnInfos$.subscribe(() => {
      this.playerCanRetreatUnits = this.turnInfoService.getPlayerTurnInfo(this.activePlayerId, 'canRetreatUnits');
    });

    this.boardFields = this.settingsService.boardFields;
  }

  onClose() {
    this.dialogRef.close();
  }

  onAddPermanentPersuasionClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.playersService.addPermanentPersuasionToPlayer(playerId, 1);

    const player = this.playersService.getPlayer(playerId);
    if (player) {
      this.aiManager.setPreferredFieldsForAIPlayer(player);
    }
  }

  onRemovePermanentPersuasionClicked(playerId: number) {
    this.audioManager.playSound('click-reverse');
    this.playersService.removePermanentPersuasionFromPlayer(playerId, 1);

    const player = this.playersService.getPlayer(playerId);
    if (player) {
      this.aiManager.setPreferredFieldsForAIPlayer(player);
    }
    return false;
  }

  onToggleFieldBlockClicked(actionField: ActionField) {
    const fieldIsBlocked = this.fieldIsBlocked(actionField);
    if (!fieldIsBlocked) {
      const players = this.playersService.getPlayers();
      for (const player of players) {
        this.gameModifiersService.addPlayerGameModifiers(player.id, {
          fieldBlock: [
            { id: 'manual-block-' + actionField.title.en, fieldId: actionField.title.en, currentRoundOnly: true },
          ],
        });
      }
    } else {
      const players = this.playersService.getPlayers();
      for (const player of players) {
        const modifierId = this.blockedFieldIds.find(
          (x) => x.fieldId === actionField.title.en || x.actionType === actionField.actionType,
        )?.id;
        if (modifierId) {
          this.gameModifiersService.removePlayerGameModifier(player.id, 'fieldBlock', modifierId);
        }
      }
    }
  }

  onAddRewardClicked(player: Player, type: EffectRewardType) {
    if (type === 'solari') {
      this.audioManager.playSound('solari');
    } else if (type === 'water') {
      this.audioManager.playSound('water');
    } else if (type === 'spice') {
      this.audioManager.playSound('spice');
    }

    this.effectsService.addRewardToPlayer(player.id, { type });

    this.aiManager.setPreferredFieldsForAIPlayer(player);

    return false;
  }

  onRemovePlayerScoreClicked(id: number, scoreType: PlayerScoreType) {
    this.audioManager.playSound('click-reverse');
    this.playerScoreManager.removePlayerScore(id, scoreType, 1, this.roundService.currentRound);

    const player = this.playersService.getPlayer(id);
    if (player) {
      this.aiManager.setPreferredFieldsForAIPlayer(player);
    }
    return false;
  }

  onSetPlayerCanRetreatUnitsClicked() {
    this.turnInfoService.setPlayerTurnInfo(this.activePlayerId, { canRetreatUnits: !this.playerCanRetreatUnits });
  }

  fieldIsBlocked(actionField: ActionField) {
    return this.blockedFieldIds.some((x) => x.fieldId === actionField.title.en || x.actionType === actionField.actionType);
  }

  getColor(actionField: ActionField) {
    const location = this.settingsService.getBoardLocation(actionField.title.en);
    if (location) {
      return location.color;
    }
    if (isFactionType(actionField.actionType)) {
      const factionColor = this.settingsService.getFactionColor(actionField.actionType);
      if (factionColor) {
        return factionColor;
      }
    }
    return '';
  }

  getPlayerScore(scoreType: PlayerScoreType) {
    return this.activePlayerScore ? this.activePlayerScore[scoreType] : 0;
  }
}
