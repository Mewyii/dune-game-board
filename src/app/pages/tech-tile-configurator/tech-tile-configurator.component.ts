import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { TechTileCard } from 'src/app/models/tech-tile';
import { TechTileConfiguratorService } from 'src/app/services/configurators/tech-tile-configurator.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogTechTileEditorComponent } from './dialog-tech-tile-editor/dialog-tech-tile-editor.component';

@Component({
    selector: 'dune-tech-tile-configurator',
    templateUrl: './tech-tile-configurator.component.html',
    styleUrl: './tech-tile-configurator.component.scss',
    standalone: false
})
export class TechTileConfiguratorComponent implements OnInit {
  public techTiles: TechTileCard[] = [];
  public showControls = true;
  public imagePadding = 0;

  public totalTechTileAmount = 0;

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

  constructor(public t: TranslateService, public techTilesService: TechTileConfiguratorService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.techTilesService.techTiles$.subscribe((techTiles) => {
      this.totalTechTileAmount = 0;

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

      this.techTiles = techTiles;

      for (const techTile of techTiles) {
        this.totalTechTileAmount++;

        this.costs[techTile.costs]++;
      }
    });
  }

  onExportCardsClicked() {
    const jsonContent = JSON.stringify(this.techTiles, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'tech_tiles.json';
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
      const startingCards = JSON.parse(content) as TechTileCard[];
      // this.techTiles.addStartingCards(startingCards);

      input.value = '';
    };

    reader.readAsText(file);
  }

  onAddCardClicked() {
    const dialogRef = this.dialog.open(DialogTechTileEditorComponent, {
      width: '875px',
      data: {
        title: 'Create New Tech Tile',
        techTile: this.createEmptyTechTile(),
      },
    });

    dialogRef.afterClosed().subscribe((result: TechTileCard | undefined) => {
      if (result) {
        this.techTilesService.addTechTile(result);
      }
    });
  }

  onDeleteCardClicked(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.techTilesService.deleteTechTile(id);
      }
    });
  }

  onEditCardClicked(techTile: TechTileCard) {
    const dialogRef = this.dialog.open(DialogTechTileEditorComponent, {
      width: '875px',
      data: {
        title: 'Edit Tech Tile',
        techTile: techTile,
      },
    });

    dialogRef.afterClosed().subscribe((result: TechTileCard | undefined) => {
      if (result) {
        this.techTilesService.editTechTile(result);
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
    this.techTilesService.sortTechTiles('costs', 'asc');
  }

  private createEmptyTechTile(): TechTileCard {
    // Create an empty ImperiumCard object with default values
    return {
      name: { en: '', de: '' },
      costs: 0,
    };
  }
}
