import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'src/app/services/translate-service';
import { MatDialog } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
import { TechTileCard, TechTilesService } from 'src/app/services/tech-tiles.service';
import { DialogTechTileEditorComponent } from './dialog-tech-tile-editor/dialog-tech-tile-editor.component';

@Component({
  selector: 'dune-tech-tile-configurator',
  templateUrl: './tech-tile-configurator.component.html',
  styleUrl: './tech-tile-configurator.component.scss',
})
export class TechTileConfiguratorComponent implements OnInit {
  public techTiles: TechTileCard[] = [];
  public showControls = true;
  public imagePadding = 0;

  constructor(
    public translateService: TranslateService,
    public techTilesService: TechTilesService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.techTilesService.newTechTiles$.subscribe((newTechTiles) => {
      this.techTiles = newTechTiles;
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
      width: '900px',
      data: {
        title: 'Create New Tech Tile',
        techTile: this.createEmptyImperiumCard(),
      },
    });

    dialogRef.afterClosed().subscribe((result: TechTileCard | undefined) => {
      if (result) {
        this.techTilesService.addTechTile(result);
      }
    });
  }

  onDeleteCardClicked(id: string) {
    this.techTilesService.deleteTechTile(id);
  }

  onEditCardClicked(techTile: TechTileCard) {
    const dialogRef = this.dialog.open(DialogTechTileEditorComponent, {
      width: '900px',
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

  private createEmptyImperiumCard(): TechTileCard {
    // Create an empty ImperiumCard object with default values
    return {
      name: { en: '', de: '' },
      costs: 0,
      aiEvaluation: () => 0,
    };
  }
}