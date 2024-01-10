import { Component, OnInit } from '@angular/core';
import { ImperiumCard } from 'src/app/constants/imperium-cards';
import { CardConfiguratorService } from 'src/app/services/configurators/card-configurator.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogCardEditorComponent } from './dialog-card-editor/dialog-card-editor.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'dune-card-configurator',
  templateUrl: './card-configurator.component.html',
  styleUrls: ['./card-configurator.component.scss'],
})
export class CardConfiguratorComponent implements OnInit {
  public imperiumCards: ImperiumCard[] = [];

  constructor(
    public translateService: TranslateService,
    public cardConfiguratorService: CardConfiguratorService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cardConfiguratorService.imperiumCards$.subscribe((imperiumCards) => {
      this.imperiumCards = imperiumCards;
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

  private createEmptyImperiumCard(): ImperiumCard {
    // Create an empty ImperiumCard object with default values
    return {
      name: { en: '', de: '' },
    };
  }
}
