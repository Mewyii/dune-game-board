import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { compact } from 'lodash';
import { isFactionType } from 'src/app/helpers/faction-types';
import { getEffectTypePath } from 'src/app/helpers/reward-types';
import { ActionField, EffectType } from 'src/app/models';
import { Player } from 'src/app/models/player';
import { AudioManager } from 'src/app/services/audio-manager.service';
import { GameManager } from 'src/app/services/game-manager.service';
import { FieldBlockModifier, GameModifiersService } from 'src/app/services/game-modifier.service';
import { PlayersService } from 'src/app/services/players.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TranslateService } from 'src/app/services/translate-service';

@Component({
  selector: 'dune-additional-player-actions-dialog',
  templateUrl: './additional-player-actions-dialog.component.html',
  styleUrl: './additional-player-actions-dialog.component.scss',
})
export class AdditionalPlayerActionsDialogComponent implements OnInit {
  public activePlayer: Player | undefined;
  public activePlayerId: number = 0;

  public boardFields: ActionField[] = [];
  public blockedFieldIds: FieldBlockModifier[] = [];

  constructor(
    public t: TranslateService,
    private dialogRef: MatDialogRef<AdditionalPlayerActionsDialogComponent>,
    private audioManager: AudioManager,
    private gameManager: GameManager,
    private playersService: PlayersService,
    private settingsService: SettingsService,
    private gameModifiersService: GameModifiersService
  ) {}

  ngOnInit(): void {
    this.gameManager.activePlayer$.subscribe((activePlayer) => {
      this.activePlayer = activePlayer;
      this.activePlayerId = activePlayer?.id ?? 0;
    });

    this.gameModifiersService.playerGameModifiers$.subscribe((modifiers) => {
      this.blockedFieldIds = compact(modifiers.flatMap((x) => x.fieldBlock));
    });

    this.boardFields = this.settingsService.boardFields;
  }

  onClose() {
    this.dialogRef.close();
  }

  public onAddPermanentPersuasionClicked(playerId: number) {
    this.audioManager.playSound('click-soft');
    this.playersService.addPermanentPersuasionToPlayer(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
  }

  public onRemovePermanentPersuasionClicked(playerId: number) {
    this.audioManager.playSound('click-reverse');
    this.playersService.removePermanentPersuasionFromPlayer(playerId, 1);

    this.gameManager.setPreferredFieldsForAIPlayer(playerId);
    return false;
  }

  public onToggleFieldBlockClicked(actionField: ActionField) {
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
          (x) => x.fieldId === actionField.title.en || x.actionType === actionField.actionType
        )?.id;
        if (modifierId) {
          this.gameModifiersService.removePlayerGameModifier(player.id, 'fieldBlock', modifierId);
        }
      }
    }
  }

  public fieldIsBlocked(actionField: ActionField) {
    return this.blockedFieldIds.some((x) => x.fieldId === actionField.title.en || x.actionType === actionField.actionType);
  }

  public getEffectTypePath(effectType: EffectType) {
    return getEffectTypePath(effectType);
  }

  public getColor(actionField: ActionField) {
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
}
