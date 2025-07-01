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

    const stringParts = value.split(/({(?:resource|faction):.*?})/g); // Teilt den Text inkl. {resource:...} oder {faction:...}

    const transformedParts = stringParts.map((part) => {
      if (part.startsWith('{resource:')) {
        const amountMatch = part.match(/;amount:.*?}/);

        if (!amountMatch) {
          const resource = part.substring(10, part.length - 1) as EffectRewardType;
          const resourceImgPath = getEffectTypePath(resource);
          return `<img style="min-width: ${iconSize};height: ${iconSize};object-fit:scale-down; vertical-align: middle;filter:drop-shadow(0px 0px 1px rgba(0, 0, 0, 1));" src="${resourceImgPath}"/>`;
        } else {
          const amount = amountMatch[0].substring(8, amountMatch[0].length - 1);
          const amountNumber = parseInt(amount);
          const resource = part.substring(10, part.length - amount.length - 9) as EffectRewardType;
          const resourceImgPath = getEffectTypePath(resource);
          const ratioFix = Math.ceil(iconSizeNumber / 3);

          return `<div style="position:relative;display:inline-flex;color:white;width:min-content;vertical-align:middle;height: ${iconSize}">
            <img style="min-width: ${iconSize};height: ${iconSize};object-fit:scale-down; vertical-align: middle;filter:drop-shadow(0px 0px 1px rgba(0, 0, 0, 1));" src="${resourceImgPath}"/>
            <div style="position:absolute;top:0px;left:0px;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:${
              iconSizeNumber - ratioFix
            }px;filter:drop-shadow(0px 0px 1px rgb(0, 0, 0));">
              <span>${amountNumber}</span>
            </div>
          </div>`;
        }
      }

      if (part.startsWith('{faction:')) {
        const faction = part.substring(9, part.length - 1) as ActionType;
        const factionImgPath = getActionTypePath(faction);
        const ratioFix = Math.ceil(iconSizeNumber / 3);

        return `<img style="min-width:${Math.ceil(iconSizeNumber - ratioFix / 3)}px;height:${Math.ceil(
          iconSizeNumber - ratioFix / 2
        )}px;object-fit:scale-down; vertical-align: middle;filter:drop-shadow(0px 0px 1px rgba(0, 0, 0, 1));" src="${factionImgPath}"/>`;
      }

      // Wenn es kein Platzhalter war, also reiner Text
      if (part.length > 0) {
        return `<span style="vertical-align: middle">${part}</span>`;
      }
      return '';
    });

    return this.sanitizer.bypassSecurityTrustHtml(transformedParts.join(''));
  }
}
