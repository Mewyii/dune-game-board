import { ActionField } from '../../../models';

export const ixCustomExpert: ActionField = {
  title: { de: 'Aufrüstung', en: 'Upgrade' },
  actionType: 'landsraad',
  costs: [{ type: 'solari', amount: 5 }],
  rewards: [
    { type: 'dreadnought' },
    { type: 'helper-or', width: 10, iconHeight: 55 },
    { type: 'tech-reduced-three' },
    { type: 'combat' },
  ],
  pathToImage: 'assets/images/action-backgrounds/industry_2.png',
  customWidth: 'fit-content',
};
