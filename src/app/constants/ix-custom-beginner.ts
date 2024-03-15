import { ActionField } from '../models';

export const ixCustomBeginner: ActionField = {
  title: { de: 'aufrüstung', en: 'upgrade' },
  actionType: 'landsraad',
  costs: [{ type: 'currency', amount: 4 }],
  rewards: [{ type: 'dreadnought' }, { type: 'combat' }],
  pathToImage: 'assets/images/action-backgrounds/industry_2.png',
};
