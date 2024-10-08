import { ActionField } from '../../../models';

export const ixCustomAdvanced: ActionField = {
  title: { de: 'aufrüstung', en: 'upgrade' },
  actionType: 'landsraad',
  costs: [{ type: 'solari', amount: 4 }],
  rewards: [
    { type: 'dreadnought' },
    { type: 'helper-or', width: 10, iconHeight: 55 },
    { type: 'tech-reduced-three' },
    { type: 'combat' },
  ],
  pathToImage: 'assets/images/action-backgrounds/industry_2.png',
  customWidth: 'fit-content',
};
