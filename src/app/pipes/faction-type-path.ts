import { Pipe, PipeTransform } from '@angular/core';
import { FACTION_TYPE_PATHS } from '../helpers/faction-types';
import { FactionType } from '../models';

@Pipe({
  name: 'factionTypePath',
  standalone: false,
  pure: true,
})
export class FactionTypePathPipe implements PipeTransform {
  transform(type: FactionType): string {
    return FACTION_TYPE_PATHS[type] ?? '';
  }
}
