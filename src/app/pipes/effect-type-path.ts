import { Pipe, PipeTransform } from '@angular/core';
import { EFFECT_TYPE_PATHS } from '../helpers/reward-types';
import { EffectType } from '../models';

@Pipe({
  name: 'effectTypePath',
  standalone: false,
  pure: true,
})
export class EffectTypePathPipe implements PipeTransform {
  transform(type: EffectType): string {
    return EFFECT_TYPE_PATHS[type] ?? '';
  }
}
