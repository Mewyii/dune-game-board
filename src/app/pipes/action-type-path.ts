import { Pipe, PipeTransform } from '@angular/core';
import { ACTION_TYPE_PATHS } from '../helpers/action-types';
import { ActionType } from '../models';

@Pipe({
  name: 'actionTypePath',
  standalone: false,
  pure: true,
})
export class ActionTypePathPipe implements PipeTransform {
  transform(type: ActionType): string {
    return ACTION_TYPE_PATHS[type] ?? '';
  }
}
