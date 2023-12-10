import { Pipe, PipeTransform } from '@angular/core';
import { getRewardTypePath } from '../helpers/reward-types';
import { FactionType, RewardType } from '../models';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getFactionTypePath } from '../helpers/faction-types';

@Pipe({ name: 'duneSymbols' })
export class DuneSymbolsPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    let returnValue = value;

    const resourceRegExp = /{resource:.*?}/g;
    const resourceStrings = value.matchAll(resourceRegExp);

    for (const resourceString of resourceStrings) {
      const resource = resourceString[0].substring(10, resourceString[0].length - 1) as RewardType;
      const resouceImgPath = getRewardTypePath(resource);
      returnValue = returnValue.replace(
        resourceString[0],
        '<img style="min-width: 16px;height: 16px;object-fit:scale-down; margin-bottom:-3px" src="' + resouceImgPath + '"/>'
      );
    }

    const factionRegExp = /{faction:.*?}/g;
    const factionStrings = value.matchAll(factionRegExp);

    for (const factionString of factionStrings) {
      const faction = factionString[0].substring(9, factionString[0].length - 1) as FactionType;
      const factionImgPath = getFactionTypePath(faction);
      returnValue = returnValue.replace(
        factionString[0],
        '<img style="min-width: 14px;height: 14px;object-fit:scale-down; margin-bottom:-2px" src="' + factionImgPath + '"/>'
      );
    }

    return this.sanitizer.bypassSecurityTrustHtml(returnValue);
  }
}
