import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { IntrigueCard } from 'src/app/models/intrigue';
import { IntrigueConfiguratorService } from 'src/app/services/configurators/intrigue-configurator.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogIntrigueEditorComponent } from './dialog-intrigue-editor/dialog-intrigue-editor.component';

@Component({
  selector: 'dune-intrigue-configurator',
  templateUrl: './intrigue-configurator.component.html',
  styleUrl: './intrigue-configurator.component.scss',
  standalone: false,
})
export class IntrigueConfiguratorComponent implements OnInit {
  public intrigues: IntrigueCard[] = [];
  public showControls = true;
  public imagePadding = 0;

  public totalIntrigueAmount = 0;

  constructor(
    public t: TranslateService,
    public intrigueConfigService: IntrigueConfiguratorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.intrigueConfigService.intrigues$.subscribe((intrigues) => {
      this.totalIntrigueAmount = 0;

      this.intrigues = intrigues;

      for (const intrigue of intrigues) {
        this.totalIntrigueAmount += intrigue.amount ?? 1;
      }
    });
  }

  onExportCardsClicked() {
    const jsonContent = JSON.stringify(this.intrigues, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'intrigues.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onImportCardsClicked(input: HTMLInputElement) {
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
      const intrigues = JSON.parse(content) as IntrigueCard[];
      this.intrigueConfigService.setIntrigues(intrigues);

      input.value = '';
    };

    reader.readAsText(file);
  }

  onAddCardClicked() {
    const dialogRef = this.dialog.open(DialogIntrigueEditorComponent, {
      width: '875px',
      data: {
        title: 'Create New Tech Tile',
        intrigue: this.createEmptyIntrigueCard(),
      },
    });

    dialogRef.afterClosed().subscribe((result: IntrigueCard | undefined) => {
      if (result) {
        this.intrigueConfigService.addIntrigue(result);
      }
    });
  }

  onDeleteCardClicked(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.intrigueConfigService.deleteIntrigue(id);
      }
    });
  }

  onEditCardClicked(intrigue: IntrigueCard) {
    const dialogRef = this.dialog.open(DialogIntrigueEditorComponent, {
      width: '875px',
      data: {
        title: 'Edit Tech Tile',
        intrigue: intrigue,
      },
    });

    dialogRef.afterClosed().subscribe((result: IntrigueCard | undefined) => {
      if (result) {
        this.intrigueConfigService.editIntrigue(result);
      }
    });
  }

  onSaveCardClicked(el: HTMLDivElement, name: string) {
    if (el) {
      htmlToImage
        .toPng(el)
        .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = name + '.png';
          link.href = dataUrl;
          link.click();
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }

  onToggleControlsClicked() {
    this.showControls = !this.showControls;
  }

  onSortByNameClicked() {
    this.intrigueConfigService.sortIntrigues('name', 'asc');
  }

  onSortByTypeClicked() {
    this.intrigueConfigService.sortIntrigues('type', 'asc');
  }

  private createEmptyIntrigueCard(): IntrigueCard {
    // Create an empty ImperiumCard object with default values
    return {
      name: { en: '', de: '' },
      type: 'complot',
      amount: 1,
      plotEffects: [],
      combatEffects: [],
    };
  }
}
