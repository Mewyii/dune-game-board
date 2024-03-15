import { Pipe, PipeTransform } from '@angular/core';
import { getRewardTypePath } from '../helpers/reward-types';
import { ActionType, FactionType, RewardType } from '../models';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getFactionTypePath } from '../helpers/faction-types';
import { getActionTypePath } from '../helpers/action-types';

@Pipe({ name: 'duneSymbols' })
export class DuneSymbolsPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, iconSize: string = '16px'): SafeHtml {
    const iconSizeNumber = parseInt(iconSize);
    let returnValue = value;

    const resourceRegExp = /{resource:.*?}/g;
    const resourceStrings = value.matchAll(resourceRegExp);

    for (const resourceString of resourceStrings) {
      const amountRegExp = /;amount:.*?}/g;
      const amountString = resourceString[0].match(amountRegExp);
      if (!amountString) {
        const resource = resourceString[0].substring(10, resourceString[0].length - 1) as RewardType;
        const resourceImgPath = getRewardTypePath(resource);

        returnValue = returnValue.replace(
          resourceString[0],
          '<img style="min-width: ' +
            iconSize +
            ';height: ' +
            iconSize +
            ';object-fit:scale-down; margin-bottom:-3px" src="' +
            resourceImgPath +
            '"/>'
        );
      } else {
        const amount = amountString[0].substring(8, amountString[0].length - 1);
        const amountNumber = parseInt(amount);

        const resource = resourceString[0].substring(10, resourceString[0].length - amount.length - 9) as RewardType;
        const resourceImgPath = getRewardTypePath(resource);

        const ratioFix = iconSizeNumber / 3;

        returnValue = returnValue.replace(
          resourceString[0],
          '<div style="position:relative;display:inline-block"><img style="min-width: ' +
            iconSize +
            ';height: ' +
            iconSize +
            ';object-fit:scale-down; margin-bottom:-3px" src="' +
            resourceImgPath +
            '"/><div style="position:absolute;top:0px;left:0px;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:' +
            (iconSizeNumber - ratioFix) +
            'px;filter:drop-shadow(0px 0px 2px rgb(0, 0, 0));"><span>' +
            amountNumber +
            '</span></div></div>'
        );
      }
    }

    const factionRegExp = /{faction:.*?}/g;
    const factionStrings = value.matchAll(factionRegExp);

    for (const factionString of factionStrings) {
      const faction = factionString[0].substring(9, factionString[0].length - 1) as ActionType;

      const ratioFix = iconSizeNumber / 5;

      const factionImgPath = getActionTypePath(faction);
      returnValue = returnValue.replace(
        factionString[0],
        '<img style="min-width:' +
          (iconSizeNumber - ratioFix) +
          'px;height:' +
          (iconSizeNumber - ratioFix) +
          'px;object-fit:scale-down; margin-bottom:-2px" src="' +
          factionImgPath +
          '"/>'
      );
    }

    return this.sanitizer.bypassSecurityTrustHtml(returnValue);
  }
}
