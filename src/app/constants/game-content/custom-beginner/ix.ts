import { ActionField } from '../../../models';

export const ixCustomBeginner: ActionField = {
  title: { de: 'aufrüstung', en: 'upgrade' },
  actionType: 'landsraad',
  costs: [{ type: 'solari', amount: 5 }],
  rewards: [{ type: 'dreadnought' }],
  pathToImage: 'assets/images/action-backgrounds/industry_2.png',
};
