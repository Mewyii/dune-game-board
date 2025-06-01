import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Leader } from 'src/app/constants/leaders';
import { LeaderConfiguratorService } from 'src/app/services/configurators/leader.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogLeaderEditorComponent } from './dialog-leader-editor/dialog-leader-editor.component';

@Component({
    selector: 'dune-leader-configurator',
    templateUrl: './leader-configurator.component.html',
    styleUrls: ['./leader-configurator.component.scss'],
    standalone: false
})
export class LeaderConfiguratorComponent {
  public leaders: Leader[] = [];
  public showControls = true;
  public imagePadding = 0;

  constructor(public t: TranslateService, public leadersService: LeaderConfiguratorService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.leadersService.leaders$.subscribe((leaders) => {
      this.leaders = leaders.filter((x) => x.type === 'new') as Leader[];
    });
  }

  onExportCardsClicked() {
    const jsonContent = JSON.stringify(this.leaders, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'leaders.json';

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
      const leaders = JSON.parse(content) as Leader[];
      this.leadersService.setLeaders(leaders);

      input.value = '';
    };

    reader.readAsText(file);
  }

  onAddCardClicked() {
    const dialogRef = this.dialog.open(DialogLeaderEditorComponent, {
      width: '875px',
      data: {
        title: 'Create New Leader',
        leader: this.createEmptyLeader(),
      },
    });
    dialogRef.afterClosed().subscribe((result: Leader | undefined) => {
      if (result) {
        this.leadersService.addLeader(result);
      }
    });
  }

  onDeleteCardClicked(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.leadersService.deleteLeader(id);
      }
    });
  }

  onEditCardClicked(leader: Leader) {
    const dialogRef = this.dialog.open(DialogLeaderEditorComponent, {
      width: '875px',
      data: {
        title: 'Edit Leader',
        leader: leader,
      },
    });
    dialogRef.afterClosed().subscribe((result: Leader | undefined) => {
      if (result) {
        this.leadersService.editLeader(result);
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

  private createEmptyLeader(): Leader {
    // Create an empty Leader object with default values
    return {
      name: { en: '', de: '' },
      type: 'new',
      house: { en: '', de: '' },
      startingResources: [],
      passiveName: { en: '', de: '' },
      passiveDescription: { en: '', de: '' },
      signetName: { en: '', de: '' },
      signetDescription: { en: '', de: '' },
      imageUrl: '',
    };
  }
}
