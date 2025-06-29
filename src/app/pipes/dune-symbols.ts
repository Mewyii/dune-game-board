import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getActionTypePath } from '../helpers/action-types';
import { getEffectTypePath } from '../helpers/reward-types';
import { ActionType, EffectRewardType } from '../models';

@Pipe({
  name: 'duneSymbols',
  standalone: false,
})
export class DuneSymbolsPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, iconSize: string = '18px'): SafeHtml {
    const iconSizeNumber = parseInt(iconSize);
    let returnValue = value;

    const resourceRegExp = /{resource:.*?}/g;
    const resourceStrings = value.matchAll(resourceRegExp);

    for (const resourceString of resourceStrings) {
      const amountRegExp = /;amount:.*?}/g;
      const amountString = resourceString[0].match(amountRegExp);
      if (!amountString) {
        const resource = resourceString[0].substring(10, resourceString[0].length - 1) as EffectRewardType;
        const resourceImgPath = getEffectTypePath(resource);

        returnValue = returnValue.replace(
          resourceString[0],
          '<img style="min-width: ' +
            iconSize +
            ';height: ' +
            iconSize +
            ';object-fit:scale-down; vertical-align: text-bottom' +
            ';filter:drop-shadow(0px 0px 1px rgba(0, 0, 0, 1));" src="' +
            resourceImgPath +
            '"/>'
        );
      } else {
        const amount = amountString[0].substring(8, amountString[0].length - 1);
        const amountNumber = parseInt(amount);

        const resource = resourceString[0].substring(10, resourceString[0].length - amount.length - 9) as EffectRewardType;
        const resourceImgPath = getEffectTypePath(resource);

        const ratioFix = Math.ceil(iconSizeNumber / 3);

        returnValue = returnValue.replace(
          resourceString[0],
          '<div style="position:relative;display:inline-block;color:white;"><img style="min-width: ' +
            iconSize +
            ';height: ' +
            iconSize +
            ';object-fit:scale-down; vertical-align: text-bottom' +
            ';filter:drop-shadow(0px 0px 1px rgba(0, 0, 0, 1));" src="' +
            resourceImgPath +
            '"/><div style="position:absolute;top:0px;left:0px;width:100%' +
            ';height:100%;display:flex;align-items:center;justify-content:center;font-size:' +
            (iconSizeNumber - ratioFix) +
            'px;filter:drop-shadow(0px 0px 1px rgb(0, 0, 0));"><span>' +
            amountNumber +
            '</span></div></div>'
        );
      }
    }

    const factionRegExp = /{faction:.*?}/g;
    const factionStrings = value.matchAll(factionRegExp);

    for (const factionString of factionStrings) {
      const faction = factionString[0].substring(9, factionString[0].length - 1) as ActionType;

      const ratioFix = Math.ceil(iconSizeNumber / 3);

      const factionImgPath = getActionTypePath(faction);
      returnValue = returnValue.replace(
        factionString[0],
        '<img style="min-width:' +
          Math.ceil(iconSizeNumber - ratioFix / 3) +
          'px;height:' +
          Math.ceil(iconSizeNumber - ratioFix / 2) +
          'px;object-fit:scale-down; vertical-align: sub' +
          ';filter:drop-shadow(0px 0px 1px rgba(0, 0, 0, 1));" src="' +
          factionImgPath +
          '"/>'
      );
    }

    return this.sanitizer.bypassSecurityTrustHtml(returnValue);
  }
}
