import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { getFlattenedEffectRewardArray, isRewardEffect } from 'src/app/helpers/rewards';
import { ActionType, ActiveFactionType, EffectRewardType } from 'src/app/models';
import { ImperiumCard } from 'src/app/models/imperium-card';
import { CardConfiguratorService } from 'src/app/services/configurators/card-configurator.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogCardEditorComponent } from './dialog-card-editor/dialog-card-editor.component';

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
  public uniqueCardAmount = 0;

  public revealResources: { resourceType: EffectRewardType; amount: number; count: number }[] = [];

  constructor(
    public t: TranslateService,
    public cardConfiguratorService: CardConfiguratorService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cardConfiguratorService.imperiumCards$.subscribe((imperiumCards) => {
      this.imperiumCards = imperiumCards;

      this.totalCardAmount = 0;
      this.uniqueCardAmount = 0;
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

      this.revealResources = [];

      for (const card of imperiumCards) {
        const cardAmount = card.cardAmount ?? 1;
        this.uniqueCardAmount += 1;
        this.totalCardAmount += cardAmount;

        if (card.faction) {
          this.factions[card.faction] += cardAmount;
        } else {
          this.noFactions += cardAmount;
        }

        if (card.fieldAccess) {
          for (const access of card.fieldAccess) {
            this.fieldAccessess[access] += cardAmount;
          }
        }

        if (card.persuasionCosts) {
          this.costs[card.persuasionCosts] += cardAmount;
        }

        let cardHasPersuasion = false;
        if (card.revealEffects) {
          for (const effect of getFlattenedEffectRewardArray(card.revealEffects.filter((x) => isRewardEffect(x)) as any[])) {
            const amount = effect.amount ?? 1;

            const index = this.revealResources.findIndex((x) => x.resourceType === effect.type && x.amount === amount);
            if (index > -1) {
              this.revealResources[index].count += cardAmount;
            } else {
              this.revealResources.push({ resourceType: effect.type, amount, count: cardAmount });
            }

            if (effect.type === 'persuasion') {
              cardHasPersuasion = true;
            }
          }
        }
        if (cardHasPersuasion === false) {
          const index = this.revealResources.findIndex((x) => x.resourceType === 'persuasion' && x.amount === 0);
          if (index > -1) {
            this.revealResources[index].count += cardAmount;
          } else {
            this.revealResources.push({ resourceType: 'persuasion', amount: 0, count: cardAmount });
          }
        }
      }

      this.revealResources = this.revealResources.filter(
        (x) => x.resourceType === 'persuasion' || x.resourceType === 'sword' || x.resourceType.includes('recruitment')
      );
      this.revealResources.sort((a, b) => a.amount - b.amount);
      this.revealResources.sort((a, b) => a.resourceType.localeCompare(b.resourceType));
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
      width: '875px',
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
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.cardConfiguratorService.deleteImperiumCard(id);
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

  public getActionTypePath(actionType: string) {
    return getActionTypePath(actionType as any);
  }

  private createEmptyImperiumCard(): ImperiumCard {
    // Create an empty ImperiumCard object with default values
    return {
      name: { en: '', de: '' },
    };
  }
}
