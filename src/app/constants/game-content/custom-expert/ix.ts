import { ActionField } from '../../../models';

export const ixCustomExpert: ActionField = {
  title: { de: 'Aufrüstung', en: 'Upgrade' },
  actionType: 'landsraad',
  rewards: [],
  conversionOptions: [
    [
      { type: 'solari', amount: 2 },
      { type: 'helper-trade-horizontal', iconHeight: 30, width: 45 },
      { type: 'tech', amount: 3 },
    ],
    [
      { type: 'solari', amount: 4 },
      { type: 'helper-trade-horizontal', iconHeight: 30, width: 45 },
      { type: 'tech', amount: 4 },
    ],
    [{ type: 'solari', amount: 6 }, { type: 'helper-trade-horizontal', iconHeight: 30, width: 45 }, { type: 'dreadnought' }],
  ],
  pathToImage: 'assets/images/action-backgrounds/industry_2.png',
  customWidth: '140px',
  noRowGap: true,
};
