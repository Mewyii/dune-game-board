import { ActionField } from '../models';

export const ixCustomAdvanced: ActionField = {
  title: { de: 'aufrüstung', en: 'upgrade' },
  actionType: 'landsraad',
  costs: [{ type: 'currency', amount: 4 }],
  rewards: [
    { type: 'dreadnought' },
    { type: 'separator', width: 10, iconHeight: 55 },
    { type: 'tech-reduced-three' },
    { type: 'combat' },
  ],
  pathToImage: 'assets/images/action-backgrounds/industry_2.png',

  hasRewardOptions: true,
  customWidth: 'fit-content',
};
