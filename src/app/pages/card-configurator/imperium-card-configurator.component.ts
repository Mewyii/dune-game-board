import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { getActionTypePath } from 'src/app/helpers/action-types';
import { getFlattenedEffectRewardArray, isRewardEffect } from 'src/app/helpers/rewards';
import { ActionType, ActiveFactionType, Effect, EffectReward, EffectRewardType } from 'src/app/models';
import { ImperiumCard } from 'src/app/models/imperium-card';
import { CardConfiguratorService } from 'src/app/services/configurators/card-configurator.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogCardEditorComponent } from './dialog-card-editor/dialog-card-editor.component';

@Component({
  selector: 'dune-card-configurator',
  templateUrl: './imperium-card-configurator.component.html',
  styleUrls: ['./imperium-card-configurator.component.scss'],
  standalone: false,
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

  public infiltrationAmount = 0;

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

  public resources: { id: string; resourceType: EffectRewardType; amount: number; count: number }[] = [];
  public activeFilters: { id: string; resourceType: EffectRewardType; amount: number; count: number }[] = [];

  public shownCardAmount = 0;
  public shownCards: ImperiumCard[] = [];

  constructor(
    public t: TranslateService,
    public cardConfiguratorService: CardConfiguratorService,
    private dialog: MatDialog,
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

      this.infiltrationAmount = 0;

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

      this.resources = this.resources.map((x) => ({ ...x, count: 0 }));

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
          if (card.canInfiltrate) {
            this.infiltrationAmount += cardAmount;
          }
        }

        if (card.persuasionCosts) {
          this.costs[card.persuasionCosts] += cardAmount;
        }

        let cardHasPersuasion = false;
        if (card.buyEffects) {
          for (const effect of getFlattenedEffectRewardArray(card.buyEffects.filter((x) => isRewardEffect(x)) as any[])) {
            const amount = effect.amount ?? 1;

            const index = this.resources.findIndex((x) => x.resourceType === effect.type && x.amount === amount);
            if (index > -1) {
              this.resources[index].count += cardAmount;
            } else {
              this.resources.push({ id: crypto.randomUUID(), resourceType: effect.type, amount, count: cardAmount });
            }
          }
        }
        if (card.agentEffects) {
          let rewards = this.getEffectRewardsOnly(card.agentEffects);

          for (const reward of rewards) {
            const amount = reward.amount ?? 1;

            const index = this.resources.findIndex((x) => x.resourceType === reward.type && x.amount === amount);
            if (index > -1) {
              this.resources[index].count += cardAmount;
            } else {
              this.resources.push({ id: crypto.randomUUID(), resourceType: reward.type, amount, count: cardAmount });
            }
          }
        }
        if (card.revealEffects) {
          let rewards = this.getEffectRewardsOnly(card.revealEffects);
          for (const reward of rewards) {
            const amount = reward.amount ?? 1;

            const index = this.resources.findIndex((x) => x.resourceType === reward.type && x.amount === amount);
            if (index > -1) {
              this.resources[index].count += cardAmount;
            } else {
              this.resources.push({ id: crypto.randomUUID(), resourceType: reward.type, amount, count: cardAmount });
            }

            if (reward.type === 'persuasion') {
              cardHasPersuasion = true;
            }
          }
        }
        if (cardHasPersuasion === false) {
          const index = this.resources.findIndex((x) => x.resourceType === 'persuasion' && x.amount === 0);
          if (index > -1) {
            this.resources[index].count += cardAmount;
          } else {
            this.resources.push({ id: crypto.randomUUID(), resourceType: 'persuasion', amount: 0, count: cardAmount });
          }
        }
      }

      this.resources = this.resources.filter((x) => x.count > 0);
      this.resources.sort((a, b) => a.amount - b.amount);
      this.resources.sort((a, b) => a.resourceType.localeCompare(b.resourceType));
      this.filterImperiumCards();
    });
  }

  filterImperiumCards() {
    if (this.activeFilters.length < 1) {
      this.shownCards = this.imperiumCards;
      return;
    } else {
      let shownCardAmount = 0;

      this.shownCards = this.imperiumCards.filter((card) => {
        let showCard = false;

        if (card.buyEffects) {
          const rewards = getFlattenedEffectRewardArray(card.buyEffects.filter((x) => isRewardEffect(x)));

          for (const reward of rewards) {
            const amount = reward.amount ?? 1;
            if (this.activeFilters.some((x) => x.resourceType === reward.type && x.amount === amount)) {
              showCard = true;
            }
          }
        }
        if (card.agentEffects) {
          let rewards = this.getEffectRewardsOnly(card.agentEffects);

          for (const reward of rewards) {
            const amount = reward.amount ?? 1;
            if (this.activeFilters.some((x) => x.resourceType === reward.type && x.amount === amount)) {
              showCard = true;
            }
          }
        }
        if (card.revealEffects) {
          let rewards = this.getEffectRewardsOnly(card.revealEffects);

          let hasPersuasion = false;
          for (const reward of rewards) {
            const amount = reward.amount ?? 1;
            if (this.activeFilters.some((x) => x.resourceType === reward.type && x.amount === amount)) {
              showCard = true;
            }
            if (reward.type === 'persuasion') {
              hasPersuasion = true;
            }
          }
          if (hasPersuasion === false) {
            if (this.activeFilters.some((x) => x.resourceType === 'persuasion' && x.amount === 0)) {
              showCard = true;
            }
          }
        }
        if (showCard) {
          shownCardAmount += card.cardAmount ?? 1;
        }

        return showCard;
      });

      this.shownCardAmount = shownCardAmount;
    }
  }

  toggleActiveFilter(resource: { id: string; resourceType: EffectRewardType; amount: number; count: number }) {
    if (this.activeFilters.some((x) => x.id === resource.id)) {
      this.activeFilters = this.activeFilters.filter((x) => !(x.id === resource.id));
    } else {
      this.activeFilters.push(resource);
    }

    this.filterImperiumCards();
  }

  isFilterActive(itemId: string): boolean {
    return this.activeFilters.length < 1 || this.activeFilters.some((x) => x.id === itemId);
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
    return {
      name: { en: '', de: '' },
    };
  }

  private getEffectRewardsOnly(cardEffects: Effect[]): EffectReward[] {
    let rewards: EffectReward[] = [];

    const tradeIndex = cardEffects.findIndex((x) => x.type === 'helper-trade');
    const choiceIndex = cardEffects.findIndex((x) => x.type === 'helper-or');
    const seperatorIndex = cardEffects.findIndex((x) => x.type === 'helper-separator');
    if (tradeIndex < 0 && seperatorIndex < 0) {
      rewards = getFlattenedEffectRewardArray(cardEffects.filter((x) => isRewardEffect(x)));
    } else if (seperatorIndex > -1) {
      const firstPart = cardEffects.slice(0, seperatorIndex);
      const secondPart = cardEffects.slice(seperatorIndex + 1);

      const firstPartTradeIndex = firstPart.findIndex((x) => x.type === 'helper-trade');
      if (firstPartTradeIndex < 0) {
        rewards.push(...getFlattenedEffectRewardArray(firstPart.filter((x) => isRewardEffect(x))));
      } else {
        rewards.push(
          ...getFlattenedEffectRewardArray(firstPart.slice(0, firstPartTradeIndex).filter((x) => isRewardEffect(x))),
        );
      }

      const secondPartTradeIndex = secondPart.findIndex((x) => x.type === 'helper-trade');
      if (secondPartTradeIndex < 0) {
        rewards.push(...getFlattenedEffectRewardArray(secondPart.filter((x) => isRewardEffect(x))));
      } else {
        rewards.push(
          ...getFlattenedEffectRewardArray(secondPart.slice(0, secondPartTradeIndex).filter((x) => isRewardEffect(x))),
        );
      }
    } else if (choiceIndex > -1) {
      const firstPart = cardEffects.slice(0, choiceIndex);
      const secondPart = cardEffects.slice(choiceIndex + 1);

      const firstPartTradeIndex = firstPart.findIndex((x) => x.type === 'helper-trade');
      if (firstPartTradeIndex < 0) {
        rewards.push(...getFlattenedEffectRewardArray(firstPart.filter((x) => isRewardEffect(x))));
      } else {
        rewards.push(
          ...getFlattenedEffectRewardArray(firstPart.slice(0, firstPartTradeIndex).filter((x) => isRewardEffect(x))),
        );
      }

      const secondPartTradeIndex = secondPart.findIndex((x) => x.type === 'helper-trade');
      if (secondPartTradeIndex < 0) {
        rewards.push(...getFlattenedEffectRewardArray(secondPart.filter((x) => isRewardEffect(x))));
      } else {
        rewards.push(
          ...getFlattenedEffectRewardArray(secondPart.slice(0, secondPartTradeIndex).filter((x) => isRewardEffect(x))),
        );
      }
    } else if (tradeIndex > -1) {
      rewards = getFlattenedEffectRewardArray(cardEffects.slice(tradeIndex + 1).filter((x) => isRewardEffect(x)));
    }

    return rewards;
  }
}
