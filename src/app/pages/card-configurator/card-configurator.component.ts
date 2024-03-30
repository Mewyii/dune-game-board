import { Component, OnInit } from '@angular/core';
import { ImperiumCard } from 'src/app/constants/imperium-cards';
import { CardConfiguratorService } from 'src/app/services/configurators/card-configurator.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogCardEditorComponent } from './dialog-card-editor/dialog-card-editor.component';
import { MatDialog } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
import { ActionType, FactionType } from 'src/app/models';

@Component({
  selector: 'dune-card-configurator',
  templateUrl: './card-configurator.component.html',
  styleUrls: ['./card-configurator.component.scss'],
})
export class CardConfiguratorComponent implements OnInit {
  public imperiumCards: ImperiumCard[] = [];
  public showControls = true;
  public imagePadding = 0;
  public fieldAccessess: { [type in ActionType]: number } = {
    landsraad: 0,
    choam: 0,
    emperor: 0,
    guild: 0,
    bene: 0,
    fremen: 0,
    town: 0,
    spice: 0,
  };

  public totalCardAmount = 0;

  constructor(
    public translateService: TranslateService,
    public cardConfiguratorService: CardConfiguratorService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cardConfiguratorService.imperiumCards$.subscribe((imperiumCards) => {
      this.imperiumCards = imperiumCards;

      this.totalCardAmount = 0;
      this.fieldAccessess = {
        landsraad: 0,
        choam: 0,
        emperor: 0,
        guild: 0,
        bene: 0,
        fremen: 0,
        town: 0,
        spice: 0,
      };

      for (const card of imperiumCards) {
        this.totalCardAmount += card.cardAmount ?? 1;

        if (card.fieldAccess) {
          for (const access of card.fieldAccess) {
            this.fieldAccessess[access] += card.cardAmount ?? 1;
          }
        }
      }
    });
  }

  onExportCardsClicked() {
    const jsonContent = JSON.stringify(this.imperiumCards, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'imperium_cards.json';
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
      const imperiumCards = JSON.parse(content) as ImperiumCard[];
      this.cardConfiguratorService.setCards(imperiumCards);

      input.value = '';
    };

    reader.readAsText(file);
  }

  onAddCardClicked() {
    const dialogRef = this.dialog.open(DialogCardEditorComponent, {
      width: '900px',
      data: {
        title: 'Create New Imperium Card',
        imperiumCard: this.createEmptyImperiumCard(),
      },
    });

    dialogRef.afterClosed().subscribe((result: ImperiumCard | undefined) => {
      if (result) {
        this.cardConfiguratorService.addCard(result);
      }
    });
  }

  onDeleteCardClicked(id: string) {
    this.cardConfiguratorService.deleteCard(id);
  }

  onEditCardClicked(imperiumCard: ImperiumCard) {
    const dialogRef = this.dialog.open(DialogCardEditorComponent, {
      width: '900px',
      data: {
        title: 'Edit Imperium Card',
        imperiumCard: imperiumCard,
      },
    });

    dialogRef.afterClosed().subscribe((result: ImperiumCard | undefined) => {
      if (result) {
        this.cardConfiguratorService.editCard(result);
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

  private createEmptyImperiumCard(): ImperiumCard {
    // Create an empty ImperiumCard object with default values
    return {
      name: { en: '', de: '' },
    };
  }
}
