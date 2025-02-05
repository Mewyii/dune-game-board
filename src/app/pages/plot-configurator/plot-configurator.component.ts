import { Component, OnInit } from '@angular/core';
import { PlotConfiguratorService } from 'src/app/services/configurators/plot-configurator.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogPlotEditorComponent } from './dialog-plot-editor/dialog-plot-editor.component';
import { MatDialog } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
import { ActionType, ActiveFactionType } from 'src/app/models';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ImperiumPlot } from 'src/app/models/imperium-plot';

@Component({
  selector: 'dune-plot-configurator',
  templateUrl: './plot-configurator.component.html',
  styleUrl: './plot-configurator.component.scss',
})
export class PlotConfiguratorComponent {
  public imperiumPlots: ImperiumPlot[] = [];
  public showControls = true;
  public imagePadding = 0;
  public factions: { [type in ActiveFactionType]: number } = {
    emperor: 0,
    guild: 0,
    bene: 0,
    fremen: 0,
  };
  public noFactions = 0;

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

  public totalPlotAmount = 0;

  constructor(
    public t: TranslateService,
    public plotConfiguratorService: PlotConfiguratorService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.plotConfiguratorService.imperiumPlots$.subscribe((imperiumPlots) => {
      this.imperiumPlots = imperiumPlots;

      this.totalPlotAmount = 0;
      this.factions = {
        emperor: 0,
        guild: 0,
        bene: 0,
        fremen: 0,
      };
      this.noFactions = 0;

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

      for (const plot of imperiumPlots) {
        this.totalPlotAmount += plot.cardAmount ?? 1;

        if (plot.faction) {
          this.factions[plot.faction] += 1;
        } else {
          this.noFactions += plot.cardAmount ?? 1;
        }

        if (plot.persuasionCosts) {
          this.costs[plot.persuasionCosts] += plot.cardAmount ?? 1;
        }
      }
    });
  }

  onExportPlotsClicked() {
    const jsonContent = JSON.stringify(this.imperiumPlots, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'imperium_plots.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onImportPlotsClicked(input: HTMLInputElement) {
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
      const imperiumPlots = JSON.parse(content) as ImperiumPlot[];
      this.plotConfiguratorService.addImperiumPlots(imperiumPlots);

      input.value = '';
    };

    reader.readAsText(file);
  }

  onAddPlotClicked() {
    const dialogRef = this.dialog.open(DialogPlotEditorComponent, {
      width: '900px',
      data: {
        title: 'Create New Imperium Plot',
        imperiumPlot: this.createEmptyImperiumPlot(),
      },
    });

    dialogRef.afterClosed().subscribe((result: ImperiumPlot | undefined) => {
      if (result) {
        this.plotConfiguratorService.addImperiumPlot(result);
      }
    });
  }

  onRemovePlotsClicked() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Are you sure you want to remove all plots?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.plotConfiguratorService.setImperiumPlots([]);
      }
    });
  }

  onDeletePlotClicked(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.plotConfiguratorService.deleteImperiumPlot(id);
      }
    });
  }

  onEditPlotClicked(imperiumPlot: ImperiumPlot) {
    const dialogRef = this.dialog.open(DialogPlotEditorComponent, {
      width: '900px',
      data: {
        title: 'Edit Imperium Plot',
        imperiumPlot: imperiumPlot,
      },
    });

    dialogRef.afterClosed().subscribe((result: ImperiumPlot | undefined) => {
      if (result) {
        this.plotConfiguratorService.editImperiumPlot(result);
      }
    });
  }

  onSavePlotClicked(el: HTMLDivElement, name: string) {
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
    this.plotConfiguratorService.sortImperiumPlots('persuasionCosts', 'asc');
  }

  onSortByFactionsClicked() {
    this.plotConfiguratorService.sortImperiumPlots('faction', 'asc');
  }

  private createEmptyImperiumPlot(): ImperiumPlot {
    // Create an empty ImperiumPlot object with default values
    return {
      name: { en: '', de: '' },
    };
  }
}
