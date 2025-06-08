import { Component, Inject } from '@angular/core';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppMode, GameContent } from 'src/app/constants/board-settings';
import { AIDIfficultyTypes, AIManager } from 'src/app/services/ai/ai.manager';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'dune-dialog-settings',
  templateUrl: './dialog-settings.component.html',
  styleUrls: ['./dialog-settings.component.scss'],
  standalone: false,
  providers: [{ provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions }],
})
export class DialogSettingsComponent {
  public aiDifficulty: AIDIfficultyTypes | undefined;
  public eventsEnabled: boolean = false;
  public gameContentName: string = '';
  public appMode: AppMode | undefined;
  public hasCustomGameContent = false;

  constructor(
    private dialogRef: MatDialogRef<DialogSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; content: any },
    private aiManager: AIManager,
    private settingsService: SettingsService
  ) {
    this.aiManager.aiDifficulty$.subscribe((aiDifficulty) => {
      this.aiDifficulty = aiDifficulty;
    });
    this.settingsService.gameContent$.subscribe((gameContent) => {
      this.gameContentName = gameContent.name;
    });
    this.settingsService.mode$.subscribe((mode) => {
      this.appMode = mode;
    });
    this.settingsService.eventsEnabled$.subscribe((eventsEnabled) => {
      this.eventsEnabled = eventsEnabled;
    });
    this.settingsService.gameContents$.subscribe((contents) => {
      this.hasCustomGameContent = contents.some((x) => x.name === 'custom');
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

  onSetGameContentClicked(name: string) {
    if (name !== this.gameContentName) {
      this.settingsService.setGameContent(name);
    }
  }

  enableEvents(value: boolean) {
    this.settingsService.enableEvents(value);
  }

  setGameMode(mode: AppMode) {
    if (mode !== this.appMode) {
      this.settingsService.setMode(mode);
    }
  }

  onExportContentClicked() {
    const gameContent = this.settingsService.gameContent;
    const jsonContent = JSON.stringify(gameContent, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'game_board_content.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onImportContentClicked(input: HTMLInputElement) {
    if (!input.files) {
      return;
    }

    const file = input.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const content = e.target.result;
      const gameContent = JSON.parse(content) as GameContent;
      this.settingsService.setCustomGameContent(gameContent);

      input.value = '';
    };

    reader.readAsText(file);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
