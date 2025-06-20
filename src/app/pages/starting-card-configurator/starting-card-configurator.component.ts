import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ActionType, ActiveFactionType } from 'src/app/models';
import { ImperiumCard } from 'src/app/models/imperium-card';
import { CardConfiguratorService } from 'src/app/services/configurators/card-configurator.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogCardEditorComponent } from '../card-configurator/dialog-card-editor/dialog-card-editor.component';

@Component({
    selector: 'dune-starting-card-configurator',
    templateUrl: './starting-card-configurator.component.html',
    styleUrls: ['./starting-card-configurator.component.scss'],
    standalone: false
})
export class StartingCardConfiguratorComponent implements OnInit {
  public startingCards: ImperiumCard[] = [];
  public showControls = true;
  public imagePadding = 0;
  public factions: { [type in ActiveFactionType]: number } = {
    emperor: 0,
    guild: 0,
    bene: 0,
    fremen: 0,
  };

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
    public t: TranslateService,
    public cardConfiguratorService: CardConfiguratorService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cardConfiguratorService.startingCards$.subscribe((startingCards) => {
      this.startingCards = startingCards;

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

      for (const card of startingCards) {
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
    const jsonContent = JSON.stringify(this.startingCards, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'starting_cards.json';
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
      const startingCards = JSON.parse(content) as ImperiumCard[];
      this.cardConfiguratorService.addStartingCards(startingCards);

      input.value = '';
    };

    reader.readAsText(file);
  }

  onAddCardClicked() {
    const dialogRef = this.dialog.open(DialogCardEditorComponent, {
      width: '875px',
      data: {
        title: 'Create New Imperium Card',
        imperiumCard: this.createEmptyImperiumCard(),
      },
    });

    dialogRef.afterClosed().subscribe((result: ImperiumCard | undefined) => {
      if (result) {
        this.cardConfiguratorService.addStartingCard(result);
      }
    });
  }

  onDeleteCardClicked(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.cardConfiguratorService.deleteStartingCard(id);
      }
    });
  }

  onEditCardClicked(imperiumCard: ImperiumCard) {
    const dialogRef = this.dialog.open(DialogCardEditorComponent, {
      width: '875px',
      data: {
        title: 'Edit Imperium Card',
        imperiumCard: imperiumCard,
      },
    });

    dialogRef.afterClosed().subscribe((result: ImperiumCard | undefined) => {
      if (result) {
        this.cardConfiguratorService.editStartingCard(result);
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
