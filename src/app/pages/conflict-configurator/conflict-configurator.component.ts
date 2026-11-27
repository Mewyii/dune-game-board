import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as htmlToImage from 'html-to-image';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { EffectRewardType } from 'src/app/models';
import { Conflict } from 'src/app/models/conflict';
import {
  ConflictConfiguratorEntry,
  ConflictConfiguratorService,
} from 'src/app/services/configurators/conflict-configurator.service';
import { TranslateService } from 'src/app/services/translate-service';
import { DialogConflictEditorComponent } from './dialog-conflict-editor/dialog-conflict-editor.component';

interface ConflictRewardSummary {
  id: string;
  rewardType: EffectRewardType;
  amount: number;
  count: number;
}

@Component({
  selector: 'dune-conflict-configurator',
  templateUrl: './conflict-configurator.component.html',
  styleUrls: ['./conflict-configurator.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ConflictConfiguratorComponent implements OnInit, OnDestroy {
  t = inject(TranslateService);
  conflictConfiguratorService = inject(ConflictConfiguratorService);
  private dialog = inject(MatDialog);

  private subscription?: Subscription;
  public conflicts: ConflictConfiguratorEntry[] = [];
  public shownConflicts: ConflictConfiguratorEntry[] = [];
  public rewards: ConflictRewardSummary[] = [];
  public activeRewardFilters: string[] = [];
  public activeLevelFilter?: 1 | 2 | 3;
  public showControls = true;
  public imagePadding = 0;
  public levelCounts: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  public readonly levels: (1 | 2 | 3)[] = [1, 2, 3];
  public sortOrder: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.subscription = this.conflictConfiguratorService.conflicts$.subscribe((conflicts) => {
      this.conflicts = conflicts;
      this.updateSummaries();
      this.filterConflicts();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  get totalConflictAmount(): number {
    return this.conflicts.length;
  }

  onExportConflictsClicked(): void {
    const jsonContent = JSON.stringify(
      this.conflicts.map((entry) => entry.conflict),
      null,
      2,
    );
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'conflicts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }

  onImportConflictsClicked(input: HTMLInputElement): void {
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const conflicts = JSON.parse(String(reader.result)) as Conflict[];
        if (!Array.isArray(conflicts)) {
          throw new Error('The imported JSON must contain an array of conflicts.');
        }
        this.conflictConfiguratorService.setConflicts(conflicts);
        input.value = '';
      } catch (error) {
        console.error('Could not import conflicts.', error);
      }
    };
    reader.readAsText(file);
  }

  onAddConflictClicked(): void {
    this.openEditor('Create New Conflict', this.createEmptyConflict());
  }

  onEditConflictClicked(entry: ConflictConfiguratorEntry): void {
    this.openEditor('Edit Conflict', entry.conflict, entry.id);
  }

  onDeleteConflictClicked(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.conflictConfiguratorService.deleteConflict(id);
      }
    });
  }

  onRemoveConflictsClicked(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Are you sure you want to remove all conflicts?' },
    });
    dialogRef.afterClosed().subscribe((result: boolean | undefined) => {
      if (result) {
        this.conflictConfiguratorService.setConflicts([]);
      }
    });
  }

  onSaveConflictClicked(element: HTMLDivElement, name: string): void {
    htmlToImage
      .toPng(element)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${name || 'conflict'}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => console.error(error));
  }

  onToggleControlsClicked(): void {
    this.showControls = !this.showControls;
  }

  onSortByNameClicked(): void {
    this.conflictConfiguratorService.sortConflicts('name', this.getNextSortOrder());
  }

  onSortByLevelClicked(): void {
    this.conflictConfiguratorService.sortConflicts('lvl', this.getNextSortOrder());
  }

  onSortByBoardSpaceClicked(): void {
    this.conflictConfiguratorService.sortConflicts('boardSpaceId', this.getNextSortOrder());
  }

  toggleLevelFilter(level: 1 | 2 | 3): void {
    this.activeLevelFilter = this.activeLevelFilter === level ? undefined : level;
    this.filterConflicts();
  }

  toggleRewardFilter(reward: ConflictRewardSummary): void {
    this.activeRewardFilters = this.activeRewardFilters.includes(reward.id)
      ? this.activeRewardFilters.filter((id) => id !== reward.id)
      : [...this.activeRewardFilters, reward.id];
    this.filterConflicts();
  }

  isRewardFilterActive(id: string): boolean {
    return this.activeRewardFilters.length === 0 || this.activeRewardFilters.includes(id);
  }

  private openEditor(title: string, conflict: Conflict, id?: string): void {
    const dialogRef = this.dialog.open(DialogConflictEditorComponent, {
      width: '900px',
      data: { title, conflict },
    });
    dialogRef.afterClosed().subscribe((result: Conflict | undefined) => {
      if (!result) {
        return;
      }
      if (id) {
        this.conflictConfiguratorService.editConflict(id, result);
      } else {
        this.conflictConfiguratorService.addConflict(result);
      }
    });
  }

  private createEmptyConflict(): Conflict {
    return {
      name: { en: '', de: '' },
      lvl: 1,
      rewards: [[], [], []],
    };
  }

  private updateSummaries(): void {
    this.levelCounts = { 1: 0, 2: 0, 3: 0 };
    const rewardCounts = new Map<string, ConflictRewardSummary>();

    for (const entry of this.conflicts) {
      this.levelCounts[entry.conflict.lvl] += 1;
      const rewardsInConflict = new Set<string>();
      for (const rankRewards of entry.conflict.rewards) {
        for (const reward of rankRewards) {
          const amount = reward.amount ?? 1;
          const id = `${reward.type}:${amount}`;
          if (rewardsInConflict.has(id)) {
            continue;
          }
          rewardsInConflict.add(id);

          const existing = rewardCounts.get(id);
          if (existing) {
            existing.count += 1;
          } else {
            rewardCounts.set(id, {
              id,
              rewardType: reward.type,
              amount,
              count: 1,
            });
          }
        }
      }
    }

    this.rewards = [...rewardCounts.values()].sort(
      (a, b) => a.rewardType.localeCompare(b.rewardType) || a.amount - b.amount,
    );
  }

  private filterConflicts(): void {
    this.shownConflicts = this.conflicts.filter((entry) => {
      if (this.activeLevelFilter && entry.conflict.lvl !== this.activeLevelFilter) {
        return false;
      }
      if (this.activeRewardFilters.length === 0) {
        return true;
      }
      return entry.conflict.rewards.some((rankRewards) =>
        rankRewards.some((reward) => this.activeRewardFilters.includes(`${reward.type}:${reward.amount ?? 1}`)),
      );
    });
  }

  private getNextSortOrder(): 'asc' | 'desc' {
    const order = this.sortOrder;
    this.sortOrder = order === 'asc' ? 'desc' : 'asc';
    return order;
  }
}
