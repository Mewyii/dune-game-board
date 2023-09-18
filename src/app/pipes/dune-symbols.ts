import { Pipe, PipeTransform } from '@angular/core';
import { getRewardTypePath } from '../helpers/reward-types';
import { RewardType } from '../models';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'duneSymbols' })
export class DuneSymbolsPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    let returnValue = value;

    const regExp = /{resource:.*?}/g;
    const resourceStrings = value.matchAll(regExp);

    for (const resourceString of resourceStrings) {
      const resource = resourceString[0].substring(10, resourceString[0].length - 1) as RewardType;
      const resouceImgPath = getRewardTypePath(resource);
      returnValue = returnValue.replace(
        resourceString[0],
        '<img style="min-width: 16px;height: 16px;object-fit:scale-down; margin-bottom:-3px" src="' + resouceImgPath + '"/>'
      );
    }

    return this.sanitizer.bypassSecurityTrustHtml(returnValue);
  }
}
