import { Injectable, inject } from '@angular/core';
import { cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { Conflict } from 'src/app/models/conflict';
import { SettingsService } from '../settings.service';

export interface ConflictConfiguratorEntry {
  id: string;
  conflict: Conflict;
}

@Injectable({
  providedIn: 'root',
})
export class ConflictConfiguratorService {
  private settingsService = inject(SettingsService);

  private conflictsSubject = new BehaviorSubject<ConflictConfiguratorEntry[]>([]);
  conflicts$ = this.conflictsSubject.asObservable();

  constructor() {
    this.conflictsSubject.next(
      this.settingsService.getConflicts().map((conflict) => ({ id: crypto.randomUUID(), conflict })),
    );
    this.conflicts$.subscribe((conflicts) => {
      this.settingsService.setConflicts(conflicts.map((entry) => entry.conflict));
    });
  }

  get conflicts() {
    return cloneDeep(this.conflictsSubject.value);
  }

  addConflict(conflict: Conflict) {
    this.conflictsSubject.next([...this.conflicts, { id: crypto.randomUUID(), conflict }]);
  }

  editConflict(id: string, conflict: Conflict) {
    this.conflictsSubject.next(this.conflicts.map((entry) => (entry.id === id ? { ...entry, conflict } : entry)));
  }

  deleteConflict(id: string) {
    this.conflictsSubject.next(this.conflicts.filter((entry) => entry.id !== id));
  }

  setConflicts(conflicts: Conflict[]) {
    this.conflictsSubject.next(conflicts.map((conflict) => ({ id: crypto.randomUUID(), conflict })));
  }

  sortConflicts(category: 'name' | 'lvl' | 'boardSpaceId', order: 'asc' | 'desc') {
    const conflicts = this.conflicts;
    conflicts.sort((a, b) => {
      const direction = order === 'asc' ? 1 : -1;
      if (category === 'lvl') {
        return (a.conflict.lvl - b.conflict.lvl) * direction;
      }

      const aValue = category === 'name' ? a.conflict.name.en : (a.conflict.boardSpaceId ?? '');
      const bValue = category === 'name' ? b.conflict.name.en : (b.conflict.boardSpaceId ?? '');
      return aValue.localeCompare(bValue) * direction;
    });
    this.conflictsSubject.next(conflicts);
  }
}
