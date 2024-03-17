import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppMode } from 'src/app/constants/board-settings';
import { AIDIfficultyTypes, AIManager } from 'src/app/services/ai/ai.manager';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'dune-dialog-settings',
  templateUrl: './dialog-settings.component.html',
  styleUrls: ['./dialog-settings.component.scss'],
})
export class DialogSettingsComponent {
  public aiDifficulty: AIDIfficultyTypes | undefined;
  public gameContentName: string = '';
  public appMode: AppMode | undefined;

  constructor(
    private dialogRef: MatDialogRef<DialogSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; content: any },
    private aiManager: AIManager,
    private settingsService: SettingsService
  ) {
    this.aiManager.aiDifficulty$.subscribe((aiDifficulty) => {
      this.aiDifficulty = aiDifficulty;
    });
    this.settingsService.settings$.subscribe((settings) => {
      this.appMode = settings.mode;
      this.gameContentName = settings.gameContent.name;
    });
  }

  get dialogTitle(): string {
    return this.data.title;
  }

  setAIDifficulty(aiDifficulty: AIDIfficultyTypes) {
    if (aiDifficulty !== this.aiDifficulty) {
      this.aiManager.setAIDifficulty(aiDifficulty);
    }
  }

  setGameContent(name: string) {
    if (name !== this.gameContentName) {
      this.settingsService.setGameContent(name);
    }
  }

  setGameMode(mode: AppMode) {
    if (mode !== this.appMode) {
      this.settingsService.setMode(mode);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
