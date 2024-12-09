import { Component, OnInit } from '@angular/core';
import { CardConfiguratorService } from 'src/app/services/configurators/card-configurator.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogCardEditorComponent } from './dialog-card-editor/dialog-card-editor.component';
import { MatDialog } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
import { ActionType, ActiveFactionType } from 'src/app/models';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ImperiumCard } from 'src/app/models/imperium-card';

@Component({
  selector: 'dune-card-configurator',
  templateUrl: './imperium-card-configurator.component.html',
  styleUrls: ['./imperium-card-configurator.component.scss'],
})
export class ImperiumCardConfiguratorComponent implements OnInit {
  public imperiumCards: ImperiumCard[] = [];
  public showControls = true;
  public imagePadding = 0;
  public factions: { [type in ActiveFactionType]: number } = {
    emperor: 0,
    guild: 0,
    bene: 0,
    fremen: 0,
  };
  public noFactions = 0;

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

  public costs: { [type in number]: number } = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
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
      this.factions = {
        emperor: 0,
        guild: 0,
        bene: 0,
        fremen: 0,
      };
      this.noFactions = 0;

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

      this.costs = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
      };

      for (const card of imperiumCards) {
        this.totalCardAmount += card.cardAmount ?? 1;

        if (card.faction) {
          this.factions[card.faction] += card.cardAmount ?? 1;
        } else {
          this.noFactions += card.cardAmount ?? 1;
        }

        if (card.fieldAccess) {
          for (const access of card.fieldAccess) {
            this.fieldAccessess[access] += card.cardAmount ?? 1;
          }
        }

        if (card.persuasionCosts) {
          this.costs[card.persuasionCosts] += card.cardAmount ?? 1;
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
      this.cardConfiguratorService.addImperiumCards(imperiumCards);

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
        this.cardConfiguratorService.addImperiumCard(result);
      }
    });
  }

  onRemoveCardsClicked() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Are you sure you want to remove all cards?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.cardConfiguratorService.setImperiumCards([]);
      }
    });
  }

  onDeleteCardClicked(id: string) {
    this.cardConfiguratorService.deleteImperiumCard(id);
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
        this.cardConfiguratorService.editImperiumCard(result);
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

  onSortByCostsClicked() {
    this.cardConfiguratorService.sortImperiumCards('persuasionCosts', 'asc');
  }

  onSortByFactionsClicked() {
    this.cardConfiguratorService.sortImperiumCards('faction', 'asc');
  }

  private createEmptyImperiumCard(): ImperiumCard {
    // Create an empty ImperiumCard object with default values
    return {
      name: { en: '', de: '' },
    };
  }
}
